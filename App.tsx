import React, { useCallback, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation';
import SplashScreen from './src/screens/SplashScreen';
import { AppStateManager } from './src/components/AppStateManager';


export default function App() {
  const [isShowSplash, setShowSplash] = useState(true);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppStateManager>
          {isShowSplash ? (
            <SplashScreen onFinish={handleSplashFinish} />
          ) : (
            <RootNavigator />
          )}

        </AppStateManager>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
