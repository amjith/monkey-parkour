export interface BossEventDefinition {
  triggerRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  cutsceneDurationMs: number;
  bananaStealAnimationKey: string;
  nextLevelId: string;
}
