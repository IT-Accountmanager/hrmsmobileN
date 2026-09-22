import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  CalendarCheck,
  CalendarX,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react-native';

interface AttendanceScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  status?: 'present' | 'absent' | 'leave' | null;
  checkIn?: string;
  checkOut?: string;
  hours?: string;
}

const MONTHS = [
  'January 2025',
  'February 2025',
  'March 2025',
  'April 2025',
  'May 2025',
  'June 2025',
];

export const AttendanceScreen: React.FC<AttendanceScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [selectedMonth, setSelectedMonth] = useState('April 2025');
  const [monthModalOpen, setMonthModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(8);

  // April 2025 calendar days matching Screenshots 1 & 2
  const calendarDays: CalendarDay[] = [
    // Previous month trailing
    { day: 30, isCurrentMonth: false, status: null },
    { day: 31, isCurrentMonth: false, status: null },
    // April
    { day: 1, isCurrentMonth: true, status: 'present', checkIn: '09:05 AM', checkOut: '06:00 PM', hours: '8h 55m' },
    { day: 2, isCurrentMonth: true, status: 'present', checkIn: '09:10 AM', checkOut: '06:15 PM', hours: '9h 05m' },
    { day: 3, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 4, isCurrentMonth: true, status: null },
    { day: 5, isCurrentMonth: true, status: null },
    { day: 6, isCurrentMonth: true, status: 'present', checkIn: '09:12 AM', checkOut: '06:08 PM', hours: '8h 56m' },
    { day: 7, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 8, isCurrentMonth: true, status: 'present', checkIn: '09:12 AM', checkOut: '06:08 PM', hours: '8h 56m' },
    { day: 9, isCurrentMonth: true, status: 'present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { day: 10, isCurrentMonth: true, status: 'present', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: '9h 00m' },
    { day: 11, isCurrentMonth: true, status: 'leave', hours: '0h 00m' },
    { day: 12, isCurrentMonth: true, status: null },
    { day: 13, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 14, isCurrentMonth: true, status: 'present', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m' },
    { day: 15, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:30 PM', hours: '9h 30m' },
    { day: 16, isCurrentMonth: true, status: 'absent', hours: '0h 00m' },
    { day: 17, isCurrentMonth: true, status: 'present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { day: 18, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 19, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 20, isCurrentMonth: true, status: 'present', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: '9h 00m' },
    { day: 21, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 22, isCurrentMonth: true, status: 'present', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: '9h 00m' },
    { day: 23, isCurrentMonth: true, status: 'present', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 05m' },
    { day: 24, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:30 PM', hours: '9h 30m' },
    { day: 25, isCurrentMonth: true, status: 'absent', hours: '0h 00m' },
    { day: 26, isCurrentMonth: true, status: 'present', checkIn: '09:10 AM', checkOut: '07:00 PM', hours: '9h 50m' },
    { day: 27, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 28, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 29, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    { day: 30, isCurrentMonth: true, status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: '9h 00m' },
    // Next month trailing
    { day: 1, isCurrentMonth: false, status: null },
    { day: 2, isCurrentMonth: false, status: null },
    { day: 3, isCurrentMonth: false, status: null },
  ];

  const activeDayDetails =
    calendarDays.find((d) => d.isCurrentMonth && d.day === selectedDay) ||
    calendarDays[7];

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
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <View style={styles.titleIconRow}>
            <View style={styles.headerIconBox}>
              <Calendar size={18} color="#2563EB" />
            </View>
            <Text
              style={[
                styles.screenTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Attendance
            </Text>
          </View>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Track your daily attendance, view your attendance history and manage your time effectively.
          </Text>
        </View>

        {/* Small Present Stamp Banner */}
        <View style={styles.clockPresentBanner}>
          <Clock size={20} color="#2563EB" />
          <View style={styles.livePillSmall}>
            <Text style={styles.livePillSmallText}>• Present</Text>
          </View>
        </View>
      </View>

      {/* 4 Stat Cards matching Screenshot 1 */}
      <View style={styles.statsGrid}>
        {/* Present Days */}
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
              <CalendarCheck size={18} color="#10B981" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#ECFDF5' }]}>
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 12%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Present Days</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            18
          </Text>
          <Text style={styles.statSub}>This Month</Text>
        </View>

        {/* Absent Days */}
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
            <View style={[styles.iconWrapper, { backgroundColor: '#FEF2F2' }]}>
              <CalendarX size={18} color="#EF4444" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#FEF2F2' }]}>
              <Text style={[styles.trendBadgeText, { color: '#EF4444' }]}>↘ 50%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Absent Days</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            2
          </Text>
          <Text style={styles.statSub}>This Month</Text>
        </View>

        {/* Leave Days */}
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
              <FileText size={18} color="#8B5CF6" />
            </View>
            <View style={[styles.trendBadge, { backgroundColor: '#F5F3FF' }]}>
              <Text style={[styles.trendBadgeText, { color: '#8B5CF6' }]}>↗ 0%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Leave Days</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            1
          </Text>
          <Text style={styles.statSub}>This Month</Text>
        </View>

        {/* Total Working Hours */}
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
              <Text style={[styles.trendBadgeText, { color: '#10B981' }]}>↗ 8%</Text>
            </View>
          </View>
          <Text style={styles.statLabel}>Total Working Hours</Text>
          <Text
            style={[
              styles.statValue,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            144.5 hrs
          </Text>
          <Text style={styles.statSub}>This Month</Text>
        </View>
      </View>

      {/* Attendance Calendar Card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        {/* Calendar Header */}
        <View style={styles.calendarHeaderRow}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Attendance Calendar
          </Text>

          <View style={styles.monthControls}>
            <TouchableOpacity
              style={[
                styles.arrowBtn,
                {
                  backgroundColor: isDarkMode ? '#334155' : '#F8FAFC',
                  borderColor: isDarkMode ? '#475569' : '#E2E8F0',
                },
              ]}
              onPress={() => {
                const idx = MONTHS.indexOf(selectedMonth);
                if (idx > 0) setSelectedMonth(MONTHS[idx - 1]);
              }}
            >
              <ChevronLeft size={16} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.arrowBtn,
                {
                  backgroundColor: isDarkMode ? '#334155' : '#F8FAFC',
                  borderColor: isDarkMode ? '#475569' : '#E2E8F0',
                },
              ]}
              onPress={() => {
                const idx = MONTHS.indexOf(selectedMonth);
                if (idx < MONTHS.length - 1) setSelectedMonth(MONTHS[idx + 1]);
              }}
            >
              <ChevronRight size={16} color="#64748B" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.monthDropdownBtn,
                {
                  backgroundColor: isDarkMode ? '#334155' : '#F8FAFC',
                  borderColor: isDarkMode ? '#475569' : '#E2E8F0',
                },
              ]}
              onPress={() => setMonthModalOpen(true)}
            >
              <Text
                style={[
                  styles.monthDropdownText,
                  { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
                ]}
              >
                {selectedMonth}
              </Text>
              <ChevronDown size={14} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weekday Names */}
        <View style={styles.weekdayRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekdayText}>
              {d}
            </Text>
          ))}
        </View>

        {/* Days Grid */}
        <View style={styles.daysGrid}>
          {calendarDays.map((item, index) => {
            const isSelected = item.isCurrentMonth && item.day === selectedDay;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.isCurrentMonth) setSelectedDay(item.day);
                }}
                style={[
                  styles.dayCell,
                  isSelected && styles.dayCellSelected,
                  isSelected && {
                    borderColor: '#2563EB',
                    backgroundColor: isDarkMode ? '#1E3A8A' : '#EFF6FF',
                  },
                ]}
              >
                {isSelected ? (
                  <View style={styles.selectedDayBadge}>
                    <Text style={styles.selectedDayText}>{item.day}</Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.dayText,
                      !item.isCurrentMonth && styles.dayTextMuted,
                      { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
                      !item.isCurrentMonth && {
                        color: isDarkMode ? '#475569' : '#CBD5E1',
                      },
                    ]}
                  >
                    {item.day}
                  </Text>
                )}

                {/* Status Dot */}
                {item.status && (
                  <View
                    style={[
                      styles.statusDot,
                      item.status === 'present' && { backgroundColor: '#10B981' },
                      item.status === 'absent' && { backgroundColor: '#EF4444' },
                      item.status === 'leave' && { backgroundColor: '#8B5CF6' },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Calendar Footer: Legend & Full Calendar Link */}
        <View
          style={[
            styles.calendarFooter,
            { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
          ]}
        >
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendLabel}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.legendLabel}>Absent</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
              <Text style={styles.legendLabel}>Leave</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('Calendar')}
            style={styles.fullCalendarLink}
          >
            <Text style={styles.fullCalendarText}>View Full Calendar</Text>
            <ArrowRight size={13} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Today's / Selected Day's Attendance Widget */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.todayHeaderRow}>
          <View>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {selectedDay === 8 ? "Today's Attendance" : `Attendance: Apr ${selectedDay}, 2025`}
            </Text>
            <Text style={styles.cardDateSub}>Wed, Apr 08, 2025</Text>
          </View>
          <View style={styles.presentStatusBadge}>
            <Text style={styles.presentStatusText}>• Present</Text>
          </View>
        </View>

        <View style={styles.todayTimingRow}>
          {/* Check In */}
          <View
            style={[
              styles.timingBox,
              { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
            ]}
          >
            <View style={styles.timingIconWrap}>
              <Clock size={16} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.timingLabel}>Check In</Text>
              <Text
                style={[
                  styles.timingVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {activeDayDetails.checkIn || '09:12 AM'}
              </Text>
            </View>
          </View>

          {/* Check Out */}
          <View
            style={[
              styles.timingBox,
              { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
            ]}
          >
            <View style={styles.timingIconWrap}>
              <Clock size={16} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.timingLabel}>Check Out</Text>
              <Text
                style={[
                  styles.timingVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {activeDayDetails.checkOut || '06:08 PM'}
              </Text>
            </View>
          </View>
        </View>

        {/* Working Hours */}
        <View
          style={[
            styles.workingHoursBox,
            { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
          ]}
        >
          <View style={styles.timingIconWrap}>
            <Clock size={16} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.timingLabel}>Working Hours</Text>
            <Text
              style={[
                styles.timingVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {activeDayDetails.hours || '8h 56m'}
            </Text>
          </View>
        </View>
      </View>

      {/* Attendance Summary Widget with 90% Rate Donut & Legend */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.todayHeaderRow}>
          <View>
            <Text
              style={[
                styles.cardTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Attendance Summary
            </Text>
            <Text style={styles.cardDateSub}>This Month</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onNavigate && onNavigate('Analytics')}
          >
            <Text style={styles.viewReportLink}>View Report →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryBody}>
          {/* Circular Donut Gauge Representation */}
          <View style={styles.donutContainer}>
            <View style={styles.donutOuterCircle}>
              <View
                style={[
                  styles.donutInnerCircle,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
                ]}
              >
                <Text
                  style={[
                    styles.donutRateText,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  90%
                </Text>
                <Text style={styles.donutRateSub}>Attendance Rate</Text>
              </View>
            </View>
          </View>

          {/* Breakdown Stats */}
          <View style={styles.breakdownCol}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Present
                </Text>
              </View>
              <Text
                style={[
                  styles.breakdownVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                18 days
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.legendDot, { backgroundColor: '#EF4444' }]} />
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Absent
                </Text>
              </View>
              <Text
                style={[
                  styles.breakdownVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                2 days
              </Text>
            </View>

            <View style={styles.breakdownRow}>
              <View style={styles.breakdownLeft}>
                <View style={[styles.legendDot, { backgroundColor: '#8B5CF6' }]} />
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Leave
                </Text>
              </View>
              <Text
                style={[
                  styles.breakdownVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                1 day
              </Text>
            </View>

            <View
              style={[
                styles.breakdownRow,
                {
                  borderTopWidth: 1,
                  borderTopColor: isDarkMode ? '#334155' : '#F1F5F9',
                  paddingTop: 8,
                },
              ]}
            >
              <View style={styles.breakdownLeft}>
                <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} />
                <Text
                  style={[
                    styles.breakdownLabel,
                    { color: isDarkMode ? '#E2E8F0' : '#475569' },
                  ]}
                >
                  Total Working Days
                </Text>
              </View>
              <Text
                style={[
                  styles.breakdownVal,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                21 days
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Recent Activity Widget matching Screenshot 2 */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <View style={styles.todayHeaderRow}>
          <Text
            style={[
              styles.cardTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Recent Activity
          </Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewReportLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          {/* Item 1 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityIconCircle, { backgroundColor: '#ECFDF5' }]}>
              <CheckCircle2 size={16} color="#10B981" />
            </View>
            <View style={styles.activityContent}>
              <Text
                style={[
                  styles.activityTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Checked In
              </Text>
              <Text style={styles.activityTime}>Today, 09:12 AM</Text>
            </View>
          </View>

          {/* Item 2 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <ArrowRight size={16} color="#2563EB" />
            </View>
            <View style={styles.activityContent}>
              <Text
                style={[
                  styles.activityTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Checked Out
              </Text>
              <Text style={styles.activityTime}>Today, 06:08 PM</Text>
            </View>
          </View>

          {/* Item 3 */}
          <View style={styles.activityItem}>
            <View style={[styles.activityIconCircle, { backgroundColor: '#F5F3FF' }]}>
              <Calendar size={16} color="#8B5CF6" />
            </View>
            <View style={styles.activityContent}>
              <Text
                style={[
                  styles.activityTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Leave Approved
              </Text>
              <Text style={styles.activityTime}>Apr 05, 2025 • Casual Leave</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Month Dropdown Selection Modal */}
      <Modal
        visible={monthModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMonthModalOpen(false)}
        >
          <View
            style={[
              styles.monthModalCard,
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
                Select Month & Year
              </Text>
              <TouchableOpacity onPress={() => setMonthModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {MONTHS.map((m) => (
              <TouchableOpacity
                key={m}
                style={[
                  styles.monthOptionRow,
                  selectedMonth === m && {
                    backgroundColor: isDarkMode ? '#334155' : '#EFF6FF',
                  },
                ]}
                onPress={() => {
                  setSelectedMonth(m);
                  setMonthModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.monthOptionText,
                    {
                      color:
                        selectedMonth === m
                          ? '#2563EB'
                          : isDarkMode
                          ? '#E2E8F0'
                          : '#334155',
                      fontWeight: selectedMonth === m ? '700' : '500',
                    },
                  ]}
                >
                  {m}
                </Text>
                {selectedMonth === m && <Check size={16} color="#2563EB" />}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerTitleGroup: {
    flex: 1,
    marginRight: 8,
  },
  titleIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
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
  clockPresentBanner: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  livePillSmall: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
  },
  livePillSmallText: {
    color: '#166534',
    fontSize: 9,
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
    marginBottom: 10,
  },
  iconWrapper: {
    width: 34,
    height: 34,
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
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statSub: {
    fontSize: 11,
    color: '#94A3B8',
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
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  monthControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
  },
  monthDropdownText: {
    fontSize: 12,
    fontWeight: '600',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
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
    paddingVertical: 4,
    borderRadius: 8,
    position: 'relative',
  },
  dayCellSelected: {
    borderWidth: 1.5,
  },
  dayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dayTextMuted: {
    opacity: 0.5,
  },
  selectedDayBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'absolute',
    bottom: 4,
  },
  calendarFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  legendLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  fullCalendarLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullCalendarText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  todayHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  cardDateSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  presentStatusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  presentStatusText: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  todayTimingRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  timingBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  workingHoursBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  timingIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timingLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  timingVal: {
    fontSize: 14,
    fontWeight: '700',
  },
  viewReportLink: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 6,
  },
  donutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutOuterCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 8,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutInnerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donutRateText: {
    fontSize: 18,
    fontWeight: '800',
  },
  donutRateSub: {
    fontSize: 8,
    color: '#64748B',
    textAlign: 'center',
  },
  breakdownCol: {
    flex: 1,
    gap: 8,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  breakdownLabel: {
    fontSize: 12,
  },
  breakdownVal: {
    fontSize: 12,
    fontWeight: '700',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  activityIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: '#64748B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  monthModalCard: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  monthOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  monthOptionText: {
    fontSize: 13,
  },
});
