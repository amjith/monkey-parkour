import Phaser from 'phaser';
import { createGameTextures } from '../systems/TextureFactory';

export class BootScene extends Phaser.Scene {
  public constructor() {
    super('BootScene');
  }

  public create(): void {
    createGameTextures(this);
    this.scene.start('MainMenuScene');
  }
}
