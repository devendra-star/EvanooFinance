import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  User,
  MapPin,
  ArrowRight,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { EditProfileScreenProps } from '../../navigation/types';
import Container from '../../components/Container';
import Header from '../../components/Header';
import { useAppTheme, useAppSelector } from '../../hook';
import TextInput from '../../components/TextInput';
import GradientButton from '../../components/GradientButton';
import Accordion from '../../components/Accordion';
import CustomerService, { CustomerData } from '../../services/CustomerService';
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

const EditProfileScreen: React.FC<EditProfileScreenProps> = props => {
  const { colors } = useAppTheme();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [permanentExpanded, setPermanentExpanded] = useState(false);
  const [currentExpanded, setCurrentExpanded] = useState(false);

  const identifier = useAppSelector(state => state.auth.mobileNumber);
  const authUserId = useAppSelector(state => state.auth.userId);

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
        await CustomerService.registerCustomer(payload);

        Alert.alert('Success', 'Profile updated successfully!', [
          {
            text: 'OK',
            onPress: () => props.navigation.goBack(),
          },
        ]);
      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.response?.data?.message || error.message || 'Failed to update profile',
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchLookupData = async () => {
      const mob = props.route?.params?.customer?.mobileNumber || identifier;
      if (!mob) return;

      try {
        const response = await CustomerService.lookupCustomer(mob);
        const customer = response?.data;

        if (customer) {
          formik.setValues({
            userId: authUserId || customer.id || customer.userId || 0,
            firstName: customer.firstName || '',
            lastName: customer.lastName || '',
            gender: customer.gender || 'MALE',
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

          if (customer.permanentAddressLine1 || customer.permanentCity) {
            setPermanentExpanded(true);
          }
          if (customer.currentAddressLine1 || customer.currentCity) {
            setCurrentExpanded(true);
          }
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

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Edit Profile" showBackButton={true} />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* Card 1: Personal Information */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.cardIconBox || colors.primaryContainer },
              ]}
            >
              <User size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                variant="titleMedium"
                style={{ color: colors.onSurface }}
              >
                Personal Details
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                Basic information registered with your account
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <TextInput
              label="First Name"
              value={formik.values.firstName}
              onChangeText={formik.handleChange('firstName')}
              onBlur={formik.handleBlur('firstName')}
              error={!!(formik.touched.firstName && formik.errors.firstName)}
              errorText={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : null
              }
              containerStyle={{ marginBottom: 12 }}
            />

            <TextInput
              label="Last Name"
              value={formik.values.lastName}
              onChangeText={formik.handleChange('lastName')}
              onBlur={formik.handleBlur('lastName')}
              error={!!(formik.touched.lastName && formik.errors.lastName)}
              errorText={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : null
              }
              containerStyle={{ marginBottom: 12 }}
            />

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 12 }}>
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
              autoCapitalize="none"
              onBlur={formik.handleBlur('email')}
              error={!!(formik.touched.email && formik.errors.email)}
              errorText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : null
              }
              containerStyle={{ marginBottom: 4 }}
            />
          </View>
        </Surface>

        {/* Card 2: Address Details */}
        <Surface
          style={[styles.card, { backgroundColor: colors.surface, marginTop: 16 }]}
          elevation={1}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.iconBox,
                { backgroundColor: colors.cardIconBox || colors.primaryContainer },
              ]}
            >
              <MapPin size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text
                variant="titleMedium"
                style={{ color: colors.onSurface }}
              >
                Address Details
              </Text>
              <Text variant="bodySmall" style={{ color: colors.onSurfaceVariant }}>
                Permanent and current communication addresses
              </Text>
            </View>
          </View>

          <View style={styles.formSection}>
            <Accordion
              title="Permanent Address"
              expanded={permanentExpanded}
              onPress={() => setPermanentExpanded(!permanentExpanded)}
            >
              <TextInput
                label="Address Line 1"
                value={formik.values.permanentAddress?.addressLine1}
                onChangeText={formik.handleChange('permanentAddress.addressLine1')}
                onBlur={formik.handleBlur('permanentAddress.addressLine1')}
                containerStyle={{ marginBottom: 10 }}
              />
              <TextInput
                label="Address Line 2 (Optional)"
                value={formik.values.permanentAddress?.addressLine2}
                onChangeText={formik.handleChange('permanentAddress.addressLine2')}
                onBlur={formik.handleBlur('permanentAddress.addressLine2')}
                containerStyle={{ marginBottom: 10 }}
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label="City"
                    value={formik.values.permanentAddress?.city}
                    onChangeText={formik.handleChange('permanentAddress.city')}
                    onBlur={formik.handleBlur('permanentAddress.city')}
                    containerStyle={{ marginBottom: 10 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label="State"
                    value={formik.values.permanentAddress?.state}
                    onChangeText={formik.handleChange('permanentAddress.state')}
                    onBlur={formik.handleBlur('permanentAddress.state')}
                    containerStyle={{ marginBottom: 10 }}
                  />
                </View>
              </View>
              <TextInput
                label="Pincode"
                value={formik.values.permanentAddress?.pincode}
                onChangeText={formik.handleChange('permanentAddress.pincode')}
                keyboardType="number-pad"
                maxLength={6}
                onBlur={formik.handleBlur('permanentAddress.pincode')}
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
                onBlur={formik.handleBlur('currentAddress.addressLine1')}
                containerStyle={{ marginBottom: 10 }}
              />
              <TextInput
                label="Address Line 2 (Optional)"
                value={formik.values.currentAddress?.addressLine2}
                onChangeText={formik.handleChange('currentAddress.addressLine2')}
                onBlur={formik.handleBlur('currentAddress.addressLine2')}
                containerStyle={{ marginBottom: 10 }}
              />
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label="City"
                    value={formik.values.currentAddress?.city}
                    onChangeText={formik.handleChange('currentAddress.city')}
                    onBlur={formik.handleBlur('currentAddress.city')}
                    containerStyle={{ marginBottom: 10 }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    label="State"
                    value={formik.values.currentAddress?.state}
                    onChangeText={formik.handleChange('currentAddress.state')}
                    onBlur={formik.handleBlur('currentAddress.state')}
                    containerStyle={{ marginBottom: 10 }}
                  />
                </View>
              </View>
              <TextInput
                label="Pincode"
                value={formik.values.currentAddress?.pincode}
                onChangeText={formik.handleChange('currentAddress.pincode')}
                keyboardType="number-pad"
                maxLength={6}
                onBlur={formik.handleBlur('currentAddress.pincode')}
                containerStyle={{ marginBottom: 10 }}
              />
            </Accordion>
          </View>
        </Surface>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <GradientButton
            title="Save Changes"
            loadingTitle="Saving..."
            loading={loading}
            onPress={formik.handleSubmit}
            icon={<ArrowRight size={20} color={colors.onPrimary} />}
            iconPosition="absoluteRight"
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
            }
          }}
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 18,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formSection: {
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 10,
  },
});

export default EditProfileScreen;
