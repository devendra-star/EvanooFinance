import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text } from 'react-native-paper';
import { KhataScreenProps } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import { TrendingUp, TrendingDown, UserPlus, Bell, MessageCircle, FileText, Search, FileDown } from 'lucide-react-native';

const actions = [
  { id: '1', label: 'Add', icon: UserPlus },
  { id: '2', label: 'Remind', icon: Bell },
  { id: '3', label: 'WhatsApp', icon: MessageCircle },
  { id: '4', label: 'Reports', icon: FileText },
];

const initialCustomers = [
  { id: '1', initials: 'RS', name: 'Rahul Sharma', time: '2 days ago', amount: '₹4,800', type: 'Credit', colorType: 'credit' },
  { id: '2', initials: 'PP', name: 'Priya Patel', time: 'Yesterday', amount: '₹1,200', type: 'Debit', colorType: 'debit' },
  { id: '3', initials: 'AV', name: 'Amit Verma', time: 'Today', amount: '₹12,500', type: 'Credit', colorType: 'credit' },
  { id: '4', initials: 'SR', name: 'Sneha Rao', time: '3 days ago', amount: 'Settled', type: '—', colorType: 'settled' },
  { id: '5', initials: 'RM', name: 'Rohit Mehta', time: '1 week ago', amount: '₹3,200', type: 'Credit', colorType: 'credit' },
];

const Khata = ({ }: KhataScreenProps) => {
  const { colors } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = initialCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAmountColor = (colorType: string) => {
    switch (colorType) {
      case 'credit':
        return colors.success;
      case 'debit':
        return colors.error;
      default:
        return colors.onSurfaceVariant;
    }
  };

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background}>
      <Header title="KhataBook" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Card */}
        <LinearGradient
          colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <Text
            variant="labelSmall"
            style={[styles.summaryLabel, { color: colors.onGradientSubtext }]}
          >
            NET POSITION
          </Text>
          <Text
            variant="displayMedium"
            style={[styles.summaryValue, { color: colors.onGradient }]}
          >
            ₹19,300
          </Text>

          <View style={styles.summarySplit}>
            <View style={[styles.summaryBox, { backgroundColor: colors.onGradientOverlay }]}>
              <View style={styles.summaryBoxHeader}>
                <TrendingUp size={14} color={colors.onGradient} style={{ marginRight: 4 }} />
                <Text
                  variant="labelSmall"
                  style={[styles.summaryBoxLabel, { color: colors.onGradientSubtext }]}
                >
                  YOU'LL GET
                </Text>
              </View>
              <Text
                variant="titleMedium"
                style={[styles.summaryBoxValue, { color: colors.onGradient }]}
              >
                ₹20,500
              </Text>
            </View>

            <View style={[styles.summaryBox, { backgroundColor: colors.onGradientOverlay }]}>
              <View style={styles.summaryBoxHeader}>
                <TrendingDown size={14} color={colors.onGradient} style={{ marginRight: 4 }} />
                <Text
                  variant="labelSmall"
                  style={[styles.summaryBoxLabel, { color: colors.onGradientSubtext }]}
                >
                  YOU'LL GIVE
                </Text>
              </View>
              <Text
                variant="titleMedium"
                style={[styles.summaryBoxValue, { color: colors.onGradient }]}
              >
                ₹1,200
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                activeOpacity={0.8}
                style={[
                  styles.actionItem,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.borderColor,
                  },
                ]}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: colors.cardIconBox }]}>
                  <Icon size={20} color={colors.primary} />
                </View>
                <Text
                  variant="labelSmall"
                  style={[styles.actionLabel, { color: colors.onSurface }]}
                >
                  {action.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderColor,
            },
          ]}
        >
          <Search size={18} color={colors.onSurfaceVariant} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.onSurface }]}
            placeholder="Search customers"
            placeholderTextColor={colors.onSurfaceVariant}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Customer List */}
        <View
          style={[
            styles.listContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderColor,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {filteredCustomers.map((item, index) => {
            const isLast = index === filteredCustomers.length - 1;
            return (
              <View
                key={item.id}
                style={[
                  styles.listItem,
                  !isLast && [styles.listItemBorder, { borderBottomColor: colors.borderColor }],
                ]}
              >
                <View style={[styles.listAvatar, { backgroundColor: colors.primary }]}>
                  <Text
                    variant="titleMedium"
                    style={[styles.listAvatarText, { color: colors.onPrimary }]}
                  >
                    {item.initials}
                  </Text>
                </View>
                <View style={styles.listInfo}>
                  <Text
                    variant="titleSmall"
                    style={[styles.listName, { color: colors.onSurface }]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={[styles.listTime, { color: colors.onSurfaceVariant }]}
                  >
                    {item.time}
                  </Text>
                </View>
                <View style={styles.listAmountContainer}>
                  <Text
                    variant="titleSmall"
                    style={[styles.listAmount, { color: getAmountColor(item.colorType) }]}
                  >
                    {item.amount}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={[styles.listType, { color: colors.onSurfaceVariant }]}
                  >
                    {item.type}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Export Buttons */}
        <View style={styles.exportContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.exportBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <FileDown size={16} color={colors.onSurface} style={{ marginRight: 6 }} />
            <Text
              variant="labelMedium"
              style={[styles.exportBtnText, { color: colors.onSurface }]}
            >
              Export PDF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.exportBtn,
              {
                backgroundColor: colors.surface,
                borderColor: colors.borderColor,
              },
            ]}
          >
            <FileText size={16} color={colors.onSurface} style={{ marginRight: 6 }} />
            <Text
              variant="labelMedium"
              style={[styles.exportBtnText, { color: colors.onSurface }]}
            >
              Export Excel
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Container>
  );
};

export default Khata;

const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  scrollContent: { padding: 16 },

  summaryCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  summaryLabel: {
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    marginBottom: 20,
  },
  summarySplit: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  summaryBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryBoxLabel: {},
  summaryBoxValue: {},

  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionItem: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {},

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
  },

  listContainer: {
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listAvatarText: {},
  listInfo: {
    flex: 1,
  },
  listName: {
    marginBottom: 2,
  },
  listTime: {},
  listAmountContainer: {
    alignItems: 'flex-end',
  },
  listAmount: {
    marginBottom: 2,
  },
  listType: {},

  exportContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  exportBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingVertical: 14,
  },
  exportBtnText: {},
});
