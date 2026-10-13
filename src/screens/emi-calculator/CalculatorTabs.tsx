import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Text } from 'react-native-paper';
import {
  CreditCard,
  TrendingUp,
  PiggyBank,
  Landmark,
  Wallet,
  User,
  Home,
  Car,
  LucideIcon,
} from 'lucide-react-native';
import { useAppTheme } from '../../hook';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

const tabs: Tab[] = [
  { id: 'emi', label: 'EMI', icon: CreditCard },
  { id: 'eligibility', label: 'Eligibility', icon: TrendingUp },
  { id: 'sip', label: 'SIP', icon: PiggyBank },
  { id: 'fd', label: 'FD', icon: Landmark },
  { id: 'rd', label: 'RD', icon: Wallet },
  { id: 'personalLoan', label: 'Personal Loan', icon: User },
  { id: 'homeLoan', label: 'Home Loan', icon: Home },
  { id: 'carLoan', label: 'Car Loan', icon: Car },
];

interface CalculatorTabsProps {
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

const CalculatorTabs = ({ activeTab, onTabPress }: CalculatorTabsProps) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.grid}>
      <View style={styles.categoriesContainer}>
        {tabs.map(tab => {
          const isActive = tab.id === activeTab;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.categoryItem,
                isActive
                  ? {
                    borderColor: colors.primary,
                    backgroundColor: colors.background,
                  }
                  : {
                    borderColor: colors.borderColor,
                    backgroundColor: colors.surface,
                  },
              ]}
              onPress={() => onTabPress(tab.id)}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  isActive ? { backgroundColor: colors.primary } : { backgroundColor: colors.cardIconBox },
                ]}
              >
                <tab.icon
                  size={22}
                  color={isActive ? colors.onPrimary : colors.primary}
                />
              </View>
              <Text
                variant="labelSmall"
                style={{
                  textAlign: 'center',
                  color: isActive ? colors.primary : colors.onSurfaceVariant,
                }}
                numberOfLines={2}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default CalculatorTabs;

const styles = StyleSheet.create({
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    paddingVertical: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
