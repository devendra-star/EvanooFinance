import React, { Fragment } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { SystemBars, SystemBarStyle } from 'react-native-edge-to-edge';
import { WINDOW_WIDTH } from '../configs';
import { useAppTheme } from '../hook';

type Props = {
  children: React.ReactNode;
  edges?: Edges;
  backgroundColor?: string;
  systemBarStyle?: SystemBarStyle;
  style?: StyleProp<ViewStyle>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WINDOW_WIDTH,
  },
});

const Container: React.FC<Props> = props => {
  const { colors, isDark } = useAppTheme();

  return (
    <Fragment>
      <SystemBars
        style={
          isDark
            ? 'light' // Always light icons in dark mode
            : typeof props.systemBarStyle === 'undefined'
              ? 'light' // Default for primary background
              : props.systemBarStyle
        }
      />
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor:
              typeof props.backgroundColor !== 'undefined'
                ? props.backgroundColor
                : colors.primary,
          },
        ]}
        onLayout={props.onLayout}
        edges={
          typeof props.edges === 'undefined'
            ? ['left', 'right', 'top', 'bottom']
            : props.edges
        }
      >
        {props.children}
      </SafeAreaView>
    </Fragment>
  );
};

export default Container;
