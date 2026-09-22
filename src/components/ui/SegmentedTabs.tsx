import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface SegmentedTabsProps<T extends string = string> {
  tabs: TabItem<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  style?: StyleProp<ViewStyle>;
}

export const SegmentedTabs = <T extends string>({
  tabs,
  activeTab,
  onChange,
  style,
}: SegmentedTabsProps<T>) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
          borderColor: theme.borderSubtle,
        },
        style,
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => onChange(tab.id)}
            style={[
              styles.tab,
              isActive && [
                styles.activeTab,
                {
                  backgroundColor: isDarkMode ? colors.dark.card : '#FFFFFF',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: isDarkMode ? 0.3 : 0.08,
                  shadowRadius: 4,
                  elevation: 2,
                },
              ],
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isActive
                    ? colors.accentBlue
                    : theme.subtext,
                  fontWeight: isActive
                    ? typography.weights.bold
                    : typography.weights.semibold,
                },
              ]}
            >
              {tab.label}
            </Text>

            {tab.badge !== undefined ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isActive ? colors.accentBlue : theme.muted,
                  },
                ]}
              >
                <Text style={styles.badgeText}>{tab.badge}</Text>
              </View>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radii.xl,
    padding: 3,
    borderWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radii.lg,
  },
  activeTab: {
    borderRadius: radii.lg,
  },
  tabText: {
    fontSize: typography.sizes.xs,
  },
  badge: {
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: radii.full,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
});
