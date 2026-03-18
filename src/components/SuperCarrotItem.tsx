import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Ellipse } from 'react-native-svg';
import { SUPER_CARROT_SIZE } from '../constants/game';
import { SuperCarrot } from '../types/game';

interface SuperCarrotItemProps {
  superCarrot: SuperCarrot;
}

export const SuperCarrotItem: React.FC<SuperCarrotItemProps> = ({ superCarrot }) => {
  if (superCarrot.collected) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          left: superCarrot.x,
          top: superCarrot.y,
        },
      ]}
    >
      <Svg width={SUPER_CARROT_SIZE} height={SUPER_CARROT_SIZE} viewBox="0 0 40 40">
        {/* Leafy top */}
        <Path d="M20 14 Q14 6 10 10 Q14 10 16 14" fill="#228B22" />
        <Path d="M20 14 Q20 4 20 8 Q20 10 20 14" fill="#32CD32" />
        <Path d="M20 14 Q26 6 30 10 Q26 10 24 14" fill="#228B22" />

        {/* Carrot body — golden silhouette */}
        <Ellipse
          cx="20"
          cy="26"
          rx="7"
          ry="10"
          fill="#FFD700"
          stroke="#B8860B"
          strokeWidth="1.5"
        />

        {/* Shine highlight */}
        <Ellipse
          cx="17"
          cy="21"
          rx="2.5"
          ry="4"
          fill="#FFFACD"
          opacity="0.6"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: SUPER_CARROT_SIZE,
    height: SUPER_CARROT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
