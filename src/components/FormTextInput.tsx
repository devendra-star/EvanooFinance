import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { TextInput as PaperTextInput, Text } from 'react-native-paper';
import type { LucideIcon } from 'lucide-react-native';
import { useAppTheme } from '../hook';

type FormTextInputProps = {
  label?: string;
  isMandatory?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: (e: any) => void;
  error?: boolean;
  errorText?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  icon: LucideIcon;
  onLayout?: (e: LayoutChangeEvent) => void;
  colors: {
    error: string;
    primary: string;
    borderColor: string;
    onPrimary?: string;
  };
};

const FormTextInput: React.FC<FormTextInputProps> = props => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.inputWrapper} onLayout={props.onLayout}>
      {props.label ? (
        <View style={{ flexDirection: 'row' }}>
          <Text variant="bodyMedium">{props.label}</Text>
          {props.isMandatory ? (
            <Text variant="bodySmall" style={{ marginLeft: 3, fontSize: 14 }}>
              {'*'}
            </Text>
          ) : null}
        </View>
      ) : null}
      <PaperTextInput
        {...props}
        label=""
        placeholder={`Enter ${props.label}`}
        allowFontScaling={false}
        autoComplete="off"
        autoCorrect={false}
        mode="outlined"
        outlineColor={colors.borderColor}
        activeOutlineColor={colors.primary}
        outlineStyle={[
          styles.inputOutline,
          { borderColor: props.error ? colors.error : colors.borderColor },
        ]}
        left={
          <PaperTextInput.Icon
            icon={() => (
              <props.icon
                size={20}
                color={props.error ? colors.error : colors.primary}
              />
            )}
          />
        }
        contentStyle={styles.inputContent}
        style={[styles.input, { backgroundColor: colors.onPrimary }]}
      />
      {/* Fixed height error slot - hamesha render hoga, chahe error ho ya na ho */}
      {typeof props.errorText === 'undefined' ||
      props.errorText === null ? null : (
        <Text
          variant="bodySmall"
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: colors.error }}
        >
          {props.error && props.errorText ? props.errorText : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    width: '100%',
  },
  labelContainer: {
    marginBottom: 2,
  },
  input: {
    height: 52,
  },
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1,
  },
  inputContent: {
    borderRadius: 12,
  },
});

export default FormTextInput;
