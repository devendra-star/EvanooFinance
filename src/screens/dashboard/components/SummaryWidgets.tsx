import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Calendar, ChevronRight, Folder } from 'lucide-react-native';
import { Surface, Text } from 'react-native-paper';
import { useAppTheme } from '../../../hook';
import { useNavigation } from '@react-navigation/native';

const SummaryWidgets = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();

  const dummySummaryData = [
    {
      id: 'emiDue',
      icon: Calendar,
      label: 'EMI due',
      value: '₹12,480',
      subLabel: 'on 05 Aug · HDFC PL',
      buttonText: 'Pay now',
      showChevron: false,
    },
    {
      id: 'activeLoans',
      icon: Folder,
      label: 'Active loans',
      value: '2',
      subLabel: 'Outstanding ₹3.4L',
      buttonText: 'View',
      showChevron: true,
    },
  ];

  return (
    <View style={styles.summaryRow}>
      {dummySummaryData.map(item => {
        const Icon = item.icon;
        return (
          <Surface
            key={item.id}
            style={[
              styles.summaryCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderColor,
              },
            ]}
            elevation={0}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <Icon
                size={16}
                color={colors.onSurfaceVariant}
                style={{ marginRight: 6 }}
              />
              <Text variant="labelMedium">{item.label}</Text>
            </View>
            <Text variant="titleLarge" style={{}}>
              {item.value}
            </Text>
            <Text variant="bodySmall" style={{ marginBottom: 15 }}>
              {item.subLabel}
            </Text>
            <TouchableOpacity
              style={[
                styles.summaryBtn,
                { backgroundColor: colors.primaryContainer },
              ]}
            >
              <Text
                variant="titleSmall"
                style={{
                  color: item.showChevron ? colors.secondary : colors.primary,
                }}
              >
                {item.buttonText}
              </Text>
              {item.showChevron && (
                <ChevronRight
                  size={14}
                  color={colors.primary}
                  style={{ marginLeft: 5 }}
                />
              )}
            </TouchableOpacity>
          </Surface>
        );
      })}
    </View>
  );
};

export default SummaryWidgets;

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  summaryCard: {
    width: '48%',
    borderRadius: 20,
    padding: 10,
    borderWidth: 1,
  },
  summaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
});
