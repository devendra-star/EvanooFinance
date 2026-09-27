import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface Props {
  score: number;
  min?: number;
  max?: number;
  size?: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 180) * Math.PI) / 180.0;
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

const CreditScoreGauge = ({
  score,
  min = 300,
  max = 900,
  size = 220,
}: Props) => {
  const clamped = Math.max(min, Math.min(max, score));
  const percent = (clamped - min) / (max - min);
  const sweep = percent * 180;
  const strokeWidth = 16;
  const radius = size / 2 - strokeWidth;
  const cx = size / 2;
  const cy = size / 2;
  const trackPath = describeArc(cx, cy, radius, 0, 180);
  const scorePath = describeArc(cx, cy, radius, 0, sweep);

  return (
    <View style={{ alignItems: 'center' }}>
      <Svg width={size} height={size / 2 + strokeWidth}>
        <Defs>
          <LinearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#FF6B6B" />
            <Stop offset="0.5" stopColor="#FFD93D" />
            <Stop offset="1" stopColor="#4CD964" />
          </LinearGradient>
        </Defs>
        <Path
          d={trackPath}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d={scorePath}
          stroke="url(#scoreGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
      <View style={styles.labelBox}>
        <Text style={styles.scoreText}>{clamped}</Text>
        <Text style={styles.maxText}>/{max}</Text>
      </View>
    </View>
  );
};

export default CreditScoreGauge;

const styles = StyleSheet.create({
  labelBox: {
    position: 'absolute',
    top: '38%',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 42,
    fontWeight: '800',
    color: '#fff',
  },
  maxText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});
