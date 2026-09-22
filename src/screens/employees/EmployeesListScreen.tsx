import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '../../store/useAppStore';
import {
  Search,
  Plus,
  Eye,
  Calendar,
  Phone,
  Building,
  Briefcase,
  ChevronDown,
  Download,
  Check,
  X,
  Share2,
} from 'lucide-react-native';
import { AddEmployeeModal } from './AddEmployeeModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EmployeesListScreenProps {
  onNavigate: (screenKey: string) => void;
}

export interface EmployeeDirectoryItem {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  avatar: string;
  department: string;
  designation: string;
  phone: string;
  joiningDate: string;
  type: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  isOnline?: boolean;
}

const INITIAL_DIRECTORY: EmployeeDirectoryItem[] = [
  {
    id: 'emp-1',
    employeeId: 'EMP001',
    fullName: 'Rahul Sharma',
    email: 'rahul.sharma@acmecorp.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Engineering',
    designation: 'Senior Software Engineer',
    phone: '+1 (555) 342-1001',
    joiningDate: 'Apr 15, 2023',
    type: 'Full-time',
    status: 'Active',
    isOnline: true,
  },
  {
    id: 'emp-2',
    employeeId: 'EMP002',
    fullName: 'Priya Singh',
    email: 'priya.singh@acmecorp.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Marketing',
    designation: 'Marketing Director',
    phone: '+1 (555) 342-1002',
    joiningDate: 'Feb 10, 2023',
    type: 'Full-time',
    status: 'Active',
    isOnline: true,
  },
  {
    id: 'emp-3',
    employeeId: 'EMP003',
    fullName: 'Amit Kumar',
    email: 'amit.kumar@acmecorp.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Finance',
    designation: 'Senior Accountant',
    phone: '+1 (555) 342-1003',
    joiningDate: 'Jun 01, 2023',
    type: 'Full-time',
    status: 'Active',
    isOnline: true,
  },
  {
    id: 'emp-4',
    employeeId: 'EMP004',
    fullName: 'Neha Gupta',
    email: 'neha.gupta@acmecorp.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Human Resources',
    designation: 'HR Executive',
    phone: '+1 (555) 342-1004',
    joiningDate: 'Sep 15, 2023',
    type: 'Full-time',
    status: 'Active',
    isOnline: true,
  },
  {
    id: 'emp-5',
    employeeId: 'EMP005',
    fullName: 'Sandeep Yadav',
    email: 'sandeep.yadav@acmecorp.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Sales',
    designation: 'Sales Executive',
    phone: '+1 (555) 342-1005',
    joiningDate: 'Oct 01, 2023',
    type: 'Full-time',
    status: 'Active',
    isOnline: true,
  },
];

export const EmployeesListScreen: React.FC<EmployeesListScreenProps> = ({
  onNavigate,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useAppStore();

  const [employees, setEmployees] = useState<EmployeeDirectoryItem[]>(INITIAL_DIRECTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  const departments = [
    'All Departments',
    'Engineering',
    'Marketing',
    'Finance',
    'Human Resources',
    'Sales',
    'Operations',
  ];

  const statuses = ['All Statuses', 'Active', 'On Leave', 'Inactive'];

  const filteredEmployees = employees.filter((emp) => {
    const matchSearch =
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDept =
      selectedDept === 'All Departments' ||
      emp.department.toLowerCase() === selectedDept.toLowerCase();

    const matchStatus =
      selectedStatus === 'All Statuses' ||
      emp.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchSearch && matchDept && matchStatus;
  });

  const handleExport = () => {
    Alert.alert(
      'Export Directory',
      'Exporting Acme Corp employee directory roster (CSV / Excel)...',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export CSV',
          onPress: () =>
            Alert.alert('Download Complete', 'Acme_Employee_Directory_2024.csv exported.'),
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
      {/* ===================== HEADER ===================== */}
      <View style={styles.headerSection}>
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
            ]}
          >
            Employee Directory
          </Text>
          <Text style={styles.screenSubtitle}>
            Manage organization members, assignments, roles, documents, and 360° profiles.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setAddModalOpen(true)}
          style={styles.addNewEmpBtn}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.addNewEmpBtnText}>Add New Employee</Text>
        </TouchableOpacity>
      </View>

      {/* ===================== FILTER DROPDOWNS ===================== */}
      <View style={styles.filterDropdownsRow}>
        {/* Department Dropdown */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setDeptModalOpen(true)}
          style={[
            styles.filterDropdownBtn,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              styles.filterDropdownBtnText,
              { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
            ]}
            numberOfLines={1}
          >
            {selectedDept}
          </Text>
          <ChevronDown size={13} color="#94A3B8" />
        </TouchableOpacity>

        {/* Status Dropdown */}
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setStatusModalOpen(true)}
          style={[
            styles.filterDropdownBtn,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              styles.filterDropdownBtnText,
              { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
            ]}
            numberOfLines={1}
          >
            {selectedStatus}
          </Text>
          <ChevronDown size={13} color="#94A3B8" />
        </TouchableOpacity>
      </View>

      {/* ===================== SEARCH & EXPORT ROW ===================== */}
      <View style={styles.searchExportRow}>
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Search size={15} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by employee name, email, or department..."
            placeholderTextColor="#94A3B8"
            style={[
              styles.searchInput,
              { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={14} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleExport}
          style={[
            styles.exportButton,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#CBD5E1',
            },
          ]}
        >
          <Download size={13} color="#64748B" style={{ marginRight: 5 }} />
          <Text
            style={[
              styles.exportButtonText,
              { color: isDarkMode ? '#E2E8F0' : '#334155' },
            ]}
          >
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* ===================== EMPLOYEE DIRECTORY CARDS ===================== */}
      <View style={styles.directoryList}>
        {filteredEmployees.map((emp) => (
          <TouchableOpacity
            key={emp.id}
            activeOpacity={0.85}
            onPress={() => onNavigate('Profile')}
            style={[
              styles.empDirectoryCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            {/* Top row: ID + Status + Eye Action */}
            <View style={styles.cardHeaderRow}>
              <View style={styles.empIdBadge}>
                <Text style={styles.empIdText}>{emp.employeeId}</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={styles.activeStatusPill}>
                  <View style={styles.activeDot} />
                  <Text style={styles.activeStatusText}>{emp.status}</Text>
                </View>

                <TouchableOpacity
                  onPress={() => onNavigate('Profile')}
                  style={[
                    styles.viewActionBtn,
                    { backgroundColor: isDarkMode ? '#0F172A' : '#F1F5F9' },
                  ]}
                >
                  <Eye size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Row: Avatar + Name + Email */}
            <View style={styles.profileRow}>
              <View style={styles.avatarWrap}>
                <Image source={{ uri: emp.avatar }} style={styles.avatarImg} />
                {emp.isOnline && <View style={styles.onlineDot} />}
              </View>

              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={[
                    styles.empFullName,
                    { color: isDarkMode ? '#FFFFFF' : '#0F172A' },
                  ]}
                  numberOfLines={1}
                >
                  {emp.fullName}
                </Text>
                <Text style={styles.empEmailText} numberOfLines={1}>
                  {emp.email}
                </Text>
              </View>
            </View>

            {/* Role & Department Row */}
            <View
              style={[
                styles.roleDeptSection,
                { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
              ]}
            >
              <View style={styles.metaRowItem}>
                <Building size={12} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.metaLabel}>Department: </Text>
                <Text
                  style={[
                    styles.metaValue,
                    { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
                  ]}
                >
                  {emp.department}
                </Text>
              </View>

              <View style={styles.metaRowItem}>
                <Briefcase size={12} color="#64748B" style={{ marginRight: 5 }} />
                <Text style={styles.metaLabel}>Designation: </Text>
                <Text
                  style={[
                    styles.metaValue,
                    { color: isDarkMode ? '#E2E8F0' : '#1E293B' },
                  ]}
                >
                  {emp.designation}
                </Text>
              </View>
            </View>

            {/* Footer Row: Phone, Joining Date, Type */}
            <View style={styles.cardFooterDetails}>
              <View style={styles.footerDetailItem}>
                <Phone size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={styles.footerDetailText}>{emp.phone}</Text>
              </View>

              <View style={styles.footerDetailItem}>
                <Calendar size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={styles.footerDetailText}>{emp.joiningDate}</Text>
              </View>

              <View style={styles.typeTag}>
                <Text style={styles.typeTagText}>{emp.type}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
                Select Department
              </Text>
              <TouchableOpacity onPress={() => setDeptModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <TouchableOpacity
                  key={dept}
                  onPress={() => {
                    setSelectedDept(dept);
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
                    {dept}
                  </Text>
                  {isSelected && <Check size={16} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ===================== STATUS FILTER MODAL ===================== */}
      <Modal
        visible={statusModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setStatusModalOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setStatusModalOpen(false)}
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
                Select Status
              </Text>
              <TouchableOpacity onPress={() => setStatusModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            {statuses.map((stat) => {
              const isSelected = selectedStatus === stat;
              return (
                <TouchableOpacity
                  key={stat}
                  onPress={() => {
                    setSelectedStatus(stat);
                    setStatusModalOpen(false);
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
                    {stat}
                  </Text>
                  {isSelected && <Check size={16} color="#2563EB" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        visible={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => {
          setAddModalOpen(false);
          Alert.alert('Success', 'New employee successfully added to directory.');
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
  },

  // Header
  headerSection: {
    marginBottom: 12,
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
  addNewEmpBtn: {
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
  addNewEmpBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  // Filter Dropdowns
  filterDropdownsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  filterDropdownBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  filterDropdownBtnText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },

  // Search & Export
  searchExportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 38,
  },
  exportButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Directory Cards
  directoryList: {
    flexDirection: 'column',
    gap: 12,
  },
  empDirectoryCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  empIdBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  empIdText: {
    color: '#2563EB',
    fontSize: 11.5,
    fontWeight: '700',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    gap: 4,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeStatusText: {
    color: '#059669',
    fontSize: 10.5,
    fontWeight: '700',
  },
  viewActionBtn: {
    padding: 6,
    borderRadius: 6,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImg: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#10B981',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  empFullName: {
    fontSize: 14.5,
    fontWeight: '700',
  },
  empEmailText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleDeptSection: {
    padding: 10,
    borderRadius: 8,
    gap: 4,
    marginBottom: 10,
  },
  metaRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  metaValue: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  cardFooterDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  footerDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerDetailText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  typeTag: {
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeTagText: {
    fontSize: 10,
    color: '#64748B',
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
