import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export default class SecurityService {
  /**
   * Check if the device has biometric hardware available
   */
  static async checkBiometricSupport(): Promise<boolean> {
    try {
      const { available } = await rnBiometrics.isSensorAvailable();
      return available;
    } catch (error) {
      console.error('Error checking biometric support', error);
      return false;
    }
  }

  /**
   * Helper to manually prompt biometrics without fetching a password,
   * useful for sensitive actions.
   */
  static async promptBiometric(promptMessage: string): Promise<boolean> {
    try {
      const { success } = await rnBiometrics.simplePrompt({ promptMessage });
      return success;
    } catch (error) {
      console.log('Biometric prompt error', error);
      return false;
    }
  }
}
