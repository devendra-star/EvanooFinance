import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
// import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Text, Surface, TouchableRipple } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  TrendingUp,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sun,
  Moon,
} from 'lucide-react-native';
import { useAppDispatch } from '../../hook';
import { sendOtp } from '../../store/slices/authSlice';
import { LoginScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import { WINDOW_WIDTH } from '../../configs';
import { useAppTheme } from '../../hook';
import { TextInput, GradientButton } from '../../components';

const mobileSchema = Yup.object({
  mobileNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number')
    .required('Mobile number is required'),
});

const LoginScreen: React.FC<LoginScreenProps> = props => {
  const { colors, isDark, toggleTheme } = useAppTheme();
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
      } catch (error: any) {}
    },
  });

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
            {'Welcome back'}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.onGradientSubtext }}>
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
              style={{ marginTop: 24 }}
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
              style={[styles.socialBtn, { borderColor: colors.borderColor }]}
            >
              <Image
                style={styles.logoIcon}
                source={require('../../assets/images/google.png')}
              />
              <Text variant="labelLarge" style={{ color: colors.onSurface }}>
                {'Google'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.socialBtn, { borderColor: colors.borderColor }]}
            >
              <Image
                style={[
                  styles.logoIcon,
                  isDark ? { tintColor: colors.outline } : undefined,
                ]}
                source={require('../../assets/images/apple-logo.png')}
              />
              <Text variant="labelLarge" style={{ color: colors.onSurface }}>
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
  logoIcon: {
    height: 15,
    width: 15,
  },
  loginCard: {
    marginHorizontal: 15,
    marginTop: -40,
    borderRadius: 20,
    padding: 15,
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
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
    gap: 8,
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
