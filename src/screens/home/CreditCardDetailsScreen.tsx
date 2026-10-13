import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { CreditCardDetailsScreenProps } from '../../navigation/types';

export default function CreditCardDetailsScreen({ route }: CreditCardDetailsScreenProps) {
  const { colors } = useAppTheme();
  const { cardId } = route.params;

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="CreditCardDetails" showBackButton={true} />
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ color: colors.onSurface, marginBottom: 8 }}>
          Card Details
        </Text>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Card ID: {cardId}
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});
