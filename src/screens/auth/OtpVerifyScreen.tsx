import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { TrendingUp, ShieldCheck } from 'lucide-react-native';
import { useAppDispatch, useAppSelector } from '../../hook';
import {
  verifyOtp,
  completeLogin,
  lockApp,
} from '../../store/slices/authSlice';
import { OtpVerifyScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import { useAppTheme } from '../../hook';

const CELL_COUNT = 6;

const validationSchema = Yup.object({
  otp: Yup.string()
    .length(CELL_COUNT, 'Enter the full 6-digit code')
    .required('OTP is required'),
});

const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = props => {
  const { colors } = useAppTheme();
  const mobileNumber = props.route.params.mobileNumber;
  // const { mobileNumber } = route.params;
  const dispatch = useAppDispatch();
  const authError = useAppSelector(state => state.auth.error);
  const status = useAppSelector(state => state.auth.status);
  const isEmail = mobileNumber.includes('@');

  const formik = useFormik({
    initialValues: { otp: '' },
    validationSchema,
    onSubmit: async values => {
      try {
        const result = await dispatch(
          verifyOtp({ mobileNumber, otp: values.otp }),
        ).unwrap();
        // Use replace so user can't hit back button to get stuck in OTP screen
        if (result.isMpinSet) {
          dispatch(completeLogin());
          dispatch(lockApp());
        } else {
          props.navigation.replace('SetPin');
        }
      } catch (error) {
        // Error is automatically handled in Redux state (authError)
      }
    },
  });

  const ref = useBlurOnFulfill({
    value: formik.values.otp,
    cellCount: CELL_COUNT,
  });
  const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
    value: formik.values.otp,
    setValue: val => formik.setFieldValue('otp', val),
  });

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
        {/* HEADER GRADIENT SECTION */}
        <LinearGradient
          colors={['#1DA1F2', '#0295DB']} // Bright blue gradient from mockup
          style={styles.headerGradient}
        >
          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoCircle}>
              <TrendingUp size={20} color="#0295DB" strokeWidth={3} />
            </View>
            <Text variant="titleMedium" style={styles.logoText}>
              EVANOO
            </Text>
          </View>

          <Text variant="displaySmall" style={styles.welcomeText}>
            Welcome back
          </Text>
          <Text variant="bodyLarge" style={styles.subtitleText}>
            Sign in to check your credit score and unlock offers.
          </Text>
        </LinearGradient>

        {/* OTP CARD */}
        <Surface
          style={[styles.loginCard, { backgroundColor: colors.surface }]}
          elevation={2}
        >
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: '700',
              color: colors.onSurface,
              marginBottom: 8,
            }}
          >
            Enter OTP
          </Text>
          <Text
            variant="bodyMedium"
            style={{ color: colors.onSurfaceVariant, marginBottom: 24 }}
          >
            We sent a 6-digit code to your {isEmail ? 'email' : 'mobile'}
          </Text>

          {/* OTP INPUT FIELD */}
          <View
            style={[
              styles.otpContainer,
              { borderColor: colors.outlineVariant },
            ]}
          >
            <CodeField
              ref={ref}
              {...fieldProps}
              value={formik.values.otp}
              onChangeText={val => formik.setFieldValue('otp', val)}
              cellCount={CELL_COUNT}
              rootStyle={styles.codeFieldRoot}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
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
                      {symbol}
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

          {formik.touched.otp && formik.errors.otp ? (
            <Text
              variant="labelSmall"
              style={{ color: colors.error, marginTop: 4, marginLeft: 4 }}
            >
              {formik.errors.otp}
            </Text>
          ) : null}
          {authError ? (
            <Text
              variant="labelSmall"
              style={{ color: colors.error, marginTop: 4, marginLeft: 4 }}
            >
              {authError}
            </Text>
          ) : null}

          {/* VERIFY BUTTON */}
          <TouchableOpacity
            style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
            onPress={() => formik.handleSubmit()}
            disabled={status === 'loading'}
          >
            <Text variant="titleMedium" style={styles.verifyBtnText}>
              {status === 'loading' ? 'Verifying...' : 'Verify & Continue'}
            </Text>
          </TouchableOpacity>

          {/* CHANGE NUMBER LINK */}
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            style={{ marginTop: 24, alignItems: 'center' }}
          >
            <Text
              variant="titleSmall"
              style={{
                color: colors.onSurfaceVariant,
                fontWeight: '600',
              }}
            >
              Change {isEmail ? 'email' : 'number'}
            </Text>
          </TouchableOpacity>
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

export default OtpVerifyScreen;

const styles = StyleSheet.create({
  headerGradient: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#FFF',
    fontWeight: '800',
    letterSpacing: 1,
  },
  welcomeText: {
    color: '#FFF',
    fontWeight: '700',
    marginBottom: 8,
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
  },
  cellText: {
    fontSize: 24,
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
