import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../hook';

interface GradientButtonProps {
  title: string;
  loadingTitle?: string;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  iconPosition?: 'absoluteRight' | 'right';
}

const GradientButton: React.FC<GradientButtonProps> = ({
  title,
  loadingTitle,
  loading = false,
  disabled = false,
  onPress,
  style,
  icon,
  iconPosition = 'right',
}) => {
  const { colors } = useAppTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={[
          colors.buttonGradientStart,
          colors.buttonGradientEnd,
        ]}
        style={[{ shadowColor: colors.primary }, styles.button, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text variant="titleMedium" style={[styles.text, { color: colors.onPrimary }]}>
          {loading ? (loadingTitle || title) : title}
        </Text>
        {!loading && icon && (
          <View style={iconPosition === 'absoluteRight' ? styles.absoluteRightIcon : styles.rightIcon}>
            {icon}
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  text: {},
  rightIcon: {
    marginLeft: 8,
  },
  absoluteRightIcon: {
    position: 'absolute',
    right: 20,
  },
});

export default GradientButton;
