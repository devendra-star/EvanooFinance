import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Settings as SettingsIcon,
  Bell,
  ShieldCheck,
  LogOut,
  Trash2,
  ChevronRight,
  Lock,
} from 'lucide-react-native';
import { ProfileScreenProps } from '../../navigation/types';
import { useAppDispatch, useAppSelector, useAppTheme } from '../../hook';
import { logout } from '../../store/slices/authSlice';
import { Container } from '../../components';
import Header from '../../components/Header';
import { WINDOW_WIDTH } from '../../configs';

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const dispatch = useAppDispatch();
  const mobileNumber = useAppSelector(state => state.auth.mobileNumber);
  const { colors } = useAppTheme();

  const [isMpinModalVisible, setIsMpinModalVisible] = useState(false);
  const [currentMpin, setCurrentMpin] = useState('');
  const [newMpin, setNewMpin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      const AuthService = require('../../services/AuthService').default;
      await AuthService.changeMpin({ currentMpin, newMpin });
      Alert.alert('Success', 'MPIN changed successfully');
      setIsMpinModalVisible(false);
      setCurrentMpin('');
      setNewMpin('');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to change MPIN');
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
            const AuthService = require('../../services/AuthService').default;
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
    Alert.alert('Logout All Devices', 'This will sign you out of all devices including this one. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout All',
        style: 'destructive',
        onPress: async () => {
          try {
            const AuthService = require('../../services/AuthService').default;
            await AuthService.logoutAll();
          } catch (e) {
            console.log('Logout All API failed', e);
          }
          dispatch(logout());
        },
      },
    ]);
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
            // Real app: API call to delete account, then log out
            dispatch(logout());
          },
        },
      ],
    );
  };

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Profile" showBackButton={true} />
      <View style={styles.wrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <LinearGradient
            colors={[colors.mainGradientStart, colors.mainGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.header}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AR</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.name}>Aarav Reddy</Text>
              <Text style={styles.subInfo}>
                +91 {mobileNumber ?? '98765 43210'} · aarav@evanoo.in
              </Text>
              <View style={styles.kycBadge}>
                <Text style={styles.kycText}>KYC ✓</Text>
              </View>
            </View>
          </LinearGradient>

          {/* PAN / KYC / Mobile / Email grid */}
          <View style={styles.grid}>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>PAN (MASKED)</Text>
              <Text style={[styles.gridValue, { color: colors.onSurface }]}>ABCDE••••F</Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>KYC STATUS</Text>
              <Text style={[styles.gridValue, { color: '#2E9E4C' }]}>Verified</Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>MOBILE</Text>
              <Text style={[styles.gridValue, { color: colors.onSurface }]}>
                +91 {mobileNumber ?? '98765 43210'}
              </Text>
            </View>
            <View style={[styles.gridItem, { backgroundColor: colors.surface }]}>
              <Text style={[styles.gridLabel, { color: colors.onSurfaceVariant }]}>EMAIL</Text>
              <Text style={[styles.gridValue, { color: colors.onSurface }]}>aarav@evanoo.in</Text>
            </View>
          </View>

          {/* Settings list */}
          <View style={[styles.list, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[styles.row, styles.rowBorder, { borderBottomColor: colors.borderColor }]}
              onPress={() => navigation.navigate('ProfileSettings')}
            >
              <SettingsIcon
                size={18}
                color={colors.primary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowTitle, { color: colors.onSurface }]}>Settings</Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.row, styles.rowBorder, { borderBottomColor: colors.borderColor }]}
              onPress={() => navigation.navigate('Notifications')}
            >
              <Bell size={18} color={colors.primary} style={styles.rowIcon} />
              <Text style={[styles.rowTitle, { color: colors.onSurface }]}>Notifications</Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.row, styles.rowBorder, { borderBottomColor: colors.borderColor }]}
              onPress={() => setIsMpinModalVisible(true)}
            >
              <Lock
                size={18}
                color={colors.primary}
                style={styles.rowIcon}
              />
              <Text style={[styles.rowTitle, { color: colors.onSurface }]}>Change MPIN</Text>
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
              <Text style={[styles.rowTitle, { color: colors.onSurface }]}>Privacy & Security</Text>
              <ChevronRight size={18} color={colors.onSurfaceVariant} />
            </TouchableOpacity>
          </View>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.list, styles.singleRow, { backgroundColor: colors.surface }]}
            onPress={handleLogout}
          >
            <LogOut size={18} color={colors.primary} style={styles.rowIcon} />
            <Text style={[styles.rowTitle, { color: colors.onSurface }]}>Logout</Text>
          </TouchableOpacity>

          {/* Logout All Devices */}
          <TouchableOpacity
            style={[styles.list, styles.singleRow, { marginTop: 12, backgroundColor: colors.surface }]}
            onPress={handleLogoutAll}
          >
            <LogOut size={18} color={colors.error} style={styles.rowIcon} />
            <Text style={[styles.rowTitle, { color: colors.error }]}>Logout from all devices</Text>
          </TouchableOpacity>

          {/* Delete account */}
          <TouchableOpacity
            style={[styles.list, styles.singleRow, { marginTop: 12, backgroundColor: colors.surface }]}
            onPress={handleDeleteAccount}
          >
            <Trash2 size={18} color={colors.error} style={styles.rowIcon} />
            <Text style={[styles.rowTitle, { color: colors.error }]}>
              Delete account
            </Text>
          </TouchableOpacity>

          <Text style={[styles.footer, { color: colors.onSurfaceVariant }]}>
            Evanoo v1.0 · RBI compliant · PCI DSS ready
          </Text>
        </ScrollView>
      </View>

      <Modal
        visible={isMpinModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMpinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.onSurface }]}>Change MPIN</Text>
            
            <TextInput
              style={[styles.input, { color: colors.onSurface, borderColor: colors.borderColor }]}
              placeholder="Current MPIN"
              placeholderTextColor={colors.onSurfaceVariant}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              value={currentMpin}
              onChangeText={setCurrentMpin}
            />
            
            <TextInput
              style={[styles.input, { color: colors.onSurface, borderColor: colors.borderColor }]}
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
                style={[styles.modalBtn, { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderColor }]}
                onPress={() => {
                  setIsMpinModalVisible(false);
                  setCurrentMpin('');
                  setNewMpin('');
                }}
              >
                <Text style={[styles.modalBtnText, { color: colors.onSurface }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colors.primary }]}
                onPress={handleChangeMpin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Submit</Text>
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
  avatarText: { color: '#fff', fontWeight: '700' },
  name: { color: '#fff', fontWeight: '700', fontSize: 16 },
  subInfo: { color: 'rgba(255,255,255,0.85)', fontSize: 12, marginTop: 2 },
  kycBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  },
  kycText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  gridItem: {
    width: '47%',
    borderRadius: 14,
    padding: 12,
  },
  gridLabel: { fontSize: 10, marginBottom: 4 },
  gridValue: { fontSize: 14, fontWeight: '600' },
  list: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  singleRow: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 1 },
  rowIcon: { marginRight: 12 },
  rowTitle: { flex: 1, fontWeight: '600' },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 8,
  },
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
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
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
  modalBtnText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
