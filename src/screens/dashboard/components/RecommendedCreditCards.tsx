import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Text, TouchableRipple } from 'react-native-paper';
import { ChevronRight, CreditCard } from 'lucide-react-native';
import { useAppTheme } from '../../../hook';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const RecommendedCreditCards = () => {
  const { colors } = useAppTheme();
  const navigation = useNavigation<any>();
  const dummyCreditCards = [
    {
      cardId: 'cashback-prime',
      brand: 'EVANOO',
      name: 'Cashback Prime',
      badge: '5% Cashback',
      price: '₹499',
    },
    {
      cardId: 'wanderlust',
      brand: 'EVANOO',
      name: 'Wanderlust Card',
      badge: 'Travel',
      price: '₹999',
    },
    {
      cardId: 'shopping-max',
      brand: 'EVANOO',
      name: 'Shopping Max',
      badge: '10% Off Online',
      price: '₹799',
    },
    {
      cardId: 'fuel-saver',
      brand: 'EVANOO',
      name: 'Fuel Saver',
      badge: 'Fuel Surcharge Waiver',
      price: '₹299',
    },
    {
      cardId: 'business-elite',
      brand: 'EVANOO',
      name: 'Business Elite',
      badge: 'Zero Annual Fee',
      price: '₹1,499',
    },
  ];

  return (
    <View style={{ marginBottom: 15 }}>
      <View style={styles.sectionHeader}>
        <Text variant="titleMedium">Recommended Credit Cards</Text>
        <TouchableRipple
          borderless={false}
          style={{ flexDirection: 'row', alignItems: 'center' }}
        >
          <>
            <Text variant="labelMedium" style={{ color: colors.primary }}>
              See all
            </Text>
            <ChevronRight size={14} color={colors.primary} />
          </>
        </TouchableRipple>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {dummyCreditCards.map(card => (
          <TouchableOpacity
            key={card.cardId}
            onPress={() =>
              navigation.navigate('CreditCardDetails', {
                cardId: card.cardId,
              })
            }
          >
            <LinearGradient
              colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ccCard}
            >
              <CreditCard
                size={24}
                color={colors.surface}
                style={{ marginBottom: 10 }}
              />
              <Text variant="labelSmall" style={{ color: colors.surface }}>
                {card.brand}
              </Text>
              <Text
                variant="titleMedium"
                style={{ color: colors.surface, marginBottom: 12 }}
              >
                {card.name}
              </Text>
              <View style={styles.ccFooter}>
                <View
                  style={[
                    styles.ccBadge,
                    { backgroundColor: 'rgba(255,255,255,0.2)' },
                  ]}
                >
                  <Text variant="bodySmall" style={{ color: colors.surface }}>
                    {card.badge}
                  </Text>
                </View>
                <Text variant="bodySmall" style={{ color: colors.surface }}>
                  {card.price}
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default RecommendedCreditCards;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  horizontalScroll: {
    // marginBottom: 24,
    overflow: 'visible',
  },
  ccCard: {
    width: 220,
    borderRadius: 20,
    padding: 10,
    marginRight: 16,
  },
  ccFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ccBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
});
