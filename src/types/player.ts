export interface PlayerState {
  hearts: number;
  maxHearts: number;
  isInvulnerable: boolean;
  invulnerableUntil: number;
  lastCheckpoint: {
    x: number;
    y: number;
  };
  isAlive: boolean;
}
