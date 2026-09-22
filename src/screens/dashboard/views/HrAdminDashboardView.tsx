import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {
  Users,
  UserCheck,
  Calendar,
  UserPlus,
  Clock,
  Briefcase,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Check,
  ShieldCheck,
  Eye,
} from 'lucide-react-native';
import { useAppStore } from '../../../store/useAppStore';
import { AttendanceTrendChart } from '../../../components/dashboard/AttendanceTrendChart';
import { LeaveAllocationDonut } from '../../../components/dashboard/LeaveAllocationDonut';

interface HrAdminDashboardViewProps {
  onNavigate: (screenKey: string) => void;
  onOpenApplyLeave: () => void;
}

interface NewJoiner {
  id: string;
  name: string;
  department: string;
  date: string;
  avatar: string;
  email: string;
  role: string;
}

interface ComplianceDoc {
  id: string;
  title: string;
  submitter: string;
  timeAgo: string;
  status: 'Pending Review' | 'Verified';
  type: string;
  notes: string;
}

export const HrAdminDashboardView: React.FC<HrAdminDashboardViewProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  // Dynamic state for live metrics & functionality
  const [totalEmployees, setTotalEmployees] = useState(248);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [hrApprovalsModalOpen, setHrApprovalsModalOpen] = useState(false);
  const [verifyDocModalOpen, setVerifyDocModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ComplianceDoc | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<NewJoiner | null>(null);

  // New Employee Form State
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Marketing');
  const [newEmpRole, setNewEmpRole] = useState('Specialist');

  // Recent New Joiners State
  const [newJoiners, setNewJoiners] = useState<NewJoiner[]>([
    {
      id: 'nj-1',
      name: 'James Miller',
      department: 'Marketing',
      date: 'May 20, 2024',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      email: 'james.miller@acmecorp.com',
      role: 'Growth Marketing Lead',
    },
    {
      id: 'nj-2',
      name: 'Sophia Davis',
      department: 'Engineering',
      date: 'May 18, 2024',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      email: 'sophia.davis@acmecorp.com',
      role: 'Full Stack Engineer',
    },
    {
      id: 'nj-3',
      name: 'William Brown',
      department: 'Sales',
      date: 'May 16, 2024',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      email: 'william.brown@acmecorp.com',
      role: 'Account Executive',
    },
    {
      id: 'nj-4',
      name: 'Olivia Wilson',
      department: 'HR',
      date: 'May 14, 2024',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      email: 'olivia.wilson@acmecorp.com',
      role: 'Talent Acquisition Partner',
    },
    {
      id: 'nj-5',
      name: 'Liam Garcia',
      department: 'Finance',
      date: 'May 12, 2024',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
      email: 'liam.garcia@acmecorp.com',
      role: 'Financial Analyst',
    },
  ]);

  // Document Compliance Queue State
  const [complianceDocs, setComplianceDocs] = useState<ComplianceDoc[]>([
    {
      id: 'doc-1',
      title: 'Tax Exemption W-4 Form',
      submitter: 'James Miller',
      timeAgo: '1h ago',
      status: 'Pending Review',
      type: 'Tax & Payroll',
      notes: 'Federal standard withholding exemption certificates filled with signature.',
    },
    {
      id: 'doc-2',
      title: 'Passport / Work Authorization',
      submitter: 'Sophia Davis',
      timeAgo: '3h ago',
      status: 'Pending Review',
      type: 'Identity Verification',
      notes: 'US Passport scan provided for Form I-9 verification.',
    },
    {
      id: 'doc-3',
      title: 'Direct Deposit Void Check',
      submitter: 'William Brown',
      timeAgo: '5h ago',
      status: 'Verified',
      type: 'Banking Information',
      notes: 'Chase Bank checking voided statement validated against ACH routing.',
    },
  ]);

  // Pending Approvals State
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 'app-1', name: 'Sophia Davis', type: 'Sick Leave', duration: '2 Days (May 22-23)', status: 'Pending' },
    { id: 'app-2', name: 'James Miller', type: 'WFH Allowance', duration: 'Equipment $450', status: 'Pending' },
    { id: 'app-3', name: 'Olivia Wilson', type: 'Annual Leave', duration: '5 Days (Jun 1-5)', status: 'Pending' },
  ]);

  const pendingDocsCount = complianceDocs.filter((d) => d.status === 'Pending Review').length;

  const handleOpenVerifyDoc = (doc: ComplianceDoc) => {
    setSelectedDoc(doc);
    setVerifyDocModalOpen(true);
  };

  const handleVerifyCurrentDoc = () => {
    if (!selectedDoc) return;
    setComplianceDocs((prev) =>
      prev.map((d) => (d.id === selectedDoc.id ? { ...d, status: 'Verified' } : d))
    );
    setVerifyDocModalOpen(false);
  };

  const handleCreateEmployee = () => {
    if (!newEmpName.trim() || !newEmpEmail.trim()) {
      Alert.alert('Required Fields', 'Please enter employee name and email.');
      return;
    }

    const newJoiner: NewJoiner = {
      id: `nj-${Date.now()}`,
      name: newEmpName.trim(),
      department: newEmpDept,
      date: 'Today',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      email: newEmpEmail.trim(),
      role: newEmpRole.trim(),
    };

    setNewJoiners([newJoiner, ...newJoiners]);
    setTotalEmployees((prev) => prev + 1);
    setNewEmpName('');
    setNewEmpEmail('');
    setAddEmployeeModalOpen(false);
  };

  const handleApproveRequest = (id: string) => {
    setPendingApprovals((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* 1. Breadcrumbs */}
      <View style={styles.breadcrumbRow}>
        <Text style={styles.breadcrumbText}>
          Human Resources <Text style={styles.breadcrumbArrow}>{'>'}</Text>{' '}
          <Text style={styles.breadcrumbActive}>HR Admin Control Hub</Text>
        </Text>
      </View>

      {/* 2. Workspace Header Title */}
      <View style={styles.workspaceHeader}>
        <Text style={[styles.workspaceTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          HR Admin Workspace 👥
        </Text>
        <Text style={styles.workspaceSubtitle}>
          Organization-wide employee management, leave governance, onboarding, and compliance records.
        </Text>
      </View>

      {/* 3. Action Buttons Row */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setAddEmployeeModalOpen(true)}
          style={styles.addEmployeeBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.addEmployeeText}>Add Employee</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setHrApprovalsModalOpen(true)}
          style={[
            styles.hrApprovalsBtn,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
          ]}
        >
          <Text style={[styles.hrApprovalsText, { color: isDarkMode ? '#FFFFFF' : '#1E293B' }]}>
            HR Approvals
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Metric Stat Cards (2x3 Grid) */}
      <View style={styles.statsGrid}>
        {/* Row 1: Total Employees & Present Today */}
        <View style={styles.statsRow}>
          {/* Card 1: Total Employees */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('Employees')}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Users size={18} color="#2563EB" />
              </View>
              <Text style={styles.statLabel}>Total Employees</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                {totalEmployees}
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>+12%</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>vs last week: 221</Text>
          </TouchableOpacity>

          {/* Card 2: Present Today */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('ClockIn')}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
                <UserCheck size={18} color="#10B981" />
              </View>
              <Text style={styles.statLabel}>Present Today</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                236
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>+8%</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>vs yesterday: 218</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: On Leave & New Joiners */}
        <View style={styles.statsRow}>
          {/* Card 3: On Leave */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('Leaves')}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#FEF2F2' }]}>
                <Calendar size={18} color="#EF4444" />
              </View>
              <Text style={styles.statLabel}>On Leave</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                12
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#FEF2F2' }]}>
                <Text style={[styles.trendBadgeText, { color: '#EF4444' }]}>-4%</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>vs yesterday: 16</Text>
          </TouchableOpacity>

          {/* Card 4: New Joiners */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('Employees')}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#F5F3FF' }]}>
                <UserPlus size={18} color="#8B5CF6" />
              </View>
              <Text style={styles.statLabel}>New Joiners</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                {newJoiners.length}
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>+25%</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>This Month</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: Pending HR Requests & Open Positions */}
        <View style={styles.statsRow}>
          {/* Card 5: Pending HR Requests */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setHrApprovalsModalOpen(true)}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Clock size={18} color="#F59E0B" />
              </View>
              <Text style={styles.statLabel} numberOfLines={1}>Pending HR Requ...</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                14
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.trendBadgeText, { color: '#D97706' }]}>5 Urgent</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>Leaves & Docs</Text>
          </TouchableOpacity>

          {/* Card 6: Open Positions */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onNavigate('Tasks')}
            style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
          >
            <View style={styles.statHeader}>
              <View style={[styles.statIconBox, { backgroundColor: '#ECFEFF' }]}>
                <Briefcase size={18} color="#06B6D4" />
              </View>
              <Text style={styles.statLabel}>Open Positions</Text>
            </View>
            <View style={styles.statValueRow}>
              <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                5
              </Text>
              <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
                <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>+40%</Text>
              </View>
            </View>
            <Text style={styles.statSubtext}>Active Requisitions</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 5. Organization Attendance Trend Card */}
      <View style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.cardHeaderCol}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Organization Attendance Trend
          </Text>
          <Text style={styles.cardSubtitle}>Daily attendance across all departments</Text>
        </View>
        <AttendanceTrendChart />
      </View>

      {/* 6. Leave Allocation Card */}
      <View style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Leave Allocation
          </Text>
          <Text style={styles.headerMetaText}>186 Total Leaves</Text>
        </View>
        <LeaveAllocationDonut />
      </View>

      {/* 7. Recent New Joiners Card */}
      <View style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Recent New Joiners
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate('Employees')}
            style={styles.viewDirectoryBtn}
          >
            <Text style={styles.viewDirectoryText}>View All Directory ↗</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.joinersList}>
          {newJoiners.slice(0, 5).map((joiner, index) => (
            <TouchableOpacity
              key={joiner.id}
              activeOpacity={0.7}
              onPress={() => setSelectedEmployee(joiner)}
              style={[
                styles.joinerRow,
                index < 4 && styles.joinerBorder,
                { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
              ]}
            >
              <Image source={{ uri: joiner.avatar }} style={styles.joinerAvatar} />
              <View style={styles.joinerInfo}>
                <Text style={[styles.joinerName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  {joiner.name}
                </Text>
                <Text style={styles.joinerDept}>{joiner.department}</Text>
              </View>
              <Text style={styles.joinerDate}>{joiner.date}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 8. Document Compliance Queue Card */}
      <View style={[styles.sectionCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Document Compliance Queue
          </Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{pendingDocsCount} Pending</Text>
          </View>
        </View>

        <View style={styles.docList}>
          {complianceDocs.map((doc) => {
            const isVerified = doc.status === 'Verified';
            return (
              <View
                key={doc.id}
                style={[
                  styles.docCard,
                  {
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#F1F5F9',
                  },
                ]}
              >
                <View style={styles.docHeaderRow}>
                  <Text
                    style={[styles.docTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
                    numberOfLines={1}
                  >
                    {doc.title}
                  </Text>
                  <View
                    style={[
                      styles.docStatusBadge,
                      { backgroundColor: isVerified ? '#ECFDF5' : '#FEF3C7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.docStatusText,
                        { color: isVerified ? '#10B981' : '#D97706' },
                      ]}
                    >
                      {doc.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.docSubtitle}>
                  Submitted by {doc.submitter} • {doc.timeAgo}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleOpenVerifyDoc(doc)}
                  style={styles.verifyDocBtn}
                >
                  <Text style={styles.verifyDocBtnText}>Verify Doc</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* ===================== MODALS ===================== */}

      {/* Modal 1: Add Employee Modal */}
      <Modal
        visible={addEmployeeModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddEmployeeModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Add New Employee
              </Text>
              <TouchableOpacity onPress={() => setAddEmployeeModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFieldLabel}>Full Name</Text>
            <TextInput
              value={newEmpName}
              onChangeText={setNewEmpName}
              placeholder="e.g. Rachel Green"
              placeholderTextColor="#94A3B8"
              style={[
                styles.modalInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
              ]}
            />

            <Text style={styles.modalFieldLabel}>Work Email</Text>
            <TextInput
              value={newEmpEmail}
              onChangeText={setNewEmpEmail}
              placeholder="rachel.green@acmecorp.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              style={[
                styles.modalInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
              ]}
            />

            <Text style={styles.modalFieldLabel}>Department</Text>
            <View style={styles.deptChipRow}>
              {['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'].map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setNewEmpDept(d)}
                  style={[
                    styles.deptChip,
                    newEmpDept === d && styles.deptChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.deptChipText,
                      newEmpDept === d && styles.deptChipTextActive,
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreateEmployee}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Create Employee</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 2: HR Approvals Modal */}
      <Modal
        visible={hrApprovalsModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setHrApprovalsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                HR Approvals Queue
              </Text>
              <TouchableOpacity onPress={() => setHrApprovalsModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>Pending employee requests requiring review</Text>

            {pendingApprovals.length === 0 ? (
              <View style={styles.emptyBox}>
                <CheckCircle2 size={32} color="#10B981" />
                <Text style={styles.emptyText}>All HR requests are resolved!</Text>
              </View>
            ) : (
              pendingApprovals.map((req) => (
                <View
                  key={req.id}
                  style={[
                    styles.approvalItem,
                    { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.approvalName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {req.name}
                    </Text>
                    <Text style={styles.approvalType}>
                      {req.type} • {req.duration}
                    </Text>
                  </View>
                  <View style={styles.approvalActionRow}>
                    <TouchableOpacity
                      onPress={() => handleApproveRequest(req.id)}
                      style={styles.approveBtn}
                    >
                      <Text style={styles.approveBtnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleApproveRequest(req.id)}
                      style={styles.rejectBtn}
                    >
                      <Text style={styles.rejectBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>
      </Modal>

      {/* Modal 3: Document Verification Modal */}
      <Modal
        visible={verifyDocModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setVerifyDocModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            <View style={styles.modalTopRow}>
              <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                Verify Document
              </Text>
              <TouchableOpacity onPress={() => setVerifyDocModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {selectedDoc && (
              <View style={{ marginTop: 8 }}>
                <View style={styles.docInspectBadgeRow}>
                  <Text style={[styles.docInspectTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {selectedDoc.title}
                  </Text>
                  <View
                    style={[
                      styles.docStatusBadge,
                      { backgroundColor: selectedDoc.status === 'Verified' ? '#ECFDF5' : '#FEF3C7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.docStatusText,
                        { color: selectedDoc.status === 'Verified' ? '#10B981' : '#D97706' },
                      ]}
                    >
                      {selectedDoc.status}
                    </Text>
                  </View>
                </View>

                <Text style={styles.docInspectSub}>
                  Submitted by <Text style={{ fontWeight: '700' }}>{selectedDoc.submitter}</Text> • {selectedDoc.timeAgo}
                </Text>

                {/* Simulated Document Preview Card */}
                <View style={[styles.previewPaper, { backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9' }]}>
                  <ShieldCheck size={28} color="#2563EB" />
                  <Text style={[styles.previewTitle, { color: isDarkMode ? '#FFFFFF' : '#1E293B' }]}>
                    Encrypted HR Record
                  </Text>
                  <Text style={styles.previewNotes}>{selectedDoc.notes}</Text>
                  <Text style={styles.previewMeta}>Verified 256-bit SHA Checksum Valid</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleVerifyCurrentDoc}
                  style={styles.modalSubmitBtn}
                >
                  <Text style={styles.modalSubmitBtnText}>
                    {selectedDoc.status === 'Verified' ? 'Confirm Verified' : 'Mark as Verified'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal 4: Employee Profile Preview Modal */}
      <Modal
        visible={!!selectedEmployee}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEmployee(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
            {selectedEmployee && (
              <>
                <View style={styles.modalTopRow}>
                  <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    Employee Profile
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                    <X size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.empProfileHeader}>
                  <Image source={{ uri: selectedEmployee.avatar }} style={styles.empProfileAvatar} />
                  <View style={{ marginLeft: 14 }}>
                    <Text style={[styles.empProfileName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedEmployee.name}
                    </Text>
                    <Text style={styles.empProfileRole}>{selectedEmployee.role}</Text>
                    <Text style={styles.empProfileDept}>
                      {selectedEmployee.department} • Joined {selectedEmployee.date}
                    </Text>
                  </View>
                </View>

                <View style={[styles.empDetailRow, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' }]}>
                  <Text style={styles.empDetailLabel}>Email:</Text>
                  <Text style={[styles.empDetailVal, { color: isDarkMode ? '#FFFFFF' : '#1E293B' }]}>
                    {selectedEmployee.email}
                  </Text>
                </View>

                <View style={[styles.empDetailRow, { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC', marginTop: 8 }]}>
                  <Text style={styles.empDetailLabel}>Status:</Text>
                  <Text style={[styles.empDetailVal, { color: '#10B981', fontWeight: '700' }]}>
                    Active & Compliant
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    setSelectedEmployee(null);
                    onNavigate('Employees');
                  }}
                  style={[styles.modalSubmitBtn, { marginTop: 16 }]}
                >
                  <Text style={styles.modalSubmitBtnText}>View Full Directory Profile</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },
  breadcrumbRow: {
    marginBottom: 6,
  },
  breadcrumbText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  breadcrumbArrow: {
    color: '#94A3B8',
    marginHorizontal: 4,
  },
  breadcrumbActive: {
    color: '#334155',
    fontWeight: '600',
  },
  workspaceHeader: {
    marginBottom: 14,
  },
  workspaceTitle: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  workspaceSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 19,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  addEmployeeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addEmployeeText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
  hrApprovalsBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  hrApprovalsText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  statsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  trendBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  sectionCard: {
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeaderCol: {
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  headerMetaText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  viewDirectoryBtn: {
    paddingVertical: 2,
  },
  viewDirectoryText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  joinersList: {
    marginTop: 4,
  },
  joinerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  joinerBorder: {
    borderBottomWidth: 1,
  },
  joinerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  joinerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  joinerName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  joinerDept: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  joinerDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pendingBadgeText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#D97706',
  },
  docList: {
    gap: 10,
  },
  docCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  docHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  docTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '700',
    marginRight: 8,
  },
  docStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  docStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  docSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  verifyDocBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 14,
  },
  verifyDocBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: {
    width: '100%',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 14,
  },
  modalFieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 10,
    marginBottom: 6,
  },
  modalInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13.5,
  },
  deptChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
    marginBottom: 16,
  },
  deptChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  deptChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  deptChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  deptChipTextActive: {
    color: '#FFFFFF',
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#10B981',
  },
  approvalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
  },
  approvalName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  approvalType: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  approvalActionRow: {
    flexDirection: 'row',
    gap: 6,
  },
  approveBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  rejectBtnText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '700',
  },
  docInspectBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docInspectTitle: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  docInspectSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  previewPaper: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
  },
  previewNotes: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 16,
  },
  previewMeta: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 10,
    fontWeight: '600',
  },
  empProfileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  empProfileAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  empProfileName: {
    fontSize: 16,
    fontWeight: '800',
  },
  empProfileRole: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 1,
  },
  empProfileDept: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  empDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
  },
  empDetailLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  empDetailVal: {
    fontSize: 12.5,
    fontWeight: '600',
  },
});
