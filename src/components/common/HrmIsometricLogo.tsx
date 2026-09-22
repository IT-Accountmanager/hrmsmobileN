import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Polygon,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
  G,
  Circle,
} from 'react-native-svg';

interface HrmIsometricLogoProps {
  size?: number;
}

export const HrmIsometricLogo: React.FC<HrmIsometricLogoProps> = ({ size = 48 }) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 54 54">
        <Defs>
          {/* Top Face Gradient */}
          <SvgGradient id="topFaceGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#38BDF8" />
            <Stop offset="100%" stopColor="#93C5FD" />
          </SvgGradient>

          {/* Left Face Gradient */}
          <SvgGradient id="leftFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#2563EB" />
            <Stop offset="100%" stopColor="#1D4ED8" />
          </SvgGradient>

          {/* Right Face Gradient */}
          <SvgGradient id="rightFaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#1D4ED8" />
            <Stop offset="100%" stopColor="#1E3A8A" />
          </SvgGradient>

          {/* Ambient Glow */}
          <SvgGradient id="glowGrad" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#60A5FA" stopOpacity="0.4" />
            <Stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </SvgGradient>
        </Defs>

        <G>
          {/* Subtle Outer Glow */}
          <Circle cx="27" cy="27" r="26" fill="url(#glowGrad)" />

          {/* Outer Isometric Hexagon Cube */}
          {/* Top Face */}
          <Polygon
            points="27,6  47,17  27,28  7,17"
            fill="url(#topFaceGrad)"
          />

          {/* Left Face */}
          <Polygon
            points="7,17  27,28  27,48  7,37"
            fill="url(#leftFaceGrad)"
          />

          {/* Right Face */}
          <Polygon
            points="27,28  47,17  47,37  27,48"
            fill="url(#rightFaceGrad)"
          />

          {/* Inner 3D Floating White Diamond Cube */}
          {/* Inner Top Face */}
          <Polygon
            points="27,14  36,19.5  27,25  18,19.5"
            fill="#FFFFFF"
            fillOpacity="0.95"
          />

          {/* Inner Left Face */}
          <Polygon
            points="18,19.5  27,25  27,35  18,29.5"
            fill="#E0F2FE"
            fillOpacity="0.8"
          />

          {/* Inner Right Face */}
          <Polygon
            points="27,25  36,19.5  36,29.5  27,35"
            fill="#BAE6FD"
            fillOpacity="0.65"
          />
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
