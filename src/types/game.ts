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
  gapY: number;
  passed: boolean;
}

export type GameState = 'idle' | 'playing' | 'gameOver';
