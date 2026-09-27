import { ScrollView, StyleSheet, View } from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import moment from 'moment';
import { CheckCircle2, RefreshCw } from 'lucide-react-native';
import { useAppTheme } from '../../../hook';
import { CreditScoreGauge } from '../../../components';
import { mockCreditScoreResponse } from './data';

const CreditScore = () => {
  const { colors } = useAppTheme();
  const CREDIT_SCORE_GRADIENT = ['#0295DB', '#1DA1F2'];
  const { creditScore, freeReportOffer } = mockCreditScoreResponse.data;

  return (
    <LinearGradient
      colors={CREDIT_SCORE_GRADIENT}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.scoreCard}
    >
      <View style={styles.scoreHeader}>
        <View>
          <Text variant="labelSmall" style={{ color: colors.background }}>
            {'CREDIT SCORE'}
          </Text>
          <Text variant="titleMedium" style={{ color: colors.background }}>
            {creditScore.primaryBureau}
          </Text>
        </View>
        {creditScore.isVerified && (
          <View style={styles.verifiedBadge}>
            <CheckCircle2 size={12} color={colors.background} />
            <Text
              variant="labelSmall"
              style={{ color: colors.background, marginLeft: 4 }}
            >
              {'Verified'}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.gaugeContainer}>
        <CreditScoreGauge score={creditScore.score} />
      </View>
      <View style={styles.scoreStatsRow}>
        <View style={styles.statBox}>
          <Text variant="labelSmall" style={{ color: colors.background }}>
            {'RANGE'}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.background }}>
            {`${creditScore.minScore}-${creditScore.maxScore}`}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text variant="labelSmall" style={{ color: colors.background }}>
            {'LAST UPDATED'}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.background }}>
            {moment(creditScore.lastUpdatedAt).format('D MMMM')}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text variant="labelSmall" style={{ color: colors.background }}>
            {'NEXT REFRESH'}
          </Text>
          <Text variant="bodySmall" style={{ color: colors.background }}>
            {moment(creditScore.nextRefreshAt).format('D MMMM')}
          </Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.bureausScroll}
      >
        {creditScore.bureaus.map(bureau => (
          <View
            key={bureau.id}
            style={
              bureau.isActive ? styles.bureauActive : styles.bureauInactive
            }
          >
            <Text
              variant="labelMedium"
              style={
                bureau.isActive
                  ? { color: colors.primary }
                  : { color: colors.background }
              }
            >
              {bureau.name}
            </Text>
          </View>
        ))}
      </ScrollView>
      {freeReportOffer.isEligible && (
        <View style={styles.scoreBanner}>
          <View style={{ flex: 1 }}>
            <Text variant="labelLarge" style={{ color: colors.background }}>
              {'First report free'}
            </Text>
            <Text variant="labelSmall" style={{ color: colors.background }}>
              {`After ${freeReportOffer.validAfterDays} days · ${freeReportOffer.bureauName} ₹${freeReportOffer.price}`}
            </Text>
          </View>
          <View style={styles.timerBadge}>
            <RefreshCw size={12} color="#fff" style={{ marginRight: 4 }} />
            <Text variant="labelSmall" style={{ color: colors.background }}>
              {`In ${freeReportOffer.daysRemaining} days`}
            </Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

export default CreditScore;

const styles = StyleSheet.create({
  scoreCard: {
    borderRadius: 24,
    padding: 15,
    marginBottom: 24,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gaugeContainer: {
    alignItems: 'center',
    marginVertical: 20,
    height: 120,
  },
  scoreStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 8,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bureausScroll: {
    marginBottom: 20,
  },
  bureauActive: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  bureauInactive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  scoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 16,
    borderRadius: 16,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
});
