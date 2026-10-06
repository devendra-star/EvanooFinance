import React from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Text } from 'react-native-paper';
import { Plus, Minus } from 'lucide-react-native';
import { useAppTheme } from '../hook';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  expanded: boolean;
  onPress: () => void;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  expanded,
  onPress,
  children,
}) => {
  const { colors } = useAppTheme();

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onPress();
  };

  return (
    <View style={[styles.accordionContainer, { borderColor: colors.borderColor }]}>
      <TouchableOpacity
        style={[styles.header, { backgroundColor: colors.surface }]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text variant="bodyMedium" style={{ color: colors.onSurface }}>
          {title}
        </Text>
        <View style={styles.iconWrapper}>
          {expanded ? (
            <Minus size={20} color={colors.primary} />
          ) : (
            <Plus size={20} color={colors.primary} />
          )}
        </View>
      </TouchableOpacity>

      {expanded && (
        <View style={[styles.accordionContent, { backgroundColor: colors.surface }]} >
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 45,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  accordionContent: {
    padding: 15,
  },
});

export default Accordion;
