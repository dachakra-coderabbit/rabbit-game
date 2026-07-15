import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Ellipse, Circle } from 'react-native-svg';
import { RABBIT_WIDTH, RABBIT_HEIGHT } from '../constants/game';
import { Rabbit } from '../types/game';

/** Visual scale while super-powered (invincible); physics hitbox stays normal */
const INVINCIBLE_VISUAL_SCALE = 10;

interface RabbitCharacterProps {
  rabbit: Rabbit;
}

export const RabbitCharacter: React.FC<RabbitCharacterProps> = ({ rabbit }) => {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const glowLoop = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (rabbit.isInvincible) {
      glowLoop.current = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.2, duration: 350, useNativeDriver: true }),
        ])
      );
      glowLoop.current.start();
    } else {
      if (glowLoop.current) {
        glowLoop.current.stop();
        glowLoop.current = null;
      }
      glowAnim.setValue(0);
    }
  }, [rabbit.isInvincible]);

  const visualScale = rabbit.isInvincible ? INVINCIBLE_VISUAL_SCALE : 1;
  const displayWidth = RABBIT_WIDTH * visualScale;
  const displayHeight = RABBIT_HEIGHT * visualScale;
  // Keep feet on the same ground line; keep horizontal center aligned with hitbox
  const invincibleOffsetX = rabbit.isInvincible ? -(displayWidth - RABBIT_WIDTH) / 2 : 0;
  const invincibleOffsetY = rabbit.isInvincible ? -(displayHeight - RABBIT_HEIGHT) : 0;
  const glowPad = 16 * visualScale;

  return (
    <View
      style={[
        styles.container,
        {
          width: displayWidth,
          height: displayHeight,
          left: rabbit.position.x + invincibleOffsetX,
          top: rabbit.position.y + invincibleOffsetY,
          transform: [{ rotate: `${rabbit.rotation}deg` }],
        },
      ]}
    >
      {/* Golden glow ring — only visible while invincible */}
      {rabbit.isInvincible && (
        <Animated.View
          style={[
            styles.glow,
            {
              opacity: glowAnim,
              width: displayWidth + glowPad,
              height: displayHeight + glowPad,
              top: -glowPad / 2,
              left: -glowPad / 2,
              borderRadius: (displayWidth + glowPad) / 2,
            },
          ]}
        />
      )}

      <Svg width={displayWidth} height={displayHeight} viewBox="0 0 50 50">
        {/* Left ear */}
        <Ellipse
          cx="15"
          cy="12"
          rx="4"
          ry="10"
          fill="#90EE90"
          stroke={rabbit.isInvincible ? '#FFD700' : '#8B4513'}
          strokeWidth="1"
        />
        {/* Right ear */}
        <Ellipse
          cx="25"
          cy="10"
          rx="4"
          ry="11"
          fill="#90EE90"
          stroke={rabbit.isInvincible ? '#FFD700' : '#8B4513'}
          strokeWidth="1"
        />
        {/* Head */}
        <Circle
          cx="20"
          cy="23"
          r="12"
          fill="#4CAF50"
          stroke={rabbit.isInvincible ? '#FFD700' : '#8B4513'}
          strokeWidth="1"
        />
        {/* White lower face */}
        <Ellipse cx="20" cy="26" rx="9" ry="7" fill="#FFF" />
        {/* Body */}
        <Ellipse
          cx="22"
          cy="38"
          rx="10"
          ry="9"
          fill="#4CAF50"
          stroke={rabbit.isInvincible ? '#FFD700' : '#8B4513'}
          strokeWidth="1"
        />
        {/* White belly */}
        <Ellipse cx="22" cy="39" rx="7" ry="6" fill="#FFF" />
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
  glow: {
    position: 'absolute',
    backgroundColor: '#FFD700',
  },
});
