import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';
import {
  Menu,
  Search,
  Moon,
  Sun,
  Bell,
  X,
  User as UserIcon,
  FileText,
  Calendar,
  Mail,
  BarChart3,
  Building,
  Award,
  Users,
  Layers,
  Clock,
  Sparkles,
  CalendarCheck,
  ShieldCheck,
  DollarSign,
  CreditCard,
  Receipt,
  Briefcase,
  Video,
  Target,
  GraduationCap,
  Box,
} from 'lucide-react-native';

interface AppHeaderProps {
  onOpenDrawer?: () => void;
  onOpenNotifications?: () => void;
  onOpenRoleModal?: () => void;
  onNavigate?: (screenKey: string) => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenDrawer,
  onOpenNotifications,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const {
    isDarkMode,
    toggleDarkMode,
    notifications,
    setDrawerOpen,
    setNotificationsModalOpen,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = 3; // As shown in screenshot badge '3'

  const SEARCH_RESULTS = [
    { title: 'Leave Management & Quotas', category: 'Leave', dept: '18 Days Available • 12 Requests', icon: Calendar, screen: 'Leaves' },
    { title: 'Leave Requests Queue', category: 'Leave', dept: '3 Pending Approvals', icon: FileText, screen: 'LeaveRequests' },
    { title: 'Leave Quotas & Balances', category: 'Leave', dept: 'Annual, Sick, Casual PTO', icon: ShieldCheck, screen: 'LeaveBalance' },
    { title: 'Company Holiday Calendar', category: 'Leave', dept: 'Memorial Day, Public Holidays', icon: CalendarCheck, screen: 'Holidays' },
    { title: 'Attendance Calendar & Records', category: 'Attendance', dept: 'Daily Logs & 90% Rate', icon: CalendarCheck, screen: 'Attendance' },
    { title: 'Timesheets & Working Hours', category: 'Attendance', dept: 'Weekly Hours & Overtime', icon: Clock, screen: 'Timesheets' },
    { title: 'Shift Management & Work Schedules', category: 'Attendance', dept: 'General, Morning, Evening', icon: Sparkles, screen: 'Shifts' },
    { title: 'Clock In / Out (Live Geo-Punch)', category: 'Attendance', dept: 'Camera & Live Shift Timer', icon: Clock, screen: 'ClockIn' },
    { title: 'Departments & Headcount', category: 'People', dept: '6 Departments • Organization', icon: Building, screen: 'Departments' },
    { title: 'Designations & Job Titles', category: 'People', dept: 'L1 - L7 Band Structure', icon: Award, screen: 'Designations' },
    { title: 'Teams & Pods (Squads & OKRs)', category: 'People', dept: '6 Active Teams • View Roster', icon: Users, screen: 'TeamsPods' },
    { title: 'Organization Hierarchy Chart', category: 'People', dept: 'CEO & VP Reporting Tree', icon: Layers, screen: 'OrgStructure' },
    { title: 'Employee Directory', category: 'People', dept: 'Rahul, Priya, Amit, Neha...', icon: UserIcon, screen: 'Employees' },
    { title: 'General Standup & Architecture', category: 'Chat & Teams', dept: 'Collaboration', icon: UserIcon, screen: 'Chat' },
    { title: 'Chat & Teams Collaboration', category: 'Module', dept: 'Meetings & Video Calls', icon: UserIcon, screen: 'Chat' },
    { title: 'Email & Mailbox (Outlook Exchange)', category: 'Module', dept: 'Communications', icon: Mail, screen: 'Email' },
    { title: 'Reports & Workforce Analytics', category: 'Module', dept: 'Business Intelligence', icon: BarChart3, screen: 'Analytics' },
    { title: 'Calendar & Meeting Scheduler', category: 'Chat & Teams', dept: 'Team Sync & Calls', icon: Calendar, screen: 'Calendar' },
    { title: 'James Miller', category: 'Employee', dept: 'Marketing', icon: UserIcon, screen: 'Employees' },
    { title: 'Sophia Davis', category: 'Employee', dept: 'Engineering', icon: UserIcon, screen: 'Employees' },
    { title: 'Tax Exemption W-4 Form', category: 'Compliance Doc', dept: 'James Miller', icon: FileText, screen: 'Documents' },
    { title: 'Payroll & Compensation Engine', category: 'Payroll', dept: '$248,650 Disbursed • May 2024', icon: DollarSign, screen: 'Payroll' },
    { title: 'Salary Structure & Compensation Bands', category: 'Payroll', dept: 'L1 - L7 Bands • Basic, HRA, PF', icon: CreditCard, screen: 'SalaryStructure' },
    { title: 'Employee Payslips Archive', category: 'Payroll', dept: 'PDF Salary Slips & Records', icon: FileText, screen: 'Payslips' },
    { title: 'Salary Adjustments & Claims', category: 'Payroll', dept: 'Overtime, Spot Bonus & Deductions', icon: Receipt, screen: 'AdjustmentsClaims' },
    { title: 'Job Openings & Requisitions', category: 'Recruitment', dept: '4 Active Positions • Hiring Requisitions', icon: Briefcase, screen: 'JobOpenings' },
    { title: 'Talent Pipeline & ATS Kanban Board', category: 'Recruitment', dept: '4 Active Applicants • Candidate Funnel', icon: Users, screen: 'Candidates' },
    { title: 'Scheduled Interviews Calendar', category: 'Recruitment', dept: 'Video Evaluation & Interview Panel', icon: Video, screen: 'Interviews' },
    { title: 'Leave Allocation Review', category: 'Governance', dept: 'HR Control', icon: Calendar, screen: 'Leaves' },
    { title: 'Performance, OKRs & Appraisals', category: 'Performance', dept: 'Objectives & Key Results Leaderboard', icon: Target, screen: 'GoalsOkrs' },
    { title: '360° Performance Reviews', category: 'Performance', dept: 'Bi-annual Appraisals & Peer Ratings', icon: BarChart3, screen: 'PerformanceReviews' },
    { title: 'Expense Claims & Reimbursements', category: 'Operations', dept: 'Business Expenses, Travel & Meals', icon: Receipt, screen: 'Expenses' },
    { title: 'My Assets & Hardware', category: 'Operations', dept: 'Laptops, Monitors, Mobile & Accessories', icon: Box, screen: 'Assets' },
    { title: 'My Documents & Compliance Records', category: 'Operations', dept: 'Aadhaar, PAN, Experience Letters', icon: FileText, screen: 'Documents' },
    { title: 'LMS & Training Academy', category: 'Operations', dept: 'React 19, SOC2 Compliance, Product Mgmt', icon: GraduationCap, screen: 'Training' },
    { title: 'William Brown', category: 'Employee', dept: 'Sales', icon: UserIcon, screen: 'Employees' },
  ];

  const filteredResults = searchQuery.trim()
    ? SEARCH_RESULTS.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : SEARCH_RESULTS;

  const handleSelectResult = (screenKey: string) => {
    setSearchModalOpen(false);
    setSearchQuery('');
    if (onNavigate) {
      onNavigate(screenKey);
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 12),
          backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF',
          borderBottomColor: isDarkMode ? '#1E293B' : '#F1F5F9',
        },
      ]}
    >
      <View style={styles.contentRow}>
        {/* Left: Hamburger Icon */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onOpenDrawer || (() => setDrawerOpen(true))}
          style={styles.menuBtn}
        >
          <Menu size={22} color={isDarkMode ? '#CBD5E1' : '#475569'} />
        </TouchableOpacity>

        {/* Center: Search Bar with Ctrl + K */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSearchModalOpen(true)}
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Search size={15} color="#94A3B8" style={styles.searchIcon} />
          <Text
            style={[
              styles.searchPlaceholder,
              { color: isDarkMode ? '#64748B' : '#94A3B8' },
            ]}
            numberOfLines={1}
          >
            Search anything... (emplo...
          </Text>

        </TouchableOpacity>

        {/* Right Section: Moon Theme Toggle + Bell Notification Badge */}
        <View style={styles.rightSection}>
          {/* Theme Toggle Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleDarkMode}
            style={[
              styles.circularBtn,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {isDarkMode ? (
              <Sun size={17} color="#FBBF24" />
            ) : (
              <Moon size={17} color="#475569" />
            )}
          </TouchableOpacity>

          {/* Notifications Button with Red Badge 3 */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onOpenNotifications || (() => setNotificationsModalOpen(true))}
            style={[
              styles.circularBtn,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Bell size={17} color={isDarkMode ? '#CBD5E1' : '#475569'} />
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Interactive Quick Search Modal (Ctrl + K) */}
      <Modal
        visible={searchModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSearchModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.searchModalContent,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {/* Modal Search Input */}
            <View style={styles.modalSearchHeader}>
              <Search size={18} color="#94A3B8" />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search employees, leaves, documents..."
                placeholderTextColor="#94A3B8"
                style={[
                  styles.modalSearchInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              />
              <TouchableOpacity
                onPress={() => setSearchModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Results List */}
            <ScrollView style={styles.resultsList} keyboardShouldPersistTaps="handled">
              <Text style={styles.resultsHeader}>
                {searchQuery ? 'Matching Resources' : 'Quick Recommendations'}
              </Text>
              {filteredResults.map((res, i) => {
                const IconComp = res.icon;
                return (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.7}
                    onPress={() => handleSelectResult(res.screen)}
                    style={[
                      styles.resultItem,
                      {
                        backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                        borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    <View style={styles.resultIconBox}>
                      <IconComp size={16} color="#2563EB" />
                    </View>
                    <View style={styles.resultInfo}>
                      <Text
                        style={[
                          styles.resultTitle,
                          { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                        ]}
                      >
                        {res.title}
                      </Text>
                      <Text style={styles.resultSubtitle}>
                        {res.category} • {res.dept}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    zIndex: 10,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  menuBtn: {
    padding: 4,
    marginRight: 4,
  },
  searchBar: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
  },
  shortcutBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  shortcutText: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#64748B',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 4,
  },
  circularBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  unreadBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 16,
  },
  searchModalContent: {
    width: '100%',
    maxHeight: 420,
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
  },
  modalSearchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  resultsList: {
    marginTop: 10,
  },
  resultsHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 6,
    gap: 10,
  },
  resultIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 13,
    fontWeight: '600',
  },
  resultSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
});
