import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT } from '../constants/game';

export const Background: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Sky */}
      <View style={styles.sky} />

      {/* Clouds */}
      <Svg width={GAME_WIDTH} height={200} style={styles.clouds}>
        <Circle cx="80" cy="50" r="25" fill="#FFF" opacity="0.8" />
        <Circle cx="110" cy="50" r="30" fill="#FFF" opacity="0.8" />
        <Circle cx="140" cy="50" r="25" fill="#FFF" opacity="0.8" />

        <Circle cx="280" cy="80" r="25" fill="#FFF" opacity="0.7" />
        <Circle cx="310" cy="80" r="30" fill="#FFF" opacity="0.7" />
        <Circle cx="340" cy="80" r="25" fill="#FFF" opacity="0.7" />
      </Svg>

      {/* Grass/Ground */}
      <View style={styles.ground}>
        <Svg width={GAME_WIDTH} height={GROUND_HEIGHT}>
          {/* Ground */}
          <Rect x="0" y="0" width={GAME_WIDTH} height={GROUND_HEIGHT} fill="#8B7355" />

          {/* Grass on top */}
          <Rect x="0" y="0" width={GAME_WIDTH} height="20" fill="#228B22" />

          {/* Grass blades */}
          {Array.from({ length: Math.floor(GAME_WIDTH / 15) }).map((_, i) => (
            <Path
              key={i}
              d={`M ${i * 15} 20 Q ${i * 15 + 3} 10, ${i * 15 + 6} 20`}
              fill="#32CD32"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
  },
  sky: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT - GROUND_HEIGHT,
    backgroundColor: '#87CEEB',
  },
  clouds: {
    position: 'absolute',
    top: 50,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: GAME_WIDTH,
    height: GROUND_HEIGHT,
  },
});
