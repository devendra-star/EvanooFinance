import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../hook';

const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

interface ResultCardsProps {
  emi: number;
  interest: number;
  total: number;
}

const ResultCards = ({ emi, interest, total }: ResultCardsProps) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.resultRow}>
      <View
        style={[
          styles.resultPill,
          { backgroundColor: colors.primary, flex: 1.1 },
        ]}
      >
        <Text
          variant="labelSmall"
          style={{ color: 'rgba(255,255,255,0.85)' }}
        >
          EMI
        </Text>
        <Text
          variant="titleMedium"
          style={{ color: colors.surface, fontWeight: '700' }}
        >
          {formatAmount(Math.round(emi))}
        </Text>
      </View>
      <View
        style={[
          styles.resultPill,
          { backgroundColor: colors.primaryContainer, flex: 1 },
        ]}
      >
        <Text
          variant="labelSmall"
          style={{ color: colors.onSurfaceVariant }}
        >
          INTEREST
        </Text>
        <Text
          variant="titleSmall"
        >
          {formatAmount(Math.round(interest))}
        </Text>
      </View>
      <View
        style={[
          styles.resultPill,
          { backgroundColor: colors.primaryContainer, flex: 1 },
        ]}
      >
        <Text
          variant="labelSmall"
          style={{ color: colors.onSurfaceVariant }}
        >
          TOTAL
        </Text>
        <Text
          variant="titleSmall"
        >
          {formatAmount(Math.round(total))}
        </Text>
      </View>
    </View>
  );
};

export default ResultCards;

const styles = StyleSheet.create({
  resultRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
  resultPill: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
});
