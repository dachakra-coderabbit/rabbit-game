import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Sentry from '@sentry/react-native';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/game';
import { Background } from '../components/Background';
import { RabbitCharacter } from '../components/RabbitCharacter';
import { HurdleObstacle } from '../components/HurdleObstacle';
import { CoinItem } from '../components/CoinItem';
import { useGameLoop } from '../hooks/useGameLoop';

export const GameScreen: React.FC = () => {
  const { gameState, score, highScore, rabbit, hurdles, coins, jump, restart } = useGameLoop();
  const [sentryTestMessage, setSentryTestMessage] = useState<string | null>(null);

  const testSentryError = () => {
    try {

      // Add some context data
      Sentry.captureException( new Error('Application Failed'));

      // Show visual confirmation
      setSentryTestMessage('✓ Error sent to Sentry!!!!');
      setTimeout(() => setSentryTestMessage(null), 3000);

      console.log('Test error captured and sent to Sentry');
    } catch (error) {
      console.error('Failed to send test error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Pressable style={styles.gameArea} onPress={jump}>
        <Background isPlaying={gameState === 'playing'} />

        {/* Hurdles */}
        {hurdles.map((hurdle) => (
          <HurdleObstacle key={hurdle.id} hurdle={hurdle} />
        ))}

        {/* Coins */}
        {coins.map((coin) => (
          <CoinItem key={coin.id} coin={coin} />
        ))}

        {/* Rabbit */}
        <RabbitCharacter rabbit={rabbit} />

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        {/* High Score */}
        <View style={styles.highScoreContainer}>
          <Text style={styles.highScoreLabel}>Today's Best</Text>
          <Text style={styles.highScoreText}>{highScore}</Text>
        </View>

        {/* Start Screen */}
        {gameState === 'idle' && (
          <View style={styles.overlay}>
            <Text style={styles.title}>Rabbit Runner</Text>
            <Text style={styles.subtitle}>Tap to Start</Text>
            <Text style={styles.instructions}>
              Tap anywhere to make the rabbit jump over obstacles!
            </Text>
          </View>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.finalScore}>Score: {score}</Text>
            <Text style={styles.todaysBest}>Today's Best: {highScore}</Text>

            {/* Sentry Test Confirmation Message */}
            {sentryTestMessage && (
              <View style={styles.sentryTestMessageGameOver}>
                <Text style={styles.sentryTestMessageText}>{sentryTestMessage}</Text>
              </View>
            )}

            <TouchableOpacity style={styles.restartButton} onPress={restart}>
              <Text style={styles.restartButtonText}>Play Again</Text>
            </TouchableOpacity>

            {/* Sentry Test Button */}
            <TouchableOpacity
              style={styles.sentryTestButtonGameOver}
              onPress={testSentryError}
              activeOpacity={0.7}
            >
              <Text style={styles.sentryTestButtonText}>Report Error to Sentry</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameArea: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
  },
  scoreContainer: {
    position: 'absolute',
    top: 50,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#8B4513',
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  highScoreContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#B8860B',
  },
  highScoreLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#654321',
    textAlign: 'center',
  },
  highScoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#654321',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 10,
  },
  instructions: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF4444',
    marginBottom: 20,
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  finalScore: {
    fontSize: 32,
    color: '#FFF',
    marginBottom: 10,
  },
  todaysBest: {
    fontSize: 24,
    color: '#FFD700',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  restartButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  sentryTestButtonGameOver: {
    backgroundColor: 'rgba(255, 87, 34, 0.9)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D84315',
    marginTop: 15,
  },
  sentryTestButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  sentryTestMessageGameOver: {
    backgroundColor: 'rgba(76, 175, 80, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4CAF50',
    marginBottom: 10,
  },
  sentryTestMessageText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFF',
  },
});
