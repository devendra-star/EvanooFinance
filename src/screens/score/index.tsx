import { Container } from '../../components';
import Header from '../../components/Header';
import { useAppTheme } from '../../hook';
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { ScoreScreenProps } from '../../navigation/types';
import LinearGradient from 'react-native-linear-gradient';
import Svg, { Path, Circle, Polyline, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { Activity, ShieldCheck, CalendarClock, TrendingUp, ChevronRight, Download } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const bureaus = ['CRIF High Mark', 'Experian', 'Equifax', 'CIBIL'];

const factors = [
  { id: '1', title: 'Payment history', value: '98% on-time', icon: Activity },
  { id: '2', title: 'Credit utilization', value: '28%', icon: ShieldCheck },
  { id: '3', title: 'Credit age', value: '6y 4m', icon: CalendarClock },
  { id: '4', title: 'Active loans', value: '2', icon: Activity },
  { id: '5', title: 'Closed loans', value: '5', icon: Activity },
  { id: '6', title: 'Enquiries (last 6m)', value: '3', icon: Activity },
];

const Score = ({ }: ScoreScreenProps) => {
  const { colors } = useAppTheme();
  const [activeBureau, setActiveBureau] = useState(bureaus[0]);

  const score = 782;
  const maxScore = 900;
  const radius = 100;
  const circumference = Math.PI * radius;
  // Offset formula for the arc outline
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background} systemBarStyle="dark">
      <Header title="Score" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab List */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {bureaus.map((bureau) => (
            <TouchableOpacity
              key={bureau}
              onPress={() => setActiveBureau(bureau)}
              style={[
                styles.tabButton,
                activeBureau === bureau ? styles.tabButtonActive : styles.tabButtonInactive
              ]}
            >
              <Text variant="labelLarge" style={[
                styles.tabText,
                activeBureau === bureau ? styles.tabTextActive : styles.tabTextInactive
              ]}>
                {bureau}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Score Card */}
        <LinearGradient
          colors={['#0284c7', '#0ea5e9']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreCard}
        >
          <Text variant="labelMedium" style={styles.scoreCardTitle}>{activeBureau.toUpperCase()}</Text>

          <View style={styles.gaugeContainer}>
            <Svg width={240} height={120} viewBox="0 0 240 120">
              <Defs>
                <SvgLinearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#fca5a5" />
                  <Stop offset="0.5" stopColor="#fde047" />
                  <Stop offset="1" stopColor="#86efac" />
                </SvgLinearGradient>
              </Defs>
              {/* Background Arc */}
              <Path
                d="M 20 110 A 100 100 0 0 1 220 110"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={16}
                strokeLinecap="round"
              />
              {/* Foreground Arc */}
              <Path
                d="M 20 110 A 100 100 0 0 1 220 110"
                fill="none"
                stroke="url(#arcGrad)"
                strokeWidth={16}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </Svg>
            <View style={styles.gaugeInnerContent}>
              <Text variant="displayMedium" style={styles.scoreValue}>{score}</Text>
              <Text variant="labelMedium" style={styles.maxScore}>/ {maxScore}</Text>
              <View style={styles.ratingBadge}>
                <Text variant="labelSmall" style={styles.ratingText}>Excellent</Text>
              </View>
            </View>
          </View>

          <View style={styles.scoreCardFooter}>
            <View style={styles.footerItem}>
              <Text variant="labelSmall" style={styles.footerLabel}>BUREAU</Text>
              <Text variant="titleSmall" style={styles.footerValue}>{activeBureau}</Text>
            </View>
            <View style={styles.footerItem}>
              <Text variant="labelSmall" style={styles.footerLabel}>UPDATED</Text>
              <Text variant="titleSmall" style={styles.footerValue}>12 Jul</Text>
            </View>
            <View style={styles.footerItem}>
              <Text variant="labelSmall" style={styles.footerLabel}>REFRESH</Text>
              <Text variant="titleSmall" style={styles.footerValue}>11 Aug</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Score History */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={styles.cardTitle}>Score history</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={14} color="#10b981" />
              <Text variant="labelSmall" style={styles.trendText}> +62 in 6m</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <Svg width="100%" height={100} viewBox="0 0 300 100" preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="rgba(14, 165, 233, 0.2)" />
                  <Stop offset="1" stopColor="rgba(14, 165, 233, 0)" />
                </SvgLinearGradient>
              </Defs>
              <Path
                d="M 0 80 L 50 70 L 100 65 L 150 70 L 200 55 L 250 45 L 300 30 L 300 100 L 0 100 Z"
                fill="url(#chartGrad)"
              />
              <Polyline
                points="0,80 50,70 100,65 150,70 200,55 250,45 300,30"
                fill="none"
                stroke="#0ea5e9"
                strokeWidth={3}
              />
              {/* Dots */}
              <Circle cx="50" cy="70" r="4" fill="#0ea5e9" />
              <Circle cx="100" cy="65" r="4" fill="#0ea5e9" />
              <Circle cx="150" cy="70" r="4" fill="#0ea5e9" />
              <Circle cx="200" cy="55" r="4" fill="#0ea5e9" />
              <Circle cx="250" cy="45" r="4" fill="#0ea5e9" />
              <Circle cx="300" cy="30" r="4" fill="#0ea5e9" />
            </Svg>
          </View>
        </View>

        {/* Factors */}
        <View style={styles.card}>
          {factors.map((factor, index) => {
            const Icon = factor.icon;
            const isLast = index === factors.length - 1;
            return (
              <TouchableOpacity key={factor.id} style={[styles.factorRow, !isLast && styles.factorRowBorder]}>
                <View style={styles.factorIconContainer}>
                  <Icon size={20} color="#0ea5e9" />
                </View>
                <Text variant="bodyMedium" style={styles.factorTitle}>{factor.title}</Text>
                <Text variant="titleSmall" style={styles.factorValue}>{factor.value}</Text>
                <ChevronRight size={18} color="#94a3b8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Download Button */}
        <TouchableOpacity style={styles.downloadBtn}>
          <Download size={20} color="#fff" />
          <Text variant="labelLarge" style={styles.downloadBtnText}>Download report PDF</Text>
        </TouchableOpacity>

      </ScrollView>
    </Container>
  );
};

export default Score;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  tabsContainer: {
    paddingBottom: 15,
    gap: 12,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  tabButtonActive: {
    backgroundColor: '#0ea5e9',
    borderColor: '#0ea5e9',
  },
  tabButtonInactive: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabTextInactive: {
    color: '#475569',
  },
  scoreCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  scoreCardTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  gaugeContainer: {
    alignItems: 'center',
    height: 140,
    justifyContent: 'flex-start',
  },
  gaugeInnerContent: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    paddingTop: 30,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '800',
    color: '#ffffff',
  },
  maxScore: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginTop: -4,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  ratingText: {
    color: '#86efac',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  footerItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  footerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  footerValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
    color: '#10b981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 2,
  },
  chartContainer: {
    height: 100,
    marginTop: 10,
    overflow: 'hidden',
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  factorRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  factorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factorTitle: {
    flex: 1,
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  factorValue: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
    marginRight: 8,
  },
  downloadBtn: {
    backgroundColor: '#0ea5e9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 20,
  },
  downloadBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
