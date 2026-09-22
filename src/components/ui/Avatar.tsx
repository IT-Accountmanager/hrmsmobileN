import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { radii, typography, colors } from '../../theme';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  shape?: 'circle' | 'curved';
  status?: 'online' | 'offline' | 'busy' | 'none';
  style?: StyleProp<ViewStyle>;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = 'User',
  size = 'md',
  shape = 'circle',
  status = 'none',
  style,
}) => {
  const [hasError, setHasError] = useState(false);

  const getDimension = () => {
    switch (size) {
      case 'xs':
        return 24;
      case 'sm':
        return 32;
      case 'lg':
        return 48;
      case 'xl':
        return 64;
      case '2xl':
        return 96;
      case 'md':
      default:
        return 40;
    }
  };

  const dim = getDimension();
  const borderRadius =
    shape === 'circle' ? dim / 2 : size === '2xl' ? 28 : radii.lg;

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return '#10B981';
      case 'busy':
        return '#EF4444';
      case 'offline':
        return '#94A3B8';
      default:
        return null;
    }
  };

  const statusColor = getStatusColor();

  return (
    <View style={[{ width: dim, height: dim }, style]}>
      {src && !hasError ? (
        <Image
          source={{ uri: src }}
          onError={() => setHasError(true)}
          style={[
            styles.image,
            { width: dim, height: dim, borderRadius },
          ]}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: dim, height: dim, borderRadius },
          ]}
        >
          <Text
            style={[
              styles.fallbackText,
              { fontSize: dim * 0.38 },
            ]}
          >
            {initials}
          </Text>
        </View>
      )}

      {statusColor ? (
        <View
          style={[
            styles.statusDot,
            {
              backgroundColor: statusColor,
              width: Math.max(8, dim * 0.22),
              height: Math.max(8, dim * 0.22),
              borderRadius: dim * 0.11,
            },
          ]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E2E8F0',
  },
  fallback: {
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: colors.primary[700],
    fontWeight: typography.weights.bold,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
