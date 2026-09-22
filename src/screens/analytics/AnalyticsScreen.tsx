import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import {
  FileDown,
  FileSpreadsheet,
  Users,
  Clock,
  DollarSign,
  FileText,
  ChevronDown,
  Download,
  TrendingUp,
  PieChart,
  Check,
  X,
  Share2,
} from 'lucide-react-native';
import { HeadcountGrowthChart } from '../../components/analytics/HeadcountGrowthChart';
import { DepartmentHeadcountDonut } from '../../components/analytics/DepartmentHeadcountDonut';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AnalyticsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();

  // Filters State
  const [selectedPeriod, setSelectedPeriod] = useState('Year to Date (2024)');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('All Departments (124 Employees)');
  const [periodModalOpen, setPeriodModalOpen] = useState(false);
  const [deptModalOpen, setDeptModalOpen] = useState(false);

  // Download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const PERIOD_OPTIONS = [
    'Year to Date (2024)',
    'Full Year 2024 (Projected)',
    'Q3 2024 (Current Quarter)',
    'Q2 2024 (Last Quarter)',
    'All Time Expansion',
  ];

  const DEPT_OPTIONS = [
    'All Departments (124 Employees)',
    'Engineering (54 Employees)',
    'Marketing (22 Employees)',
    'Sales (16 Employees)',
    'Finance (14 Employees)',
    'Human Resources (12 Employees)',
    'Operations (6 Employees)',
  ];

  // Audit Packages Dataset (Exact replica from Screenshot 2)
  const AUDIT_PACKAGES = [
    {
      id: 'audit-1',
      title: 'Employee Master Registry',
      description: 'Full profile records, departments, and bank details',
      size: '1.4 MB',
      icon: Users,
      format: 'CSV / EXCEL',
    },
    {
      id: 'audit-2',
      title: 'Attendance & Overtime Ledger',
      description: 'Daily clock-in matrix, working hours, and late marks',
      size: '2.8 MB',
      icon: Clock,
      format: 'EXCEL / PDF',
    },
    {
      id: 'audit-3',
      title: 'Payroll Reconciliation Report',
      description: 'Monthly gross, taxes, PF deductions, and net payouts',
      size: '3.1 MB',
      icon: DollarSign,
      format: 'EXCEL / ENCRYPTED',
    },
    {
      id: 'audit-4',
      title: 'Quarterly Expense Audits',
      description: 'Approved claims, project allocations, and receipts',
      size: '950 KB',
      icon: FileText,
      format: 'PDF / ZIP',
    },
  ];

  const handleDownloadPackage = (pkg: (typeof AUDIT_PACKAGES)[0]) => {
    setDownloadingId(pkg.id);
    setTimeout(() => {
      setDownloadingId(null);
      Alert.alert(
        'Audit Package Ready',
        `${pkg.title} (${pkg.size}) has been generated and downloaded to your device files.`
      );
    }, 700);
  };

  const handleExportPDF = () => {
    Alert.alert(
      'Export PDF Report',
      'Generating Acme Corp Workforce Analytics & Headcount Report (PDF)...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download PDF',
          onPress: () =>
            Alert.alert('Download Complete', 'Workforce_Analytics_2024.pdf downloaded.'),
        },
      ]
    );
  };

  const handleExportCSV = () => {
    Alert.alert(
      'Export CSV Data',
      'Generating raw headcount and departmental allocation CSV dataset...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download CSV',
          onPress: () =>
            Alert.alert('Download Complete', 'Headcount_Allocations_2024.csv downloaded.'),
        },
      ]
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
      ]}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingBottom: Math.max(insets.bottom, 24) + 60 },
      ]}
    >
      {/* ===================== PAGE HEADER ===================== */}
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.pageTitle,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Reports & Workforce Analytics
          </Text>
          <Text style={styles.pageSub}>
            Real-time business intelligence, headcount growth curves, and downloadable audits.
          </Text>
        </View>
      </View>

      {/* Export Action Buttons (PDF & CSV) */}
      <View style={styles.exportActionRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleExportPDF}
          style={[
            styles.exportBtnOutline,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#CBD5E1',
            },
          ]}
        >
          <FileDown size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text
            style={[
              styles.exportBtnOutlineText,
              { color: isDarkMode ? '#CBD5E1' : '#334155' },
            ]}
          >
            Export PDF
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleExportCSV}
          style={styles.exportBtnSolid}
        >
          <FileSpreadsheet size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.exportBtnSolidText}>Export CSV</Text>
        </TouchableOpacity>
      </View>

      {/* ===================== FILTER CONTROLS BAR ===================== */}
      <View
        style={[
          styles.filterBarBox,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <Text style={styles.filterLabel}>Filter Analytics:</Text>

        <View style={styles.filterDropdownsWrap}>
          {/* Period Dropdown */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setPeriodModalOpen(true)}
            style={[
              styles.dropdownPill,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Text
              style={[
                styles.dropdownPillText,
                { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
              ]}
              numberOfLines={1}
            >
              {selectedPeriod}
            </Text>
            <ChevronDown size={13} color="#94A3B8" style={{ marginLeft: 6 }} />
          </TouchableOpacity>

          {/* Department Dropdown */}
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => setDeptModalOpen(true)}
            style={[
              styles.dropdownPill,
              {
                backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Text
              style={[
                styles.dropdownPillText,
                { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
              ]}
              numberOfLines={1}
            >
              {selectedDeptFilter}
            </Text>
            <ChevronDown size={13} color="#94A3B8" style={{ marginLeft: 6 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ===================== CARD 1: HEADCOUNT GROWTH TREND ===================== */}
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={16} color="#2563EB" />
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Headcount Growth Trend
              </Text>
            </View>
            <Text style={styles.cardSub}>Active full-time workforce expansion</Text>
          </View>

          {/* Expansion Badge */}
          <View style={styles.expansionBadge}>
            <Text style={styles.expansionBadgeText}>+40.9% YTD Expansion</Text>
          </View>
        </View>

        {/* Area Line Chart */}
        <HeadcountGrowthChart isDarkMode={isDarkMode} />
      </View>

      {/* ===================== CARD 2: DEPARTMENT HEADCOUNT ===================== */}
      <View
        style={[
          styles.cardContainer,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#E2E8F0',
          },
        ]}
      >
        <View style={styles.cardHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <PieChart size={16} color="#2563EB" />
              <Text
                style={[
                  styles.cardTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Department Headcount
              </Text>
            </View>
            <Text style={styles.cardSub}>Share across business units</Text>
          </View>
        </View>

        {/* Donut Chart with Two-Column Legend */}
        <DepartmentHeadcountDonut isDarkMode={isDarkMode} />
      </View>

      {/* ===================== SECTION 2: SCHEDULED AUDIT & EXPORT PACKAGES ===================== */}
      <View style={styles.auditSectionHeadingBox}>
        <Text
          style={[
            styles.auditSectionTitle,
            { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
          ]}
        >
          Scheduled Audit & Export Packages
        </Text>
      </View>

      {/* 4 Downloadable Audit Cards */}
      <View style={styles.auditGridContainer}>
        {AUDIT_PACKAGES.map((pkg) => {
          const IconComp = pkg.icon;
          const isDownloading = downloadingId === pkg.id;

          return (
            <View
              key={pkg.id}
              style={[
                styles.auditCard,
                {
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              {/* Icon in Rounded Box */}
              <View style={styles.auditIconBox}>
                <IconComp size={18} color="#2563EB" />
              </View>

              {/* Title & Description */}
              <Text
                style={[
                  styles.auditCardTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
                numberOfLines={1}
              >
                {pkg.title}
              </Text>
              <Text style={styles.auditCardDesc} numberOfLines={2}>
                {pkg.description}
              </Text>

              {/* Footer: Size & Download Button */}
              <View style={styles.auditCardFooter}>
                <Text style={styles.auditFileSize}>{pkg.size}</Text>

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDownloadPackage(pkg)}
                  disabled={isDownloading}
                  style={[
                    styles.downloadBtnOutline,
                    {
                      backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                      borderColor: isDarkMode ? '#334155' : '#CBD5E1',
                    },
                    isDownloading && { opacity: 0.6 },
                  ]}
                >
                  <Download size={13} color="#2563EB" style={{ marginRight: 5 }} />
                  <Text style={styles.downloadBtnOutlineText}>
                    {isDownloading ? 'Downloading...' : 'Download'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* ===================== PERIOD MODAL ===================== */}
      <Modal
        visible={periodModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPeriodModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setPeriodModalOpen(false)}
          style={styles.modalBackdrop}
        >
          <View
            style={[
              styles.pickerModalBox,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text
                style={[
                  styles.pickerTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Select Reporting Period
              </Text>
              <TouchableOpacity onPress={() => setPeriodModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {PERIOD_OPTIONS.map((opt) => {
              const isSelected = selectedPeriod === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    setSelectedPeriod(opt);
                    setPeriodModalOpen(false);
                  }}
                  style={[
                    styles.pickerOptionRow,
                    isSelected && {
                      backgroundColor: isDarkMode ? '#2563EB20' : '#EFF6FF',
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      {
                        color: isSelected
                          ? '#2563EB'
                          : isDarkMode
                          ? '#E2E8F0'
                          : '#334155',
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt}
                  </Text>
                  {isSelected && <Check size={16} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===================== DEPARTMENT FILTER MODAL ===================== */}
      <Modal
        visible={deptModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDeptModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setDeptModalOpen(false)}
          style={styles.modalBackdrop}
        >
          <View
            style={[
              styles.pickerModalBox,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <View style={styles.pickerHeader}>
              <Text
                style={[
                  styles.pickerTitle,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                ]}
              >
                Filter by Department
              </Text>
              <TouchableOpacity onPress={() => setDeptModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {DEPT_OPTIONS.map((opt) => {
              const isSelected = selectedDeptFilter === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => {
                    setSelectedDeptFilter(opt);
                    setDeptModalOpen(false);
                  }}
                  style={[
                    styles.pickerOptionRow,
                    isSelected && {
                      backgroundColor: isDarkMode ? '#2563EB20' : '#EFF6FF',
                      borderRadius: 8,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      {
                        color: isSelected
                          ? '#2563EB'
                          : isDarkMode
                          ? '#E2E8F0'
                          : '#334155',
                        fontWeight: isSelected ? '700' : '500',
                      },
                    ]}
                  >
                    {opt}
                  </Text>
                  {isSelected && <Check size={16} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
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
  },

  // Header
  headerRow: {
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  pageSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },

  // Export Buttons Row
  exportActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  exportBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 9,
  },
  exportBtnOutlineText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  exportBtnSolid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 9,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  exportBtnSolidText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },

  // Filter Bar
  filterBarBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  filterDropdownsWrap: {
    flexDirection: 'column',
    gap: 8,
  },
  dropdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dropdownPillText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },

  // Cards
  cardContainer: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  cardSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  expansionBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 999,
  },
  expansionBadgeText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '700',
  },

  // Audit Section
  auditSectionHeadingBox: {
    marginTop: 6,
    marginBottom: 12,
  },
  auditSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  auditGridContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  auditCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  auditIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  auditCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  auditCardDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  auditCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  auditFileSize: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  downloadBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  downloadBtnOutlineText: {
    color: '#2563EB',
    fontSize: 11.5,
    fontWeight: '600',
  },

  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerModalBox: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  pickerTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  pickerOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 10,
  },
  pickerOptionText: {
    fontSize: 13,
  },
});
