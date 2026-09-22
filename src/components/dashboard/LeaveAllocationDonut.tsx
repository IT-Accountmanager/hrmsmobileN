import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface LeaveSegment {
  label: string;
  count: number;
  percent: number;
  color: string;
}

const LEAVE_DATA: LeaveSegment[] = [
  { label: 'Approved', count: 68, percent: 36.6, color: '#2563EB' },
  { label: 'Pending', count: 48, percent: 25.8, color: '#10B981' },
  { label: 'Rejected', count: 12, percent: 6.5, color: '#F59E0B' },
  { label: 'Cancelled', count: 8, percent: 4.3, color: '#EF4444' },
  { label: 'Others', count: 50, percent: 26.9, color: '#8B5CF6' },
];

export const LeaveAllocationDonut: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<string | null>(null);

  const radius = 54;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const totalLeaves = 186;
  const gap = 3.5;

  let currentOffset = 0;

  return (
    <View style={styles.container}>
      {/* Center Donut SVG */}
      <View style={styles.donutWrapper}>
        <Svg width={160} height={160} viewBox="0 0 160 160">
          <G rotation="-90" origin="80, 80">
            {LEAVE_DATA.map((item) => {
              const sliceLength = (item.count / totalLeaves) * circumference;
              const dashLength = Math.max(0, sliceLength - gap);
              const dashArray = `${dashLength} ${circumference - dashLength}`;
              const dashOffset = -currentOffset;
              currentOffset += sliceLength;
              const isSelected = activeSegment === item.label;

              return (
                <Circle
                  key={item.label}
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 3 : strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  fill="transparent"
                  opacity={activeSegment && !isSelected ? 0.45 : 1}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Labels */}
        <View style={styles.centerInfo}>
          <Text style={styles.centerNumber}>
            {activeSegment
              ? LEAVE_DATA.find((d) => d.label === activeSegment)?.count
              : totalLeaves}
          </Text>
          <Text style={styles.centerLabel}>
            {activeSegment ? activeSegment.toUpperCase() : 'LEAVES'}
          </Text>
        </View>
      </View>

      {/* Legend Breakdown */}
      <View style={styles.legendContainer}>
        {LEAVE_DATA.map((item) => {
          const isSelected = activeSegment === item.label;
          return (
            <TouchableOpacity
              key={item.label}
              activeOpacity={0.7}
              onPress={() =>
                setActiveSegment(isSelected ? null : item.label)
              }
              style={[
                styles.legendRow,
                isSelected && styles.legendRowActive,
              ]}
            >
              <View style={styles.legendLeft}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendLabel}>{item.label}</Text>
              </View>
              <Text style={styles.legendValue}>
                {item.count}{' '}
                <Text style={styles.legendPercent}>({item.percent}%)</Text>
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  donutWrapper: {
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  centerInfo: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  centerLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: -2,
  },
  legendContainer: {
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  legendRowActive: {
    backgroundColor: '#EFF6FF',
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  legendLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  legendValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  legendPercent: {
    fontWeight: '400',
    color: '#64748B',
  },
});
