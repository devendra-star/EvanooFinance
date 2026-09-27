import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheck } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '../hook';
import { useDispatch } from 'react-redux';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { forgotSecurityPin, unlockApp, sendOtp } from '../store/slices/authSlice';

interface ForgotPinModalProps {
    visible: boolean;
    mobileNumber: string;
    onClose: () => void;
}

const CELL_COUNT = 6;

export const ForgotPinModal: React.FC<ForgotPinModalProps> = ({ visible, mobileNumber, onClose }) => {
    const { colors } = useAppTheme();
    const dispatch = useDispatch();
    const [step, setStep] = useState<'NEW_PIN' | 'OTP'>('NEW_PIN');

    const [otp, setOtp] = useState('');
    const [newPin, setNewPin] = useState('');

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Current active value depending on step
    const currentValue = step === 'NEW_PIN' ? newPin : otp;
    const setCurrentValue = step === 'NEW_PIN' ? setNewPin : setOtp;

    const ref = useBlurOnFulfill({ value: currentValue, cellCount: CELL_COUNT });
    const [fieldProps, getCellOnLayoutHandler] = useClearByFocusCell({
        value: currentValue,
        setValue: setCurrentValue,
    });

    const getInstructionText = () => {
        if (step === 'OTP') return 'Enter the OTP sent to your registered mobile number.';
        return 'Enter your new 6-digit PIN.';
    };

    const handleNext = async () => {
        setError('');
        if (currentValue.length !== CELL_COUNT) {
            setError(`Please enter 6 digits`);
            return;
        }

        if (step === 'NEW_PIN') {
            // Generate OTP
            setIsSubmitting(true);
            try {
                // @ts-ignore
                await dispatch(sendOtp(mobileNumber)).unwrap();
                setStep('OTP');
            } catch (err: any) {
                setError(err || 'Failed to send OTP.');
            } finally {
                setIsSubmitting(false);
            }
        } else if (step === 'OTP') {
            // Submit API
            setIsSubmitting(true);
            try {
                await dispatch(forgotSecurityPin({
                    mobileNumber,
                    otp,
                    newMpin: newPin
                }) as any).unwrap();

                Alert.alert('Success', 'Your PIN has been reset successfully.', [
                    {
                        text: 'OK', onPress: () => {
                            dispatch(unlockApp());
                            handleClose();
                        }
                    }
                ]);
            } catch (err: any) {
                setOtp('');
                setError(err || 'Invalid OTP or failed to reset PIN.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleClose = () => {
        setStep('NEW_PIN');
        setOtp('');
        setNewPin('');
        setError('');
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={[styles.modal, { backgroundColor: colors.background }]}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.header}>
                        <ShieldCheck size={36} color={colors.primary} strokeWidth={2.5} />
                        <Text variant="headlineMedium" style={[styles.brandName, { color: colors.onSurface }]}>
                            {" RESET PIN"}
                        </Text>
                    </View>

                    <View style={styles.pinArea}>
                        <Text variant="bodyMedium" style={[styles.instructionText, { color: colors.onSurfaceVariant, marginBottom: 20 }]}>
                            {getInstructionText()}
                        </Text>
                        <View style={[styles.otpContainer, { borderColor: colors.outlineVariant }]}>
                            <CodeField
                                ref={ref}
                                {...fieldProps}
                                value={currentValue}
                                onChangeText={setCurrentValue}
                                cellCount={CELL_COUNT}
                                rootStyle={styles.codeFieldRoot}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode"
                                secureTextEntry={step !== 'OTP'}
                                renderCell={({ index, symbol, isFocused }) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.cell,
                                            isFocused && { borderColor: colors.primary },
                                            error ? { borderColor: colors.error } : null,
                                        ]}
                                        onLayout={getCellOnLayoutHandler(index)}
                                    >
                                        {symbol ? (
                                            <Text style={[styles.cellText, { color: colors.onSurface }]}>
                                                {step === 'OTP' ? symbol : '*'}
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
                        <View style={{ alignSelf: 'flex-start', minHeight: 24, marginTop: 4 }}>
                            <Text variant="bodySmall" style={{ color: colors.error }}>
                                {error || ' '}
                            </Text>
                        </View>

                        <TouchableOpacity onPress={handleNext} disabled={isSubmitting} style={{ marginTop: 20 }}>
                            <LinearGradient
                                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.unlockBtn}
                            >
                                <Text variant="labelLarge" style={styles.unlockBtnText}>
                                    {isSubmitting ? 'Wait...' : (step === 'OTP' ? 'Submit' : 'Next')}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleClose} disabled={isSubmitting} style={{ marginTop: 20 }}>
                            <Text variant="labelLarge" style={{ color: colors.primary }}>
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: { flex: 1 },
    container: {
        flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 50
    },
    header: {
        alignItems: 'center', marginBottom: 40
    },
    brandName: {
        marginTop: 12, letterSpacing: 2, fontWeight: 'bold'
    },
    pinArea: {
        width: '100%', paddingHorizontal: 40, alignItems: 'center'
    },
    instructionText: {
        textAlign: 'center', marginTop: 12
    },
    otpContainer: {
        width: '100%', borderWidth: 1, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12
    },
    codeFieldRoot: {
        justifyContent: 'space-between', paddingHorizontal: 8
    },
    cell: {
        width: 36, height: 40, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 2, borderColor: 'transparent'
    },
    cellText: {
        fontSize: 28, fontWeight: '700', textAlign: 'center'
    },
    dot: {
        width: 8, height: 8, borderRadius: 4, backgroundColor: '#94A3B8'
    },
    unlockBtn: {
        paddingVertical: 14, paddingHorizontal: 50, borderRadius: 30, alignItems: 'center', justifyContent: 'center', width: 200
    },
    unlockBtnText: {
        color: '#FFFFFF', letterSpacing: 1
    },
});
