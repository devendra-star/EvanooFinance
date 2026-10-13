import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, TouchableRipple } from 'react-native-paper';
import { ShieldCheck, TrendingUp, Sun, Moon } from 'lucide-react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useAppDispatch, useAppTheme } from '../../hook';
import {
  setupSecurityPin,
  completeLogin,
  markPinAsSet,
  lockApp,
} from '../../store/slices/authSlice';
import { SetPinScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import LinearGradient from 'react-native-linear-gradient';

const CELL_COUNT = 6;

const SetPinScreen: React.FC<SetPinScreenProps> = props => {
  const { colors, isDark, toggleTheme } = useAppTheme();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<1 | 2>(1);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeValue = step === 1 ? pin : confirmPin;
  const setActiveValue = step === 1 ? setPin : setConfirmPin;
  const ref = useBlurOnFulfill({ value: activeValue, cellCount: CELL_COUNT });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: activeValue,
    setValue: setActiveValue,
  });

  const handleNext = () => {
    if (step === 1) {
      if (pin.length === CELL_COUNT) {
        setStep(2);
        setError('');
      } else {
        setError('Please enter a 6-digit PIN');
      }
    } else {
      if (confirmPin.length === CELL_COUNT) {
        if (pin === confirmPin) {
          setError('');
          submitPinSetup();
        } else {
          setError('PINs do not match. Try again.');
          setConfirmPin('');
        }
      } else {
        setError('Please confirm your 6-digit PIN');
      }
    }
  };

  const submitPinSetup = async () => {
    setIsSubmitting(true);
    try {
      await dispatch(setupSecurityPin({ pin })).unwrap();
      // Complete login immediately so AppLock triggers on next launch
      dispatch(completeLogin());
    } catch (err: any) {
      const errMsg = err?.message || err;
      if (
        typeof errMsg === 'string' &&
        (errMsg.includes('already configured') ||
          errMsg.includes('already set'))
      ) {
        // Backend knows PIN is already set (user logged out & logged in again). Sync state and verify.
        dispatch(markPinAsSet());
        dispatch(completeLogin());
        dispatch(lockApp());
      } else {
        setError(
          typeof errMsg === 'string'
            ? errMsg
            : 'Failed to setup PIN. Please try again.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      edges={['left', 'right', 'bottom']}
      backgroundColor={colors.background}
      systemBarStyle="light"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* HEADER GRADIENT */}
        <LinearGradient
          colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
          useAngle={true}
          angle={180}
          locations={[0, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.logoRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.logoCircle,
                  { backgroundColor: colors.onGradientSurface },
                ]}
              >
                <TrendingUp size={20} color={colors.primary} />
              </View>
              <Text variant="titleMedium" style={{ color: colors.onGradient, marginLeft: 8 }}>
                {'EVANOO'}
              </Text>
            </View>
            <TouchableRipple
              borderless={true}
              style={[styles.iconBtn, { backgroundColor: colors.onGradientOverlay }]}
              onPress={toggleTheme}
            >
              {isDark ? (
                <Sun size={22} color={colors.onGradient} />
              ) : (
                <Moon size={22} color={colors.onGradient} />
              )}
            </TouchableRipple>
          </View>

          <Text
            variant="headlineLarge"
            style={{ color: colors.onGradient, marginBottom: 8 }}
          >
            {'Secure your app'}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onGradientSubtext }}>
            {step === 1
              ? 'Create a 6-digit PIN to secure your account.'
              : 'Please confirm your 6-digit PIN.'}
          </Text>
        </LinearGradient>

        {/* PIN CARD */}
        <Surface
          style={[styles.loginCard, { backgroundColor: colors.surface }]}
          elevation={2}
        >
          <Text
            variant="headlineSmall"
            style={{
              color: colors.onSurface,
              marginBottom: 24,
            }}
          >
            {step === 1 ? 'Enter PIN' : 'Confirm PIN'}
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
              value={activeValue}
              onChangeText={setActiveValue}
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
                  ]}
                  onLayout={getCellOnLayoutHandler(index)}
                >
                  {symbol ? (
                    <Text
                      variant="headlineMedium"
                      style={[styles.cellText, { color: colors.onSurface }]}
                    >
                      *
                    </Text>
                  ) : isFocused ? (
                    <Text
                      variant="headlineMedium"
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

          {error ? (
            <Text
              variant="labelSmall"
              style={{ color: colors.error, marginTop: 4, marginLeft: 4 }}
            >
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text variant="titleMedium" style={{ color: colors.onPrimary }}>
              {isSubmitting ? 'Saving...' : step === 1 ? 'Next' : 'Confirm'}
            </Text>
          </TouchableOpacity>

          {step === 2 && (
            <TouchableOpacity
              onPress={() => {
                setStep(1);
                setPin('');
                setConfirmPin('');
                setError('');
              }}
              style={{ marginTop: 24, alignItems: 'center' }}
            >
              <Text
                variant="titleSmall"
                style={{ color: colors.onSurfaceVariant }}
              >
                Back to Set PIN
              </Text>
            </TouchableOpacity>
          )}
        </Surface>

        {/* FOOTER */}
        <View style={styles.footer}>
          <ShieldCheck
            size={16}
            color={colors.onSurfaceVariant}
            style={{ marginRight: 6 }}
          />
          <Text variant="labelSmall" style={{ color: colors.onSurfaceVariant }}>
            RBI compliant • 256-bit encryption
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default SetPinScreen;

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginCard: {
    marginHorizontal: 15,
    marginTop: -40,
    borderRadius: 20,
    padding: 15,
  },
  otpContainer: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
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
    textAlign: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#94A3B8',
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 16,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
