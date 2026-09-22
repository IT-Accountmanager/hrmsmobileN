import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { Badge } from '../../../components/ui/Badge';
import { Avatar } from '../../../components/ui/Avatar';
import { useAppStore } from '../../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../../theme';
import { Users, CheckCircle2, Clock, Target, ArrowRight } from 'lucide-react-native';

interface ManagerDashboardViewProps {
  onNavigate: (screenKey: string) => void;
  onOpenApplyLeave: () => void;
}

export const ManagerDashboardView: React.FC<ManagerDashboardViewProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <View style={styles.container}>
      <Card style={styles.heroCard} padding={16}>
        <Badge variant="purple" size="sm">
          TEAM MANAGEMENT CONSOLE
        </Badge>
        <Text style={[styles.title, { color: theme.text }]}>Engineering Squad</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          8 Direct Reports • 2 Sprint Deliverables Due Today
        </Text>
      </Card>

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Team Size"
            value="8"
            unit="members"
            subtitle="7 Online • 1 On Leave"
            icon={<Users size={16} color={colors.accentBlue} />}
            iconBg="#EFF6FF"
            onPress={() => onNavigate('Employees')}
          />
          <StatCard
            title="Sprint Velocity"
            value="88%"
            subtitle="Ahead of schedule"
            trendText="On Track"
            trendPositive={true}
            icon={<Target size={16} color={colors.success[500]} />}
            iconBg="#ECFDF5"
            onPress={() => onNavigate('Tasks')}
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Leave Approvals"
            value="3"
            unit="pending"
            subtitle="Requires manager sign-off"
            icon={<Clock size={16} color={colors.warning[500]} />}
            iconBg="#FFFBEB"
            onPress={() => onNavigate('Leaves')}
          />
          <StatCard
            title="Active PRs & Tasks"
            value="14"
            unit="in review"
            subtitle="Sprint 24-B"
            icon={<CheckCircle2 size={16} color={colors.purple[500]} />}
            iconBg="#FAF5FF"
            onPress={() => onNavigate('Tasks')}
          />
        </View>
      </View>

      {/* Team Status Roster */}
      <Card style={styles.sectionCard} padding={16}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Direct Reports Live Status
        </Text>

        {[
          { name: 'Sarah Wilson', role: 'Product Designer', status: 'online', task: 'Mobile UI/UX Refinements' },
          { name: 'Alex Rivera', role: 'Frontend Engineer', status: 'online', task: 'React Native Navigation' },
          { name: 'David Kumar', role: 'Backend Engineer', status: 'online', task: 'PostgreSQL Leave APIs' },
          { name: 'Elena Rostova', role: 'QA Lead', status: 'offline', task: 'On Approved Casual Leave' },
        ].map((member, i) => (
          <View key={i} style={[styles.memberRow, { borderBottomColor: theme.borderSubtle }]}>
            <Avatar name={member.name} size="sm" status={member.status as any} />
            <View style={styles.memberInfo}>
              <Text style={[styles.memberName, { color: theme.text }]}>{member.name}</Text>
              <Text style={[styles.memberRole, { color: theme.subtext }]}>{member.role} • {member.task}</Text>
            </View>
            <Badge variant={member.status === 'online' ? 'success' : 'neutral'} size="sm">
              {member.status === 'online' ? 'Working' : 'Leave'}
            </Badge>
          </View>
        ))}
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  heroCard: {
    marginBottom: 14,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.black,
    marginTop: 6,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  statsGrid: {
    gap: 10,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sectionCard: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  memberInfo: {
    marginLeft: 10,
    flex: 1,
  },
  memberName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  memberRole: {
    fontSize: 10,
    marginTop: 1,
  },
});
