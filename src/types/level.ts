import type { BossEventDefinition } from './boss';
import type { HazardDefinition } from './hazard';

export interface PlatformDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GoalDefinition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CheckpointDefinition {
  id: string;
  x: number;
  y: number;
  spawn: {
    x: number;
    y: number;
  };
}

export interface SpringDefinition {
  id: string;
  x: number;
  y: number;
  launchX: number;
  launchY: number;
}

export interface AutoScrollDefinition {
  enabled: boolean;
  speed: number;
  failMargin: number;
}

export type GroundDangerType = 'spikes' | 'lava' | 'fire';

export interface GroundDangerDefinition {
  type: GroundDangerType;
}

export interface LevelDefinition {
  id: string;
  name: string;
  tilemapKey: string;
  backgroundKey: string;
  goalTextureKey?: string;
  playerSpawn: {
    x: number;
    y: number;
  };
  goal: GoalDefinition;
  checkpoints: CheckpointDefinition[];
  hazards: HazardDefinition[];
  springs: SpringDefinition[];
  bossEvent?: BossEventDefinition;
  autoScroll?: AutoScrollDefinition;
  musicKey: string;
  worldWidth: number;
  worldHeight: number;
  platforms: PlatformDefinition[];
  groundDanger: GroundDangerDefinition;
}
