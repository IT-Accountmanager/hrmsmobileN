import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppStore } from '../store/useAppStore';
import { getThemeColors } from '../theme';

// Navigation Shell Components
import { AppHeader } from '../components/navigation/AppHeader';
import { DrawerMenu } from '../components/navigation/DrawerMenu';
import { BottomTabBar } from '../components/navigation/BottomTabBar';
import { RoleSwitchModal } from '../components/navigation/RoleSwitchModal';
import { NotificationsModal } from '../components/navigation/NotificationsModal';
import { ApplyLeaveModal } from '../screens/leave/ApplyLeaveModal';

// Screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { ClockInScreen } from '../screens/attendance/ClockInScreen';
import { AttendanceScreen } from '../screens/attendance/AttendanceScreen';
import { TimesheetsScreen } from '../screens/attendance/TimesheetsScreen';
import { ShiftsScreen } from '../screens/attendance/ShiftsScreen';
import { LeaveManagementScreen } from '../screens/leave/LeaveManagementScreen';
import { LeaveRequestsScreen } from '../screens/leave/LeaveRequestsScreen';
import { LeaveBalanceScreen } from '../screens/leave/LeaveBalanceScreen';
import { HolidaysScreen } from '../screens/leave/HolidaysScreen';
import { EmployeesListScreen } from '../screens/employees/EmployeesListScreen';
import { EmployeeProfileScreen } from '../screens/employees/EmployeeProfileScreen';
import { PayrollDashboardScreen } from '../screens/payroll/PayrollDashboardScreen';
import { SalaryStructureScreen } from '../screens/payroll/SalaryStructureScreen';
import { PayslipsScreen } from '../screens/payroll/PayslipsScreen';
import { AdjustmentsClaimsScreen } from '../screens/payroll/AdjustmentsClaimsScreen';
import { ExpensesScreen } from '../screens/operations/ExpensesScreen';
import { DocumentsScreen } from '../screens/operations/DocumentsScreen';
import { AssetsScreen } from '../screens/operations/AssetsScreen';
import { TasksScreen } from '../screens/company/TasksScreen';
import { AnnouncementsScreen } from '../screens/company/AnnouncementsScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ChatTeamsScreen } from '../screens/chat/ChatTeamsScreen';
import { EmailScreen } from '../screens/email/EmailScreen';
import { AnalyticsScreen } from '../screens/analytics/AnalyticsScreen';
import { DepartmentsScreen } from '../screens/company/DepartmentsScreen';
import { DesignationsScreen } from '../screens/company/DesignationsScreen';
import { TeamsPodsScreen } from '../screens/company/TeamsPodsScreen';
import { OrgStructureScreen } from '../screens/company/OrgStructureScreen';
import { JobOpeningsScreen } from '../screens/recruitment/JobOpeningsScreen';
import { CandidatesScreen } from '../screens/recruitment/CandidatesScreen';
import { InterviewsScreen } from '../screens/recruitment/InterviewsScreen';
import { GoalsOkrsScreen } from '../screens/performance/GoalsOkrsScreen';
import { PerformanceReviewsScreen } from '../screens/performance/PerformanceReviewsScreen';
import { TrainingScreen } from '../screens/operations/TrainingScreen';

export const AppNavigator: React.FC = () => {
  const {
    isAuthenticated,
    isDarkMode,
    isClockedIn,
    tickClockTimer,
    initialize,
    currentRole,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);
  const [currentScreen, setCurrentScreen] = useState<string>('Dashboard');
  const [globalApplyLeaveOpen, setGlobalApplyLeaveOpen] = useState(false);

  // Initialize store and timer ticker
  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    let interval: any = null;
    if (isClockedIn) {
      interval = setInterval(() => {
        tickClockTimer();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClockedIn, tickClockTimer]);

  if (!isAuthenticated) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
        <LoginScreen />
      </SafeAreaProvider>
    );
  }

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'Attendance':
        return <AttendanceScreen onNavigate={setCurrentScreen} />;
      case 'ClockIn':
        return <ClockInScreen onNavigate={setCurrentScreen} />;
      case 'Timesheets':
        return <TimesheetsScreen onNavigate={setCurrentScreen} />;
      case 'Shifts':
        return <ShiftsScreen onNavigate={setCurrentScreen} />;
      case 'Leaves':
        return <LeaveManagementScreen onNavigate={setCurrentScreen} />;
      case 'LeaveRequests':
        return <LeaveRequestsScreen onNavigate={setCurrentScreen} />;
      case 'LeaveBalance':
        return <LeaveBalanceScreen onNavigate={setCurrentScreen} />;
      case 'Holidays':
        return <HolidaysScreen onNavigate={setCurrentScreen} />;
      case 'Employees':
        return <EmployeesListScreen onNavigate={setCurrentScreen} />;
      case 'Profile':
        return <EmployeeProfileScreen />;
      case 'Payroll':
        return <PayrollDashboardScreen onNavigate={setCurrentScreen} />;
      case 'SalaryStructure':
        return <SalaryStructureScreen onNavigate={setCurrentScreen} />;
      case 'Payslips':
        return <PayslipsScreen />;
      case 'AdjustmentsClaims':
        return <AdjustmentsClaimsScreen onNavigate={setCurrentScreen} />;
      case 'Expenses':
        return <ExpensesScreen onNavigate={setCurrentScreen} />;
      case 'Documents':
        return <DocumentsScreen onNavigate={setCurrentScreen} />;
      case 'Assets':
        return <AssetsScreen onNavigate={setCurrentScreen} />;
      case 'GoalsOkrs':
        return <GoalsOkrsScreen onNavigate={setCurrentScreen} />;
      case 'PerformanceReviews':
        return <PerformanceReviewsScreen onNavigate={setCurrentScreen} />;
      case 'Training':
        return <TrainingScreen onNavigate={setCurrentScreen} />;
      case 'Tasks':
        return <TasksScreen />;
      case 'Announcements':
        return <AnnouncementsScreen />;
      case 'Settings':
        return <SettingsScreen onNavigate={setCurrentScreen} />;
      case 'Chat':
      case 'Teams':
        return <ChatTeamsScreen onNavigate={setCurrentScreen} />;
      case 'Calendar':
        if (
          currentRole === 'hr_admin' ||
          currentRole === 'hr_executive' ||
          currentRole === 'org_admin' ||
          currentRole === 'org_owner' ||
          currentRole === 'payroll_admin' ||
          currentRole === 'recruiter'
        ) {
          return <AttendanceScreen onNavigate={setCurrentScreen} />;
        }
        return <ChatTeamsScreen onNavigate={setCurrentScreen} />;
      case 'Email':
        return <EmailScreen onNavigate={setCurrentScreen} />;
      case 'Analytics':
        return <AnalyticsScreen onNavigate={setCurrentScreen} />;
      case 'Departments':
        return <DepartmentsScreen onNavigate={setCurrentScreen} />;
      case 'Designations':
        return <DesignationsScreen onNavigate={setCurrentScreen} />;
      case 'TeamsPods':
        return <TeamsPodsScreen onNavigate={setCurrentScreen} />;
      case 'OrgStructure':
        return <OrgStructureScreen onNavigate={setCurrentScreen} />;
      case 'JobOpenings':
        return <JobOpeningsScreen onNavigate={setCurrentScreen} />;
      case 'Candidates':
        return <CandidatesScreen onNavigate={setCurrentScreen} />;
      case 'Interviews':
        return <InterviewsScreen onNavigate={setCurrentScreen} />;
      case 'Dashboard':
      default:
        return (
          <DashboardScreen
            onNavigate={setCurrentScreen}
            onOpenApplyLeave={() => setGlobalApplyLeaveOpen(true)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#0F172A' : '#FFFFFF'}
      />
      <View style={[styles.mainLayout, { backgroundColor: theme.bg }]}>
        {/* Top Header */}
        <AppHeader onNavigate={setCurrentScreen} />

        {/* Active Screen View */}
        <View style={styles.screenContainer}>{renderActiveScreen()}</View>

        {/* Bottom Navigation Bar */}
        <BottomTabBar
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />

        {/* Slide-out Drawer Menu */}
        <DrawerMenu
          currentScreen={currentScreen}
          onNavigate={setCurrentScreen}
        />

        {/* Role Switcher Modal */}
        <RoleSwitchModal />

        {/* Notifications Modal */}
        <NotificationsModal />

        {/* Global Apply Leave Modal */}
        <ApplyLeaveModal
          visible={globalApplyLeaveOpen}
          onClose={() => setGlobalApplyLeaveOpen(false)}
        />
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
});
