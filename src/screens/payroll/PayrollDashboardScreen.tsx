import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  Users,
  Search,
  Download,
  Calendar,
  Layers,
  FileText,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react-native';

interface PayrollDashboardScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface PayrollRow {
  id: string;
  name: string;
  department: string;
  empId: string;
  avatar: string;
  grossSalary: string;
  deductions: string;
  netTakeHome: string;
  paymentMethod: string;
  status: 'Paid' | 'Processing';
}

const INITIAL_ROWS: PayrollRow[] = [
  {
    id: 'pr-1',
    name: 'Rahul Sharma',
    department: 'Engineering',
    empId: 'EMP001',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    grossSalary: '$10,500',
    deductions: '-$2,200',
    netTakeHome: '$8,300',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'pr-2',
    name: 'Priya Singh',
    department: 'Marketing',
    empId: 'EMP002',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    grossSalary: '$12,000',
    deductions: '-$2,600',
    netTakeHome: '$9,400',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'pr-3',
    name: 'Amit Kumar',
    department: 'Finance',
    empId: 'EMP003',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grossSalary: '$9,300',
    deductions: '-$1,950',
    netTakeHome: '$7,350',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'pr-4',
    name: 'Neha Gupta',
    department: 'Human Resources',
    empId: 'EMP004',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    grossSalary: '$7,700',
    deductions: '-$1,520',
    netTakeHome: '$6,180',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
  {
    id: 'pr-5',
    name: 'Sandeep Yadav',
    department: 'Sales',
    empId: 'EMP005',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    grossSalary: '$8,100',
    deductions: '-$1,650',
    netTakeHome: '$6,450',
    paymentMethod: 'Bank Transfer',
    status: 'Paid',
  },
];

export const PayrollDashboardScreen: React.FC<PayrollDashboardScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [rows, setRows] = useState<PayrollRow[]>(INITIAL_ROWS);

  const filteredRows = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.empId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleProcessBatch = () => {
    Alert.alert(
      'Process Batch Payroll',
      'Batch calculation completed for 124 employees. Net disbursement of $212,480 queued to banking gateway.'
    );
  };

  const handleExport = () => {
    Alert.alert('Export Payroll', 'Exporting May 2024 employee payroll register as CSV.');
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
            Payroll & Compensation Engine
          </Text>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Automated salary calculations, statutory tax withholdings, and payslip distribution.
          </Text>
        </View>

        <View style={styles.headerControls}>
          <View
            style={[
              styles.cycleBadge,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Calendar size={14} color="#64748B" />
            <Text
              style={[
                styles.cycleBadgeText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              May 2024 Cycle
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleProcessBatch}
            style={styles.batchBtn}
          >
            <CreditCard size={15} color="#FFFFFF" />
            <Text style={styles.batchBtnText}>Process Batch Payroll</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 Top KPI Stat Cards matching Screenshot 1 */}
      <View style={styles.statsGrid}>
        {/* Total Monthly Payroll */}
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
            <Text style={styles.statLabel}>TOTAL MONTHLY PAYROLL</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
              <DollarSign size={16} color="#3B82F6" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            $248,650
          </Text>
          <View style={styles.trendRow}>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>
                ↗ +4% vs last cycle
              </Text>
            </View>
          </View>
        </View>

        {/* Net Salaries Disbursed */}
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
            <Text style={styles.statLabel}>NET SALARIES DISBURSED</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
              <CreditCard size={16} color="#10B981" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            $212,480
          </Text>
          <View style={styles.trendRow}>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>
                ↗ 100% processed
              </Text>
            </View>
          </View>
        </View>

        {/* Taxes & Deductions */}
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
            <Text style={styles.statLabel}>TAXES & DEDUCTIONS</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#FEF2F2' }]}>
              <TrendingUp size={16} color="#EF4444" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            $36,170
          </Text>
          <View style={styles.trendRow}>
            <View style={[styles.trendBadge, { backgroundColor: '#F0FDF4' }]}>
              <Text style={[styles.trendBadgeText, { color: '#15803D' }]}>
                PF + TDS + Insurance
              </Text>
            </View>
          </View>
        </View>

        {/* Employees Processed */}
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
            <Text style={styles.statLabel}>EMPLOYEES PROCESSED</Text>
            <View style={[styles.statIconBox, { backgroundColor: '#F5F3FF' }]}>
              <Users size={16} color="#8B5CF6" />
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            124 / 124
          </Text>
          <View style={styles.trendRow}>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>
                ↗ 0 pending
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Middle Widgets: Payroll Expenditure Trend & Salary Components */}
      {/* 1. Expenditure Bar Chart */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Payroll Expenditure Trend
        </Text>
        <Text style={styles.cardSub}>6-month salary disbursement trend</Text>

        <View style={styles.barChartContainer}>
          {/* Y Axis Labels */}
          <View style={styles.yAxisCol}>
            <Text style={styles.axisLabel}>$260k</Text>
            <Text style={styles.axisLabel}>$195k</Text>
            <Text style={styles.axisLabel}>$130k</Text>
            <Text style={styles.axisLabel}>$65k</Text>
            <Text style={styles.axisLabel}>$0k</Text>
          </View>

          {/* Bars */}
          <View style={styles.barsArea}>
            {[
              { month: 'Jan', height: 110 },
              { month: 'Feb', height: 115 },
              { month: 'Mar', height: 120 },
              { month: 'Apr', height: 125 },
              { month: 'May', height: 130 },
              { month: 'Jun', height: 132 },
            ].map((b) => (
              <View key={b.month} style={styles.barCol}>
                <View style={styles.barSlot}>
                  <View style={[styles.barFill, { height: b.height }]} />
                </View>
                <Text style={styles.monthLabel}>{b.month}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 2. Salary Components Donut Breakdown */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Salary Components
        </Text>
        <Text style={styles.cardSub}>Breakdown of total expenditure</Text>

        {/* Circular Donut Representation */}
        <View style={styles.donutRow}>
          <View style={styles.donutCircleWrap}>
            <View style={styles.donutCircle}>
              <Text
                style={[
                  styles.donutTotalText,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $248k
              </Text>
              <Text style={styles.donutTotalSub}>TOTAL</Text>
            </View>
          </View>

          {/* Breakdown List */}
          <View style={styles.componentList}>
            <View style={styles.compRow}>
              <View style={styles.compLeft}>
                <View style={[styles.compDot, { backgroundColor: '#3B82F6' }]} />
                <Text
                  style={[
                    styles.compName,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Basic Salary
                </Text>
              </View>
              <Text
                style={[
                  styles.compVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $142,000
              </Text>
            </View>

            <View style={styles.compRow}>
              <View style={styles.compLeft}>
                <View style={[styles.compDot, { backgroundColor: '#10B981' }]} />
                <Text
                  style={[
                    styles.compName,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  House Rent Allowance (HRA)
                </Text>
              </View>
              <Text
                style={[
                  styles.compVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $52,000
              </Text>
            </View>

            <View style={styles.compRow}>
              <View style={styles.compLeft}>
                <View style={[styles.compDot, { backgroundColor: '#F59E0B' }]} />
                <Text
                  style={[
                    styles.compName,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Special Allowances
                </Text>
              </View>
              <Text
                style={[
                  styles.compVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $34,650
              </Text>
            </View>

            <View style={styles.compRow}>
              <View style={styles.compLeft}>
                <View style={[styles.compDot, { backgroundColor: '#8B5CF6' }]} />
                <Text
                  style={[
                    styles.compName,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Performance Bonus
                </Text>
              </View>
              <Text
                style={[
                  styles.compVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $20,000
              </Text>
            </View>

            <View style={styles.compRow}>
              <View style={styles.compLeft}>
                <View style={[styles.compDot, { backgroundColor: '#EF4444' }]} />
                <Text
                  style={[
                    styles.compName,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Deductions & Taxes
                </Text>
              </View>
              <Text
                style={[
                  styles.compVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                $36,170
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* May 2024 Employee Payroll Disbursed Table matching Screenshot 2 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <Text
          style={[
            styles.cardTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: 12 },
          ]}
        >
          May 2024 Employee Payroll Disbursed
        </Text>

        <View style={styles.tableToolbar}>
          <View
            style={[
              styles.searchBar,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Search size={15} color="#94A3B8" />
            <TextInput
              placeholder="Search payslips..."
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
            onPress={handleExport}
            style={[
              styles.exportBtn,
              {
                backgroundColor: isDarkMode ? '#334155' : '#FFFFFF',
                borderColor: isDarkMode ? '#475569' : '#E2E8F0',
              },
            ]}
          >
            <Download size={13} color="#64748B" />
            <Text
              style={[
                styles.exportBtnText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>

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
              <Text style={[styles.th, { width: 170 }]}>EMPLOYEE</Text>
              <Text style={[styles.th, { width: 110 }]}>GROSS SALARY</Text>
              <Text style={[styles.th, { width: 130 }]}>DEDUCTIONS & TAX</Text>
              <Text style={[styles.th, { width: 120 }]}>NET TAKE-HOME</Text>
              <Text style={[styles.th, { width: 120 }]}>PAYMENT METHOD</Text>
              <Text style={[styles.th, { width: 85 }]}>STATUS</Text>
              <Text style={[styles.th, { width: 110, textAlign: 'center' }]}>ACTIONS</Text>
            </View>

            {/* Rows */}
            {filteredRows.map((r) => (
              <View
                key={r.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                {/* Employee */}
                <View style={[styles.empCol, { width: 170 }]}>
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
                    <Text style={styles.empSub}>
                      {r.department} • {r.empId}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.td,
                    { width: 110, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {r.grossSalary}
                </Text>

                <Text style={[styles.td, { width: 130, color: '#EF4444', fontWeight: '700' }]}>
                  {r.deductions}
                </Text>

                <Text style={[styles.td, { width: 120, color: '#10B981', fontWeight: '800' }]}>
                  {r.netTakeHome}
                </Text>

                <Text style={[styles.td, { width: 120, color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                  {r.paymentMethod}
                </Text>

                <View style={{ width: 85 }}>
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>• Paid</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.viewPayslipBtn, { width: 110 }]}
                  onPress={() => onNavigate && onNavigate('Payslips')}
                >
                  <FileText size={13} color="#2563EB" />
                  <Text style={styles.viewPayslipBtnText}>View Payslip</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.paginationRow}>
          <Text style={styles.paginationText}>
            Showing 1 to {filteredRows.length} of 6 entries
          </Text>
          <Text style={styles.pageIndicator}>Page 1 of 2</Text>
        </View>
      </View>
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
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cycleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  cycleBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  batchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    gap: 6,
  },
  batchBtnText: {
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
    marginBottom: 6,
  },
  trendRow: {
    flexDirection: 'row',
  },
  trendBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 16,
  },
  barChartContainer: {
    flexDirection: 'row',
    height: 160,
  },
  yAxisCol: {
    justifyContent: 'space-between',
    paddingBottom: 22,
    paddingRight: 8,
    alignItems: 'flex-end',
  },
  axisLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
  },
  barCol: {
    alignItems: 'center',
    width: 34,
  },
  barSlot: {
    height: 130,
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 20,
    backgroundColor: '#2563EB',
    borderRadius: 4,
  },
  monthLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  donutRow: {
    alignItems: 'center',
    gap: 16,
  },
  donutCircleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutTotalText: {
    fontSize: 17,
    fontWeight: '800',
  },
  donutTotalSub: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  componentList: {
    width: '100%',
    gap: 8,
  },
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  compDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  compName: {
    fontSize: 12,
  },
  compVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  tableToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    gap: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableWrap: {
    minWidth: 840,
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
  empCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  empAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
  paidBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  paidBadgeText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  viewPayslipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    paddingVertical: 5,
    borderRadius: 6,
  },
  viewPayslipBtnText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 10,
  },
  paginationText: {
    fontSize: 12,
    color: '#64748B',
  },
  pageIndicator: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
});
