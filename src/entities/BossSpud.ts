import Phaser from 'phaser';

export class BossSpud {
  private readonly scene: Phaser.Scene;

  private readonly sprite: Phaser.Physics.Arcade.Sprite;

  public constructor(scene: Phaser.Scene, startX: number, startY: number, intangible: boolean) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(startX, startY, 'tx_boss').setDepth(24);
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    this.sprite.setImmovable(true);

    if (intangible) {
      this.sprite.disableBody(false, false);
    }
  }

  public get physicsSprite(): Phaser.Physics.Arcade.Sprite {
    return this.sprite;
  }

  public enterAndSteal(
    banana: Phaser.GameObjects.Sprite,
    targetX: number,
    targetY: number,
    endX: number,
    endY: number,
    cutsceneDurationMs: number,
    onComplete: () => void,
  ): void {
    const inboundDuration = Math.max(500, Math.floor(cutsceneDurationMs * 0.32));
    const stealDuration = Math.max(220, Math.floor(cutsceneDurationMs * 0.18));
    const escapeDuration = Math.max(500, Math.floor(cutsceneDurationMs * 0.34));
    const tailDelay = Math.max(100, cutsceneDurationMs - inboundDuration - stealDuration - escapeDuration);

    this.scene.tweens.add({
      targets: this.sprite,
      x: targetX,
      y: targetY,
      duration: inboundDuration,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.scene.tweens.add({
          targets: banana,
          alpha: 0,
          scale: 0.25,
          duration: stealDuration,
          ease: 'Back.easeIn',
          onComplete: () => {
            banana.setVisible(false);
            this.scene.tweens.add({
              targets: this.sprite,
              x: endX,
              y: endY,
              duration: escapeDuration,
              ease: 'Quad.easeIn',
              onComplete: () => {
                this.scene.time.delayedCall(tailDelay, onComplete);
              },
            });
          },
        });
      },
    });
  }

  public setChasePosition(x: number, y: number): void {
    this.sprite.x = x;
    this.sprite.y = Phaser.Math.Linear(this.sprite.y, y, 0.1);
  }

  public destroy(): void {
    this.sprite.destroy();
  }
}
