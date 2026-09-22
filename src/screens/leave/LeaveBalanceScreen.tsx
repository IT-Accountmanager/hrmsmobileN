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
  Palmtree,
  Shield,
  Zap,
  Heart,
  Download,
  Search,
  ChevronDown,
  Check,
  X,
} from 'lucide-react-native';

interface LeaveBalanceScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface EmployeeQuota {
  id: string;
  name: string;
  department: string;
  empId: string;
  avatar: string;
  annualLeft: number;
  annualUsed: number;
  sickLeft: number;
  sickUsed: number;
  casualLeft: number;
  casualUsed: number;
  totalAvailable: number;
}

const INITIAL_QUOTAS: EmployeeQuota[] = [
  {
    id: 'eq-1',
    name: 'Sarah Wilson',
    department: 'Marketing',
    empId: 'EMP-001',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    annualLeft: 18,
    annualUsed: 6,
    sickLeft: 11,
    sickUsed: 1,
    casualLeft: 8,
    casualUsed: 2,
    totalAvailable: 37,
  },
  {
    id: 'eq-2',
    name: 'David Miller',
    department: 'Engineering',
    empId: 'EMP-002',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    annualLeft: 10,
    annualUsed: 14,
    sickLeft: 9,
    sickUsed: 3,
    casualLeft: 6,
    casualUsed: 4,
    totalAvailable: 25,
  },
  {
    id: 'eq-3',
    name: 'Elena Rostova',
    department: 'Product',
    empId: 'EMP-003',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    annualLeft: 16,
    annualUsed: 8,
    sickLeft: 12,
    sickUsed: 0,
    casualLeft: 9,
    casualUsed: 1,
    totalAvailable: 37,
  },
];

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Marketing',
  'Product',
  'Sales',
  'Finance',
];

export const LeaveBalanceScreen: React.FC<LeaveBalanceScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [quotas, setQuotas] = useState<EmployeeQuota[]>(INITIAL_QUOTAS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [deptModalOpen, setDeptModalOpen] = useState(false);

  const filteredQuotas = quotas.filter((q) => {
    const matchesSearch =
      q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.empId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDept === 'All Departments' ||
      q.department.toLowerCase() === selectedDept.toLowerCase();

    return matchesSearch && matchesDept;
  });

  const handleExport = () => {
    Alert.alert('Export Balances', 'Exporting organization leave balances CSV report.');
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
          <Text
            style={[
              styles.screenTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Leave Quotas & Balances
          </Text>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Annual entitlement tracking, utilized PTO, sick days, and policy carry-forward balances.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleExport}
          style={[
            styles.exportBtn,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Download size={14} color="#64748B" />
          <Text
            style={[
              styles.exportBtnText,
              { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
            ]}
          >
            Export Balances CSV
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4 Policy Quota Cards matching Screenshot 4 */}
      <View style={styles.policyGrid}>
        {/* Annual Leave */}
        <View
          style={[
            styles.policyCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.policyHeader}>
            <Text style={styles.policyName}>Annual Leave</Text>
            <View style={[styles.policyIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Palmtree size={16} color="#3B82F6" />
            </View>
          </View>
          <View style={styles.policyValRow}>
            <Text
              style={[
                styles.policyNum,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              24
            </Text>
            <Text style={styles.policyUnit}>days/year allocated</Text>
          </View>
          <View
            style={[
              styles.policyFooter,
              { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
            ]}
          >
            <Text style={styles.avgText}>Avg Used: 6.2d</Text>
            <Text style={styles.policyBadge}>Up to 5 days</Text>
          </View>
        </View>

        {/* Sick Leave */}
        <View
          style={[
            styles.policyCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.policyHeader}>
            <Text style={styles.policyName}>Sick Leave</Text>
            <View style={[styles.policyIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <Shield size={16} color="#10B981" />
            </View>
          </View>
          <View style={styles.policyValRow}>
            <Text
              style={[
                styles.policyNum,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              12
            </Text>
            <Text style={styles.policyUnit}>days/year allocated</Text>
          </View>
          <View
            style={[
              styles.policyFooter,
              { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
            ]}
          >
            <Text style={styles.avgText}>Avg Used: 2.1d</Text>
            <Text style={styles.policyBadge}>No rollover</Text>
          </View>
        </View>

        {/* Casual Leave */}
        <View
          style={[
            styles.policyCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.policyHeader}>
            <Text style={styles.policyName}>Casual Leave</Text>
            <View style={[styles.policyIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Zap size={16} color="#F59E0B" />
            </View>
          </View>
          <View style={styles.policyValRow}>
            <Text
              style={[
                styles.policyNum,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              10
            </Text>
            <Text style={styles.policyUnit}>days/year allocated</Text>
          </View>
          <View
            style={[
              styles.policyFooter,
              { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
            ]}
          >
            <Text style={styles.avgText}>Avg Used: 3.5d</Text>
            <Text style={styles.policyBadge}>No rollover</Text>
          </View>
        </View>

        {/* Parental Leave */}
        <View
          style={[
            styles.policyCard,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#F1F5F9',
            },
          ]}
        >
          <View style={styles.policyHeader}>
            <Text style={styles.policyName}>Parental Leave</Text>
            <View style={[styles.policyIconWrap, { backgroundColor: '#F5F3FF' }]}>
              <Heart size={16} color="#8B5CF6" />
            </View>
          </View>
          <View style={styles.policyValRow}>
            <Text
              style={[
                styles.policyNum,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              60
            </Text>
            <Text style={styles.policyUnit}>days/year allocated</Text>
          </View>
          <View
            style={[
              styles.policyFooter,
              { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
            ]}
          >
            <Text style={styles.avgText}>Avg Used: 0d</Text>
            <Text style={styles.policyBadge}>Upon eligibility</Text>
          </View>
        </View>
      </View>

      {/* Filter Row: Search & Department Dropdown */}
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
            placeholder="Search employee or department..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDeptModalOpen(true)}
          style={[
            styles.deptBtn,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              styles.deptBtnText,
              { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
            ]}
          >
            {selectedDept}
          </Text>
          <ChevronDown size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Employee Quota Table Card */}
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
            {/* Header */}
            <View
              style={[
                styles.tableHeader,
                {
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.th, { width: 170 }]}>EMPLOYEE</Text>
              <Text style={[styles.th, { width: 150 }]}>ANNUAL LEAVE (24D)</Text>
              <Text style={[styles.th, { width: 150 }]}>SICK LEAVE (12D)</Text>
              <Text style={[styles.th, { width: 150 }]}>CASUAL LEAVE (10D)</Text>
              <Text style={[styles.th, { width: 140 }]}>TOTAL REMAINING</Text>
            </View>

            {/* Rows */}
            {filteredQuotas.map((q) => (
              <View
                key={q.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                {/* Employee */}
                <View style={[styles.empCol, { width: 170 }]}>
                  <Image source={{ uri: q.avatar }} style={styles.empAvatar} />
                  <View style={styles.empInfo}>
                    <Text
                      style={[
                        styles.empName,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {q.name}
                    </Text>
                    <Text style={styles.empSub}>
                      {q.department} • {q.empId}
                    </Text>
                  </View>
                </View>

                {/* Annual Leave */}
                <View style={{ width: 150, paddingRight: 12 }}>
                  <View style={styles.cellTopRow}>
                    <Text style={[styles.daysLeftText, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>
                      {q.annualLeft} left
                    </Text>
                    <Text style={styles.daysUsedText}>{q.annualUsed} used</Text>
                  </View>
                  <View style={styles.progressLineTrack}>
                    <View style={[styles.progressLineFill, { width: `${(q.annualLeft / 24) * 100}%`, backgroundColor: '#3B82F6' }]} />
                  </View>
                </View>

                {/* Sick Leave */}
                <View style={{ width: 150, paddingRight: 12 }}>
                  <View style={styles.cellTopRow}>
                    <Text style={[styles.daysLeftText, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>
                      {q.sickLeft} left
                    </Text>
                    <Text style={styles.daysUsedText}>{q.sickUsed} used</Text>
                  </View>
                  <View style={styles.progressLineTrack}>
                    <View style={[styles.progressLineFill, { width: `${(q.sickLeft / 12) * 100}%`, backgroundColor: '#10B981' }]} />
                  </View>
                </View>

                {/* Casual Leave */}
                <View style={{ width: 150, paddingRight: 12 }}>
                  <View style={styles.cellTopRow}>
                    <Text style={[styles.daysLeftText, { color: isDarkMode ? '#F8FAFC' : '#0F172A' }]}>
                      {q.casualLeft} left
                    </Text>
                    <Text style={styles.daysUsedText}>{q.casualUsed} used</Text>
                  </View>
                  <View style={styles.progressLineTrack}>
                    <View style={[styles.progressLineFill, { width: `${(q.casualLeft / 10) * 100}%`, backgroundColor: '#F59E0B' }]} />
                  </View>
                </View>

                {/* Total Remaining */}
                <View style={{ width: 140 }}>
                  <Text style={styles.totalAvailableText}>
                    {q.totalAvailable} Days Available
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Department Filter Modal */}
      <Modal
        visible={deptModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDeptModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDeptModalOpen(false)}
        >
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
                Filter by Department
              </Text>
              <TouchableOpacity onPress={() => setDeptModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.deptOptionRow,
                  selectedDept === dept && { backgroundColor: isDarkMode ? '#334155' : '#EFF6FF' },
                ]}
                onPress={() => {
                  setSelectedDept(dept);
                  setDeptModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.deptOptionText,
                    {
                      color: selectedDept === dept ? '#2563EB' : isDarkMode ? '#E2E8F0' : '#334155',
                      fontWeight: selectedDept === dept ? '700' : '500',
                    },
                  ]}
                >
                  {dept}
                </Text>
                {selectedDept === dept && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
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
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    alignSelf: 'flex-start',
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  policyGrid: {
    gap: 10,
    marginBottom: 16,
  },
  policyCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  policyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  policyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  policyIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  policyValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 10,
  },
  policyNum: {
    fontSize: 22,
    fontWeight: '800',
  },
  policyUnit: {
    fontSize: 12,
    color: '#94A3B8',
  },
  policyFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
  },
  avgText: {
    fontSize: 11,
    color: '#64748B',
  },
  policyBadge: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
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
  deptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 40,
  },
  deptBtnText: {
    fontSize: 13,
    fontWeight: '600',
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
    minWidth: 760,
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
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  empCol: {
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
  empSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  cellTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  daysLeftText: {
    fontSize: 12,
    fontWeight: '700',
  },
  daysUsedText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  progressLineTrack: {
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressLineFill: {
    height: '100%',
    borderRadius: 2,
  },
  totalAvailableText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '800',
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
    maxWidth: 320,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  deptOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  deptOptionText: {
    fontSize: 13,
  },
});
