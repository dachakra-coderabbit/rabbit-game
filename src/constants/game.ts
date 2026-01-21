import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const GAME_WIDTH = width;
export const GAME_HEIGHT = height;

// Rabbit constants
export const RABBIT_WIDTH = 50;
export const RABBIT_HEIGHT = 50;
export const GRAVITY = 0.6;
export const JUMP_VELOCITY = -12;
export const MAX_FALL_SPEED = 10;

// Hurdle constants
export const HURDLE_WIDTH = 60;
export const HURDLE_GAP = 200;
export const HURDLE_SPACING = 250;
export const HURDLE_SPEED = 3;
export const MIN_HURDLE_HEIGHT = 100;
export const MAX_HURDLE_HEIGHT = GAME_HEIGHT - HURDLE_GAP - 150;

// Ground constants
export const GROUND_HEIGHT = 80;
export const GRASS_HEIGHT = GROUND_HEIGHT;

// Game constants
export const INITIAL_RABBIT_X = GAME_WIDTH * 0.2;
export const INITIAL_RABBIT_Y = GAME_HEIGHT * 0.5;
