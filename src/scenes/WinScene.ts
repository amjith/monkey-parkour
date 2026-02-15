import Phaser from 'phaser';
import { gameSettings, setPlayerRole } from '../data/gameSettings';
import { firstLevelId } from '../data/levels';
import type { PlayableRole } from '../data/gameSettings';

export class WinScene extends Phaser.Scene {
  private playerRole: PlayableRole = 'monkey';

  public constructor() {
    super('WinScene');
  }

  public init(data: { playerRole?: PlayableRole }): void {
    this.playerRole = data.playerRole ?? gameSettings.playerRole;
  }

  private createMassiveConfetti(): Phaser.GameObjects.Particles.ParticleEmitter[] {
    const confettiA = this.add.particles(0, -30, 'tx_confetti', {
      speedY: { min: 180, max: 520 },
      speedX: { min: -210, max: 210 },
      lifespan: 3000,
      quantity: 26,
      scale: { start: 1.25, end: 0.2 },
      rotate: { min: 0, max: 360 },
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, 0),
        quantity: 84,
      },
      gravityY: 380,
      blendMode: 'ADD',
    });

    const confettiB = this.add.particles(0, -30, 'tx_confetti', {
      speedY: { min: 160, max: 420 },
      speedX: { min: -260, max: 260 },
      lifespan: 3400,
      frequency: 12,
      scale: { start: 0.95, end: 0.18 },
      rotate: { min: -220, max: 220 },
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, 0),
        quantity: 68,
      },
      gravityY: 330,
      blendMode: 'SCREEN',
    });

    confettiA.setScrollFactor(0);
    confettiB.setScrollFactor(0);

    return [confettiA, confettiB];
  }

  private stopConfetti(emitters: Phaser.GameObjects.Particles.ParticleEmitter[]): void {
    emitters.forEach((emitter) => {
      emitter.stop();
      emitter.destroy();
    });
  }

  public create(): void {
    this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1d4036).setOrigin(0);
    this.add.rectangle(0, 0, this.scale.width, 220, 0xf6ca53, 0.13).setOrigin(0);

    const confettiEmitters = this.createMassiveConfetti();

    if (this.playerRole === 'monkey') {
      this.add
        .text(this.scale.width / 2, 140, 'Golden Banana Recovered!', {
          fontFamily: 'Trebuchet MS',
          fontSize: '56px',
          color: '#ffe48f',
          stroke: '#2d1702',
          strokeThickness: 8,
        })
        .setOrigin(0.5);

      this.add
        .text(this.scale.width / 2, 242, 'the end... or is it', {
          fontFamily: 'Trebuchet MS',
          fontSize: '48px',
          color: '#fff6c9',
          stroke: '#3f2302',
          strokeThickness: 6,
        })
        .setOrigin(0.5);

      this.add
        .text(this.scale.width / 2, this.scale.height - 170, 'Now replay as the Yellow Spud!\nPress SPACE to start now', {
          fontFamily: 'Trebuchet MS',
          fontSize: '30px',
          color: '#e6f8ff',
          stroke: '#052033',
          strokeThickness: 5,
          align: 'center',
        })
        .setOrigin(0.5);

      let transitionedToSpudRun = false;
      const startSpudRun = (): void => {
        if (transitionedToSpudRun) {
          return;
        }

        transitionedToSpudRun = true;
        this.stopConfetti(confettiEmitters);
        setPlayerRole('spud');
        this.scene.start('LevelScene', { levelId: firstLevelId, playerRole: 'spud' });
      };

      this.time.delayedCall(4500, startSpudRun);

      this.input.keyboard?.once('keydown-SPACE', startSpudRun);
      this.input.keyboard?.once('keydown-M', () => {
        this.stopConfetti(confettiEmitters);
        setPlayerRole('monkey');
        this.scene.start('MainMenuScene');
      });
      return;
    }

    this.add
      .text(this.scale.width / 2, 150, 'Spud Claimed The Golden Pineapple!', {
        fontFamily: 'Trebuchet MS',
        fontSize: '54px',
        color: '#ffe48f',
        stroke: '#2d1702',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 260, 'Ultimate pineapple run complete.', {
        fontFamily: 'Trebuchet MS',
        fontSize: '30px',
        color: '#f4f7ec',
        stroke: '#0c261f',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, this.scale.height - 170, 'Press R for monkey run\nPress M for Main Menu', {
        fontFamily: 'Trebuchet MS',
        fontSize: '30px',
        color: '#e6f8ff',
        stroke: '#052033',
        strokeThickness: 5,
        align: 'center',
      })
      .setOrigin(0.5);

    this.input.keyboard?.once('keydown-R', () => {
      this.stopConfetti(confettiEmitters);
      setPlayerRole('monkey');
      this.scene.start('LevelScene', { levelId: firstLevelId, playerRole: 'monkey' });
    });

    this.input.keyboard?.once('keydown-M', () => {
      this.stopConfetti(confettiEmitters);
      setPlayerRole('monkey');
      this.scene.start('MainMenuScene');
    });
  }
}
