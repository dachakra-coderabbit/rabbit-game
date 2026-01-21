import {
  GRAVITY,
  MAX_FALL_SPEED,
  RABBIT_WIDTH,
  RABBIT_HEIGHT,
  HURDLE_WIDTH,
  HURDLE_GAP,
  GAME_HEIGHT,
  GROUND_HEIGHT,
} from '../constants/game';
import { Rabbit, Hurdle } from '../types/game';

export const applyGravity = (rabbit: Rabbit): Rabbit => {
  const newVelocity = Math.min(rabbit.velocity.y + GRAVITY, MAX_FALL_SPEED);
  const newY = rabbit.position.y + newVelocity;
  const newRotation = Math.min(newVelocity * 3, 90);

  return {
    ...rabbit,
    position: {
      ...rabbit.position,
      y: newY,
    },
    velocity: {
      ...rabbit.velocity,
      y: newVelocity,
    },
    rotation: newRotation,
  };
};

export const checkCollision = (rabbit: Rabbit, hurdles: Hurdle[]): boolean => {
  const rabbitLeft = rabbit.position.x;
  const rabbitRight = rabbit.position.x + RABBIT_WIDTH;
  const rabbitTop = rabbit.position.y;
  const rabbitBottom = rabbit.position.y + RABBIT_HEIGHT;

  // Check ground collision
  if (rabbitBottom >= GAME_HEIGHT - GROUND_HEIGHT) {
    return true;
  }

  // Check ceiling collision
  if (rabbitTop <= 0) {
    return true;
  }

  // Check hurdle collision
  for (const hurdle of hurdles) {
    const hurdleLeft = hurdle.x;
    const hurdleRight = hurdle.x + HURDLE_WIDTH;

    // Only check hurdles that overlap with rabbit horizontally
    if (rabbitRight > hurdleLeft && rabbitLeft < hurdleRight) {
      const gapTop = hurdle.gapY;
      const gapBottom = hurdle.gapY + HURDLE_GAP;

      // Check if rabbit is NOT in the gap
      if (rabbitTop < gapTop || rabbitBottom > gapBottom) {
        return true;
      }
    }
  }

  return false;
};

export const generateHurdle = (lastHurdleX: number, id: number): Hurdle => {
  const minGapY = 100;
  const maxGapY = GAME_HEIGHT - GROUND_HEIGHT - HURDLE_GAP - 100;
  const gapY = Math.random() * (maxGapY - minGapY) + minGapY;

  return {
    id: id.toString(),
    x: lastHurdleX,
    gapY,
    passed: false,
  };
};
