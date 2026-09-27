import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LoanDetailsScreenProps } from '../../navigation/types';

export default function LoanDetailsScreen({ route }: LoanDetailsScreenProps) {
  const { colors } = useAppTheme();
  const { loanId } = route.params;

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="LoanDetails" showBackButton={true} />
      <View style={styles.container}>
      <Text style={styles.text}>Loan Details</Text>
      <Text>Loan ID: {loanId}</Text>
    </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  text: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
