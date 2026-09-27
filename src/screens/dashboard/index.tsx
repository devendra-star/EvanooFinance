import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import { HomeScreenProps } from '../../navigation/types';
import { WINDOW_WIDTH } from '../../configs';
import CreditScore from './components/CreditScore';
import QuickActions from './components/QuickActions';
import RecommendedLoans from './components/RecommendedLoans';
import RecommendedCreditCards from './components/RecommendedCreditCards';
import SummaryWidgets from './components/SummaryWidgets';
import UtilizationInsight from './components/UtilizationInsight ';

const Dashboard: React.FC<HomeScreenProps> = props => {
  const { colors } = useAppTheme();

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background} systemBarStyle="dark">
      <Header />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CreditScore />
        <QuickActions />
        <RecommendedLoans />
        <RecommendedCreditCards />
        <SummaryWidgets />
        <UtilizationInsight />
      </ScrollView>

    </Container>
  );
};
export default Dashboard;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
});
