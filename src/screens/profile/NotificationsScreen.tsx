import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NotificationsScreenProps } from '../../navigation/types';

export default function NotificationsScreen({}: NotificationsScreenProps) {
  const { colors } = useAppTheme();
  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Notifications" showBackButton={true} />
      <View style={styles.container}>
      <Text style={styles.text}>Notifications Screen</Text>
    </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', },
  text: { fontSize: 18, fontWeight: '600' },
});
