import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useAppTheme } from '../../../hook';
import {
  History,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const QuickActions = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();

  const data = [
    {
      label: 'Credit Health',
      icon: <TrendingUp size={20} color={colors.primary} />,
    },
    {
      label: 'Loan Eligibility',
      icon: <ShieldCheck size={20} color={colors.primary} />,
    },
    {
      label: 'Credit Utilization',
      icon: <PieChart size={20} color={colors.primary} />,
    },
    {
      label: 'Payment History',
      icon: <History size={20} color={colors.primary} />,
    },
  ];

  return (
    <View style={styles.quickRow}>
      {data.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.quickItem,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderColor,
            },
          ]}
          onPress={() => {
            if (item.label === 'Payment History')
              navigation.navigate('PaymentHistory');
          }}
        >
          <View
            style={[
              styles.quickIconCircle,
              { backgroundColor: colors.cardIconBox },
            ]}
          >
            {item.icon}
          </View>
          <Text
            variant="labelSmall"
            style={{ color: colors.onSurface, textAlign: 'center' }}
            numberOfLines={2}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default QuickActions;

const styles = StyleSheet.create({
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  quickItem: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 8,
    flexBasis: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
});
