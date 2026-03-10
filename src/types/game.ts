export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface Rabbit {
  position: Position;
  velocity: Velocity;
  rotation: number;
  isInvincible: boolean;
}

export interface Hurdle {
  id: string;
  x: number;
  height: number;
  passed: boolean;
  /** If true, hurdle bounces up and down */
  isMoving: boolean;
  /** Current vertical offset from default position (pixels). Used for moving hurdles. */
  verticalOffset: number;
  /** Phase for sine-wave bounce (radians). Updated each frame when isMoving. */
  verticalPhase: number;
}

export type CoinLabel = 'MCP' | 'Ticket' | 'Cloned Repo' | 'Learning' | '.MD files' | 'SAST' | 'CodeRabbit Configs';

export interface Coin {
  id: string;
  x: number;
  y: number;
  label: CoinLabel;
  collected: boolean;
}

export interface SuperCarrot {
  id: string;
  x: number;
  y: number;
  collected: boolean;
}

export type GameState = 'idle' | 'playing' | 'gameOver';
