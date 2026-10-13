import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { LoanDetailsScreenProps } from '../../navigation/types';

export default function LoanDetailsScreen({ route }: LoanDetailsScreenProps) {
  const { colors } = useAppTheme();
  const { loanId } = route.params;

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="LoanDetails" showBackButton={true} />
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ color: colors.onSurface, marginBottom: 8 }}>
          Loan Details
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Loan ID: {loanId}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
