import Phaser from 'phaser';
import { gameSettings, setPlayerRole } from '../data/gameSettings';
import type { PlayableRole } from '../data/gameSettings';
import { PlayerController } from '../entities/PlayerController';

export class SecretBossScene extends Phaser.Scene {
  private static readonly STARTING_HEARTS = 5;

  private static readonly STARTING_BOSS_HEALTH = 22;

  private static readonly SPUD_MODE_MONKEY_HEALTH = 500;

  private static readonly SPUD_FIRE_STREAM_INTERVAL_MS = 35;

  private static readonly ARENA_WIDTH = 2400;

  private static readonly ARENA_HEIGHT = 1200;

  private static readonly ARENA_MIN_X = 120;

  private static readonly ARENA_MAX_X = SecretBossScene.ARENA_WIDTH - 120;

  private static readonly GROUND_TOP_Y = SecretBossScene.ARENA_HEIGHT - 100;

  private playerRole: PlayableRole = 'monkey';

  private player!: Phaser.Physics.Arcade.Sprite;

  private boss!: Phaser.Physics.Arcade.Sprite;

  private playerController!: PlayerController;

  private arenaPlatforms!: Phaser.Physics.Arcade.StaticGroup;

  private playerShots!: Phaser.Physics.Arcade.Group;

  private enemyShots!: Phaser.Physics.Arcade.Group;

  private firePillars!: Phaser.Physics.Arcade.StaticGroup;

  private throwKey!: Phaser.Input.Keyboard.Key;

  private leaveKey!: Phaser.Input.Keyboard.Key;

  private skipKey!: Phaser.Input.Keyboard.Key;

  private heartsText!: Phaser.GameObjects.Text;

  private bossHpText!: Phaser.GameObjects.Text;

  private promptText!: Phaser.GameObjects.Text;

  private secretHintLabel: Phaser.GameObjects.Text | null = null;

  private secretHintLeftArrow: Phaser.GameObjects.Triangle | null = null;

  private secretHintRightArrow: Phaser.GameObjects.Triangle | null = null;

  private hearts = SecretBossScene.STARTING_HEARTS;

  private bossHealth = SecretBossScene.STARTING_BOSS_HEALTH;

  private nextThrowAt = 0;

  private playerInvulnerableUntil = 0;

  private bossInvulnerableUntil = 0;

  private fightOver = false;

  private fireTimer: Phaser.Time.TimerEvent | null = null;

  private enemyAttackTimer: Phaser.Time.TimerEvent | null = null;

  private enemyMoveTimer: Phaser.Time.TimerEvent | null = null;

  private previousRandomJumpEnabled: boolean | null = null;

  public constructor() {
    super('SecretBossScene');
  }

  public init(data: { playerRole?: PlayableRole }): void {
    this.playerRole = data.playerRole ?? gameSettings.playerRole;
    setPlayerRole(this.playerRole);
  }

  private isSpudRole(): boolean {
    return this.playerRole === 'spud';
  }

  public create(): void {
    this.hearts = SecretBossScene.STARTING_HEARTS;
    this.bossHealth = this.isSpudRole() ? SecretBossScene.SPUD_MODE_MONKEY_HEALTH : SecretBossScene.STARTING_BOSS_HEALTH;
    this.nextThrowAt = 0;
    this.playerInvulnerableUntil = 0;
    this.bossInvulnerableUntil = 0;
    this.fightOver = false;
    this.previousRandomJumpEnabled = null;

    if (this.isSpudRole()) {
      this.previousRandomJumpEnabled = gameSettings.randomJumpEnabled;
      gameSettings.randomJumpEnabled = true;
    }

    const speedMultiplier = Math.max(1, gameSettings.speedMultiplier);
    this.physics.world.gravity.y = 1200 * speedMultiplier;
    this.physics.world.setBounds(0, 0, SecretBossScene.ARENA_WIDTH, SecretBossScene.ARENA_HEIGHT);

    this.add
      .rectangle(
        SecretBossScene.ARENA_WIDTH / 2,
        SecretBossScene.ARENA_HEIGHT / 2,
        SecretBossScene.ARENA_WIDTH,
        SecretBossScene.ARENA_HEIGHT,
        0x1c0f12,
      )
      .setDepth(-40);
    this.add
      .image(SecretBossScene.ARENA_WIDTH / 2, SecretBossScene.ARENA_HEIGHT / 2, 'tx_backdrop')
      .setDisplaySize(SecretBossScene.ARENA_WIDTH, SecretBossScene.ARENA_HEIGHT)
      .setTint(0x5a2428)
      .setAlpha(0.5)
      .setDepth(-35);

    this.arenaPlatforms = this.physics.add.staticGroup();
    const ground = this.arenaPlatforms.create(
      SecretBossScene.ARENA_WIDTH / 2,
      SecretBossScene.ARENA_HEIGHT - 40,
      'tx_platform',
    ) as Phaser.Physics.Arcade.Sprite;
    ground.setDisplaySize(SecretBossScene.ARENA_WIDTH + 200, 80);
    ground.refreshBody();

    const leftLedge = this.arenaPlatforms.create(400, 920, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
    leftLedge.setDisplaySize(300, 34);
    leftLedge.refreshBody();

    const midLedgeA = this.arenaPlatforms.create(880, 820, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
    midLedgeA.setDisplaySize(260, 34);
    midLedgeA.refreshBody();

    const midLedgeB = this.arenaPlatforms.create(1300, 740, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
    midLedgeB.setDisplaySize(260, 34);
    midLedgeB.refreshBody();

    const rightLedge = this.arenaPlatforms.create(1760, 820, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
    rightLedge.setDisplaySize(320, 34);
    rightLedge.refreshBody();

    const upperRightLedge = this.arenaPlatforms.create(2080, 700, 'tx_platform') as Phaser.Physics.Arcade.Sprite;
    upperRightLedge.setDisplaySize(280, 34);
    upperRightLedge.refreshBody();

    const playerTexture = this.isSpudRole() ? 'tx_boss' : this.textures.exists('tx_player') ? 'tx_player' : 'tx_checkpoint_on';
    this.player = this.physics.add.sprite(220, 1040, playerTexture).setDepth(40);
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0.02);
    this.player.setAlpha(1);
    this.player.clearTint();

    if (this.isSpudRole()) {
      this.player.setScale(0.72);
    }

    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    if (this.isSpudRole()) {
      playerBody.setSize(44, 58);
      playerBody.setOffset(20, 22);
    } else {
      playerBody.setSize(30, 38);
      playerBody.setOffset(9, 8);
    }

    this.playerController = new PlayerController(this, this.player);
    this.playerController.isInputEnabled = true;

    const bossTexture = this.isSpudRole() ? 'tx_player' : 'tx_boss';
    this.boss = this.physics.add.sprite(2060, 950, bossTexture).setDepth(36);
    this.boss.setImmovable(true);
    const bossBody = this.boss.body as Phaser.Physics.Arcade.Body;
    bossBody.setAllowGravity(false);

    if (this.isSpudRole()) {
      bossBody.setSize(30, 38);
      bossBody.setOffset(9, 8);
    }

    this.tweens.add({
      targets: this.boss,
      y: this.isSpudRole() ? 932 : 918,
      yoyo: true,
      duration: 520,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.playerShots = this.physics.add.group();
    this.enemyShots = this.physics.add.group();
    this.firePillars = this.physics.add.staticGroup();

    this.physics.add.collider(this.player, this.arenaPlatforms);
    this.physics.add.collider(this.playerShots, this.arenaPlatforms, (shotObject) => {
      const shot = shotObject as Phaser.Physics.Arcade.Sprite;
      if (Boolean(shot.getData('ignorePlatforms'))) {
        return;
      }

      shot.destroy();
    });
    this.physics.add.collider(this.enemyShots, this.arenaPlatforms, (shotObject) => {
      const shot = shotObject as Phaser.Physics.Arcade.Sprite;
      shot.destroy();
    });

    this.physics.add.overlap(this.playerShots, this.boss, (firstObject, secondObject) => {
      const firstSprite = firstObject as Phaser.Physics.Arcade.Sprite;
      const secondSprite = secondObject as Phaser.Physics.Arcade.Sprite;
      const shot = this.playerShots.contains(firstSprite) ? firstSprite : this.playerShots.contains(secondSprite) ? secondSprite : null;

      if (!shot || !shot.active || !this.boss.active) {
        return;
      }

      shot.destroy();
      this.damageBoss();
    });

    this.physics.add.overlap(this.enemyShots, this.player, (firstObject, secondObject) => {
      const firstSprite = firstObject as Phaser.Physics.Arcade.Sprite;
      const secondSprite = secondObject as Phaser.Physics.Arcade.Sprite;
      const shot = this.enemyShots.contains(firstSprite) ? firstSprite : this.enemyShots.contains(secondSprite) ? secondSprite : null;

      if (!shot || !shot.active || !this.player.active) {
        return;
      }

      shot.destroy();
      this.damagePlayer();
    });

    if (!this.isSpudRole()) {
      this.physics.add.overlap(this.player, this.firePillars, () => {
        this.damagePlayer();
      });
    }

    this.cameras.main.setBounds(0, 0, SecretBossScene.ARENA_WIDTH, SecretBossScene.ARENA_HEIGHT);
    this.cameras.main.setScroll(0, 0);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.throwKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.leaveKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.skipKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S);

    this.heartsText = this.add
      .text(22, 18, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#ffe7be',
        stroke: '#2f1208',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.bossHpText = this.add
      .text(22, 52, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#ffd6d0',
        stroke: '#2f1208',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(1000);

    const prompt = this.isSpudRole()
      ? 'Secret Fight: You are Spud. Random jump forced, mouse aims fire stream, dodge monkey bananas, S skip'
      : 'Secret Fight: X throw bananas, S skip, ESC leave';

    this.promptText = this.add
      .text(this.scale.width / 2, 26, prompt, {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#f8edcf',
        stroke: '#2a1a0d',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(1000);

    this.refreshHud();
    this.createSecretHint();
    this.updateSecretHintVisibility();

    if (this.isSpudRole()) {
      this.enemyAttackTimer = this.time.addEvent({
        delay: 620,
        loop: true,
        callback: () => {
          if (!this.fightOver) {
            this.throwEnemyBanana();
          }
        },
      });

      this.enemyMoveTimer = this.time.addEvent({
        delay: 320,
        loop: true,
        callback: () => {
          if (!this.fightOver) {
            this.dodgeBossMonkey();
          }
        },
      });
    } else {
      this.fireTimer = this.time.addEvent({
        delay: 900,
        loop: true,
        callback: () => {
          if (!this.fightOver) {
            this.summonFirePillars();
          }
        },
      });
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.fireTimer) {
        this.fireTimer.remove(false);
        this.fireTimer = null;
      }

      if (this.enemyAttackTimer) {
        this.enemyAttackTimer.remove(false);
        this.enemyAttackTimer = null;
      }

      if (this.enemyMoveTimer) {
        this.enemyMoveTimer.remove(false);
        this.enemyMoveTimer = null;
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

      if (this.previousRandomJumpEnabled !== null) {
        gameSettings.randomJumpEnabled = this.previousRandomJumpEnabled;
        this.previousRandomJumpEnabled = null;
      }
    });
  }

  public update(time: number): void {
    this.updateSecretHintVisibility();

    if (Phaser.Input.Keyboard.JustDown(this.leaveKey)) {
      this.scene.start('MainMenuScene');
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.skipKey)) {
      if (this.isSpudRole()) {
        this.scene.start('LevelScene', { levelId: 'spud-level-4', playerRole: 'spud' });
      } else {
        this.scene.start('MainMenuScene');
      }
      return;
    }

    if (this.fightOver) {
      return;
    }

    this.playerController.update(time);

    if (this.player.x < this.boss.x) {
      this.boss.setFlipX(true);
    } else {
      this.boss.setFlipX(false);
    }

    if (this.isSpudRole()) {
      const pointer = this.input.activePointer;
      this.player.setFlipX(pointer.worldX < this.player.x);

      if (time >= this.nextThrowAt) {
        this.throwSpudFireStream(pointer);
        this.nextThrowAt = time + SecretBossScene.SPUD_FIRE_STREAM_INTERVAL_MS;
      }
    } else if (Phaser.Input.Keyboard.JustDown(this.throwKey) && time >= this.nextThrowAt) {
      this.throwPlayerProjectile();
      this.nextThrowAt = time + 220;
    }

    if (this.playerInvulnerableUntil > 0 && time >= this.playerInvulnerableUntil) {
      this.playerInvulnerableUntil = 0;
      this.player.clearTint();
    }

    if (this.player.y > SecretBossScene.ARENA_HEIGHT + 60) {
      this.damagePlayer(true);
    }
  }

  private throwPlayerProjectile(): void {
    const speedMultiplier = Math.max(1, gameSettings.speedMultiplier);
    const direction = this.player.flipX ? -1 : 1;
    const projectileTexture = this.isSpudRole() ? 'tx_falling_lava' : 'tx_banana_shot';

    const projectile = this.playerShots.create(
      this.player.x + direction * 28,
      this.player.y - 12,
      projectileTexture,
    ) as Phaser.Physics.Arcade.Sprite;
    const projectileBody = projectile.body as Phaser.Physics.Arcade.Body;
    projectileBody.setAllowGravity(false);
    projectile.setDepth(19);
    projectile.setVelocity(direction * (this.isSpudRole() ? 760 : 620) * speedMultiplier, Phaser.Math.Between(-40, 20));
    projectile.setAngle(direction < 0 ? 180 : 0);

    if (this.isSpudRole()) {
      projectile.setScale(0.85);
    }
  }

  private throwSpudFireStream(pointer: Phaser.Input.Pointer): void {
    const speedMultiplier = Math.max(1, gameSettings.speedMultiplier);
    const startX = this.player.x;
    const startY = this.player.y - 10;
    const targetX = pointer.worldX;
    const targetY = pointer.worldY;
    const aimVector = new Phaser.Math.Vector2(targetX - startX, targetY - startY);

    if (aimVector.lengthSq() < 1) {
      aimVector.set(this.player.flipX ? -1 : 1, 0);
    }

    aimVector.normalize();

    const fireShot = this.playerShots.create(startX + aimVector.x * 24, startY + aimVector.y * 8, 'tx_fireball') as Phaser.Physics.Arcade.Sprite;
    const fireBody = fireShot.body as Phaser.Physics.Arcade.Body;
    fireBody.setAllowGravity(false);
    fireShot.setData('ignorePlatforms', true);
    fireShot.setDepth(20);
    fireShot.setScale(0.95);
    fireShot.setVelocity(aimVector.x * 980 * speedMultiplier, aimVector.y * 980 * speedMultiplier);
    fireShot.setAngle(Phaser.Math.RadToDeg(Math.atan2(aimVector.y, aimVector.x)));
  }

  private createSecretHint(): void {
    const markerX = SecretBossScene.ARENA_WIDTH / 2;
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

  private throwEnemyBanana(): void {
    if (this.fightOver || !this.isSpudRole()) {
      return;
    }

    const speedMultiplier = Math.max(1, gameSettings.speedMultiplier);
    const direction = this.player.x >= this.boss.x ? 1 : -1;
    this.boss.setFlipX(direction < 0);

    const banana = this.enemyShots.create(this.boss.x + direction * 22, this.boss.y - 10, 'tx_banana_shot') as Phaser.Physics.Arcade.Sprite;
    const bananaBody = banana.body as Phaser.Physics.Arcade.Body;
    bananaBody.setAllowGravity(false);
    banana.setDepth(28);
    banana.setVelocity(direction * 560 * speedMultiplier, Phaser.Math.Between(-90, 30));
    banana.setAngle(direction < 0 ? 180 : 0);
  }

  private dodgeBossMonkey(): void {
    if (this.fightOver || !this.isSpudRole()) {
      return;
    }

    const dodgeX = Phaser.Math.Clamp(
      this.player.x + Phaser.Math.Between(-240, 240),
      SecretBossScene.ARENA_MIN_X,
      SecretBossScene.ARENA_MAX_X,
    );

    const dodgeY = Phaser.Math.Clamp(
      Phaser.Math.Between(680, 980),
      160,
      SecretBossScene.GROUND_TOP_Y + 20,
    );

    this.tweens.add({
      targets: this.boss,
      x: dodgeX,
      y: dodgeY,
      duration: 250,
      ease: 'Sine.easeInOut',
    });
  }

  private summonFirePillars(): void {
    const arenaMinX = SecretBossScene.ARENA_MIN_X;
    const arenaMaxX = SecretBossScene.ARENA_MAX_X;
    const baseTargetX = Phaser.Math.Clamp(this.player.x, arenaMinX, arenaMaxX);
    const offsets = [-120, 0, 120];

    offsets.forEach((offset) => {
      const targetX = Phaser.Math.Clamp(baseTargetX + offset, arenaMinX, arenaMaxX);
      const warning = this.add.circle(targetX, SecretBossScene.GROUND_TOP_Y - 16, 14, 0xffb46b, 0.9).setDepth(24);
      this.tweens.add({
        targets: warning,
        alpha: 0,
        duration: 420,
        onComplete: () => {
          warning.destroy();
        },
      });

      this.time.delayedCall(500, () => {
        if (this.fightOver) {
          return;
        }

        const pillar = this.firePillars.create(targetX, SecretBossScene.GROUND_TOP_Y - 120, 'tx_fire_pillar') as Phaser.Physics.Arcade.Sprite;
        pillar.setDisplaySize(52, 240);
        pillar.setDepth(23);
        pillar.refreshBody();

        this.tweens.add({
          targets: pillar,
          alpha: 0.72,
          yoyo: true,
          repeat: 3,
          duration: 90,
        });

        this.time.delayedCall(920, () => {
          if (pillar.active) {
            pillar.destroy();
          }
        });
      });
    });
  }

  private damageBoss(): void {
    if (this.fightOver) {
      return;
    }

    const now = this.time.now;
    if (now < this.bossInvulnerableUntil) {
      return;
    }

    this.bossInvulnerableUntil = now + (this.isSpudRole() ? 28 : 160);
    this.bossHealth = Math.max(0, this.bossHealth - 1);
    this.refreshHud();
    this.boss.setTint(0xff8b8b);
    this.boss.setScale(this.boss.scaleX * 1.08, this.boss.scaleY * 1.08);
    this.time.delayedCall(90, () => {
      if (this.boss.active) {
        this.boss.clearTint();
        if (this.isSpudRole()) {
          this.boss.setScale(1);
        } else {
          this.boss.setScale(1);
        }
      }
    });

    if (this.bossHealth > 0) {
      return;
    }

    this.fightOver = true;
    this.playerController.isInputEnabled = false;
    this.boss.setTint(0xffd966);
    this.promptText.setText(
      this.isSpudRole()
        ? 'Secret clear! Monkey defeated. Spud gauntlet begins!'
        : 'Secret clear! Yellow Spud defeated. Returning to menu...',
    );

    if (this.fireTimer) {
      this.fireTimer.remove(false);
      this.fireTimer = null;
    }

    if (this.enemyAttackTimer) {
      this.enemyAttackTimer.remove(false);
      this.enemyAttackTimer = null;
    }

    if (this.enemyMoveTimer) {
      this.enemyMoveTimer.remove(false);
      this.enemyMoveTimer = null;
    }

    this.time.delayedCall(2200, () => {
      if (this.isSpudRole()) {
        this.scene.start('LevelScene', { levelId: 'spud-level-4', playerRole: 'spud' });
        return;
      }

      this.scene.start('MainMenuScene');
    });
  }

  private damagePlayer(force = false): void {
    if (this.fightOver) {
      return;
    }

    const now = this.time.now;
    if (!force && this.playerInvulnerableUntil > now) {
      return;
    }

    this.hearts -= 1;
    this.refreshHud();
    this.playerInvulnerableUntil = now + 900;
    this.player.setTint(0xff8f8f);

    if (this.hearts > 0) {
      this.player.setVelocity(Phaser.Math.Between(-130, 130), -380);
      return;
    }

    this.fightOver = true;
    this.playerController.isInputEnabled = false;
    this.player.setVelocity(0, 0);
    this.promptText.setText('Defeated! Restarting secret fight...');

    if (this.fireTimer) {
      this.fireTimer.remove(false);
      this.fireTimer = null;
    }

    if (this.enemyAttackTimer) {
      this.enemyAttackTimer.remove(false);
      this.enemyAttackTimer = null;
    }

    if (this.enemyMoveTimer) {
      this.enemyMoveTimer.remove(false);
      this.enemyMoveTimer = null;
    }

    this.time.delayedCall(1400, () => {
      this.scene.restart({ playerRole: this.playerRole });
    });
  }

  private refreshHud(): void {
    const enemyLabel = this.isSpudRole() ? 'Monkey HP' : 'Boss HP';
    this.heartsText.setText(`Hearts: ${'●'.repeat(Math.max(0, this.hearts))}${'○'.repeat(Math.max(0, 5 - this.hearts))}`);
    this.bossHpText.setText(`${enemyLabel}: ${this.bossHealth}`);
  }
}
