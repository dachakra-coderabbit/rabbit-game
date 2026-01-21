import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
import { HURDLE_WIDTH, HURDLE_GAP, GAME_HEIGHT, GROUND_HEIGHT } from '../constants/game';
import { Hurdle } from '../types/game';

interface HurdleObstacleProps {
  hurdle: Hurdle;
}

export const HurdleObstacle: React.FC<HurdleObstacleProps> = ({ hurdle }) => {
  const topHurdleHeight = hurdle.gapY;
  const bottomHurdleHeight = GAME_HEIGHT - GROUND_HEIGHT - hurdle.gapY - HURDLE_GAP;

  return (
    <View
      style={[
        styles.container,
        {
          left: hurdle.x,
        },
      ]}
    >
      {/* Top Hurdle */}
      <View style={[styles.hurdle, { height: topHurdleHeight }]}>
        <Svg width={HURDLE_WIDTH} height={topHurdleHeight} viewBox={`0 0 ${HURDLE_WIDTH} ${topHurdleHeight}`}>
          <Rect
            x="0"
            y="0"
            width={HURDLE_WIDTH}
            height={topHurdleHeight}
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="2"
          />
          {/* Horizontal bars */}
          {Array.from({ length: Math.floor(topHurdleHeight / 20) }).map((_, i) => (
            <Line
              key={i}
              x1="0"
              y1={i * 20}
              x2={HURDLE_WIDTH}
              y2={i * 20}
              stroke="#654321"
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>

      {/* Bottom Hurdle */}
      <View
        style={[
          styles.hurdle,
          {
            height: bottomHurdleHeight,
            top: topHurdleHeight + HURDLE_GAP,
          },
        ]}
      >
        <Svg width={HURDLE_WIDTH} height={bottomHurdleHeight} viewBox={`0 0 ${HURDLE_WIDTH} ${bottomHurdleHeight}`}>
          <Rect
            x="0"
            y="0"
            width={HURDLE_WIDTH}
            height={bottomHurdleHeight}
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="2"
          />
          {/* Horizontal bars */}
          {Array.from({ length: Math.floor(bottomHurdleHeight / 20) }).map((_, i) => (
            <Line
              key={i}
              x1="0"
              y1={i * 20}
              x2={HURDLE_WIDTH}
              y2={i * 20}
              stroke="#654321"
              strokeWidth="2"
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
    width: HURDLE_WIDTH,
    height: GAME_HEIGHT,
  },
  hurdle: {
    position: 'absolute',
    width: HURDLE_WIDTH,
  },
});
