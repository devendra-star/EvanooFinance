import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Modal, Portal } from 'react-native-paper';
import ReactNativeBiometrics from 'react-native-biometrics';
import { Fingerprint } from 'lucide-react-native';
import { useAppTheme } from '../hook';

interface BiometricPopupProps {
  visible: boolean;
  onComplete: () => void;
}

export default function BiometricPopup({ visible, onComplete }: BiometricPopupProps) {
  const { colors } = useAppTheme();

  const handleEnableBiometric = async () => {
    try {
      const rnBiometrics = new ReactNativeBiometrics();
      const { available, biometryType } = await rnBiometrics.isSensorAvailable();
      if (available && biometryType) {
        const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Enable Biometric Login' });
        if (success) {
          // Success: user authenticated, you would normally store a preference here
        }
      }
    } catch (e) {
      console.log('Biometric error', e);
    } finally {
      onComplete();
    }
  };

  const handleSkipBiometric = () => {
    onComplete();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        contentContainerStyle={[styles.modalContainer, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.iconCircle, { backgroundColor: colors.surfaceVariant }]}>
          <Fingerprint size={48} color={colors.primary} />
        </View>
        <Text variant="headlineSmall" style={{ fontWeight: '700', marginBottom: 12, textAlign: 'center', color: colors.onSurface }}>
          Enable Biometric Login
        </Text>
        <Text variant="bodyMedium" style={{ textAlign: 'center', marginBottom: 32, color: colors.onSurfaceVariant }}>
          Log in faster and securely with your fingerprint or face ID.
        </Text>
        
        <TouchableOpacity
          style={[styles.verifyBtn, { backgroundColor: colors.primary }]}
          onPress={handleEnableBiometric}
        >
          <Text variant="titleMedium" style={styles.verifyBtnText}>
            Enable
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSkipBiometric} style={styles.skipBtn}>
          <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant, fontWeight: '600' }}>
            Skip for now
          </Text>
        </TouchableOpacity>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 24,
    padding: 32,
    borderRadius: 24,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    paddingVertical: 16,
    width: '100%',
  },
  verifyBtnText: {
    color: '#FFF',
    fontWeight: '700',
  },
  skipBtn: {
    marginTop: 24,
    paddingVertical: 8,
  },
});
