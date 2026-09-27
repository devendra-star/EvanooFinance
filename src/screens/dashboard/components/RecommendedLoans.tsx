import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { ArrowUpRight, ChevronRight, Landmark } from 'lucide-react-native';
import { useAppTheme } from '../../../hook';
import { Surface, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const RecommendedLoans = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();

  const dummyLoans = [
    {
      loanId: 'hdfc-personal-01',
      bankName: 'HDFC Bank',
      loanType: 'Personal loan',
      preApproved: true,
      amountRange: '₹5L - ₹40L',
      rate: '10.5%',
      tenure: '60m',
    },
    {
      loanId: 'axis-personal-01',
      bankName: 'Axis Bank',
      loanType: 'Personal loan',
      preApproved: false,
      amountRange: '₹1L - ₹25L',
      rate: '10.99%',
      tenure: null,
    },
    {
      loanId: 'icici-personal-01',
      bankName: 'ICICI Bank',
      loanType: 'Personal loan',
      preApproved: true,
      amountRange: '₹2L - ₹30L',
      rate: '11.25%',
      tenure: '48m',
    },
    {
      loanId: 'sbi-personal-01',
      bankName: 'SBI',
      loanType: 'Personal loan',
      preApproved: false,
      amountRange: '₹3L - ₹20L',
      rate: '9.99%',
      tenure: '36m',
    },
    {
      loanId: 'kotak-personal-01',
      bankName: 'Kotak Mahindra Bank',
      loanType: 'Personal loan',
      preApproved: true,
      amountRange: '₹1L - ₹15L',
      rate: '10.75%',
      tenure: '24m',
    },
  ];

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium">{'Recommended Loans'}</Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <Text variant="labelMedium" style={{ color: colors.primary }}>
            {'See all'}
          </Text>
          <ChevronRight size={14} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {dummyLoans.map(loan => (
          <Surface
            key={loan.loanId}
            style={[
              styles.loanCard,
              {
                borderColor: colors.borderColor,
                backgroundColor: colors.surface,
              },
            ]}
            elevation={0}
          >
            <View style={styles.loanHeaderRow}>
              <View
                style={[
                  styles.loanBankIcon,
                  { backgroundColor: colors.cardIconBox },
                ]}
              >
                <Landmark size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text variant="titleSmall">{loan.bankName}</Text>
                <Text
                  variant="labelSmall"
                  style={{ color: colors.onSurfaceVariant }}
                >
                  {loan.loanType}
                </Text>
              </View>
              {loan.preApproved && (
                <View
                  style={[
                    styles.preApprovedBadge,
                    { backgroundColor: '#E8F5E9' },
                  ]}
                >
                  <Text variant="labelSmall" style={{ color: '#0F8A5B' }}>
                    {'Pre-approved'}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.loanDetailsRow}>
              <View style={styles.loanDetailCol}>
                <Text
                  variant="labelSmall"
                  style={[
                    styles.mutedLabel,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {'Amount'}
                </Text>
                <Text variant="titleSmall">{loan.amountRange}</Text>
              </View>
              <View
                style={[
                  styles.loanDetailColBordered,
                  { borderColor: colors.outlineVariant },
                ]}
              >
                <Text
                  variant="labelSmall"
                  style={[
                    styles.mutedLabel,
                    { color: colors.onSurfaceVariant },
                  ]}
                >
                  {'Rate'}
                </Text>
                <Text variant="titleSmall">{loan.rate}</Text>
              </View>
              {loan.tenure && (
                <View style={styles.loanDetailCol}>
                  <Text
                    variant="labelSmall"
                    style={[
                      styles.mutedLabel,
                      { color: colors.onSurfaceVariant },
                    ]}
                  >
                    {'Tenure'}
                  </Text>
                  <Text variant="titleSmall">{loan.tenure}</Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('LoanDetails', { loanId: loan.loanId })
              }
            >
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.applyBtn}
              >
                <Text variant="labelLarge" style={{ color: colors.surface }}>
                  {'Apply now'}
                </Text>
                <ArrowUpRight
                  size={16}
                  color={colors.surface}
                  style={{ marginLeft: 4 }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </Surface>
        ))}
      </ScrollView>
    </>
  );
};

export default RecommendedLoans;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  horizontalScroll: {
    marginBottom: 15,
    overflow: 'visible',
  },
  loanCard: {
    width: 280,
    borderRadius: 20,
    padding: 10,
    marginRight: 16,
    borderWidth: 1,
  },
  loanHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  loanBankIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  preApprovedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loanDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  loanDetailCol: {
    alignItems: 'center',
    flex: 1,
  },
  loanDetailColBordered: {
    alignItems: 'center',
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  mutedLabel: {
    marginBottom: 2,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 20,
  },
});
