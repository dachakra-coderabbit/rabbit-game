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
}

export interface Hurdle {
  id: string;
  x: number;
  height: number;
  passed: boolean;
}

export type CoinLabel = 'MCP' | 'Ticket' | 'Cloned Repo' | 'Learning' | '.MD files' | 'SAST' | 'CodeRabbit Configs';

export interface Coin {
  id: string;
  x: number;
  y: number;
  label: CoinLabel;
  collected: boolean;
}

export type GameState = 'idle' | 'playing' | 'gameOver';
