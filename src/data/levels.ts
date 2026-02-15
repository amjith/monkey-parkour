import type { LevelDefinition } from '../types/level';

const levels: Record<string, LevelDefinition> = {
  'level-1': {
    id: 'level-1',
    name: 'Jungle Run',
    tilemapKey: 'tilemap-jungle-1',
    backgroundKey: 'bg-dawn-jungle',
    playerSpawn: { x: 140, y: 1080 },
    goal: { x: 3380, y: 565, width: 120, height: 170 },
    checkpoints: [
      { id: 'l1-c1', x: 930, y: 980, spawn: { x: 930, y: 980 } },
      { id: 'l1-c2', x: 2050, y: 830, spawn: { x: 2050, y: 830 } },
      { id: 'l1-c3', x: 2920, y: 680, spawn: { x: 2920, y: 680 } },
    ],
    hazards: [
      {
        id: 'l1-fall-1',
        type: 'falling',
        position: { x: 980, y: 260 },
        path: [
          { x: 780, y: 260 },
          { x: 1160, y: 260 },
        ],
        damage: 1,
        knockback: { x: -240, y: -360 },
        respawnMs: 1650,
      },
      {
        id: 'l1-boulder-1',
        type: 'boulder',
        position: { x: 1460, y: 860 },
        path: [
          { x: 1320, y: 860 },
          { x: 1610, y: 860 },
        ],
        damage: 1,
        knockback: { x: -260, y: -320 },
        config: { speed: 95 },
      },
      {
        id: 'l1-snail-1',
        type: 'snail',
        position: { x: 2120, y: 845 },
        path: [
          { x: 1980, y: 845 },
          { x: 2240, y: 845 },
        ],
        damage: 1,
        knockback: { x: -220, y: -300 },
        config: { speed: 58 },
      },
      {
        id: 'l1-plant-1',
        type: 'firePlant',
        position: { x: 2420, y: 795 },
        damage: 1,
        knockback: { x: -210, y: -320 },
        config: { shootIntervalMs: 1500, projectileSpeed: 260 },
      },
      {
        id: 'l1-fall-2',
        type: 'falling',
        position: { x: 2820, y: 250 },
        path: [
          { x: 2660, y: 250 },
          { x: 3000, y: 250 },
        ],
        damage: 1,
        knockback: { x: -230, y: -340 },
        respawnMs: 1400,
      },
    ],
    springs: [
      { id: 'l1-s1', x: 1730, y: 985, launchX: -360, launchY: -620 },
      { id: 'l1-s2', x: 3060, y: 685, launchX: -300, launchY: -560 },
    ],
    bossEvent: {
      triggerRegion: { x: 3290, y: 560, width: 250, height: 210 },
      cutsceneDurationMs: 2200,
      bananaStealAnimationKey: 'boss-steal',
      nextLevelId: 'level-2',
    },
    autoScroll: { enabled: false, speed: 0, failMargin: 0 },
    musicKey: 'music-jungle-loop',
    worldWidth: 3600,
    worldHeight: 1400,
    groundDanger: {
      type: 'spikes',
    },
    platforms: [
      { x: 200, y: 1160, width: 520, height: 54 },
      { x: 760, y: 1100, width: 280, height: 40 },
      { x: 1080, y: 1020, width: 260, height: 36 },
      { x: 1400, y: 950, width: 260, height: 36 },
      { x: 1730, y: 1020, width: 300, height: 36 },
      { x: 2080, y: 930, width: 260, height: 36 },
      { x: 2400, y: 850, width: 260, height: 36 },
      { x: 2730, y: 780, width: 300, height: 36 },
      { x: 3060, y: 720, width: 260, height: 34 },
      { x: 3360, y: 660, width: 260, height: 34 },
    ],
  },
  'level-2': {
    id: 'level-2',
    name: 'Volcanic Canopy',
    tilemapKey: 'tilemap-jungle-2',
    backgroundKey: 'bg-volcano-noon',
    playerSpawn: { x: 150, y: 1120 },
    goal: { x: 3620, y: 545, width: 120, height: 170 },
    checkpoints: [
      { id: 'l2-c1', x: 980, y: 930, spawn: { x: 980, y: 930 } },
      { id: 'l2-c2', x: 2140, y: 800, spawn: { x: 2140, y: 800 } },
      { id: 'l2-c3', x: 3220, y: 600, spawn: { x: 3220, y: 600 } },
    ],
    hazards: [
      {
        id: 'l2-fall-1',
        type: 'falling',
        position: { x: 1110, y: 220 },
        path: [
          { x: 900, y: 220 },
          { x: 1320, y: 220 },
        ],
        damage: 1,
        knockback: { x: -250, y: -360 },
        respawnMs: 1200,
      },
      {
        id: 'l2-boulder-1',
        type: 'boulder',
        position: { x: 1740, y: 900 },
        path: [
          { x: 1640, y: 900 },
          { x: 1860, y: 900 },
        ],
        damage: 1,
        knockback: { x: -280, y: -340 },
        config: { speed: 130 },
      },
      {
        id: 'l2-snail-1',
        type: 'snail',
        position: { x: 2260, y: 800 },
        path: [
          { x: 2180, y: 800 },
          { x: 2360, y: 800 },
        ],
        damage: 1,
        knockback: { x: -220, y: -310 },
        config: { speed: 74 },
      },
      {
        id: 'l2-plant-1',
        type: 'firePlant',
        position: { x: 2540, y: 865 },
        damage: 1,
        knockback: { x: -230, y: -320 },
        config: { shootIntervalMs: 1200, projectileSpeed: 320 },
      },
      {
        id: 'l2-fall-2',
        type: 'falling',
        position: { x: 2870, y: 210 },
        path: [
          { x: 2700, y: 210 },
          { x: 3040, y: 210 },
        ],
        damage: 1,
        knockback: { x: -250, y: -340 },
        respawnMs: 1000,
      },
      {
        id: 'l2-boulder-2',
        type: 'boulder',
        position: { x: 3070, y: 730 },
        path: [
          { x: 2960, y: 730 },
          { x: 3170, y: 730 },
        ],
        damage: 1,
        knockback: { x: -290, y: -330 },
        config: { speed: 145 },
      },
      {
        id: 'l2-plant-2',
        type: 'firePlant',
        position: { x: 3320, y: 670 },
        damage: 1,
        knockback: { x: -210, y: -310 },
        config: { shootIntervalMs: 1100, projectileSpeed: 340 },
      },
    ],
    springs: [
      { id: 'l2-s1', x: 1710, y: 955, launchX: -410, launchY: -640 },
      { id: 'l2-s2', x: 2780, y: 795, launchX: -390, launchY: -620 },
    ],
    bossEvent: {
      triggerRegion: { x: 3530, y: 530, width: 250, height: 220 },
      cutsceneDurationMs: 2300,
      bananaStealAnimationKey: 'boss-steal',
      nextLevelId: 'level-3',
    },
    autoScroll: { enabled: false, speed: 0, failMargin: 0 },
    musicKey: 'music-volcanic-loop',
    worldWidth: 3900,
    worldHeight: 1450,
    groundDanger: {
      type: 'lava',
    },
    platforms: [
      { x: 180, y: 1180, width: 420, height: 52 },
      { x: 620, y: 1100, width: 220, height: 36 },
      { x: 900, y: 1040, width: 220, height: 34 },
      { x: 1180, y: 980, width: 220, height: 34 },
      { x: 1460, y: 920, width: 220, height: 34 },
      { x: 1720, y: 990, width: 220, height: 34 },
      { x: 1990, y: 910, width: 220, height: 34 },
      { x: 2260, y: 840, width: 220, height: 34 },
      { x: 2530, y: 910, width: 220, height: 34 },
      { x: 2800, y: 830, width: 220, height: 34 },
      { x: 3070, y: 760, width: 220, height: 34 },
      { x: 3340, y: 700, width: 220, height: 34 },
      { x: 3610, y: 640, width: 220, height: 34 },
    ],
  },
  'level-3': {
    id: 'level-3',
    name: 'Final Escape',
    tilemapKey: 'tilemap-jungle-3',
    backgroundKey: 'bg-golden-dusk',
    playerSpawn: { x: 180, y: 1110 },
    goal: { x: 4310, y: 430, width: 120, height: 170 },
    checkpoints: [
      { id: 'l3-c1', x: 1200, y: 900, spawn: { x: 1200, y: 900 } },
      { id: 'l3-c2', x: 2480, y: 740, spawn: { x: 2480, y: 740 } },
      { id: 'l3-c3', x: 3530, y: 580, spawn: { x: 3530, y: 580 } },
    ],
    hazards: [
      {
        id: 'l3-fall-1',
        type: 'falling',
        position: { x: 1030, y: 220 },
        path: [
          { x: 870, y: 220 },
          { x: 1210, y: 220 },
        ],
        damage: 1,
        knockback: { x: -280, y: -360 },
        respawnMs: 1100,
      },
      {
        id: 'l3-boulder-1',
        type: 'boulder',
        position: { x: 1530, y: 840 },
        path: [
          { x: 1430, y: 840 },
          { x: 1620, y: 840 },
        ],
        damage: 1,
        knockback: { x: -300, y: -350 },
        config: { speed: 150 },
      },
      {
        id: 'l3-snail-1',
        type: 'snail',
        position: { x: 2110, y: 810 },
        path: [
          { x: 2040, y: 810 },
          { x: 2200, y: 810 },
        ],
        damage: 1,
        knockback: { x: -230, y: -320 },
        config: { speed: 80 },
      },
      {
        id: 'l3-plant-1',
        type: 'firePlant',
        position: { x: 2720, y: 825 },
        damage: 1,
        knockback: { x: -220, y: -320 },
        config: { shootIntervalMs: 1100, projectileSpeed: 360 },
      },
      {
        id: 'l3-fall-2',
        type: 'falling',
        position: { x: 3330, y: 200 },
        path: [
          { x: 3200, y: 200 },
          { x: 3460, y: 200 },
        ],
        damage: 1,
        knockback: { x: -280, y: -350 },
        respawnMs: 900,
      },
      {
        id: 'l3-plant-2',
        type: 'firePlant',
        position: { x: 3620, y: 605 },
        damage: 1,
        knockback: { x: -220, y: -320 },
        config: { shootIntervalMs: 950, projectileSpeed: 380 },
      },
    ],
    springs: [
      { id: 'l3-s1', x: 1820, y: 905, launchX: -430, launchY: -650 },
      { id: 'l3-s2', x: 3320, y: 675, launchX: -420, launchY: -640 },
    ],
    autoScroll: { enabled: true, speed: 190, failMargin: 84 },
    musicKey: 'music-final-loop',
    worldWidth: 4500,
    worldHeight: 1450,
    groundDanger: {
      type: 'fire',
    },
    platforms: [
      { x: 220, y: 1160, width: 360, height: 52 },
      { x: 620, y: 1080, width: 250, height: 36 },
      { x: 920, y: 1010, width: 250, height: 36 },
      { x: 1220, y: 940, width: 250, height: 36 },
      { x: 1520, y: 870, width: 250, height: 36 },
      { x: 1820, y: 940, width: 250, height: 36 },
      { x: 2120, y: 860, width: 250, height: 36 },
      { x: 2420, y: 790, width: 250, height: 36 },
      { x: 2720, y: 860, width: 250, height: 36 },
      { x: 3020, y: 780, width: 250, height: 36 },
      { x: 3320, y: 710, width: 250, height: 36 },
      { x: 3620, y: 640, width: 250, height: 36 },
      { x: 3920, y: 580, width: 250, height: 36 },
      { x: 4220, y: 520, width: 220, height: 34 },
    ],
  },
};

const createSpudBonusLevel = (
  sourceLevelId: 'level-1' | 'level-2' | 'level-3',
  newLevelId: string,
  name: string,
  groundType: 'spikes' | 'lava' | 'fire',
  backgroundKey: string,
  goalTextureKey: string,
): LevelDefinition => {
  const source = levels[sourceLevelId];

  return {
    ...source,
    id: newLevelId,
    name,
    tilemapKey: `tilemap-${newLevelId}`,
    backgroundKey,
    goalTextureKey,
    goal: { ...source.goal },
    checkpoints: source.checkpoints.map((checkpoint, index) => ({
      ...checkpoint,
      id: `${newLevelId}-c${index + 1}`,
      spawn: { ...checkpoint.spawn },
    })),
    hazards: source.hazards.map((hazard, index) => ({
      ...hazard,
      id: `${newLevelId}-h${index + 1}`,
      position: { ...hazard.position },
      knockback: { ...hazard.knockback },
      path: hazard.path?.map((node) => ({ ...node })),
      config: hazard.config ? { ...hazard.config } : undefined,
    })),
    springs: source.springs.map((spring, index) => ({
      ...spring,
      id: `${newLevelId}-s${index + 1}`,
    })),
    bossEvent: undefined,
    autoScroll: { enabled: false, speed: 0, failMargin: 0 },
    musicKey: `music-${newLevelId}`,
    platforms: source.platforms.map((platform) => ({ ...platform })),
    groundDanger: { type: groundType },
  };
};

levels['spud-level-4'] = createSpudBonusLevel(
  'level-1',
  'spud-level-4',
  'Spud Gauntlet I',
  'spikes',
  'bg-dawn-jungle',
  'tx_goal_pineapple',
);

levels['spud-level-5'] = createSpudBonusLevel(
  'level-2',
  'spud-level-5',
  'Spud Gauntlet II',
  'lava',
  'bg-volcano-noon',
  'tx_goal_pineapple',
);

levels['spud-level-6'] = createSpudBonusLevel(
  'level-3',
  'spud-level-6',
  'Spud Gauntlet III',
  'fire',
  'bg-golden-dusk',
  'tx_goal_pineapple',
);

levels['spud-level-4'].worldWidth = 4400;
levels['spud-level-4'].worldHeight = 1500;
levels['spud-level-4'].playerSpawn = { x: 120, y: 1250 };
levels['spud-level-4'].goal = { x: 4200, y: 560, width: 120, height: 170 };
levels['spud-level-4'].checkpoints = [
  { id: 'spud-level-4-c1', x: 1120, y: 1110, spawn: { x: 1120, y: 1110 } },
  { id: 'spud-level-4-c2', x: 2460, y: 700, spawn: { x: 2460, y: 700 } },
  { id: 'spud-level-4-c3', x: 3440, y: 710, spawn: { x: 3440, y: 710 } },
  { id: 'spud-level-4-c4', x: 3740, y: 680, spawn: { x: 3740, y: 680 } },
  { id: 'spud-level-4-c5', x: 4040, y: 620, spawn: { x: 4040, y: 620 } },
];
levels['spud-level-4'].platforms = [
  { x: 180, y: 1330, width: 380, height: 56 },
  { x: 590, y: 1270, width: 250, height: 36 },
  { x: 900, y: 1210, width: 240, height: 36 },
  { x: 1210, y: 1120, width: 240, height: 36 },
  { x: 1520, y: 1020, width: 240, height: 36 },
  { x: 1830, y: 980, width: 250, height: 36 },
  { x: 2140, y: 900, width: 250, height: 36 },
  { x: 2450, y: 820, width: 250, height: 36 },
  { x: 2760, y: 900, width: 250, height: 36 },
  { x: 3070, y: 820, width: 250, height: 36 },
  { x: 3380, y: 740, width: 250, height: 36 },
  { x: 3690, y: 680, width: 240, height: 34 },
  { x: 3990, y: 620, width: 230, height: 34 },
  { x: 4250, y: 580, width: 190, height: 32 },
];
levels['spud-level-4'].springs = [
  { id: 'spud-level-4-s1', x: 1700, y: 955, launchX: -470, launchY: -700 },
  { id: 'spud-level-4-s2', x: 3120, y: 785, launchX: -460, launchY: -680 },
  { id: 'spud-level-4-s3', x: 3920, y: 645, launchX: -420, launchY: -650 },
];
levels['spud-level-4'].hazards = [
  ...levels['spud-level-4'].hazards.map((hazard, index) => ({
    ...hazard,
    id: `spud-level-4-h${index + 1}`,
    damage: hazard.type === 'falling' ? 1 : 2,
    respawnMs: hazard.type === 'falling' ? Math.max(380, Math.floor((hazard.respawnMs ?? 1200) * 0.58)) : hazard.respawnMs,
    config:
      hazard.type === 'boulder'
        ? { speed: Number(hazard.config?.speed ?? 110) + 95 }
        : hazard.type === 'snail'
          ? { speed: Number(hazard.config?.speed ?? 70) + 55 }
          : hazard.type === 'firePlant'
            ? {
                shootIntervalMs: Math.max(520, Math.floor(Number(hazard.config?.shootIntervalMs ?? 1200) * 0.55)),
                projectileSpeed: Number(hazard.config?.projectileSpeed ?? 280) + 160,
              }
            : hazard.config,
  })),
  {
    id: 'spud-level-4-extra-fall-1',
    type: 'falling',
    position: { x: 3410, y: 220 },
    path: [
      { x: 3200, y: 220 },
      { x: 3620, y: 220 },
    ],
    damage: 1,
    knockback: { x: -280, y: -380 },
    respawnMs: 520,
  },
  {
    id: 'spud-level-4-extra-boulder-1',
    type: 'boulder',
    position: { x: 2800, y: 870 },
    path: [
      { x: 2670, y: 870 },
      { x: 2920, y: 870 },
    ],
    damage: 2,
    knockback: { x: -330, y: -380 },
    config: { speed: 255 },
  },
  {
    id: 'spud-level-4-extra-plant-1',
    type: 'firePlant',
    position: { x: 3550, y: 690 },
    damage: 2,
    knockback: { x: -250, y: -340 },
    config: { shootIntervalMs: 620, projectileSpeed: 520 },
  },
];

levels['spud-level-5'].worldWidth = 5000;
levels['spud-level-5'].worldHeight = 1560;
levels['spud-level-5'].playerSpawn = { x: 130, y: 1210 };
levels['spud-level-5'].goal = { x: 4790, y: 510, width: 120, height: 170 };
levels['spud-level-5'].checkpoints = [
  { id: 'spud-level-5-c1', x: 1260, y: 980, spawn: { x: 1260, y: 980 } },
  { id: 'spud-level-5-c2', x: 2760, y: 680, spawn: { x: 2760, y: 680 } },
  { id: 'spud-level-5-c3', x: 3920, y: 640, spawn: { x: 3920, y: 640 } },
  { id: 'spud-level-5-c4', x: 4240, y: 560, spawn: { x: 4240, y: 560 } },
  { id: 'spud-level-5-c5', x: 4630, y: 520, spawn: { x: 4630, y: 520 } },
];
levels['spud-level-5'].platforms = [
  { x: 180, y: 1260, width: 400, height: 56 },
  { x: 620, y: 1170, width: 240, height: 36 },
  { x: 920, y: 1090, width: 240, height: 36 },
  { x: 1220, y: 1010, width: 240, height: 36 },
  { x: 1520, y: 930, width: 240, height: 36 },
  { x: 1820, y: 1010, width: 240, height: 36 },
  { x: 2120, y: 930, width: 240, height: 36 },
  { x: 2420, y: 850, width: 240, height: 36 },
  { x: 2720, y: 770, width: 240, height: 36 },
  { x: 3020, y: 850, width: 240, height: 36 },
  { x: 3320, y: 770, width: 240, height: 36 },
  { x: 3620, y: 690, width: 240, height: 36 },
  { x: 3920, y: 620, width: 240, height: 34 },
  { x: 4220, y: 560, width: 240, height: 34 },
  { x: 4520, y: 520, width: 220, height: 34 },
  { x: 4790, y: 520, width: 180, height: 32 },
];
levels['spud-level-5'].springs = [
  { id: 'spud-level-5-s1', x: 1760, y: 975, launchX: -520, launchY: -720 },
  { id: 'spud-level-5-s2', x: 3020, y: 815, launchX: -500, launchY: -700 },
  { id: 'spud-level-5-s3', x: 4300, y: 535, launchX: -460, launchY: -670 },
];
levels['spud-level-5'].hazards = [
  ...levels['spud-level-5'].hazards.map((hazard, index) => ({
    ...hazard,
    id: `spud-level-5-h${index + 1}`,
    damage: hazard.type === 'falling' ? 1 : 2,
    respawnMs: hazard.type === 'falling' ? Math.max(320, Math.floor((hazard.respawnMs ?? 1100) * 0.5)) : hazard.respawnMs,
    config:
      hazard.type === 'boulder'
        ? { speed: Number(hazard.config?.speed ?? 120) + 120 }
        : hazard.type === 'snail'
          ? { speed: Number(hazard.config?.speed ?? 70) + 75 }
          : hazard.type === 'firePlant'
            ? {
                shootIntervalMs: Math.max(470, Math.floor(Number(hazard.config?.shootIntervalMs ?? 1100) * 0.48)),
                projectileSpeed: Number(hazard.config?.projectileSpeed ?? 320) + 220,
              }
            : hazard.config,
  })),
  {
    id: 'spud-level-5-extra-fall-1',
    type: 'falling',
    position: { x: 2230, y: 190 },
    path: [
      { x: 2000, y: 190 },
      { x: 2460, y: 190 },
    ],
    damage: 1,
    knockback: { x: -300, y: -390 },
    respawnMs: 420,
  },
  {
    id: 'spud-level-5-extra-fall-2',
    type: 'falling',
    position: { x: 3960, y: 180 },
    path: [
      { x: 3720, y: 180 },
      { x: 4200, y: 180 },
    ],
    damage: 1,
    knockback: { x: -300, y: -390 },
    respawnMs: 390,
  },
  {
    id: 'spud-level-5-extra-boulder-1',
    type: 'boulder',
    position: { x: 3340, y: 810 },
    path: [
      { x: 3220, y: 810 },
      { x: 3460, y: 810 },
    ],
    damage: 2,
    knockback: { x: -350, y: -390 },
    config: { speed: 300 },
  },
  {
    id: 'spud-level-5-extra-snail-1',
    type: 'snail',
    position: { x: 4260, y: 600 },
    path: [
      { x: 4160, y: 600 },
      { x: 4380, y: 600 },
    ],
    damage: 2,
    knockback: { x: -280, y: -360 },
    config: { speed: 190 },
  },
  {
    id: 'spud-level-5-extra-plant-1',
    type: 'firePlant',
    position: { x: 4550, y: 550 },
    damage: 2,
    knockback: { x: -270, y: -350 },
    config: { shootIntervalMs: 500, projectileSpeed: 640 },
  },
];

levels['spud-level-5'].hazards = levels['spud-level-5'].hazards.map((hazard) => {
  if (hazard.type !== 'falling') {
    return hazard;
  }

  const currentMinX = hazard.path?.[0]?.x ?? hazard.position.x - 100;
  const currentMaxX = hazard.path?.[1]?.x ?? hazard.position.x + 100;
  const spreadPadding = 240;
  const expandedMinX = Math.max(120, currentMinX - spreadPadding);
  const expandedMaxX = Math.min(levels['spud-level-5'].worldWidth - 120, currentMaxX + spreadPadding);
  const y = hazard.path?.[0]?.y ?? hazard.position.y;

  return {
    ...hazard,
    path: [
      { x: expandedMinX, y },
      { x: expandedMaxX, y },
    ],
  };
});

levels['spud-level-6'].worldWidth = 5600;
levels['spud-level-6'].worldHeight = 1620;
levels['spud-level-6'].playerSpawn = { x: 130, y: 1240 };
levels['spud-level-6'].goal = { x: 5380, y: 460, width: 130, height: 176 };
levels['spud-level-6'].checkpoints = [
  { id: 'spud-level-6-c1', x: 1380, y: 1010, spawn: { x: 1380, y: 1010 } },
  { id: 'spud-level-6-c2', x: 3160, y: 820, spawn: { x: 3160, y: 820 } },
  { id: 'spud-level-6-c3', x: 4540, y: 640, spawn: { x: 4540, y: 640 } },
  { id: 'spud-level-6-c4', x: 4580, y: 530, spawn: { x: 4580, y: 530 } },
  { id: 'spud-level-6-c5', x: 5100, y: 480, spawn: { x: 5100, y: 480 } },
];
levels['spud-level-6'].platforms = [
  { x: 180, y: 1290, width: 420, height: 56 },
  { x: 640, y: 1190, width: 240, height: 36 },
  { x: 940, y: 1110, width: 240, height: 36 },
  { x: 1240, y: 1030, width: 240, height: 36 },
  { x: 1540, y: 950, width: 240, height: 36 },
  { x: 1840, y: 1030, width: 240, height: 36 },
  { x: 2140, y: 950, width: 240, height: 36 },
  { x: 2440, y: 870, width: 240, height: 36 },
  { x: 2740, y: 790, width: 240, height: 36 },
  { x: 3040, y: 870, width: 240, height: 36 },
  { x: 3340, y: 790, width: 240, height: 36 },
  { x: 3640, y: 710, width: 240, height: 36 },
  { x: 3940, y: 640, width: 240, height: 34 },
  { x: 4240, y: 580, width: 240, height: 34 },
  { x: 4540, y: 530, width: 240, height: 34 },
  { x: 4840, y: 500, width: 230, height: 32 },
  { x: 5140, y: 480, width: 220, height: 32 },
  { x: 5380, y: 470, width: 170, height: 30 },
];
levels['spud-level-6'].springs = [
  { id: 'spud-level-6-s1', x: 1900, y: 995, launchX: -560, launchY: -740 },
  { id: 'spud-level-6-s2', x: 3340, y: 765, launchX: -540, launchY: -720 },
  { id: 'spud-level-6-s3', x: 4680, y: 505, launchX: -500, launchY: -690 },
];
levels['spud-level-6'].hazards = [
  ...levels['spud-level-6'].hazards.map((hazard, index) => ({
    ...hazard,
    id: `spud-level-6-h${index + 1}`,
    damage: hazard.type === 'falling' ? 2 : 2,
    respawnMs: hazard.type === 'falling' ? Math.max(280, Math.floor((hazard.respawnMs ?? 1000) * 0.42)) : hazard.respawnMs,
    config:
      hazard.type === 'boulder'
        ? { speed: Number(hazard.config?.speed ?? 140) + 150 }
        : hazard.type === 'snail'
          ? { speed: Number(hazard.config?.speed ?? 80) + 95 }
          : hazard.type === 'firePlant'
            ? {
                shootIntervalMs: Math.max(420, Math.floor(Number(hazard.config?.shootIntervalMs ?? 1000) * 0.4)),
                projectileSpeed: Number(hazard.config?.projectileSpeed ?? 360) + 280,
              }
            : hazard.config,
  })),
  {
    id: 'spud-level-6-extra-fall-1',
    type: 'falling',
    position: { x: 2010, y: 160 },
    path: [
      { x: 1760, y: 160 },
      { x: 2260, y: 160 },
    ],
    damage: 2,
    knockback: { x: -320, y: -400 },
    respawnMs: 320,
  },
  {
    id: 'spud-level-6-extra-fall-2',
    type: 'falling',
    position: { x: 3870, y: 160 },
    path: [
      { x: 3600, y: 160 },
      { x: 4140, y: 160 },
    ],
    damage: 2,
    knockback: { x: -320, y: -400 },
    respawnMs: 290,
  },
  {
    id: 'spud-level-6-extra-fall-3',
    type: 'falling',
    position: { x: 5080, y: 150 },
    path: [
      { x: 4860, y: 150 },
      { x: 5300, y: 150 },
    ],
    damage: 2,
    knockback: { x: -320, y: -400 },
    respawnMs: 260,
  },
  {
    id: 'spud-level-6-extra-boulder-1',
    type: 'boulder',
    position: { x: 2860, y: 830 },
    path: [
      { x: 2720, y: 830 },
      { x: 3000, y: 830 },
    ],
    damage: 2,
    knockback: { x: -380, y: -420 },
    config: { speed: 350 },
  },
  {
    id: 'spud-level-6-extra-boulder-2',
    type: 'boulder',
    position: { x: 4380, y: 570 },
    path: [
      { x: 4250, y: 570 },
      { x: 4500, y: 570 },
    ],
    damage: 2,
    knockback: { x: -380, y: -420 },
    config: { speed: 370 },
  },
  {
    id: 'spud-level-6-extra-plant-1',
    type: 'firePlant',
    position: { x: 4050, y: 660 },
    damage: 2,
    knockback: { x: -300, y: -380 },
    config: { shootIntervalMs: 450, projectileSpeed: 720 },
  },
  {
    id: 'spud-level-6-extra-plant-2',
    type: 'firePlant',
    position: { x: 5200, y: 500 },
    damage: 2,
    knockback: { x: -300, y: -380 },
    config: { shootIntervalMs: 420, projectileSpeed: 760 },
  },
];

levels['spud-level-6'].autoScroll = { enabled: false, speed: 0, failMargin: 0 };

const monkeyLevelOrder = ['level-1', 'level-2', 'level-3'] as const;
const spudLevelOrder = ['level-1', 'level-2', 'level-3', 'spud-level-4', 'spud-level-5', 'spud-level-6'] as const;

export const getLevelDefinition = (levelId: string): LevelDefinition => {
  const level = levels[levelId];

  if (!level) {
    return levels['level-1'];
  }

  return level;
};

export const getNextLevelId = (levelId: string, playerRole: 'monkey' | 'spud' = 'monkey'): string | null => {
  const levelOrder: readonly string[] = playerRole === 'spud' ? spudLevelOrder : monkeyLevelOrder;
  const levelIndex = levelOrder.indexOf(levelId);
  if (levelIndex < 0) {
    return null;
  }

  return levelOrder[levelIndex + 1] ?? null;
};

export const firstLevelId = 'level-1';
