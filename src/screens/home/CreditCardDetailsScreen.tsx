import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CreditCardDetailsScreenProps } from '../../navigation/types';

export default function CreditCardDetailsScreen({ route }: CreditCardDetailsScreenProps) {
  const { colors } = useAppTheme();
  const { cardId } = route.params;

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="CreditCardDetails" showBackButton={true} />
      <View style={styles.container}>
      <Text style={styles.text}>Card Details</Text>
      <Text>Card ID: {cardId}</Text>
    </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, },
  text: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});
