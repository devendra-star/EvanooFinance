import { ScrollView, StyleSheet, View, TextInput } from 'react-native';
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
  
  const [amountStr, setAmountStr] = useState("500000");
  const [rateStr, setRateStr] = useState("10.5");
  const [tenureStr, setTenureStr] = useState("36");

  useEffect(() => {
    setAmountStr(amount.toString());
  }, [amount]);

  useEffect(() => {
    setRateStr(rate.toString());
  }, [rate]);

  useEffect(() => {
    setTenureStr(tenure.toString());
  }, [tenure]);

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
          <View style={styles.metricGroup}>
            <View style={styles.metricHeader}>
              <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>
                Loan Amount
              </Text>
              <View style={[styles.inputBox, { borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}>
                <Text style={[styles.inputPrefix, { color: colors.onSurfaceVariant }]}>₹</Text>
                <TextInput
                  style={[styles.input, { color: colors.onSurface }]}
                  value={amountStr}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setAmountStr(text);
                    const val = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (!isNaN(val)) setAmount(val);
                  }}
                />
              </View>
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
          </View>

          {/* Interest Rate */}
          <View style={styles.metricGroup}>
            <View style={styles.metricHeader}>
              <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>
                Interest Rate
              </Text>
              <View style={[styles.inputBox, { borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.onSurface }]}
                  value={rateStr}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setRateStr(text);
                    const val = parseFloat(text.replace(/[^0-9.]/g, ''));
                    if (!isNaN(val)) setRate(val);
                  }}
                />
                <Text style={[styles.inputSuffix, { color: colors.onSurfaceVariant }]}>%</Text>
              </View>
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
          </View>

          {/* Tenure */}
          <View style={styles.metricGroup}>
            <View style={styles.metricHeader}>
              <Text variant="titleSmall" style={{ color: colors.onSurfaceVariant }}>
                Tenure
              </Text>
              <View style={[styles.inputBox, { borderColor: colors.outlineVariant, backgroundColor: colors.surface }]}>
                <TextInput
                  style={[styles.input, { color: colors.onSurface }]}
                  value={tenureStr}
                  keyboardType="numeric"
                  onChangeText={(text) => {
                    setTenureStr(text);
                    const val = parseInt(text.replace(/[^0-9]/g, ''), 10);
                    if (!isNaN(val)) setTenure(val);
                  }}
                />
                <Text style={[styles.inputSuffix, { color: colors.onSurfaceVariant }]}>mo</Text>
              </View>
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
          </View>
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
  metricGroup: {
    marginBottom: 10,
    marginTop: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 0,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 36,
    minWidth: 110,
  },
  inputPrefix: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  inputSuffix: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
    padding: 0,
    margin: 0,
  },
  slider: {
    width: '100%',
    height: 35,
  },
});
