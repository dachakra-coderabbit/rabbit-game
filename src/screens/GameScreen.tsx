import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GAME_WIDTH, GAME_HEIGHT } from '../constants/game';
import { Background } from '../components/Background';
import { RabbitCharacter } from '../components/RabbitCharacter';
import { HurdleObstacle } from '../components/HurdleObstacle';
import { useGameLoop } from '../hooks/useGameLoop';

export const GameScreen: React.FC = () => {
  const { gameState, score, rabbit, hurdles, jump, restart } = useGameLoop();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Pressable style={styles.gameArea} onPress={jump}>
        <Background />

        {/* Hurdles */}
        {hurdles.map((hurdle) => (
          <HurdleObstacle key={hurdle.id} hurdle={hurdle} />
        ))}

        {/* Rabbit */}
        <RabbitCharacter rabbit={rabbit} />

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
        </View>

        {/* Start Screen */}
        {gameState === 'idle' && (
          <View style={styles.overlay}>
            <Text style={styles.title}>Rabbit Jump</Text>
            <Text style={styles.subtitle}>Tap to Start</Text>
            <Text style={styles.instructions}>
              Tap anywhere to make the rabbit jump through hurdles!
            </Text>
          </View>
        )}

        {/* Game Over Screen */}
        {gameState === 'gameOver' && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over!</Text>
            <Text style={styles.finalScore}>Score: {score}</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restart}>
              <Text style={styles.restartButtonText}>Play Again</Text>
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
    marginBottom: 30,
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
});
