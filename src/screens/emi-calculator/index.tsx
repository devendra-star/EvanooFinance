import { ScrollView, StyleSheet, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Slider from '@react-native-community/slider';
import { Surface, Text } from 'react-native-paper';
import { useAppTheme } from '../../hook';
import { CalcScreenProps } from '../../navigation/types';
import { Container } from '../../components';
import Header from '../../components/Header';
import CalculatorTabs from './CalculatorTabs';
import ResultCards from './ResultCards';
import EmiService from '../../services/EmiService';

const formatAmount = (val: number) => `₹${val.toLocaleString('en-IN')}`;

const EMICalculator = ({ }: CalcScreenProps) => {
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = useState('emi');
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(36);
  const [apiResults, setApiResults] = useState({
    monthlyEmi: 0,
    totalPayment: 0,
    totalInterest: 0
  });

  useEffect(() => {
    const fetchEmi = async () => {
      try {
        const responseData = await EmiService.calculateEmi({
          loanAmount: amount,
          interestRate: rate,
          tenure: tenure
        });
        if (responseData?.success && responseData?.data) {
          setApiResults({
            monthlyEmi: responseData.data.monthlyEmi,
            totalPayment: responseData.data.totalPayment,
            totalInterest: responseData.data.totalInterest
          });
        }
      } catch (error) {
        console.error("Error calculating EMI:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchEmi();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [amount, rate, tenure]);

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon grid */}
        <CalculatorTabs activeTab={activeTab} onTabPress={setActiveTab} />
        {/* Calculator card */}
        <Surface
          style={[styles.calcCard, { backgroundColor: colors.surface }]}
          elevation={1}
        >
          <Text variant="titleMedium">EMI Calculator</Text>
          {/* Amount */}
          <View style={styles.sliderRow}>
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {'Amount'}
            </Text>
            <Text variant="titleSmall">{formatAmount(amount)}</Text>
          </View>
          <Slider
            minimumValue={50000}
            maximumValue={5000000}
            step={10000}
            value={amount}
            onValueChange={setAmount}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.outlineVariant}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.sliderRow}>
            <Text
              variant="bodySmall"
              style={{ color: colors.onSurfaceVariant }}
            >
              {'Interest rate'}
            </Text>
            <Text variant="titleSmall">{rate.toFixed(2)}%</Text>
          </View>
          <Slider
            minimumValue={5}
            maximumValue={20}
            step={0.05}
            value={rate}
            onValueChange={setRate}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.outlineVariant}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <View style={styles.sliderRow}>
            <Text variant="bodySmall">{'Tenure (months)'}</Text>
            <Text variant="titleSmall">{`${tenure} m`}</Text>
          </View>
          <Slider
            minimumValue={3}
            maximumValue={84}
            step={1}
            value={tenure}
            onValueChange={setTenure}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.outlineVariant}
            thumbTintColor={colors.primary}
            style={styles.slider}
          />
          <ResultCards emi={apiResults.monthlyEmi} interest={apiResults.totalInterest} total={apiResults.totalPayment} />
        </Surface>
      </ScrollView>
    </Container>
  );
};

export default EMICalculator;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  calcCard: {
    borderRadius: 20,
    padding: 15,
  },
  sliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 20,
  },
});
