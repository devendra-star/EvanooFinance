import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Shield } from 'lucide-react-native';
import BootSplash from 'react-native-bootsplash';
import Svg, { Rect, Path } from 'react-native-svg';
import { Text } from 'react-native-paper';
import { WINDOW_WIDTH } from '../configs';
import { useAppTheme } from '../hook';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen = ({ onFinish }: SplashScreenProps) => {
  const { colors } = useAppTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      await BootSplash.hide({ fade: false });
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        onFinish();
      }, 500);
    };
    init();
  }, [onFinish, fadeAnim]);

  return (
    <LinearGradient colors={['#0099DC', '#006BCE']} style={styles.container}>
      <View style={styles.logoContainer}>
        <Svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <Rect
            x="10"
            y="10"
            width="80"
            height="80"
            rx="25"
            fill={colors.surface}
          />
          <Path
            d="M 32 58 L 45 45 L 55 53 L 68 40"
            stroke={colors.primary}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d="M 55 40 L 68 40 L 68 53"
            stroke={colors.primary}
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
        <Text
          variant="displayMedium"
          style={[styles.brandName, { color: colors.surface }]}
        >
          {'EVANOO'}
        </Text>
        <Text
          variant="titleMedium"
          style={[styles.tagline, { color: colors.surface }]}
        >
          {'Know Your Credit. Get Better Loans.'}
        </Text>
      </Animated.View>
      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <Shield color={colors.surface} size={18} style={styles.shieldIcon} />
        <Text variant="bodySmall" style={{ color: colors.surface }}>
          {'Bank-grade encrypted'}
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  textContainer: {
    marginTop: 15,
    alignItems: 'center',
    width: WINDOW_WIDTH,
  },
  brandName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    opacity: 0.9,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.8,
  },
  shieldIcon: {
    marginRight: 6,
  },
});
