import Phaser from 'phaser';

const hasTexture = (scene: Phaser.Scene, key: string): boolean => scene.textures.exists(key);

const makeGraphics = (scene: Phaser.Scene): Phaser.GameObjects.Graphics => scene.add.graphics({ x: 0, y: 0 });

const createRoundedRectTexture = (
  scene: Phaser.Scene,
  key: string,
  width: number,
  height: number,
  fillColor: number,
  strokeColor: number,
): void => {
  if (hasTexture(scene, key)) {
    return;
  }

  const graphics = makeGraphics(scene);
  graphics.lineStyle(3, strokeColor, 1);
  graphics.fillStyle(fillColor, 1);
  graphics.fillRoundedRect(0, 0, width, height, 8);
  graphics.strokeRoundedRect(0, 0, width, height, 8);
  graphics.generateTexture(key, width, height);
  graphics.destroy();
};

const createCircleTexture = (
  scene: Phaser.Scene,
  key: string,
  radius: number,
  fillColor: number,
  strokeColor: number,
): void => {
  if (hasTexture(scene, key)) {
    return;
  }

  const size = radius * 2;
  const graphics = makeGraphics(scene);
  graphics.lineStyle(3, strokeColor, 1);
  graphics.fillStyle(fillColor, 1);
  graphics.fillCircle(radius, radius, radius - 2);
  graphics.strokeCircle(radius, radius, radius - 2);
  graphics.generateTexture(key, size, size);
  graphics.destroy();
};

const createPlayerTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_player')) {
    return;
  }

  const graphics = makeGraphics(scene);
  graphics.fillStyle(0x8d5524, 1);
  graphics.fillCircle(24, 24, 16);
  graphics.fillCircle(12, 14, 7);
  graphics.fillCircle(36, 14, 7);
  graphics.fillStyle(0xf1d2a9, 1);
  graphics.fillRoundedRect(14, 20, 20, 15, 6);
  graphics.fillStyle(0x2b1a0f, 1);
  graphics.fillCircle(20, 22, 2);
  graphics.fillCircle(28, 22, 2);
  graphics.fillRect(18, 32, 12, 4);
  graphics.generateTexture('tx_player', 48, 48);
  graphics.destroy();
};

const createBossTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_boss')) {
    return;
  }

  const graphics = makeGraphics(scene);
  graphics.fillStyle(0xf2d95c, 1);
  graphics.fillEllipse(42, 44, 70, 82);
  graphics.fillStyle(0x3f6ea5, 1);
  graphics.fillRoundedRect(18, 52, 48, 30, 8);
  graphics.fillStyle(0xa0d4ff, 1);
  graphics.fillRect(24, 54, 12, 25);
  graphics.fillRect(48, 54, 12, 25);
  graphics.fillStyle(0x707070, 1);
  graphics.fillRoundedRect(20, 30, 20, 10, 5);
  graphics.fillRoundedRect(44, 30, 20, 10, 5);
  graphics.fillStyle(0x262626, 1);
  graphics.fillCircle(30, 35, 4);
  graphics.fillCircle(54, 35, 4);
  graphics.generateTexture('tx_boss', 84, 90);
  graphics.destroy();
};

const createBananaTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_goal')) {
    return;
  }

  const graphics = makeGraphics(scene);
  const centerX = 40;
  const centerY = 42;
  const outerRadius = 26;
  const startAngle = Phaser.Math.DegToRad(216);
  const endAngle = Phaser.Math.DegToRad(342);

  const outerStartX = centerX + Math.cos(startAngle) * outerRadius;
  const outerStartY = centerY + Math.sin(startAngle) * outerRadius;
  const outerEndX = centerX + Math.cos(endAngle) * outerRadius;
  const outerEndY = centerY + Math.sin(endAngle) * outerRadius;

  // Soft aura to make the banana read as extra golden from a distance.
  graphics.lineStyle(24, 0xffe38a, 0.34);
  graphics.beginPath();
  graphics.arc(centerX, centerY, outerRadius + 1, startAngle, endAngle, false);
  graphics.strokePath();

  graphics.lineStyle(18, 0xffcc1a, 1);
  graphics.beginPath();
  graphics.arc(centerX, centerY, outerRadius, startAngle, endAngle, false);
  graphics.strokePath();

  // Round the arc caps so the sprite looks like a banana body instead of a bent line.
  graphics.fillStyle(0xffcc1a, 1);
  graphics.fillCircle(outerStartX, outerStartY, 9);
  graphics.fillCircle(outerEndX, outerEndY, 9);

  graphics.lineStyle(9, 0xfff5b1, 0.98);
  graphics.beginPath();
  graphics.arc(centerX + 1, centerY - 1, 19, Phaser.Math.DegToRad(220), Phaser.Math.DegToRad(338), false);
  graphics.strokePath();

  graphics.lineStyle(4, 0xe19d00, 0.95);
  graphics.beginPath();
  graphics.arc(centerX, centerY + 1, 30, Phaser.Math.DegToRad(214), Phaser.Math.DegToRad(346), false);
  graphics.strokePath();

  graphics.fillStyle(0x6a460f, 1);
  graphics.fillCircle(outerStartX - 1, outerStartY - 1, 3);
  graphics.fillCircle(outerEndX + 1, outerEndY + 1, 3);

  graphics.fillStyle(0xfff8cf, 0.85);
  graphics.fillCircle(centerX - 7, centerY - 17, 2);
  graphics.fillCircle(centerX + 2, centerY - 13, 1.5);
  graphics.generateTexture('tx_goal', 80, 70);
  graphics.destroy();
};

const createGoldenPineappleTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_goal_pineapple')) {
    return;
  }

  const graphics = makeGraphics(scene);
  const width = 96;
  const height = 116;
  const centerX = width / 2;

  // Crown leaves
  graphics.fillStyle(0x4f9e2a, 1);
  graphics.fillTriangle(centerX, 4, centerX - 12, 32, centerX + 12, 32);
  graphics.fillTriangle(centerX - 16, 12, centerX - 30, 40, centerX - 4, 38);
  graphics.fillTriangle(centerX + 16, 12, centerX + 4, 38, centerX + 30, 40);
  graphics.fillTriangle(centerX - 30, 20, centerX - 40, 44, centerX - 18, 42);
  graphics.fillTriangle(centerX + 30, 20, centerX + 18, 42, centerX + 40, 44);

  // Body
  graphics.fillStyle(0xffcc26, 1);
  graphics.fillEllipse(centerX, 74, 60, 70);
  graphics.lineStyle(3, 0xe39c10, 0.95);
  graphics.strokeEllipse(centerX, 74, 60, 70);

  // Diamond pineapple skin pattern
  graphics.lineStyle(2, 0xd98700, 0.9);
  for (let y = 48; y <= 100; y += 9) {
    graphics.beginPath();
    graphics.moveTo(centerX - 26, y);
    graphics.lineTo(centerX + 26, y + 18);
    graphics.strokePath();

    graphics.beginPath();
    graphics.moveTo(centerX + 26, y);
    graphics.lineTo(centerX - 26, y + 18);
    graphics.strokePath();
  }

  // Bright golden shine
  graphics.fillStyle(0xffef9e, 0.85);
  graphics.fillEllipse(centerX - 10, 60, 12, 10);
  graphics.fillEllipse(centerX + 4, 80, 10, 8);
  graphics.lineStyle(10, 0xffe691, 0.28);
  graphics.strokeEllipse(centerX, 74, 70, 82);

  graphics.generateTexture('tx_goal_pineapple', width, height);
  graphics.destroy();
};

const createCheckpointTextures = (scene: Phaser.Scene): void => {
  createRoundedRectTexture(scene, 'tx_checkpoint_off', 32, 74, 0x9ea7b8, 0x4d5768);
  createRoundedRectTexture(scene, 'tx_checkpoint_on', 32, 74, 0xffdd59, 0xf7a600);
};

const createHazardTextures = (scene: Phaser.Scene): void => {
  if (!hasTexture(scene, 'tx_falling_spikes')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0xb7c4d0, 1);
    graphics.fillTriangle(4, 2, 28, 2, 16, 30);
    graphics.fillStyle(0x7f8e9d, 1);
    graphics.fillTriangle(7, 4, 25, 4, 16, 27);
    graphics.generateTexture('tx_falling_spikes', 32, 32);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_falling_lava')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0xaa2b17, 1);
    graphics.fillCircle(16, 16, 13);
    graphics.fillStyle(0xff8d1f, 0.95);
    graphics.fillCircle(16, 16, 9);
    graphics.fillStyle(0xffd870, 0.7);
    graphics.fillCircle(19, 12, 3);
    graphics.generateTexture('tx_falling_lava', 32, 32);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_falling_fire')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0xff6a16, 0.98);
    graphics.fillTriangle(16, 2, 4, 30, 28, 30);
    graphics.fillStyle(0xffc34a, 0.9);
    graphics.fillTriangle(16, 10, 9, 29, 23, 29);
    graphics.generateTexture('tx_falling_fire', 32, 32);
    graphics.destroy();
  }

  createCircleTexture(scene, 'tx_boulder', 24, 0x6f6f70, 0x3c3d40);

  if (!hasTexture(scene, 'tx_snail')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0x8f5f3c, 1);
    graphics.fillCircle(22, 20, 14);
    graphics.fillStyle(0xcf8a49, 1);
    graphics.fillCircle(22, 20, 8);
    graphics.fillStyle(0x50654f, 1);
    graphics.fillRoundedRect(4, 24, 34, 14, 6);
    graphics.fillStyle(0x222222, 1);
    graphics.fillCircle(12, 30, 2);
    graphics.fillCircle(28, 30, 2);
    graphics.generateTexture('tx_snail', 44, 40);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_fire_plant')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0x2f8f3a, 1);
    graphics.fillRoundedRect(14, 22, 20, 30, 10);
    graphics.fillStyle(0x7bd85d, 1);
    graphics.fillEllipse(24, 18, 34, 22);
    graphics.fillStyle(0x47240e, 1);
    graphics.fillRect(21, 46, 6, 12);
    graphics.generateTexture('tx_fire_plant', 48, 60);
    graphics.destroy();
  }

  createCircleTexture(scene, 'tx_fireball', 10, 0xff7831, 0xbf2f09);

  if (!hasTexture(scene, 'tx_spring')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0x3d89d6, 1);
    graphics.fillRoundedRect(0, 12, 50, 26, 6);
    graphics.fillStyle(0xeaf4ff, 1);
    graphics.fillRect(0, 0, 50, 10);
    graphics.fillStyle(0x1f4c80, 1);
    graphics.fillRect(8, 16, 6, 18);
    graphics.fillRect(20, 16, 6, 18);
    graphics.fillRect(32, 16, 6, 18);
    graphics.generateTexture('tx_spring', 50, 40);
    graphics.destroy();
  }
};

const createConfettiTexture = (scene: Phaser.Scene): void => {
  createRoundedRectTexture(scene, 'tx_confetti', 8, 12, 0xffcc00, 0xef9d00);
};

const createGoalSparkleTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_goal_sparkle')) {
    return;
  }

  const graphics = makeGraphics(scene);
  graphics.fillStyle(0xfff2aa, 1);
  graphics.fillTriangle(6, 0, 10, 6, 2, 6);
  graphics.fillTriangle(6, 12, 2, 6, 10, 6);
  graphics.fillStyle(0xffdd59, 0.9);
  graphics.fillCircle(6, 6, 2);
  graphics.generateTexture('tx_goal_sparkle', 12, 12);
  graphics.destroy();
};

const createSecretBattleTextures = (scene: Phaser.Scene): void => {
  if (!hasTexture(scene, 'tx_banana_shot')) {
    const graphics = makeGraphics(scene);
    graphics.fillStyle(0xffd84a, 1);
    graphics.fillRoundedRect(2, 5, 20, 8, 5);
    graphics.fillStyle(0xfff1ad, 0.9);
    graphics.fillRoundedRect(4, 7, 14, 4, 3);
    graphics.fillStyle(0x6a460f, 1);
    graphics.fillCircle(3, 9, 1.6);
    graphics.fillCircle(21, 9, 1.6);
    graphics.generateTexture('tx_banana_shot', 24, 16);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_fire_pillar')) {
    const width = 48;
    const height = 220;
    const graphics = makeGraphics(scene);

    graphics.fillStyle(0x2a1b13, 0.65);
    graphics.fillRect(8, 0, width - 16, height);

    graphics.fillGradientStyle(0xff5d1e, 0xff8b2a, 0xffca4c, 0xff7a24, 1);
    graphics.fillRect(12, 0, width - 24, height);

    for (let y = 8; y < height; y += 18) {
      const flameOffset = Phaser.Math.Between(-6, 6);
      graphics.fillStyle(0xffe090, 0.72);
      graphics.fillTriangle(
        width / 2 + flameOffset,
        y,
        width / 2 - 8 + flameOffset,
        y + 14,
        width / 2 + 8 + flameOffset,
        y + 14,
      );
    }

    graphics.generateTexture('tx_fire_pillar', width, height);
    graphics.destroy();
  }
};

const createGroundDangerTextures = (scene: Phaser.Scene): void => {
  if (!hasTexture(scene, 'tx_ground_spikes')) {
    const width = 128;
    const height = 84;
    const graphics = makeGraphics(scene);

    graphics.fillStyle(0x4a3b2e, 1);
    graphics.fillRect(0, 48, width, height - 48);

    graphics.fillStyle(0xc9d6df, 1);
    for (let x = 0; x < width; x += 16) {
      graphics.fillTriangle(x, 50, x + 8, 14, x + 16, 50);
    }

    graphics.fillStyle(0x7a8894, 1);
    for (let x = 0; x < width; x += 16) {
      graphics.fillTriangle(x + 2, 50, x + 8, 22, x + 14, 50);
    }

    graphics.generateTexture('tx_ground_spikes', width, height);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_ground_lava')) {
    const width = 128;
    const height = 84;
    const graphics = makeGraphics(scene);

    graphics.fillGradientStyle(0x8b1f11, 0xa52b16, 0xff4c13, 0xff8a1f, 1);
    graphics.fillRect(0, 0, width, height);

    graphics.fillStyle(0xffc143, 0.8);
    for (let i = 0; i < 10; i += 1) {
      graphics.fillCircle(Phaser.Math.Between(8, width - 8), Phaser.Math.Between(12, 52), Phaser.Math.Between(3, 7));
    }

    graphics.fillStyle(0x63200f, 0.9);
    graphics.fillRect(0, 62, width, 22);

    graphics.generateTexture('tx_ground_lava', width, height);
    graphics.destroy();
  }

  if (!hasTexture(scene, 'tx_ground_fire')) {
    const width = 128;
    const height = 84;
    const graphics = makeGraphics(scene);

    graphics.fillStyle(0x1f1b20, 1);
    graphics.fillRect(0, 0, width, height);

    for (let i = 0; i < 16; i += 1) {
      const x = i * 8;
      const flameHeight = Phaser.Math.Between(22, 54);
      graphics.fillStyle(0xff7b1c, 0.95);
      graphics.fillTriangle(x, 84, x + 4, 84 - flameHeight, x + 8, 84);
      graphics.fillStyle(0xffc04a, 0.8);
      graphics.fillTriangle(x + 1, 84, x + 4, 84 - flameHeight + 12, x + 7, 84);
    }

    graphics.generateTexture('tx_ground_fire', width, height);
    graphics.destroy();
  }
};

const createBackgroundTexture = (scene: Phaser.Scene): void => {
  if (hasTexture(scene, 'tx_backdrop')) {
    return;
  }

  const width = 512;
  const height = 512;
  const graphics = makeGraphics(scene);

  graphics.fillGradientStyle(0x1e3b6c, 0x314f88, 0x82b4d4, 0xaed6f7, 1);
  graphics.fillRect(0, 0, width, height);
  graphics.fillStyle(0xffffff, 0.08);

  for (let i = 0; i < 40; i += 1) {
    graphics.fillCircle(
      Phaser.Math.Between(0, width),
      Phaser.Math.Between(0, height),
      Phaser.Math.Between(12, 32),
    );
  }

  graphics.generateTexture('tx_backdrop', width, height);
  graphics.destroy();
};

export const createGameTextures = (scene: Phaser.Scene): void => {
  createBackgroundTexture(scene);
  createRoundedRectTexture(scene, 'tx_platform', 128, 32, 0x4f7c45, 0x2e4e2a);
  createPlayerTexture(scene);
  createBossTexture(scene);
  createBananaTexture(scene);
  createGoldenPineappleTexture(scene);
  createCheckpointTextures(scene);
  createHazardTextures(scene);
  createConfettiTexture(scene);
  createGoalSparkleTexture(scene);
  createSecretBattleTextures(scene);
  createGroundDangerTextures(scene);
};
