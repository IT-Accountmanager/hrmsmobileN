import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Line,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  label: string;
  count: number;
  x: number;
  y: number;
  change: string;
}

const DATA_POINTS: DataPoint[] = [
  { label: 'Jan', count: 88, x: 20, y: 55, change: 'Baseline' },
  { label: 'Feb', count: 94, x: 95, y: 49, change: '+6 hires' },
  { label: 'Mar', count: 101, x: 170, y: 43, change: '+7 hires' },
  { label: 'Apr', count: 111, x: 245, y: 34, change: '+10 hires' },
  { label: 'May', count: 124, x: 320, y: 22, change: '+13 hires (+40.9%)' },
];

interface HeadcountGrowthChartProps {
  isDarkMode?: boolean;
}

export const HeadcountGrowthChart: React.FC<HeadcountGrowthChartProps> = ({ isDarkMode }) => {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint>(DATA_POINTS[4]);

  const chartWidth = Math.min(SCREEN_WIDTH - 64, 340);
  const scale = chartWidth / 340;
  const chartHeight = 135;

  // Smooth spline curve matching reference screenshot
  const linePath = `
    M 20,55
    C 57.5,55 57.5,49 95,49
    C 132.5,49 132.5,43 170,43
    C 207.5,43 207.5,34 245,34
    C 282.5,34 282.5,22 320,22
  `;

  const areaPath = `
    ${linePath}
    L 320,130
    L 20,130
    Z
  `;

  const yTicks = [140, 105, 70, 35, 0];

  return (
    <View style={styles.container}>
      {/* Tooltip callout */}
      {selectedPoint && (
        <View
          style={[
            styles.tooltipBox,
            {
              left: Math.max(
                10,
                Math.min(selectedPoint.x * scale - 45, chartWidth - 95)
              ),
              backgroundColor: isDarkMode ? '#1E293B' : '#0F172A',
            },
          ]}
        >
          <Text style={styles.tooltipMonth}>{selectedPoint.label} 2024</Text>
          <Text style={styles.tooltipCount}>{selectedPoint.count} Headcount</Text>
          <Text style={styles.tooltipChange}>{selectedPoint.change}</Text>
        </View>
      )}

      <View style={styles.chartWrapper}>
        {/* Y Axis Numbers (0, 35, 70, 105, 140) */}
        <View style={styles.yAxisLabels}>
          {yTicks.map((val) => (
            <Text
              key={val}
              style={[
                styles.yAxisText,
                { color: isDarkMode ? '#64748B' : '#94A3B8' },
              ]}
            >
              {val}
            </Text>
          ))}
        </View>

        {/* SVG Chart Area */}
        <View style={{ width: chartWidth, height: chartHeight }}>
          <Svg width={chartWidth} height={chartHeight} viewBox="0 0 340 135">
            <Defs>
              <SvgGradient id="headcountGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.38" />
                <Stop offset="60%" stopColor="#3B82F6" stopOpacity="0.12" />
                <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
              </SvgGradient>
            </Defs>

            {/* Horizontal Grid lines */}
            {[22, 49, 76, 103, 130].map((y, i) => (
              <Line
                key={i}
                x1="10"
                y1={y}
                x2="330"
                y2={y}
                stroke={isDarkMode ? '#334155' : '#F1F5F9'}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Area Fill */}
            <Path d={areaPath} fill="url(#headcountGradient)" />

            {/* Spline Stroke Line */}
            <Path
              d={linePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Data Points */}
            {DATA_POINTS.map((pt) => {
              const isSelected = selectedPoint?.label === pt.label;
              return (
                <Circle
                  key={pt.label}
                  cx={pt.x}
                  cy={pt.y}
                  r={isSelected ? 5.5 : 4}
                  fill={isSelected ? '#2563EB' : '#FFFFFF'}
                  stroke="#2563EB"
                  strokeWidth={isSelected ? 2.5 : 2}
                />
              );
            })}
          </Svg>

          {/* Touch targets for selecting points */}
          <View style={[StyleSheet.absoluteFill, { flexDirection: 'row' }]}>
            {DATA_POINTS.map((pt) => (
              <TouchableOpacity
                key={pt.label}
                activeOpacity={0.7}
                onPress={() => setSelectedPoint(pt)}
                style={{
                  flex: 1,
                  height: '100%',
                }}
              />
            ))}
          </View>
        </View>
      </View>

      {/* X Axis Labels (Jan, Feb, Mar, Apr, May) */}
      <View style={[styles.xAxisLabels, { marginLeft: 36, width: chartWidth }]}>
        {DATA_POINTS.map((pt) => {
          const isSelected = selectedPoint?.label === pt.label;
          return (
            <TouchableOpacity
              key={pt.label}
              onPress={() => setSelectedPoint(pt)}
              style={styles.xLabelBtn}
            >
              <Text
                style={[
                  styles.xAxisText,
                  { color: isSelected ? '#2563EB' : isDarkMode ? '#94A3B8' : '#64748B' },
                  isSelected && styles.xAxisTextActive,
                ]}
              >
                {pt.label}
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
    paddingTop: 8,
    position: 'relative',
  },
  tooltipBox: {
    position: 'absolute',
    top: -24,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  tooltipMonth: {
    color: '#93C5FD',
    fontSize: 9.5,
    fontWeight: '600',
  },
  tooltipCount: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  tooltipChange: {
    color: '#10B981',
    fontSize: 9,
    fontWeight: '600',
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisLabels: {
    height: 135,
    justifyContent: 'space-between',
    paddingRight: 6,
    width: 32,
    alignItems: 'flex-end',
  },
  yAxisText: {
    fontSize: 10,
    fontWeight: '500',
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingHorizontal: 8,
  },
  xLabelBtn: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  xAxisText: {
    fontSize: 10.5,
    fontWeight: '500',
  },
  xAxisTextActive: {
    fontWeight: '700',
  },
});
