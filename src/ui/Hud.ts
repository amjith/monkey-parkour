import Phaser from 'phaser';

const heartGlyph = '●';

export class Hud {
  private readonly heartsText: Phaser.GameObjects.Text;

  private readonly messageText: Phaser.GameObjects.Text;

  public constructor(scene: Phaser.Scene, levelName: string, maxHearts: number) {
    this.heartsText = scene.add
      .text(20, 16, this.renderHearts(maxHearts, maxHearts), {
        fontFamily: 'Trebuchet MS',
        fontSize: '24px',
        color: '#fff4b5',
        stroke: '#221100',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(1000);

    scene.add
      .text(20, 50, levelName, {
        fontFamily: 'Trebuchet MS',
        fontSize: '18px',
        color: '#dff7ff',
        stroke: '#032235',
        strokeThickness: 3,
      })
      .setScrollFactor(0)
      .setDepth(1000);

    this.messageText = scene.add
      .text(scene.scale.width / 2, 26, '', {
        fontFamily: 'Trebuchet MS',
        fontSize: '22px',
        color: '#ffe8a6',
        stroke: '#251902',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setOrigin(0.5, 0)
      .setDepth(1001)
      .setVisible(false);
  }

  public updateHearts(currentHearts: number, maxHearts: number): void {
    this.heartsText.setText(this.renderHearts(currentHearts, maxHearts));
  }

  public flashCheckpoint(scene: Phaser.Scene): void {
    this.messageText.setText('Checkpoint reached').setVisible(true);
    scene.tweens.killTweensOf(this.messageText);
    this.messageText.alpha = 1;
    scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: 650,
      duration: 700,
      onComplete: () => {
        this.messageText.setVisible(false);
      },
    });
  }

  public setPauseVisible(isPaused: boolean): void {
    if (isPaused) {
      this.messageText.setText('Paused (P to resume)').setVisible(true).setAlpha(1);
      return;
    }

    this.messageText.setVisible(false);
  }

  public showBanner(scene: Phaser.Scene, text: string, durationMs: number): void {
    this.messageText.setText(text).setVisible(true).setAlpha(1);
    scene.tweens.killTweensOf(this.messageText);
    scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: durationMs,
      duration: 500,
      onComplete: () => {
        this.messageText.setVisible(false);
      },
    });
  }

  private renderHearts(currentHearts: number, maxHearts: number): string {
    const full = heartGlyph.repeat(Math.max(0, currentHearts));
    const empty = '○'.repeat(Math.max(0, maxHearts - currentHearts));
    return `Hearts: ${full}${empty}`;
  }
}
