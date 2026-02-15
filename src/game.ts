import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { SecretBossScene } from './scenes/SecretBossScene';
import { WinScene } from './scenes/WinScene';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

export const createGame = (parent: string): Phaser.Game => {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    backgroundColor: '#1d2f4d',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 1200 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    render: {
      antialias: true,
      pixelArt: false,
    },
    scene: [BootScene, MainMenuScene, LevelScene, SecretBossScene, WinScene],
  };

  return new Phaser.Game(config);
};
