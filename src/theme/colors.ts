/**
 * Exact Design Tokens cloned 1:1 from the HRMS Web Application
 * Source: tailwind.config.js & index.css
 */

export const colors = {
  // Brand Indigo Palette
  brand: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1',
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
    950: '#1E1B4B',
  },

  // Primary Action Blue Palette
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554',
  },

  // Signature Hero Blue from Web Login & Header
  accentBlue: '#1D68FE',

  // Sidebar Palette
  sidebar: {
    bg: '#0F172A',
    hover: '#1E293B',
    active: '#2563EB',
    text: '#94A3B8',
    textActive: '#FFFFFF',
    border: '#1E293B',
  },

  // Dark Mode Surface Palette
  dark: {
    bg: '#0B1120',
    card: '#0F172A',
    surface: '#1E293B',
    border: '#334155',
    borderSubtle: '#1E293B',
    muted: '#94A3B8',
    text: '#F8FAFC',
    subtext: '#94A3B8',
  },

  // Light Mode Surface Palette
  light: {
    bg: '#F4F7FC',
    card: '#FFFFFF',
    surface: '#F8FAFC',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    muted: '#64748B',
    text: '#0F172A',
    subtext: '#64748B',
  },

  // Semantic Status Colors
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
  },
  danger: {
    50: '#FFF1F2',
    100: '#FFE4E6',
    500: '#EF4444',
    600: '#E11D48',
    700: '#BE123C',
  },
  purple: {
    50: '#FAF5FF',
    100: '#F3E8FF',
    500: '#A855F7',
    600: '#9333EA',
    700: '#7E22CE',
  },
  cyan: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    500: '#06B6D4',
    600: '#0891B2',
  },
};

export const getThemeColors = (isDark: boolean) => ({
  bg: isDark ? colors.dark.bg : colors.light.bg,
  card: isDark ? colors.dark.card : colors.light.card,
  surface: isDark ? colors.dark.surface : colors.light.surface,
  border: isDark ? colors.dark.border : colors.light.border,
  borderSubtle: isDark ? colors.dark.borderSubtle : colors.light.borderSubtle,
  text: isDark ? colors.dark.text : colors.light.text,
  subtext: isDark ? colors.dark.subtext : colors.light.subtext,
  muted: isDark ? colors.dark.muted : colors.light.muted,
  primary: colors.primary[600],
  primaryLight: isDark ? 'rgba(37, 99, 235, 0.2)' : colors.primary[50],
  brand: colors.brand[500],
  accentBlue: colors.accentBlue,
  cardShadow: isDark
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 3,
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      },
  elevatedShadow: isDark
    ? {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
      }
    : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 6,
      },
});
