import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatCard } from '../../../components/ui/StatCard';
import { Avatar } from '../../../components/ui/Avatar';
import { Badge } from '../../../components/ui/Badge';
import { useAppStore } from '../../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../../theme';
import {
  Clock,
  Calendar,
  FileText,
  CheckSquare,
  Palmtree,
  Play,
  Square,
  ShoppingBag,
  UploadCloud,
  User,
  Gift,
  Megaphone,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

interface EmployeeDashboardViewProps {
  onNavigate: (screenKey: string) => void;
  onOpenApplyLeave: () => void;
}

export const EmployeeDashboardView: React.FC<EmployeeDashboardViewProps> = ({
  onNavigate,
  onOpenApplyLeave,
}) => {
  const {
    currentUser,
    isDarkMode,
    isClockedIn,
    clockInTime,
    secondsElapsed,
    setClockInState,
    notifications,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);

  // Live Timer Formatter
  const formatTimerHMS = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedPunchInTime = clockInTime
    ? new Date(clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    : '09:15 AM';

  const handlePunchToggle = () => {
    if (isClockedIn) {
      setClockInState(false);
    } else {
      setClockInState(true, new Date().toISOString());
    }
  };

  // Interactive Checklist Tasks
  const [tasks, setTasks] = useState([
    { id: 1, text: 'Complete performance self-review', dueDate: 'May 22', priority: 'High', completed: false },
    { id: 2, text: 'Submit April travel expense report', dueDate: 'May 24', priority: 'Medium', completed: false },
    { id: 3, text: 'Update personal emergency contact', dueDate: 'May 28', priority: 'Low', completed: false },
  ]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const quickActions = [
    { label: 'Clock In/Out', icon: Clock, action: () => onNavigate('ClockIn') },
    { label: 'Apply Leave', icon: Calendar, action: onOpenApplyLeave },
    { label: 'View Payslip', icon: FileText, action: () => onNavigate('Payslips') },
    { label: 'Submit Expense', icon: ShoppingBag, action: () => onNavigate('Expenses') },
    { label: 'Upload Doc', icon: UploadCloud, action: () => onNavigate('Documents') },
    { label: 'My Profile', icon: User, action: () => onNavigate('Profile') },
  ];

  return (
    <View style={styles.container}>
      {/* =========================================================================
          HERO IDENTITY CARD: LEFT PHOTO + GREETING + LIVE WORK TIMER
         ========================================================================= */}
      <Card style={styles.heroCard} padding={16}>
        <View style={styles.heroTopRow}>
          {/* Avatar with Live Ping */}
          <View style={styles.avatarWrapper}>
            <Avatar
              src={currentUser.avatar}
              name={currentUser.name}
              size="lg"
              shape="curved"
              status={isClockedIn ? 'online' : 'offline'}
            />
          </View>

          <View style={styles.heroDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.greetingText, { color: theme.text }]} numberOfLines={1}>
                Good morning, {currentUser.name.split(' ')[0]} 👋
              </Text>
            </View>

            <View style={styles.designationRow}>
              <Text style={styles.designationText}>
                {currentUser.designation || 'Senior Product Designer'}
              </Text>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={[styles.deptText, { color: theme.subtext }]}>
                {currentUser.departmentName || 'Design'}
              </Text>
            </View>

            <View style={styles.shiftBadgeRow}>
              <View style={styles.codeBadge}>
                <Text style={styles.codeBadgeText}>EMP-0412</Text>
              </View>
              <Text style={[styles.shiftInfo, { color: theme.muted }]}>
                Shift: 09:00 AM – 06:00 PM
              </Text>
            </View>
          </View>
        </View>

        {/* Live Work Timer Box */}
        <LinearGradient
          colors={isDarkMode ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#EFF6FF']}
          style={[styles.timerBox, { borderColor: theme.border }]}
        >
          <View style={styles.timerHeader}>
            <View style={styles.timerHeaderLeft}>
              <Clock
                size={14}
                color={isClockedIn ? colors.success[500] : theme.muted}
              />
              <Text style={[styles.timerLabel, { color: theme.subtext }]}>
                DAILY WORK TIMER
              </Text>
            </View>
            <Badge variant={isClockedIn ? 'success' : 'neutral'} size="sm" dot>
              {isClockedIn ? 'RECORDING LIVE' : 'READY TO START'}
            </Badge>
          </View>

          <View style={styles.timerClockRow}>
            <Text style={[styles.timerClock, { color: theme.text }]}>
              {formatTimerHMS(secondsElapsed)}
            </Text>
            <Text style={[styles.timerStartedText, { color: theme.muted }]}>
              {isClockedIn ? `Started at ${formattedPunchInTime}` : 'Shift not yet started'}
            </Text>
          </View>

          {/* Big Punch Toggle Button */}
          <Button
            title={isClockedIn ? 'PUNCH OUT NOW' : 'PUNCH IN FOR SHIFT'}
            onPress={handlePunchToggle}
            variant={isClockedIn ? 'danger' : 'success'}
            leftIcon={
              isClockedIn ? (
                <Square size={16} color="#FFFFFF" />
              ) : (
                <Play size={16} color="#FFFFFF" />
              )
            }
            style={styles.punchBtn}
          />
        </LinearGradient>
      </Card>

      {/* =========================================================================
          5 STAT METRIC CARDS
         ========================================================================= */}
      <View style={styles.statsSection}>
        <View style={styles.statCardsRow}>
          <StatCard
            title="Leave Balance"
            value="18"
            unit="days left"
            subtitle="Total: 24 days annual"
            progressPercent={75}
            icon={<Calendar size={16} color={colors.accentBlue} />}
            iconBg="#EFF6FF"
            onPress={() => onNavigate('Leaves')}
          />
          <StatCard
            title="Today's Attendance"
            value="Present"
            subtitle="09:15 AM – On Time"
            trendText="On Time"
            trendPositive={true}
            icon={<Clock size={16} color={colors.success[500]} />}
            iconBg="#ECFDF5"
            onPress={() => onNavigate('ClockIn')}
          />
        </View>

        <View style={styles.statCardsRow}>
          <StatCard
            title="Pending Approvals"
            value="2"
            unit="requests"
            subtitle="1 Leave • 1 Expense"
            icon={<FileText size={16} color={colors.purple[500]} />}
            iconBg="#FAF5FF"
            onPress={() => onNavigate('Leaves')}
          />
          <StatCard
            title="My Tasks"
            value="3"
            unit="pending"
            subtitle="1 High Priority"
            icon={<CheckSquare size={16} color={colors.warning[500]} />}
            iconBg="#FFFBEB"
            onPress={() => onNavigate('Tasks')}
          />
        </View>

        <StatCard
          title="Next Upcoming Holiday"
          value="May 25, 2024"
          subtitle="Memorial Day (Saturday Public Holiday)"
          icon={<Palmtree size={16} color="#0D9488" />}
          iconBg="#F0FDFA"
          onPress={() => onNavigate('Holidays')}
        />
      </View>

      {/* =========================================================================
          QUICK ACTIONS 6-GRID
         ========================================================================= */}
      <Card style={styles.sectionCard} padding={16}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((qa, i) => {
            const Icon = qa.icon;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                onPress={qa.action}
                style={[
                  styles.quickActionTile,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: theme.borderSubtle,
                  },
                ]}
              >
                <View style={styles.qaIconWrapper}>
                  <Icon size={20} color={colors.accentBlue} />
                </View>
                <Text style={[styles.qaLabel, { color: theme.text }]}>
                  {qa.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* =========================================================================
          ATTENDANCE & LEAVE VISUAL OVERVIEW
         ========================================================================= */}
      <Card style={styles.sectionCard} padding={16}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Attendance Overview (Last 7 Days)
          </Text>
          <Badge variant="success" size="sm">
            96% Present
          </Badge>
        </View>

        <View style={styles.chartBarsContainer}>
          {[
            { day: 'Mon', hours: 8.5, status: 'Present' },
            { day: 'Tue', hours: 8.8, status: 'Present' },
            { day: 'Wed', hours: 8.2, status: 'Late' },
            { day: 'Thu', hours: 9.0, status: 'Present' },
            { day: 'Fri', hours: 8.5, status: 'Present' },
            { day: 'Sat', hours: 0, status: 'Off' },
            { day: 'Sun', hours: 0, status: 'Off' },
          ].map((bar, idx) => (
            <View key={idx} style={styles.chartCol}>
              <View style={[styles.barTrack, { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${(bar.hours / 10) * 100}%`,
                      backgroundColor:
                        bar.status === 'Late'
                          ? colors.warning[500]
                          : bar.status === 'Off'
                          ? '#94A3B8'
                          : colors.accentBlue,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.chartDayText, { color: theme.muted }]}>
                {bar.day}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      {/* =========================================================================
          INTERACTIVE CHECKLIST & TASKS
         ========================================================================= */}
      <Card style={styles.sectionCard} padding={16}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Active Tasks
          </Text>
          <TouchableOpacity onPress={() => onNavigate('Tasks')}>
            <Text style={styles.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tasksList}>
          {tasks.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.7}
              onPress={() => toggleTask(t.id)}
              style={[
                styles.taskRow,
                { borderBottomColor: theme.borderSubtle },
              ]}
            >
              <View
                style={[
                  styles.checkbox,
                  t.completed && styles.checkboxActive,
                  { borderColor: t.completed ? colors.accentBlue : theme.border },
                ]}
              >
                {t.completed ? <CheckSquare size={14} color="#FFFFFF" /> : null}
              </View>

              <View style={styles.taskTextCol}>
                <Text
                  style={[
                    styles.taskTitle,
                    {
                      color: t.completed ? theme.muted : theme.text,
                      textDecorationLine: t.completed ? 'line-through' : 'none',
                    },
                  ]}
                >
                  {t.text}
                </Text>
                <Text style={[styles.taskDue, { color: theme.muted }]}>
                  Due {t.dueDate}
                </Text>
              </View>

              <Badge
                variant={
                  t.priority === 'High'
                    ? 'danger'
                    : t.priority === 'Medium'
                    ? 'warning'
                    : 'info'
                }
                size="sm"
              >
                {t.priority}
              </Badge>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      {/* =========================================================================
          RECENT ANNOUNCEMENTS
         ========================================================================= */}
      <Card style={styles.sectionCard} padding={16}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Company Announcements
          </Text>
          <TouchableOpacity onPress={() => onNavigate('Announcements')}>
            <Text style={styles.viewAllLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.announcementItem}>
          <View style={styles.announcementIconWrap}>
            <Megaphone size={16} color={colors.accentBlue} />
          </View>
          <View style={styles.announcementContent}>
            <Text style={[styles.announcementTitle, { color: theme.text }]}>
              Office closed on May 25, 2024
            </Text>
            <Text style={[styles.announcementDesc, { color: theme.subtext }]}>
              Public Holiday celebration for all employees.
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 24,
  },
  heroCard: {
    marginBottom: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  heroDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
  },
  designationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  designationText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.accentBlue,
  },
  bulletDot: {
    color: '#94A3B8',
    marginHorizontal: 4,
    fontSize: 10,
  },
  deptText: {
    fontSize: typography.sizes.xs,
  },
  shiftBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  codeBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: radii.sm,
    marginRight: 6,
  },
  codeBadgeText: {
    fontSize: 9.5,
    fontWeight: typography.weights.extrabold,
    color: colors.primary[600],
  },
  shiftInfo: {
    fontSize: 10,
  },
  timerBox: {
    padding: 14,
    borderRadius: radii.xl,
    borderWidth: 1,
  },
  timerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timerHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 9.5,
    fontWeight: typography.weights.black,
    letterSpacing: 0.6,
    marginLeft: 5,
  },
  timerClockRow: {
    alignItems: 'center',
    marginVertical: 4,
  },
  timerClock: {
    fontSize: 32,
    fontWeight: typography.weights.black,
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timerStartedText: {
    fontSize: 11,
    marginTop: 2,
  },
  punchBtn: {
    marginTop: 8,
  },
  statsSection: {
    gap: 10,
    marginBottom: 14,
  },
  statCardsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionCard: {
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  viewAllLink: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.accentBlue,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  quickActionTile: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: radii.lg,
    borderWidth: 1,
  },
  qaIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  qaLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  chartBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 120,
    alignItems: 'flex-end',
    paddingTop: 10,
  },
  chartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 14,
    height: 80,
    borderRadius: radii.full,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: radii.full,
  },
  chartDayText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: 6,
  },
  tasksList: {
    marginTop: 4,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: colors.accentBlue,
  },
  taskTextCol: {
    flex: 1,
    paddingRight: 6,
  },
  taskTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  taskDue: {
    fontSize: 9.5,
    marginTop: 2,
  },
  announcementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  announcementIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  announcementDesc: {
    fontSize: 10.5,
    marginTop: 2,
  },
});
