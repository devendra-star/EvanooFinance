import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { PrivacySecurityScreenProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector } from '../../hook';
import ReactNativeBiometrics from 'react-native-biometrics';
import { SecurityService } from '../../store/slices/authSlice';

export default function PrivacySecurityScreen({}: PrivacySecurityScreenProps) {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();
  const isBiometricEnabled = useAppSelector(state => state.auth.isBiometricEnabled);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    const { available, biometryType } = await rnBiometrics.isSensorAvailable();
    if (available && biometryType) {
      setIsBiometricSupported(true);
    }
  };

  const toggleBiometric = async (value: boolean) => {
    if (value) {
      try {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Confirm fingerprint to enable Biometric Login',
          cancelButtonText: 'Cancel'
        });

        if (success) {
          dispatch({ type: 'auth/setupSecurityPin/fulfilled', payload: { isPinSet: true, isBiometricEnabled: true } });
          Alert.alert("Success", "Biometric login enabled successfully.");
        } else {
          Alert.alert("Error", "Authentication canceled or failed.");
        }
      } catch (e) {
        Alert.alert("Error", "Biometric not available.");
      }
    } else {
      dispatch({ type: 'auth/setupSecurityPin/fulfilled', payload: { isPinSet: true, isBiometricEnabled: false } });
    }
  };

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Privacy & Security" showBackButton={true} />
      <View style={styles.container}>
        {isBiometricSupported && (
          <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
            <View>
              <Text style={[styles.settingTitle, { color: colors.onSurface }]}>Biometric Lock</Text>
              <Text style={[styles.settingDesc, { color: colors.onSurfaceVariant }]}>Use fingerprint to unlock the app</Text>
            </View>
            <Switch
              value={isBiometricEnabled}
              onValueChange={toggleBiometric}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={'#f4f3f4'}
            />
          </View>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingTitle: { fontSize: 16, fontWeight: '600' },
  settingDesc: { fontSize: 13, marginTop: 4 },
});
