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
  Calendar,
  MapPin,
  Plus,
  Sparkles,
  ChevronDown,
  X,
  Check,
} from 'lucide-react-native';

interface HolidaysScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface HolidayItem {
  id: string;
  name: string;
  category: 'Public Holiday' | 'Optional / Floating';
  date: string;
  dayOfWeek: string;
  location: string;
  isUpcoming: boolean;
}

const INITIAL_HOLIDAYS: HolidayItem[] = [
  {
    id: 'h-1',
    name: "New Year's Day",
    category: 'Public Holiday',
    date: 'Jan 01, 2024 (Monday)',
    dayOfWeek: 'Monday',
    location: 'Global / All Offices',
    isUpcoming: false,
  },
  {
    id: 'h-2',
    name: 'Martin Luther King Jr. Day',
    category: 'Public Holiday',
    date: 'Jan 15, 2024 (Monday)',
    dayOfWeek: 'Monday',
    location: 'US Offices',
    isUpcoming: false,
  },
  {
    id: 'h-3',
    name: 'Presidents Day',
    category: 'Optional / Floating',
    date: 'Feb 19, 2024 (Monday)',
    dayOfWeek: 'Monday',
    location: 'US Offices',
    isUpcoming: false,
  },
  {
    id: 'h-4',
    name: 'Good Friday',
    category: 'Public Holiday',
    date: 'Mar 29, 2024 (Friday)',
    dayOfWeek: 'Friday',
    location: 'Global / All Offices',
    isUpcoming: false,
  },
  {
    id: 'h-5',
    name: 'Memorial Day',
    category: 'Public Holiday',
    date: 'May 27, 2024 (Monday)',
    dayOfWeek: 'Monday',
    location: 'Global / All Offices',
    isUpcoming: true,
  },
  {
    id: 'h-6',
    name: 'Juneteenth National Independence',
    category: 'Public Holiday',
    date: 'Jun 19, 2024 (Wednesday)',
    dayOfWeek: 'Wednesday',
    location: 'US Offices',
    isUpcoming: true,
  },
];

const CALENDAR_YEARS = ['Calendar 2024', 'Calendar 2025', 'Calendar 2026'];

export const HolidaysScreen: React.FC<HolidaysScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [holidays, setHolidays] = useState<HolidayItem[]>(INITIAL_HOLIDAYS);
  const [selectedYear, setSelectedYear] = useState('Calendar 2024');
  const [yearModalOpen, setYearModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Holiday Form
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState('Jul 04, 2024 (Thursday)');
  const [newLocation, setNewLocation] = useState('US Offices');
  const [newCategory, setNewCategory] = useState<'Public Holiday' | 'Optional / Floating'>('Public Holiday');

  const upcomingCount = holidays.filter((h) => h.isUpcoming).length + 6;

  const handleAddHoliday = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter a holiday title.');
      return;
    }

    const newHol: HolidayItem = {
      id: `h-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      date: newDate.trim(),
      dayOfWeek: 'Holiday',
      location: newLocation.trim(),
      isUpcoming: true,
    };

    setHolidays([...holidays, newHol]);
    setAddModalOpen(false);
    setNewName('');
    Alert.alert('Holiday Added', `Holiday "${newHol.name}" scheduled on company calendar.`);
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
              Company Holiday Calendar
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{holidays.length} Days in 2024</Text>
            </View>
          </View>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Official paid public holidays, regional observances, and floating time-off schedules.
          </Text>
        </View>

        {/* Year Dropdown & Add Button */}
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[
              styles.yearBtn,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
            onPress={() => setYearModalOpen(true)}
          >
            <Text
              style={[
                styles.yearBtnText,
                { color: isDarkMode ? '#F8FAFC' : '#1E293B' },
              ]}
            >
              {selectedYear}
            </Text>
            <ChevronDown size={14} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setAddModalOpen(true)}
            style={styles.addBtn}
          >
            <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.addBtnText}>Add Holiday</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Big Banner matching Screenshot 5 */}
      <View style={styles.featuredBanner}>
        <View style={styles.featuredLeft}>
          <View style={styles.upcomingBadge}>
            <Sparkles size={13} color="#FBBF24" />
            <Text style={styles.upcomingBadgeText}>Next Upcoming Holiday</Text>
          </View>
          <Text style={styles.featuredTitle}>
            Memorial Day — May 27, 2024 (Monday)
          </Text>
          <Text style={styles.featuredDesc}>
            Paid public holiday observed across all offices. Support desks will operate on emergency on-call schedule.
          </Text>
        </View>

        <View style={styles.featuredRightBox}>
          <Text style={styles.featuredBigNum}>8</Text>
          <Text style={styles.featuredSubLabel}>Holidays Left</Text>
        </View>
      </View>

      {/* Holiday Cards Grid */}
      <View style={styles.holidayGrid}>
        {holidays.map((hol) => (
          <View
            key={hol.id}
            style={[
              styles.holidayCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#F1F5F9',
              },
            ]}
          >
            {/* Top Badges */}
            <View style={styles.cardHeaderRow}>
              <View
                style={[
                  styles.categoryPill,
                  hol.category === 'Public Holiday'
                    ? { backgroundColor: '#EFF6FF' }
                    : { backgroundColor: '#FEF3C7' },
                ]}
              >
                <Text
                  style={[
                    styles.categoryPillText,
                    hol.category === 'Public Holiday'
                      ? { color: '#2563EB' }
                      : { color: '#B45309' },
                  ]}
                >
                  {hol.category}
                </Text>
              </View>

              {hol.isUpcoming ? (
                <View style={styles.upcomingPill}>
                  <View style={styles.greenDot} />
                  <Text style={styles.upcomingPillText}>Upcoming</Text>
                </View>
              ) : (
                <Text style={styles.passedText}>Passed</Text>
              )}
            </View>

            {/* Holiday Title */}
            <Text
              style={[
                styles.holidayTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
              numberOfLines={2}
            >
              {hol.name}
            </Text>

            {/* Footer Row: Date & Location */}
            <View
              style={[
                styles.cardFooter,
                { borderTopColor: isDarkMode ? '#334155' : '#F1F5F9' },
              ]}
            >
              <View style={styles.infoMetaRow}>
                <Calendar size={13} color="#3B82F6" />
                <Text style={styles.infoMetaText}>{hol.date}</Text>
              </View>

              <View style={styles.infoMetaRow}>
                <MapPin size={13} color="#94A3B8" />
                <Text style={styles.infoMetaText}>{hol.location}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Year Selection Modal */}
      <Modal
        visible={yearModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setYearModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setYearModalOpen(false)}
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
                Select Holiday Calendar
              </Text>
              <TouchableOpacity onPress={() => setYearModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {CALENDAR_YEARS.map((y) => (
              <TouchableOpacity
                key={y}
                style={[
                  styles.optionRow,
                  selectedYear === y && { backgroundColor: isDarkMode ? '#334155' : '#EFF6FF' },
                ]}
                onPress={() => {
                  setSelectedYear(y);
                  setYearModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: selectedYear === y ? '#2563EB' : isDarkMode ? '#E2E8F0' : '#334155',
                      fontWeight: selectedYear === y ? '700' : '500',
                    },
                  ]}
                >
                  {y}
                </Text>
                {selectedYear === y && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Holiday Modal */}
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
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Add Company Holiday
              </Text>
              <TouchableOpacity onPress={() => setAddModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Holiday Name</Text>
              <TextInput
                placeholder="e.g. Independence Day"
                placeholderTextColor="#94A3B8"
                value={newName}
                onChangeText={setNewName}
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
              <Text style={styles.formLabel}>Date & Day</Text>
              <TextInput
                placeholder="e.g. Jul 04, 2024 (Thursday)"
                placeholderTextColor="#94A3B8"
                value={newDate}
                onChangeText={setNewDate}
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
              <Text style={styles.formLabel}>Office Location</Text>
              <TextInput
                placeholder="e.g. US Offices or Global"
                placeholderTextColor="#94A3B8"
                value={newLocation}
                onChangeText={setNewLocation}
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
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAddHoliday}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Add Holiday</Text>
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
    gap: 10,
    flexWrap: 'wrap',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  countBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  countBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
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
  yearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  yearBtnText: {
    fontSize: 13,
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
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  featuredBanner: {
    borderRadius: 16,
    backgroundColor: '#2563EB',
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 12,
  },
  featuredLeft: {
    flex: 1,
  },
  upcomingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
    marginBottom: 10,
  },
  upcomingBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 22,
    marginBottom: 6,
  },
  featuredDesc: {
    color: '#DBEAFE',
    fontSize: 12,
    lineHeight: 16,
  },
  featuredRightBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  featuredBigNum: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
  },
  featuredSubLabel: {
    color: '#DBEAFE',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
  holidayGrid: {
    gap: 12,
  },
  holidayCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  upcomingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#166534',
  },
  upcomingPillText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '700',
  },
  passedText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  holidayTitle: {
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: 14,
  },
  cardFooter: {
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 6,
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoMetaText: {
    fontSize: 12,
    color: '#64748B',
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
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  optionText: {
    fontSize: 13,
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
