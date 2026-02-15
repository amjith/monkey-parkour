import Phaser from 'phaser';
import { gameSettings } from '../data/gameSettings';

interface PlayerControlKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
  altLeft: Phaser.Input.Keyboard.Key;
  altRight: Phaser.Input.Keyboard.Key;
  altJump: Phaser.Input.Keyboard.Key;
}

export class PlayerController {
  private readonly sprite: Phaser.Physics.Arcade.Sprite;

  private readonly keys: PlayerControlKeys;

  private readonly baseMoveSpeed = 260;

  private readonly baseJumpSpeed = 610;

  private readonly coyoteMs = 110;

  private readonly jumpBufferMs = 120;

  private lastGroundedAt = -1000;

  private lastJumpPressAt = -1000;

  private jumpConsumed = false;

  private nextRandomJumpAt = -1;

  public isInputEnabled = true;

  public constructor(scene: Phaser.Scene, sprite: Phaser.Physics.Arcade.Sprite) {
    this.sprite = sprite;

    this.keys = {
      left: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      jump: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      altLeft: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      altRight: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      altJump: scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
    };
  }

  public update(time: number): void {
    if (!this.isInputEnabled) {
      this.sprite.setVelocityX(0);
      return;
    }

    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const speedMultiplier = Math.max(1, gameSettings.speedMultiplier);
    const moveSpeed = this.baseMoveSpeed * speedMultiplier;
    const jumpSpeed = this.baseJumpSpeed * speedMultiplier;
    const movingLeft = this.keys.left.isDown || this.keys.altLeft.isDown;
    const movingRight = this.keys.right.isDown || this.keys.altRight.isDown;

    if (movingLeft === movingRight) {
      this.sprite.setVelocityX(0);
    } else if (movingLeft) {
      this.sprite.setVelocityX(-moveSpeed);
      this.sprite.setFlipX(true);
    } else {
      this.sprite.setVelocityX(moveSpeed);
      this.sprite.setFlipX(false);
    }

    if (body.blocked.down || body.touching.down) {
      this.lastGroundedAt = time;
      this.jumpConsumed = false;
    }

    if (!gameSettings.randomJumpEnabled) {
      this.nextRandomJumpAt = -1;
    } else {
      if (this.nextRandomJumpAt < 0) {
        this.nextRandomJumpAt = time + Phaser.Math.Between(450, 1200);
      }

      if ((body.blocked.down || body.touching.down) && time >= this.nextRandomJumpAt) {
        this.lastJumpPressAt = time;
        this.nextRandomJumpAt = time + Phaser.Math.Between(450, 1200);
      }
    }

    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.keys.jump) || Phaser.Input.Keyboard.JustDown(this.keys.altJump);

    if (jumpPressed) {
      this.lastJumpPressAt = time;
    }

    const bufferedJump = time - this.lastJumpPressAt <= this.jumpBufferMs;
    const canUseCoyote = time - this.lastGroundedAt <= this.coyoteMs;

    if (!this.jumpConsumed && bufferedJump && canUseCoyote) {
      this.sprite.setVelocityY(-jumpSpeed);
      this.jumpConsumed = true;
      this.lastJumpPressAt = -1000;
    }

    const releasedJump = Phaser.Input.Keyboard.JustUp(this.keys.jump) || Phaser.Input.Keyboard.JustUp(this.keys.altJump);

    if (releasedJump && body.velocity.y < -160) {
      this.sprite.setVelocityY(body.velocity.y * 0.55);
    }
  }
}
