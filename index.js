import { AppRegistry, useColorScheme } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { PaperProvider } from 'react-native-paper';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { name as appName } from './app.json';
import { store, persistor } from './src/store';
import { lightTheme, darkTheme } from './src/theme';
import App from './App';

if (__DEV__) {
  require('./ReactotronConfig');
}

const HeadlessCheck = ({ isHeadless }) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  if (isHeadless) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          {/* <KeyboardProvider> */}
          <App />
          {/* </KeyboardProvider> */}
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
