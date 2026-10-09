import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, Surface, List } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  User,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Calendar as CalendarIcon,
  Plus,
  Minus,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { RegistrationScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import { useAppTheme, useAppSelector, useAppDispatch } from '../../hook';
import { completeLogin } from '../../store/slices/authSlice';
import TextInput from '../../components/TextInput';
import GradientButton from '../../components/GradientButton';
import Accordion from '../../components/Accordion';
import CustomerService, { CustomerData } from '../../services/CustomerService';
import { WINDOW_WIDTH } from '../../configs';
import { Dropdown } from '../../components';

const validationSchema = Yup.object().shape({
  firstName: Yup.string(),
  lastName: Yup.string(),
  gender: Yup.string(),
  email: Yup.string().test(
    'is-email',
    'Invalid email',
    val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  ),
  dateOfBirth: Yup.string(),
  permanentAddress: Yup.object().shape({
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    pincode: Yup.string().test(
      'is-pincode',
      'Invalid pincode',
      val => !val || /^[0-9]{6}$/.test(val),
    ),
  }),
  currentAddress: Yup.object().shape({
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    pincode: Yup.string().test(
      'is-pincode',
      'Invalid pincode',
      val => !val || /^[0-9]{6}$/.test(val),
    ),
  }),
});

const RegistrationScreen: React.FC<RegistrationScreenProps> = props => {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [permanentExpanded, setPermanentExpanded] = useState(false);
  const [currentExpanded, setCurrentExpanded] = useState(false);
  const identifier = useAppSelector(state => state.auth.mobileNumber);
  const authUserId = useAppSelector(state => state.auth.userId);
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const dispatch = useAppDispatch();

  const formik = useFormik<CustomerData>({
    initialValues: {
      userId: authUserId || 0,
      firstName: '',
      lastName: '',
      gender: 'MALE',
      email: '',
      dateOfBirth: '',
      permanentAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
      currentAddress: {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
      },
    },
    validationSchema,
    onSubmit: async values => {
      setLoading(true);
      try {
        const payload = buildPayload(values);
        const response = await CustomerService.registerCustomer(payload);

        if (
          response?.data?.profileStatus === 'PROFILE_COMPLETED' ||
          response?.data?.accountStatus === 'ACTIVE'
        ) {
          if (isLoggedIn) {
            props.navigation.replace('MainTabs', { screen: 'Home' });
          }
        } else {
          Alert.alert(
            'Profile Incomplete',
            'Please ensure all mandatory fields are filled correctly.',
          );
        }
      } catch (error: any) {
        Alert.alert('Error', error.message || 'Failed to register');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchLookupData = async () => {
      if (!identifier) return;
      try {
        const response = await CustomerService.lookupCustomer(identifier);
        const customer = response?.data;
        // pre-fill the form
        if (customer) {
          formik.setValues({
            userId: authUserId || customer.id || customer.userId || 0,
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            gender: customer.gender,
            email: customer.email || '',
            dateOfBirth: customer.dateOfBirth || '',
            permanentAddress: {
              addressLine1: customer.permanentAddressLine1 || '',
              addressLine2: customer.permanentAddressLine2 || '',
              city: customer.permanentCity || '',
              state: customer.permanentState || '',
              pincode: customer.permanentPincode || '',
            },
            currentAddress: {
              addressLine1: customer.currentAddressLine1 || '',
              addressLine2: customer.currentAddressLine2 || '',
              city: customer.currentCity || '',
              state: customer.currentState || '',
              pincode: customer.currentPincode || '',
            },
          });
        }
      } catch (error) {
        console.log('Lookup failed or no data yet', error);
      }
    };
    fetchLookupData();
  }, []);

  const buildPayload = (currentValues: any) => {
    const payload: any = { userId: currentValues.userId || 0 };

    Object.keys(currentValues).forEach(key => {
      const value = currentValues[key];

      if (typeof value === 'object' && value !== null) {
        const nestedObj: any = {};
        let hasNestedValues = false;
        Object.keys(value).forEach(nestedKey => {
          const nestedVal = value[nestedKey];
          if (
            nestedVal &&
            typeof nestedVal === 'string' &&
            nestedVal.trim() !== ''
          ) {
            nestedObj[nestedKey] = nestedVal;
            hasNestedValues = true;
          }
        });
        if (hasNestedValues) {
          payload[key] = nestedObj;
        }
      } else if (
        value &&
        ((typeof value === 'string' && value.trim() !== '') ||
          typeof value === 'number')
      ) {
        payload[key] = value;
      }
    });

    return payload;
  };

  const handleBlurSave = async (overrides?: any) => {
    try {
      const extra =
        typeof overrides === 'object' &&
          overrides !== null &&
          !overrides.nativeEvent
          ? overrides
          : {};
      const currentValues = { ...formik.values, ...extra };
      const payload = buildPayload(currentValues);

      await CustomerService.registerCustomer(payload);
    } catch (error) {
      console.log('Auto save failed', error);
    }
  };

  const insets = useSafeAreaInsets();

  return (
    <Container edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: colors.background,
        }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
          useAngle={true}
          angle={90}
          locations={[0, 1]}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.logoRow}>
            <View
              style={[
                styles.logoCircle,
                { backgroundColor: colors.background },
              ]}
            >
              <User size={20} color={colors.primary} />
            </View>
            <Text variant="titleMedium" style={{ color: colors.surface }}>
              {'EVANOO'}
            </Text>
          </View>
          <Text
            variant="headlineLarge"
            style={{ color: colors.surface, marginBottom: 8 }}
          >
            {'Complete Profile'}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.surface }}>
            {'Please fill out your details to continue.'}
          </Text>
        </LinearGradient>

        <Surface
          style={[styles.registrationCard, { backgroundColor: colors.surface }]}
          elevation={2}
        >
          <TextInput
            label="First Name"
            value={formik.values.firstName}
            onChangeText={formik.handleChange('firstName')}
            onBlur={e => {
              formik.handleBlur('firstName')(e);
              handleBlurSave();
            }}
            error={!!(formik.touched.firstName && formik.errors.firstName)}
            errorText={
              formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : null
            }
            containerStyle={{ marginBottom: 10 }}
          />
          <TextInput
            label="Last Name"
            value={formik.values.lastName}
            onChangeText={formik.handleChange('lastName')}
            onBlur={e => {
              formik.handleBlur('lastName')(e);
              handleBlurSave();
            }}
            error={!!(formik.touched.lastName && formik.errors.lastName)}
            errorText={
              formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : null
            }
            containerStyle={{ marginBottom: 10 }}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Dropdown
                label="Gender"
                value={formik.values.gender}
                options={['MALE', 'FEMALE', 'OTHER']}
                onChange={v => formik.setFieldValue('gender', v)}
              />
            </View>
            <View style={{ flex: 1 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
              >
                <View pointerEvents="none">
                  <TextInput
                    label="Date of Birth"
                    value={formik.values.dateOfBirth}
                    error={
                      !!(
                        formik.touched.dateOfBirth &&
                        (formik.errors.dateOfBirth as string)
                      )
                    }
                    errorText={
                      formik.touched.dateOfBirth && formik.errors.dateOfBirth
                        ? (formik.errors.dateOfBirth as string)
                        : null
                    }
                    containerStyle={{ marginBottom: 10 }}
                    editable={false}
                    rightIcon={
                      <CalendarIcon color={colors.onSurfaceVariant} size={20} />
                    }
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <TextInput
            label="Email"
            value={formik.values.email}
            onChangeText={formik.handleChange('email')}
            keyboardType="email-address"
            onBlur={e => {
              formik.handleBlur('email')(e);
              handleBlurSave();
            }}
            error={!!(formik.touched.email && formik.errors.email)}
            errorText={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : null
            }
            containerStyle={{ marginBottom: 10 }}
          />
        </Surface>
        <Surface
          style={[styles.registrationCard, { backgroundColor: colors.surface, marginTop: 15 }]}
          elevation={2}
        >
          <Accordion
            title="Permanent Address"
            expanded={permanentExpanded}
            onPress={() => setPermanentExpanded(!permanentExpanded)}
          >
            <TextInput
              label="Address Line 1"
              value={formik.values.permanentAddress?.addressLine1}
              onChangeText={formik.handleChange(
                'permanentAddress.addressLine1',
              )}
              onBlur={e => {
                formik.handleBlur('permanentAddress.addressLine1')(e);
                handleBlurSave();
              }}
              containerStyle={{ marginBottom: 10 }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="City"
                  value={formik.values.permanentAddress?.city}
                  onChangeText={formik.handleChange('permanentAddress.city')}
                  onBlur={e => {
                    formik.handleBlur('permanentAddress.city')(e);
                    handleBlurSave();
                  }}
                  containerStyle={{ marginBottom: 10 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="State"
                  value={formik.values.permanentAddress?.state}
                  onChangeText={formik.handleChange('permanentAddress.state')}
                  onBlur={e => {
                    formik.handleBlur('permanentAddress.state')(e);
                    handleBlurSave();
                  }}
                  containerStyle={{ marginBottom: 10 }}
                />
              </View>
            </View>
            <TextInput
              label="Pincode"
              value={formik.values.permanentAddress?.pincode}
              onChangeText={formik.handleChange('permanentAddress.pincode')}
              keyboardType="number-pad"
              onBlur={e => {
                formik.handleBlur('permanentAddress.pincode')(e);
                handleBlurSave();
              }}
              containerStyle={{ marginBottom: 10 }}
            />
          </Accordion>
          <Accordion
            title="Current Address"
            expanded={currentExpanded}
            onPress={() => setCurrentExpanded(!currentExpanded)}
          >
            <TextInput
              label="Address Line 1"
              value={formik.values.currentAddress?.addressLine1}
              onChangeText={formik.handleChange('currentAddress.addressLine1')}
              onBlur={e => {
                formik.handleBlur('currentAddress.addressLine1')(e);
                handleBlurSave();
              }}
              containerStyle={{ marginBottom: 10 }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="City"
                  value={formik.values.currentAddress?.city}
                  onChangeText={formik.handleChange('currentAddress.city')}
                  onBlur={e => {
                    formik.handleBlur('currentAddress.city')(e);
                    handleBlurSave();
                  }}
                  containerStyle={{ marginBottom: 10 }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  label="State"
                  value={formik.values.currentAddress?.state}
                  onChangeText={formik.handleChange('currentAddress.state')}
                  onBlur={e => {
                    formik.handleBlur('currentAddress.state')(e);
                    handleBlurSave();
                  }}
                  containerStyle={{ marginBottom: 10 }}
                />
              </View>
            </View>
            <TextInput
              label="Pincode"
              value={formik.values.currentAddress?.pincode}
              onChangeText={formik.handleChange('currentAddress.pincode')}
              keyboardType="number-pad"
              onBlur={e => {
                formik.handleBlur('currentAddress.pincode')(e);
                handleBlurSave();
              }}
              containerStyle={{ marginBottom: 10 }}
            />
          </Accordion>
        </Surface>

        <View style={styles.buttonContainer}>
          <GradientButton
            title="Save & Continue"
            loadingTitle="Saving..."
            loading={loading}
            onPress={formik.handleSubmit}
            icon={<ArrowRight size={20} color={colors.onPrimary} />}
            iconPosition="absoluteRight"
            style={{ marginVertical: 20 }}
          />
        </View>
      </ScrollView>

      {/* Date Picker Component */}
      {showDatePicker && (
        <DateTimePicker
          value={
            formik.values.dateOfBirth
              ? new Date(formik.values.dateOfBirth)
              : new Date()
          }
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: any, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (event.type === 'set' && selectedDate) {
              const dateString = selectedDate.toISOString().split('T')[0];
              formik.setFieldValue('dateOfBirth', dateString);
              handleBlurSave({ dateOfBirth: dateString });
            }
          }}
        />
      )}
      <Modal visible={showGenderPicker} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowGenderPicker(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: colors.surface, padding: 0 },
                ]}
              >
                {['MALE', 'FEMALE', 'OTHER'].map(gender => (
                  <TouchableOpacity
                    key={gender}
                    style={[
                      styles.dropdownItem,
                      { borderBottomColor: colors.borderColor },
                    ]}
                    onPress={() => {
                      formik.setFieldValue('gender', gender);
                      setShowGenderPicker(false);
                      handleBlurSave({ gender });
                    }}
                  >
                    <Text variant="bodyLarge">{gender}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Container>
  );
};

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
  registrationCard: {
    marginHorizontal: 15,
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
});

export default RegistrationScreen;
