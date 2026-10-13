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

const Score = ({ navigation }: ScoreScreenProps) => {
  const { colors, isDark } = useAppTheme();
  const [activeBureau, setActiveBureau] = useState(bureaus[0]);

  const score = 782;
  const maxScore = 900;
  const radius = 100;
  const circumference = Math.PI * radius;
  // Offset formula for the arc outline
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <Container edges={['top', 'left', 'right']} backgroundColor={colors.background}>
      <Header title="Credit Score" />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tab List */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
          {bureaus.map((bureau) => {
            const isActive = activeBureau === bureau;
            return (
              <TouchableOpacity
                key={bureau}
                onPress={() => setActiveBureau(bureau)}
                activeOpacity={0.8}
                style={[
                  styles.tabButton,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                    borderColor: isActive ? colors.primary : colors.borderColor,
                  },
                ]}
              >
                <Text
                  variant="labelLarge"
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? colors.onPrimary : colors.onSurface,
                    },
                  ]}
                >
                  {bureau}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Score Card */}
        <LinearGradient
          colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.scoreCard}
        >
          <Text
            variant="labelMedium"
            style={[styles.scoreCardTitle, { color: colors.onGradientSubtext }]}
          >
            {activeBureau.toUpperCase()}
          </Text>

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
                stroke={colors.onGradientOverlay}
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
              <Text variant="displayMedium" style={[styles.scoreValue, { color: colors.onGradient }]}>
                {score}
              </Text>
              <Text variant="labelMedium" style={[styles.maxScore, { color: colors.onGradientSubtext }]}>
                / {maxScore}
              </Text>
              <View style={[styles.ratingBadge, { backgroundColor: colors.onGradientOverlay }]}>
                <Text variant="labelSmall" style={styles.ratingText}>
                  Excellent
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.scoreCardFooter}>
            <View style={[styles.footerItem, { backgroundColor: colors.onGradientOverlay }]}>
              <Text variant="labelSmall" style={[styles.footerLabel, { color: colors.onGradientSubtext }]}>
                BUREAU
              </Text>
              <Text variant="titleSmall" style={[styles.footerValue, { color: colors.onGradient }]}>
                {activeBureau}
              </Text>
            </View>
            <View style={[styles.footerItem, { backgroundColor: colors.onGradientOverlay }]}>
              <Text variant="labelSmall" style={[styles.footerLabel, { color: colors.onGradientSubtext }]}>
                UPDATED
              </Text>
              <Text variant="titleSmall" style={[styles.footerValue, { color: colors.onGradient }]}>
                12 Jul
              </Text>
            </View>
            <View style={[styles.footerItem, { backgroundColor: colors.onGradientOverlay }]}>
              <Text variant="labelSmall" style={[styles.footerLabel, { color: colors.onGradientSubtext }]}>
                REFRESH
              </Text>
              <Text variant="titleSmall" style={[styles.footerValue, { color: colors.onGradient }]}>
                11 Aug
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Score History */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderColor,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={[styles.cardTitle, { color: colors.onSurface }]}>
              Score history
            </Text>
            <View style={[styles.trendBadge, { backgroundColor: colors.successContainer }]}>
              <TrendingUp size={14} color={colors.success} />
              <Text variant="labelSmall" style={[styles.trendText, { color: colors.onSuccessContainer }]}>
                {' '}+62 in 6m
              </Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <Svg width="100%" height={100} viewBox="0 0 300 100" preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={colors.primary} stopOpacity={0.25} />
                  <Stop offset="1" stopColor={colors.primary} stopOpacity={0.0} />
                </SvgLinearGradient>
              </Defs>
              <Path
                d="M 0 80 L 50 70 L 100 65 L 150 70 L 200 55 L 250 45 L 300 30 L 300 100 L 0 100 Z"
                fill="url(#chartGrad)"
              />
              <Polyline
                points="0,80 50,70 100,65 150,70 200,55 250,45 300,30"
                fill="none"
                stroke={colors.primary}
                strokeWidth={3}
              />
              {/* Dots */}
              <Circle cx="50" cy="70" r="4" fill={colors.primary} />
              <Circle cx="100" cy="65" r="4" fill={colors.primary} />
              <Circle cx="150" cy="70" r="4" fill={colors.primary} />
              <Circle cx="200" cy="55" r="4" fill={colors.primary} />
              <Circle cx="250" cy="45" r="4" fill={colors.primary} />
              <Circle cx="300" cy="30" r="4" fill={colors.primary} />
            </Svg>
          </View>
        </View>

        {/* Factors */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderColor: colors.borderColor,
              shadowColor: colors.shadow,
            },
          ]}
        >
          {factors.map((factor, index) => {
            const Icon = factor.icon;
            const isLast = index === factors.length - 1;
            return (
              <TouchableOpacity
                key={factor.id}
                activeOpacity={0.7}
                onPress={() => {
                  if (factor.id === '1') {
                    navigation.navigate('PaymentHistory');
                  }
                }}
                style={[
                  styles.factorRow,
                  !isLast && [styles.factorRowBorder, { borderBottomColor: colors.borderColor }],
                ]}
              >
                <View style={[styles.factorIconContainer, { backgroundColor: colors.cardIconBox }]}>
                  <Icon size={20} color={colors.primary} />
                </View>
                <Text variant="bodyMedium" style={[styles.factorTitle, { color: colors.onSurface }]}>
                  {factor.title}
                </Text>
                <Text variant="titleSmall" style={[styles.factorValue, { color: colors.onSurface }]}>
                  {factor.value}
                </Text>
                <ChevronRight size={18} color={colors.outline} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Download Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.downloadBtn, { backgroundColor: colors.primary }]}
        >
          <Download size={20} color={colors.onPrimary} />
          <Text variant="labelLarge" style={[styles.downloadBtnText, { color: colors.onPrimary }]}>
            Download report PDF
          </Text>
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
  tabText: {},
  scoreCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
  },
  scoreCardTitle: {
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
  scoreValue: {},
  maxScore: {
    marginTop: -4,
  },
  ratingBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  ratingText: {
    color: '#86efac',
  },
  scoreCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  footerItem: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flex: 1,
  },
  footerLabel: {
    marginBottom: 4,
  },
  footerValue: {
    textAlign: 'center',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
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
  cardTitle: {},
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trendText: {
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
  },
  factorIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  factorTitle: {
    flex: 1,
  },
  factorValue: {
    marginRight: 8,
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
    marginBottom: 20,
  },
  downloadBtnText: {
    marginLeft: 8,
  },
});
