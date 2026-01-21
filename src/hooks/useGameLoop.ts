import { useState, useEffect, useRef, useCallback } from 'react';
import {
  INITIAL_RABBIT_X,
  INITIAL_RABBIT_Y,
  JUMP_VELOCITY,
  HURDLE_SPEED,
  HURDLE_SPACING,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  RABBIT_HEIGHT,
} from '../constants/game';
import { Rabbit, Hurdle, GameState } from '../types/game';
import { applyGravity, checkCollision, generateHurdle } from '../utils/physics';

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [rabbit, setRabbit] = useState<Rabbit>({
    position: { x: INITIAL_RABBIT_X, y: INITIAL_RABBIT_Y },
    velocity: { x: 0, y: 0 },
    rotation: 0,
  });
  const [hurdles, setHurdles] = useState<Hurdle[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const hurdleIdCounter = useRef(0);

  const initializeGame = useCallback(() => {
    setRabbit({
      position: { x: INITIAL_RABBIT_X, y: INITIAL_RABBIT_Y },
      velocity: { x: 0, y: 0 },
      rotation: 0,
    });
    setHurdles([
      generateHurdle(GAME_WIDTH, hurdleIdCounter.current++),
      generateHurdle(GAME_WIDTH + HURDLE_SPACING, hurdleIdCounter.current++),
      generateHurdle(GAME_WIDTH + HURDLE_SPACING * 2, hurdleIdCounter.current++),
    ]);
    setScore(0);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'idle') {
      setGameState('playing');
      initializeGame();
    }

    if (gameState === 'playing') {
      setRabbit((prev) => {
        const groundY = GAME_HEIGHT - GROUND_HEIGHT - RABBIT_HEIGHT;
        // Only allow jump when on the ground
        if (prev.position.y >= groundY) {
          return {
            ...prev,
            velocity: { ...prev.velocity, y: JUMP_VELOCITY },
            rotation: -15,
          };
        }
        return prev;
      });
    }
  }, [gameState, initializeGame]);

  const restart = useCallback(() => {
    setGameState('idle');
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setRabbit((prevRabbit) => {
          const updatedRabbit = applyGravity(prevRabbit);
          return updatedRabbit;
        });

        setHurdles((prevHurdles) => {
          const updatedHurdles = prevHurdles.map((hurdle) => ({
            ...hurdle,
            x: hurdle.x - HURDLE_SPEED,
          }));

          // Remove off-screen hurdles and add new ones
          const filteredHurdles = updatedHurdles.filter((hurdle) => hurdle.x > -100);

          // Add new hurdle if needed
          if (filteredHurdles.length < 3) {
            const lastHurdle = filteredHurdles[filteredHurdles.length - 1];
            filteredHurdles.push(
              generateHurdle(lastHurdle.x + HURDLE_SPACING, hurdleIdCounter.current++)
            );
          }

          return filteredHurdles;
        });

        // Update score
        setHurdles((prevHurdles) => {
          return prevHurdles.map((hurdle) => {
            if (!hurdle.passed && hurdle.x + 60 < INITIAL_RABBIT_X) {
              setScore((prevScore) => prevScore + 1);
              return { ...hurdle, passed: true };
            }
            return hurdle;
          });
        });
      }, 1000 / 60); // 60 FPS

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState]);

  // Check collision
  useEffect(() => {
    if (gameState === 'playing') {
      if (checkCollision(rabbit, hurdles)) {
        setGameState('gameOver');
      }
    }
  }, [rabbit, hurdles, gameState]);

  useEffect(() => {
    initializeGame();
  }, []);

  return {
    gameState,
    score,
    rabbit,
    hurdles,
    jump,
    restart,
  };
};
