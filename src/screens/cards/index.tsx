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
    colors: ['#0094e8', '#4338ca'],
    metrics: {
      annualFee: '₹499',
      joining: '₹499',
      rewards: '5% on all',
      eligibility: 'Salaried',
    },
    feature: '1% fuel surcharge waiver',
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
      eligibility: 'Salaried',
    },
    feature: 'Lounge access, insurance',
  },
  {
    id: '3',
    bank: 'ICICI',
    name: "Shopper's Edge",
    number: '•••• 4821',
    colors: ['#059669', '#10b981'],
    metrics: {
      annualFee: 'Lifetime free',
      joining: 'Free',
      rewards: '5%\nAmazon/Flipkart',
      eligibility: 'Salaried',
    },
    feature: 'EMI on ₹3k+',
  },
  {
    id: '4',
    bank: 'SBI',
    name: 'Signature Black',
    number: '•••• 4821',
    colors: ['#283548', '#4b5563'],
    metrics: {
      annualFee: '₹4,999',
      joining: '₹4,999',
      rewards: '2x on dining',
      eligibility: 'Salaried',
    },
    feature: 'Golf, concierge, lounge',
  },
];

const Cards = ({ navigation }: CardsScreenProps) => {
  const { colors } = useAppTheme();
  const [activeFilter, setActiveFilter] = useState(filters[0].id);

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background}>
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
                activeOpacity={0.8}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.borderColor,
                  },
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Icon size={16} color={isActive ? colors.onPrimary : colors.onSurface} />
                <Text
                  variant="labelLarge"
                  style={[
                    styles.filterPillText,
                    { color: isActive ? colors.onPrimary : colors.onSurface },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Cards List */}
        {cards.map(card => (
          <View
            key={card.id}
            style={[
              styles.cardContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderColor,
                shadowColor: colors.shadow,
              },
            ]}
          >
            {/* Visual Card */}
            <LinearGradient
              colors={card.colors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardVisual}
            >
              <View style={styles.cardVisualTop}>
                <CreditCard size={24} color={colors.onGradient} />
                <Text
                  variant="labelMedium"
                  style={[styles.cardBankText, { color: colors.onGradient }]}
                >
                  {card.bank}
                </Text>
              </View>

              <View style={styles.cardVisualBottom}>
                <View>
                  <Text
                    variant="labelSmall"
                    style={[styles.cardBrandText, { color: colors.onGradientSubtext }]}
                  >
                    EVANOO
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={[styles.cardNameText, { color: colors.onGradient }]}
                  >
                    {card.name}
                  </Text>
                </View>
                <Text
                  variant="labelLarge"
                  style={[styles.cardNumberText, { color: colors.onGradient }]}
                >
                  {card.number}
                </Text>
              </View>
            </LinearGradient>

            {/* Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricRow}>
                <View
                  style={[
                    styles.metricBox,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}
                  >
                    Annual fee
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[styles.metricValue, { color: colors.onSurface }]}
                  >
                    {card.metrics.annualFee}
                  </Text>
                </View>
                <View
                  style={[
                    styles.metricBox,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}
                  >
                    Joining
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[styles.metricValue, { color: colors.onSurface }]}
                  >
                    {card.metrics.joining}
                  </Text>
                </View>
              </View>
              <View style={styles.metricRow}>
                <View
                  style={[
                    styles.metricBox,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}
                  >
                    Rewards
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[styles.metricValue, { color: colors.onSurface }]}
                  >
                    {card.metrics.rewards}
                  </Text>
                </View>
                <View
                  style={[
                    styles.metricBox,
                    { backgroundColor: colors.elevation.level2 },
                  ]}
                >
                  <Text
                    variant="labelSmall"
                    style={[styles.metricLabel, { color: colors.onSurfaceVariant }]}
                  >
                    Eligibility
                  </Text>
                  <Text
                    variant="labelMedium"
                    style={[styles.metricValue, { color: colors.onSurface }]}
                  >
                    {card.metrics.eligibility}
                  </Text>
                </View>
              </View>
            </View>

            {/* Feature */}
            <View
              style={[
                styles.featureBox,
                { backgroundColor: colors.elevation.level2 },
              ]}
            >
              <Text
                variant="bodySmall"
                style={[styles.featureText, { color: colors.onSurfaceVariant }]}
              >
                {card.feature}
              </Text>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('CreditCardDetails', { cardId: card.id })}
              style={[styles.applyBtn, { backgroundColor: colors.primary }]}
            >
              <Text
                variant="titleSmall"
                style={[styles.applyBtnText, { color: colors.onPrimary }]}
              >
                Apply now
              </Text>
              <ArrowUpRight size={16} color={colors.onPrimary} style={{ marginLeft: 6 }} />
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
  filterPillText: {
    marginLeft: 6,
  },
  cardContainer: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
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
  cardBankText: {
    letterSpacing: 1,
  },
  cardVisualBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardBrandText: {
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardNameText: {},
  cardNumberText: {
    letterSpacing: 2,
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
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  metricLabel: {
    flexShrink: 0,
  },
  metricValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 8,
  },
  featureBox: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  featureText: {},
  applyBtn: {
    flexDirection: 'row',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {},
});
