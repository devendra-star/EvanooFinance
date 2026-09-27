import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Surface, Text } from 'react-native-paper';
import { Sparkles, Bell } from 'lucide-react-native';
import { useAppTheme } from '../../../hook';

const UtilizationInsight = () => {
  const { colors } = useAppTheme();

  return (
    <View>
      <Surface
        style={[
          styles.insightCard,
          { backgroundColor: colors.surface, borderColor: colors.borderColor },
        ]}
        elevation={0}
      >
        <View
          style={[
            styles.iconCircle,
            { backgroundColor: colors.primaryContainer },
          ]}
        >
          <Sparkles size={16} color={colors.primary} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text variant="bodyMedium">
            <Text variant="bodyMedium" style={{ fontWeight: '700' }}>
              {'Your utilization is 28%'}
            </Text>
          </Text>
          <Text
            variant="bodySmall"
            style={{ color: colors.onSurfaceVariant, marginTop: 2 }}
          >
            {"Keep it under 30% to protect your score. You're on track!"}
          </Text>
        </View>
      </Surface>
      <Surface
        style={[
          styles.reminderCard,
          { backgroundColor: colors.secondaryContainer },
        ]}
        elevation={0}
      >
        <Bell size={14} color={colors.onSurfaceVariant} />
        <Text
          variant="bodySmall"
          style={{ color: colors.onSurfaceVariant, marginLeft: 8 }}
        >
          We'll notify you before your next refresh.
        </Text>
      </Surface>
    </View>
  );
};

export default UtilizationInsight;

const styles = StyleSheet.create({
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
});
