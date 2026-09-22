import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  X,
  Check,
  Calendar,
  User,
} from 'lucide-react-native';

interface LeaveRequestsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface LeaveRequestItem {
  id: string;
  name: string;
  department: string;
  appliedDate: string;
  avatar: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const INITIAL_REQUESTS: LeaveRequestItem[] = [
  {
    id: 'lr-1',
    name: 'Sarah Wilson',
    department: 'Marketing',
    appliedDate: 'Applied May 18, 2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Annual Leave',
    startDate: '2024-05-27',
    endDate: '2024-05-29',
    durationDays: 3,
    reason: 'Family vacation and personal travel',
    status: 'Pending',
  },
  {
    id: 'lr-2',
    name: 'David Miller',
    department: 'Engineering',
    appliedDate: 'Applied May 16, 2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Sick Leave',
    startDate: '2024-05-20',
    endDate: '2024-05-21',
    durationDays: 2,
    reason: 'Medical appointment & recovery',
    status: 'Approved',
  },
  {
    id: 'lr-3',
    name: 'Elena Rostova',
    department: 'Product',
    appliedDate: 'Applied May 17, 2024',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Casual Leave',
    startDate: '2024-05-24',
    endDate: '2024-05-24',
    durationDays: 1,
    reason: 'Attending family celebration',
    status: 'Pending',
  },
  {
    id: 'lr-4',
    name: 'Marcus Vance',
    department: 'Sales',
    appliedDate: 'Applied May 19, 2024',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    leaveType: 'Annual Leave',
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    durationDays: 5,
    reason: 'Summer holiday with family',
    status: 'Pending',
  },
];

export const LeaveRequestsScreen: React.FC<LeaveRequestsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [requests, setRequests] = useState<LeaveRequestItem[]>(INITIAL_REQUESTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Pending' | 'Approved' | 'Rejected'>('ALL');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  // Form State for Apply on Behalf
  const [behalfName, setBehalfName] = useState('');
  const [behalfDept, setBehalfDept] = useState('Engineering');
  const [behalfType, setBehalfType] = useState('Annual Leave');
  const [behalfStart, setBehalfStart] = useState('2024-06-10');
  const [behalfEnd, setBehalfEnd] = useState('2024-06-12');
  const [behalfReason, setBehalfReason] = useState('');

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;
  const approvedCount = requests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'Rejected').length;

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'ALL' || r.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleApprove = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Approved' } : r))
    );
    Alert.alert('Leave Approved', `Leave request for ${name} has been approved and added to company calendar.`);
  };

  const handleReject = (id: string, name: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    Alert.alert('Leave Rejected', `Leave request for ${name} has been rejected. Quota has been restored.`);
  };

  const handleApplyOnBehalf = () => {
    if (!behalfName.trim()) {
      Alert.alert('Required', 'Please enter employee name.');
      return;
    }

    const newItem: LeaveRequestItem = {
      id: `lr-${Date.now()}`,
      name: behalfName.trim(),
      department: behalfDept,
      appliedDate: 'Applied Today (By HR)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      leaveType: behalfType,
      startDate: behalfStart,
      endDate: behalfEnd,
      durationDays: 3,
      reason: behalfReason.trim() || 'Official Leave Application',
      status: 'Pending',
    };

    setRequests([newItem, ...requests]);
    setApplyModalOpen(false);
    setBehalfName('');
    setBehalfReason('');
    Alert.alert('Request Submitted', `Leave request for ${newItem.name} created successfully.`);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
      ]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Leave Requests Queue
            </Text>
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingBadgeText}>{pendingCount} Pending</Text>
            </View>
          </View>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Review, approve, or reject employee time-off applications and PTO requests.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setApplyModalOpen(true)}
          style={styles.applyBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.applyBtnText}>Apply on Behalf</Text>
        </TouchableOpacity>
      </View>

      {/* 3 Summary Cards matching Screenshot 3 */}
      <View style={styles.statsGrid}>
        {/* Pending Approvals */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>PENDING APPROVALS</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={16} color="#D97706" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {pendingCount}
          </Text>
          <Text style={styles.statSub}>Requires manager / HR sign-off</Text>
        </View>

        {/* Approved This Month */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>APPROVED THIS MONTH</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#DCFCE7' }]}>
              <CheckCircle2 size={16} color="#10B981" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {approvedCount}
          </Text>
          <Text style={styles.statSub}>Scheduled on company calendar</Text>
        </View>

        {/* Rejected / Cancelled */}
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.statTopRow}>
            <Text style={styles.statLabel}>REJECTED / CANCELLED</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#FEE2E2' }]}>
              <XCircle size={16} color="#EF4444" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {rejectedCount}
          </Text>
          <Text style={styles.statSub}>Quota restored to balance</Text>
        </View>
      </View>

      {/* Filter Row: Search & Status Pills */}
      <View style={styles.filterSection}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search employee or leave reason..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          />
        </View>

        {/* Status Filters */}
        <View style={styles.statusPillsRow}>
          {(['ALL', 'Pending', 'Approved', 'Rejected'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => setFilterStatus(s)}
              style={[
                styles.statusFilterPill,
                filterStatus === s && styles.statusFilterPillActive,
                {
                  backgroundColor:
                    filterStatus === s
                      ? '#2563EB'
                      : isDarkMode
                      ? '#1E293B'
                      : '#FFFFFF',
                  borderColor:
                    filterStatus === s
                      ? '#2563EB'
                      : isDarkMode
                      ? '#334155'
                      : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusFilterText,
                  {
                    color:
                      filterStatus === s
                        ? '#FFFFFF'
                        : isDarkMode
                        ? '#CBD5E1'
                        : '#64748B',
                    fontWeight: filterStatus === s ? '700' : '500',
                  },
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Requests Table / Card View */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrap}>
            {/* Table Header */}
            <View
              style={[
                styles.tableHeader,
                {
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.th, { width: 180 }]}>EMPLOYEE</Text>
              <Text style={[styles.th, { width: 110 }]}>LEAVE TYPE</Text>
              <Text style={[styles.th, { width: 140 }]}>DATES & DURATION</Text>
              <Text style={[styles.th, { width: 180 }]}>REASON</Text>
              <Text style={[styles.th, { width: 90 }]}>STATUS</Text>
              <Text style={[styles.th, { width: 140, textAlign: 'center' }]}>ACTIONS</Text>
            </View>

            {/* Rows */}
            {filteredRequests.map((r) => (
              <View
                key={r.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                {/* Employee Info */}
                <View style={[styles.empCell, { width: 180 }]}>
                  <Image source={{ uri: r.avatar }} style={styles.empAvatar} />
                  <View style={styles.empInfo}>
                    <Text
                      style={[
                        styles.empName,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {r.name}
                    </Text>
                    <Text style={styles.empDept}>
                      {r.department} • {r.appliedDate}
                    </Text>
                  </View>
                </View>

                {/* Leave Type */}
                <Text
                  style={[
                    styles.td,
                    { width: 110, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {r.leaveType}
                </Text>

                {/* Dates & Duration */}
                <View style={{ width: 140 }}>
                  <Text style={styles.datesText}>
                    {r.startDate} to {r.endDate}
                  </Text>
                  <Text style={styles.durationLink}>
                    {r.durationDays} day(s)
                  </Text>
                </View>

                {/* Reason */}
                <Text
                  style={[
                    styles.td,
                    { width: 180, color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                  numberOfLines={2}
                >
                  {r.reason}
                </Text>

                {/* Status */}
                <View style={{ width: 90 }}>
                  <View
                    style={[
                      styles.statusBadge,
                      r.status === 'Pending' && { backgroundColor: '#FEF3C7' },
                      r.status === 'Approved' && { backgroundColor: '#DCFCE7' },
                      r.status === 'Rejected' && { backgroundColor: '#FEE2E2' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        r.status === 'Pending' && { color: '#B45309' },
                        r.status === 'Approved' && { color: '#166534' },
                        r.status === 'Rejected' && { color: '#991B1B' },
                      ]}
                    >
                      • {r.status}
                    </Text>
                  </View>
                </View>

                {/* Actions */}
                <View style={[styles.actionRow, { width: 140 }]}>
                  {r.status === 'Pending' ? (
                    <>
                      <TouchableOpacity
                        onPress={() => handleApprove(r.id, r.name)}
                        style={styles.approveBtn}
                      >
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleReject(r.id, r.name)}
                        style={styles.rejectBtn}
                      >
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={styles.processedText}>Processed</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Apply on Behalf Modal */}
      <Modal
        visible={applyModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setApplyModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Apply Leave on Behalf
              </Text>
              <TouchableOpacity onPress={() => setApplyModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee Name</Text>
              <TextInput
                placeholder="e.g. Liam Scott"
                placeholderTextColor="#94A3B8"
                value={behalfName}
                onChangeText={setBehalfName}
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#CBD5E1',
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  },
                ]}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Leave Type</Text>
              <View style={styles.typeRow}>
                {['Annual Leave', 'Sick Leave', 'Casual Leave'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    onPress={() => setBehalfType(t)}
                    style={[
                      styles.typeChip,
                      behalfType === t && styles.typeChipActive,
                      {
                        backgroundColor: behalfType === t ? '#2563EB' : isDarkMode ? '#334155' : '#F1F5F9',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        { color: behalfType === t ? '#FFFFFF' : isDarkMode ? '#E2E8F0' : '#475569' },
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Reason / Notes</Text>
              <TextInput
                placeholder="Brief justification for the leave request..."
                placeholderTextColor="#94A3B8"
                value={behalfReason}
                onChangeText={setBehalfReason}
                multiline
                numberOfLines={3}
                style={[
                  styles.formInput,
                  {
                    height: 70,
                    textAlignVertical: 'top',
                    backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#CBD5E1',
                    color: isDarkMode ? '#F8FAFC' : '#0F172A',
                  },
                ]}
              />
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setApplyModalOpen(false)}
                style={[
                  styles.cancelBtn,
                  { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleApplyOnBehalf}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Submit Application</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
    gap: 12,
  },
  headerTitleGroup: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  pendingBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  pendingBadgeText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '700',
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  statsGrid: {
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#64748B',
  },
  statIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  filterSection: {
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  statusPillsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statusFilterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusFilterPillActive: {},
  statusFilterText: {
    fontSize: 12,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  tableWrap: {
    minWidth: 800,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 6,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  td: {
    fontSize: 12,
  },
  empCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  empAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  empInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  empDept: {
    fontSize: 11,
    color: '#94A3B8',
  },
  datesText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  durationLink: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '700',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  approveBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  rejectBtn: {
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rejectBtnText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '700',
  },
  processedText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  typeChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeChipActive: {},
  typeChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  submitBtn: {
    flex: 1.5,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
