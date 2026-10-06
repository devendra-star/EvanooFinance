import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Text, Surface } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TrendingUp,
  Phone,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from 'lucide-react-native';
import { useAppDispatch } from '../../hook';
import { sendOtp } from '../../store/slices/authSlice';
import { LoginScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import { WINDOW_WIDTH } from '../../configs';
import { useAppTheme } from '../../hook';
import { TextInput, GradientButton } from '../../components';
import Svg, { Path } from 'react-native-svg';

const mobileSchema = Yup.object({
  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
});

const LoginScreen: React.FC<LoginScreenProps> = props => {
  const { colors } = useAppTheme();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: { mobileNumber: '' },
    validationSchema: mobileSchema,
    onSubmit: async values => {
      try {
        const identifier = values.mobileNumber;
        if (!identifier) return;
        const result = await dispatch(sendOtp(identifier)).unwrap();
        Alert.alert('OTP', String((result as any)?.data?.otp));
        props.navigation.navigate('OtpVerify', { mobileNumber: identifier });
      } catch (error: any) {
      }
    },
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
        keyboardShouldPersistTaps='always'

      >
        <LinearGradient
          colors={['#1DA1F2', '#0295DB']}
          useAngle={true}
          angle={90}
          locations={[0, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.logoRow}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: colors.background },
              ]}
            >
              <TrendingUp size={20} color={colors.primary} />
            </View>
            <Text variant="titleMedium" style={{ color: colors.surface }}>
              {'EVANOO'}
            </Text>
          </View>
          <Text
            variant="headlineLarge"
            style={{ color: colors.surface, marginBottom: 8 }}
          >
            {'Welcome back'}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.surface }}>
            {'Sign in to check your credit score and unlock offers.'}
          </Text>
        </LinearGradient>
        <Surface
          style={[styles.loginCard, { backgroundColor: colors.surface }]}
          elevation={2}
        >
          <View>
            <TextInput
              label="Mobile number"
              leftIcon={<Phone size={18} color={colors.onSurfaceVariant} />}
              leftText="+91"
              placeholder="98765 43210"
              keyboardType="number-pad"
              maxLength={10}
              value={formik.values.mobileNumber}
              onChangeText={formik.handleChange('mobileNumber')}
              onBlur={formik.handleBlur('mobileNumber')}
              error={
                !!(formik.touched.mobileNumber && formik.errors.mobileNumber)
              }
              errorText={
                formik.touched.mobileNumber && formik.errors.mobileNumber
                  ? formik.errors.mobileNumber
                  : null
              }
            />
            <GradientButton
              title="Send OTP"
              loadingTitle="Sending..."
              loading={formik.isSubmitting}
              onPress={() => formik.handleSubmit()}
              icon={<ArrowRight size={18} color={colors.onPrimary} />}
              iconPosition="right"
              style={{ marginTop: 10 }}
            />
          </View>
          <View style={styles.dividerRow}>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.outlineVariant },
              ]}
            />
            <Text
              variant="labelSmall"
              style={{
                color: colors.onSurfaceVariant,
                paddingHorizontal: 12,
              }}
            >
              {'or continue with'}
            </Text>
            <View
              style={[
                styles.dividerLine,
                { backgroundColor: colors.outlineVariant },
              ]}
            />
          </View>
          <View style={styles.socialRow}>
            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: colors.outlineVariant }]}
            >
              <Text
                variant="titleMedium"
                style={{ fontWeight: 'bold', color: colors.error }}
              >
                {'G'}
              </Text>
              <Text
                variant="labelLarge"
                style={{ marginLeft: 8, color: colors.onSurface }}
              >
                {'Google'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: colors.outlineVariant }]}
            >
              <Svg width={20} height={20} viewBox="0 0 384 512">
                <Path
                  fill="#000000"
                  d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                />
              </Svg>
              <Text
                variant="labelLarge"
                style={{ marginLeft: 8, color: colors.onSurface }}
              >
                {'Apple'}
              </Text>
            </TouchableOpacity>
          </View>
        </Surface>
        <View style={styles.footer}>
          <ShieldCheck
            size={16}
            color={colors.onSurfaceVariant}
            style={{ marginRight: 6 }}
          />
          <Text variant="labelSmall">
            {'RBI compliant • 256-bit encryption'}
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WINDOW_WIDTH,
  },
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
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  loginCard: {
    marginHorizontal: 15,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 15,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    paddingVertical: 15,
    borderRadius: 100,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
});
