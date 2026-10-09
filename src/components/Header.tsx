import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableRipple, useTheme } from 'react-native-paper';
import { ArrowLeft, LifeBuoy, User, Sun, Moon } from 'lucide-react-native';
import { useAppTheme } from '../hook';

type Props = {
  title?: string;
  onPressBack?: () => void;
  showBackButton?: boolean;
};

const Header: React.FC<Props> = props => {
  const navigation = useNavigation<any>();
  const { colors, isDark, toggleTheme } = useAppTheme();

  const onLeftIconPress = useCallback(() => {
    if (props.onPressBack) {
      props.onPressBack();
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }
  }, [navigation, props]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.borderColor,
        },
      ]}
    >
      {props.showBackButton ? (
        <TouchableRipple
          borderless={true}
          style={styles.iconBtn}
          onPress={onLeftIconPress}
        >
          <ArrowLeft
            size={24}
            color={colors.onSurface}
            absoluteStrokeWidth={true}
          />
        </TouchableRipple>
      ) : (
        <TouchableRipple
          borderless={true}
          style={[
            styles.iconBtn,
            {
              borderColor: colors.borderColor,
              borderWidth: 1,
              backgroundColor: colors.cardIconBox,
            },
          ]}
          onPress={() => navigation.navigate('Support')}
        >
          <LifeBuoy size={20} color={colors.primary} />
        </TouchableRipple>
      )}

      <View style={styles.titleContainer}>
        <Text
          variant="titleMedium"
        >
          {props.title || 'Home'}
        </Text>
      </View>

      <View style={styles.rightContainer}>
        <TouchableRipple
          borderless={true}
          style={styles.iconBtn}
          onPress={toggleTheme}
        >
          {isDark ? (
            <Sun size={24} color={colors.onSurface} />
          ) : (
            <Moon size={24} color={colors.onSurface} />
          )}
        </TouchableRipple>

        {!props.showBackButton ? (
          <TouchableRipple
            borderless={true}
            style={[styles.avatarBtn, { backgroundColor: colors.cardIconBox }]}
            onPress={() => navigation.navigate('Profile')}
          >
            <User size={20} color={colors.primary} />
          </TouchableRipple>
        ) : (
          <View style={styles.avatarBtn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});

export default Header;
