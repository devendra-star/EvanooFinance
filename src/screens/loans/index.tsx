import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, } from 'react-native';
import { Text } from 'react-native-paper';
import { LoansScreenProps } from '../../navigation/types';
import { User, Briefcase, Home as HomeIcon, GraduationCap, Coins, Landmark, Car, Bike, Percent, FileText, Wallet, UserCheck, Building2 } from 'lucide-react-native';

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
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Loans" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Categories Grid */}
        <View style={styles.categoriesContainer}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryItem, isActive && styles.categoryItemActive]}
                onPress={() => setActiveCategory(cat.id)}
              >
                <View style={[styles.categoryIconWrap, isActive && styles.categoryIconWrapActive]}>
                  <cat.icon size={22} color={isActive ? '#ffffff' : '#0ea5e9'} />
                </View>
                <Text variant="labelSmall" style={[styles.categoryText, isActive && styles.categoryTextActive, { textAlign: 'center' }]} numberOfLines={2}>{cat.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Offers List */}
        <View style={styles.offersContainer}>
          {offers.map(offer => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerHeader}>
                <View style={styles.bankLogo}>
                  <Building2 size={22} color="#0ea5e9" />
                </View>
                <View style={styles.bankInfo}>
                  <Text variant="titleMedium" style={styles.bankName}>{offer.bank}</Text>
                  <Text variant="bodySmall" style={styles.bankType}>{offer.type}</Text>
                </View>
                <View style={styles.badge}>
                  <Text variant="labelSmall" style={styles.badgeText}>{offer.badge}</Text>
                </View>
              </View>

              <View style={styles.metricsContainer}>
                <View style={styles.metricBox}>
                  <Percent size={16} color="#0ea5e9" />
                  <Text variant="labelSmall" style={styles.metricLabel}>Rate</Text>
                  <Text variant="titleSmall" style={styles.metricValue}>{offer.rate}</Text>
                </View>
                <View style={styles.metricBox}>
                  <FileText size={16} color="#0ea5e9" />
                  <Text variant="labelSmall" style={styles.metricLabel}>Fee</Text>
                  <Text variant="titleSmall" style={styles.metricValue}>{offer.fee}</Text>
                </View>
                <View style={styles.metricBox}>
                  <Wallet size={16} color="#0ea5e9" />
                  <Text variant="labelSmall" style={styles.metricLabel}>EMI</Text>
                  <Text variant="titleSmall" style={styles.metricValue}>{offer.emi}</Text>
                </View>
                <View style={styles.metricBox}>
                  <UserCheck size={16} color="#0ea5e9" />
                  <Text variant="labelSmall" style={styles.metricLabel}>Eligible</Text>
                  <Text variant="titleSmall" style={styles.metricValue}>View</Text>
                </View>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity style={styles.btnOutline}>
                  <Text variant="labelLarge" style={styles.btnOutlineText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnSolid}>
                  <Text variant="labelLarge" style={styles.btnSolidText}>Apply now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  categoryItemActive: {
    borderColor: '#0ea5e9',
    backgroundColor: '#e0f2fe',
  },
  categoryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIconWrapActive: {
    backgroundColor: '#0ea5e9',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    height: 30, // to align texts even if they wrap to 2 lines
  },
  categoryTextActive: {
    color: '#0f172a',
  },
  offersContainer: {
    marginTop: 8,
  },
  offerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  offerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bankInfo: {
    flex: 1,
  },
  bankName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  bankType: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: '700',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
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
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineText: {
    color: '#334155',
    fontSize: 14,
    fontWeight: '700',
  },
  btnSolid: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSolidText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
