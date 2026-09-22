import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from './Card';
import { typography, colors, radii } from '../../theme';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors } from '../../theme';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ReactNode;
  iconBg?: string;
  progressPercent?: number;
  trendText?: string;
  trendPositive?: boolean;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon,
  iconBg = '#EFF6FF',
  progressPercent,
  trendText,
  trendPositive = true,
  onPress,
}) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <Card onPress={onPress} style={styles.card} padding={14}>
      <View style={styles.headerRow}>
        <View style={styles.titleRow}>
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            {icon}
          </View>
          <Text style={[styles.title, { color: theme.subtext }]} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {trendText ? (
          <View
            style={[
              styles.trendBadge,
              {
                backgroundColor: trendPositive
                  ? isDarkMode
                    ? 'rgba(16, 185, 129, 0.18)'
                    : '#ECFDF5'
                  : isDarkMode
                  ? 'rgba(239, 68, 68, 0.18)'
                  : '#FFF1F2',
              },
            ]}
          >
            <Text
              style={[
                styles.trendText,
                { color: trendPositive ? '#059669' : '#E11D48' },
              ]}
            >
              {trendPositive ? '↗ ' : '↘ '}
              {trendText}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: theme.text }]}>{value}</Text>
        {unit ? <Text style={[styles.unit, { color: theme.muted }]}>{unit}</Text> : null}
      </View>

      {progressPercent !== undefined ? (
        <View style={styles.progressSection}>
          <View style={[styles.progressTrack, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
              ]}
            />
          </View>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
          ) : null}
        </View>
      ) : subtitle ? (
        <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: 140,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    flex: 1,
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radii.sm,
  },
  trendText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  value: {
    fontSize: typography.sizes['2xl'],
    fontWeight: typography.weights.black,
    letterSpacing: -0.5,
  },
  unit: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginLeft: 4,
  },
  progressSection: {
    marginTop: 8,
  },
  progressTrack: {
    height: 5,
    width: '100%',
    borderRadius: radii.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.accentBlue,
    borderRadius: radii.full,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
    marginTop: 4,
  },
});
