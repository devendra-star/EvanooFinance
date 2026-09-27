import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import ReactNativeBiometrics from 'react-native-biometrics';
import { RootState } from '../store';
import { unlockApp, unlockWithPin } from '../store/slices/authSlice';
import { Fingerprint, ShieldCheck } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '../hook';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { ForgotPinModal } from '../components/ForgotPinModal';

const AppLockScreen = () => {
  const dispatch = useDispatch();
  const { colors } = useAppTheme();
  const { isLocked, isBiometricEnabled, mobileNumber } = useSelector(
    (state: RootState) => state.auth,
  );
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(!isBiometricEnabled);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);
  const CELL_COUNT = 6;
  const ref = useBlurOnFulfill({ value: pin, cellCount: CELL_COUNT });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: pin,
    setValue: setPin,
  });

  const rnBiometrics = new ReactNativeBiometrics();

  useEffect(() => {
    if (isLocked) {
      if (isBiometricEnabled) {
        setShowPin(false);
        handleBiometricAuth();
      } else {
        setShowPin(true);
      }
    }
  }, [isLocked, isBiometricEnabled]);

  const handleBiometricAuth = async () => {
    if (!isBiometricEnabled) {
      setShowPin(true);
      return;
    }
    setError('');
    try {
      const { available, biometryType } =
        await rnBiometrics.isSensorAvailable();

      if (available && biometryType) {
        const { success } = await rnBiometrics.simplePrompt({
          promptMessage: 'Unlock Evanoo Finance',
          cancelButtonText: 'Cancel',
        });

        if (success) {
          dispatch(unlockApp());
        }
      }
    } catch (err: any) {
      console.error('Biometric error:', err);
    }
  };

  const handlePinUnlock = async () => {
    if (!pin || pin.length !== CELL_COUNT) {
      setError(`Please enter a ${CELL_COUNT}-digit PIN`);
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(unlockWithPin(pin) as any).unwrap();
      setPin('');
      setError('');
      setShowPin(false);
    } catch (err: any) {
      setPin('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPin = () => {
    if (!mobileNumber) {
      setError('Mobile number not found');
      return;
    }
    setForgotModalVisible(true);
  };

  return (
    <View style={[styles.modal, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <ShieldCheck size={36} color={colors.primary} strokeWidth={2.5} />
          <Text
            variant="headlineMedium"
            style={[styles.brandName, { color: colors.onSurface }]}
          >
            {'EVANOO'}
          </Text>
          <Text
            variant="labelMedium"
            style={[styles.subBrand, { color: colors.primary }]}
          >
            {'SECURE ACCESS'}
          </Text>
        </View>
        {/* Biometric Area */}
        {!showPin ? (
          <View style={styles.biometricArea}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleBiometricAuth}
              style={[
                styles.fingerprintRing,
                {
                  borderColor: colors.primaryContainer,
                  backgroundColor: colors.surface,
                },
              ]}
            >
              <View
                style={[
                  styles.fingerprintInnerRing,
                  {
                    borderColor: colors.inversePrimary,
                    backgroundColor: colors.primaryContainer,
                  },
                ]}
              >
                <Fingerprint
                  size={80}
                  color={colors.primary}
                  strokeWidth={1.5}
                />
              </View>
            </TouchableOpacity>

            <Text
              variant="titleMedium"
              style={[styles.tapText, { color: colors.onSurface }]}
            >
              {'Tap to Verify Biometrics'}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.instructionText,
                { color: colors.onSurfaceVariant },
              ]}
            >
              {
                "Please scan your fingerprint to{'\n'}securely log in to EVANOO SECURE"
              }
            </Text>
          </View>
        ) : (
          <View style={styles.pinArea}>
            <Text
              variant="bodyMedium"
              style={[
                styles.instructionText,
                { color: colors.onSurfaceVariant, marginBottom: 20 },
              ]}
            >
              {'Enter your 6-digit PIN to access your account.'}
            </Text>
            <View
              style={[
                styles.otpContainer,
                { borderColor: colors.outlineVariant },
              ]}
            >
              <CodeField
                ref={ref}
                {...fieldProps}
                value={pin}
                onChangeText={setPin}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                secureTextEntry
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    style={[
                      styles.cell,
                      isFocused && { borderColor: colors.primary },
                      error ? { borderColor: colors.error } : null,
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol ? (
                      <Text
                        style={[styles.cellText, { color: colors.onSurface }]}
                      >
                        *
                      </Text>
                    ) : isFocused ? (
                      <Text
                        style={[styles.cellText, { color: colors.primary }]}
                      >
                        <Cursor />
                      </Text>
                    ) : (
                      <View style={styles.dot} />
                    )}
                  </View>
                )}
              />
            </View>
            <View style={{ alignSelf: 'flex-start' }}>
              <Text variant="bodySmall" style={{ color: colors.error }}>
                {error || ''}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleForgotPin}
              disabled={isSubmitting}
              style={{
                marginBottom: 20,
                alignSelf: 'flex-end',
                marginLeft: 8,
              }}
            >
              <Text
                variant="labelLarge"
                style={{
                  color: colors.error,
                }}
              >
                {' Forgot PIN'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePinUnlock} disabled={isSubmitting}>
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.unlockBtn}
              >
                <Text variant="labelLarge" style={styles.unlockBtnText}>
                  {isSubmitting ? 'Wait...' : 'Unlock'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        {/* Footer Actions */}
        <View style={styles.footer}>
          {isBiometricEnabled && (
            <TouchableOpacity
              onPress={() => setShowPin(!showPin)}
              style={styles.footerLink}
            >
              <Text
                variant="labelLarge"
                style={[styles.linkText, { color: colors.primary }]}
              >
                {showPin ? 'Use Biometrics' : 'Log in with PIN'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
      <ForgotPinModal
        visible={forgotModalVisible}
        mobileNumber={mobileNumber || ''}
        onClose={() => setForgotModalVisible(false)}
      />
    </View>
  );
};

export default AppLockScreen;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },
  header: {
    alignItems: 'center',
    marginTop: 30,
  },
  brandName: {
    marginTop: 12,
    letterSpacing: 2,
    fontWeight: 'bold', // Keeping bold for branding
  },
  subBrand: {
    letterSpacing: 4,
    marginTop: 4,
  },
  biometricArea: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  fingerprintRing: {
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fingerprintInnerRing: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapText: {
    marginTop: 35,
  },
  instructionText: {
    textAlign: 'center',
    marginTop: 12,
  },
  pinArea: {
    width: '100%',
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  otpContainer: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // marginBottom: 25,
  },
  codeFieldRoot: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  cell: {
    width: 36,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  cellText: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
  },
  unlockBtn: {
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  unlockBtnText: {
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerLink: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
});
