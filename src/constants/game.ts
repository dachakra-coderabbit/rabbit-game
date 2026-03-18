import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const GAME_WIDTH = width;
export const GAME_HEIGHT = height;

// Rabbit constants
export const RABBIT_WIDTH = 50;
export const RABBIT_HEIGHT = 50;
export const GRAVITY = 0.8;
export const JUMP_VELOCITY = -15;
export const MAX_FALL_SPEED = 12;

// Hurdle constants (now ground obstacles)
export const HURDLE_WIDTH = 40;
export const HURDLE_HEIGHT = 60;
export const HURDLE_SPACING = 300;
export const HURDLE_SPEED = 5;
/** Chance (0–1) that a newly spawned hurdle moves up/down */
export const HURDLE_MOVING_CHANCE = 0.5;
/** Vertical bounce amplitude in pixels for moving hurdles (high and low = big gap to pass through) */
export const HURDLE_BOUNCE_AMPLITUDE = 160;
/** Bounce speed in radians per frame (~60fps). Slower = easier to time passing through */
export const HURDLE_BOUNCE_SPEED = 0.04;

// Ground constants
export const GROUND_HEIGHT = 80;
export const GRASS_HEIGHT = GROUND_HEIGHT;

// Game constants
export const INITIAL_RABBIT_X = GAME_WIDTH * 0.2;
export const INITIAL_RABBIT_Y = GAME_HEIGHT - GROUND_HEIGHT - RABBIT_HEIGHT;

// Power-up constants
export const SUPER_CARROT_DURATION = 4000;
export const SUPER_CARROT_SPAWN_RATE = 1;
export const SUPER_CARROT_MIN_OBSTACLE = 3;
export const SUPER_CARROT_SIZE = 40;
