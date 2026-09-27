import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Calculator,
  Gauge,
  Landmark,
  CreditCard,
  BookOpen,
} from 'lucide-react-native';
import { BottomTabParamList } from '../types';
import { useAppTheme } from '../../hook';
import Dashboard from '../../screens/dashboard';
import EMICalculator from '../../screens/emi-calculator';
import Score from '../../screens/score';
import Cards from '../../screens/cards';
import Loans from '../../screens/loans';
import Khata from '../../screens/khatabook';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  const { colors } = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.outlineVariant,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Calc"
        component={EMICalculator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Calculator color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Score"
        component={Score}
        options={{
          tabBarIcon: ({ color, size }) => <Gauge color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Loans"
        component={Loans}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Landmark color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Cards"
        component={Cards}
        options={{
          tabBarIcon: ({ color, size }) => (
            <CreditCard color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Khata"
        component={Khata}
        options={{
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
