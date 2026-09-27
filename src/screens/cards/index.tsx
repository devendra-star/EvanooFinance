import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { CardsScreenProps } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { Star, CheckCircle, Plane, ShoppingBag, CreditCard, ArrowUpRight, Crown } from 'lucide-react-native';

const filters = [
  { id: '1', label: 'Featured', icon: Star },
  { id: '2', label: 'Cashback', icon: CheckCircle },
  { id: '3', label: 'Travel', icon: Plane },
  { id: '4', label: 'Shopping', icon: ShoppingBag },
  { id: '5', label: 'Premium', icon: Crown },
  { id: '6', label: 'Lifetime Free', icon: CreditCard },
];

const cards = [
  {
    id: '1',
    bank: 'HDFC',
    name: 'Cashback Prime',
    number: '•••• 4821',
    colors: ['#0ea5e9', '#6366f1'],
    metrics: {
      annualFee: '₹499',
      joining: '₹499',
      rewards: '5% on all',
      eligibility: 'Salaried'
    },
    feature: '1% fuel surcharge waiver'
  },
  {
    id: '2',
    bank: 'AXIS',
    name: 'Wanderlust Card',
    number: '•••• 4821',
    colors: ['#d946ef', '#f43f5e'],
    metrics: {
      annualFee: '₹999',
      joining: 'Waived',
      rewards: '10x on travel',
      eligibility: 'Salaried'
    },
    feature: 'Lounge access, insurance'
  },
  {
    id: '3',
    bank: 'ICICI',
    name: "Shopper's Edge",
    number: '•••• 4821',
    colors: ['#0d9488', '#10b981'],
    metrics: {
      annualFee: 'Lifetime free',
      joining: 'Free',
      rewards: '5%\nAmazon/Flipkart',
      eligibility: 'Salaried'
    },
    feature: 'EMI on ₹3k+'
  },
  {
    id: '4',
    bank: 'SBI',
    name: 'Signature Black',
    number: '•••• 4821',
    colors: ['#334155', '#475569'],
    metrics: {
      annualFee: '₹4,999',
      joining: '₹4,999',
      rewards: '2x on dining',
      eligibility: 'Salaried'
    },
    feature: 'Golf, concierge, lounge'
  }
];

const Cards = ({ }: CardsScreenProps) => {
  const { colors } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState(filters[0].id);

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Credit Cards" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Filters */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map(filter => {
            const isActive = activeFilter === filter.id;
            const Icon = filter.icon;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterPill, isActive ? styles.filterPillActive : styles.filterPillInactive]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Icon size={16} color={isActive ? '#ffffff' : '#475569'} />
                <Text 
                  variant="labelLarge" 
                  style={[styles.filterPillText, isActive ? styles.filterPillTextActive : styles.filterPillTextInactive]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Cards List */}
        {cards.map(card => (
          <View key={card.id} style={styles.cardContainer}>
            {/* Visual Card */}
            <LinearGradient
              colors={card.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardVisual}
            >
              <View style={styles.cardVisualTop}>
                <CreditCard size={24} color="#ffffff" />
                <Text variant="labelMedium" style={{ color: '#ffffff', fontWeight: '700', letterSpacing: 1 }}>{card.bank}</Text>
              </View>
              
              <View style={styles.cardVisualBottom}>
                <View>
                  <Text variant="labelSmall" style={{ color: 'rgba(255,255,255,0.8)', letterSpacing: 1, marginBottom: 2 }}>EVANOO</Text>
                  <Text variant="titleLarge" style={{ color: '#ffffff', fontWeight: '700' }}>{card.name}</Text>
                </View>
                <Text variant="labelLarge" style={{ color: '#ffffff', fontWeight: '700', letterSpacing: 2 }}>{card.number}</Text>
              </View>
            </LinearGradient>

            {/* Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricRow}>
                <View style={styles.metricBox}>
                  <Text variant="labelSmall" style={styles.metricLabel}>Annual fee</Text>
                  <Text variant="labelMedium" style={styles.metricValue}>{card.metrics.annualFee}</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text variant="labelSmall" style={styles.metricLabel}>Joining</Text>
                  <Text variant="labelMedium" style={styles.metricValue}>{card.metrics.joining}</Text>
                </View>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricBox}>
                  <Text variant="labelSmall" style={styles.metricLabel}>Rewards</Text>
                  <Text variant="labelMedium" style={styles.metricValue}>{card.metrics.rewards}</Text>
                </View>
                <View style={styles.metricBox}>
                  <Text variant="labelSmall" style={styles.metricLabel}>Eligibility</Text>
                  <Text variant="labelMedium" style={styles.metricValue}>{card.metrics.eligibility}</Text>
                </View>
              </View>
            </View>

            {/* Feature */}
            <View style={styles.featureBox}>
              <Text variant="bodySmall" style={styles.featureText}>{card.feature}</Text>
            </View>

            {/* Apply Button */}
            <TouchableOpacity style={styles.applyBtn}>
              <Text variant="titleSmall" style={styles.applyBtnText}>Apply now</Text>
              <ArrowUpRight size={16} color="#ffffff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Container>
  );
};

export default Cards;

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },
  filtersContainer: {
    marginBottom: 20,
    gap: 10,
    paddingBottom: 4,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    marginRight: 10,
  },
  filterPillActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  filterPillInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  filterPillText: {
    fontWeight: '700',
    marginLeft: 6,
  },
  filterPillTextActive: {
    color: '#ffffff',
  },
  filterPillTextInactive: {
    color: '#475569',
  },
  
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardVisual: {
    borderRadius: 16,
    padding: 20,
    height: 170,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardVisualTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardVisualBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  
  metricsGrid: {
    gap: 10,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 10,
  },
  metricBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  metricLabel: {
    color: '#64748b',
  },
  metricValue: {
    color: '#0f172a',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  
  featureBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  featureText: {
    color: '#475569',
    fontWeight: '500',
  },
  
  applyBtn: {
    flexDirection: 'row',
    backgroundColor: '#38bdf8',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
