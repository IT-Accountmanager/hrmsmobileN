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
  Search,
  Download,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Check,
  Clock,
  User,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Share2,
} from 'lucide-react-native';

interface InterviewsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export interface ScheduledInterview {
  id: string;
  candidateName: string;
  candidateRole: string;
  stageRound: string;
  interviewer: string;
  dateTime: string;
  status: 'Scheduled' | 'Completed' | 'In Progress' | 'Cancelled';
  meetingUrl: string;
}

const INITIAL_INTERVIEWS: ScheduledInterview[] = [
  {
    id: 'int-1',
    candidateName: 'Aarav Patel',
    candidateRole: 'Frontend Developer',
    stageRound: 'Technical Coding Round',
    interviewer: 'Amit Verma',
    dateTime: 'May 22, 2024 at 02:00 PM',
    status: 'Scheduled',
    meetingUrl: 'https://meet.google.com/hrc-tech-eval',
  },
  {
    id: 'int-2',
    candidateName: 'Maya Chen',
    candidateRole: 'Frontend Developer',
    stageRound: 'System Design & React Native',
    interviewer: 'Sarah Connor',
    dateTime: 'May 23, 2024 at 11:00 AM',
    status: 'Scheduled',
    meetingUrl: 'https://meet.google.com/hrc-sys-arch',
  },
  {
    id: 'int-3',
    candidateName: 'Sophia Reynolds',
    candidateRole: 'UI/UX Product Designer',
    stageRound: 'Portfolio Design Review',
    interviewer: 'Rachel Green',
    dateTime: 'May 24, 2024 at 03:30 PM',
    status: 'Completed',
    meetingUrl: 'https://meet.google.com/hrc-ux-review',
  },
  {
    id: 'int-4',
    candidateName: 'Elena Rostova',
    candidateRole: 'Product Manager',
    stageRound: 'Executive Leadership Sync',
    interviewer: 'David Miller',
    dateTime: 'May 25, 2024 at 04:00 PM',
    status: 'Scheduled',
    meetingUrl: 'https://meet.google.com/hrc-exec-sync',
  },
];

export const InterviewsScreen: React.FC<InterviewsScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  const [interviews, setInterviews] = useState<ScheduledInterview[]>(INITIAL_INTERVIEWS);
  const [searchQuery, setSearchQuery] = useState('');

  // Video Call Modal State
  const [activeCallInterview, setActiveCallInterview] = useState<ScheduledInterview | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // Schedule Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [candName, setCandName] = useState('');
  const [candRole, setCandRole] = useState('Frontend Developer');
  const [roundTitle, setRoundTitle] = useState('Technical Coding Round');
  const [interviewerName, setInterviewerName] = useState('Amit Verma');
  const [meetDate, setMeetDate] = useState('May 28, 2024 at 02:00 PM');

  const filteredInterviews = interviews.filter(
    (item) =>
      item.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.stageRound.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interviewer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = () => {
    Alert.alert(
      'Export Calendar',
      `Exporting ${interviews.length} scheduled interviews to iCal & CSV.`,
      [{ text: 'OK' }]
    );
  };

  const handleCreateInterview = () => {
    if (!candName.trim()) {
      Alert.alert('Required', 'Please specify candidate name.');
      return;
    }

    const newInterview: ScheduledInterview = {
      id: `int-${Date.now()}`,
      candidateName: candName.trim(),
      candidateRole: candRole,
      stageRound: roundTitle,
      interviewer: interviewerName,
      dateTime: meetDate,
      status: 'Scheduled',
      meetingUrl: 'https://meet.google.com/hrc-new-round',
    };

    setInterviews([newInterview, ...interviews]);
    setScheduleModalOpen(false);
    setCandName('');
    Alert.alert('Interview Scheduled', `Calendar invite sent to ${newInterview.candidateName} and panelist ${newInterview.interviewer}.`);
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
            Scheduled Interviews Calendar
          </Text>
          <Text style={[styles.headerSubtitle, isDarkMode && styles.textMutedDark]}>
            Manage video conferencing rounds, interview panelists, and candidate evaluations.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.scheduleBtn}
          activeOpacity={0.8}
          onPress={() => setScheduleModalOpen(true)}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.scheduleBtnText}>Schedule Interview</Text>
        </TouchableOpacity>
      </View>

      {/* SEARCH & EXPORT BAR */}
      <View style={[styles.filterBarCard, isDarkMode && styles.cardDark]}>
        <View style={[styles.searchBox, isDarkMode && styles.searchBoxDark]}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.textWhite]}
            placeholder="Search interviews..."
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

      {/* TABLE */}
      <View style={[styles.tableContainer, isDarkMode && styles.cardDark]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: 840 }}>
            {/* Header Row */}
            <View style={[styles.tableHeaderRow, isDarkMode && styles.tableHeaderRowDark]}>
              <Text style={[styles.thCol, { width: 180 }, isDarkMode && styles.textMutedDark]}>
                CANDIDATE
              </Text>
              <Text style={[styles.thCol, { width: 220 }, isDarkMode && styles.textMutedDark]}>
                STAGE / ROUND
              </Text>
              <Text style={[styles.thCol, { width: 150 }, isDarkMode && styles.textMutedDark]}>
                INTERVIEWER
              </Text>
              <Text style={[styles.thCol, { width: 200 }, isDarkMode && styles.textMutedDark]}>
                DATE & TIME
              </Text>
              <Text style={[styles.thCol, { width: 110 }, isDarkMode && styles.textMutedDark]}>
                STATUS
              </Text>
              <Text style={[styles.thCol, { width: 130, textAlign: 'center' }, isDarkMode && styles.textMutedDark]}>
                MEETING LINK
              </Text>
            </View>

            {/* Data Rows */}
            {filteredInterviews.length === 0 ? (
              <View style={styles.emptyWrap}>
                <Text style={[styles.emptyText, isDarkMode && styles.textMutedDark]}>
                  No interviews scheduled matching "{searchQuery}".
                </Text>
              </View>
            ) : (
              filteredInterviews.map((item, idx) => {
                const isScheduled = item.status === 'Scheduled';
                const isCompleted = item.status === 'Completed';

                return (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      idx % 2 === 1 && (isDarkMode ? styles.rowEvenDark : styles.rowEvenLight),
                      isDarkMode && styles.tableRowDark,
                    ]}
                  >
                    {/* Candidate */}
                    <View style={{ width: 180, paddingRight: 8 }}>
                      <Text style={[styles.candName, isDarkMode && styles.textWhite]}>
                        {item.candidateName}
                      </Text>
                      <Text style={[styles.candRole, isDarkMode && styles.textMutedDark]}>
                        {item.candidateRole}
                      </Text>
                    </View>

                    {/* Stage / Round */}
                    <View style={{ width: 220, paddingRight: 8 }}>
                      <Text style={styles.stageRoundText}>
                        {item.stageRound}
                      </Text>
                    </View>

                    {/* Interviewer */}
                    <View style={{ width: 150, paddingRight: 8 }}>
                      <Text style={[styles.tdText, isDarkMode && styles.textWhite]}>
                        {item.interviewer}
                      </Text>
                    </View>

                    {/* Date & Time */}
                    <View style={{ width: 200, paddingRight: 8 }}>
                      <Text style={[styles.dateTimeText, isDarkMode && styles.textMutedDark]}>
                        {item.dateTime}
                      </Text>
                    </View>

                    {/* Status */}
                    <View style={{ width: 110 }}>
                      <View
                        style={[
                          styles.statusBadge,
                          isScheduled && styles.statusBadgeScheduled,
                          isCompleted && styles.statusBadgeCompleted,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            isScheduled && { color: '#D97706' },
                            isCompleted && { color: '#16A34A' },
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    {/* Meeting Link Button */}
                    <View style={{ width: 130, alignItems: 'center' }}>
                      <TouchableOpacity
                        style={[
                          styles.joinMeetBtn,
                          isCompleted && styles.joinMeetBtnCompleted,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => {
                          if (isCompleted) {
                            Alert.alert(
                              'Interview Notes',
                              `Interview with ${item.candidateName} completed. Rating: 4.5/5. Panelist feedback: Strong technical foundation and communication.`
                            );
                          } else {
                            setActiveCallInterview(item);
                          }
                        }}
                      >
                        <Video
                          size={14}
                          color={isCompleted ? '#64748B' : '#2563EB'}
                        />
                        <Text
                          style={[
                            styles.joinMeetBtnText,
                            isCompleted && { color: '#64748B' },
                          ]}
                        >
                          {isCompleted ? 'Review' : 'Join Meet'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        {/* Table Footer with Pagination */}
        <View style={[styles.tableFooter, isDarkMode && styles.tableFooterDark]}>
          <Text style={[styles.footerCountText, isDarkMode && styles.textMutedDark]}>
            Showing <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>1</Text> to{' '}
            <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{filteredInterviews.length}</Text> of{' '}
            <Text style={{ fontWeight: '700', color: isDarkMode ? '#F8FAFC' : '#0F172A' }}>{interviews.length}</Text> entries
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

      {/* MODAL: LIVE VIDEO CALL SIMULATION */}
      <Modal
        visible={!!activeCallInterview}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveCallInterview(null)}
      >
        <View style={styles.callModalBackdrop}>
          <View style={styles.callContainer}>
            {/* Call Header */}
            <View style={styles.callTopBar}>
              <View>
                <Text style={styles.callRoomTitle}>
                  HRMS Interview Room • {activeCallInterview?.stageRound}
                </Text>
                <Text style={styles.callRoomSubtitle}>
                  Candidate: {activeCallInterview?.candidateName} | Panelist: {activeCallInterview?.interviewer}
                </Text>
              </View>

              <View style={styles.callDurationBadge}>
                <View style={styles.callLiveDot} />
                <Text style={styles.callDurationText}>08:42</Text>
              </View>
            </View>

            {/* Video Stage Tiles */}
            <View style={styles.videoStage}>
              {/* Remote Candidate Stream */}
              <View style={styles.videoStreamMain}>
                <View style={styles.streamAvatarBox}>
                  <Text style={styles.streamInitials}>
                    {activeCallInterview?.candidateName.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.streamNameText}>
                  {activeCallInterview?.candidateName} ({activeCallInterview?.candidateRole})
                </Text>
                <View style={styles.speakingIndicator}>
                  <Mic size={12} color="#16A34A" />
                  <Text style={styles.speakingText}>Speaking...</Text>
                </View>
              </View>

              {/* Self Preview Stream (Small Picture-in-picture) */}
              <View style={styles.videoStreamSelf}>
                <Text style={styles.selfStreamText}>You (Amit Verma)</Text>
              </View>
            </View>

            {/* Controls Bar */}
            <View style={styles.callControlsRow}>
              <TouchableOpacity
                style={[styles.callControlBtn, isMuted && styles.callControlBtnMuted]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff size={18} color="#EF4444" /> : <Mic size={18} color="#FFFFFF" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.callControlBtn, isVideoOff && styles.callControlBtnMuted]}
                onPress={() => setIsVideoOff(!isVideoOff)}
              >
                {isVideoOff ? <VideoOff size={18} color="#EF4444" /> : <Video size={18} color="#FFFFFF" />}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callControlBtn}
                onPress={() => Alert.alert('Share Screen', 'Screen sharing initiated in WebRTC stream.')}
              >
                <Share2 size={18} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.callHangupBtn}
                onPress={() => setActiveCallInterview(null)}
              >
                <PhoneOff size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: SCHEDULE INTERVIEW */}
      <Modal
        visible={scheduleModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setScheduleModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, isDarkMode && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                  Schedule Candidate Interview
                </Text>
                <Text style={[styles.modalSubtitle, isDarkMode && styles.textMutedDark]}>
                  Set up video evaluation round and notify panelists.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setScheduleModalOpen(false)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Candidate Name *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Liam Johnson"
                  placeholderTextColor="#94A3B8"
                  value={candName}
                  onChangeText={setCandName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Position / Role
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={candRole}
                  onChangeText={setCandRole}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Evaluation Round *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={roundTitle}
                  onChangeText={setRoundTitle}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Interviewer Panelist
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={interviewerName}
                  onChangeText={setInterviewerName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Date & Time
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={meetDate}
                  onChangeText={setMeetDate}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setScheduleModalOpen(false)}
              >
                <Text style={[styles.cancelBtnText, isDarkMode && styles.textWhite]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.8}
                onPress={handleCreateInterview}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Send Invite</Text>
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
  scheduleBtn: {
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
  scheduleBtnText: {
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
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
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
  candName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  candRole: {
    fontSize: 11,
    color: '#64748B',
  },
  stageRoundText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  tdText: {
    fontSize: 13,
    color: '#334155',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#475569',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusBadgeScheduled: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeCompleted: {
    backgroundColor: '#DCFCE7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  joinMeetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  joinMeetBtnCompleted: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  joinMeetBtnText: {
    fontSize: 12,
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

  // LIVE CALL MODAL
  callModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  callContainer: {
    width: '100%',
    maxWidth: 680,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 10,
  },
  callTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  callRoomTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  callRoomSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  callDurationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#334155',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  callLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  callDurationText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  videoStage: {
    height: 280,
    backgroundColor: '#090D16',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoStreamMain: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamAvatarBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  streamInitials: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  streamNameText: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  speakingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22, 163, 74, 0.2)',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  speakingText: {
    color: '#16A34A',
    fontSize: 11,
    fontWeight: '600',
  },
  videoStreamSelf: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 120,
    height: 80,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 6,
  },
  selfStreamText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  callControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: '#1E293B',
  },
  callControlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callControlBtnMuted: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  callHangupBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
