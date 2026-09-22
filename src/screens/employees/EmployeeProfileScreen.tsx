import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import { Badge } from '../../components/ui/Badge';
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  MapPin,
  User,
  CreditCard,
  FileText,
  Shield,
  Clock,
} from 'lucide-react-native';

interface EmployeeProfileScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export const EmployeeProfileScreen: React.FC<EmployeeProfileScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const { currentUser, currentRole, currentOrg, isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [activeTab, setActiveTab] = useState<'info' | 'employment' | 'leaves' | 'documents'>('info');

  const profileData = {
    fullName: currentUser?.name || 'Rahul Sharma',
    employeeId: 'EMP-10482',
    designation: currentUser?.role === 'hr_admin' ? 'Head of People & Culture' : 'Senior Software Engineer',
    department: 'Engineering & Operations',
    email: currentUser?.email || 'rahul.sharma@acmecorp.com',
    phone: '+91 98765 43210',
    joiningDate: '15 March 2022',
    workLocation: 'Bengaluru, India (Hybrid)',
    manager: 'Priya Iyer (VP Operations)',
    employmentType: 'Full-Time Permanent',
    bankAccount: '•••• •••• •••• 4821 (HDFC Bank)',
    pan: 'ABCDE1234F',
    providentFund: 'KN/BLR/0048291/000/10482',
  };

  const leaveBalances = [
    { type: 'Annual Leave', available: 14, total: 18, color: colors.brand[600] },
    { type: 'Casual Leave', available: 5, total: 8, color: colors.success[500] },
    { type: 'Sick Leave', available: 8, total: 10, color: colors.warning[500] },
    { type: 'Compensatory', available: 2, total: 2, color: colors.brand[500] },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.bg }]}
      contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) + 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Card */}
      <View
        style={[
          styles.heroCard,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.heroBackgroundGradient,
            { backgroundColor: isDarkMode ? colors.dark.surface : colors.brand[50] },
          ]}
        />

        <View style={styles.profileHeaderRow}>
          <Image
            source={{
              uri:
                currentUser?.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            }}
            style={styles.avatarImage}
          />

          <View style={styles.headerInfo}>
            <Text
              style={[
                styles.profileName,
                { color: theme.text },
              ]}
            >
              {profileData.fullName}
            </Text>
            <Text
              style={[
                styles.profileDesignation,
                { color: colors.brand[600] },
              ]}
            >
              {profileData.designation}
            </Text>
            <View style={styles.badgeRow}>
              <Badge variant="neutral" size="sm">
                {profileData.employeeId}
              </Badge>
              <Badge variant="info" size="sm">
                {(currentRole || 'employee').replace('_', ' ').toUpperCase()}
              </Badge>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.orgStrip,
            {
              backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Building size={14} color={colors.brand[600]} />
          <Text
            style={[
              styles.orgText,
              { color: theme.subtext },
            ]}
          >
            {currentOrg?.name || 'Acme Technologies Pvt Ltd'}
          </Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: 'info', label: 'Overview' },
          { key: 'employment', label: 'Job Details' },
          { key: 'leaves', label: 'Balances' },
          { key: 'documents', label: 'Statutory' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabBtn,
                isActive && {
                  backgroundColor: colors.brand[600],
                },
              ]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive
                      ? '#FFFFFF'
                      : theme.subtext,
                    fontWeight: isActive ? '700' : '500',
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab Contents */}
      {activeTab === 'info' && (
        <View style={styles.sectionCardGroup}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text },
              ]}
            >
              Contact Information
            </Text>

            <View style={styles.detailItem}>
              <Mail size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Email Address</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.email}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Phone size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Mobile Phone</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.phone}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <MapPin size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Work Location</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.workLocation}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'employment' && (
        <View style={styles.sectionCardGroup}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text },
              ]}
            >
              Employment Specifics
            </Text>

            <View style={styles.detailItem}>
              <Briefcase size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Department</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.department}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Calendar size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Date of Joining</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.joiningDate}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <User size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Reporting Manager</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.manager}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Clock size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Employment Type</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.employmentType}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'leaves' && (
        <View style={styles.sectionCardGroup}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text },
              ]}
            >
              Current Year Balances
            </Text>

            <View style={styles.balancesGrid}>
              {leaveBalances.map((b) => (
                <View
                  key={b.type}
                  style={[
                    styles.balanceCard,
                    {
                      backgroundColor: isDarkMode ? colors.dark.surface : colors.light.surface,
                      borderLeftColor: b.color,
                    },
                  ]}
                >
                  <Text style={[styles.balanceLabel, { color: theme.subtext }]}>{b.type}</Text>
                  <Text
                    style={[
                      styles.balanceCount,
                      { color: theme.text },
                    ]}
                  >
                    {b.available}{' '}
                    <Text style={[styles.balanceTotal, { color: theme.muted }]}>/ {b.total} days</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {activeTab === 'documents' && (
        <View style={styles.sectionCardGroup}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.card,
                borderColor: theme.border,
              },
            ]}
          >
            <Text
              style={[
                styles.cardTitle,
                { color: theme.text },
              ]}
            >
              Financial & Legal Identification
            </Text>

            <View style={styles.detailItem}>
              <CreditCard size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Disbursement Account</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.bankAccount}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <FileText size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>PAN / Tax Registration</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.pan}
                </Text>
              </View>
            </View>

            <View style={styles.detailItem}>
              <Shield size={16} color={theme.muted} />
              <View style={styles.detailTextWrapper}>
                <Text style={[styles.detailLabel, { color: theme.muted }]}>Provident Fund (UAN)</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: theme.text },
                  ]}
                >
                  {profileData.providentFund}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  heroCard: {
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  heroBackgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    opacity: 0.8,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headerInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  profileDesignation: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 6,
  },
  orgStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.lg,
    borderWidth: 1,
    marginTop: 16,
  },
  orgText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: radii.lg,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabLabel: {
    fontSize: typography.sizes.xs,
  },
  sectionCardGroup: {
    gap: 12,
  },
  card: {
    borderRadius: radii.xl,
    padding: 16,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.15)',
  },
  detailTextWrapper: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
  },
  detailValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  balancesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  balanceCard: {
    width: '48%',
    padding: 12,
    borderRadius: radii.lg,
    borderLeftWidth: 4,
  },
  balanceLabel: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
  },
  balanceCount: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginTop: 4,
  },
  balanceTotal: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.regular,
  },
});
