import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { Badge } from '../../../components/ui/Badge';
import { useAppStore } from '../../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../../theme';
import { Building2, CreditCard, Activity, Server } from 'lucide-react-native';

interface SaasOwnerDashboardViewProps {
  onNavigate: (screenKey: string) => void;
  onOpenApplyLeave: () => void;
}

export const SaasOwnerDashboardView: React.FC<SaasOwnerDashboardViewProps> = ({
  onNavigate,
}) => {
  const { isDarkMode, allOrgs } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <View style={styles.container}>
      <Card style={styles.heroCard} padding={16}>
        <Badge variant="purple" size="sm">
          GLOBAL SAAS PLATFORM ANALYTICS
        </Badge>
        <Text style={[styles.title, { color: theme.text }]}>Platform Operations</Text>
        <Text style={[styles.subtitle, { color: theme.subtext }]}>
          4 Enterprise Tenants • $9,496 MRR • 99.98% System Uptime
        </Text>
      </Card>

      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard
            title="Active Tenants"
            value="4"
            unit="orgs"
            subtitle="Acme, GlobalTech, BrightFuture"
            icon={<Building2 size={16} color={colors.accentBlue} />}
            iconBg="#EFF6FF"
          />
          <StatCard
            title="Monthly Revenue"
            value="$9,496"
            unit="MRR"
            subtitle="+18% Net Revenue Expansion"
            trendText="+18%"
            trendPositive={true}
            icon={<CreditCard size={16} color={colors.success[500]} />}
            iconBg="#ECFDF5"
          />
        </View>

        <View style={styles.statsRow}>
          <StatCard
            title="Total Platform Users"
            value="640"
            unit="employees"
            subtitle="Across all client organizations"
            icon={<Activity size={16} color={colors.purple[500]} />}
            iconBg="#FAF5FF"
          />
          <StatCard
            title="API Health"
            value="99.98%"
            subtitle="PostgreSQL + Express Cluster"
            trendText="Optimal"
            trendPositive={true}
            icon={<Server size={16} color="#0EA5E9" />}
            iconBg="#F0F9FF"
          />
        </View>
      </View>

      {/* Tenant Organizations List */}
      <Card style={styles.sectionCard} padding={16}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Connected Client Organizations
        </Text>

        {allOrgs.map((org) => (
          <View key={org.id} style={[styles.tenantRow, { borderBottomColor: theme.borderSubtle }]}>
            <View style={styles.tenantInfo}>
              <Text style={[styles.tenantName, { color: theme.text }]}>{org.name}</Text>
              <Text style={[styles.tenantDetails, { color: theme.muted }]}>
                {org.plan} Tier • {org.totalEmployees}/{org.maxEmployees} Employees
              </Text>
            </View>
            <Badge variant={org.status === 'active' ? 'success' : 'warning'} size="sm">
              {org.status.toUpperCase()}
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
  tenantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  tenantDetails: {
    fontSize: 10,
    marginTop: 1,
  },
});
