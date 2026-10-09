import React, { useState } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Menu, Text } from 'react-native-paper';
import { ChevronDown, Check } from 'lucide-react-native';
import { useAppTheme } from '../hook';

export type DropdownOption = string | { label: string; value: string };

export type DropdownProps = {
  label?: string;
  isMandatory?: boolean;
  leftIcon?: React.ReactNode;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  errorText?: string | null | false;
  containerStyle?: StyleProp<ViewStyle>;
};

const normalize = (o: DropdownOption) =>
  typeof o === 'string' ? { label: o, value: o } : o;

const Dropdown = (props: DropdownProps) => {
  const { colors } = useAppTheme();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);

  const items = props.options.map(normalize);
  const selected = items.find(o => o.value === props.value);

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

      {/* Menu renders the list in an overlay, so it sits on top of the
          inputs below instead of pushing them down. */}
      <Menu
        visible={open}
        onDismiss={() => setOpen(false)}
        anchorPosition="bottom"
        statusBarHeight={0}
        contentStyle={{
          width,
          backgroundColor: colors.onPrimary,
          borderRadius: 10,
          paddingVertical: 0,
        }}
        anchor={
          <Pressable
            onLayout={e => setWidth(e.nativeEvent.layout.width)}
            onPress={() => setOpen(o => !o)}
            style={[
              styles.box,
              {
                backgroundColor: colors.onPrimary,
                borderColor: props.error
                  ? colors.error
                  : open
                  ? colors.primary
                  : colors.borderColor,
              },
            ]}
          >
            {props.leftIcon ? (
              <View style={{ marginRight: 8 }}>{props.leftIcon}</View>
            ) : null}

            <Text
              variant="bodyMedium"
              numberOfLines={1}
              style={[
                styles.valueText,
                {
                  color: selected ? colors.onSurface : colors.onSurfaceVariant,
                },
              ]}
            >
              {selected ? selected.label : props.placeholder ?? 'Select'}
            </Text>

            <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
              <ChevronDown
                size={20}
                color={colors.onSurface}
                strokeWidth={2.2}
              />
            </View>
          </Pressable>
        }
      >
        {items.map((opt, i) => {
          const isSelected = opt.value === props.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => {
                props.onChange(opt.value);
                setOpen(false);
              }}
              style={[
                styles.option,
                i > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: colors.borderColor,
                },
                isSelected && { backgroundColor: colors.primaryContainer },
              ]}
            >
              <Text
                variant="bodyMedium"
                style={{
                  color: isSelected ? colors.primary : colors.onSurface,
                  fontWeight: isSelected ? '600' : '400',
                }}
              >
                {opt.label}
              </Text>
              {isSelected ? (
                <Check size={18} color={colors.primary} strokeWidth={2.5} />
              ) : null}
            </Pressable>
          );
        })}
      </Menu>

      {props.error ? (
        <Text variant="bodySmall" style={{ color: colors.error }}>
          {props.errorText}
        </Text>
      ) : null}
    </View>
  );
};

export default Dropdown;

// Same size as TextInput: border 1 + padding 4 + 40 content + padding 4 + border 1 = 50
const styles = StyleSheet.create({
  box: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  valueText: { flex: 1 },
  option: {
    height: 44,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
