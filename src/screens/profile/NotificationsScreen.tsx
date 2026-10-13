import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NotificationsScreenProps } from '../../navigation/types';

export default function NotificationsScreen({}: NotificationsScreenProps) {
  const { colors } = useAppTheme();
  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Notifications" showBackButton={true} />
      <View style={styles.container}>
        <Text variant="titleLarge" style={{ color: colors.onSurface }}>Notifications Screen</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
