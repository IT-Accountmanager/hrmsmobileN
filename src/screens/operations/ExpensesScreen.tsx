import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import {
  Receipt,
  Plus,
  DollarSign,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Check,
  X,
  FileText,
  Filter,
} from 'lucide-react-native';

interface ExpenseItem {
  id: string;
  employeeName: string;
  department: string;
  category: 'Software' | 'Travel' | 'Meals' | 'Hardware' | string;
  amount: number;
  date: string;
  description: string;
  status: 'Approved' | 'Reimbursed' | 'Pending' | 'Rejected';
  approvedBy?: string;
}

const INITIAL_EXPENSE_ITEMS: ExpenseItem[] = [
  {
    id: 'exp-1',
    employeeName: 'Rahul Sharma',
    department: 'Core Platform Engineering',
    category: 'Software',
    amount: 240,
    date: 'May 14, 2024',
    description: 'JetBrains All Products Pack annual developer license',
    status: 'Approved',
    approvedBy: 'Amit Verma',
  },
  {
    id: 'exp-2',
    employeeName: 'Priya Singh',
    department: 'Q7 Marketing Campaigns',
    category: 'Travel',
    amount: 1250,
    date: 'May 10, 2024',
    description: 'Flight and accommodation for SaaS Growth Summit Conference',
    status: 'Reimbursed',
    approvedBy: 'Sarah Jenkins',
  },
  {
    id: 'exp-3',
    employeeName: 'Sandeep Yadav',
    department: 'Enterprise Accounts',
    category: 'Meals',
    amount: 185,
    date: 'May 18, 2024',
    description: 'Client dinner with Enterprise Prospect procurement leads',
    status: 'Pending',
  },
];

export const ExpensesScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSE_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New Claim Form State
  const [claimEmp, setClaimEmp] = useState('Sarah Jenkins');
  const [claimDept, setClaimDept] = useState('Human Resources');
  const [claimCat, setClaimCat] = useState('Software');
  const [claimAmount, setClaimAmount] = useState('');
  const [claimDesc, setClaimDesc] = useState('');

  const totalVolume = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const reimbursedTotal = expenses
    .filter((e) => e.status === 'Reimbursed')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingCount = expenses.filter((e) => e.status === 'Pending').length;

  const filteredExpenses = expenses.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.employeeName.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  });

  const handleApprove = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: 'Approved', approvedBy: 'You (HR Admin)' } : e
      )
    );
    Alert.alert('Claim Approved', 'Expense claim approved for reimbursement disbursement.');
  };

  const handleReject = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Rejected' } : e))
    );
    Alert.alert('Claim Rejected', 'Expense claim has been rejected.');
  };

  const handleCreateClaim = () => {
    const amt = parseFloat(claimAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Validation Error', 'Please enter a valid expense amount.');
      return;
    }
    const newClaim: ExpenseItem = {
      id: `exp-${Date.now()}`,
      employeeName: claimEmp,
      department: claimDept,
      category: claimCat,
      amount: amt,
      date: 'May 20, 2024',
      description: claimDesc || 'Business expenditure reimbursement request.',
      status: 'Pending',
    };
    setExpenses([newClaim, ...expenses]);
    setModalOpen(false);
    setClaimAmount('');
    setClaimDesc('');
    Alert.alert('Claim Submitted', 'Your expense claim has been logged for review.');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#0B1120' : '#F8FAFC' }]}
    >
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleCol}>
          <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Expense Claims & Reimbursements
          </Text>
          <Text style={styles.screenSubtitle}>
            Submit business expenditure claims, review receipts, and disburse reimbursements.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalOpen(true)}
          style={styles.submitClaimBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.submitClaimBtnText}>Submit Expense Claim</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Top Metric Cards (3 Cards matching Screenshot 3) */}
      <View style={styles.statsGrid}>
        {/* Total Claims Volume */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>TOTAL CLAIMS VOLUME</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <DollarSign size={16} color="#2563EB" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            ${totalVolume.toLocaleString()}
          </Text>
        </View>

        {/* Reimbursed to Date */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>REIMBURSED TO DATE</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <CheckCircle2 size={16} color="#10B981" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            ${reimbursedTotal.toLocaleString()}
          </Text>
        </View>

        {/* Pending Approval */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>PENDING APPROVAL</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={16} color="#D97706" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            {pendingCount}
          </Text>
        </View>
      </View>

      {/* 3. Search & Export Bar */}
      <View style={styles.searchExportRow}>
        <View
          style={[
            styles.searchBox,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
          ]}
        >
          <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search expense claims..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => Alert.alert('Export Triggered', 'Expense report CSV package is being prepared for download.')}
          style={[
            styles.exportBtn,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
          ]}
        >
          <Download size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={[styles.exportBtnText, { color: isDarkMode ? '#FFFFFF' : '#334155' }]}>
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Expense Claims List */}
      <View style={styles.claimsList}>
        {filteredExpenses.map((item) => {
          const isPending = item.status === 'Pending';
          const isApproved = item.status === 'Approved';
          const isReimbursed = item.status === 'Reimbursed';

          return (
            <View
              key={item.id}
              style={[
                styles.claimCard,
                { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
              ]}
            >
              {/* Header: Employee info + Category Badge */}
              <View style={styles.cardTopRow}>
                <View style={styles.empRow}>
                  <View style={styles.empAvatar}>
                    <Text style={styles.empAvatarText}>{item.employeeName[0]}</Text>
                  </View>
                  <View>
                    <Text style={[styles.empName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {item.employeeName}
                    </Text>
                    <Text style={styles.empDept}>{item.department}</Text>
                  </View>
                </View>

                {/* Category Badge */}
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{item.category}</Text>
                </View>
              </View>

              {/* Amount & Date Banner */}
              <View style={styles.amountDateRow}>
                <View>
                  <Text style={styles.amountLabel}>AMOUNT</Text>
                  <Text style={[styles.amountValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    ${item.amount.toLocaleString()}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.amountLabel}>EXPENSE DATE</Text>
                  <Text style={[styles.dateValue, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                    {item.date}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text style={styles.descText}>{item.description}</Text>

              {/* Footer: Status + Action */}
              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    isApproved && styles.statusApproved,
                    isReimbursed && styles.statusReimbursed,
                    isPending && styles.statusPending,
                    item.status === 'Rejected' && styles.statusRejected,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isApproved && { color: '#6366F1' },
                      isReimbursed && { color: '#10B981' },
                      isPending && { color: '#D97706' },
                      item.status === 'Rejected' && { color: '#EF4444' },
                    ]}
                  >
                    • {item.status}
                  </Text>
                </View>

                {/* Action Column */}
                {isPending ? (
                  <View style={styles.pendingActionBtns}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleApprove(item.id)}
                      style={styles.approveBtn}
                    >
                      <Check size={16} color="#10B981" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleReject(item.id)}
                      style={styles.rejectBtn}
                    >
                      <X size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={styles.actionNote}>
                    {item.approvedBy ? `By ${item.approvedBy}` : 'Processed'}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* 5. Submit Expense Claim Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
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
                  Submit Expense Claim
                </Text>
                <Text style={styles.modalSub}>
                  Upload receipts and provide documentation for corporate reimbursement.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ marginBottom: 10 }}>
              <Text style={styles.inputLabel}>Employee Name</Text>
              <TextInput
                value={claimEmp}
                onChangeText={setClaimEmp}
                placeholder="Employee Name"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Category</Text>
              <TextInput
                value={claimCat}
                onChangeText={setClaimCat}
                placeholder="Software, Travel, Meals, Hardware"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Amount (USD) *</Text>
              <TextInput
                value={claimAmount}
                onChangeText={setClaimAmount}
                placeholder="0.00"
                keyboardType="decimal-pad"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Description & Purpose</Text>
              <TextInput
                value={claimDesc}
                onChangeText={setClaimDesc}
                placeholder="Provide details of purchase, vendor, or project code..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                style={[
                  styles.formTextarea,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCreateClaim}
                style={styles.modalSubmitBtn}
              >
                <Text style={styles.modalSubmitBtnText}>Submit for Approval</Text>
              </TouchableOpacity>
            </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  titleCol: {
    flex: 1,
    minWidth: 240,
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
  submitClaimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.md,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitClaimBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    padding: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
  },
  searchExportRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 0,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    height: 42,
  },
  exportBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  claimsList: {
    gap: 12,
  },
  claimCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  empRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  empAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  empAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  empName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  empDept: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  catBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  catBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  amountDateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    padding: 10,
    borderRadius: radii.md,
    marginBottom: 10,
  },
  amountLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '900',
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  descText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusApproved: {
    backgroundColor: '#EEF2FF',
  },
  statusReimbursed: {
    backgroundColor: '#ECFDF5',
  },
  statusPending: {
    backgroundColor: '#FFFBEB',
  },
  statusRejected: {
    backgroundColor: '#FEF2F2',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  pendingActionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  approveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionNote: {
    fontSize: 11,
    color: '#64748B',
    fontStyle: 'italic',
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
    maxHeight: '85%',
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
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 5,
    marginTop: 10,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
  },
  formTextarea: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 70,
    fontSize: 13,
    textAlignVertical: 'top',
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
