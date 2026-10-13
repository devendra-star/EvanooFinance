import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { PaymentHistoryScreenProps } from '../../navigation/types';

const PaymentHistory = ({}: PaymentHistoryScreenProps) => {
  const { colors } = useAppTheme();
  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="PaymentHistory" showBackButton={true} />
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ color: colors.onSurface }}>
          Payment History
        </Text>
      </View>
    </Container>
  );
};

export default PaymentHistory;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
