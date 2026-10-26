import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { T } from '../src/theme';

type Props = {
  /** 0–100 */
  percent: number;
  /** Outer diameter in points */
  size?: number;
  /** Stroke thickness */
  strokeWidth?: number;
  /** Override ring colour */
  color?: string;
  /** Show text inside? */
  showText?: boolean;
  /** If true, ring is grey and no percentage shown */
  disabled?: boolean;
};

export default function ProgressRing({
  percent,
  size = 60,
  strokeWidth = 5,
  color,
  showText = true,
  disabled = false,
}: Props) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const ringColor = disabled
    ? T.muted + '40'
    : color ?? (clamped >= 75 ? T.success : T.danger);

  const textColor = disabled ? T.muted : ringColor;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={T.muted + '20'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {showText && (
        <Text style={[styles.text, { color: textColor, fontSize: size * 0.24 }]}>
          {disabled ? '0' : `${Math.round(clamped)}`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
