import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { radii, typography, colors } from '../../theme';
import { useAppStore } from '../../store/useAppStore';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  style,
}) => {
  const { isDarkMode } = useAppStore();

  const getColors = () => {
    switch (variant) {
      case 'success':
        return {
          bg: isDarkMode ? 'rgba(16, 185, 129, 0.18)' : '#ECFDF5',
          text: '#059669',
          dot: '#10B981',
        };
      case 'warning':
        return {
          bg: isDarkMode ? 'rgba(245, 158, 11, 0.18)' : '#FFFBEB',
          text: '#D97706',
          dot: '#F59E0B',
        };
      case 'danger':
        return {
          bg: isDarkMode ? 'rgba(239, 68, 68, 0.18)' : '#FFF1F2',
          text: '#E11D48',
          dot: '#EF4444',
        };
      case 'purple':
        return {
          bg: isDarkMode ? 'rgba(168, 85, 247, 0.18)' : '#FAF5FF',
          text: '#7E22CE',
          dot: '#A855F7',
        };
      case 'neutral':
        return {
          bg: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : '#F1F5F9',
          text: isDarkMode ? '#CBD5E1' : '#475569',
          dot: '#94A3B8',
        };
      case 'info':
      default:
        return {
          bg: isDarkMode ? 'rgba(37, 99, 235, 0.18)' : '#EFF6FF',
          text: '#2563EB',
          dot: '#3B82F6',
        };
    }
  };

  const c = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: c.bg,
          paddingHorizontal: isSm ? 7 : 10,
          paddingVertical: isSm ? 2 : 3.5,
        },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: c.dot }]} /> : null}
      <Text
        style={[
          styles.text,
          {
            color: c.text,
            fontSize: isSm ? typography.sizes.xs - 1 : typography.sizes.xs,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  text: {
    fontWeight: typography.weights.bold,
  },
});
