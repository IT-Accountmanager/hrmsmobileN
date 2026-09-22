import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShieldCheck,
  ChevronDown,
  Sparkles,
} from 'lucide-react-native';
import { useAppStore } from '../../store/useAppStore';
import { HrmIsometricLogo } from '../../components/common/HrmIsometricLogo';
import { LoginCurvedBackground } from '../../components/common/LoginCurvedBackground';
import {
  GoogleIcon,
  MicrosoftIcon,
  AppleIcon,
} from '../../components/common/SocialIcons';

const DEMO_ROLES = [
  { id: 'hr_admin', label: 'HR Admin', email: 'hr.admin@acmecorp.com' },
  { id: 'manager', label: 'Manager', email: 'engineering.lead@acmecorp.com' },
  { id: 'employee', label: 'Employee', email: 'employee@acmecorp.com' },
  { id: 'payroll_admin', label: 'Payroll', email: 'payroll.specialist@acmecorp.com' },
  { id: 'saas_owner', label: 'SaaS Owner', email: 'saas.owner@hrmplatform.com' },
];

export const LoginScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { loginUser } = useAppStore();

  const [email, setEmail] = useState('hr.admin@acmecorp.com');
  const [password, setPassword] = useState('••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(DEMO_ROLES[0]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const handleSelectRole = (role: (typeof DEMO_ROLES)[0]) => {
    setSelectedRole(role);
    setEmail(role.email);
    setShowRoleModal(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await loginUser(email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Background with Office photo and upper Blue Waves */}
      <LoginCurvedBackground />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        {/* Top Header Row with Isometric 3D Logo & Demo Switcher */}
        <View style={styles.topHeader}>
          <View style={styles.brandContainer}>
            <HrmIsometricLogo size={46} />
            <View style={styles.brandTextCol}>
              <Text style={styles.brandTitle}>HRM</Text>
              <Text style={styles.brandSubtitle}>Human Resource Management</Text>
            </View>
          </View>

          {/* Discreet Demo Role Selector Badge */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowRoleModal(true)}
            style={styles.demoBadge}
          >
            <Sparkles size={11} color="#93C5FD" />
            <Text style={styles.demoBadgeText}>{selectedRole.label}</Text>
            <ChevronDown size={12} color="#93C5FD" />
          </TouchableOpacity>
        </View>

        {/* Main Floating White Card */}
        <View style={styles.card}>
          {/* Card Title & Description */}
          <Text style={styles.welcomeTitle}>Welcome Back!</Text>
          <Text style={styles.welcomeDesc}>
            Sign in to your HRM account to continue
          </Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Email Address */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputBox}>
              <Mail size={17} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter email address"
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.textInput}
              />
            </View>

            {/* Password */}
            <Text style={[styles.inputLabel, { marginTop: 14 }]}>Password</Text>
            <View style={styles.inputBox}>
              <Lock size={17} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                style={styles.textInput}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={styles.eyeIconBtn}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#94A3B8" />
                ) : (
                  <Eye size={18} color="#94A3B8" />
                )}
              </TouchableOpacity>
            </View>

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.rememberRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.checkboxContainer}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxActive,
                  ]}
                >
                  {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Primary Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleSignIn}
              disabled={loading}
              style={styles.signInBtn}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.signInBtnText}>Sign In</Text>
                  <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.5} style={styles.signInArrow} />
                </>
              )}
            </TouchableOpacity>

            {/* Or continue with Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSignIn}
                style={styles.socialBtn}
              >
                <GoogleIcon size={16} />
                <Text style={styles.socialBtnText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSignIn}
                style={styles.socialBtn}
              >
                <MicrosoftIcon size={16} />
                <Text style={styles.socialBtnText}>Microsoft</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.75}
                onPress={handleSignIn}
                style={styles.socialBtn}
              >
                <AppleIcon size={17} />
                <Text style={styles.socialBtnText}>Apple</Text>
              </TouchableOpacity>
            </View>

            {/* Security Badge */}
            <View style={styles.securityBadge}>
              <View style={styles.securityLeftGroup}>
                <View style={styles.securityIconCircle}>
                  <ShieldCheck size={14} color="#FFFFFF" strokeWidth={2.5} />
                </View>
                <View style={styles.securityTextCol}>
                  <Text style={styles.securityTitle}>Secure &</Text>
                  <Text style={styles.securityTitle}>Encrypted</Text>
                </View>
              </View>

              <View style={styles.securityRightGroup}>
                <Text style={styles.securitySubtitle}>Your data is safe</Text>
                <Text style={styles.securitySubtitle}>with us</Text>
              </View>
            </View>

            {/* Register Link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.registerLink}>Register here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            © 2026 <Text style={styles.footerBrand}>HRM</Text>. All rights reserved.  |  Privacy
          </Text>
          <Text style={[styles.footerText, { marginTop: 2 }]}>
            Policy   |   Terms of Service
          </Text>
        </View>
      </ScrollView>

      {/* Demo Roles Quick Selection Modal */}
      <Modal
        visible={showRoleModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRoleModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowRoleModal(false)}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Demo Role</Text>
            <Text style={styles.modalSub}>
              Switch credentials instantly for testing:
            </Text>
            {DEMO_ROLES.map((r) => {
              const active = selectedRole.id === r.id;
              return (
                <TouchableOpacity
                  key={r.id}
                  activeOpacity={0.7}
                  onPress={() => handleSelectRole(r)}
                  style={[styles.modalItem, active && styles.modalItemActive]}
                >
                  <View style={styles.modalItemInfo}>
                    <Text style={[styles.modalItemTitle, active && styles.modalItemTitleActive]}>
                      {r.label}
                    </Text>
                    <Text style={styles.modalItemEmail}>{r.email}</Text>
                  </View>
                  {active && <Check size={16} color="#2563EB" strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  topHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 20,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTextCol: {
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
    lineHeight: 26,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 1,
    letterSpacing: -0.1,
  },
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    gap: 4,
  },
  demoBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingVertical: 28,
    paddingHorizontal: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  welcomeDesc: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
    fontWeight: '400',
  },
  formContainer: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '500',
    padding: 0,
  },
  eyeIconBtn: {
    padding: 4,
    marginLeft: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  rememberText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    marginLeft: 8,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  signInBtn: {
    height: 48,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
  signInArrow: {
    marginLeft: 7,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  dividerText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: '#94A3B8',
    paddingHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  socialBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 18,
  },
  securityLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  securityIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityTextCol: {
    justifyContent: 'center',
  },
  securityTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 15,
  },
  securityRightGroup: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  securitySubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 14,
  },
  registerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },
  registerText: {
    fontSize: 13,
    color: '#64748B',
  },
  registerLink: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
  footerContainer: {
    marginTop: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '400',
  },
  footerBrand: {
    color: '#2563EB',
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  modalItemActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalItemTitleActive: {
    color: '#2563EB',
  },
  modalItemEmail: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
});
