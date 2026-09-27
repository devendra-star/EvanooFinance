import React, { Fragment } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { SafeAreaView, Edges } from 'react-native-safe-area-context';
import { SystemBars, SystemBarStyle } from 'react-native-edge-to-edge';
import { useTheme } from 'react-native-paper';
import { WINDOW_WIDTH } from '../configs';

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
  const { colors } = useTheme();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Fragment>
      <SystemBars
        style={
          isDarkMode
            ? 'light'
            : typeof props.systemBarStyle === 'undefined'
              ? 'light'
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
