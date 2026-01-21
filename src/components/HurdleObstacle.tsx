import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { HURDLE_WIDTH, GAME_HEIGHT, GROUND_HEIGHT } from '../constants/game';
import { Hurdle } from '../types/game';

interface HurdleObstacleProps {
  hurdle: Hurdle;
}

export const HurdleObstacle: React.FC<HurdleObstacleProps> = ({ hurdle }) => {
  const hurdleY = GAME_HEIGHT - GROUND_HEIGHT - hurdle.height;

  return (
    <View
      style={[
        styles.container,
        {
          left: hurdle.x,
          top: hurdleY,
          height: hurdle.height,
        },
      ]}
    >
      <Svg width={HURDLE_WIDTH} height={hurdle.height} viewBox={`0 0 ${HURDLE_WIDTH} ${hurdle.height}`}>
        {/* Main obstacle body */}
        <Rect
          x="0"
          y="0"
          width={HURDLE_WIDTH}
          height={hurdle.height}
          fill="#8B4513"
          stroke="#654321"
          strokeWidth="2"
        />
        {/* Decorative lines for texture */}
        {Array.from({ length: Math.max(1, Math.floor(hurdle.height / 15)) }).map((_, i) => (
          <Line
            key={i}
            x1="5"
            y1={i * 15 + 10}
            x2={HURDLE_WIDTH - 5}
            y2={i * 15 + 10}
            stroke="#654321"
            strokeWidth="1.5"
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: HURDLE_WIDTH,
  },
});
