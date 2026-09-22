import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import {
  Plus,
  Award,
  Users,
  Briefcase,
  X,
  Check,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DesignationsScreenProps {
  onNavigate: (screenKey: string) => void;
}

interface DesignationItem {
  id: string;
  title: string;
  department: string;
  level: string; // e.g. L4
  activeCount: number;
}

const INITIAL_DESIGNATIONS: DesignationItem[] = [
  {
    id: 'desig-1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    level: 'L4',
    activeCount: 18,
  },
  {
    id: 'desig-2',
    title: 'Frontend Lead',
    department: 'Engineering',
    level: 'L5',
    activeCount: 4,
  },
  {
    id: 'desig-3',
    title: 'Marketing Director',
    department: 'Marketing',
    level: 'L6',
    activeCount: 2,
  },
  {
    id: 'desig-4',
    title: 'Senior Accountant',
    department: 'Finance',
    level: 'L4',
    activeCount: 5,
  },
  {
    id: 'desig-5',
    title: 'HR Executive',
    department: 'Human Resources',
    level: 'L3',
    activeCount: 4,
  },
  {
    id: 'desig-6',
    title: 'Sales Executive',
    department: 'Sales',
    level: 'L3',
    activeCount: 8,
  },
];

export const DesignationsScreen: React.FC<DesignationsScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();

  const [designations, setDesignations] = useState<DesignationItem[]>(INITIAL_DESIGNATIONS);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newLevel, setNewLevel] = useState('L4');

  const LEVELS = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7'];
  const DEPARTMENTS = ['Engineering', 'Marketing', 'Finance', 'Human Resources', 'Sales', 'Operations'];

  const handleAddDesignation = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required Fields', 'Please enter a Designation / Job Title.');
      return;
    }

    const newItem: DesignationItem = {
      id: `desig-${Date.now()}`,
      title: newTitle.trim(),
      department: newDept,
      level: newLevel,
      activeCount: 1,
    };

    setDesignations((prev) => [...prev, newItem]);
    setAddModalOpen(false);
    setNewTitle('');
    Alert.alert('Success', `${newItem.title} designation added successfully.`);
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
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Designations & Job Titles
          </Text>
          <Text style={styles.screenSubtitle}>
            Manage organization seniority levels (L1 - L7), band structures, and titles.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setAddModalOpen(true)}
          style={styles.addBtn}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addBtnText}>Add Designation</Text>
        </TouchableOpacity>
      </View>

      {/* Designation Cards Grid (Exact replica from Screenshot 3) */}
      <View style={styles.designationsGrid}>
        {designations.map((item) => (
          <View
            key={item.id}
            style={[
              styles.designationCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* Top Row: Award Icon + Title + Level Pill */}
            <View style={styles.cardTopRow}>
              <View style={styles.iconCircle}>
                <Award size={18} color="#2563EB" />
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.designationTitleText,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                <Text style={styles.deptSubText}>{item.department}</Text>
              </View>

              {/* Seniority Level Pill */}
              <View style={styles.levelPill}>
                <Text style={styles.levelPillText}>{item.level}</Text>
              </View>
            </View>

            {/* Bottom Row: Active Employees + Level L# */}
            <View style={styles.cardBottomRow}>
              <Text style={styles.activeEmployeesText}>
                {item.activeCount} active employees
              </Text>

              <Text style={styles.levelCodeText}>Level {item.level}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Add Designation Modal */}
      <Modal
        visible={addModalOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.modalIconWrap}>
                  <Award size={16} color="#2563EB" />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Add Designation
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setAddModalOpen(false)}
                style={styles.closeModalBtn}
              >
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              {/* Designation Title */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                Designation / Job Title
              </Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Principal Cloud Architect"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />

              {/* Department */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 12 }]}>
                Department
              </Text>
              <View style={styles.chipsRow}>
                {DEPARTMENTS.map((dept) => {
                  const isSel = newDept === dept;
                  return (
                    <TouchableOpacity
                      key={dept}
                      onPress={() => setNewDept(dept)}
                      style={[
                        styles.chipBtn,
                        isSel
                          ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                          : {
                              backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                            },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipBtnText,
                          { color: isSel ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Seniority Level (L1 - L7) */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 12 }]}>
                Seniority Level
              </Text>
              <View style={styles.levelsRow}>
                {LEVELS.map((lvl) => {
                  const isSel = newLevel === lvl;
                  return (
                    <TouchableOpacity
                      key={lvl}
                      onPress={() => setNewLevel(lvl)}
                      style={[
                        styles.levelBtn,
                        isSel
                          ? { backgroundColor: '#2563EB', borderColor: '#2563EB' }
                          : {
                              backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9',
                              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                            },
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelBtnText,
                          { color: isSel ? '#FFFFFF' : isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {lvl}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setAddModalOpen(false)}
                style={[
                  styles.cancelModalBtn,
                  { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' },
                ]}
              >
                <Text
                  style={[
                    styles.cancelModalBtnText,
                    { color: isDarkMode ? '#94A3B8' : '#64748B' },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleAddDesignation}
                style={styles.confirmModalBtn}
              >
                <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.confirmModalBtnText}>Save Designation</Text>
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
  },
  headerSection: {
    marginBottom: 16,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 10,
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

  // Grid of Cards
  designationsGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  designationCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  designationTitleText: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  deptSubText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  levelPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  levelPillText: {
    color: '#2563EB',
    fontSize: 11.5,
    fontWeight: '700',
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  activeEmployeesText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  levelCodeText: {
    color: '#2563EB',
    fontSize: 11.5,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    width: '100%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
    marginBottom: 12,
  },
  modalIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  closeModalBtn: {
    padding: 6,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '600',
    marginBottom: 5,
  },
  formInput: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chipBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  chipBtnText: {
    fontSize: 11.5,
    fontWeight: '500',
  },
  levelsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  levelBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.2)',
  },
  cancelModalBtn: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  cancelModalBtnText: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  confirmModalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  confirmModalBtnText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
  },
});
