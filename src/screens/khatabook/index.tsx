import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React from 'react';
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

const customers = [
  { id: '1', initials: 'RS', name: 'Rahul Sharma', time: '2 days ago', amount: '₹4,800', type: 'Credit', color: '#10b981' },
  { id: '2', initials: 'PP', name: 'Priya Patel', time: 'Yesterday', amount: '₹1,200', type: 'Debit', color: '#ef4444' },
  { id: '3', initials: 'AV', name: 'Amit Verma', time: 'Today', amount: '₹12,500', type: 'Credit', color: '#10b981' },
  { id: '4', initials: 'SR', name: 'Sneha Rao', time: '3 days ago', amount: 'Settled', type: '—', color: '#475569' },
  { id: '5', initials: 'RM', name: 'Rohit Mehta', time: '1 week ago', amount: '₹3,200', type: 'Credit', color: '#10b981' },
];

const Khata = ({ }: KhataScreenProps) => {
  const { colors } = useAppTheme();

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="KhataBook" />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Card */}
        <LinearGradient
          colors={['#0284c7', '#0ea5e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryCard}
        >
          <Text variant="labelSmall" style={styles.summaryLabel}>NET POSITION</Text>
          <Text variant="displayMedium" style={styles.summaryValue}>₹19,300</Text>
          
          <View style={styles.summarySplit}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryBoxHeader}>
                <TrendingUp size={14} color="#ffffff" style={{ marginRight: 4 }} />
                <Text variant="labelSmall" style={styles.summaryBoxLabel}>YOU'LL GET</Text>
              </View>
              <Text variant="titleMedium" style={styles.summaryBoxValue}>₹20,500</Text>
            </View>
            
            <View style={[styles.summaryBox, styles.summaryBoxDarker]}>
              <View style={styles.summaryBoxHeader}>
                <TrendingDown size={14} color="#ffffff" style={{ marginRight: 4 }} />
                <Text variant="labelSmall" style={styles.summaryBoxLabel}>YOU'LL GIVE</Text>
              </View>
              <Text variant="titleMedium" style={styles.summaryBoxValue}>₹1,200</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Action Grid */}
        <View style={styles.actionGrid}>
          {actions.map(action => {
            const Icon = action.icon;
            return (
              <TouchableOpacity key={action.id} style={styles.actionItem}>
                <View style={styles.actionIconWrap}>
                  <Icon size={20} color="#0ea5e9" />
                </View>
                <Text variant="labelSmall" style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Search size={18} color="#94a3b8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Customer List */}
        <View style={styles.listContainer}>
          {customers.map((item, index) => {
            const isLast = index === customers.length - 1;
            return (
              <View key={item.id} style={[styles.listItem, !isLast && styles.listItemBorder]}>
                <View style={styles.listAvatar}>
                  <Text variant="titleMedium" style={styles.listAvatarText}>{item.initials}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text variant="titleSmall" style={styles.listName}>{item.name}</Text>
                  <Text variant="bodySmall" style={styles.listTime}>{item.time}</Text>
                </View>
                <View style={styles.listAmountContainer}>
                  <Text variant="titleSmall" style={[styles.listAmount, { color: item.color }]}>{item.amount}</Text>
                  <Text variant="labelSmall" style={styles.listType}>{item.type}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Export Buttons */}
        <View style={styles.exportContainer}>
          <TouchableOpacity style={styles.exportBtn}>
            <FileDown size={16} color="#0f172a" style={{ marginRight: 6 }} />
            <Text variant="labelMedium" style={styles.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn}>
            <FileText size={16} color="#0f172a" style={{ marginRight: 6 }} />
            <Text variant="labelMedium" style={styles.exportBtnText}>Export Excel</Text>
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
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  summaryValue: {
    color: '#ffffff',
    fontWeight: '800',
    marginBottom: 20,
  },
  summarySplit: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
  },
  summaryBoxDarker: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  summaryBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryBoxLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
  },
  summaryBoxValue: {
    color: '#ffffff',
    fontWeight: '700',
  },
  
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
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontWeight: '600',
    color: '#334155',
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  listItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  listAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0ea5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  listAvatarText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  listTime: {
    color: '#64748b',
  },
  listAmountContainer: {
    alignItems: 'flex-end',
  },
  listAmount: {
    fontWeight: '700',
    marginBottom: 2,
  },
  listType: {
    color: '#64748b',
  },
  
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
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingVertical: 14,
  },
  exportBtnText: {
    fontWeight: '700',
    color: '#0f172a',
  },
});
