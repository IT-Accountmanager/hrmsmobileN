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
  Briefcase,
  Search,
  Plus,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Check,
  Building,
  MapPin,
  DollarSign,
  Users,
} from 'lucide-react-native';

interface JobOpeningsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export interface JobOpening {
  id: string;
  title: string;
  type: string;
  experience: string;
  department: string;
  location: string;
  applicationsCount: number;
  salaryMin: number;
  salaryMax: number;
  status: 'Active' | 'Closed' | 'Draft';
}

const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Frontend Developer',
    type: 'Full-time',
    experience: '3-5 years',
    department: 'Engineering',
    location: 'San Francisco / Remote',
    applicationsCount: 24,
    salaryMin: 120000,
    salaryMax: 150000,
    status: 'Active',
  },
  {
    id: 'job-2',
    title: 'Backend Developer (Node / Go)',
    type: 'Full-time',
    experience: '4-7 years',
    department: 'Engineering',
    location: 'San Francisco HQ',
    applicationsCount: 38,
    salaryMin: 140000,
    salaryMax: 175000,
    status: 'Active',
  },
  {
    id: 'job-3',
    title: 'UI/UX Product Designer',
    type: 'Full-time',
    experience: '3-6 years',
    department: 'Design',
    location: 'Remote',
    applicationsCount: 16,
    salaryMin: 110000,
    salaryMax: 140000,
    status: 'Active',
  },
  {
    id: 'job-4',
    title: 'HR Executive',
    type: 'Full-time',
    experience: '2-4 years',
    department: 'Human Resources',
    location: 'San Francisco HQ',
    applicationsCount: 12,
    salaryMin: 75000,
    salaryMax: 95000,
    status: 'Active',
  },
];

export const JobOpeningsScreen: React.FC<JobOpeningsScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'title' | 'department' | 'applicationsCount' | 'status'>('title');
  const [sortAsc, setSortAsc] = useState(true);

  // Modal State
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [formTitle, setFormTitle] = useState('');
  const [formDept, setFormDept] = useState('Engineering');
  const [formLocation, setFormLocation] = useState('San Francisco HQ');
  const [formType, setFormType] = useState('Full-time');
  const [formExp, setFormExp] = useState('3-5 years');
  const [formMinSal, setFormMinSal] = useState('110000');
  const [formMaxSal, setFormMaxSal] = useState('140000');

  const filteredJobs = jobs
    .filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  const toggleSort = (field: 'title' | 'department' | 'applicationsCount' | 'status') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExport = () => {
    Alert.alert(
      'Export Job Requisitions',
      `Exporting ${jobs.length} active requisitions to CSV archive.`,
      [{ text: 'Download File' }]
    );
  };

  const handleCreateJob = () => {
    if (!formTitle.trim()) {
      Alert.alert('Required', 'Please enter a job title.');
      return;
    }

    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: formTitle.trim(),
      type: formType,
      experience: formExp,
      department: formDept,
      location: formLocation,
      applicationsCount: 0,
      salaryMin: parseInt(formMinSal, 10) || 100000,
      salaryMax: parseInt(formMaxSal, 10) || 130000,
      status: 'Active',
    };

    setJobs([newJob, ...jobs]);
    setPostModalOpen(false);
    setFormTitle('');
    Alert.alert('Job Published', `Job opening "${newJob.title}" is now active in your talent portal.`);
  };

  const handleViewAts = (jobTitle: string) => {
    if (onNavigate) {
      onNavigate('Candidates');
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDarkMode && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER ROW */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, isDarkMode && styles.textWhite]}>
            Job Openings & Requisitions
          </Text>
          <Text style={[styles.headerSubtitle, isDarkMode && styles.textMutedDark]}>
            Create requisitions, manage open positions, and track talent applications.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.postBtn}
          activeOpacity={0.8}
          onPress={() => setPostModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.postBtnText}>Post New Job Opening</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH & EXPORT BAR */}
      <View style={[styles.filterBarCard, isDarkMode && styles.cardDark]}>
        <View style={[styles.searchBox, isDarkMode && styles.searchBoxDark]}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.textWhite]}
            placeholder="Search active job openings..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.exportBtn, isDarkMode && styles.exportBtnDark]}
          onPress={handleExport}
          activeOpacity={0.7}
        >
          <Download size={15} color={isDarkMode ? '#94A3B8' : '#475569'} />
          <Text style={[styles.exportBtnText, isDarkMode && styles.textMutedDark]}>
            Export
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABLE / CARD LIST */}
      <View style={[styles.tableContainer, isDarkMode && styles.cardDark]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 840 }}>
            {/* Table Header */}
            <View style={[styles.tableHeaderRow, isDarkMode && styles.tableHeaderRowDark]}>
              <TouchableOpacity
                style={[styles.thCol, { width: 240, flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                onPress={() => toggleSort('title')}
              >
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  JOB TITLE ↑↓
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.thCol, { width: 150, flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                onPress={() => toggleSort('department')}
              >
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  DEPARTMENT ↑↓
                </Text>
              </TouchableOpacity>

              <View style={[styles.thCol, { width: 170 }]}>
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  LOCATION
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.thCol, { width: 130, flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                onPress={() => toggleSort('applicationsCount')}
              >
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  APPLICATIONS ↑↓
                </Text>
              </TouchableOpacity>

              <View style={[styles.thCol, { width: 160 }]}>
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  SALARY RANGE
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.thCol, { width: 110, flexDirection: 'row', alignItems: 'center', gap: 4 }]}
                onPress={() => toggleSort('status')}
              >
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  STATUS ↑↓
                </Text>
              </TouchableOpacity>

              <View style={[styles.thCol, { width: 120 }]}>
                <Text style={[styles.thColText, isDarkMode && styles.textMutedDark]}>
                  PIPELINE
                </Text>
              </View>
            </View>

            {/* Table Rows */}
            {filteredJobs.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, isDarkMode && styles.textMutedDark]}>
                  No active job openings found matching "{searchQuery}".
                </Text>
              </View>
            ) : (
              filteredJobs.map((job, idx) => (
                <View
                  key={job.id}
                  style={[
                    styles.tableRow,
                    idx % 2 === 1 && (isDarkMode ? styles.rowEvenDark : styles.rowEvenLight),
                    isDarkMode && styles.tableRowDark,
                  ]}
                >
                  {/* Job Title with Briefcase Icon */}
                  <View style={[styles.tdCol, { width: 240, flexDirection: 'row', alignItems: 'center', gap: 10 }]}>
                    <View style={styles.jobIconWrap}>
                      <Briefcase size={16} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.jobTitleText, isDarkMode && styles.textWhite]}>
                        {job.title}
                      </Text>
                      <Text style={[styles.jobSubText, isDarkMode && styles.textMutedDark]}>
                        {job.type} • {job.experience}
                      </Text>
                    </View>
                  </View>

                  {/* Department */}
                  <View style={[styles.tdCol, { width: 150 }]}>
                    <Text style={[styles.tdText, isDarkMode && styles.textWhite]}>
                      {job.department}
                    </Text>
                  </View>

                  {/* Location */}
                  <View style={[styles.tdCol, { width: 170 }]}>
                    <Text style={[styles.tdSubText, isDarkMode && styles.textMutedDark]}>
                      {job.location}
                    </Text>
                  </View>

                  {/* Applications */}
                  <View style={[styles.tdCol, { width: 130 }]}>
                    <View style={styles.candidatesPill}>
                      <Text style={styles.candidatesPillText}>
                        {job.applicationsCount} Candidates
                      </Text>
                    </View>
                  </View>

                  {/* Salary Range */}
                  <View style={[styles.tdCol, { width: 160 }]}>
                    <Text style={[styles.salaryText, isDarkMode && styles.textWhite]}>
                      ${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}
                    </Text>
                  </View>

                  {/* Status */}
                  <View style={[styles.tdCol, { width: 110 }]}>
                    <View style={styles.activeStatusPill}>
                      <View style={styles.activeStatusDot} />
                      <Text style={styles.activeStatusText}>Active</Text>
                    </View>
                  </View>

                  {/* Pipeline Action */}
                  <View style={[styles.tdCol, { width: 120 }]}>
                    <TouchableOpacity
                      style={styles.viewAtsBtn}
                      activeOpacity={0.7}
                      onPress={() => handleViewAts(job.title)}
                    >
                      <Text style={styles.viewAtsBtnText}>View ATS</Text>
                      <ArrowRight size={13} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>

        {/* Table Footer with Pagination */}
        <View style={[styles.tableFooter, isDarkMode && styles.tableFooterDark]}>
          <Text style={[styles.footerCountText, isDarkMode && styles.textMutedDark]}>
            Showing <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>1</Text> to{' '}
            <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{filteredJobs.length}</Text> of{' '}
            <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{jobs.length}</Text> entries
          </Text>

          <View style={styles.paginationRow}>
            <TouchableOpacity style={styles.pageBtn} disabled>
              <ChevronsLeft size={16} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} disabled>
              <ChevronLeft size={16} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={[styles.pageIndicatorText, isDarkMode && styles.textWhite]}>
              Page 1 of 1
            </Text>
            <TouchableOpacity style={styles.pageBtn} disabled>
              <ChevronRight size={16} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageBtn} disabled>
              <ChevronsRight size={16} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* POST NEW JOB OPENING MODAL */}
      <Modal
        visible={postModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setPostModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDarkMode && styles.modalCardDark]}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                  Create Job Requisition
                </Text>
                <Text style={[styles.modalSubtitle, isDarkMode && styles.textMutedDark]}>
                  Publish a new position to careers site and internal hiring boards.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setPostModalOpen(false)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Modal Body */}
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Job Title *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Senior Cloud Architect"
                  placeholderTextColor="#94A3B8"
                  value={formTitle}
                  onChangeText={setFormTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Department
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="Engineering, Marketing, Sales, Design..."
                  placeholderTextColor="#94A3B8"
                  value={formDept}
                  onChangeText={setFormDept}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Location
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. San Francisco HQ / Remote"
                  placeholderTextColor="#94A3B8"
                  value={formLocation}
                  onChangeText={setFormLocation}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Employment Type
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    value={formType}
                    onChangeText={setFormType}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Experience
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    value={formExp}
                    onChangeText={setFormExp}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Min Salary ($ USD)
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    keyboardType="numeric"
                    value={formMinSal}
                    onChangeText={setFormMinSal}
                  />
                </View>

                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Max Salary ($ USD)
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    keyboardType="numeric"
                    value={formMaxSal}
                    onChangeText={setFormMaxSal}
                  />
                </View>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setPostModalOpen(false)}
              >
                <Text style={[styles.cancelBtnText, isDarkMode && styles.textWhite]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.8}
                onPress={handleCreateJob}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Publish Job</Text>
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
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
    minWidth: 260,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  postBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // FILTER & SEARCH
  filterBarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  searchBox: {
    flex: 1,
    minWidth: 240,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchBoxDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  exportBtnDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  exportBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  // TABLE
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableHeaderRowDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  thCol: {
    paddingRight: 8,
  },
  thColText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tableRowDark: {
    borderBottomColor: '#334155',
  },
  rowEvenLight: {
    backgroundColor: '#FAFCFF',
  },
  rowEvenDark: {
    backgroundColor: '#1B2638',
  },
  tdCol: {
    paddingRight: 8,
  },
  jobIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jobTitleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  jobSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  tdText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },
  tdSubText: {
    fontSize: 12,
    color: '#64748B',
  },
  candidatesPill: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  candidatesPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  salaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  activeStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  activeStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  activeStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#16A34A',
  },
  viewAtsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  viewAtsBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  emptyWrap: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },

  // FOOTER & PAGINATION
  tableFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexWrap: 'wrap',
    gap: 12,
  },
  tableFooterDark: {
    backgroundColor: '#1E293B',
    borderTopColor: '#334155',
  },
  footerCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pageBtn: {
    padding: 4,
    borderRadius: 4,
  },
  pageIndicatorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginHorizontal: 6,
  },

  // MODAL
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalCard: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  modalCardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  formInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  formInputDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    color: '#F8FAFC',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // UTILS
  textWhite: {
    color: '#F8FAFC',
  },
  textMutedDark: {
    color: '#94A3B8',
  },
});
