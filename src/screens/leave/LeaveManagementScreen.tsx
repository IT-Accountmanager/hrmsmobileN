import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Calendar,
  Clock,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  X,
  FileText,
  CheckCircle2,
  CalendarCheck,
  CalendarX,
  Palmtree,
  Shield,
  Star,
  User,
  ArrowRight,
} from 'lucide-react-native';
import { ApplyLeaveModal } from './ApplyLeaveModal';

interface LeaveManagementScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface LeaveRecord {
  id: string;
  index: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'Approved' | 'Rejected' | 'Pending';
}

const INITIAL_RECORDS: LeaveRecord[] = [
  { id: '1', index: 1, type: 'Casual Leave', startDate: 'Apr 12, 2025', endDate: 'Apr 12, 2025', duration: '1 Day', status: 'Approved' },
  { id: '2', index: 2, type: 'Sick Leave', startDate: 'Apr 08, 2025', endDate: 'Apr 09, 2025', duration: '2 Days', status: 'Approved' },
  { id: '3', index: 3, type: 'Casual Leave', startDate: 'Mar 28, 2025', endDate: 'Mar 29, 2025', duration: '2 Days', status: 'Approved' },
  { id: '4', index: 4, type: 'Earned Leave', startDate: 'Mar 15, 2025', endDate: 'Mar 17, 2025', duration: '3 Days', status: 'Approved' },
  { id: '5', index: 5, type: 'Sick Leave', startDate: 'Feb 10, 2025', endDate: 'Feb 10, 2025', duration: '1 Day', status: 'Approved' },
  { id: '6', index: 6, type: 'Casual Leave', startDate: 'Jan 22, 2025', endDate: 'Jan 24, 2025', duration: '3 Days', status: 'Rejected' },
  { id: '7', index: 7, type: 'Earned Leave', startDate: 'Jan 10, 2025', endDate: 'Jan 14, 2025', duration: '5 Days', status: 'Approved' },
  { id: '8', index: 8, type: 'Casual Leave', startDate: 'Dec 18, 2024', endDate: 'Dec 19, 2024', duration: '2 Days', status: 'Approved' },
];

export const LeaveManagementScreen: React.FC<LeaveManagementScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'calendar'>('my');
  const [selectedType, setSelectedType] = useState('All Leave Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [typeModalOpen, setTypeModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);

  const [records, setRecords] = useState<LeaveRecord[]>(INITIAL_RECORDS);

  const filteredRecords = records.filter((r) => {
    const matchesType =
      selectedType === 'All Leave Types' ||
      r.type.toLowerCase().includes(selectedType.toLowerCase());
    const matchesStatus =
      selectedStatus === 'All Status' ||
      r.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesType && matchesStatus;
  });

  // Calendar Matrix for April 2025
  const calendarDays = [
    { day: 30, isOther: true },
    { day: 31, isOther: true },
    { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 },
    { day: 6 }, { day: 7 },
    { day: 8, isSelected: true },
    { day: 9 }, { day: 10 }, { day: 11 },
    { day: 12, status: 'Approved' },
    { day: 13 }, { day: 14 },
    { day: 15, status: 'Pending' },
    { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 },
    { day: 20 }, { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 }, { day: 25 },
    { day: 26, status: 'Rejected' },
    { day: 27 }, { day: 28 }, { day: 29 }, { day: 30 },
    { day: 1, isOther: true },
    { day: 2, isOther: true },
    { day: 3, isOther: true },
  ];

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
        <View style={styles.headerTitleRow}>
          <View style={styles.iconBox}>
            <Calendar size={18} color="#2563EB" />
          </View>
          <View style={styles.headerTextCol}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Leave Management
            </Text>
            <Text
              style={[
                styles.screenSubtitle,
                { color: isDarkMode ? '#94A3B8' : '#64748B' },
              ]}
            >
              Apply for leaves, check your leave balance and track your leave history — all in one place.
            </Text>
          </View>
        </View>
      </View>

      {/* 4 Stat Cards matching Screenshot 1 */}
      <View style={styles.statsGrid}>
        {/* Total Leave Balance */}
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
            <View style={[styles.statIconBox, { backgroundColor: '#ECFDF5' }]}>
              <CalendarCheck size={18} color="#10B981" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 12%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Total Leave Balance</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            18 Days
          </Text>
          <Text style={styles.statSub}>Available leaves</Text>
        </View>

        {/* Leaves Taken */}
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
            <View style={[styles.statIconBox, { backgroundColor: '#FEF2F2' }]}>
              <CalendarX size={18} color="#EF4444" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.trendBadgeText, { color: '#EF4444' }]}>↘ 8%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Leaves Taken</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            6 Days
          </Text>
          <Text style={styles.statSub}>This Year</Text>
        </View>

        {/* Pending Requests */}
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
            <View style={[styles.statIconBox, { backgroundColor: '#F5F3FF' }]}>
              <Clock size={18} color="#8B5CF6" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#F5F3FF' }]}>
              <Text style={[styles.trendBadgeText, { color: '#8B5CF6' }]}>↗ 0%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Pending Requests</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            2
          </Text>
          <Text style={styles.statSub}>Awaiting Approval</Text>
        </View>

        {/* Total Entitlement */}
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
            <View style={[styles.statIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={18} color="#3B82F6" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#EFF6FF' }]}>
              <Text style={[styles.trendBadgeText, { color: '#3B82F6' }]}>↗ 0%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Total Entitlement</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            24 Days
          </Text>
          <Text style={styles.statSub}>Per Year</Text>
        </View>
      </View>

      {/* Tabs & Apply Button Row */}
      <View style={styles.tabsRow}>
        <View style={styles.segmentContainer}>
          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'my' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('my')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'my' && styles.segmentTextActive,
              ]}
            >
              My Leaves
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'team' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('team')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'team' && styles.segmentTextActive,
              ]}
            >
              Team Leaves
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentBtn,
              activeTab === 'calendar' && styles.segmentBtnActive,
            ]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'calendar' && styles.segmentTextActive,
              ]}
            >
              Leave Calendar
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setApplyModalOpen(true)}
          style={styles.applyBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.applyBtnText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Filters Row */}
      <View style={styles.filtersRow}>
        <TouchableOpacity
          style={[
            styles.filterSelect,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
          onPress={() => setTypeModalOpen(true)}
        >
          <Text
            style={[
              styles.filterSelectText,
              { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
            ]}
          >
            {selectedType}
          </Text>
          <ChevronDown size={14} color="#64748B" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterSelect,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
          onPress={() => setStatusModalOpen(true)}
        >
          <Text
            style={[
              styles.filterSelectText,
              { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
            ]}
          >
            {selectedStatus}
          </Text>
          <ChevronDown size={14} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Main Leave Records Table Card */}
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
              <Text style={[styles.th, { width: 30 }]}>#</Text>
              <Text style={[styles.th, { width: 110 }]}>Leave Type</Text>
              <Text style={[styles.th, { width: 100 }]}>Start Date</Text>
              <Text style={[styles.th, { width: 100 }]}>End Date</Text>
              <Text style={[styles.th, { width: 75 }]}>Duration</Text>
              <Text style={[styles.th, { width: 85 }]}>Status</Text>
              <Text style={[styles.th, { width: 50, textAlign: 'center' }]}>Action</Text>
            </View>

            {/* Rows */}
            {filteredRecords.map((item) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.td,
                    { width: 30, color: '#94A3B8' },
                  ]}
                >
                  {item.index}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 110, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {item.type}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 100, color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  {item.startDate}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 100, color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  {item.endDate}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 75, color: isDarkMode ? '#F8FAFC' : '#0F172A', fontWeight: '600' },
                  ]}
                >
                  {item.duration}
                </Text>
                <View style={{ width: 85 }}>
                  <View
                    style={[
                      styles.statusBadge,
                      item.status === 'Approved' && { backgroundColor: '#DCFCE7' },
                      item.status === 'Rejected' && { backgroundColor: '#FEE2E2' },
                      item.status === 'Pending' && { backgroundColor: '#FEF3C7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        item.status === 'Approved' && { color: '#166534' },
                        item.status === 'Rejected' && { color: '#991B1B' },
                        item.status === 'Pending' && { color: '#B45309' },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.actionBtn, { width: 50 }]}
                  onPress={() => Alert.alert('Leave Actions', `Viewing details for ${item.type}`)}
                >
                  <MoreHorizontal size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.paginationRow}>
          <Text style={styles.paginationText}>
            Showing 1 to {filteredRecords.length} of {records.length} entries
          </Text>
          <View style={styles.pageBadge}>
            <Text style={styles.pageBadgeText}>1</Text>
          </View>
        </View>
      </View>

      {/* Leave Calendar Widget matching Screenshot 1 & 2 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.calendarWidgetHeader}>
          <View style={styles.calendarHeaderLeft}>
            <Calendar size={16} color="#2563EB" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Leave Calendar
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('Calendar')}
          >
            <Text style={styles.viewFullCalendarText}>View Full Calendar →</Text>
          </TouchableOpacity>
        </View>

        {/* Month Selector */}
        <View style={styles.monthHeaderRow}>
          <ChevronLeft size={16} color="#64748B" />
          <Text
            style={[
              styles.monthTitleText,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            April 2025
          </Text>
          <ChevronRight size={16} color="#64748B" />
        </View>

        {/* Days of Week */}
        <View style={styles.weekdayRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekdayText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Matrix */}
        <View style={styles.daysGrid}>
          {calendarDays.map((item, i) => (
            <View key={i} style={styles.dayCell}>
              {item.isSelected ? (
                <View style={styles.selectedDayBadge}>
                  <Text style={styles.selectedDayText}>{item.day}</Text>
                </View>
              ) : item.status === 'Approved' ? (
                <View style={[styles.dayStatusBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.dayStatusText, { color: '#166534' }]}>{item.day}</Text>
                </View>
              ) : item.status === 'Pending' ? (
                <View style={[styles.dayStatusBadge, { backgroundColor: '#F3E8FF' }]}>
                  <Text style={[styles.dayStatusText, { color: '#6B21A8' }]}>{item.day}</Text>
                </View>
              ) : item.status === 'Rejected' ? (
                <View style={[styles.dayStatusBadge, { backgroundColor: '#FEE2E2' }]}>
                  <Text style={[styles.dayStatusText, { color: '#991B1B' }]}>{item.day}</Text>
                </View>
              ) : (
                <Text
                  style={[
                    styles.dayText,
                    item.isOther && styles.dayTextMuted,
                    { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
                  ]}
                >
                  {item.day}
                </Text>
              )}
            </View>
          ))}
        </View>

        {/* Calendar Legend */}
        <View style={styles.calendarLegendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.legendText}>Approved</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
            <Text style={styles.legendText}>Pending</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.legendText}>Rejected</Text>
          </View>
        </View>
      </View>

      {/* Leave Balance Breakdown Widget matching Screenshot 2 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.calendarWidgetHeader}>
          <View style={styles.calendarHeaderLeft}>
            <Clock size={16} color="#2563EB" />
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Leave Balance
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('LeaveBalance')}
          >
            <Text style={styles.viewFullCalendarText}>View Details →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.balanceList}>
          {/* Casual Leave: 8 / 12 days */}
          <View style={styles.balanceItem}>
            <View style={styles.balanceTopRow}>
              <View style={styles.balanceLabelRow}>
                <Palmtree size={14} color="#10B981" />
                <Text
                  style={[
                    styles.balanceName,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  Casual Leave
                </Text>
              </View>
              <Text
                style={[
                  styles.balanceRatio,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                8 / 12 days
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${(8 / 12) * 100}%`, backgroundColor: '#10B981' }]} />
            </View>
          </View>

          {/* Sick Leave: 5 / 8 days */}
          <View style={styles.balanceItem}>
            <View style={styles.balanceTopRow}>
              <View style={styles.balanceLabelRow}>
                <Shield size={14} color="#3B82F6" />
                <Text
                  style={[
                    styles.balanceName,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  Sick Leave
                </Text>
              </View>
              <Text
                style={[
                  styles.balanceRatio,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                5 / 8 days
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${(5 / 8) * 100}%`, backgroundColor: '#3B82F6' }]} />
            </View>
          </View>

          {/* Earned Leave: 3 / 6 days */}
          <View style={styles.balanceItem}>
            <View style={styles.balanceTopRow}>
              <View style={styles.balanceLabelRow}>
                <Star size={14} color="#8B5CF6" />
                <Text
                  style={[
                    styles.balanceName,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  Earned Leave
                </Text>
              </View>
              <Text
                style={[
                  styles.balanceRatio,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                3 / 6 days
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `${(3 / 6) * 100}%`, backgroundColor: '#8B5CF6' }]} />
            </View>
          </View>

          {/* Maternity Leave: 0 / 12 days */}
          <View style={styles.balanceItem}>
            <View style={styles.balanceTopRow}>
              <View style={styles.balanceLabelRow}>
                <User size={14} color="#94A3B8" />
                <Text
                  style={[
                    styles.balanceName,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  Maternity Leave
                </Text>
              </View>
              <Text
                style={[
                  styles.balanceRatio,
                  { color: isDarkMode ? '#94A3B8' : '#64748B' },
                ]}
              >
                0 / 12 days
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: `0%`, backgroundColor: '#CBD5E1' }]} />
            </View>
          </View>
        </View>
      </View>

      {/* Leave Type Modal */}
      <Modal
        visible={typeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setTypeModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTypeModalOpen(false)}
        >
          <View
            style={[
              styles.filterModalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Text
              style={[
                styles.filterModalTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Filter by Leave Type
            </Text>
            {['All Leave Types', 'Casual Leave', 'Sick Leave', 'Earned Leave'].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  styles.filterOptionRow,
                  selectedType === t && { backgroundColor: isDarkMode ? '#334155' : '#EFF6FF' },
                ]}
                onPress={() => {
                  setSelectedType(t);
                  setTypeModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color: selectedType === t ? '#2563EB' : isDarkMode ? '#E2E8F0' : '#334155',
                      fontWeight: selectedType === t ? '700' : '500',
                    },
                  ]}
                >
                  {t}
                </Text>
                {selectedType === t && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Status Modal */}
      <Modal
        visible={statusModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setStatusModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setStatusModalOpen(false)}
        >
          <View
            style={[
              styles.filterModalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <Text
              style={[
                styles.filterModalTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Filter by Status
            </Text>
            {['All Status', 'Approved', 'Rejected', 'Pending'].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.filterOptionRow,
                  selectedStatus === s && { backgroundColor: isDarkMode ? '#334155' : '#EFF6FF' },
                ]}
                onPress={() => {
                  setSelectedStatus(s);
                  setStatusModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color: selectedStatus === s ? '#2563EB' : isDarkMode ? '#E2E8F0' : '#334155',
                      fontWeight: selectedStatus === s ? '700' : '500',
                    },
                  ]}
                >
                  {s}
                </Text>
                {selectedStatus === s && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Global Apply Leave Modal */}
      <ApplyLeaveModal
        visible={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        onSuccess={() => {
          setApplyModalOpen(false);
          Alert.alert('Leave Applied', 'Your leave request has been submitted for manager approval.');
        }}
      />
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
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  headerTextCol: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
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
    marginBottom: 10,
  },
  statIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
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
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 10,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 3,
    borderRadius: 8,
  },
  segmentBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  segmentTextActive: {
    color: '#FFFFFF',
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  filterSelect: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  filterSelectText: {
    fontSize: 12,
    fontWeight: '600',
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
  tableWrap: {
    minWidth: 550,
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
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
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
  pageBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarWidgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  calendarHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  viewFullCalendarText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 12,
  },
  monthTitleText: {
    fontSize: 14,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dayTextMuted: {
    opacity: 0.35,
  },
  selectedDayBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  dayStatusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  calendarLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  balanceList: {
    gap: 14,
  },
  balanceItem: {
    gap: 6,
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceName: {
    fontSize: 13,
    fontWeight: '600',
  },
  balanceRatio: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  filterModalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  filterModalTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterOptionText: {
    fontSize: 13,
  },
});
