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
  ArrowRight,
  Building,
  Users,
  X,
  Check,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DepartmentsScreenProps {
  onNavigate: (screenKey: string) => void;
}

interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  headName: string;
  memberCount: number;
  badgeColor: string;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  {
    id: 'dept-1',
    code: 'ENG',
    name: 'Engineering',
    headName: 'Amit Verma',
    memberCount: 54,
    badgeColor: '#2563EB',
  },
  {
    id: 'dept-2',
    code: 'MKT',
    name: 'Marketing',
    headName: 'Priya Singh',
    memberCount: 22,
    badgeColor: '#EC4899',
  },
  {
    id: 'dept-3',
    code: 'FIN',
    name: 'Finance',
    headName: 'Marcus Sterling',
    memberCount: 14,
    badgeColor: '#10B981',
  },
  {
    id: 'dept-4',
    code: 'HR',
    name: 'Human Resources',
    headName: 'Sneha Gupta',
    memberCount: 12,
    badgeColor: '#8B5CF6',
  },
  {
    id: 'dept-5',
    code: 'SAL',
    name: 'Sales',
    headName: 'Sandeep Yadav',
    memberCount: 16,
    badgeColor: '#F59E0B',
  },
  {
    id: 'dept-6',
    code: 'OPS',
    name: 'Operations',
    headName: 'David Vance',
    memberCount: 6,
    badgeColor: '#06B6D4',
  },
];

export const DepartmentsScreen: React.FC<DepartmentsScreenProps> = ({ onNavigate }) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();

  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form State
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [selectedColor, setSelectedColor] = useState('#2563EB');

  const COLOR_CHOICES = ['#2563EB', '#EC4899', '#10B981', '#8B5CF6', '#F59E0B', '#06B6D4'];

  const handleAddDepartment = () => {
    if (!newDeptName.trim() || !newDeptCode.trim() || !newDeptHead.trim()) {
      Alert.alert('Required Fields', 'Please enter Department Name, Code, and Department Head.');
      return;
    }

    const newDept: DepartmentItem = {
      id: `dept-${Date.now()}`,
      code: newDeptCode.trim().toUpperCase(),
      name: newDeptName.trim(),
      headName: newDeptHead.trim(),
      memberCount: 1,
      badgeColor: selectedColor,
    };

    setDepartments((prev) => [...prev, newDept]);
    setAddModalOpen(false);
    setNewDeptName('');
    setNewDeptCode('');
    setNewDeptHead('');
    Alert.alert('Success', `${newDept.name} department created successfully.`);
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
            Departments
          </Text>
          <Text style={styles.screenSubtitle}>
            Organize headcount, departmental budgets, and department head reporting lines.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setAddModalOpen(true)}
          style={styles.addDeptBtn}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addDeptBtnText}>Add Department</Text>
        </TouchableOpacity>
      </View>

      {/* Departments Grid Cards (Exact replica from Screenshot 2) */}
      <View style={styles.departmentsGrid}>
        {departments.map((dept) => (
          <View
            key={dept.id}
            style={[
              styles.departmentCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* Top Row: Icon Badge + Name + Members Pill */}
            <View style={styles.deptCardTopRow}>
              {/* Badge with 3-4 letter code */}
              <View
                style={[
                  styles.deptCodeBadge,
                  { backgroundColor: dept.badgeColor },
                ]}
              >
                <Text style={styles.deptCodeBadgeText}>{dept.code}</Text>
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.deptNameText,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                  numberOfLines={1}
                >
                  {dept.name}
                </Text>
                <Text style={styles.deptHeadText} numberOfLines={1}>
                  Head: {dept.headName}
                </Text>
              </View>

              {/* Members Pill */}
              <View style={styles.membersPill}>
                <Text style={styles.membersPillText}>{dept.memberCount} Members</Text>
              </View>
            </View>

            {/* Bottom Row: Department Code + View Members Link */}
            <View style={styles.deptCardBottomRow}>
              <Text style={styles.deptCodeFooterText}>
                Department Code: <Text style={styles.deptCodeBold}>{dept.code}</Text>
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onNavigate('Employees')}
                style={styles.viewMembersLink}
              >
                <Text style={styles.viewMembersLinkText}>View Members</Text>
                <ArrowRight size={13} color="#2563EB" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Add Department Modal */}
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
                  <Building size={16} color="#2563EB" />
                </View>
                <Text
                  style={[
                    styles.modalTitle,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                >
                  Add New Department
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
              {/* Department Name */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                Department Name
              </Text>
              <TextInput
                value={newDeptName}
                onChangeText={setNewDeptName}
                placeholder="e.g. Artificial Intelligence Labs"
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

              {/* Department Code */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 12 }]}>
                Department Code (2-4 letters)
              </Text>
              <TextInput
                value={newDeptCode}
                onChangeText={setNewDeptCode}
                placeholder="e.g. AIL"
                placeholderTextColor="#94A3B8"
                autoCapitalize="characters"
                maxLength={5}
                style={[
                  styles.formInput,
                  {
                    backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
                    borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                    color: isDarkMode ? '#FFFFFF' : '#0F172A',
                  },
                ]}
              />

              {/* Department Head */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 12 }]}>
                Department Head
              </Text>
              <TextInput
                value={newDeptHead}
                onChangeText={setNewDeptHead}
                placeholder="e.g. Dr. Jane Foster"
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

              {/* Color Tag */}
              <Text style={[styles.inputLabel, { color: isDarkMode ? '#E2E8F0' : '#334155', marginTop: 12 }]}>
                Badge Color
              </Text>
              <View style={styles.colorPickerRow}>
                {COLOR_CHOICES.map((c) => {
                  const isSel = selectedColor === c;
                  return (
                    <TouchableOpacity
                      key={c}
                      onPress={() => setSelectedColor(c)}
                      style={[
                        styles.colorCircle,
                        { backgroundColor: c },
                        isSel && styles.colorCircleSelected,
                      ]}
                    >
                      {isSel && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
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
                onPress={handleAddDepartment}
                style={styles.confirmModalBtn}
              >
                <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.confirmModalBtnText}>Create Department</Text>
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
  addDeptBtn: {
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
  addDeptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Grid of Cards
  departmentsGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  departmentCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  deptCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deptCodeBadge: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deptCodeBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  deptNameText: {
    fontSize: 15,
    fontWeight: '700',
  },
  deptHeadText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  membersPill: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  membersPillText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  deptCardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  deptCodeFooterText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  deptCodeBold: {
    fontWeight: '700',
  },
  viewMembersLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMembersLinkText: {
    color: '#2563EB',
    fontSize: 12,
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
  colorPickerRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  colorCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorCircleSelected: {
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
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
