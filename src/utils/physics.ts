import {
  GRAVITY,
  MAX_FALL_SPEED,
  RABBIT_WIDTH,
  RABBIT_HEIGHT,
  HURDLE_WIDTH,
  HURDLE_HEIGHT,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  SUPER_CARROT_SIZE,
} from '../constants/game';
import { Rabbit, Hurdle, Coin, CoinLabel, SuperCarrot } from '../types/game';

const COIN_LABELS: CoinLabel[] = [
  'MCP',
  'Ticket',
  'Cloned Repo',
  'Learning',
  '.MD files',
  'SAST',
  'CodeRabbit Configs',
];

const COIN_SIZE = 50;

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
  // Add padding to make collision detection more forgiving and accurate to the visual shapes
  // Both characters are rounded, so we need to shrink the hitboxes
  const RABBIT_COLLISION_PADDING = 10; // Reduces hitbox by 10px on each side
  const HURDLE_COLLISION_PADDING = 8; // Reduces hitbox by 8px on each side

  const rabbitLeft = rabbit.position.x + RABBIT_COLLISION_PADDING;
  const rabbitRight = rabbit.position.x + RABBIT_WIDTH - RABBIT_COLLISION_PADDING;
  const rabbitTop = rabbit.position.y + RABBIT_COLLISION_PADDING;
  const rabbitBottom = rabbit.position.y + RABBIT_HEIGHT - RABBIT_COLLISION_PADDING;

  // Check hurdle collision - ground-based obstacles (verticalOffset for moving hurdles)
  for (const hurdle of hurdles) {
    const hurdleLeft = hurdle.x + HURDLE_COLLISION_PADDING;
    const hurdleRight = hurdle.x + HURDLE_WIDTH - HURDLE_COLLISION_PADDING;
    const offsetY = hurdle.verticalOffset ?? 0;
    const hurdleTop = GAME_HEIGHT - GROUND_HEIGHT - hurdle.height + offsetY + HURDLE_COLLISION_PADDING;
    const hurdleBottom = GAME_HEIGHT - GROUND_HEIGHT + offsetY - HURDLE_COLLISION_PADDING;

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

export const generateHurdle = (
  lastHurdleX: number,
  id: number,
  movingChance: number
): Hurdle => {
  const minHeight = 30;
  const maxHeight = 80;
  const height = Math.random() * (maxHeight - minHeight) + minHeight;
  const isMoving = Math.random() < movingChance;
  const verticalPhase = Math.random() * 2 * Math.PI;

  return {
    id: id.toString(),
    x: lastHurdleX,
    height,
    passed: false,
    isMoving,
    verticalOffset: 0,
    verticalPhase,
  };
};

export const generateCoin = (x: number, id: number): Coin => {
  const randomLabel = COIN_LABELS[Math.floor(Math.random() * COIN_LABELS.length)];

  // Random height for coin placement (in the air, where the rabbit can jump to get it)
  const minY = GAME_HEIGHT - GROUND_HEIGHT - 200;
  const maxY = GAME_HEIGHT - GROUND_HEIGHT - 100;
  const y = Math.random() * (maxY - minY) + minY;

  return {
    id: id.toString(),
    x,
    y,
    label: randomLabel,
    collected: false,
  };
};

export const generateSuperCarrot = (x: number, id: number): SuperCarrot => {
  const minY = GAME_HEIGHT - GROUND_HEIGHT - 200;
  const maxY = GAME_HEIGHT - GROUND_HEIGHT - 100;
  const y = Math.random() * (maxY - minY) + minY;

  return {
    id: id.toString(),
    x,
    y,
    collected: false,
  };
};

export const checkSuperCarrotCollision = (rabbit: Rabbit, superCarrot: SuperCarrot | null): boolean => {
  if (!superCarrot || superCarrot.collected) return false;

  const rabbitLeft = rabbit.position.x;
  const rabbitRight = rabbit.position.x + RABBIT_WIDTH;
  const rabbitTop = rabbit.position.y;
  const rabbitBottom = rabbit.position.y + RABBIT_HEIGHT;

  const carrotLeft = superCarrot.x;
  const carrotRight = superCarrot.x + SUPER_CARROT_SIZE;
  const carrotTop = superCarrot.y;
  const carrotBottom = superCarrot.y + SUPER_CARROT_SIZE;

  return (
    rabbitRight > carrotLeft &&
    rabbitLeft < carrotRight &&
    rabbitBottom > carrotTop &&
    rabbitTop < carrotBottom
  );
};

export const checkCoinCollision = (rabbit: Rabbit, coins: Coin[]): string[] => {
  const rabbitLeft = rabbit.position.x;
  const rabbitRight = rabbit.position.x + RABBIT_WIDTH;
  const rabbitTop = rabbit.position.y;
  const rabbitBottom = rabbit.position.y + RABBIT_HEIGHT;

  const collectedCoinIds: string[] = [];

  for (const coin of coins) {
    if (coin.collected) continue;

    const coinLeft = coin.x;
    const coinRight = coin.x + COIN_SIZE;
    const coinTop = coin.y;
    const coinBottom = coin.y + COIN_SIZE;

    // Check if rabbit overlaps with coin
    if (
      rabbitRight > coinLeft &&
      rabbitLeft < coinRight &&
      rabbitBottom > coinTop &&
      rabbitTop < coinBottom
    ) {
      collectedCoinIds.push(coin.id);
    }
  }

  return collectedCoinIds;
};
