import {
  GRAVITY,
  MAX_FALL_SPEED,
  RABBIT_WIDTH,
  RABBIT_HEIGHT,
  HURDLE_WIDTH,
  HURDLE_HEIGHT,
  GAME_HEIGHT,
  GROUND_HEIGHT,
} from '../constants/game';
import { Rabbit, Hurdle } from '../types/game';

export const applyGravity = (rabbit: Rabbit): Rabbit => {
  const groundY = GAME_HEIGHT - GROUND_HEIGHT - RABBIT_HEIGHT;
  const newVelocity = Math.min(rabbit.velocity.y + GRAVITY, MAX_FALL_SPEED);
  let newY = rabbit.position.y + newVelocity;

  // Keep rabbit on ground when not jumping
  if (newY >= groundY) {
    newY = groundY;
  }

  // Rotation based on velocity (tilt forward when jumping up, backward when falling)
  let newRotation = 0;
  if (newY < groundY) {
    newRotation = newVelocity < 0 ? -15 : 15;
  }

  return {
    ...rabbit,
    position: {
      ...rabbit.position,
      y: newY,
    },
    velocity: {
      ...rabbit.velocity,
      y: newY >= groundY ? 0 : newVelocity,
    },
    rotation: newRotation,
  };
};

export const checkCollision = (rabbit: Rabbit, hurdles: Hurdle[]): boolean => {
  const rabbitLeft = rabbit.position.x;
  const rabbitRight = rabbit.position.x + RABBIT_WIDTH;
  const rabbitTop = rabbit.position.y;
  const rabbitBottom = rabbit.position.y + RABBIT_HEIGHT;

  // Check hurdle collision - ground-based obstacles
  for (const hurdle of hurdles) {
    const hurdleLeft = hurdle.x;
    const hurdleRight = hurdle.x + HURDLE_WIDTH;
    const hurdleTop = GAME_HEIGHT - GROUND_HEIGHT - hurdle.height;
    const hurdleBottom = GAME_HEIGHT - GROUND_HEIGHT;

    // Check if rabbit overlaps with hurdle horizontally
    if (rabbitRight > hurdleLeft && rabbitLeft < hurdleRight) {
      // Check if rabbit overlaps with hurdle vertically
      if (rabbitBottom > hurdleTop && rabbitTop < hurdleBottom) {
        return true;
      }
    }
  }

  return false;
};

export const generateHurdle = (lastHurdleX: number, id: number): Hurdle => {
  const minHeight = 30;
  const maxHeight = 80;
  const height = Math.random() * (maxHeight - minHeight) + minHeight;

  return {
    id: id.toString(),
    x: lastHurdleX,
    height,
    passed: false,
  };
};
