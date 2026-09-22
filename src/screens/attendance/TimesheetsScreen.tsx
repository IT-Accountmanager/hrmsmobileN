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
  Clock,
  CheckSquare,
  Calendar,
  Plus,
  ChevronDown,
  Download,
  MoreVertical,
  ArrowRight,
  X,
  Check,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

interface TimesheetsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface TimesheetRow {
  id: string;
  date: string;
  day: string;
  checkIn: string;
  checkOut: string;
  totalHours: string;
  status: 'Present' | 'Absent' | 'Holiday';
}

const INITIAL_ROWS: TimesheetRow[] = [
  { id: '1', date: '21 Apr 2025', day: 'Mon', checkIn: '09:00 AM', checkOut: '06:00 PM', totalHours: '8 h 00 m', status: 'Present' },
  { id: '2', date: '22 Apr 2025', day: 'Tue', checkIn: '09:15 AM', checkOut: '06:15 PM', totalHours: '8 h 00 m', status: 'Present' },
  { id: '3', date: '23 Apr 2025', day: 'Wed', checkIn: '09:05 AM', checkOut: '06:10 PM', totalHours: '8 h 05 m', status: 'Present' },
  { id: '4', date: '24 Apr 2025', day: 'Thu', checkIn: '09:00 AM', checkOut: '06:30 PM', totalHours: '8 h 30 m', status: 'Present' },
  { id: '5', date: '25 Apr 2025', day: 'Fri', checkIn: '09:10 AM', checkOut: '07:00 PM', totalHours: '8 h 50 m', status: 'Present' },
  { id: '6', date: '26 Apr 2025', day: 'Sat', checkIn: '—', checkOut: '—', totalHours: '0 h 00 m', status: 'Absent' },
  { id: '7', date: '27 Apr 2025', day: 'Sun', checkIn: '—', checkOut: '—', totalHours: '0 h 00 m', status: 'Holiday' },
];

const DATE_RANGES = [
  'Apr 21, 2025 – Apr 27, 2025',
  'Apr 14, 2025 – Apr 20, 2025',
  'Apr 07, 2025 – Apr 13, 2025',
  'Mar 31, 2025 – Apr 06, 2025',
];

export const TimesheetsScreen: React.FC<TimesheetsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [rows, setRows] = useState<TimesheetRow[]>(INITIAL_ROWS);
  const [selectedRange, setSelectedRange] = useState('Apr 21, 2025 – Apr 27, 2025');
  const [rangeModalOpen, setRangeModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Timesheet Form
  const [formDate, setFormDate] = useState('28 Apr 2025');
  const [formDay, setFormDay] = useState('Mon');
  const [formCheckIn, setFormCheckIn] = useState('09:00 AM');
  const [formCheckOut, setFormCheckOut] = useState('06:00 PM');
  const [formHours, setFormHours] = useState('8 h 00 m');

  const handleAddTimesheet = () => {
    const newEntry: TimesheetRow = {
      id: `ts-${Date.now()}`,
      date: formDate,
      day: formDay,
      checkIn: formCheckIn,
      checkOut: formCheckOut,
      totalHours: formHours,
      status: 'Present',
    };

    setRows([newEntry, ...rows]);
    setAddModalOpen(false);
    Alert.alert('Timesheet Added', `Timesheet for ${formDate} logged successfully.`);
  };

  const handleExport = () => {
    Alert.alert('Timesheet Export', 'Weekly timesheet summary exported as CSV / PDF report.');
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
      {/* Screen Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerIconWrapper}>
            <Clock size={20} color="#2563EB" />
          </View>
          <View style={styles.headerTextCol}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Timesheets
            </Text>
            <Text
              style={[
                styles.screenSubtitle,
                { color: isDarkMode ? '#94A3B8' : '#64748B' },
              ]}
            >
              Track your working hours and manage your timesheets easily.
            </Text>
          </View>
        </View>

        {/* Date Range Selector & Add Button */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.rangeBtn,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
            onPress={() => setRangeModalOpen(true)}
          >
            <Calendar size={14} color="#64748B" />
            <Text
              style={[
                styles.rangeText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              {selectedRange}
            </Text>
            <ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAddModalOpen(true)}
            style={styles.addBtn}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Timesheet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4 Stat Cards matching Screenshot 3 */}
      <View style={styles.statsGrid}>
        {/* Total Hours */}
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
            <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <Clock size={18} color="#2563EB" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 12%</Text>
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            40 h 00 m
          </Text>
          <Text style={styles.statLabel}>Total Hours</Text>
        </View>

        {/* Billable Hours */}
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
            <View style={[styles.iconWrapper, { backgroundColor: '#ECFDF5' }]}>
              <CheckSquare size={18} color="#10B981" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 15%</Text>
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            36 h 00 m
          </Text>
          <Text style={styles.statLabel}>Billable Hours</Text>
        </View>

        {/* Working Days */}
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
            <View style={[styles.iconWrapper, { backgroundColor: '#F5F3FF' }]}>
              <Calendar size={18} color="#8B5CF6" />
            </View>
            <Text style={styles.subTextMuted}>Mon - Fri</Text>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            5 / 5
          </Text>
          <Text style={styles.statLabel}>Working Days</Text>
        </View>

        {/* Overtime */}
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
            <View style={[styles.iconWrapper, { backgroundColor: '#EFF6FF' }]}>
              <Clock size={18} color="#3B82F6" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 50%</Text>
            </View>
          </View>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            2 h 00 m
          </Text>
          <Text style={styles.statLabel}>Overtime</Text>
        </View>
      </View>

      {/* Timesheet Details Section matching Screenshot 3 & 4 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Timesheet Details
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleExport}
            style={[
              styles.exportBtn,
              {
                backgroundColor: isDarkMode ? '#334155' : '#F8FAFC',
                borderColor: isDarkMode ? '#475569' : '#E2E8F0',
              },
            ]}
          >
            <Download size={13} color="#64748B" />
            <Text
              style={[
                styles.exportBtnText,
                { color: isDarkMode ? '#E2E8F0' : '#475569' },
              ]}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Table for exact columns */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View style={styles.tableWrapper}>
            {/* Table Header Row */}
            <View
              style={[
                styles.tableHeaderRow,
                {
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Text style={[styles.th, { width: 100 }]}>Date</Text>
              <Text style={[styles.th, { width: 50 }]}>Day</Text>
              <Text style={[styles.th, { width: 85 }]}>Check In</Text>
              <Text style={[styles.th, { width: 85 }]}>Check Out</Text>
              <Text style={[styles.th, { width: 95 }]}>Total Hours</Text>
              <Text style={[styles.th, { width: 85 }]}>Status</Text>
              <Text style={[styles.th, { width: 50, textAlign: 'center' }]}>Action</Text>
            </View>

            {/* Table Body Rows */}
            {rows.map((r, i) => (
              <View
                key={r.id}
                style={[
                  styles.tableRow,
                  {
                    borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.td,
                    { width: 100, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {r.date}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 50, color: isDarkMode ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  {r.day}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 85, color: isDarkMode ? '#E2E8F0' : '#334155' },
                  ]}
                >
                  {r.checkIn}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 85, color: isDarkMode ? '#E2E8F0' : '#334155' },
                  ]}
                >
                  {r.checkOut}
                </Text>
                <Text
                  style={[
                    styles.td,
                    { width: 95, fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {r.totalHours}
                </Text>
                <View style={{ width: 85 }}>
                  <View
                    style={[
                      styles.statusPill,
                      r.status === 'Present' && { backgroundColor: '#DCFCE7' },
                      r.status === 'Absent' && { backgroundColor: '#FEE2E2' },
                      r.status === 'Holiday' && { backgroundColor: '#F3E8FF' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        r.status === 'Present' && { color: '#166534' },
                        r.status === 'Absent' && { color: '#991B1B' },
                        r.status === 'Holiday' && { color: '#6B21A8' },
                      ]}
                    >
                      {r.status}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.actionBtn, { width: 50 }]}
                  onPress={() => Alert.alert('Timesheet Options', `Editing or viewing logs for ${r.date}`)}
                >
                  <MoreVertical size={16} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Your Progress Widget */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.progressRow}>
          <View style={styles.progressIconCircle}>
            <Clock size={20} color="#2563EB" />
          </View>
          <View style={styles.progressTextCol}>
            <Text
              style={[
                styles.progressTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Your Progress
            </Text>
            <Text style={styles.progressSub}>Stay consistent! You're doing great.</Text>
          </View>
        </View>

        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBarBg,
              { backgroundColor: isDarkMode ? '#334155' : '#EFF6FF' },
            ]}
          >
            <View style={[styles.progressBarFill, { width: '83%' }]} />
          </View>
          <Text
            style={[
              styles.progressPercentText,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            83%
          </Text>
        </View>
      </View>

      {/* Weekly Hours Bar Chart Widget matching Screenshot 3 & 4 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.chartHeaderRow}>
          <Text
            style={[
              styles.sectionTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Weekly Hours
          </Text>
          <View style={styles.weeklyHoursBadge}>
            <Clock size={13} color="#2563EB" />
            <Text style={styles.weeklyHoursBadgeText}>40 h 00 m</Text>
          </View>
        </View>

        <View style={styles.barChartRow}>
          {[
            { day: 'Mon', hours: '8h', height: 80 },
            { day: 'Tue', hours: '8h', height: 80 },
            { day: 'Wed', hours: '8h', height: 80 },
            { day: 'Thu', hours: '8.5h', height: 90 },
            { day: 'Fri', hours: '8.5h', height: 90 },
            { day: 'Sat', hours: '0h', height: 16 },
            { day: 'Sun', hours: '0h', height: 16 },
          ].map((bar) => (
            <View key={bar.day} style={styles.barCol}>
              <Text style={styles.barHoursText}>{bar.hours}</Text>
              <View style={styles.barSlot}>
                <View
                  style={[
                    styles.barPill,
                    {
                      height: bar.height,
                      backgroundColor:
                        bar.height > 20
                          ? '#3B82F6'
                          : isDarkMode
                          ? '#334155'
                          : '#E2E8F0',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barDayLabel,
                  { color: isDarkMode ? '#94A3B8' : '#64748B' },
                ]}
              >
                {bar.day}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions Widget matching Screenshot 4 */}
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
            styles.sectionTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A', marginBottom: 14 },
          ]}
        >
          Quick Actions
        </Text>

        {/* Action 1: Apply for Leave */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate && onNavigate('Leaves')}
          style={[
            styles.quickActionRow,
            { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
          ]}
        >
          <View style={styles.quickActionLeft}>
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={16} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              Apply for Leave
            </Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        {/* Action 2: View Attendance */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onNavigate && onNavigate('Attendance')}
          style={[
            styles.quickActionRow,
            { borderBottomColor: isDarkMode ? '#334155' : '#F1F5F9' },
          ]}
        >
          <View style={styles.quickActionLeft}>
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Clock size={16} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              View Attendance
            </Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        {/* Action 3: Download Timesheet */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleExport}
          style={[styles.quickActionRow, { borderBottomWidth: 0 }]}
        >
          <View style={styles.quickActionLeft}>
            <View style={[styles.quickActionIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Download size={16} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.quickActionText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              Download Timesheet
            </Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* Date Range Modal */}
      <Modal
        visible={rangeModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRangeModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setRangeModalOpen(false)}
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
            <View style={styles.modalHeaderRow}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Select Timesheet Week
              </Text>
              <TouchableOpacity onPress={() => setRangeModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {DATE_RANGES.map((rng) => (
              <TouchableOpacity
                key={rng}
                style={[
                  styles.rangeOptionRow,
                  selectedRange === rng && {
                    backgroundColor: isDarkMode ? '#334155' : '#EFF6FF',
                  },
                ]}
                onPress={() => {
                  setSelectedRange(rng);
                  setRangeModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.rangeOptionText,
                    {
                      color:
                        selectedRange === rng
                          ? '#2563EB'
                          : isDarkMode
                          ? '#E2E8F0'
                          : '#334155',
                      fontWeight: selectedRange === rng ? '700' : '500',
                    },
                  ]}
                >
                  {rng}
                </Text>
                {selectedRange === rng && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Timesheet Modal */}
      <Modal
        visible={addModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.addModalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.modalHeaderRow}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Log New Timesheet
              </Text>
              <TouchableOpacity onPress={() => setAddModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.formLabel,
                  { color: isDarkMode ? '#CBD5E1' : '#475569' },
                ]}
              >
                Date
              </Text>
              <TextInput
                value={formDate}
                onChangeText={setFormDate}
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

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text
                  style={[
                    styles.formLabel,
                    { color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  Check In
                </Text>
                <TextInput
                  value={formCheckIn}
                  onChangeText={setFormCheckIn}
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

              <View style={[styles.formGroup, { flex: 1 }]}>
                <Text
                  style={[
                    styles.formLabel,
                    { color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  Check Out
                </Text>
                <TextInput
                  value={formCheckOut}
                  onChangeText={setFormCheckOut}
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
            </View>

            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.formLabel,
                  { color: isDarkMode ? '#CBD5E1' : '#475569' },
                ]}
              >
                Total Working Duration
              </Text>
              <TextInput
                value={formHours}
                onChangeText={setFormHours}
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

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setAddModalOpen(false)}
                style={[
                  styles.cancelBtn,
                  { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: isDarkMode ? '#CBD5E1' : '#64748B' },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddTimesheet}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Save Entry</Text>
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  headerIconWrapper: {
    width: 36,
    height: 36,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  rangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    height: 38,
    borderRadius: 8,
    gap: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
    marginBottom: 8,
  },
  iconWrapper: {
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
  subTextMuted: {
    fontSize: 11,
    color: '#94A3B8',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
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
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tableWrapper: {
    minWidth: 500,
  },
  tableHeaderRow: {
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
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  progressIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTextCol: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  progressSub: {
    fontSize: 12,
    color: '#64748B',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 4,
  },
  progressPercentText: {
    fontSize: 13,
    fontWeight: '700',
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  weeklyHoursBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  weeklyHoursBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 6,
  },
  barCol: {
    alignItems: 'center',
    width: 38,
  },
  barHoursText: {
    fontSize: 10,
    color: '#94A3B8',
    marginBottom: 6,
  },
  barSlot: {
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  barPill: {
    width: 22,
    borderRadius: 11,
  },
  barDayLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  quickActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  quickActionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quickActionIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionText: {
    fontSize: 13,
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
    maxWidth: 320,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  addModalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  rangeOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  rangeOptionText: {
    fontSize: 13,
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
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
