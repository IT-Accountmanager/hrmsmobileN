import React from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginCurvedBackground: React.FC = () => {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* 1. Office Background Photo */}
      <Image
        source={require('../../../assets/login_bg.jpg')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />

      {/* 2. Soft Bright Overlay for crisp text & card contrast */}
      <LinearGradient
        colors={[
          'rgba(2, 132, 199, 0.45)', // Top blue blend
          'rgba(255, 255, 255, 0.35)', // Mid subtle office transparency
          'rgba(255, 255, 255, 0.92)', // Lower desk fade
          '#FFFFFF',                   // Bottom pure white
        ]}
        locations={[0, 0.35, 0.8, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* 3. Top Blue Curved Swooshes / Waves */}
      <View style={styles.wavesContainer}>
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT * 0.42}
          viewBox={`0 0 ${SCREEN_WIDTH} 320`}
          preserveAspectRatio="none"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            {/* Primary Deep Blue Gradient */}
            <SvgGradient id="deepBlueWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="1" />
              <Stop offset="50%" stopColor="#0369A1" stopOpacity="0.95" />
              <Stop offset="100%" stopColor="#075985" stopOpacity="0.9" />
            </SvgGradient>

            {/* Bright Cyan / Azure Wave */}
            <SvgGradient id="cyanWave" x1="0%" y1="0%" x2="100%" y2="80%">
              <Stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
              <Stop offset="60%" stopColor="#0284C7" stopOpacity="0.85" />
              <Stop offset="100%" stopColor="#0369A1" stopOpacity="0.8" />
            </SvgGradient>

            {/* Top Right Dark Arc */}
            <SvgGradient id="topRightArc" x1="50%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0284C7" stopOpacity="1" />
              <Stop offset="100%" stopColor="#0369A1" stopOpacity="1" />
            </SvgGradient>
          </Defs>

          {/* Background Top Fill */}
          <Path
            d={`M 0,0 L ${SCREEN_WIDTH},0 L ${SCREEN_WIDTH},140 C ${SCREEN_WIDTH * 0.75},120 ${SCREEN_WIDTH * 0.4},190 0,160 Z`}
            fill="url(#deepBlueWave)"
          />

          {/* Left Mid Dynamic Wave Swoop */}
          <Path
            d={`M 0,130 C ${SCREEN_WIDTH * 0.25},145 ${SCREEN_WIDTH * 0.3},210 0,250 Z`}
            fill="#0369A1"
            fillOpacity="0.85"
          />

          {/* Top Right Dramatic Deep Swoop */}
          <Path
            d={`M ${SCREEN_WIDTH * 0.45},0 C ${SCREEN_WIDTH * 0.65},70 ${SCREEN_WIDTH * 0.8},120 ${SCREEN_WIDTH},140 L ${SCREEN_WIDTH},0 Z`}
            fill="url(#topRightArc)"
          />

          {/* Foreground Cyan Smooth Wave Accent */}
          <Path
            d={`M 0,0 L ${SCREEN_WIDTH},0 L ${SCREEN_WIDTH},80 C ${SCREEN_WIDTH * 0.7},160 ${SCREEN_WIDTH * 0.35},120 0,180 Z`}
            fill="url(#cyanWave)"
          />

          {/* Translucent Highlight Curve */}
          <Path
            d={`M 0,175 C ${SCREEN_WIDTH * 0.3},125 ${SCREEN_WIDTH * 0.7},155 ${SCREEN_WIDTH},85 L ${SCREEN_WIDTH},95 C ${SCREEN_WIDTH * 0.7},165 ${SCREEN_WIDTH * 0.3},135 0,185 Z`}
            fill="#FFFFFF"
            fillOpacity="0.25"
          />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wavesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.42,
  },
});
