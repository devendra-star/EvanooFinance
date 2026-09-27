import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from '../types';
import AppLockScreen from '../../screens/AppLockScreen';

const Stack = createNativeStackNavigator<StackParamList>();

const SemiProtectedStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen name="AppLock" component={AppLockScreen} />
    </Stack.Navigator>
  );
};

export default SemiProtectedStackNav;
