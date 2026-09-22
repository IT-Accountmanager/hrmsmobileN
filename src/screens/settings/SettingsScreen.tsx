import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import {
  Shield,
  Building,
  Bell,
  Lock,
  Plus,
  X,
  CheckCircle2,
  Key,
  Smartphone,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';

interface RoleItem {
  id: string;
  name: string;
  permissionsCount: number;
  badge?: string;
  enabled: boolean;
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: 'r-1',
    name: 'SaaS Platform Owner',
    permissionsCount: 128,
    badge: 'Full Administrative Access',
    enabled: true,
  },
  {
    id: 'r-2',
    name: 'Organization Admin',
    permissionsCount: 96,
    badge: 'Full Administrative Access',
    enabled: true,
  },
  {
    id: 'r-3',
    name: 'HR Administrator',
    permissionsCount: 74,
    enabled: true,
  },
  {
    id: 'r-4',
    name: 'HR Executive',
    permissionsCount: 48,
    enabled: true,
  },
  {
    id: 'r-5',
    name: 'Talent Recruiter',
    permissionsCount: 35,
    enabled: true,
  },
  {
    id: 'r-6',
    name: 'Payroll Specialist',
    permissionsCount: 30,
    enabled: true,
  },
  {
    id: 'r-7',
    name: 'Team Manager',
    permissionsCount: 24,
    enabled: true,
  },
  {
    id: 'r-8',
    name: 'Employee (ESS)',
    permissionsCount: 12,
    enabled: false,
  },
];

export const SettingsScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [activeTab, setActiveTab] = useState<'roles' | 'profile' | 'notifications' | 'security'>('roles');
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);

  // New Role Form State
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePerms, setNewRolePerms] = useState('20');

  // Company profile state
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [taxId, setTaxId] = useState('US-EIN-98429184');
  const [timezone, setTimezone] = useState('America/New_York (EST)');

  // Notification state
  const [notifyLeave, setNotifyLeave] = useState(true);
  const [notifyPayroll, setNotifyPayroll] = useState(true);
  const [notifyAnnounce, setNotifyAnnounce] = useState(false);

  // Security state
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const handleToggleRole = (id: string) => {
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleCreateRole = () => {
    if (!newRoleName.trim()) {
      Alert.alert('Validation Error', 'Please enter a custom role title.');
      return;
    }
    const newRole: RoleItem = {
      id: `r-${Date.now()}`,
      name: newRoleName.trim(),
      permissionsCount: parseInt(newRolePerms, 10) || 15,
      enabled: true,
    };
    setRoles([...roles, newRole]);
    setCreateRoleModalOpen(false);
    setNewRoleName('');
    Alert.alert('Role Configured', `Custom role "${newRole.name}" created and added to RBAC matrix.`);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#0B1120' : '#F8FAFC' }]}
    >
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          Settings & Permissions Control Center
        </Text>
        <Text style={styles.screenSubtitle}>
          Configure organization branding, granular role-permission access matrices, and security protocols.
        </Text>
      </View>

      {/* 2. Top Navigation Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('roles')}
          style={[styles.tabBtn, activeTab === 'roles' && styles.tabBtnActive]}
        >
          <Shield size={14} color={activeTab === 'roles' ? '#2563EB' : '#64748B'} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'roles' && styles.tabTextActive]}>
            Roles & Permissions
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('profile')}
          style={[styles.tabBtn, activeTab === 'profile' && styles.tabBtnActive]}
        >
          <Building size={14} color={activeTab === 'profile' ? '#2563EB' : '#64748B'} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>
            Company Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('notifications')}
          style={[styles.tabBtn, activeTab === 'notifications' && styles.tabBtnActive]}
        >
          <Bell size={14} color={activeTab === 'notifications' ? '#2563EB' : '#64748B'} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'notifications' && styles.tabTextActive]}>
            Notification Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveTab('security')}
          style={[styles.tabBtn, activeTab === 'security' && styles.tabBtnActive]}
        >
          <Lock size={14} color={activeTab === 'security' ? '#2563EB' : '#64748B'} style={{ marginRight: 6 }} />
          <Text style={[styles.tabText, activeTab === 'security' && styles.tabTextActive]}>
            Security & 2FA
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. Tab Content */}
      {activeTab === 'roles' && (
        <View
          style={[
            styles.contentCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Role-Based Access Control (RBAC) Matrix
              </Text>
              <Text style={styles.cardSub}>
                Configure feature access toggles for all organizational roles
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setCreateRoleModalOpen(true)}
              style={styles.createRoleBtn}
            >
              <Text style={styles.createRoleBtnText}>Create Custom Role</Text>
            </TouchableOpacity>
          </View>

          {/* Roles List with Toggles */}
          <View style={styles.rolesList}>
            {roles.map((role) => (
              <View key={role.id} style={styles.roleItemRow}>
                <View style={styles.roleCircleBox}>
                  <Shield size={14} color="#2563EB" />
                </View>
                <View style={styles.roleInfoCol}>
                  <Text style={[styles.roleName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {role.name}
                  </Text>
                  <Text style={styles.rolePermsText}>{role.permissionsCount} permissions</Text>
                </View>

                {role.badge && (
                  <View style={styles.fullAdminBadge}>
                    <Text style={styles.fullAdminBadgeText}>{role.badge}</Text>
                  </View>
                )}

                <Switch
                  value={role.enabled}
                  onValueChange={() => handleToggleRole(role.id)}
                  trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <View
          style={[
            styles.contentCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A', marginBottom: 14 }]}>
            Organization Profile & Legal Identity
          </Text>

          <Text style={styles.inputLabel}>Legal Entity Name</Text>
          <TextInput
            value={companyName}
            onChangeText={setCompanyName}
            style={[styles.formInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />

          <Text style={styles.inputLabel}>Tax Registration / EIN</Text>
          <TextInput
            value={taxId}
            onChangeText={setTaxId}
            style={[styles.formInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />

          <Text style={styles.inputLabel}>Operating Timezone</Text>
          <TextInput
            value={timezone}
            onChangeText={setTimezone}
            style={[styles.formInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Alert.alert('Saved', 'Organization information updated successfully.')}
            style={styles.saveBtn}
          >
            <Text style={styles.saveBtnText}>Save Profile Settings</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <View
          style={[
            styles.contentCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A', marginBottom: 14 }]}>
            Automated Alerts & Communication Rules
          </Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Leave & Attendance Notifications
              </Text>
              <Text style={styles.toggleSub}>Email alerts when team members apply for leave</Text>
            </View>
            <Switch
              value={notifyLeave}
              onValueChange={setNotifyLeave}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Payroll & Payslip Alerts
              </Text>
              <Text style={styles.toggleSub}>Push notifications on monthly salary disbursements</Text>
            </View>
            <Switch
              value={notifyPayroll}
              onValueChange={setNotifyPayroll}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Company Broadcasts & Announcements
              </Text>
              <Text style={styles.toggleSub}>Instant popups for enterprise-wide memos</Text>
            </View>
            <Switch
              value={notifyAnnounce}
              onValueChange={setNotifyAnnounce}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <View
          style={[
            styles.contentCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A', marginBottom: 14 }]}>
            Enterprise Security & 2FA Enforcement
          </Text>

          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.toggleTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Mandatory Two-Factor Authentication (2FA)
              </Text>
              <Text style={styles.toggleSub}>Enforce Authenticator app OTP for all admins</Text>
            </View>
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Sessions Terminated', 'All other active device sessions have been revoked.')}
            style={[styles.securityActionBtn, { borderColor: '#EF4444' }]}
          >
            <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 13 }}>
              Terminate All Other Active Sessions
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 4. Create Custom Role Modal */}
      <Modal visible={createRoleModalOpen} transparent animationType="slide" onRequestClose={() => setCreateRoleModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  Create Custom Role
                </Text>
                <Text style={styles.modalSub}>Define a custom permission profile for special roles.</Text>
              </View>
              <TouchableOpacity onPress={() => setCreateRoleModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Role Title *</Text>
            <TextInput
              value={newRoleName}
              onChangeText={setNewRoleName}
              placeholder="e.g. Compliance Auditor or Freelance Recruiter"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Permissions Count</Text>
            <TextInput
              value={newRolePerms}
              onChangeText={setNewRolePerms}
              placeholder="e.g. 24"
              keyboardType="number-pad"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreateRole}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Add Role to RBAC Matrix</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  tabsScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.7)',
    backgroundColor: 'rgba(148, 163, 184, 0.05)',
  },
  tabBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  tabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  contentCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  createRoleBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.md,
  },
  createRoleBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11.5,
  },
  rolesList: {
    gap: 12,
  },
  roleItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    gap: 10,
  },
  roleCircleBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfoCol: {
    flex: 1,
  },
  roleName: {
    fontSize: 13,
    fontWeight: '700',
  },
  rolePermsText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  fullAdminBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  fullAdminBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 5,
    marginTop: 10,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 18,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13.5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  toggleSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  securityActionBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
