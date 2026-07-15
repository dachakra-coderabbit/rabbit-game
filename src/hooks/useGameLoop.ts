import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  INITIAL_RABBIT_X,
  INITIAL_RABBIT_Y,
  JUMP_VELOCITY,
  HURDLE_SPEED,
  HURDLE_SPACING,
  HURDLE_MOVING_CHANCE,
  HURDLE_BOUNCE_AMPLITUDE,
  HURDLE_BOUNCE_SPEED,
  GAME_WIDTH,
  GAME_HEIGHT,
  GROUND_HEIGHT,
  RABBIT_HEIGHT,
  RABBIT_WIDTH,
  MAX_RABBITS,
  SUPER_CARROT_DURATION,
  SUPER_CARROT_SPAWN_RATE,
  SUPER_CARROT_MIN_OBSTACLE,
  SUPER_CARROT_SIZE,
} from '../constants/game';
import { Rabbit, Hurdle, Coin, GameState, SuperCarrot } from '../types/game';
import {
  applyGravity,
  checkCollision,
  generateHurdle,
  generateCoin,
  checkCoinCollision,
  generateSuperCarrot,
  checkSuperCarrotCollision,
} from '../utils/physics';

const makeRabbit = (x: number): Rabbit => ({
  position: { x, y: INITIAL_RABBIT_Y },
  velocity: { x: 0, y: 0 },
  rotation: 0,
  isInvincible: false,
});

/** Evenly space rabbit spawn x positions across the left lane (can overlap when count is huge). */
const computeRabbitSpawnXs = (count: number): number[] => {
  const n = Math.min(Math.max(1, count), MAX_RABBITS);
  if (n === 1) return [INITIAL_RABBIT_X];
  const leftMin = GAME_WIDTH * 0.04;
  const rightBound = GAME_WIDTH * 0.52;
  const maxLastLeft = rightBound - RABBIT_WIDTH;
  const rawStep = (maxLastLeft - leftMin) / (n - 1);
  const step = Math.max(4, rawStep);
  return Array.from({ length: n }, (_, i) => leftMin + i * step);
};

const makeRabbitsForCount = (count: number): Rabbit[] =>
  computeRabbitSpawnXs(count).map((x) => makeRabbit(x));

/** Leftmost rabbit x — used for scoring when a hurdle is “passed” */
const passLineX = (rabbits: Rabbit[]) => Math.min(...rabbits.map((r) => r.position.x));

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [rabbits, setRabbits] = useState<Rabbit[]>([makeRabbit(INITIAL_RABBIT_X)]);
  const [hurdles, setHurdles] = useState<Hurdle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);
  const [superCarrot, setSuperCarrot] = useState<SuperCarrot | null>(null);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const hurdleIdCounter = useRef(0);
  const coinIdCounter = useRef(0);
  const superCarrotIdCounter = useRef(0);
  const hurdlesSpawnedThisGame = useRef(0);
  const invincibilityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInvincibleRef = useRef(false);
  const superCarrotActiveRef = useRef(false);
  const rabbitsRef = useRef<Rabbit[]>(rabbits);
  rabbitsRef.current = rabbits;

  const getTodayKey = () => {
    const today = new Date();
    return `highScore_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  };

  const loadHighScore = useCallback(async () => {
    try {
      const key = getTodayKey();
      const storedScore = await AsyncStorage.getItem(key);
      if (storedScore !== null) {
        setHighScore(parseInt(storedScore, 10));
      } else {
        setHighScore(0);
      }
    } catch (error) {
      console.error('Error loading high score:', error);
      setHighScore(0);
    }
  }, []);

  const saveHighScore = useCallback(async (currentScore: number) => {
    try {
      const key = getTodayKey();
      const storedScore = await AsyncStorage.getItem(key);
      const currentHighScore = storedScore ? parseInt(storedScore, 10) : 0;

      if (currentScore > currentHighScore) {
        await AsyncStorage.setItem(key, currentScore.toString());
        setHighScore(currentScore);
      }
    } catch (error) {
      console.error('Error saving high score:', error);
    }
  }, []);

  const initializeGame = useCallback((options?: { rabbitCount?: number }) => {
    const rabbitCount = Math.min(
      MAX_RABBITS,
      Math.max(1, options?.rabbitCount ?? 1)
    );
    if (invincibilityTimerRef.current) {
      clearTimeout(invincibilityTimerRef.current);
      invincibilityTimerRef.current = null;
    }
    isInvincibleRef.current = false;
    superCarrotActiveRef.current = false;
    hurdlesSpawnedThisGame.current = 0;

    setRabbits(makeRabbitsForCount(rabbitCount));
    setSuperCarrot(null);

    const firstHurdleX = GAME_WIDTH * 1.2;
    setHurdles([
      generateHurdle(firstHurdleX, hurdleIdCounter.current++, HURDLE_MOVING_CHANCE),
      generateHurdle(firstHurdleX + HURDLE_SPACING, hurdleIdCounter.current++, HURDLE_MOVING_CHANCE),
      generateHurdle(firstHurdleX + HURDLE_SPACING * 2, hurdleIdCounter.current++, HURDLE_MOVING_CHANCE),
    ]);
    setCoins([
      generateCoin(firstHurdleX + HURDLE_SPACING * 0.5, coinIdCounter.current++),
      generateCoin(firstHurdleX + HURDLE_SPACING * 1.5, coinIdCounter.current++),
      generateCoin(firstHurdleX + HURDLE_SPACING * 2.5, coinIdCounter.current++),
    ]);
    setScore(0);
  }, []);

  const jump = useCallback(() => {
    if (gameState === 'idle') {
      setGameState('playing');
      initializeGame({ rabbitCount: 1 });
    }

    if (gameState === 'playing') {
      setRabbits((prev) =>
        prev.map((r) => {
          const groundY = GAME_HEIGHT - GROUND_HEIGHT - RABBIT_HEIGHT;
          if (r.position.y >= groundY) {
            return {
              ...r,
              velocity: { ...r.velocity, y: JUMP_VELOCITY },
              rotation: -15,
            };
          }
          return r;
        })
      );
    }
  }, [gameState, initializeGame]);

  const restart = useCallback(() => {
    setGameState('idle');
    initializeGame({ rabbitCount: 1 });
  }, [initializeGame]);

  const acceptDoubleAndPass = useCallback(() => {
    const prev = rabbitsRef.current.length;
    const nextCount = Math.min(MAX_RABBITS, Math.max(1, prev) * 2);
    initializeGame({ rabbitCount: nextCount });
    setGameState('playing');
  }, [initializeGame]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        setRabbits((prevRabbits) => prevRabbits.map((r) => applyGravity(r)));

        setHurdles((prevHurdles) => {
          const updatedHurdles = prevHurdles.map((hurdle) => {
            const x = hurdle.x - HURDLE_SPEED;
            const isMoving = hurdle.isMoving ?? false;
            const phase = (hurdle.verticalPhase ?? 0) + HURDLE_BOUNCE_SPEED;
            const verticalOffset = isMoving ? HURDLE_BOUNCE_AMPLITUDE * Math.sin(phase) : 0;
            return {
              ...hurdle,
              x,
              verticalPhase: phase,
              verticalOffset,
            };
          });

          const filteredHurdles = updatedHurdles.filter((hurdle) => hurdle.x > -100);

          if (filteredHurdles.length < 3) {
            const lastHurdle = filteredHurdles[filteredHurdles.length - 1];
            const spawnX = lastHurdle ? lastHurdle.x + HURDLE_SPACING : GAME_WIDTH + HURDLE_SPACING;

            filteredHurdles.push(generateHurdle(spawnX, hurdleIdCounter.current++, HURDLE_MOVING_CHANCE));
            hurdlesSpawnedThisGame.current++;

            if (
              !superCarrotActiveRef.current &&
              !isInvincibleRef.current &&
              hurdlesSpawnedThisGame.current >= SUPER_CARROT_MIN_OBSTACLE &&
              Math.random() < SUPER_CARROT_SPAWN_RATE
            ) {
              setSuperCarrot(generateSuperCarrot(spawnX, superCarrotIdCounter.current++));
              superCarrotActiveRef.current = true;
            }
          }

          return filteredHurdles;
        });

        setSuperCarrot((prev) => {
          if (!prev) return null;
          const newX = prev.x - HURDLE_SPEED;
          if (newX < -SUPER_CARROT_SIZE || prev.collected) {
            superCarrotActiveRef.current = false;
            return null;
          }
          return { ...prev, x: newX };
        });

        setCoins((prevCoins) => {
          const updatedCoins = prevCoins.map((coin) => ({
            ...coin,
            x: coin.x - HURDLE_SPEED,
          }));

          const filteredCoins = updatedCoins.filter((coin) => coin.x > -100);

          if (filteredCoins.length < 3) {
            const lastCoin = filteredCoins[filteredCoins.length - 1];
            const spawnX = lastCoin ? lastCoin.x + HURDLE_SPACING : GAME_WIDTH + HURDLE_SPACING;

            filteredCoins.push(generateCoin(spawnX, coinIdCounter.current++));
          }

          return filteredCoins;
        });

        const lineX = passLineX(rabbitsRef.current);
        setHurdles((prevHurdles) =>
          prevHurdles.map((hurdle) => {
            if (!hurdle.passed && hurdle.x + 60 < lineX) {
              setScore((prevScore) => prevScore + 1);
              return { ...hurdle, passed: true };
            }
            return hurdle;
          })
        );
      }, 1000 / 60);

      return () => {
        if (gameLoopRef.current) {
          clearInterval(gameLoopRef.current);
        }
      };
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const anyHit = rabbits.some((r) => !r.isInvincible && checkCollision(r, hurdles));
      if (anyHit) {
        setGameState('gameOver');
      }
    }
  }, [rabbits, hurdles, gameState]);

  useEffect(() => {
    if (gameState === 'playing' && superCarrot && !superCarrot.collected && !isInvincibleRef.current) {
      const anyCollects = rabbits.some((r) => checkSuperCarrotCollision(r, superCarrot));
      if (anyCollects) {
        setSuperCarrot(null);
        superCarrotActiveRef.current = false;

        isInvincibleRef.current = true;
        setRabbits((prev) => prev.map((r) => ({ ...r, isInvincible: true })));

        if (invincibilityTimerRef.current) {
          clearTimeout(invincibilityTimerRef.current);
        }
        invincibilityTimerRef.current = setTimeout(() => {
          isInvincibleRef.current = false;
          setRabbits((prev) => prev.map((r) => ({ ...r, isInvincible: false })));
          invincibilityTimerRef.current = null;
        }, SUPER_CARROT_DURATION);
      }
    }
  }, [rabbits, superCarrot, gameState]);

  useEffect(() => {
    if (gameState === 'playing') {
      const idSet = new Set<string>();
      for (const r of rabbits) {
        for (const id of checkCoinCollision(r, coins)) {
          idSet.add(id);
        }
      }
      const collectedCoinIds = [...idSet];
      if (collectedCoinIds.length > 0) {
        setCoins((prevCoins) =>
          prevCoins.map((coin) =>
            collectedCoinIds.includes(coin.id) ? { ...coin, collected: true } : coin
          )
        );
        setScore((prevScore) => prevScore + collectedCoinIds.length * 10);
      }
    }
  }, [rabbits, coins, gameState]);

  useEffect(() => {
    if (gameState === 'gameOver') {
      if (invincibilityTimerRef.current) {
        clearTimeout(invincibilityTimerRef.current);
        invincibilityTimerRef.current = null;
      }
      isInvincibleRef.current = false;
      setRabbits((prev) => prev.map((r) => ({ ...r, isInvincible: false })));
      saveHighScore(score);
    }
  }, [gameState, score, saveHighScore]);

  useEffect(() => {
    initializeGame({ rabbitCount: 1 });
  }, [initializeGame]);

  useEffect(() => {
    loadHighScore();
  }, [loadHighScore]);

  const nextDoubleRabbitCount = Math.min(MAX_RABBITS, Math.max(1, rabbits.length) * 2);

  return {
    gameState,
    score,
    highScore,
    rabbits,
    nextDoubleRabbitCount,
    hurdles,
    coins,
    superCarrot,
    jump,
    restart,
    acceptDoubleAndPass,
  };
};
