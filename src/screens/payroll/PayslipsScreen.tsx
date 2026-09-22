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
  Search,
  Download,
  FileText,
  X,
  CheckCircle2,
  Building,
  Calendar,
  CreditCard,
  Printer,
  Share2,
} from 'lucide-react-native';

interface PayslipsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface PayslipArchiveItem {
  id: string;
  monthCycle: string;
  employeeName: string;
  department: string;
  empId: string;
  grossSalary: string;
  totalDeductions: string;
  netTakeHome: string;
  paymentDate: string;
  status: 'PAID' | 'PENDING';
  basicPay: string;
  hra: string;
  specialAllowance: string;
  pf: string;
  tax: string;
}

const INITIAL_ARCHIVE: PayslipArchiveItem[] = [
  {
    id: 'ps-1',
    monthCycle: 'May 2024',
    employeeName: 'Rahul Sharma',
    department: 'Engineering',
    empId: 'EMP001',
    grossSalary: '$10,500',
    totalDeductions: '-$2,200',
    netTakeHome: '$8,300',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$6,000',
    hra: '$2,500',
    specialAllowance: '$2,000',
    pf: '$1,200',
    tax: '$1,000',
  },
  {
    id: 'ps-2',
    monthCycle: 'May 2024',
    employeeName: 'Priya Singh',
    department: 'Marketing',
    empId: 'EMP002',
    grossSalary: '$12,000',
    totalDeductions: '-$2,600',
    netTakeHome: '$9,400',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$7,200',
    hra: '$2,800',
    specialAllowance: '$2,000',
    pf: '$1,440',
    tax: '$1,160',
  },
  {
    id: 'ps-3',
    monthCycle: 'May 2024',
    employeeName: 'Amit Kumar',
    department: 'Finance',
    empId: 'EMP003',
    grossSalary: '$9,300',
    totalDeductions: '-$1,950',
    netTakeHome: '$7,350',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$5,500',
    hra: '$2,300',
    specialAllowance: '$1,500',
    pf: '$1,116',
    tax: '$834',
  },
  {
    id: 'ps-4',
    monthCycle: 'May 2024',
    employeeName: 'Neha Gupta',
    department: 'Human Resources',
    empId: 'EMP004',
    grossSalary: '$7,700',
    totalDeductions: '-$1,520',
    netTakeHome: '$6,180',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$4,500',
    hra: '$1,900',
    specialAllowance: '$1,300',
    pf: '$924',
    tax: '$596',
  },
  {
    id: 'ps-5',
    monthCycle: 'May 2024',
    employeeName: 'Sandeep Yadav',
    department: 'Sales',
    empId: 'EMP005',
    grossSalary: '$8,100',
    totalDeductions: '-$1,650',
    netTakeHome: '$6,450',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$4,800',
    hra: '$2,000',
    specialAllowance: '$1,300',
    pf: '$972',
    tax: '$678',
  },
  {
    id: 'ps-6',
    monthCycle: 'May 2024',
    employeeName: 'Sarah Connor',
    department: 'Engineering',
    empId: 'EMP006',
    grossSalary: '$12,500',
    totalDeductions: '-$2,800',
    netTakeHome: '$9,700',
    paymentDate: 'May 31, 2024',
    status: 'PAID',
    basicPay: '$7,500',
    hra: '$3,000',
    specialAllowance: '$2,000',
    pf: '$1,500',
    tax: '$1,300',
  },
];

export const PayslipsScreen: React.FC<PayslipsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [payslips, setPayslips] = useState<PayslipArchiveItem[]>(INITIAL_ARCHIVE);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlip, setActiveSlip] = useState<PayslipArchiveItem | null>(null);

  const filteredSlips = payslips.filter(
    (p) =>
      p.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.monthCycle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportAll = () => {
    Alert.alert('Export Payslips', 'Exporting all May 2024 historical payslips in ZIP / CSV bundle.');
  };

  const handleDownloadPDF = (slip: PayslipArchiveItem) => {
    Alert.alert('Download Payslip', `Generating and downloading PDF for ${slip.employeeName} (${slip.monthCycle}).`);
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
        <Text
          style={[
            styles.screenTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Employee Payslips Archive
        </Text>
        <Text
          style={[
            styles.screenSubtitle,
            { color: isDarkMode ? '#94A3B8' : '#64748B' },
          ]}
        >
          Search, download, and export historical salary slips for all pay cycles.
        </Text>
      </View>

      {/* Filter Toolbar */}
      <View style={styles.toolbar}>
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
            placeholder="Search payslips by employee..."
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
          activeOpacity={0.8}
          onPress={handleExportAll}
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
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* Payslips Table matching Screenshot 4 */}
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
              <Text style={[styles.th, { width: 100 }]}>MONTH CYCLE</Text>
              <Text style={[styles.th, { width: 170 }]}>EMPLOYEE</Text>
              <Text style={[styles.th, { width: 110 }]}>GROSS SALARY</Text>
              <Text style={[styles.th, { width: 140 }]}>TOTAL DEDUCTIONS</Text>
              <Text style={[styles.th, { width: 120 }]}>NET TAKE-HOME</Text>
              <Text style={[styles.th, { width: 110 }]}>PAYMENT DATE</Text>
              <Text style={[styles.th, { width: 80 }]}>STATUS</Text>
              <Text style={[styles.th, { width: 90, textAlign: 'center' }]}>ACTION</Text>
            </View>

            {/* Table Rows */}
            {filteredSlips.map((p) => (
              <View
                key={p.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.td,
                    { width: 100, color: '#2563EB', fontWeight: '700' },
                  ]}
                >
                  {p.monthCycle}
                </Text>

                <View style={{ width: 170 }}>
                  <Text
                    style={[
                      styles.empName,
                      { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                    ]}
                  >
                    {p.employeeName}
                  </Text>
                  <Text style={styles.empSub}>
                    {p.empId} • {p.department}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.td,
                    { width: 110, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {p.grossSalary}
                </Text>

                <Text style={[styles.td, { width: 140, color: '#EF4444', fontWeight: '700' }]}>
                  {p.totalDeductions}
                </Text>

                <Text style={[styles.td, { width: 120, color: '#10B981', fontWeight: '800' }]}>
                  {p.netTakeHome}
                </Text>

                <Text style={[styles.td, { width: 110, color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                  {p.paymentDate}
                </Text>

                <View style={{ width: 80 }}>
                  <View style={styles.paidPill}>
                    <Text style={styles.paidPillText}>{p.status}</Text>
                  </View>
                </View>

                {/* PDF Action */}
                <TouchableOpacity
                  style={[styles.pdfBtn, { width: 90 }]}
                  onPress={() => setActiveSlip(p)}
                >
                  <Download size={13} color="#2563EB" />
                  <Text style={styles.pdfBtnText}>PDF</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Detailed Interactive Payslip Modal */}
      {activeSlip && (
        <Modal
          visible={!!activeSlip}
          transparent
          animationType="slide"
          onRequestClose={() => setActiveSlip(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.payslipDocCard,
                {
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              {/* Slip Header */}
              <View style={styles.slipHeader}>
                <View>
                  <Text style={styles.companyName}>Acme Corp Inc.</Text>
                  <Text style={styles.payslipDocTitle}>
                    Salary Slip — {activeSlip.monthCycle}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setActiveSlip(null)}>
                  <X size={20} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              {/* Employee Summary Card */}
              <View
                style={[
                  styles.slipEmpBox,
                  { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
                ]}
              >
                <View style={styles.slipEmpCol}>
                  <Text style={styles.slipLabel}>Employee Name</Text>
                  <Text
                    style={[
                      styles.slipValBold,
                      { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                    ]}
                  >
                    {activeSlip.employeeName}
                  </Text>
                </View>
                <View style={styles.slipEmpCol}>
                  <Text style={styles.slipLabel}>Employee ID</Text>
                  <Text
                    style={[
                      styles.slipValBold,
                      { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                    ]}
                  >
                    {activeSlip.empId}
                  </Text>
                </View>
                <View style={styles.slipEmpCol}>
                  <Text style={styles.slipLabel}>Department</Text>
                  <Text
                    style={[
                      styles.slipValBold,
                      { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                    ]}
                  >
                    {activeSlip.department}
                  </Text>
                </View>
              </View>

              {/* Breakdown Grid */}
              <View style={styles.breakdownGrid}>
                {/* Earnings */}
                <View
                  style={[
                    styles.columnBox,
                    { borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                  ]}
                >
                  <Text style={styles.columnTitle}>Earnings</Text>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Basic Salary</Text>
                    <Text
                      style={[
                        styles.lineVal,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {activeSlip.basicPay}
                    </Text>
                  </View>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>HRA Allowance</Text>
                    <Text
                      style={[
                        styles.lineVal,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {activeSlip.hra}
                    </Text>
                  </View>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Special Allowance</Text>
                    <Text
                      style={[
                        styles.lineVal,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                    >
                      {activeSlip.specialAllowance}
                    </Text>
                  </View>
                  <View style={[styles.lineRow, styles.subtotalLine]}>
                    <Text style={styles.subtotalLabel}>Gross Pay</Text>
                    <Text style={styles.subtotalVal}>
                      {activeSlip.grossSalary}
                    </Text>
                  </View>
                </View>

                {/* Deductions */}
                <View
                  style={[
                    styles.columnBox,
                    { borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
                  ]}
                >
                  <Text style={styles.columnTitle}>Deductions</Text>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Provident Fund (PF)</Text>
                    <Text style={[styles.lineVal, { color: '#EF4444' }]}>
                      {activeSlip.pf}
                    </Text>
                  </View>
                  <View style={styles.lineRow}>
                    <Text style={styles.lineLabel}>Income Tax / TDS</Text>
                    <Text style={[styles.lineVal, { color: '#EF4444' }]}>
                      {activeSlip.tax}
                    </Text>
                  </View>
                  <View style={[styles.lineRow, styles.subtotalLine]}>
                    <Text style={styles.subtotalLabel}>Total Deductions</Text>
                    <Text style={[styles.subtotalVal, { color: '#EF4444' }]}>
                      {activeSlip.totalDeductions}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Net Take-Home Box */}
              <View style={styles.netTakeHomeBox}>
                <View>
                  <Text style={styles.netTakeHomeLabel}>Net Take-Home Pay</Text>
                  <Text style={styles.netTakeHomeSub}>
                    Paid on {activeSlip.paymentDate} via Direct Deposit
                  </Text>
                </View>
                <Text style={styles.netTakeHomeAmount}>
                  {activeSlip.netTakeHome}
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.docActions}>
                <TouchableOpacity
                  onPress={() => handleDownloadPDF(activeSlip)}
                  style={styles.downloadPdfBtn}
                >
                  <Download size={16} color="#FFFFFF" />
                  <Text style={styles.downloadPdfText}>Download PDF</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setActiveSlip(null)}
                  style={[
                    styles.dismissBtn,
                    { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' },
                  ]}
                >
                  <Text
                    style={[
                      styles.dismissBtnText,
                      { color: isDarkMode ? '#CBD5E1' : '#64748B' },
                    ]}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
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
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  exportBtnText: {
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
    minWidth: 880,
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
  empName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  empSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  paidPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  paidPillText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  pdfBtn: {
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
  pdfBtnText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  payslipDocCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  slipHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  payslipDocTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  slipEmpBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  slipEmpCol: {
    gap: 2,
  },
  slipLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  slipValBold: {
    fontSize: 12,
    fontWeight: '700',
  },
  breakdownGrid: {
    gap: 12,
    marginBottom: 16,
  },
  columnBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  lineLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  lineVal: {
    fontSize: 12,
    fontWeight: '600',
  },
  subtotalLine: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 6,
    paddingTop: 6,
  },
  subtotalLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  subtotalVal: {
    fontSize: 12,
    fontWeight: '800',
  },
  netTakeHomeBox: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  netTakeHomeLabel: {
    fontSize: 12,
    color: '#065F46',
    fontWeight: '700',
  },
  netTakeHomeSub: {
    fontSize: 10,
    color: '#047857',
  },
  netTakeHomeAmount: {
    fontSize: 20,
    fontWeight: '900',
    color: '#047857',
  },
  docActions: {
    flexDirection: 'row',
    gap: 10,
  },
  downloadPdfBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    height: 42,
    borderRadius: 8,
  },
  downloadPdfText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  dismissBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 8,
  },
  dismissBtnText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
