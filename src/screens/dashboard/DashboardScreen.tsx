import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { EmployeeDashboardView } from './views/EmployeeDashboardView';
import { HrAdminDashboardView } from './views/HrAdminDashboardView';
import { ManagerDashboardView } from './views/ManagerDashboardView';
import { SaasOwnerDashboardView } from './views/SaasOwnerDashboardView';

interface DashboardScreenProps {
  onNavigate: (screenKey: string) => void;
  onOpenApplyLeave: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigate,
  onOpenApplyLeave,
}) => {
  const { currentRole } = useAppStore();

  const renderRoleDashboard = () => {
    switch (currentRole) {
      case 'saas_owner':
        return (
          <SaasOwnerDashboardView
            onNavigate={onNavigate}
            onOpenApplyLeave={onOpenApplyLeave}
          />
        );
      case 'manager':
        return (
          <ManagerDashboardView
            onNavigate={onNavigate}
            onOpenApplyLeave={onOpenApplyLeave}
          />
        );
      case 'hr_admin':
      case 'hr_executive':
      case 'org_admin':
      case 'org_owner':
      case 'payroll_admin':
      case 'recruiter':
        return (
          <HrAdminDashboardView
            onNavigate={onNavigate}
            onOpenApplyLeave={onOpenApplyLeave}
          />
        );
      case 'employee':
      default:
        return (
          <EmployeeDashboardView
            onNavigate={onNavigate}
            onOpenApplyLeave={onOpenApplyLeave}
          />
        );
    }
  };

  if (
    currentRole === 'hr_admin' ||
    currentRole === 'hr_executive' ||
    currentRole === 'org_admin' ||
    currentRole === 'org_owner' ||
    currentRole === 'payroll_admin' ||
    currentRole === 'recruiter'
  ) {
    return (
      <HrAdminDashboardView
        onNavigate={onNavigate}
        onOpenApplyLeave={onOpenApplyLeave}
      />
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {renderRoleDashboard()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 14,
  },
});
