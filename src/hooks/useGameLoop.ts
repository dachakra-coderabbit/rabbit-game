import { useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { Rabbit, Hurdle, Coin, GameState } from '../types/game';
import { applyGravity, checkCollision, generateHurdle, generateCoin, checkCoinCollision } from '../utils/physics';

export const useGameLoop = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [rabbit, setRabbit] = useState<Rabbit>({
    position: { x: INITIAL_RABBIT_X, y: INITIAL_RABBIT_Y },
    velocity: { x: 0, y: 0 },
    rotation: 0,
  });
  const [hurdles, setHurdles] = useState<Hurdle[]>([]);
  const [coins, setCoins] = useState<Coin[]>([]);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const hurdleIdCounter = useRef(0);
  const coinIdCounter = useRef(0);

  // Get today's date as a key for storing high score
  const getTodayKey = () => {
    const today = new Date();
    return `highScore_${today.getFullYear()}_${today.getMonth() + 1}_${today.getDate()}`;
  };

  // Load today's high score from storage
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

  // Save high score to storage if current score is higher
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
    setCoins([
      generateCoin(GAME_WIDTH + HURDLE_SPACING * 0.5, coinIdCounter.current++),
      generateCoin(GAME_WIDTH + HURDLE_SPACING * 1.5, coinIdCounter.current++),
      generateCoin(GAME_WIDTH + HURDLE_SPACING * 2.5, coinIdCounter.current++),
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
            // Safe spawn position: use last hurdle's position if available, otherwise use fallback
            const lastHurdle = filteredHurdles[filteredHurdles.length - 1];
            const spawnX = lastHurdle ? lastHurdle.x + HURDLE_SPACING : GAME_WIDTH + HURDLE_SPACING;

            filteredHurdles.push(
              generateHurdle(spawnX, hurdleIdCounter.current++)
            );
          }

          return filteredHurdles;
        });

        setCoins((prevCoins) => {
          const updatedCoins = prevCoins.map((coin) => ({
            ...coin,
            x: coin.x - HURDLE_SPEED,
          }));

          // Remove off-screen coins and add new ones
          const filteredCoins = updatedCoins.filter((coin) => coin.x > -100);

          // Add new coin if needed
          if (filteredCoins.length < 3) {
            // Safe spawn position: use last coin's position if available, otherwise use fallback
            const lastCoin = filteredCoins[filteredCoins.length - 1];
            const spawnX = lastCoin ? lastCoin.x + HURDLE_SPACING : GAME_WIDTH + HURDLE_SPACING;

            filteredCoins.push(
              generateCoin(spawnX, coinIdCounter.current++)
            );
          }

          return filteredCoins;
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

  // Check coin collection
  useEffect(() => {
    if (gameState === 'playing') {
      const collectedCoinIds = checkCoinCollision(rabbit, coins);
      if (collectedCoinIds.length > 0) {
        setCoins((prevCoins) =>
          prevCoins.map((coin) =>
            collectedCoinIds.includes(coin.id) ? { ...coin, collected: true } : coin
          )
        );
        // Add 10 points for each coin collected
        setScore((prevScore) => prevScore + (collectedCoinIds.length * 10));
      }
    }
  }, [rabbit, coins, gameState]);

  // Save high score when game ends
  useEffect(() => {
    if (gameState === 'gameOver') {
      saveHighScore(score);
    }
  }, [gameState, score, saveHighScore]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, []);

  // Load high score on mount
  useEffect(() => {
    loadHighScore();
  }, [loadHighScore]);

  return {
    gameState,
    score,
    highScore,
    rabbit,
    hurdles,
    coins,
    jump,
    restart,
  };
};
