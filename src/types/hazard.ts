export type HazardType = 'falling' | 'boulder' | 'snail' | 'firePlant' | 'spring';

export interface HazardPathNode {
  x: number;
  y: number;
  waitMs?: number;
}

export interface HazardDefinition {
  id: string;
  type: HazardType;
  position: {
    x: number;
    y: number;
  };
  path?: HazardPathNode[];
  damage: number;
  knockback: {
    x: number;
    y: number;
  };
  respawnMs?: number;
  config?: Record<string, number | string | boolean>;
}
