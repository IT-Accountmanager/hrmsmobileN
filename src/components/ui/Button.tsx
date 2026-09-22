import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
  View,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const getVariantStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          btn: {
            backgroundColor: isDarkMode ? colors.dark.surface : '#F1F5F9',
            borderColor: theme.border,
            borderWidth: 1,
          },
          text: { color: theme.text },
        };
      case 'danger':
        return {
          btn: {
            backgroundColor: colors.danger[500],
            shadowColor: colors.danger[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          },
          text: { color: '#FFFFFF' },
        };
      case 'success':
        return {
          btn: {
            backgroundColor: colors.success[500],
            shadowColor: colors.success[500],
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          },
          text: { color: '#FFFFFF' },
        };
      case 'outline':
        return {
          btn: {
            backgroundColor: 'transparent',
            borderColor: colors.primary[600],
            borderWidth: 1.5,
          },
          text: { color: colors.primary[600] },
        };
      case 'primary':
      default:
        return {
          btn: {
            backgroundColor: colors.accentBlue,
            shadowColor: colors.accentBlue,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          },
          text: { color: '#FFFFFF' },
        };
    }
  };

  const getSizeStyles = (): { btn: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          btn: { height: 36, paddingHorizontal: 12, borderRadius: radii.md },
          text: { fontSize: typography.sizes.sm, fontWeight: typography.weights.bold },
        };
      case 'lg':
        return {
          btn: { height: 50, paddingHorizontal: 20, borderRadius: radii.lg },
          text: { fontSize: typography.sizes.md, fontWeight: typography.weights.bold },
        };
      case 'md':
      default:
        return {
          btn: { height: 44, paddingHorizontal: 16, borderRadius: radii.lg },
          text: { fontSize: typography.sizes.base, fontWeight: typography.weights.bold },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        vStyles.btn,
        sStyles.btn,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'secondary' || variant === 'outline' ? colors.primary[600] : '#FFFFFF'}
        />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
          <Text style={[vStyles.text, sStyles.text, textStyle]}>{title}</Text>
          {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});
