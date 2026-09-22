import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Plus,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  CreditCard,
  Receipt,
  Award,
  X,
  Check,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react-native';

interface AdjustmentsClaimsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface AdjustmentItem {
  id: string;
  employeeName: string;
  department: string;
  adjustmentType: string;
  description: string;
  category: 'Addition' | 'Deduction';
  amount: number;
  effectiveCycle: string;
  status: 'Approved' | 'Pending' | 'Applied';
}

const INITIAL_ADJUSTMENTS: AdjustmentItem[] = [
  {
    id: 'adj-1',
    employeeName: 'David Miller',
    department: 'Engineering',
    adjustmentType: 'Overtime Pay',
    description: '8.0h weekend deployment overtime',
    category: 'Addition',
    amount: 640,
    effectiveCycle: 'May 2024',
    status: 'Approved',
  },
  {
    id: 'adj-2',
    employeeName: 'Sarah Wilson',
    department: 'Marketing',
    adjustmentType: 'Performance Bonus',
    description: 'Q1 Product Launch Spot Award',
    category: 'Addition',
    amount: 1500,
    effectiveCycle: 'May 2024',
    status: 'Approved',
  },
  {
    id: 'adj-3',
    employeeName: 'Elena Rostova',
    department: 'Product',
    adjustmentType: 'Travel Reimbursement',
    description: 'UX Research client visit flight tickets',
    category: 'Addition',
    amount: 420.5,
    effectiveCycle: 'May 2024',
    status: 'Pending',
  },
  {
    id: 'adj-4',
    employeeName: 'Marcus Vance',
    department: 'Operations',
    adjustmentType: 'Health Insurance Adjustment',
    description: 'Voluntary family coverage upgrade',
    category: 'Deduction',
    amount: 120,
    effectiveCycle: 'May 2024',
    status: 'Applied',
  },
];

export const AdjustmentsClaimsScreen: React.FC<AdjustmentsClaimsScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  const [adjustments, setAdjustments] = useState<AdjustmentItem[]>(INITIAL_ADJUSTMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'All' | 'Addition' | 'Deduction'>('All');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [adjustmentType, setAdjustmentType] = useState('Overtime Pay');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Addition' | 'Deduction'>('Addition');
  const [amount, setAmount] = useState('');
  const [effectiveCycle, setEffectiveCycle] = useState('May 2024');

  // Computed metrics
  const totalAdditions = adjustments
    .filter((a) => a.category === 'Addition')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalDeductions = adjustments
    .filter((a) => a.category === 'Deduction')
    .reduce((sum, a) => sum + a.amount, 0);

  const pendingRequests = adjustments.filter((a) => a.status === 'Pending').length;
  const approvedAdditionsCount = adjustments.filter(
    (a) => a.category === 'Addition' && (a.status === 'Approved' || a.status === 'Applied')
  ).length;

  const filteredAdjustments = adjustments.filter((item) => {
    const matchesCategory =
      filterCategory === 'All' ? true : item.category === filterCategory;
    const matchesSearch =
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.adjustmentType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Remove Adjustment',
      `Are you sure you want to delete the adjustment for ${name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setAdjustments((prev) => prev.filter((item) => item.id !== id));
          },
        },
      ]
    );
  };

  const handleToggleStatus = (id: string) => {
    setAdjustments((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStatus =
            item.status === 'Pending'
              ? 'Approved'
              : item.status === 'Approved'
              ? 'Applied'
              : 'Approved';
          return { ...item, status: nextStatus };
        }
        return item;
      })
    );
  };

  const handleAddAdjustment = () => {
    if (!employeeName.trim()) {
      Alert.alert('Required', 'Please enter employee name.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid positive number.');
      return;
    }

    const newItem: AdjustmentItem = {
      id: `adj-${Date.now()}`,
      employeeName: employeeName.trim(),
      department,
      adjustmentType,
      description: description.trim() || `${adjustmentType} logged by HR Admin`,
      category,
      amount: parsedAmount,
      effectiveCycle: effectiveCycle || 'May 2024',
      status: 'Approved',
    };

    setAdjustments([newItem, ...adjustments]);
    setModalOpen(false);
    // Reset
    setEmployeeName('');
    setAmount('');
    setDescription('');
    Alert.alert('Success', `Adjustment for ${newItem.employeeName} added successfully.`);
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, isDarkMode && styles.textWhite]}>
            Salary Adjustments & Claims
          </Text>
          <Text style={[styles.headerSubtitle, isDarkMode && styles.textMutedDark]}>
            Manage variable pay, spot bonuses, overtime compensation, expense claims, and customized deductions.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          activeOpacity={0.8}
          onPress={() => setModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Adjustment</Text>
        </TouchableOpacity>
      </View>

      {/* KPI METRICS (3 CARDS) */}
      <View style={styles.kpiGrid}>
        {/* Card 1: Total Additions */}
        <View style={[styles.kpiCard, isDarkMode && styles.cardDark]}>
          <View style={styles.kpiCardHeader}>
            <Text style={[styles.kpiCardLabel, isDarkMode && styles.textMutedDark]}>
              TOTAL ADDITIONS / BONUSES
            </Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Award size={18} color="#16A34A" />
            </View>
          </View>
          <Text style={[styles.kpiValue, { color: '#16A34A' }]}>
            +${totalAdditions.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </Text>
          <Text style={[styles.kpiSubtitle, isDarkMode && styles.textMutedDark]}>
            {approvedAdditionsCount} Approved additions for May cycle
          </Text>
        </View>

        {/* Card 2: Total Custom Deductions */}
        <View style={[styles.kpiCard, isDarkMode && styles.cardDark]}>
          <View style={styles.kpiCardHeader}>
            <Text style={[styles.kpiCardLabel, isDarkMode && styles.textMutedDark]}>
              TOTAL CUSTOM DEDUCTIONS
            </Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <Receipt size={18} color="#DC2626" />
            </View>
          </View>
          <Text style={[styles.kpiValue, { color: '#DC2626' }]}>
            -${totalDeductions.toLocaleString('en-US')}
          </Text>
          <Text style={[styles.kpiSubtitle, isDarkMode && styles.textMutedDark]}>
            Voluntary benefit additions
          </Text>
        </View>

        {/* Card 3: Pending Review */}
        <View style={[styles.kpiCard, isDarkMode && styles.cardDark]}>
          <View style={styles.kpiCardHeader}>
            <Text style={[styles.kpiCardLabel, isDarkMode && styles.textMutedDark]}>
              PENDING REVIEW
            </Text>
            <View style={[styles.kpiIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <CreditCard size={18} color="#D97706" />
            </View>
          </View>
          <Text style={[styles.kpiValue, isDarkMode && styles.textWhite]}>
            {pendingRequests} Request{pendingRequests !== 1 ? 's' : ''}
          </Text>
          <Text style={[styles.kpiSubtitle, isDarkMode && styles.textMutedDark]}>
            Requires finance confirmation
          </Text>
        </View>
      </View>

      {/* FILTER & SEARCH BAR */}
      <View style={[styles.searchFilterCard, isDarkMode && styles.cardDark]}>
        <View style={styles.filterTopRow}>
          {/* Search Box */}
          <View style={[styles.searchBox, isDarkMode && styles.searchBoxDark]}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={[styles.searchInput, isDarkMode && styles.textWhite]}
              placeholder="Search employee or adjustment type..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            <TouchableOpacity
              style={[
                styles.filterPill,
                filterCategory === 'All' && styles.filterPillActive,
                filterCategory !== 'All' && isDarkMode && styles.filterPillInactiveDark,
              ]}
              onPress={() => setFilterCategory('All')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterCategory === 'All' && styles.filterPillTextActive,
                ]}
              >
                All Adjustments
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterCategory === 'Addition' && styles.filterPillActive,
                filterCategory !== 'Addition' && isDarkMode && styles.filterPillInactiveDark,
              ]}
              onPress={() => setFilterCategory('Addition')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterCategory === 'Addition' && styles.filterPillTextActive,
                ]}
              >
                Additions
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterPill,
                filterCategory === 'Deduction' && styles.filterPillActive,
                filterCategory !== 'Deduction' && isDarkMode && styles.filterPillInactiveDark,
              ]}
              onPress={() => setFilterCategory('Deduction')}
            >
              <Text
                style={[
                  styles.filterPillText,
                  filterCategory === 'Deduction' && styles.filterPillTextActive,
                ]}
              >
                Deductions
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ADJUSTMENTS TABLE & LIST */}
      <View style={[styles.tableContainer, isDarkMode && styles.cardDark]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 720 }}>
            {/* Table Header */}
            <View style={[styles.tableHeaderRow, isDarkMode && styles.tableHeaderRowDark]}>
              <Text style={[styles.thCol, { width: 150 }]}>EMPLOYEE</Text>
              <Text style={[styles.thCol, { width: 220 }]}>ADJUSTMENT TYPE</Text>
              <Text style={[styles.thCol, { width: 100 }]}>CATEGORY</Text>
              <Text style={[styles.thCol, { width: 100 }]}>AMOUNT</Text>
              <Text style={[styles.thCol, { width: 120 }]}>EFFECTIVE CYCLE</Text>
              <Text style={[styles.thCol, { width: 100 }]}>STATUS</Text>
              <Text style={[styles.thCol, { width: 70, textAlign: 'center' }]}>ACTIONS</Text>
            </View>

            {/* Rows */}
            {filteredAdjustments.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, isDarkMode && styles.textMutedDark]}>
                  No salary adjustments match the search criteria.
                </Text>
              </View>
            ) : (
              filteredAdjustments.map((item, index) => {
                const isAddition = item.category === 'Addition';
                const isPending = item.status === 'Pending';
                const isApproved = item.status === 'Approved';

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && (isDarkMode ? styles.rowEvenDark : styles.rowEvenLight),
                      isDarkMode && styles.tableRowDark,
                    ]}
                  >
                    {/* Employee */}
                    <View style={{ width: 150 }}>
                      <Text style={[styles.empName, isDarkMode && styles.textWhite]}>
                        {item.employeeName}
                      </Text>
                      <Text style={[styles.empDept, isDarkMode && styles.textMutedDark]}>
                        {item.department}
                      </Text>
                    </View>

                    {/* Adjustment Type & Description */}
                    <View style={{ width: 220, paddingRight: 12 }}>
                      <Text style={[styles.adjType, isDarkMode && styles.textWhite]}>
                        {item.adjustmentType}
                      </Text>
                      <Text
                        style={[styles.adjDesc, isDarkMode && styles.textMutedDark]}
                        numberOfLines={1}
                      >
                        {item.description}
                      </Text>
                    </View>

                    {/* Category Badge */}
                    <View style={{ width: 100 }}>
                      <View
                        style={[
                          styles.categoryBadge,
                          isAddition ? styles.categoryAddition : styles.categoryDeduction,
                        ]}
                      >
                        <Text
                          style={[
                            styles.categoryBadgeText,
                            isAddition
                              ? { color: '#16A34A' }
                              : { color: '#DC2626' },
                          ]}
                        >
                          {item.category}
                        </Text>
                      </View>
                    </View>

                    {/* Amount */}
                    <View style={{ width: 100 }}>
                      <Text
                        style={[
                          styles.amountText,
                          isAddition ? { color: '#16A34A' } : { color: '#DC2626' },
                        ]}
                      >
                        {isAddition ? '+' : '-'}${item.amount.toLocaleString('en-US', { minimumFractionDigits: item.amount % 1 !== 0 ? 1 : 0 })}
                      </Text>
                    </View>

                    {/* Effective Cycle */}
                    <View style={{ width: 120 }}>
                      <Text style={[styles.cycleText, isDarkMode && styles.textWhite]}>
                        {item.effectiveCycle}
                      </Text>
                    </View>

                    {/* Status Badge */}
                    <View style={{ width: 100 }}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => handleToggleStatus(item.id)}
                        style={[
                          styles.statusBadge,
                          isPending
                            ? styles.statusPending
                            : styles.statusApproved,
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            { backgroundColor: isPending ? '#D97706' : '#16A34A' },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: isPending ? '#D97706' : '#16A34A' },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Actions */}
                    <View style={{ width: 70, alignItems: 'center' }}>
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => handleDelete(item.id, item.employeeName)}
                        style={styles.deleteBtn}
                      >
                        <Trash2 size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      {/* MODAL: ADD ADJUSTMENT */}
      <Modal
        visible={modalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDarkMode && styles.modalCardDark]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                  Create Salary Adjustment
                </Text>
                <Text style={[styles.modalSubtitle, isDarkMode && styles.textMutedDark]}>
                  Add custom variable bonus, overtime, or statutory deduction.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setModalOpen(false)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Modal Body Form */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Category Selector */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Category Type
                </Text>
                <View style={styles.categoryToggleRow}>
                  <TouchableOpacity
                    style={[
                      styles.categoryToggleBtn,
                      category === 'Addition' && styles.categoryToggleBtnActiveGreen,
                    ]}
                    onPress={() => setCategory('Addition')}
                  >
                    <ArrowUpRight
                      size={16}
                      color={category === 'Addition' ? '#FFFFFF' : '#16A34A'}
                    />
                    <Text
                      style={[
                        styles.categoryToggleText,
                        category === 'Addition' && styles.categoryToggleTextActive,
                      ]}
                    >
                      Addition / Bonus
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.categoryToggleBtn,
                      category === 'Deduction' && styles.categoryToggleBtnActiveRed,
                    ]}
                    onPress={() => setCategory('Deduction')}
                  >
                    <ArrowDownRight
                      size={16}
                      color={category === 'Deduction' ? '#FFFFFF' : '#DC2626'}
                    />
                    <Text
                      style={[
                        styles.categoryToggleText,
                        category === 'Deduction' && styles.categoryToggleTextActive,
                      ]}
                    >
                      Custom Deduction
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Employee Name */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Employee Name *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Alex Morgan"
                  placeholderTextColor="#94A3B8"
                  value={employeeName}
                  onChangeText={setEmployeeName}
                />
              </View>

              {/* Department */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Department
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Engineering, Sales, Marketing"
                  placeholderTextColor="#94A3B8"
                  value={department}
                  onChangeText={setDepartment}
                />
              </View>

              {/* Adjustment Type */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Adjustment Type *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Overtime Pay, Spot Bonus, Travel Reimbursement"
                  placeholderTextColor="#94A3B8"
                  value={adjustmentType}
                  onChangeText={setAdjustmentType}
                />
              </View>

              {/* Amount ($) */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Amount (USD $) *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. 500"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                />
              </View>

              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Notes / Description
                </Text>
                <TextInput
                  style={[
                    styles.formInput,
                    { height: 70, textAlignVertical: 'top' },
                    isDarkMode && styles.formInputDark,
                  ]}
                  placeholder="Reason for adjustment or transaction reference"
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              {/* Effective Cycle */}
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Effective Cycle
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={effectiveCycle}
                  onChangeText={setEffectiveCycle}
                />
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalOpen(false)}
              >
                <Text style={[styles.cancelBtnText, isDarkMode && styles.textWhite]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.8}
                onPress={handleAddAdjustment}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Save Adjustment</Text>
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
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 260,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // KPI METRICS
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  kpiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  kpiCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  kpiIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  kpiSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },

  // FILTER & SEARCH
  searchFilterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  filterTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
  },
  searchBox: {
    flex: 1,
    minWidth: 240,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchBoxDark: {
    backgroundColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterPillInactiveDark: {
    backgroundColor: '#334155',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },

  // TABLE
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderRowDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  thCol: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowDark: {
    borderBottomColor: '#334155',
  },
  rowEvenLight: {
    backgroundColor: '#FAFCFF',
  },
  rowEvenDark: {
    backgroundColor: '#1B2638',
  },
  empName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  empDept: {
    fontSize: 11,
    color: '#64748B',
  },
  adjType: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 2,
  },
  adjDesc: {
    fontSize: 11,
    color: '#64748B',
  },
  categoryBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryAddition: {
    backgroundColor: '#DCFCE7',
  },
  categoryDeduction: {
    backgroundColor: '#FEE2E2',
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
  },
  cycleText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#475569',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusPending: {
    backgroundColor: '#FEF3C7',
  },
  statusApproved: {
    backgroundColor: '#DCFCE7',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 6,
    borderRadius: 6,
  },
  emptyWrap: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  categoryToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
  },
  categoryToggleBtnActiveGreen: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  categoryToggleBtnActiveRed: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  categoryToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryToggleTextActive: {
    color: '#FFFFFF',
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  formInputDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    color: '#F8FAFC',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // UTILS
  textWhite: {
    color: '#F8FAFC',
  },
  textMutedDark: {
    color: '#94A3B8',
  },
});
