import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ModalSheet } from '../ui/ModalSheet';
import { Avatar } from '../ui/Avatar';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';
import { UserRole } from '../../types';
import { Check, Shield } from 'lucide-react-native';

const ROLES_LIST: {
  role: UserRole;
  title: string;
  badge: string;
  desc: string;
  avatar: string;
}[] = [
  {
    role: 'hr_admin',
    title: 'HR Administrator',
    badge: 'Full Admin',
    desc: 'Manage employees, leave approvals, attendance & company policies',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    role: 'manager',
    title: 'Engineering Manager',
    badge: 'Team Lead',
    desc: 'Team oversight, task approvals, project review & timesheets',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  },
  {
    role: 'employee',
    title: 'Employee (Self Service)',
    badge: 'Member',
    desc: 'Clock in/out, personal leaves, my tasks & payslips',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    role: 'payroll_admin',
    title: 'Payroll & Finance',
    badge: 'Finance Admin',
    desc: 'Salary computations, compensation slips, tax deductions',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
  },
  {
    role: 'saas_owner',
    title: 'SaaS Platform Owner',
    badge: 'Super Admin',
    desc: 'Multi-tenant metrics, enterprise billing, global organizations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

export const RoleSwitchModal: React.FC = () => {
  const {
    roleModalOpen,
    setRoleModalOpen,
    currentRole,
    currentUser,
    switchRole,
    isDarkMode,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);

  return (
    <ModalSheet
      visible={roleModalOpen}
      onClose={() => setRoleModalOpen(false)}
      title="Switch Role Persona"
      subtitle="Experience the app from any organizational perspective"
    >
      <View style={styles.container}>
        {/* Active Persona Banner */}
        <View
          style={[
            styles.currentBanner,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#EFF6FF',
              borderColor: isDarkMode ? '#334155' : '#DBEAFE',
            },
          ]}
        >
          <Avatar src={currentUser.avatar} name={currentUser.name} size="md" />
          <View style={styles.bannerTextCol}>
            <Text style={[styles.bannerName, { color: theme.text }]}>
              {currentUser.name}
            </Text>
            <Text style={[styles.bannerEmail, { color: theme.subtext }]}>
              {currentUser.email}
            </Text>
            <View style={styles.badgeRow}>
              <Shield size={11} color={colors.accentBlue} />
              <Text style={styles.badgeLabel}>{currentUser.designation || 'Staff'}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionHeading, { color: theme.muted }]}>
          AVAILABLE PERSONAS
        </Text>

        {ROLES_LIST.map((item) => {
          const isSelected = currentRole === item.role;
          return (
            <TouchableOpacity
              key={item.role}
              activeOpacity={0.7}
              onPress={() => switchRole(item.role)}
              style={[
                styles.roleCard,
                {
                  backgroundColor: isSelected
                    ? isDarkMode
                      ? 'rgba(37, 99, 235, 0.18)'
                      : '#EFF6FF'
                    : isDarkMode
                    ? colors.dark.card
                    : '#FFFFFF',
                  borderColor: isSelected
                    ? colors.accentBlue
                    : theme.border,
                },
              ]}
            >
              <Avatar src={item.avatar} name={item.title} size="sm" />

              <View style={styles.roleInfo}>
                <View style={styles.roleHeaderRow}>
                  <Text style={[styles.roleTitle, { color: theme.text }]}>
                    {item.title}
                  </Text>
                  <View
                    style={[
                      styles.roleTag,
                      {
                        backgroundColor: isSelected
                          ? colors.accentBlue
                          : isDarkMode
                          ? '#1E293B'
                          : '#F1F5F9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleTagText,
                        { color: isSelected ? '#FFFFFF' : theme.subtext },
                      ]}
                    >
                      {item.badge}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.roleDesc, { color: theme.muted }]} numberOfLines={2}>
                  {item.desc}
                </Text>
              </View>

              {isSelected ? (
                <View style={styles.checkCircle}>
                  <Check size={14} color="#FFFFFF" />
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
  },
  currentBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radii.xl,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  bannerName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  bannerEmail: {
    fontSize: typography.sizes.xs - 1,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  badgeLabel: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    color: colors.accentBlue,
    marginLeft: 4,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    marginBottom: 8,
  },
  roleInfo: {
    marginLeft: 10,
    flex: 1,
  },
  roleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {
    fontSize: typography.sizes.xs + 0.5,
    fontWeight: typography.weights.bold,
  },
  roleTag: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radii.sm,
  },
  roleTagText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  roleDesc: {
    fontSize: 10,
    marginTop: 2,
    lineHeight: 14,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});
