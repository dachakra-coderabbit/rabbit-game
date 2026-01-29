import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Coin } from '../types/game';

interface CoinItemProps {
  coin: Coin;
}

const COIN_SIZE = 50;

export const CoinItem: React.FC<CoinItemProps> = ({ coin }) => {
  if (coin.collected) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          left: coin.x,
          top: coin.y,
        },
      ]}
    >
      <Svg width={COIN_SIZE} height={COIN_SIZE} viewBox="0 0 50 50">
          {/* Outer gold ring */}
          <Circle
            cx="25"
            cy="25"
            r="23"
            fill="#FFD700"
            stroke="#B8860B"
            strokeWidth="2.5"
          />
          {/* Inner circle */}
          <Circle
            cx="25"
            cy="25"
            r="19"
            fill="#FFA500"
            stroke="#B8860B"
            strokeWidth="1.5"
          />
          {/* Inner detail ring */}
          <Circle
            cx="25"
            cy="25"
            r="16"
            fill="none"
            stroke="#FFD700"
            strokeWidth="0.5"
          />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: COIN_SIZE,
    height: COIN_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
