import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  BookOpen,
  MessageCircle,
  Ticket,
  Phone as WhatsAppIcon,
  Mail,
  HelpCircle,
  ChevronRight,
} from 'lucide-react-native';
import { SupportScreenProps } from '../../navigation/types';
import { useAppTheme } from '../../hook';
import { Text } from 'react-native-paper';
import { Container } from '../../components';
import Header from '../../components/Header';
import { WINDOW_WIDTH } from '../../configs';

type SupportItem = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
};

export default function SupportScreen({ navigation }: SupportScreenProps) {
  const { colors } = useAppTheme();

  const items: SupportItem[] = [
    {
      icon: <BookOpen size={20} color={colors.primary} />,
      title: 'Help Center',
      subtitle: 'Guides and tutorials',
      onPress: () => navigation.navigate('HelpCenter'),
    },
    {
      icon: <MessageCircle size={20} color={colors.primary} />,
      title: 'Live Chat',
      subtitle: 'Chat with our team',
      onPress: () => navigation.navigate('LiveChat'),
    },
    {
      icon: <Ticket size={20} color={colors.primary} />,
      title: 'Raise a Ticket',
      subtitle: 'Report an issue',
      onPress: () => navigation.navigate('RaiseTicket'),
    },
    {
      icon: <WhatsAppIcon size={20} color={colors.primary} />,
      title: 'WhatsApp Support',
      subtitle: 'Message us on WhatsApp',
      onPress: () => Linking.openURL('https://wa.me/919876543210'),
    },
    {
      icon: <Mail size={20} color={colors.primary} />,
      title: 'Email Support',
      subtitle: 'help@evanoo.in',
      onPress: () => Linking.openURL('mailto:help@evanoo.in'),
    },
    {
      icon: <HelpCircle size={20} color={colors.primary} />,
      title: 'FAQs',
      subtitle: 'Frequently asked questions',
      onPress: () => navigation.navigate('FAQs'),
    },
  ];

  return (
    <Container backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Support" showBackButton={true} />
      <View style={styles.wrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <LinearGradient
            colors={[colors.mainGradientStart, colors.mainGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
          >
            <Text style={[styles.bannerTitle, { color: '#ffffff' }]}>
              {"How can we help?"}
            </Text>
            <Text
              style={[
                styles.bannerSubtitle,
                { color: 'rgba(255,255,255,0.85)' },
              ]}
            >
              {"Our team responds within 1 hour on chat and WhatsApp."}
            </Text>
          </LinearGradient>

          <View style={[styles.list, { backgroundColor: colors.surface }]}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={item.title}
                style={[
                  styles.row,
                  index !== items.length - 1 && [
                    styles.rowBorder,
                    { borderBottomColor: colors.borderColor },
                  ],
                ]}
                onPress={item.onPress}
              >
                <View
                  style={[
                    styles.rowIcon,
                    { backgroundColor: colors.cardIconBox },
                  ]}
                >
                  {item.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rowTitle, { color: colors.onSurface }]}>
                    {item.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.onSurfaceVariant }}
                  >
                    {item.subtitle}
                  </Text>
                </View>
                <ChevronRight size={22} color={colors.onSurfaceVariant} strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: WINDOW_WIDTH,
    padding: 15,
  },
  banner: { borderRadius: 18, padding: 20, marginBottom: 16 },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  bannerSubtitle: { fontSize: 13, lineHeight: 18 },
  list: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  rowBorder: { borderBottomWidth: 1 },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTitle: { fontWeight: '600' },
});
