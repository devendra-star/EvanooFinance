import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Surface, Text } from 'react-native-paper';
import { LoansScreenProps } from '../../navigation/types';
import {
  User,
  Briefcase,
  Home as HomeIcon,
  GraduationCap,
  Coins,
  Landmark,
  Car,
  Bike,
  Percent,
  FileText,
  Wallet,
  UserCheck,
  Building2,
} from 'lucide-react-native';

const categories = [
  { id: '1', title: 'Personal', icon: User },
  { id: '2', title: 'Business', icon: Briefcase },
  { id: '3', title: 'Home', icon: HomeIcon },
  { id: '4', title: 'Education', icon: GraduationCap },
  { id: '5', title: 'Gold', icon: Coins },
  { id: '6', title: 'Against Property', icon: Landmark },
  { id: '7', title: 'Car', icon: Car },
  { id: '8', title: 'Two Wheeler', icon: Bike },
];

const offers = [
  {
    id: '1',
    bank: 'HDFC Bank',
    type: 'Personal Loan',
    badge: 'Pre-approved',
    rate: '10.50%',
    fee: '1.5%',
    emi: '₹10,747',
  },
  {
    id: '2',
    bank: 'Axis Bank',
    type: 'Personal Loan',
    badge: 'Best rate',
    rate: '10.99%',
    fee: '1.75%',
    emi: '₹10,868',
  },
  {
    id: '3',
    bank: 'ICICI Bank',
    type: 'Personal Loan',
    badge: 'Instant',
    rate: '11.25%',
    fee: '2.00%',
    emi: '₹10,930',
  },
  {
    id: '4',
    bank: 'Bajaj Finserv',
    type: 'Personal Loan',
    badge: 'Flexible',
    rate: '12.99%',
    fee: '2.5%',
    emi: '₹11,364',
  },
];

const Loans = ({ }: LoansScreenProps) => {
  const { colors } = useAppTheme();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  return (
    <Container
      edges={['top', 'left', 'right']}
      backgroundColor={colors.background}
      systemBarStyle="dark"
    >
      <Header title="Loans" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          {categories.map(cat => {
            const isActive = cat.id === activeCategory;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryItem,
                  isActive
                    ? {
                      borderColor: colors.primary,
                      backgroundColor: colors.background,
                    }
                    : {
                      borderColor: colors.borderColor,
                      backgroundColor: colors.surface,
                    },
                ]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <View
                  style={[
                    styles.categoryIconWrap,
                    isActive
                      ? { backgroundColor: colors.primary }
                      : { backgroundColor: colors.cardIconBox },
                  ]}
                >
                  <cat.icon
                    size={22}
                    color={isActive ? colors.onPrimary : colors.primary}
                  />
                </View>
                <Text
                  variant="labelSmall"
                  style={{ textAlign: 'center' }}
                  numberOfLines={2}
                >
                  {cat.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Offers List */}
        {offers.map(offer => (
          <Surface
            key={offer.id}
            style={[styles.offerCard, { backgroundColor: colors.surface }]}
            elevation={2}
          >
            <View style={styles.offerHeader}>
              <View
                style={[
                  styles.bankLogo,
                  {
                    borderColor: colors.primary,
                    backgroundColor: colors.cardIconBox,
                  },
                ]}
              >
                <Building2 size={22} color={colors.primary} />
              </View>
              <View style={styles.bankInfo}>
                <Text variant="titleMedium">{offer.bank}</Text>
                <Text variant="bodySmall">{offer.type}</Text>
              </View>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.primaryContainer },
                ]}
              >
                <Text variant="labelSmall" style={{ color: colors.success }}>
                  {offer.badge}
                </Text>
              </View>
            </View>

            <View style={styles.metricsContainer}>
              <View
                style={[
                  styles.metricBox,
                  {
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <Percent size={16} color={colors.primary} />
                <Text variant="labelSmall">{'Rate'}</Text>
                <Text variant="titleSmall">{offer.rate}</Text>
              </View>
              <View
                style={[
                  styles.metricBox,
                  {
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <FileText size={16} color={colors.primary} />
                <Text variant="labelSmall">{'Fee'}</Text>
                <Text variant="titleSmall">{offer.fee}</Text>
              </View>
              <View
                style={[
                  styles.metricBox,
                  {
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <Wallet size={16} color={colors.primary} />
                <Text variant="labelSmall">{'EMI'}</Text>
                <Text variant="titleSmall">{offer.emi}</Text>
              </View>
              <View
                style={[
                  styles.metricBox,
                  {
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <UserCheck size={16} color={colors.primary} />
                <Text variant="labelSmall">{'Eligible'}</Text>
                <Text variant="titleSmall">{'View'}</Text>
              </View>
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[styles.btnOutline, { borderColor: colors.borderColor }]}
              >
                <Text variant="labelLarge" style={{ color: colors.onSurface }}>
                  {'Details'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSolid, { backgroundColor: colors.primary }]}
              >
                <Text variant="labelLarge" style={{ color: colors.onPrimary }}>
                  {'Apply now'}
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>
        ))}
      </ScrollView>
    </Container>
  );
};

export default Loans;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryItem: {
    width: '23%',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  offerCard: {
    marginBottom: 15,
    borderRadius: 20,
    padding: 15,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  metricBox: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    gap: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  btnOutline: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});