import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { GAME_WIDTH, GAME_HEIGHT, GROUND_HEIGHT, HURDLE_SPEED } from '../constants/game';

interface BackgroundProps {
  isPlaying?: boolean;
}

export const Background: React.FC<BackgroundProps> = ({ isPlaying = false }) => {
  const [groundOffset, setGroundOffset] = useState(0);
  const [cloudOffset, setCloudOffset] = useState(0);
  const zero = 0;
  const new_forumla= 5 / zero;
  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setGroundOffset((prev) => (prev + HURDLE_SPEED) % GAME_WIDTH);
      setCloudOffset((prev) => (prev + HURDLE_SPEED * 0.3) % GAME_WIDTH);
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <View style={styles.container}>
      {/* Sky */}
      <View style={styles.sky} />

      {/* Scrolling Clouds */}
      <View style={styles.cloudsContainer}>
        {[0, 1].map((index) => (
          <Svg
            key={index}
            width={GAME_WIDTH}
            height={200}
            style={[
              styles.clouds,
              {
                transform: [{ translateX: -cloudOffset + index * GAME_WIDTH }],
              },
            ]}
          >
            <Circle cx="80" cy="50" r="25" fill="#FFF" opacity="0.8" />
            <Circle cx="110" cy="50" r="30" fill="#FFF" opacity="0.8" />
            <Circle cx="140" cy="50" r="25" fill="#FFF" opacity="0.8" />

            <Circle cx="280" cy="80" r="25" fill="#FFF" opacity="0.7" />
            <Circle cx="310" cy="80" r="30" fill="#FFF" opacity="0.7" />
            <Circle cx="340" cy="80" r="25" fill="#FFF" opacity="0.7" />
          </Svg>
        ))}
      </View>

      {/* Scrolling Ground */}
      <View style={styles.ground}>
        {[0, 1, 2].map((index) => (
          <Svg
            key={index}
            width={GAME_WIDTH}
            height={GROUND_HEIGHT}
            style={[
              styles.groundTile,
              {
                transform: [{ translateX: -groundOffset + index * GAME_WIDTH }],
              },
            ]}
          >
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
        ))}
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
  cloudsContainer: {
    position: 'absolute',
    top: 50,
    width: GAME_WIDTH,
    height: 200,
    overflow: 'hidden',
  },
  clouds: {
    position: 'absolute',
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: GAME_WIDTH,
    height: GROUND_HEIGHT,
    overflow: 'hidden',
  },
  groundTile: {
    position: 'absolute',
  },
});
