import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';
import { HURDLE_WIDTH, GAME_HEIGHT, GROUND_HEIGHT } from '../constants/game';
import { Hurdle } from '../types/game';

interface HurdleObstacleProps {
  hurdle: Hurdle;
}

export const HurdleObstacle: React.FC<HurdleObstacleProps> = ({ hurdle }) => {
  const hurdleY = GAME_HEIGHT - GROUND_HEIGHT - hurdle.height;

  const viewBoxSize = 60;

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
      <Svg
        width={HURDLE_WIDTH}
        height={hurdle.height}
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Beetle Body */}
        <Ellipse
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          rx="18"
          ry="22"
          fill="#2C1810"
          stroke="#000"
          strokeWidth="1.5"
        />

        {/* Shell division line */}
        <Path
          d={`M ${viewBoxSize / 2} ${viewBoxSize / 2 - 22} L ${viewBoxSize / 2} ${viewBoxSize / 2 + 22}`}
          stroke="#000"
          strokeWidth="1.5"
        />

        {/* Left shell detail */}
        <Ellipse
          cx={viewBoxSize / 2 - 6}
          cy={viewBoxSize / 2}
          rx="10"
          ry="18"
          fill="#4A2C1B"
          stroke="#000"
          strokeWidth="1"
        />

        {/* Right shell detail */}
        <Ellipse
          cx={viewBoxSize / 2 + 6}
          cy={viewBoxSize / 2}
          rx="10"
          ry="18"
          fill="#4A2C1B"
          stroke="#000"
          strokeWidth="1"
        />

        {/* Head */}
        <Circle
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2 - 26}
          r="8"
          fill="#3D2414"
          stroke="#000"
          strokeWidth="1.5"
        />

        {/* Left antenna */}
        <Path
          d={`M ${viewBoxSize / 2 - 4} ${viewBoxSize / 2 - 30} Q ${viewBoxSize / 2 - 10} ${viewBoxSize / 2 - 40} ${viewBoxSize / 2 - 8} ${viewBoxSize / 2 - 45}`}
          stroke="#000"
          strokeWidth="1.5"
          fill="none"
        />
        <Circle cx={viewBoxSize / 2 - 8} cy={viewBoxSize / 2 - 45} r="2" fill="#D32F2F" />

        {/* Right antenna */}
        <Path
          d={`M ${viewBoxSize / 2 + 4} ${viewBoxSize / 2 - 30} Q ${viewBoxSize / 2 + 10} ${viewBoxSize / 2 - 40} ${viewBoxSize / 2 + 8} ${viewBoxSize / 2 - 45}`}
          stroke="#000"
          strokeWidth="1.5"
          fill="none"
        />
        <Circle cx={viewBoxSize / 2 + 8} cy={viewBoxSize / 2 - 45} r="2" fill="#D32F2F" />

        {/* Legs - Left side */}
        <Path d={`M ${viewBoxSize / 2 - 15} ${viewBoxSize / 2 - 10} L ${viewBoxSize / 2 - 25} ${viewBoxSize / 2 - 12}`} stroke="#000" strokeWidth="2" />
        <Path d={`M ${viewBoxSize / 2 - 16} ${viewBoxSize / 2} L ${viewBoxSize / 2 - 28} ${viewBoxSize / 2}`} stroke="#000" strokeWidth="2" />
        <Path d={`M ${viewBoxSize / 2 - 15} ${viewBoxSize / 2 + 10} L ${viewBoxSize / 2 - 25} ${viewBoxSize / 2 + 12}`} stroke="#000" strokeWidth="2" />

        {/* Legs - Right side */}
        <Path d={`M ${viewBoxSize / 2 + 15} ${viewBoxSize / 2 - 10} L ${viewBoxSize / 2 + 25} ${viewBoxSize / 2 - 12}`} stroke="#000" strokeWidth="2" />
        <Path d={`M ${viewBoxSize / 2 + 16} ${viewBoxSize / 2} L ${viewBoxSize / 2 + 28} ${viewBoxSize / 2}`} stroke="#000" strokeWidth="2" />
        <Path d={`M ${viewBoxSize / 2 + 15} ${viewBoxSize / 2 + 10} L ${viewBoxSize / 2 + 25} ${viewBoxSize / 2 + 12}`} stroke="#000" strokeWidth="2" />
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
