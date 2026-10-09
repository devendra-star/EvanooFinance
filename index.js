import { AppRegistry } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { name as appName } from './app.json';
import { store, persistor } from './src/store';
import { ThemeProvider } from './src/theme/ThemeProvider';
import App from './App';

if (__DEV__) {
  require('./ReactotronConfig');
}

const HeadlessCheck = ({ isHeadless }) => {
  if (isHeadless) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          {/* <KeyboardProvider> */}
          <App />
          {/* </KeyboardProvider> */}
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
