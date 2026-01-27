import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Ellipse, Circle, Path } from 'react-native-svg';
import { RABBIT_WIDTH, RABBIT_HEIGHT } from '../constants/game';
import { Rabbit } from '../types/game';

interface RabbitCharacterProps {
  rabbit: Rabbit;
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({ rabbit }) => {
  return (
    <View
      style={[
        styles.container,
        {
          left: rabbit.position.x,
          top: rabbit.position.y,
          transform: [{ rotate: `${rabbit.rotation}deg` }],
        },
      ]}
    >
      <Svg width={RABBIT_WIDTH} height={RABBIT_HEIGHT} viewBox="0 0 50 50">
        {/* Left ear */}
        <Ellipse
          cx="15"
          cy="12"
          rx="4"
          ry="10"
          fill="#FFA07A"
          stroke="#8B4513"
          strokeWidth="1"
        />
        {/* Right ear */}
        <Ellipse
          cx="25"
          cy="10"
          rx="4"
          ry="11"
          fill="#FFA07A"
          stroke="#8B4513"
          strokeWidth="1"
        />
        {/* Head */}
        <Circle cx="20" cy="23" r="12" fill="#FF6B35" stroke="#8B4513" strokeWidth="1" />
        {/* White lower face */}
        <Ellipse
          cx="20"
          cy="26"
          rx="9"
          ry="7"
          fill="#FFF"
        />
        {/* Body */}
        <Ellipse
          cx="22"
          cy="38"
          rx="10"
          ry="9"
          fill="#FF6B35"
          stroke="#8B4513"
          strokeWidth="1"
        />
        {/* White belly */}
        <Ellipse
          cx="22"
          cy="39"
          rx="7"
          ry="6"
          fill="#FFF"
        />
        {/* Left eye */}
        <Circle cx="17" cy="21" r="2" fill="#000" />
        {/* Right eye */}
        <Circle cx="23" cy="21" r="2" fill="#000" />
        {/* Nose */}
        <Circle cx="20" cy="25" r="1.5" fill="#FF69B4" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: RABBIT_WIDTH,
    height: RABBIT_HEIGHT,
  },
});
