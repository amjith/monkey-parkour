export interface GameSettings {
  speedMultiplier: number;
  randomJumpEnabled: boolean;
  impossibleModeEnabled: boolean;
  impossibleRainMultiplier: number;
  playerRole: PlayableRole;
}

export type PlayableRole = 'monkey' | 'spud';

export const gameSettings: GameSettings = {
  speedMultiplier: 1.35,
  randomJumpEnabled: false,
  impossibleModeEnabled: false,
  impossibleRainMultiplier: 7.0,
  playerRole: 'monkey',
};

export const toggleRandomJump = (): boolean => {
  gameSettings.randomJumpEnabled = !gameSettings.randomJumpEnabled;
  return gameSettings.randomJumpEnabled;
};

export const toggleImpossibleMode = (): boolean => {
  gameSettings.impossibleModeEnabled = !gameSettings.impossibleModeEnabled;
  return gameSettings.impossibleModeEnabled;
};

export const setPlayerRole = (role: PlayableRole): PlayableRole => {
  gameSettings.playerRole = role;
  return gameSettings.playerRole;
};
