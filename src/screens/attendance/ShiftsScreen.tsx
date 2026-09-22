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
  Plus,
  X,
  Check,
  Calendar,
  Sparkles,
  Shield,
  Edit2,
  Trash2,
} from 'lucide-react-native';

interface ShiftsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface ShiftSchedule {
  id: string;
  name: string;
  badge: 'Active' | 'Inactive';
  iconColor: string;
  iconBg: string;
  hours: string;
  breakDuration: string;
  graceWindow: string;
}

const INITIAL_SHIFTS: ShiftSchedule[] = [
  {
    id: 'shift-1',
    name: 'Regular General Shift',
    badge: 'Active',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
    hours: '09:00 AM - 06:00 PM',
    breakDuration: '60 mins',
    graceWindow: '15 mins',
  },
  {
    id: 'shift-2',
    name: 'Morning Early Shift',
    badge: 'Active',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
    hours: '07:00 AM - 04:00 PM',
    breakDuration: '60 mins',
    graceWindow: '15 mins',
  },
  {
    id: 'shift-3',
    name: 'Evening Shift',
    badge: 'Active',
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
    hours: '02:00 PM - 11:00 PM',
    breakDuration: '60 mins',
    graceWindow: '15 mins',
  },
];

export const ShiftsScreen: React.FC<ShiftsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [shifts, setShifts] = useState<ShiftSchedule[]>(INITIAL_SHIFTS);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // New Shift Form State
  const [shiftName, setShiftName] = useState('');
  const [startHour, setStartHour] = useState('10:00 AM');
  const [endHour, setEndHour] = useState('07:00 PM');
  const [breakMins, setBreakMins] = useState('45 mins');
  const [graceMins, setGraceMins] = useState('15 mins');
  const [colorTheme, setColorTheme] = useState<'blue' | 'green' | 'purple'>('blue');

  const handleCreateShift = () => {
    if (!shiftName.trim()) {
      Alert.alert('Required', 'Please specify a name for the shift schedule.');
      return;
    }

    const colorConfig = {
      blue: { iconColor: '#3B82F6', iconBg: '#EFF6FF' },
      green: { iconColor: '#10B981', iconBg: '#ECFDF5' },
      purple: { iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
    }[colorTheme];

    const newShift: ShiftSchedule = {
      id: `shift-${Date.now()}`,
      name: shiftName.trim(),
      badge: 'Active',
      iconColor: colorConfig.iconColor,
      iconBg: colorConfig.iconBg,
      hours: `${startHour} - ${endHour}`,
      breakDuration: breakMins,
      graceWindow: graceMins,
    };

    setShifts([...shifts, newShift]);
    setCreateModalOpen(false);
    setShiftName('');
    Alert.alert('Success', `Shift "${newShift.name}" created successfully.`);
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
      <View style={styles.headerRow}>
        <View style={styles.headerTextCol}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Shift Management & Work Schedules
          </Text>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Define organizational shift timings, grace periods, and break allowances.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCreateModalOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.createBtnText}>Create New Shift</Text>
        </TouchableOpacity>
      </View>

      {/* 3 Shift Cards matching Screenshot 5 */}
      <View style={styles.shiftsGrid}>
        {shifts.map((shift) => (
          <View
            key={shift.id}
            style={[
              styles.shiftCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#F1F5F9',
              },
            ]}
          >
            {/* Card Header: Icon, Name & Active Badge */}
            <View style={styles.cardHeader}>
              <View style={styles.titleWithIcon}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: shift.iconBg },
                  ]}
                >
                  <Clock size={18} color={shift.iconColor} />
                </View>
                <Text
                  style={[
                    styles.shiftName,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {shift.name}
                </Text>
              </View>

              <View style={styles.activePill}>
                <Text style={styles.activePillText}>{shift.badge}</Text>
              </View>
            </View>

            {/* Inner Details Container */}
            <View
              style={[
                styles.detailsBox,
                { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
              ]}
            >
              {/* Shift Hours */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Shift Hours:</Text>
                <Text
                  style={[
                    styles.detailValBold,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {shift.hours}
                </Text>
              </View>

              {/* Break Duration */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Break Duration:</Text>
                <Text
                  style={[
                    styles.detailValBold,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {shift.breakDuration}
                </Text>
              </View>

              {/* Late Grace Window */}
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Late Grace Window:</Text>
                <Text style={styles.graceValText}>{shift.graceWindow}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Create New Shift Modal */}
      <Modal
        visible={createModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setCreateModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
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
                Create New Work Shift
              </Text>
              <TouchableOpacity onPress={() => setCreateModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text
                style={[
                  styles.formLabel,
                  { color: isDarkMode ? '#CBD5E1' : '#475569' },
                ]}
              >
                Shift Name
              </Text>
              <TextInput
                placeholder="e.g. Night Overlap Shift"
                placeholderTextColor="#94A3B8"
                value={shiftName}
                onChangeText={setShiftName}
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
                  Start Time
                </Text>
                <TextInput
                  value={startHour}
                  onChangeText={setStartHour}
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
                  End Time
                </Text>
                <TextInput
                  value={endHour}
                  onChangeText={setEndHour}
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

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text
                  style={[
                    styles.formLabel,
                    { color: isDarkMode ? '#CBD5E1' : '#475569' },
                  ]}
                >
                  Break Duration
                </Text>
                <TextInput
                  value={breakMins}
                  onChangeText={setBreakMins}
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
                  Grace Window
                </Text>
                <TextInput
                  value={graceMins}
                  onChangeText={setGraceMins}
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
                Color Theme
              </Text>
              <View style={styles.colorRow}>
                {(['blue', 'green', 'purple'] as const).map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setColorTheme(c)}
                    style={[
                      styles.colorChoiceBtn,
                      colorTheme === c && styles.colorChoiceSelected,
                    ]}
                  >
                    <View
                      style={[
                        styles.colorSwatch,
                        {
                          backgroundColor:
                            c === 'blue'
                              ? '#3B82F6'
                              : c === 'green'
                              ? '#10B981'
                              : '#8B5CF6',
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.colorText,
                        { color: isDarkMode ? '#E2E8F0' : '#475569' },
                      ]}
                    >
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setCreateModalOpen(false)}
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
                onPress={handleCreateShift}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Create Shift</Text>
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
  headerRow: {
    marginBottom: 20,
    gap: 12,
  },
  headerTextCol: {
    flex: 1,
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
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  shiftsGrid: {
    gap: 16,
  },
  shiftCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shiftName: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  activePill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  activePillText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  detailsBox: {
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  detailValBold: {
    fontSize: 13,
    fontWeight: '700',
  },
  graceValText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
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
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
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
  colorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorChoiceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  colorChoiceSelected: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  colorSwatch: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  colorText: {
    fontSize: 12,
    fontWeight: '600',
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
