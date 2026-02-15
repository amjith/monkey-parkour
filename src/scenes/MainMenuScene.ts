import Phaser from 'phaser';
import { gameSettings, setPlayerRole, toggleImpossibleMode, toggleRandomJump } from '../data/gameSettings';
import { firstLevelId } from '../data/levels';

export class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super('MainMenuScene');
  }

  public create(): void {
    this.add.tileSprite(0, 0, this.scale.width, this.scale.height, 'tx_backdrop').setOrigin(0).setDepth(-10);

    this.add
      .text(this.scale.width / 2, 120, 'Monkey Parkour', {
        fontFamily: 'Trebuchet MS',
        fontSize: '64px',
        color: '#ffe48f',
        stroke: '#381e02',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(this.scale.width / 2, 230, 'Chase the Golden Banana', {
        fontFamily: 'Trebuchet MS',
        fontSize: '30px',
        color: '#e8f8ff',
        stroke: '#08253e',
        strokeThickness: 5,
      })
      .setOrigin(0.5);

    const introLines = [
      'The yellow spud boss keeps stealing your prize.',
      'Dodge falling hazards and dangerous creatures.',
      'Reach the final level and escape with the banana.',
      '',
      'Controls: Arrow Keys / A-D to move, Space / W to jump',
      'P to pause, R to restart current level, S to skip level',
      'Press F for Secret Boss Level',
    ];

    this.add
      .text(this.scale.width / 2, 340, introLines.join('\n'), {
        align: 'center',
        fontFamily: 'Trebuchet MS',
        fontSize: '22px',
        color: '#f6f7d2',
        stroke: '#23350a',
        strokeThickness: 3,
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0);

    const impossibleButton = this.add
      .text(this.scale.width / 2, this.scale.height - 232, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#fff4ef',
        stroke: '#3d1406',
        strokeThickness: 4,
        backgroundColor: '#4a2117',
        padding: {
          x: 18,
          y: 10,
        },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const updateImpossibleLabel = (): void => {
      const isEnabled = gameSettings.impossibleModeEnabled;
      impossibleButton.setText(`Impossible Mode: ${isEnabled ? 'ON' : 'OFF'} (Super Rain)`);
      impossibleButton.setBackgroundColor(isEnabled ? '#7a130f' : '#4a2117');
    };

    impossibleButton.on('pointerdown', () => {
      toggleImpossibleMode();
      updateImpossibleLabel();
    });

    updateImpossibleLabel();

    const randomJumpButton = this.add
      .text(this.scale.width / 2, this.scale.height - 180, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#fff9d9',
        stroke: '#352004',
        strokeThickness: 4,
        backgroundColor: '#3f2a07',
        padding: {
          x: 18,
          y: 10,
        },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const updateRandomJumpLabel = (): void => {
      const isEnabled = gameSettings.randomJumpEnabled;
      randomJumpButton.setText(`Random Jump: ${isEnabled ? 'ON' : 'OFF'} (Click)`);
      randomJumpButton.setBackgroundColor(isEnabled ? '#1f5b2f' : '#3f2a07');
    };

    randomJumpButton.on('pointerdown', () => {
      toggleRandomJump();
      updateRandomJumpLabel();
    });

    updateRandomJumpLabel();

    this.add
      .text(this.scale.width / 2, this.scale.height - 138, `Game Speed: FAST x${gameSettings.speedMultiplier.toFixed(2)}`, {
        fontFamily: 'Trebuchet MS',
        fontSize: '20px',
        color: '#c7f5ff',
        stroke: '#08253e',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(this.scale.width / 2, this.scale.height - 90, 'Press SPACE to start', {
        fontFamily: 'Trebuchet MS',
        fontSize: '34px',
        color: '#fff6c6',
        stroke: '#352004',
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: startText,
      alpha: 0.35,
      yoyo: true,
      duration: 620,
      loop: -1,
    });

    this.input.keyboard?.once('keydown-SPACE', () => {
      setPlayerRole('monkey');
      this.scene.start('LevelScene', { levelId: firstLevelId, playerRole: 'monkey' });
    });

    this.input.keyboard?.once('keydown-F', () => {
      setPlayerRole('spud');
      this.scene.start('SecretBossScene', { playerRole: 'spud' });
    });
  }
}
