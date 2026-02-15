import Phaser from 'phaser';
import { gameSettings, setPlayerRole } from '../data/gameSettings';
import { getLevelDefinition, getNextLevelId } from '../data/levels';
import { BossSpud } from '../entities/BossSpud';
import { PlayerController } from '../entities/PlayerController';
import type { HazardDefinition } from '../types/hazard';
import type { GroundDangerType, LevelDefinition, SpringDefinition } from '../types/level';
import type { PlayerState } from '../types/player';
import type { PlayableRole } from '../data/gameSettings';
import { Hud } from '../ui/Hud';

interface PatrolHazard {
  sprite: Phaser.Physics.Arcade.Sprite;
  minX: number;
  maxX: number;
  speed: number;
}

interface FirePlantActor {
  sprite: Phaser.GameObjects.Sprite;
  timer: Phaser.Time.TimerEvent;
  projectileSpeed: number;
  sourceHazard: HazardDefinition;
}

const clampToNumber = (value: number | string | boolean | undefined, fallback: number): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  return fallback;
};

const pickBackgroundPalette = (backgroundKey: string): { base: number; haze: number; top: number } => {
  switch (backgroundKey) {
    case 'bg-volcano-noon':
      return { base: 0x593328, haze: 0xc16443, top: 0x8f4b2f };
    case 'bg-golden-dusk':
      return { base: 0x3a274f, haze: 0xca9555, top: 0x78533f };
    default:
      return { base: 0x29466e, haze: 0x5d96b8, top: 0x3a6087 };
  }
};

export class BaseLevelScene extends Phaser.Scene {
  private levelId = 'level-1';

  private playerRole: PlayableRole = 'monkey';

  private levelDef!: LevelDefinition;

  private player!: Phaser.Physics.Arcade.Sprite;

  private playerController!: PlayerController;

  private playerState!: PlayerState;

  private hud!: Hud;

  private platformGroup!: Phaser.Physics.Arcade.StaticGroup;

  private hazardGroup!: Phaser.Physics.Arcade.Group;

  private springGroup!: Phaser.Physics.Arcade.StaticGroup;

  private checkpointGroup!: Phaser.Physics.Arcade.StaticGroup;

  private groundDangerGroup!: Phaser.Physics.Arcade.StaticGroup;

  private goalSprite!: Phaser.GameObjects.Sprite;

  private goalZone!: Phaser.GameObjects.Zone;

  private goalSparkleEmitter: Phaser.GameObjects.Particles.ParticleEmitter | null = null;

  private patrolHazards: PatrolHazard[] = [];

  private fallingSpawnerEvents: Phaser.Time.TimerEvent[] = [];

  private firePlantActors: FirePlantActor[] = [];

  private checkpointById: Map<string, Phaser.Physics.Arcade.Sprite> = new Map();

  private activeCheckpointId: string | null = null;

  private cutsceneActive = false;

  private levelFinished = false;

  private bossCutsceneTriggered = false;

  private scenePaused = false;

  private pauseKey!: Phaser.Input.Keyboard.Key;

  private restartKey!: Phaser.Input.Keyboard.Key;

  private skipLevelKey!: Phaser.Input.Keyboard.Key;

  private secretLevelKey!: Phaser.Input.Keyboard.Key;

  private chaseBoss: BossSpud | null = null;

  private springControlLockUntil = 0;

  private springCooldownUntil = 0;

  private groundDangerDeathMessage = 'You fell! Respawning at checkpoint...';

  private secretHintLabel: Phaser.GameObjects.Text | null = null;

  private secretHintLeftArrow: Phaser.GameObjects.Triangle | null = null;

  private secretHintRightArrow: Phaser.GameObjects.Triangle | null = null;

  public constructor() {
    super('LevelScene');
  }

  private getSpeedMultiplier(): number {
    return Math.max(1, gameSettings.speedMultiplier);
  }

  private getRainMultiplier(): number {
    if (!gameSettings.impossibleModeEnabled) {
      return 1;
    }

    return Math.max(1, gameSettings.impossibleRainMultiplier);
  }

  public init(data: { levelId?: string; playerRole?: PlayableRole }): void {
    this.levelId = data.levelId ?? 'level-1';
    this.playerRole = data.playerRole ?? gameSettings.playerRole;
    setPlayerRole(this.playerRole);
  }

  public create(): void {
    this.physics.world.gravity.y = 1200 * this.getSpeedMultiplier();
    this.levelDef = getLevelDefinition(this.levelId);
    this.loadLevel(this.levelDef);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupSceneObjects();
    });
  }

  public update(time: number, delta: number): void {
    this.updateSecretHintVisibility();

    if (Phaser.Input.Keyboard.JustDown(this.pauseKey) && !this.levelFinished) {
      this.togglePause();
      return;
    }

    if (this.scenePaused) {
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.restartKey)) {
      this.scene.restart({ levelId: this.levelDef.id, playerRole: this.playerRole });
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.secretLevelKey)) {
      this.scene.start('SecretBossScene', { playerRole: 'spud' });
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.skipLevelKey)) {
      this.skipCurrentLevel();
      return;
    }

    if (this.cutsceneActive || this.levelFinished) {
      return;
    }

    if (time >= this.springControlLockUntil) {
      this.playerController.update(time);
    }
    this.updatePatrolHazards(delta);
    this.updateFirePlantFacing();
    this.updateAutoScroll(delta);
    this.cleanupOutOfBoundsHazards();

    if (this.player.y > this.levelDef.worldHeight + 140) {
      this.handleDeathAndCheckpointRespawn(this.groundDangerDeathMessage);
      return;
    }

    if (this.playerState.isInvulnerable && time >= this.playerState.invulnerableUntil) {
      this.playerState.isInvulnerable = false;
      this.player.clearTint();
    }
  }

  public loadLevel(def: LevelDefinition): void {
    this.levelDef = def;
    this.cutsceneActive = false;
    this.levelFinished = false;
    this.bossCutsceneTriggered = false;
    this.scenePaused = false;
    this.activeCheckpointId = null;
    this.springControlLockUntil = 0;
    this.springCooldownUntil = 0;

    this.playerState = {
      hearts: 3,
      maxHearts: 3,
      isInvulnerable: false,
      invulnerableUntil: 0,
      lastCheckpoint: {
        x: def.playerSpawn.x,
        y: def.playerSpawn.y,
      },
      isAlive: true,
    };

    this.renderBackground(def);

    this.platformGroup = this.physics.add.staticGroup();
    this.hazardGroup = this.physics.add.group();
    this.springGroup = this.physics.add.staticGroup();
    this.checkpointGroup = this.physics.add.staticGroup();
    this.groundDangerGroup = this.physics.add.staticGroup();

    this.createGroundDanger(def);
    this.createPlatforms(def);
    this.createGoal(def);
    this.createPlayer(def);
    this.createCheckpoints(def);
    this.createSprings(def.springs);
    this.registerHazards();
    this.createHud(def);
    this.createSecretHint(def);
    this.bindControlKeys();
    this.bindGameplayCollisions();
    this.configureCamera(def);
    this.updateSecretHintVisibility();

    if (def.autoScroll?.enabled) {
      if (this.playerRole === 'monkey') {
        this.spawnChaseBoss();
        this.hud.showBanner(this, 'Keep moving. The yellow spud is chasing you!', 1300);
      } else {
        this.hud.showBanner(this, 'Spud run: sprint for the golden banana!', 1300);
      }
    } else {
      if (this.playerRole === 'monkey') {
        this.hud.showBanner(this, 'Reach the golden banana.', 1100);
      } else {
        this.hud.showBanner(this, 'Spud run: steal the golden banana!', 1100);
      }
    }
  }

  public registerHazards(): void {
    this.levelDef.hazards.forEach((hazard) => {
      if (hazard.type === 'falling') {
        this.registerFallingHazard(hazard);
      }

      if (hazard.type === 'boulder' || hazard.type === 'snail') {
        this.registerPatrolHazard(hazard);
      }

      if (hazard.type === 'firePlant') {
        this.registerFirePlant(hazard);
      }
    });
  }

  public handlePlayerHit(damage = 1): void {
    if (this.levelFinished || this.cutsceneActive || !this.playerState.isAlive) {
      return;
    }

    const now = this.time.now;
    if (this.playerState.isInvulnerable && now < this.playerState.invulnerableUntil) {
      return;
    }

    const resolvedDamage = Math.max(1, Math.floor(damage));
    this.playerState.hearts = Math.max(0, this.playerState.hearts - resolvedDamage);
    this.hud.updateHearts(this.playerState.hearts, this.playerState.maxHearts);

    if (this.playerState.hearts <= 0) {
      this.handleDeathAndCheckpointRespawn('Out of hearts. Respawning at checkpoint...');
      return;
    }

    this.playerState.isInvulnerable = true;
    this.playerState.invulnerableUntil = now + 1350;
    this.player.setTint(0xff8f8f);
  }

  public respawnAtCheckpoint(): void {
    const spawnPoint = this.playerState.lastCheckpoint;
    this.player.setPosition(spawnPoint.x, spawnPoint.y);
    this.player.setVelocity(0, 0);

    if (this.levelDef.autoScroll?.enabled) {
      const desiredScroll = Math.max(0, spawnPoint.x - this.scale.width * 0.35);
      this.cameras.main.scrollX = desiredScroll;
      const minX = this.cameras.main.scrollX + 110;
      this.player.x = Math.max(this.player.x, minX);
    }
  }

  private handleDeathAndCheckpointRespawn(message: string): void {
    if (this.levelFinished || this.cutsceneActive || !this.playerState.isAlive) {
      return;
    }

    this.playerState.isAlive = false;
    this.playerState.hearts = 0;
    this.playerState.isInvulnerable = false;
    this.playerState.invulnerableUntil = 0;
    this.playerController.isInputEnabled = false;
    this.player.setTint(0xff6262);
    this.player.setVelocity(0, 0);
    this.hud.updateHearts(this.playerState.hearts, this.playerState.maxHearts);
    this.hud.showBanner(this, message, 500);

    this.time.delayedCall(850, () => {
      this.respawnAtCheckpoint();
      this.playerState.hearts = this.playerState.maxHearts;
      this.playerState.isAlive = true;
      this.playerState.isInvulnerable = true;
      this.playerState.invulnerableUntil = this.time.now + 1100;
      this.playerController.isInputEnabled = true;
      this.player.setTint(0xff8f8f);
      this.hud.updateHearts(this.playerState.hearts, this.playerState.maxHearts);
    });
  }

  private startNextLevelOrWin(): void {
    const nextLevelId = getNextLevelId(this.levelDef.id, this.playerRole);
    if (nextLevelId) {
      this.scene.start('LevelScene', { levelId: nextLevelId, playerRole: this.playerRole });
      return;
    }

    this.scene.start('WinScene', { playerRole: this.playerRole });
  }

  public triggerBossCutscene(): void {
    if (!this.levelDef.bossEvent || this.bossCutsceneTriggered || this.levelFinished || this.playerRole !== 'monkey') {
      return;
    }

    this.bossCutsceneTriggered = true;
    this.cutsceneActive = true;
    this.playerController.isInputEnabled = false;
    this.player.setVelocity(0, 0);
    this.stopGoalEffects();

    const bossEvent = this.levelDef.bossEvent;
    const boss = new BossSpud(this, this.goalSprite.x + 320, this.goalSprite.y - 80, false);
    this.hud.showBanner(this, 'Yellow Spud stole the banana!', 1300);

    boss.enterAndSteal(
      this.goalSprite,
      this.goalSprite.x + 25,
      this.goalSprite.y - 10,
      this.goalSprite.x + 560,
      this.goalSprite.y - 130,
      bossEvent.cutsceneDurationMs,
      () => {
        boss.destroy();
        this.scene.start('LevelScene', { levelId: bossEvent.nextLevelId, playerRole: this.playerRole });
      },
    );
  }

  public completeLevel(): void {
    if (this.levelFinished) {
      return;
    }

    this.levelFinished = true;
    this.cutsceneActive = true;
    this.playerController.isInputEnabled = false;
    this.player.setVelocity(0, 0);
    this.stopGoalEffects();

    const bannerText = this.playerRole === 'monkey' ? 'Golden banana recovered!' : 'Spud secured the golden prize!';
    this.hud.showBanner(this, bannerText, 1600);

    const confetti = this.add.particles(0, -30, 'tx_confetti', {
      speedY: { min: 160, max: 330 },
      speedX: { min: -85, max: 85 },
      lifespan: 2400,
      quantity: 5,
      scale: { start: 0.9, end: 0.25 },
      rotate: { min: 0, max: 360 },
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, 0),
        quantity: 36,
      },
      gravityY: 220,
      blendMode: 'ADD',
    });

    confetti.setDepth(2000).setScrollFactor(0);

    this.time.delayedCall(3400, () => {
      confetti.stop();
      confetti.destroy();
      this.startNextLevelOrWin();
    });
  }

  private renderBackground(def: LevelDefinition): void {
    const palette = pickBackgroundPalette(def.backgroundKey);

    this.add
      .rectangle(def.worldWidth / 2, def.worldHeight / 2, def.worldWidth, def.worldHeight, palette.base)
      .setDepth(-40);

    this.add
      .image(def.worldWidth / 2, def.worldHeight / 2, 'tx_backdrop')
      .setDisplaySize(def.worldWidth, def.worldHeight)
      .setAlpha(0.55)
      .setTint(palette.top)
      .setDepth(-36);

    this.add
      .rectangle(def.worldWidth / 2, def.worldHeight / 2, def.worldWidth, def.worldHeight, palette.haze, 0.18)
      .setDepth(-34);

    for (let i = 0; i < 22; i += 1) {
      this.add
        .ellipse(
          Phaser.Math.Between(20, def.worldWidth - 20),
          Phaser.Math.Between(90, def.worldHeight - 120),
          Phaser.Math.Between(120, 300),
          Phaser.Math.Between(40, 120),
          0xffffff,
          Phaser.Math.FloatBetween(0.05, 0.12),
        )
        .setDepth(-33);
    }
  }

  private createGroundDanger(def: LevelDefinition): void {
    const stripHeight = 86;
    const segmentWidth = 128;
    const centerY = def.worldHeight - stripHeight / 2;
    const textureKey = this.getGroundDangerTextureKey(def.groundDanger.type);
    this.groundDangerDeathMessage = this.getGroundDangerDeathMessage(def.groundDanger.type);

    const segmentCount = Math.ceil(def.worldWidth / segmentWidth);
    for (let i = 0; i < segmentCount; i += 1) {
      const x = segmentWidth / 2 + i * segmentWidth;
      const segment = this.groundDangerGroup.create(x, centerY, textureKey) as Phaser.Physics.Arcade.Sprite;
      segment.setDisplaySize(segmentWidth, stripHeight);
      segment.setDepth(8);
      segment.refreshBody();
    }
  }

  private createPlatforms(def: LevelDefinition): void {
    def.platforms.forEach((platform) => {
      const platformSprite = this.platformGroup.create(platform.x, platform.y, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
      platformSprite.setDisplaySize(platform.width, platform.height);
      platformSprite.refreshBody();
      platformSprite.setDepth(10);
    });
  }

  private getGroundDangerTextureKey(type: GroundDangerType): string {
    if (type === 'lava') {
      return 'tx_ground_lava';
    }

    if (type === 'fire') {
      return 'tx_ground_fire';
    }

    return 'tx_ground_spikes';
  }

  private getGroundDangerDeathMessage(type: GroundDangerType): string {
    if (type === 'lava') {
      return 'You fell into lava! Respawning at checkpoint...';
    }

    if (type === 'fire') {
      return 'You fell into fire! Respawning at checkpoint...';
    }

    return 'You fell on spikes! Respawning at checkpoint...';
  }

  private getFallingRainTextureKey(type: GroundDangerType): string {
    if (type === 'lava') {
      return 'tx_falling_lava';
    }

    if (type === 'fire') {
      return 'tx_falling_fire';
    }

    return 'tx_falling_spikes';
  }

  private getFallingRainWarningColor(type: GroundDangerType): number {
    if (type === 'lava') {
      return 0xff8731;
    }

    if (type === 'fire') {
      return 0xffb14e;
    }

    return 0xd4dde8;
  }

  private createGoal(def: LevelDefinition): void {
    const goalTexture = def.goalTextureKey ?? 'tx_goal';
    this.goalSprite = this.add.sprite(def.goal.x, def.goal.y, goalTexture).setDepth(16);
    this.goalSprite.setScale(1);

    this.tweens.add({
      targets: this.goalSprite,
      scaleX: 1.08,
      scaleY: 1.08,
      alpha: 0.94,
      duration: 650,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.goalSparkleEmitter = this.add.particles(def.goal.x, def.goal.y, 'tx_goal_sparkle', {
      lifespan: 640,
      frequency: 70,
      speed: { min: 10, max: 34 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0.1 },
      alpha: { start: 0.95, end: 0 },
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Circle(0, 0, 24),
        quantity: 24,
      },
      blendMode: 'ADD',
    });
    this.goalSparkleEmitter.setDepth(18);

    this.goalZone = this.add.zone(def.goal.x, def.goal.y, def.goal.width, def.goal.height);
    this.physics.add.existing(this.goalZone, true);
  }

  private createPlayer(def: LevelDefinition): void {
    const playerTexture = this.playerRole === 'spud' ? 'tx_boss' : 'tx_player';
    this.player = this.physics.add.sprite(def.playerSpawn.x, def.playerSpawn.y, playerTexture);
    this.player.setDepth(20);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.02);

    if (this.playerRole === 'spud') {
      this.player.setScale(0.72);
    }

    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.playerRole === 'spud') {
      body.setSize(44, 58);
      body.setOffset(20, 22);
    } else {
      body.setSize(30, 38);
      body.setOffset(9, 8);
    }

    this.playerController = new PlayerController(this, this.player);
  }

  private createCheckpoints(def: LevelDefinition): void {
    this.checkpointById.clear();

    def.checkpoints.forEach((checkpointDef) => {
      const checkpoint = this.checkpointGroup.create(
        checkpointDef.x,
        checkpointDef.y,
        'tx_checkpoint_off',
      ) as Phaser.Physics.Arcade.Sprite;

      checkpoint.setDataEnabled();
      checkpoint.setData('checkpointId', checkpointDef.id);
      checkpoint.setData('spawnX', checkpointDef.spawn.x);
      checkpoint.setData('spawnY', checkpointDef.spawn.y);
      checkpoint.setDepth(14);
      checkpoint.refreshBody();

      this.checkpointById.set(checkpointDef.id, checkpoint);
    });
  }

  private createSprings(springs: SpringDefinition[]): void {
    springs.forEach((springDef) => {
      const spring = this.springGroup.create(springDef.x, springDef.y, 'tx_spring') as Phaser.Physics.Arcade.Sprite;
      spring.setDataEnabled();
      spring.setData('launchX', springDef.launchX);
      spring.setData('launchY', springDef.launchY);
      spring.setData('springId', springDef.id);
      spring.setDepth(14);
      spring.refreshBody();
    });
  }

  private createHud(def: LevelDefinition): void {
    const levelLabel = this.playerRole === 'spud' ? `${def.name} (Spud Run)` : def.name;
    this.hud = new Hud(this, levelLabel, this.playerState.maxHearts);
    this.hud.updateHearts(this.playerState.hearts, this.playerState.maxHearts);
  }

  private createSecretHint(def: LevelDefinition): void {
    const markerX = Math.round(def.worldWidth * 0.5);
    const markerY = 96;

    this.secretHintLabel = this.add
      .text(markerX, markerY, 'F', {
        fontFamily: 'Trebuchet MS',
        fontSize: '58px',
        color: '#fff4b8',
        stroke: '#3a2205',
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setDepth(30);

    this.secretHintLeftArrow = this.add
      .triangle(markerX - 82, markerY, 0, 0, 0, 24, 24, 12, 0xffd86b, 0.96)
      .setDepth(30);

    this.secretHintRightArrow = this.add
      .triangle(markerX + 82, markerY, 24, 0, 24, 24, 0, 12, 0xffd86b, 0.96)
      .setDepth(30);

    this.tweens.add({
      targets: this.secretHintLeftArrow,
      x: markerX - 68,
      yoyo: true,
      repeat: -1,
      duration: 420,
      ease: 'Sine.easeInOut',
    });

    this.tweens.add({
      targets: this.secretHintRightArrow,
      x: markerX + 68,
      yoyo: true,
      repeat: -1,
      duration: 420,
      ease: 'Sine.easeInOut',
    });
  }

  private updateSecretHintVisibility(): void {
    if (!this.secretHintLabel || !this.secretHintLeftArrow || !this.secretHintRightArrow) {
      return;
    }

    const markerInView = this.cameras.main.worldView.contains(this.secretHintLabel.x, this.secretHintLabel.y);
    this.secretHintLabel.setVisible(markerInView);
    this.secretHintLeftArrow.setVisible(markerInView);
    this.secretHintRightArrow.setVisible(markerInView);
  }

  private bindControlKeys(): void {
    this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.restartKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.skipLevelKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.secretLevelKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.F);
  }

  private skipCurrentLevel(): void {
    if (this.cutsceneActive || this.levelFinished) {
      return;
    }

    if (this.playerRole === 'monkey' && this.levelDef.bossEvent) {
      this.scene.start('LevelScene', { levelId: this.levelDef.bossEvent.nextLevelId, playerRole: this.playerRole });
      return;
    }

    this.startNextLevelOrWin();
  }

  private bindGameplayCollisions(): void {
    this.physics.add.collider(this.player, this.platformGroup);
    this.physics.add.overlap(this.player, this.groundDangerGroup, () => {
      this.handleDeathAndCheckpointRespawn(this.groundDangerDeathMessage);
    });

    this.physics.add.collider(this.hazardGroup, this.platformGroup, (hazardObject) => {
      const hazard = hazardObject as Phaser.Physics.Arcade.Sprite;
      const hazardType = hazard.getData('hazardType') as string | undefined;

      if (hazardType === 'falling') {
        this.spawnFallingImpact(hazard.x, hazard.y);
        hazard.destroy();
        return;
      }

      if (hazardType === 'fireball') {
        hazard.destroy();
      }
    });

    this.physics.add.overlap(this.player, this.hazardGroup, (playerObject, hazardObject) => {
      void playerObject;
      const hazard = hazardObject as Phaser.Physics.Arcade.Sprite;
      const hazardDamage = Number(hazard.getData('damage'));
      this.handlePlayerHit(Number.isFinite(hazardDamage) ? hazardDamage : 1);
    });

    this.physics.add.overlap(this.player, this.checkpointGroup, (playerObject, checkpointObject) => {
      void playerObject;
      const checkpoint = checkpointObject as Phaser.Physics.Arcade.Sprite;
      this.activateCheckpoint(checkpoint);
    });

    this.physics.add.overlap(this.player, this.springGroup, (playerObject, springObject) => {
      const playerSprite = playerObject as Phaser.Physics.Arcade.Sprite;
      const spring = springObject as Phaser.Physics.Arcade.Sprite;
      this.applySpringLaunch(playerSprite, spring);
    });

    this.physics.add.overlap(this.player, this.goalZone, () => {
      if (this.levelFinished || this.cutsceneActive) {
        return;
      }

      if (this.levelDef.bossEvent && this.playerRole === 'monkey') {
        this.triggerBossCutscene();
        return;
      }

      this.completeLevel();
    });
  }

  private configureCamera(def: LevelDefinition): void {
    this.physics.world.setBounds(0, 0, def.worldWidth, def.worldHeight);
    this.cameras.main.setBounds(0, 0, def.worldWidth, def.worldHeight);

    if (def.autoScroll?.enabled) {
      this.cameras.main.stopFollow();
      this.cameras.main.scrollX = 0;
      this.cameras.main.scrollY = Math.max(0, this.player.y - this.scale.height * 0.62);
      return;
    }

    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
  }

  private registerFallingHazard(hazard: HazardDefinition): void {
    const minX = Math.min(hazard.path?.[0]?.x ?? hazard.position.x - 100, hazard.path?.[1]?.x ?? hazard.position.x + 100);
    const maxX = Math.max(hazard.path?.[0]?.x ?? hazard.position.x - 100, hazard.path?.[1]?.x ?? hazard.position.x + 100);
    const speedMultiplier = this.getSpeedMultiplier();
    const rainMultiplier = this.getRainMultiplier();
    const rainSpeedMultiplier = speedMultiplier * rainMultiplier;
    const interval = Math.max(110, (hazard.respawnMs ?? 1500) / rainSpeedMultiplier);
    const fallingTextureKey = this.getFallingRainTextureKey(this.levelDef.groundDanger.type);
    const warningColor = this.getFallingRainWarningColor(this.levelDef.groundDanger.type);
    const superRainDelayMs = 0.1;
    const normalStreamCount = 3;
    const impossibleStreamCount = 5;
    const streamSpacingPx = 56;

    const spawnFallingDrop = (spawnX: number, isSuperRain: boolean): void => {
      if (this.cutsceneActive || this.levelFinished || this.scenePaused) {
        return;
      }

      const falling = this.hazardGroup.create(spawnX, hazard.position.y, fallingTextureKey) as Phaser.Physics.Arcade.Sprite;
      falling.setDataEnabled();
      falling.setData('hazardType', 'falling');
      falling.setData('damage', hazard.damage);
      falling.setData('knockback', hazard.knockback);
      falling.setDepth(15);

      const driftX = isSuperRain ? 0 : Phaser.Math.Between(-35, 35) * rainSpeedMultiplier;
      falling.setVelocity(driftX, 310 * rainSpeedMultiplier);
      falling.setAccelerationY(120 * rainSpeedMultiplier);
    };

    const getSuperRainSpawnX = (streamIndex: number): number => {
      const targetX = Phaser.Math.Clamp(this.player.x, minX, maxX);
      const centerIndex = (impossibleStreamCount - 1) / 2;
      const offset = (streamIndex - centerIndex) * streamSpacingPx;
      return Math.round(Phaser.Math.Clamp(targetX + offset, minX, maxX));
    };

    const getNormalStreamSpawnXs = (): number[] =>
      Array.from({ length: normalStreamCount }, () =>
        Phaser.Math.Between(Math.floor(minX), Math.floor(maxX)),
      );

    const timer = this.time.addEvent({
      delay: interval,
      loop: true,
      callback: () => {
        if (this.cutsceneActive || this.levelFinished || this.scenePaused) {
          return;
        }

        const isSuperRain = gameSettings.impossibleModeEnabled;
        const warningDuration = isSuperRain ? superRainDelayMs : 220;

        if (isSuperRain) {
          for (let streamIndex = 0; streamIndex < impossibleStreamCount; streamIndex += 1) {
            const warningX = getSuperRainSpawnX(streamIndex);
            const warningMarker = this.add.circle(warningX, hazard.position.y - 24, 8, warningColor, 0.78).setDepth(17);
            this.tweens.add({
              targets: warningMarker,
              alpha: 0,
              duration: warningDuration,
              onComplete: () => {
                warningMarker.destroy();
              },
            });

            this.time.delayedCall(superRainDelayMs, () => {
              const dynamicSpawnX = getSuperRainSpawnX(streamIndex);
              spawnFallingDrop(dynamicSpawnX, true);
            });
          }

          return;
        }

        const normalStreamSpawnXs = getNormalStreamSpawnXs();
        normalStreamSpawnXs.forEach((spawnX) => {
          const warningMarker = this.add.circle(spawnX, hazard.position.y - 24, 8, warningColor, 0.78).setDepth(17);
          this.tweens.add({
            targets: warningMarker,
            alpha: 0,
            duration: warningDuration,
            onComplete: () => {
              warningMarker.destroy();
            },
          });

          spawnFallingDrop(spawnX, false);
        });
      },
    });

    this.fallingSpawnerEvents.push(timer);
  }

  private registerPatrolHazard(hazard: HazardDefinition): void {
    const minX = Math.min(hazard.path?.[0]?.x ?? hazard.position.x - 70, hazard.path?.[1]?.x ?? hazard.position.x + 70);
    const maxX = Math.max(hazard.path?.[0]?.x ?? hazard.position.x - 70, hazard.path?.[1]?.x ?? hazard.position.x + 70);
    const speedMultiplier = this.getSpeedMultiplier();
    const speed = clampToNumber(hazard.config?.speed, hazard.type === 'boulder' ? 110 : 65) * speedMultiplier;

    const texture = hazard.type === 'boulder' ? 'tx_boulder' : 'tx_snail';
    const patrol = this.hazardGroup.create(hazard.position.x, hazard.position.y, texture) as Phaser.Physics.Arcade.Sprite;
    patrol.setDataEnabled();
    patrol.setData('hazardType', hazard.type);
    patrol.setData('damage', hazard.damage);
    patrol.setData('knockback', hazard.knockback);
    patrol.setDepth(15);
    patrol.setVelocityX(speed);

    if (hazard.type === 'boulder') {
      patrol.setCircle(18, 6, 6);
      patrol.setBounce(1, 0);
      patrol.setDragX(0);
      patrol.setMaxVelocity(170 * speedMultiplier, 700 * speedMultiplier);
    } else {
      patrol.setSize(30, 20);
      patrol.setOffset(7, 20);
      patrol.setMaxVelocity(90 * speedMultiplier, 700 * speedMultiplier);
    }

    this.patrolHazards.push({
      sprite: patrol,
      minX,
      maxX,
      speed,
    });
  }

  private registerFirePlant(hazard: HazardDefinition): void {
    const plant = this.add.sprite(hazard.position.x, hazard.position.y, 'tx_fire_plant').setDepth(14);
    const speedMultiplier = this.getSpeedMultiplier();
    const shootIntervalMs = clampToNumber(hazard.config?.shootIntervalMs, 1400) / speedMultiplier;
    const projectileSpeed = clampToNumber(hazard.config?.projectileSpeed, 280) * speedMultiplier;

    const timer = this.time.addEvent({
      delay: shootIntervalMs,
      loop: true,
      callback: () => {
        if (this.cutsceneActive || this.levelFinished || this.scenePaused) {
          return;
        }

        this.spawnFireball(plant, projectileSpeed, hazard);
      },
    });

    this.firePlantActors.push({ sprite: plant, timer, projectileSpeed, sourceHazard: hazard });
  }

  private spawnFireball(
    plant: Phaser.GameObjects.Sprite,
    projectileSpeed: number,
    sourceHazard: HazardDefinition,
  ): void {
    const direction = this.player.x >= plant.x ? 1 : -1;

    plant.setTint(0xff8b4f);
    this.time.delayedCall(100, () => {
      if (plant.active) {
        plant.clearTint();
      }
    });

    const fireball = this.hazardGroup.create(plant.x + direction * 18, plant.y - 12, 'tx_fireball') as Phaser.Physics.Arcade.Sprite;
    fireball.setDataEnabled();
    fireball.setData('hazardType', 'fireball');
    fireball.setData('damage', sourceHazard.damage);
    fireball.setData('knockback', sourceHazard.knockback);
    fireball.setDepth(16);
    const fireballBody = fireball.body as Phaser.Physics.Arcade.Body;
    fireballBody.setAllowGravity(false);
    fireball.setVelocity(direction * projectileSpeed, -10);
  }

  private updatePatrolHazards(delta: number): void {
    this.patrolHazards.forEach((actor) => {
      if (!actor.sprite.active) {
        return;
      }

      if (actor.sprite.x <= actor.minX) {
        actor.sprite.setVelocityX(Math.abs(actor.speed));
      }

      if (actor.sprite.x >= actor.maxX) {
        actor.sprite.setVelocityX(-Math.abs(actor.speed));
      }

      const actorBody = actor.sprite.body;
      if (!actorBody) {
        return;
      }

      if (actor.sprite.texture.key === 'tx_snail') {
        actor.sprite.setFlipX(actorBody.velocity.x < 0);
      }

      if (actor.sprite.texture.key === 'tx_boulder') {
        actor.sprite.angle += actorBody.velocity.x * (delta / 1200);
      }
    });
  }

  private updateFirePlantFacing(): void {
    this.firePlantActors.forEach((actor) => {
      if (!actor.sprite.active) {
        return;
      }

      actor.sprite.setFlipX(this.player.x < actor.sprite.x);
      void actor.projectileSpeed;
      void actor.sourceHazard;
    });
  }

  private updateAutoScroll(delta: number): void {
    const autoScroll = this.levelDef.autoScroll;
    const speedMultiplier = this.getSpeedMultiplier();

    if (!autoScroll?.enabled) {
      return;
    }

    this.cameras.main.scrollX += autoScroll.speed * speedMultiplier * (delta / 1000);
    this.cameras.main.scrollX = Phaser.Math.Clamp(
      this.cameras.main.scrollX,
      0,
      this.levelDef.worldWidth - this.cameras.main.width,
    );

    this.cameras.main.scrollY = Phaser.Math.Clamp(
      this.player.y - this.cameras.main.height * 0.65,
      0,
      this.levelDef.worldHeight - this.cameras.main.height,
    );

    const lethalX = this.cameras.main.scrollX + autoScroll.failMargin;
    if (this.player.x < lethalX) {
      this.handlePlayerHit();
    }

    if (this.chaseBoss) {
      const chaseX = this.cameras.main.scrollX + 130;
      const chaseY = this.player.y - 34;
      this.chaseBoss.setChasePosition(chaseX, chaseY);

      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, chaseX, chaseY) < 86) {
        this.handlePlayerHit();
      }
    }
  }

  private cleanupOutOfBoundsHazards(): void {
    this.hazardGroup.getChildren().forEach((hazardObject) => {
      const hazard = hazardObject as Phaser.Physics.Arcade.Sprite;
      if (!hazard.active) {
        return;
      }

      if (hazard.y > this.levelDef.worldHeight + 120 || hazard.x < -100 || hazard.x > this.levelDef.worldWidth + 100) {
        hazard.destroy();
      }
    });
  }

  private activateCheckpoint(checkpoint: Phaser.Physics.Arcade.Sprite): void {
    const checkpointId = checkpoint.getData('checkpointId') as string;

    if (!checkpointId || this.activeCheckpointId === checkpointId) {
      return;
    }

    this.activeCheckpointId = checkpointId;

    this.checkpointById.forEach((checkpointSprite) => {
      checkpointSprite.setTexture('tx_checkpoint_off');
    });

    checkpoint.setTexture('tx_checkpoint_on');

    const spawnX = Number(checkpoint.getData('spawnX'));
    const spawnY = Number(checkpoint.getData('spawnY'));
    this.playerState.lastCheckpoint = { x: spawnX, y: spawnY };
    this.hud.flashCheckpoint(this);
  }

  private applySpringLaunch(playerSprite: Phaser.Physics.Arcade.Sprite, spring: Phaser.Physics.Arcade.Sprite): void {
    const now = this.time.now;

    if (now < this.springCooldownUntil || this.cutsceneActive || this.levelFinished) {
      return;
    }

    const baseLaunchX = Number(spring.getData('launchX'));
    const baseLaunchY = Number(spring.getData('launchY'));
    const speedMultiplier = this.getSpeedMultiplier();
    const resolvedBaseLaunchX = Number.isFinite(baseLaunchX) ? baseLaunchX : -360;
    const resolvedBaseLaunchY = Number.isFinite(baseLaunchY) ? baseLaunchY : -620;
    const horizontalDirection = Math.sign(resolvedBaseLaunchX) || (playerSprite.x >= spring.x ? 1 : -1);
    const launchX = horizontalDirection * Math.max(Math.abs(resolvedBaseLaunchX), 420) * speedMultiplier;
    const launchY = Math.min(resolvedBaseLaunchY, -560) * speedMultiplier;
    const lockDurationMs = 220;

    playerSprite.setVelocity(launchX, launchY);
    this.springControlLockUntil = now + lockDurationMs;
    this.springCooldownUntil = now + 340;

    spring.setTint(0xf2f7ff);
    this.time.delayedCall(130, () => {
      if (spring.active) {
        spring.clearTint();
      }
    });
  }

  private spawnFallingImpact(x: number, y: number): void {
    const impact = this.add.circle(x, y + 6, 10, 0xc8eeff, 0.85).setDepth(17);
    this.tweens.add({
      targets: impact,
      scaleX: 1.8,
      scaleY: 0.5,
      alpha: 0,
      duration: 160,
      onComplete: () => {
        impact.destroy();
      },
    });
  }

  private togglePause(): void {
    if (this.cutsceneActive) {
      return;
    }

    this.scenePaused = !this.scenePaused;

    if (this.scenePaused) {
      this.physics.world.pause();
      this.playerController.isInputEnabled = false;
      this.hud.setPauseVisible(true);
      return;
    }

    this.physics.world.resume();
    this.playerController.isInputEnabled = true;
    this.hud.setPauseVisible(false);
  }

  private spawnChaseBoss(): void {
    this.chaseBoss = new BossSpud(this, this.player.x - 140, this.player.y - 34, true);
  }

  private stopGoalEffects(): void {
    if (this.goalSparkleEmitter) {
      this.goalSparkleEmitter.stop();
      this.goalSparkleEmitter.destroy();
      this.goalSparkleEmitter = null;
    }

    if (this.goalSprite?.active) {
      this.tweens.killTweensOf(this.goalSprite);
    }
  }

  private cleanupSceneObjects(): void {
    this.fallingSpawnerEvents.forEach((event) => {
      event.remove(false);
    });

    this.fallingSpawnerEvents = [];

    this.firePlantActors.forEach((actor) => {
      actor.timer.remove(false);
      actor.sprite.destroy();
    });

    this.firePlantActors = [];

    if (this.chaseBoss) {
      this.chaseBoss.destroy();
      this.chaseBoss = null;
    }

    if (this.secretHintLabel) {
      this.secretHintLabel.destroy();
      this.secretHintLabel = null;
    }

    if (this.secretHintLeftArrow) {
      this.tweens.killTweensOf(this.secretHintLeftArrow);
      this.secretHintLeftArrow.destroy();
      this.secretHintLeftArrow = null;
    }

    if (this.secretHintRightArrow) {
      this.tweens.killTweensOf(this.secretHintRightArrow);
      this.secretHintRightArrow.destroy();
      this.secretHintRightArrow = null;
    }

    this.stopGoalEffects();
  }
}
