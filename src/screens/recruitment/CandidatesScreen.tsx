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
  Image,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Users,
  Search,
  Plus,
  Star,
  ChevronDown,
  X,
  Check,
  Calendar,
  Mail,
  Phone,
  Briefcase,
  DollarSign,
  Award,
  ArrowRight,
} from 'lucide-react-native';

interface CandidatesScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export type AtsStage =
  | 'APPLIED'
  | 'SCREENING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'HIRED';

export interface CandidateItem {
  id: string;
  name: string;
  role: string;
  rating: number;
  experience: string;
  note: string;
  expectedSalary: number;
  stage: AtsStage;
  avatarUrl?: string;
  email: string;
  phone: string;
  skills: string[];
}

const STAGES: { key: AtsStage; label: string; color: string }[] = [
  { key: 'APPLIED', label: 'APPLIED', color: '#2563EB' },
  { key: 'SCREENING', label: 'SCREENING', color: '#2563EB' },
  { key: 'SHORTLISTED', label: 'SHORTLISTED', color: '#2563EB' },
  { key: 'INTERVIEW', label: 'INTERVIEW', color: '#2563EB' },
  { key: 'OFFERED', label: 'OFFERED', color: '#16A34A' },
  { key: 'HIRED', label: 'HIRED', color: '#16A34A' },
];

const INITIAL_CANDIDATES: CandidateItem[] = [
  {
    id: 'cand-1',
    name: 'Sophia Reynolds',
    role: 'UI/UX Product Designer',
    rating: 4.2,
    experience: '4 Years',
    note: 'Figma Community Creator',
    expectedSalary: 125000,
    stage: 'SHORTLISTED',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    email: 'sophia.reynolds@designhub.io',
    phone: '+1 (555) 234-5678',
    skills: ['Figma', 'Design Systems', 'UX Research', 'Mobile Prototyping'],
  },
  {
    id: 'cand-2',
    name: 'Maya Chen',
    role: 'Frontend Developer',
    rating: 4.5,
    experience: '5 Years',
    note: 'Shopify',
    expectedSalary: 145000,
    stage: 'INTERVIEW',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    email: 'maya.chen@techdev.com',
    phone: '+1 (555) 345-6789',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind', 'GraphQL'],
  },
  {
    id: 'cand-3',
    name: 'Aarav Patel',
    role: 'Frontend Developer',
    rating: 4.8,
    experience: '6 Years',
    note: 'React Native & Next.js',
    expectedSalary: 140000,
    stage: 'OFFERED',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    email: 'aarav.patel@frontend.dev',
    phone: '+1 (555) 456-7890',
    skills: ['React Native', 'TypeScript', 'Redux Toolkit', 'iOS/Android'],
  },
  {
    id: 'cand-4',
    name: 'Marcus Vance',
    role: 'HR Executive',
    rating: 4.7,
    experience: '3 Years',
    note: 'Talent Ops Specialist',
    expectedSalary: 85000,
    stage: 'HIRED',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    email: 'marcus.vance@hroperations.net',
    phone: '+1 (555) 567-8901',
    skills: ['Talent Sourcing', 'ATS Optimization', 'HR Compliance', 'Onboarding'],
  },
];

export const CandidatesScreen: React.FC<CandidatesScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  const [candidates, setCandidates] = useState<CandidateItem[]>(INITIAL_CANDIDATES);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected candidate for detail view / move stage modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [moveModalCandidate, setMoveModalCandidate] = useState<CandidateItem | null>(null);

  // Add Candidate modal state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('Frontend Developer');
  const [newExp, setNewExp] = useState('3 Years');
  const [newNote, setNewNote] = useState('Open Source Contributor');
  const [newSalary, setNewSalary] = useState('130000');
  const [newStage, setNewStage] = useState<AtsStage>('APPLIED');
  const [newRating, setNewRating] = useState('4.5');

  const filteredCandidates = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.note.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCandidatesByStage = (stage: AtsStage) => {
    return filteredCandidates.filter((c) => c.stage === stage);
  };

  const totalActive = candidates.length;

  const handleMoveStage = (candidateId: string, targetStage: AtsStage) => {
    setCandidates((prev) =>
      prev.map((item) =>
        item.id === candidateId ? { ...item, stage: targetStage } : item
      )
    );
    setMoveModalCandidate(null);
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate({ ...selectedCandidate, stage: targetStage });
    }
  };

  const handleAddCandidate = () => {
    if (!newName.trim()) {
      Alert.alert('Required', 'Please enter candidate name.');
      return;
    }

    const newCandidate: CandidateItem = {
      id: `cand-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      rating: parseFloat(newRating) || 4.0,
      experience: newExp,
      note: newNote.trim() || 'New Applicant',
      expectedSalary: parseInt(newSalary, 10) || 120000,
      stage: newStage,
      email: `${newName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+1 (555) 019-2834',
      skills: ['Full Stack', 'Agile', 'Team Player'],
    };

    setCandidates([...candidates, newCandidate]);
    setAddModalOpen(false);
    setNewName('');
    Alert.alert('Success', `${newCandidate.name} added to ${newCandidate.stage} pipeline.`);
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
            Talent Pipeline & ATS Kanban Board
          </Text>
          <Text style={[styles.headerSubtitle, isDarkMode && styles.textMutedDark]}>
            Interactive recruitment funnel across all candidate evaluation stages.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>
              {totalActive} Total Applicants Active
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => setAddModalOpen(true)}
          >
            <Plus size={15} color="#FFFFFF" />
            <Text style={styles.addBtnText}>Add Candidate</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH BAR */}
      <View style={[styles.searchBarWrap, isDarkMode && styles.cardDark]}>
        <View style={[styles.searchBox, isDarkMode && styles.searchBoxDark]}>
          <Search size={16} color="#94A3B8" />
          <TextInput
            style={[styles.searchInput, isDarkMode && styles.textWhite]}
            placeholder="Search candidates by name, role or background..."
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
      </View>

      {/* KANBAN BOARD (HORIZONTAL SCROLL) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.kanbanScrollContainer}
      >
        {STAGES.map((stageItem) => {
          const stageCandidates = getCandidatesByStage(stageItem.key);

          return (
            <View
              key={stageItem.key}
              style={[styles.kanbanColumn, isDarkMode && styles.kanbanColumnDark]}
            >
              {/* Column Header */}
              <View style={styles.colHeader}>
                <View style={styles.colHeaderLeft}>
                  <View style={[styles.colDot, { backgroundColor: stageItem.color }]} />
                  <Text style={[styles.colTitle, isDarkMode && styles.textWhite]}>
                    {stageItem.label}
                  </Text>
                </View>
                <View style={[styles.countBadge, isDarkMode && styles.countBadgeDark]}>
                  <Text style={[styles.countBadgeText, isDarkMode && styles.textMutedDark]}>
                    {stageCandidates.length}
                  </Text>
                </View>
              </View>

              {/* Column Body / Candidate Cards */}
              <View style={styles.colBody}>
                {stageCandidates.length === 0 ? (
                  <View style={[styles.emptyCardBox, isDarkMode && styles.emptyCardBoxDark]}>
                    <Text style={[styles.emptyCardText, isDarkMode && styles.textMutedDark]}>
                      No candidates in {stageItem.label.charAt(0) + stageItem.label.slice(1).toLowerCase()}
                    </Text>
                  </View>
                ) : (
                  stageCandidates.map((cand) => (
                    <TouchableOpacity
                      key={cand.id}
                      activeOpacity={0.85}
                      style={[styles.candidateCard, isDarkMode && styles.candidateCardDark]}
                      onPress={() => setSelectedCandidate(cand)}
                    >
                      {/* Top Info: Avatar, Name, Role & Star Rating */}
                      <View style={styles.candHeader}>
                        <View style={styles.candAvatarWrap}>
                          {cand.avatarUrl ? (
                            <Image
                              source={{ uri: cand.avatarUrl }}
                              style={styles.candAvatarImg}
                            />
                          ) : (
                            <View style={styles.candAvatarFallback}>
                              <Text style={styles.candAvatarInitials}>
                                {cand.name.substring(0, 2).toUpperCase()}
                              </Text>
                            </View>
                          )}
                        </View>

                        <View style={styles.candInfo}>
                          <Text style={[styles.candName, isDarkMode && styles.textWhite]}>
                            {cand.name}
                          </Text>
                          <Text style={styles.candRole}>{cand.role}</Text>
                        </View>

                        <View style={styles.ratingBadge}>
                          <Star size={11} color="#F59E0B" fill="#F59E0B" />
                          <Text style={styles.ratingText}>
                            {cand.rating.toFixed(1)}
                          </Text>
                        </View>
                      </View>

                      {/* Subtitle / Background */}
                      <Text style={[styles.candMeta, isDarkMode && styles.textMutedDark]}>
                        Exp: {cand.experience} • {cand.note}
                      </Text>

                      {/* Expected Salary */}
                      <Text style={[styles.candSalary, isDarkMode && styles.textWhite]}>
                        Expected: ${cand.expectedSalary.toLocaleString()}
                      </Text>

                      {/* Move Stage Selector Row */}
                      <View style={styles.moveRow}>
                        <Text style={[styles.moveLabel, isDarkMode && styles.textMutedDark]}>
                          Move to:
                        </Text>
                        <TouchableOpacity
                          style={[styles.moveSelectBtn, isDarkMode && styles.moveSelectBtnDark]}
                          activeOpacity={0.7}
                          onPress={() => setMoveModalCandidate(cand)}
                        >
                          <Text
                            style={[
                              styles.moveSelectText,
                              isDarkMode && styles.textWhite,
                            ]}
                          >
                            {cand.stage.charAt(0) + cand.stage.slice(1).toLowerCase()}
                          </Text>
                          <ChevronDown size={14} color="#64748B" />
                        </TouchableOpacity>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* MODAL: CHANGE STAGE */}
      <Modal
        visible={!!moveModalCandidate}
        animationType="fade"
        transparent
        onRequestClose={() => setMoveModalCandidate(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.stageModalCard, isDarkMode && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                  Move Stage
                </Text>
                <Text style={[styles.modalSubtitle, isDarkMode && styles.textMutedDark]}>
                  Advance {moveModalCandidate?.name} across evaluation pipeline.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setMoveModalCandidate(null)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={styles.stageList}>
              {STAGES.map((stg) => {
                const isCurrent = moveModalCandidate?.stage === stg.key;
                return (
                  <TouchableOpacity
                    key={stg.key}
                    style={[
                      styles.stageItemBtn,
                      isCurrent && styles.stageItemBtnActive,
                      isDarkMode && !isCurrent && styles.stageItemBtnDark,
                    ]}
                    onPress={() => {
                      if (moveModalCandidate) {
                        handleMoveStage(moveModalCandidate.id, stg.key);
                      }
                    }}
                  >
                    <View style={styles.stageItemLeft}>
                      <View style={[styles.colDot, { backgroundColor: stg.color }]} />
                      <Text
                        style={[
                          styles.stageItemText,
                          isCurrent && styles.stageItemTextActive,
                          isDarkMode && !isCurrent && styles.textWhite,
                        ]}
                      >
                        {stg.label}
                      </Text>
                    </View>
                    {isCurrent && <Check size={16} color="#2563EB" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL: CANDIDATE DETAIL PROFILE */}
      <Modal
        visible={!!selectedCandidate}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedCandidate(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.profileModalCard, isDarkMode && styles.modalCardDark]}>
            {selectedCandidate && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    {selectedCandidate.avatarUrl ? (
                      <Image
                        source={{ uri: selectedCandidate.avatarUrl }}
                        style={styles.profileModalAvatar}
                      />
                    ) : (
                      <View style={styles.profileModalAvatarFallback}>
                        <Text style={styles.candAvatarInitials}>
                          {selectedCandidate.name.substring(0, 2).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                        {selectedCandidate.name}
                      </Text>
                      <Text style={styles.candRole}>
                        {selectedCandidate.role}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.modalCloseBtn}
                    onPress={() => setSelectedCandidate(null)}
                  >
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                  {/* Current Stage Banner */}
                  <View style={[styles.stageBanner, isDarkMode && styles.searchBoxDark]}>
                    <Text style={[styles.stageBannerLabel, isDarkMode && styles.textMutedDark]}>
                      Current Pipeline Stage:
                    </Text>
                    <View style={styles.stageBannerPill}>
                      <Text style={styles.stageBannerPillText}>
                        {selectedCandidate.stage}
                      </Text>
                    </View>
                  </View>

                  {/* Contact Info */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionHeading, isDarkMode && styles.textWhite]}>
                      Candidate Details
                    </Text>

                    <View style={styles.infoRow}>
                      <Mail size={15} color="#64748B" />
                      <Text style={[styles.infoText, isDarkMode && styles.textWhite]}>
                        {selectedCandidate.email}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Phone size={15} color="#64748B" />
                      <Text style={[styles.infoText, isDarkMode && styles.textWhite]}>
                        {selectedCandidate.phone}
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Briefcase size={15} color="#64748B" />
                      <Text style={[styles.infoText, isDarkMode && styles.textWhite]}>
                        Exp: {selectedCandidate.experience} ({selectedCandidate.note})
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <DollarSign size={15} color="#16A34A" />
                      <Text style={[styles.infoText, { fontWeight: '700', color: '#16A34A' }]}>
                        Expected: ${selectedCandidate.expectedSalary.toLocaleString()} / year
                      </Text>
                    </View>

                    <View style={styles.infoRow}>
                      <Star size={15} color="#F59E0B" fill="#F59E0B" />
                      <Text style={[styles.infoText, isDarkMode && styles.textWhite]}>
                        Overall Interview Score: {selectedCandidate.rating.toFixed(1)} / 5.0
                      </Text>
                    </View>
                  </View>

                  {/* Skills tags */}
                  <View style={styles.detailSection}>
                    <Text style={[styles.sectionHeading, isDarkMode && styles.textWhite]}>
                      Key Competencies & Skills
                    </Text>
                    <View style={styles.skillsWrap}>
                      {selectedCandidate.skills.map((sk, i) => (
                        <View key={i} style={styles.skillPill}>
                          <Text style={styles.skillPillText}>{sk}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Footer Actions */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={[styles.moveQuickBtn, isDarkMode && styles.searchBoxDark]}
                    onPress={() => {
                      const cand = selectedCandidate;
                      setSelectedCandidate(null);
                      setMoveModalCandidate(cand);
                    }}
                  >
                    <Text style={[styles.moveQuickBtnText, isDarkMode && styles.textWhite]}>
                      Advance Stage
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.scheduleInterviewBtn}
                    onPress={() => {
                      setSelectedCandidate(null);
                      if (onNavigate) {
                        onNavigate('Interviews');
                      }
                    }}
                  >
                    <Calendar size={15} color="#FFFFFF" />
                    <Text style={styles.scheduleInterviewBtnText}>
                      Schedule Interview
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* MODAL: ADD CANDIDATE */}
      <Modal
        visible={addModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.stageModalCard, isDarkMode && styles.modalCardDark]}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, isDarkMode && styles.textWhite]}>
                  Add New Candidate
                </Text>
                <Text style={[styles.modalSubtitle, isDarkMode && styles.textMutedDark]}>
                  Directly inject applicant into talent evaluation pipeline.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setAddModalOpen(false)}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Candidate Full Name *
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Liam Johnson"
                  placeholderTextColor="#94A3B8"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Target Role
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  value={newRole}
                  onChangeText={setNewRole}
                />
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Experience
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    value={newExp}
                    onChangeText={setNewExp}
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                    Expected Salary ($)
                  </Text>
                  <TextInput
                    style={[styles.formInput, isDarkMode && styles.formInputDark]}
                    keyboardType="numeric"
                    value={newSalary}
                    onChangeText={setNewSalary}
                  />
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.formLabel, isDarkMode && styles.textWhite]}>
                  Headline / Note
                </Text>
                <TextInput
                  style={[styles.formInput, isDarkMode && styles.formInputDark]}
                  placeholder="e.g. Full Stack ex-Startup"
                  placeholderTextColor="#94A3B8"
                  value={newNote}
                  onChangeText={setNewNote}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setAddModalOpen(false)}
              >
                <Text style={[styles.cancelBtnText, isDarkMode && styles.textWhite]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                activeOpacity={0.8}
                onPress={handleAddCandidate}
              >
                <Check size={16} color="#FFFFFF" />
                <Text style={styles.saveBtnText}>Add to ATS</Text>
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
    marginBottom: 16,
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  totalBadge: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  totalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // SEARCH BAR
  searchBarWrap: {
    marginBottom: 16,
  },
  cardDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  searchBox: {
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

  // KANBAN SCROLLER
  kanbanScrollContainer: {
    flexDirection: 'row',
    gap: 14,
    paddingBottom: 20,
  },
  kanbanColumn: {
    width: 280,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
  },
  kanbanColumnDark: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
  },
  colHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  colHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  colTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
  },
  countBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  countBadgeDark: {
    backgroundColor: '#334155',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  colBody: {
    gap: 10,
  },

  // EMPTY CARD BOX
  emptyCardBox: {
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  emptyCardBoxDark: {
    backgroundColor: '#182234',
    borderColor: '#334155',
  },
  emptyCardText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },

  // CANDIDATE CARD
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  candidateCardDark: {
    backgroundColor: '#182234',
    borderColor: '#334155',
  },
  candHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  candAvatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  candAvatarImg: {
    width: 36,
    height: 36,
  },
  candAvatarFallback: {
    width: 36,
    height: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  candAvatarInitials: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  candInfo: {
    flex: 1,
  },
  candName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  candRole: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D97706',
  },
  candMeta: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  candSalary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
  },
  moveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  moveLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  moveSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  moveSelectBtnDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  moveSelectText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },

  // MODALS
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  stageModalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 8,
  },
  profileModalCard: {
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
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 17,
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
    padding: 18,
  },
  stageList: {
    padding: 14,
    gap: 8,
  },
  stageItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stageItemBtnDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
  },
  stageItemBtnActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  stageItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  stageItemTextActive: {
    color: '#2563EB',
  },

  // PROFILE MODAL
  profileModalAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  profileModalAvatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  stageBannerLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  stageBannerPill: {
    backgroundColor: '#2563EB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  stageBannerPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#334155',
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    backgroundColor: '#EFF6FF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  skillPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  moveQuickBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  moveQuickBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  scheduleInterviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  scheduleInterviewBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },

  // FORM
  formGroup: {
    marginBottom: 14,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
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
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  formInputDark: {
    backgroundColor: '#334155',
    borderColor: '#475569',
    color: '#F8FAFC',
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
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
    paddingHorizontal: 16,
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
