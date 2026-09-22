import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  Circle,
  Line,
  G,
} from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DATA_POINTS = [
  { label: 'May 20', value: 155, x: 16, y: 68 },
  { label: 'May 21', value: 178, x: 64, y: 54 },
  { label: 'May 22', value: 164, x: 114, y: 62 },
  { label: 'May 23', value: 240, x: 164, y: 20 },
  { label: 'May 24', value: 216, x: 214, y: 34 },
  { label: 'May 25', value: 175, x: 260, y: 56 },
  { label: 'May 26', value: 236, x: 306, y: 22 },
];

export const AttendanceTrendChart: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<(typeof DATA_POINTS)[3]>(DATA_POINTS[3]);
  const chartWidth = Math.min(SCREEN_WIDTH - 60, 320);
  const scale = chartWidth / 320;

  // Cubic Bezier spline through points
  const linePath = `
    M 16,68
    C 38,68 44,54 64,54
    C 84,54 94,62 114,62
    C 134,62 144,20 164,20
    C 184,20 196,34 214,34
    C 232,34 244,56 260,56
    C 278,56 292,22 306,22
  `;

  const areaPath = `
    ${linePath}
    L 306,140
    L 16,140
    Z
  `;

  return (
    <View style={styles.container}>
      {/* Interactive Tooltip Callout */}
      {selectedPoint && (
        <View style={[styles.tooltip, { left: Math.max(10, Math.min(selectedPoint.x * scale - 40, chartWidth - 80)) }]}>
          <Text style={styles.tooltipDate}>{selectedPoint.label}</Text>
          <Text style={styles.tooltipValue}>{selectedPoint.value} Present</Text>
        </View>
      )}

      <View style={styles.chartRow}>
        {/* Y Axis Labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>250</Text>
          <Text style={styles.axisLabel}>130</Text>
          <Text style={styles.axisLabel}>65</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>

        {/* SVG Plot */}
        <View style={{ width: chartWidth, height: 160 }}>
          <Svg width={chartWidth} height={150} viewBox="0 0 320 150">
            <Defs>
              <SvgGradient id="attendGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#3B82F6" stopOpacity="0.32" />
                <Stop offset="70%" stopColor="#93C5FD" stopOpacity="0.1" />
                <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </SvgGradient>
            </Defs>

            {/* Dashed Grid Lines */}
            <Line x1="0" y1="20" x2="320" y2="20" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3, 3" />
            <Line x1="0" y1="62" x2="320" y2="62" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3, 3" />
            <Line x1="0" y1="102" x2="320" y2="102" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="3, 3" />
            <Line x1="0" y1="140" x2="320" y2="140" stroke="#CBD5E1" strokeWidth="1" strokeDasharray="3, 3" />

            {/* Area Fill */}
            <Path d={areaPath} fill="url(#attendGrad)" />

            {/* Main Trend Line */}
            <Path
              d={linePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Data Dots */}
            {DATA_POINTS.map((pt, idx) => {
              const isSelected = selectedPoint?.label === pt.label;
              return (
                <G key={idx}>
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4.5}
                    fill={isSelected ? '#1D4ED8' : '#2563EB'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.5 : 1.8}
                  />
                </G>
              );
            })}
          </Svg>

          {/* Transparent touch targets over dots */}
          <View style={[StyleSheet.absoluteFill, styles.touchOverlay]}>
            {DATA_POINTS.map((pt, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => setSelectedPoint(pt)}
                style={[
                  styles.touchTarget,
                  { left: pt.x * scale - 16, top: pt.y - 16 },
                ]}
              />
            ))}
          </View>
        </View>
      </View>

      {/* X Axis Date Labels */}
      <View style={[styles.xAxis, { width: chartWidth, marginLeft: 26 }]}>
        {DATA_POINTS.map((pt, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => setSelectedPoint(pt)}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
          >
            <Text
              style={[
                styles.xAxisLabel,
                selectedPoint?.label === pt.label && styles.xAxisLabelActive,
              ]}
            >
              {pt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 8,
  },
  tooltip: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  tooltipDate: {
    color: '#94A3B8',
    fontSize: 9.5,
    fontWeight: '500',
  },
  tooltipValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxis: {
    width: 26,
    height: 140,
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'right',
    paddingRight: 4,
  },
  touchOverlay: {
    pointerEvents: 'box-none',
  },
  touchTarget: {
    position: 'absolute',
    width: 32,
    height: 32,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingRight: 6,
  },
  xAxisLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
  },
  xAxisLabelActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
