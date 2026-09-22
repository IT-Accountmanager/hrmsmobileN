import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface DeptSegment {
  name: string;
  count: number;
  color: string;
}

const DEPT_DATA: DeptSegment[] = [
  { name: 'Engineering', count: 54, color: '#3B82F6' },
  { name: 'Marketing', count: 22, color: '#EC4899' },
  { name: 'Sales', count: 16, color: '#F59E0B' },
  { name: 'Finance', count: 14, color: '#10B981' },
  { name: 'Human Resources', count: 12, color: '#8B5CF6' },
  { name: 'Operations', count: 6, color: '#06B6D4' },
];

interface DepartmentHeadcountDonutProps {
  isDarkMode?: boolean;
}

export const DepartmentHeadcountDonut: React.FC<DepartmentHeadcountDonutProps> = ({
  isDarkMode,
}) => {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  const radius = 54;
  const strokeWidth = 17;
  const circumference = 2 * Math.PI * radius;
  const total = 124;
  const gap = 3;

  let currentOffset = 0;

  // Split into left and right columns matching reference screenshot
  const colLeft = [DEPT_DATA[0], DEPT_DATA[2], DEPT_DATA[4]]; // Engineering, Sales, HR
  const colRight = [DEPT_DATA[1], DEPT_DATA[3], DEPT_DATA[5]]; // Marketing, Finance, Operations

  const selectedItem = DEPT_DATA.find((d) => d.name === selectedDept);

  return (
    <View style={styles.container}>
      {/* Donut Chart with Center Total */}
      <View style={styles.donutBox}>
        <Svg width={148} height={148} viewBox="0 0 148 148">
          <G rotation="-90" origin="74, 74">
            {DEPT_DATA.map((item) => {
              const sliceLength = (item.count / total) * circumference;
              const dashLength = Math.max(0, sliceLength - gap);
              const dashArray = `${dashLength} ${circumference - dashLength}`;
              const dashOffset = -currentOffset;
              currentOffset += sliceLength;
              const isSelected = selectedDept === item.name;

              return (
                <Circle
                  key={item.name}
                  cx="74"
                  cy="74"
                  r={radius}
                  stroke={item.color}
                  strokeWidth={isSelected ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="butt"
                  fill="transparent"
                  opacity={selectedDept && !isSelected ? 0.35 : 1}
                />
              );
            })}
          </G>
        </Svg>

        {/* Center Label (124 TOTAL) */}
        <View style={styles.centerTextWrap}>
          <Text
            style={[
              styles.centerNumber,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            {selectedItem ? selectedItem.count : '124'}
          </Text>
          <Text style={styles.centerSub}>
            {selectedItem ? selectedItem.name.substring(0, 8).toUpperCase() : 'TOTAL'}
          </Text>
        </View>
      </View>

      {/* Two Column Legend Table (Exact replica of screenshot) */}
      <View style={styles.legendContainer}>
        {/* Left Column */}
        <View style={styles.legendCol}>
          {colLeft.map((item) => {
            const isSelected = selectedDept === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.7}
                onPress={() => setSelectedDept(isSelected ? null : item.name)}
                style={[
                  styles.legendRow,
                  isSelected && {
                    backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
                    borderRadius: 6,
                  },
                ]}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text
                  style={[
                    styles.legendDeptName,
                    {
                      color: isSelected
                        ? '#2563EB'
                        : isDarkMode
                        ? '#E2E8F0'
                        : '#334155',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.legendDeptCount,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                    isSelected && { color: '#2563EB' },
                  ]}
                >
                  {item.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Right Column */}
        <View style={styles.legendCol}>
          {colRight.map((item) => {
            const isSelected = selectedDept === item.name;
            return (
              <TouchableOpacity
                key={item.name}
                activeOpacity={0.7}
                onPress={() => setSelectedDept(isSelected ? null : item.name)}
                style={[
                  styles.legendRow,
                  isSelected && {
                    backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
                    borderRadius: 6,
                  },
                ]}
              >
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text
                  style={[
                    styles.legendDeptName,
                    {
                      color: isSelected
                        ? '#2563EB'
                        : isDarkMode
                        ? '#E2E8F0'
                        : '#334155',
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.legendDeptCount,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                    isSelected && { color: '#2563EB' },
                  ]}
                >
                  {item.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  donutBox: {
    position: 'relative',
    width: 148,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  centerTextWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerNumber: {
    fontSize: 23,
    fontWeight: '800',
  },
  centerSub: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  legendContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 10,
  },
  legendCol: {
    flex: 1,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendDeptName: {
    fontSize: 11.5,
    flex: 1,
  },
  legendDeptCount: {
    fontSize: 11.5,
    fontWeight: '700',
    marginLeft: 4,
  },
});
