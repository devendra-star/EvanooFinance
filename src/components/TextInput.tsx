import React, { forwardRef, useState } from 'react';
import {
  StyleProp,
  View,
  ViewStyle,
  TextInput as NativeTextInput,
  TextInputProps,
  StyleSheet,
  BlurEvent,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../hook';

export type CustomTextInputProps = TextInputProps & {
  label?: string;
  isMandatory?: boolean;
  leftIcon?: React.ReactNode;
  leftText?: string;
  error?: boolean;
  errorText?: string | null | false;
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: React.ReactNode;
};

type NativeTextInputRef = React.ComponentRef<typeof NativeTextInput>;

type FocusEventType = Parameters<NonNullable<TextInputProps['onFocus']>>[0];
type BlurEventType = Parameters<NonNullable<TextInputProps['onBlur']>>[0];

const TextInput = forwardRef<NativeTextInputRef, CustomTextInputProps>(
  (props, ref) => {
    const { colors } = useAppTheme();
    const [isFocus, setFocus] = useState<boolean>(false);

    const _onBlur = (event: BlurEventType) => {
      setFocus(false);
      props.onBlur?.(event);
    };

    const _onFocus = (event: FocusEventType) => {
      setFocus(true);
      props.onFocus?.(event);
    };

    return (
      <View style={props.containerStyle}>
        {props.label ? (
          <View style={{ flexDirection: 'row', marginBottom: 2 }}>
            <Text variant="titleSmall">{props.label}</Text>
            {props.isMandatory ? (
              <Text
                variant="bodySmall"
                style={{ marginLeft: 3, fontSize: 14, color: colors.error }}
              >
                {'*'}
              </Text>
            ) : null}
          </View>
        ) : null}
        <View
          style={[
            styles.inputWrapper,
            { borderColor: colors.borderColor },
            isFocus ? { borderColor: colors.primary } : null,
            props.error ? { borderColor: colors.error } : null,
          ]}
        >
          {props.leftIcon ? (
            <View style={{ marginRight: 8 }}>{props.leftIcon}</View>
          ) : null}
          {props.leftText ? (
            <Text
              variant="labelLarge"
              style={{ color: colors.onSurface, marginRight: 8 }}
            >
              {props.leftText}
            </Text>
          ) : null}

          <NativeTextInput
            {...props}
            ref={ref}
            allowFontScaling={false}
            autoComplete="off"
            autoCorrect={false}
            placeholderTextColor={colors.onSurfaceVariant}
            style={[styles.textInput, { color: colors.onSurface }, props.style]}
            onBlur={_onBlur}
            onFocus={_onFocus}
          />
          {props.rightIcon ? <View>{props.rightIcon}</View> : null}
        </View>
        {props.error ? (
          <Text variant="bodySmall" style={{ color: colors.error }}>
            {props.errorText}
          </Text>
        ) : null}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  textInput: {
    flex: 1,
    height: 40,
  },
});

TextInput.displayName = 'TextInput';

export default TextInput;
