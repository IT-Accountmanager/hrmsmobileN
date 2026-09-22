import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  CalendarCheck,
  CalendarClock,
  CalendarOff,
  PlaneTakeoff,
  Users,
  Building2,
  Briefcase,
  Layers,
  Network,
  CreditCard,
  Receipt,
  FileText,
  BadgeDollarSign,
  MessageSquare,
  Mail,
  CheckSquare,
  Megaphone,
  UserPlus,
  UserCheck,
  CalendarRange,
  Target,
  Award,
  GraduationCap,
  Wallet,
  FolderLock,
  Boxes,
  BarChart3,
  Settings,
  LogOut,
  Moon,
  Sun,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 340);

interface DrawerMenuProps {
  currentScreen: string;
  onNavigate: (screenKey: string) => void;
}

interface MenuItem {
  key: string;
  label: string;
  icon: any;
  roles?: string[];
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const DrawerMenu: React.FC<DrawerMenuProps> = ({
  currentScreen,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const {
    drawerOpen,
    setDrawerOpen,
    currentUser,
    currentRole,
    currentOrg,
    isDarkMode,
    toggleDarkMode,
    setRoleModalOpen,
    logout,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);

  const sections: MenuSection[] = [
    {
      title: 'OVERVIEW & TIME',
      items: [
        { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { key: 'ClockIn', label: 'Clock In / Out', icon: Clock },
        { key: 'Attendance', label: 'Attendance Logs', icon: CalendarDays },
        { key: 'Timesheets', label: 'Timesheets', icon: FileSpreadsheet },
        { key: 'Shifts', label: 'Shift Roster', icon: CalendarClock },
      ],
    },
    {
      title: 'LEAVE MANAGEMENT',
      items: [
        { key: 'Leaves', label: 'Leave Center', icon: PlaneTakeoff },
        { key: 'LeaveRequests', label: 'Leave Requests', icon: CalendarCheck },
        { key: 'LeaveBalance', label: 'Leave Balances', icon: CalendarOff },
        { key: 'Holidays', label: 'Holiday Calendar', icon: CalendarRange },
      ],
    },
    {
      title: 'PEOPLE & ORG',
      items: [
        { key: 'Employees', label: 'Employee Directory', icon: Users },
        { key: 'Departments', label: 'Departments', icon: Building2 },
        { key: 'Designations', label: 'Designations', icon: Briefcase },
        { key: 'TeamsPods', label: 'Teams & Pods', icon: Layers },
        { key: 'OrgStructure', label: 'Org Chart', icon: Network },
      ],
    },
    {
      title: 'PAYROLL & FINANCE',
      items: [
        { key: 'Payroll', label: 'Payroll Summary', icon: CreditCard },
        { key: 'Payslips', label: 'My Payslips', icon: Receipt },
        { key: 'SalaryStructure', label: 'Salary Structure', icon: FileText },
        { key: 'AdjustmentsClaims', label: 'Claims & Adjustments', icon: BadgeDollarSign },
      ],
    },
    {
      title: 'COMMUNICATION',
      items: [
        { key: 'Chat', label: 'Chat & Teams', icon: MessageSquare, badge: 'Live' },
        { key: 'Email', label: 'Corporate Mail', icon: Mail },
        { key: 'Tasks', label: 'Task Board', icon: CheckSquare },
        { key: 'Announcements', label: 'Announcements', icon: Megaphone },
      ],
    },
    {
      title: 'HIRING & TALENT',
      items: [
        { key: 'JobOpenings', label: 'Job Openings', icon: UserPlus },
        { key: 'Candidates', label: 'Candidates Pipeline', icon: UserCheck },
        { key: 'Interviews', label: 'Interviews', icon: CalendarRange },
      ],
    },
    {
      title: 'GROWTH & REVIEW',
      items: [
        { key: 'GoalsOkrs', label: 'Goals & OKRs', icon: Target },
        { key: 'PerformanceReviews', label: 'Reviews & Feedback', icon: Award },
        { key: 'Training', label: 'Learning & Courses', icon: GraduationCap },
      ],
    },
    {
      title: 'OPERATIONS & ASSETS',
      items: [
        { key: 'Expenses', label: 'Expense Reports', icon: Wallet },
        { key: 'Documents', label: 'Document Vault', icon: FolderLock },
        { key: 'Assets', label: 'Asset Management', icon: Boxes },
        { key: 'Analytics', label: 'HR Analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { key: 'Profile', label: 'My Profile', icon: Users },
        { key: 'Settings', label: 'Preferences & System', icon: Settings },
      ],
    },
  ];

  if (!drawerOpen) {
    return null;
  }

  const handleSelect = (key: string) => {
    setDrawerOpen(false);
    onNavigate(key);
  };

  return (
    <Modal
      visible={drawerOpen}
      transparent
      animationType="fade"
      onRequestClose={() => setDrawerOpen(false)}
    >
      <View style={styles.modalOverlay}>
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setDrawerOpen(false)}
        />

        {/* Drawer Content */}
        <View
          style={[
            styles.drawerPanel,
            {
              width: DRAWER_WIDTH,
              backgroundColor: theme.card,
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}
        >
          {/* Drawer Top Header */}
          <View
            style={[
              styles.drawerHeader,
              { borderBottomColor: theme.border },
            ]}
          >
            <View style={styles.userInfoRow}>
              <Avatar
                src={currentUser?.avatar}
                name={currentUser?.name || 'User'}
                size="lg"
              />
              <View style={styles.userDetails}>
                <Text
                  style={[
                    styles.userName,
                    { color: theme.text },
                  ]}
                  numberOfLines={1}
                >
                  {currentUser?.name || 'Employee'}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    { color: theme.subtext },
                  ]}
                  numberOfLines={1}
                >
                  {currentUser?.email || 'user@example.com'}
                </Text>
                <View style={styles.roleBadgeRow}>
                  <Badge variant="info" size="sm">
                    {(currentRole || 'employee').replace('_', ' ').toUpperCase()}
                  </Badge>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.closeBtn,
                  { backgroundColor: isDarkMode ? colors.dark.surface : colors.primary[50] },
                ]}
                onPress={() => setDrawerOpen(false)}
              >
                <X size={18} color={theme.subtext} />
              </TouchableOpacity>
            </View>

            {/* Quick Switch Role pill */}
            <TouchableOpacity
              style={[
                styles.switchRoleBar,
                {
                  backgroundColor: isDarkMode ? colors.dark.surface : colors.brand[50],
                  borderColor: theme.border,
                },
              ]}
              onPress={() => {
                setDrawerOpen(false);
                setRoleModalOpen(true);
              }}
            >
              <View style={styles.switchRoleLeft}>
                <Shield size={14} color={colors.brand[600]} />
                <Text
                  style={[
                    styles.switchRoleText,
                    { color: colors.brand[600] },
                  ]}
                >
                  Switch Role / Persona
                </Text>
              </View>
              <ChevronRight size={14} color={colors.brand[500]} />
            </TouchableOpacity>
          </View>

          {/* Navigation Items List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollList}
          >
            {sections.map((section, sIdx) => (
              <View key={section.title || sIdx} style={styles.sectionContainer}>
                <Text
                  style={[
                    styles.sectionHeading,
                    { color: theme.muted },
                  ]}
                >
                  {section.title}
                </Text>

                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.key;

                  return (
                    <TouchableOpacity
                      key={item.key}
                      style={[
                        styles.menuItem,
                        isActive && {
                          backgroundColor: isDarkMode
                            ? colors.dark.surface
                            : colors.brand[50],
                        },
                      ]}
                      onPress={() => handleSelect(item.key)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.menuItemLeft}>
                        <View
                          style={[
                            styles.iconWrapper,
                            isActive
                              ? { backgroundColor: colors.brand[600] }
                              : {
                                  backgroundColor: isDarkMode
                                    ? colors.dark.surface
                                    : colors.light.surface,
                                },
                          ]}
                        >
                          <Icon
                            size={16}
                            color={
                              isActive
                                ? '#FFFFFF'
                                : theme.subtext
                            }
                          />
                        </View>
                        <Text
                          style={[
                            styles.menuItemLabel,
                            {
                              color: isActive
                                ? colors.brand[600]
                                : theme.text,
                              fontWeight: isActive ? '700' : '500',
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>

                      {item.badge ? (
                        <Badge variant="success" size="sm">
                          {item.badge}
                        </Badge>
                      ) : isActive ? (
                        <View
                          style={[
                            styles.activeDot,
                            { backgroundColor: colors.brand[600] },
                          ]}
                        />
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          {/* Drawer Bottom Action Bar */}
          <View
            style={[
              styles.drawerFooter,
              { borderTopColor: theme.border },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.footerActionBtn,
                { backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface },
              ]}
              onPress={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun size={18} color="#FBBF24" />
              ) : (
                <Moon size={18} color={theme.subtext} />
              )}
              <Text
                style={[
                  styles.footerActionLabel,
                  { color: theme.text },
                ]}
              >
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.footerActionBtn, styles.logoutBtn]}
              onPress={async () => {
                setDrawerOpen(false);
                await logout();
              }}
            >
              <LogOut size={18} color={colors.danger[600]} />
              <Text
                style={[styles.footerActionLabel, { color: colors.danger[600] }]}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
  },
  drawerPanel: {
    flex: 1,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 20,
  },
  drawerHeader: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userDetails: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  userEmail: {
    fontSize: typography.sizes.xs,
    marginTop: 1,
  },
  roleBadgeRow: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchRoleBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    borderWidth: 1,
  },
  switchRoleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  switchRoleText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  scrollList: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 24,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.8,
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: radii.lg,
    marginBottom: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconWrapper: {
    width: 30,
    height: 30,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemLabel: {
    fontSize: typography.sizes.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  drawerFooter: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  footerActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: radii.lg,
    gap: 8,
  },
  footerActionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  logoutBtn: {
    backgroundColor: '#FEE2E2',
  },
});
