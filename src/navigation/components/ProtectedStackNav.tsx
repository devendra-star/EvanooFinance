import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from '../types';
import { useAppSelector, useAppTheme } from '../../hook';
import CustomerService from '../../services/CustomerService';

import TabNavigator from './TabNavigator';
import LoanDetailsScreen from '../../screens/home/LoanDetailsScreen';
import CreditCardDetailsScreen from '../../screens/home/CreditCardDetailsScreen';
import PaymentHistory from '../../screens/payment-history';
import RegistrationScreen from '../../screens/auth/RegistrationScreen';

import SupportScreen from '../../screens/support/SupportScreen';
import HelpCenterScreen from '../../screens/support/HelpCenterScreen';
import LiveChatScreen from '../../screens/support/LiveChatScreen';
import RaiseTicketScreen from '../../screens/support/RaiseTicketScreen';
import FAQsScreen from '../../screens/support/FAQsScreen';

import ProfileScreen from '../../screens/profile/ProfileScreen';
import ProfileSettingsScreen from '../../screens/profile/ProfileSettingsScreen';
import NotificationsScreen from '../../screens/profile/NotificationsScreen';
import PrivacySecurityScreen from '../../screens/profile/PrivacySecurityScreen';

const Stack = createNativeStackNavigator<StackParamList>();

export default function ProtectedStackNav() {
  const [initialRoute, setInitialRoute] = useState<'MainTabs' | 'Registration' | null>(null);
  const mobileNumber = useAppSelector(state => state.auth.mobileNumber);
  const { colors } = useAppTheme();

  useEffect(() => {
    const checkProfile = async () => {
      if (!mobileNumber) {
        setInitialRoute('Registration');
        return;
      }
      try {
        const response = await CustomerService.lookupCustomer(mobileNumber);
        if (response?.data?.profileStatus === 'PROFILE_COMPLETED' || response?.data?.accountStatus === 'ACTIVE') {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Registration');
        }
      } catch (err) {
        setInitialRoute('Registration');
      }
    };
    checkProfile();
  }, [mobileNumber]);

  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        orientation: 'portrait',
      }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="LoanDetails" component={LoanDetailsScreen} />
      <Stack.Screen name="CreditCardDetails" component={CreditCardDetailsScreen} />
      <Stack.Screen name="PaymentHistory" component={PaymentHistory} />
      {/* Support flow */}
      <Stack.Screen name="Support" component={SupportScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="LiveChat" component={LiveChatScreen} />
      <Stack.Screen name="RaiseTicket" component={RaiseTicketScreen} />
      <Stack.Screen name="FAQs" component={FAQsScreen} />
      {/* Profile flow */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
    </Stack.Navigator>
  );
}
