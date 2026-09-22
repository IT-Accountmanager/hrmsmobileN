import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface WaveHeaderBannerProps {
  height?: number;
}

export const WaveHeaderBanner: React.FC<WaveHeaderBannerProps> = ({ height = 140 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <LinearGradient
        colors={['#1D4ED8', '#2563EB', '#0284C7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Svg
        width={width}
        height={height}
        viewBox="0 0 400 140"
        preserveAspectRatio="none"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
            <Stop offset="50%" stopColor="#60A5FA" stopOpacity="0.2" />
            <Stop offset="100%" stopColor="#2563EB" stopOpacity="0.5" />
          </SvgGradient>
        </Defs>
        <Path
          d="M 0,40 C 100,10 220,70 400,30 L 400,140 L 0,140 Z"
          fill="url(#waveGrad)"
        />
        <Path
          d="M 0,80 C 120,110 260,40 400,90 L 400,140 L 0,140 Z"
          fill="#FFFFFF"
          fillOpacity="0.12"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
