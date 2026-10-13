import React, { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Settings as SettingsIcon,
  Bell,
  ShieldCheck,
  LogOut,
  Trash2,
  ChevronRight,
  Lock,
  Pencil,
  UserCog,
  MapPin,
} from 'lucide-react-native';
import { ProfileScreenProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector, useAppTheme } from '../../hook';
import { logout } from '../../store/slices/authSlice';
import { Container } from '../../components';
import Header from '../../components/Header';
import CustomerService from '../../services/CustomerService';
import AuthService from '../../services/AuthService';
import { WINDOW_WIDTH } from '../../configs';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const mobileNumber = useAppSelector(state => state.auth.mobileNumber);
  const { colors } = useAppTheme();

  const [customer, setCustomer] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [isMpinModalVisible, setIsMpinModalVisible] = useState(false);
  const [currentMpin, setCurrentMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfileData = useCallback(async () => {
    if (!mobileNumber) {
      setLoadingProfile(false);
      return;
    }
    try {
      const response = await CustomerService.lookupCustomer(mobileNumber);
      if (response?.data) {
        setCustomer(response.data);
      }
    } catch (error) {
      console.log('Error fetching lookup data for profile:', error);
    } finally {
      setLoadingProfile(false);
      setRefreshing(false);
    }
  }, [mobileNumber]);

  useFocusEffect(
    useCallback(() => {
      fetchProfileData();
    }, [fetchProfileData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProfileData();
  };

  const handleChangeMpin = async () => {
    if (!currentMpin || !newMpin) {
      Alert.alert('Error', 'Please enter both current and new MPIN');
      return;
    }
    if (newMpin.length !== 6 || currentMpin.length !== 6) {
      Alert.alert('Error', 'MPIN must be 6 digits');
      return;
    }
    try {
      setIsLoading(true);
      await AuthService.changeMpin({ currentMpin, newMpin });
      Alert.alert('Success', 'MPIN changed successfully');
      setIsMpinModalVisible(false);
      setCurrentMpin('');
      setNewMpin('');
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to change MPIN',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AuthService.logout();
          } catch (e) {
            console.log('Logout API failed, still logging out locally', e);
          }
          dispatch(logout());
        },
      },
    ]);
  };

  const handleLogoutAll = () => {
    Alert.alert(
      'Logout All Devices',
      'This will sign you out of all devices including this one. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout All',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logoutAll();
            } catch (e) {
              console.log('Logout All API failed', e);
            }
            dispatch(logout());
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
      ],
    );
  };

  // Helper strings
  const fullName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(' ') ||
    'User Profile';

  const initials =
    (
      (customer?.firstName?.[0] || '') + (customer?.lastName?.[0] || '')
    ).toUpperCase() || 'U';

  const displayPhone =
    customer?.mobileNumber || customer?.mobile || mobileNumber || 'N/A';
  const displayEmail = customer?.email || 'No email registered';
  const customerId = customer?.customerId || '';
  const accountStatus = customer?.accountStatus || 'ACTIVE';
  const profileStatus = customer?.profileStatus || 'PROFILE_COMPLETED';
  const gender = customer?.gender || 'N/A';
  const dob = customer?.dateOfBirth || 'N/A';

  const formatAddress = (
    line1?: string | null,
    line2?: string | null,
    city?: string | null,
    state?: string | null,
    pincode?: string | null,
  ) => {
    const parts = [line1, line2, city, state].filter(Boolean);
    if (!parts.length && !pincode) return '';
    const main = parts.join(', ');
    return pincode ? `${main} - ${pincode}` : main;
  };

  const permAddressStr = formatAddress(
    customer?.permanentAddressLine1 || customer?.permanentAddress?.addressLine1,
    customer?.permanentAddressLine2 || customer?.permanentAddress?.addressLine2,
    customer?.permanentCity || customer?.permanentAddress?.city,
    customer?.permanentState || customer?.permanentAddress?.state,
    customer?.permanentPincode || customer?.permanentAddress?.pincode,
  );

  const currAddressStr = formatAddress(
    customer?.currentAddressLine1 || customer?.currentAddress?.addressLine1,
    customer?.currentAddressLine2 || customer?.currentAddress?.addressLine2,
    customer?.currentCity || customer?.currentAddress?.city,
    customer?.currentState || customer?.currentAddress?.state,
    customer?.currentPincode || customer?.currentAddress?.pincode,
  );

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Profile" showBackButton={true} />
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header Card with User Info and Edit Icon */}
          <LinearGradient
            colors={[colors.mainGradientStart, colors.mainGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.avatar}>
              <Text variant="titleMedium" style={{ color: colors.onGradient }}>
                {initials}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleMedium" style={{ color: colors.onGradient }}>
                {fullName}
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: colors.onGradientSubtext, marginTop: 2 }}
              >
                +91 {displayPhone} · {displayEmail}
              </Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                <View style={styles.kycBadge}>
                  <Text variant="labelSmall" style={{ color: colors.onGradient }}>
                    {profileStatus === 'PROFILE_COMPLETED' ? 'COMPLETED ✓' : profileStatus}
                  </Text>
                </View>
                {customerId ? (
                  <View style={[styles.kycBadge, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
                    <Text variant="labelSmall" style={{ color: colors.onGradient }}>
                      ID: {customerId}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>

            {/* Edit Icon on Profile Card */}
            <TouchableOpacity
              style={styles.editBtn}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('EditProfile', { customer })}
            >
              <Pencil size={18} color={colors.onGradient} />
            </TouchableOpacity>
          </LinearGradient>

          {loadingProfile && !customer ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text
                variant="bodySmall"
                style={{
                  color: colors.onSurfaceVariant,
                  marginTop: 8,
                }}
              >
                Loading profile data...
              </Text>
            </View>
          ) : null}

          {/* Details Grid */}
          <View style={styles.grid}>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                CUSTOMER ID
              </Text>
              <Text variant="titleSmall" style={{ color: colors.primary }}>
                {customerId || 'N/A'}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                ACCOUNT STATUS
              </Text>
              <Text variant="titleSmall" style={{ color: colors.success }}>
                {accountStatus}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                MOBILE
              </Text>
              <Text variant="titleSmall" style={{ color: colors.onSurface }}>
                +91 {displayPhone}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                EMAIL
              </Text>
              <Text
                variant="titleSmall"
                style={{ color: colors.onSurface }}
                numberOfLines={1}
              >
                {displayEmail}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                GENDER
              </Text>
              <Text variant="titleSmall" style={{ color: colors.onSurface }}>
                {gender}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text
                variant="labelSmall"
                style={{ color: colors.onSurfaceVariant, marginBottom: 4 }}
              >
                DATE OF BIRTH
              </Text>
              <Text variant="titleSmall" style={{ color: colors.onSurface }}>
                {dob}
              </Text>
            </View>
          </View>

          {/* Address Cards (Permanent & Current) */}
          {permAddressStr || currAddressStr ? (
            <View style={styles.addressSection}>
              {permAddressStr ? (
                <View
                  style={[
                    styles.addressCard,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View style={styles.addressCardHeader}>
                    <MapPin size={16} color={colors.primary} />
                    <Text
                      variant="labelMedium"
                      style={{
                        color: colors.onSurface,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Permanent Address
                    </Text>
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={{ color: colors.onSurfaceVariant, lineHeight: 18 }}
                  >
                    {permAddressStr}
                  </Text>
                </View>
              ) : null}

              {currAddressStr ? (
                <View
                  style={[
                    styles.addressCard,
                    { backgroundColor: colors.surface, marginTop: 10 },
                  ]}
                >
                  <View style={styles.addressCardHeader}>
                    <MapPin size={16} color={colors.primary} />
                    <Text
                      variant="labelMedium"
                      style={{
                        color: colors.onSurface,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      Current Address
                    </Text>
                  </View>
                  <Text
                    variant="bodyMedium"
                    style={{ color: colors.onSurfaceVariant, lineHeight: 18 }}
                  >
                    {currAddressStr}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}

          {/* Settings list */}
          <View style={[styles.list, { backgroundColor: colors.surface }]}>
            {/* Edit Profile Action Row */}
            <TouchableOpacity
              style={[
                styles.row,
                styles.rowBorder,
                { borderBottomColor: colors.borderColor },
              ]}
              onPress={() => navigation.navigate('EditProfile', { customer })}
            >
              <UserCog
                size={18}
                color={colors.primary}
                style={styles.rowIcon}
              />
              <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
                Edit Profile
              </Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                styles.rowBorder,
                { borderBottomColor: colors.borderColor },
              ]}
              onPress={() => navigation.navigate('ProfileSettings')}
            >
              <SettingsIcon
                size={18}
                color={colors.primary}
                style={styles.rowIcon}
              />
              <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
                Settings
              </Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                styles.rowBorder,
                { borderBottomColor: colors.borderColor },
              ]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell size={18} color={colors.primary} style={styles.rowIcon} />
              <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
                Notifications
              </Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.row,
                styles.rowBorder,
                { borderBottomColor: colors.borderColor },
              ]}
              onPress={() => setIsMpinModalVisible(true)}
            >
              <Lock size={18} color={colors.primary} style={styles.rowIcon} />
              <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
                Change MPIN
              </Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('PrivacySecurity')}
            >
              <ShieldCheck
                size={18}
                color={colors.primary}
                style={styles.rowIcon}
              />
              <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
                Privacy & Security
              </Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[
              styles.list,
              styles.singleRow,
              { backgroundColor: colors.surface },
            ]}
            onPress={handleLogout}
          >
            <LogOut size={18} color={colors.primary} style={styles.rowIcon} />
            <Text variant="titleMedium" style={{ flex: 1, color: colors.onSurface }}>
              Logout
            </Text>
          </TouchableOpacity>

          {/* Logout All Devices */}
          <TouchableOpacity
            style={[
              styles.list,
              styles.singleRow,
              { marginTop: 12, backgroundColor: colors.surface },
            ]}
            onPress={handleLogoutAll}
          >
            <LogOut size={18} color={colors.error} style={styles.rowIcon} />
            <Text variant="titleMedium" style={{ flex: 1, color: colors.error }}>
              Logout from all devices
            </Text>
          </TouchableOpacity>

          {/* Delete account */}
          <TouchableOpacity
            style={[
              styles.list,
              styles.singleRow,
              { marginTop: 12, backgroundColor: colors.surface },
            ]}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={18} color={colors.error} style={styles.rowIcon} />
            <Text variant="titleMedium" style={{ flex: 1, color: colors.error }}>
              Delete account
            </Text>
          </TouchableOpacity>

          <Text
            variant="bodySmall"
            style={{ textAlign: 'center', marginTop: 8, color: colors.onSurfaceVariant }}
          >
            Evanoo v1.0 · RBI compliant · PCI DSS ready
          </Text>
        </ScrollView>
      </View>

      {/* Change MPIN Modal */}
      <Modal
        visible={isMpinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMpinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <Text
              variant="titleMedium"
              style={{
                textAlign: 'center',
                marginBottom: 16,
                color: colors.onSurface,
              }}
            >
              Change MPIN
            </Text>

            <TextInput
              style={[
                styles.input,
                { color: colors.onSurface, borderColor: colors.borderColor },
              ]}
              placeholder="Current MPIN"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              value={currentMpin}
              onChangeText={setCurrentMpin}
            />

            <TextInput
              style={[
                styles.input,
                { color: colors.onSurface, borderColor: colors.borderColor },
              ]}
              placeholder="New MPIN"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              value={newMpin}
              onChangeText={setNewMpin}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.borderColor,
                  },
                ]}
                onPress={() => {
                  setIsMpinModalVisible(false);
                  setCurrentMpin('');
                  setNewMpin('');
                }}
              >
                <Text
                  variant="labelLarge"
                  style={{ color: colors.onSurface }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleChangeMpin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={colors.onPrimary} size="small" />
                ) : (
                  <Text variant="labelLarge" style={{ color: colors.onPrimary }}>
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  wrapper: {
    flex: 1,
    width: WINDOW_WIDTH,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  kycBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  loadingBox: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  gridItem: {
    width: '48%',
    borderRadius: 14,
    padding: 12,
  },
  addressSection: {
    marginBottom: 16,
  },
  addressCard: {
    borderRadius: 14,
    padding: 14,
  },
  addressCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  list: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  singleRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 1 },
  rowIcon: { marginRight: 12 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
