import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Hrm3dLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Hrm3dLogo: React.FC<Hrm3dLogoProps> = ({ size = 'md' }) => {
  const dim = size === 'sm' ? 32 : size === 'lg' ? 52 : 40;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 18;
  const radius = size === 'sm' ? 10 : size === 'lg' ? 16 : 12;

  return (
    <LinearGradient
      colors={['#2563EB', '#1D4ED8', '#1E3A8A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.container,
        {
          width: dim,
          height: dim,
          borderRadius: radius,
        },
      ]}
    >
      <View style={styles.glossyOverlay} />
      <Text style={[styles.logoText, { fontSize }]}>✦</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  glossyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  logoText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textAlign: 'center',
  },
});
