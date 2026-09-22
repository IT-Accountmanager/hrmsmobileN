import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, TouchableOpacity } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'subtle';
  padding?: number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 16,
}) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const cardStyles: StyleProp<ViewStyle> = [
    styles.base,
    {
      backgroundColor: theme.card,
      borderColor: variant === 'subtle' ? theme.borderSubtle : theme.border,
      padding,
    },
    variant === 'elevated' ? theme.elevatedShadow : theme.cardShadow,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={cardStyles}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyles}>{children}</View>;
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
