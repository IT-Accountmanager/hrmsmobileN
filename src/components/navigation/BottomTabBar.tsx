import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Users,
  Menu,
} from 'lucide-react-native';

interface BottomTabBarProps {
  currentScreen: string;
  onNavigate: (screenKey: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode, setDrawerOpen, currentRole } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const isHrAdmin =
    currentRole === 'hr_admin' ||
    currentRole === 'hr_executive' ||
    currentRole === 'org_admin' ||
    currentRole === 'org_owner' ||
    currentRole === 'payroll_admin' ||
    currentRole === 'recruiter';

  const tabs = [
    { key: 'Dashboard', label: 'Home', icon: LayoutDashboard },
    { key: 'ClockIn', label: 'Clock In', icon: Clock },
    { key: 'Calendar', label: 'Calendar', icon: CalendarDays },
    { key: 'Employees', label: 'Team', icon: Users },
    { key: 'Menu', label: 'More', icon: Menu, isAction: true },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          backgroundColor: isDarkMode ? colors.dark.card : '#FFFFFF',
          borderTopColor: theme.border,
        },
      ]}
    >
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.key === 'Calendar'
              ? ['Attendance', 'Calendar'].includes(currentScreen)
              : currentScreen === tab.key;

          const handlePress = () => {
            if (tab.isAction) {
              setDrawerOpen(true);
            } else if (tab.key === 'Calendar') {
              // In HR Admin (and footer calendar navigation), open Attendance
              onNavigate('Attendance');
            } else {
              onNavigate(tab.key);
            }
          };

          return (
            <TouchableOpacity
              key={tab.key}
              activeOpacity={0.7}
              onPress={handlePress}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.iconWrap,
                  isActive && {
                    backgroundColor: isDarkMode
                      ? 'rgba(37, 99, 235, 0.2)'
                      : '#EFF6FF',
                  },
                ]}
              >
                <Icon
                  size={19}
                  color={isActive ? colors.accentBlue : theme.subtext}
                />
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.accentBlue : theme.subtext,
                    fontWeight: isActive
                      ? typography.weights.bold
                      : typography.weights.medium,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    paddingTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    flex: 1,
  },
  iconWrap: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
});
