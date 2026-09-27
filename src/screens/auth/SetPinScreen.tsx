import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { ShieldCheck } from 'lucide-react-native';
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
  const { colors } = useAppTheme();
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
      // Skip redundant PIN verification step on fresh setup; log directly in.
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
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER GRADIENT */}
        <LinearGradient
          colors={['#1DA1F2', '#0295DB']}
          style={styles.headerGradient}
        >
          <Text variant="displaySmall" style={styles.welcomeText}>
            Secure your app
          </Text>
          <Text variant="bodyLarge" style={styles.subtitleText}>
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
              fontWeight: '700',
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
                      style={[styles.cellText, { color: colors.onSurface }]}
                    >
                      *
                    </Text>
                  ) : isFocused ? (
                    <Text style={[styles.cellText, { color: colors.primary }]}>
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
            <Text variant="titleMedium" style={styles.verifyBtnText}>
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
                style={{ color: colors.onSurfaceVariant, fontWeight: '600' }}
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
  welcomeText: {
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 30,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  loginCard: {
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
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
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 16,
    marginTop: 8,
  },
  verifyBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
