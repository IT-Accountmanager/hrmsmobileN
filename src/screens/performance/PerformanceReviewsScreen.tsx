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
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, colors, radii, typography } from '../../theme';
import {
  Star,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Search,
  ChevronDown,
  ArrowRight,
  Plus,
  X,
  TrendingUp,
  FileCheck,
} from 'lucide-react-native';

interface ReviewItem {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  reviewer: string;
  rating: number | null;
  status: 'Completed' | 'In Review' | 'Self Appraisal Due';
  excerpt: string;
  competencies?: { label: string; score: number }[];
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    employeeName: 'Sarah Wilson',
    role: 'Senior Product Designer',
    department: 'Marketing',
    reviewer: 'David Miller',
    rating: 4.8,
    status: 'Completed',
    excerpt:
      'Exceptional UX execution on SaaS redesign, strong cross-functional leadership, and user empathy.',
    competencies: [
      { label: 'Technical Execution', score: 96 },
      { label: 'Cross-functional Collaboration', score: 98 },
      { label: 'Initiative & Ownership', score: 94 },
    ],
  },
  {
    id: 'rev-2',
    employeeName: 'Elena Rostova',
    role: 'Design Director',
    department: 'Product',
    reviewer: 'Alex Johnson',
    rating: 4.6,
    status: 'Completed',
    excerpt:
      'Solid product strategy, excellent mentorship of junior design team, proactive stakeholder management.',
    competencies: [
      { label: 'Strategic Vision', score: 94 },
      { label: 'Team Leadership', score: 92 },
      { label: 'Execution Velocity', score: 90 },
    ],
  },
  {
    id: 'rev-3',
    employeeName: 'Marcus Vance',
    role: 'Operations Specialist',
    department: 'Operations',
    reviewer: 'Rachel Green',
    rating: 4.2,
    status: 'In Review',
    excerpt:
      'Streamlined vendor onboarding workflows, positive attitude, driving SLA improvements across departments.',
    competencies: [
      { label: 'Process Optimization', score: 88 },
      { label: 'Communication', score: 85 },
      { label: 'Accuracy', score: 90 },
    ],
  },
  {
    id: 'rev-4',
    employeeName: 'James Wilson',
    role: 'VP of Sales',
    department: 'Sales',
    reviewer: 'Alexander Wright',
    rating: 4.9,
    status: 'Completed',
    excerpt:
      'Exceeded enterprise revenue target by 24%, closed major high-ACV multi-year corporate accounts.',
    competencies: [
      { label: 'Quota Attainment', score: 99 },
      { label: 'Negotiation', score: 98 },
      { label: 'Team Morale', score: 95 },
    ],
  },
  {
    id: 'rev-5',
    employeeName: 'Chloe Davis',
    role: 'Account Executive',
    department: 'Sales',
    reviewer: 'James Wilson',
    rating: null,
    status: 'Self Appraisal Due',
    excerpt:
      'Self-assessment form awaiting submission before upcoming formal quarterly manager review meeting.',
    competencies: [
      { label: 'Self Assessment', score: 0 },
      { label: 'Pipeline Building', score: 84 },
    ],
  },
];

const REVIEW_CYCLES = [
  'H1 2024 (Active)',
  'H2 2023 (Closed)',
  'H1 2023 (Closed)',
  'Annual 2022 (Archived)',
];

export const PerformanceReviewsScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCycle, setSelectedCycle] = useState('H1 2024 (Active)');
  const [cycleModalOpen, setCycleModalOpen] = useState(false);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);

  // Launch cycle inputs
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleEndDate, setNewCycleEndDate] = useState('Dec 31, 2024');

  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r.employeeName.toLowerCase().includes(q) ||
      r.department.toLowerCase().includes(q) ||
      r.reviewer.toLowerCase().includes(q) ||
      r.role.toLowerCase().includes(q)
    );
  });

  const handleLaunchCycle = () => {
    if (!newCycleName.trim()) {
      Alert.alert('Validation Error', 'Please enter a review cycle title.');
      return;
    }
    Alert.alert('Review Cycle Launched', `Successfully announced ${newCycleName.trim()} across all teams.`);
    setLaunchModalOpen(false);
    setNewCycleName('');
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#0B1120' : '#F8FAFC' }]}
    >
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleCol}>
          <View style={styles.titleWithBadge}>
            <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              360° Performance Reviews
            </Text>
            <View style={styles.cycleBadge}>
              <Text style={styles.cycleBadgeText}>H1 2024 Active Cycle</Text>
            </View>
          </View>
          <Text style={styles.screenSubtitle}>
            Conduct bi-annual appraisals, 360 peer feedback, competency evaluations, and manager ratings.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setLaunchModalOpen(true)}
          style={styles.launchBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.launchBtnText}>Launch Review Cycle</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Top Metric Stat Cards (4 Cards) */}
      <View style={styles.statsGrid}>
        {/* Avg Rating */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={styles.statLabel}>AVG ORGANIZATION RATING</Text>
          <View style={styles.ratingRow}>
            <Text style={[styles.statValueBig, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              4.62
            </Text>
            <Star size={18} color="#F59E0B" fill="#F59E0B" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.statSubGreen}>+0.15 vs H2 2023</Text>
        </View>

        {/* Reviews Completed */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={styles.statLabel}>REVIEWS COMPLETED</Text>
          <Text style={[styles.statValueBig, { color: '#2563EB' }]}>78.5%</Text>
          <Text style={styles.statSub}>194 of 248 Submitted</Text>
        </View>

        {/* Top Performers */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={styles.statLabel}>TOP PERFORMERS</Text>
          <Text style={[styles.statValueBig, { color: '#10B981' }]}>42 Employees</Text>
          <Text style={styles.statSub}>Rated 4.8 or above</Text>
        </View>

        {/* Pending Submissions */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <Text style={styles.statLabel}>PENDING SUBMISSIONS</Text>
          <Text style={[styles.statValueBig, { color: '#F59E0B' }]}>54</Text>
          <Text style={styles.statSub}>Cycle closes May 31</Text>
        </View>
      </View>

      {/* 3. Search & Cycle Selector Row */}
      <View style={styles.filterRow}>
        {/* Search Input */}
        <View
          style={[
            styles.searchBox,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
          ]}
        >
          <Search size={16} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search employee, department or reviewer..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Review Cycle Dropdown Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCycleModalOpen(true)}
          style={[
            styles.cycleSelectBtn,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#E2E8F0' },
          ]}
        >
          <Text style={[styles.cycleSelectText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Review Cycle: <Text style={{ fontWeight: '700' }}>{selectedCycle}</Text>
          </Text>
          <ChevronDown size={15} color="#94A3B8" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* 4. Appraisals List */}
      <View style={styles.reviewsList}>
        {filteredReviews.map((rev) => {
          const isPending = rev.status === 'Self Appraisal Due';
          const isCompleted = rev.status === 'Completed';

          return (
            <View
              key={rev.id}
              style={[
                styles.reviewCard,
                { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
              ]}
            >
              {/* Card Top Row: Employee & Status Badge */}
              <View style={styles.cardTopRow}>
                <View style={styles.employeeInfo}>
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarInitial}>{rev.employeeName[0]}</Text>
                  </View>
                  <View>
                    <Text style={[styles.employeeName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {rev.employeeName}
                    </Text>
                    <Text style={styles.employeeRole}>
                      {rev.role} • {rev.department}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusBadge,
                    isCompleted && styles.statusBadgeCompleted,
                    rev.status === 'In Review' && styles.statusBadgeReview,
                    isPending && styles.statusBadgePending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      isCompleted && styles.statusBadgeTextCompleted,
                      rev.status === 'In Review' && styles.statusBadgeTextReview,
                      isPending && styles.statusBadgeTextPending,
                    ]}
                  >
                    {rev.status}
                  </Text>
                </View>
              </View>

              {/* Reviewer & Rating Row */}
              <View style={styles.metaRow}>
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>REVIEWER</Text>
                  <Text style={[styles.metaValue, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                    {rev.reviewer}
                  </Text>
                </View>

                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>SCORE / RATING</Text>
                  {rev.rating !== null ? (
                    <View style={styles.scoreRow}>
                      <Text style={[styles.scoreNumber, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                        {rev.rating}
                      </Text>
                      <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            color="#F59E0B"
                            fill={s <= Math.floor(rev.rating!) ? '#F59E0B' : 'transparent'}
                          />
                        ))}
                      </View>
                    </View>
                  ) : (
                    <Text style={styles.notRatedText}>Not rated yet</Text>
                  )}
                </View>
              </View>

              {/* Feedback Excerpt */}
              <View
                style={[
                  styles.excerptBox,
                  { backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC' },
                ]}
              >
                <Text style={styles.excerptLabel}>FEEDBACK EXCERPT</Text>
                <Text style={[styles.excerptText, { color: isDarkMode ? '#94A3B8' : '#64748B' }]}>
                  "{rev.excerpt}"
                </Text>
              </View>

              {/* Action Link: View Review */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setSelectedReview(rev)}
                style={styles.viewReviewBtn}
              >
                <Text style={styles.viewReviewText}>View Review</Text>
                <ArrowRight size={14} color="#2563EB" style={{ marginLeft: 4 }} />
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* 5. View Review Details Modal */}
      <Modal visible={!!selectedReview} transparent animationType="fade" onRequestClose={() => setSelectedReview(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {selectedReview && (
              <>
                <View style={styles.modalCardHeader}>
                  <View>
                    <Text style={[styles.modalEmpName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {selectedReview.employeeName}
                    </Text>
                    <Text style={styles.modalEmpSub}>
                      {selectedReview.role} • Evaluated by {selectedReview.reviewer}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setSelectedReview(null)} style={styles.modalCloseBtn}>
                    <X size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Score Banner */}
                <View style={styles.modalScoreBanner}>
                  <View>
                    <Text style={styles.modalScoreTitle}>Overall 360° Appraisal Score</Text>
                    <Text style={styles.modalScoreSub}>Status: {selectedReview.status}</Text>
                  </View>
                  <Text style={styles.modalScoreBig}>
                    {selectedReview.rating !== null ? `${selectedReview.rating} / 5.0` : 'Pending'}
                  </Text>
                </View>

                {/* Competencies */}
                <Text style={styles.compHeader}>Key Competency Breakdown</Text>
                <View style={styles.compList}>
                  {selectedReview.competencies?.map((comp, idx) => (
                    <View key={idx} style={styles.compItem}>
                      <View style={styles.compLabelRow}>
                        <Text style={[styles.compLabel, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                          {comp.label}
                        </Text>
                        <Text style={styles.compScore}>{comp.score}%</Text>
                      </View>
                      <View style={styles.compBarBg}>
                        <View style={[styles.compBarFill, { width: `${comp.score}%` }]} />
                      </View>
                    </View>
                  ))}
                </View>

                {/* Full Feedback Notes */}
                <Text style={styles.compHeader}>Manager Review Summary</Text>
                <Text style={[styles.fullFeedbackText, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
                  {selectedReview.excerpt}
                </Text>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => setSelectedReview(null)}
                  style={styles.closeReviewModalBtn}
                >
                  <Text style={styles.closeReviewModalText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* 6. Launch Review Cycle Modal */}
      <Modal visible={launchModalOpen} transparent animationType="slide" onRequestClose={() => setLaunchModalOpen(false)}>
        <View style={styles.modalOverlayBottom}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalCardHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  Launch New 360° Review Cycle
                </Text>
                <Text style={styles.modalSub}>
                  Initiate company-wide evaluations, self appraisals, and peer assessments.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setLaunchModalOpen(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Review Cycle Name *</Text>
            <TextInput
              value={newCycleName}
              onChangeText={setNewCycleName}
              placeholder="e.g. H2 2024 Performance Cycle"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Submission Deadline</Text>
            <TextInput
              value={newCycleEndDate}
              onChangeText={setNewCycleEndDate}
              placeholder="e.g. Nov 30, 2024"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleLaunchCycle}
              style={styles.modalLaunchSubmit}
            >
              <Text style={styles.modalLaunchSubmitText}>Announce & Launch Cycle</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 7. Select Review Cycle Modal */}
      <Modal visible={cycleModalOpen} transparent animationType="fade" onRequestClose={() => setCycleModalOpen(false)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setCycleModalOpen(false)}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.cycleModalBox,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <Text style={[styles.cycleModalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Select Review Cycle
            </Text>
            {REVIEW_CYCLES.map((c) => (
              <TouchableOpacity
                key={c}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedCycle(c);
                  setCycleModalOpen(false);
                }}
                style={[
                  styles.cycleModalItem,
                  selectedCycle === c && { backgroundColor: '#EFF6FF' },
                ]}
              >
                <Text
                  style={[
                    styles.cycleModalItemText,
                    selectedCycle === c && { color: '#2563EB', fontWeight: '800' },
                  ]}
                >
                  {c}
                </Text>
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
    padding: 16,
    paddingBottom: 40,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  titleCol: {
    flex: 1,
    minWidth: 240,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  cycleBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  cycleBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  screenSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  launchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.md,
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  launchBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    padding: 14,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValueBig: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  statSubGreen: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#10B981',
  },
  statSub: {
    fontSize: 10.5,
    color: '#64748B',
  },
  filterRow: {
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 0,
  },
  cycleSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    height: 38,
  },
  cycleSelectText: {
    fontSize: 12,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 5,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  employeeName: {
    fontSize: 14,
    fontWeight: '800',
  },
  employeeRole: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusBadgeCompleted: {
    backgroundColor: '#ECFDF5',
  },
  statusBadgeReview: {
    backgroundColor: '#EFF6FF',
  },
  statusBadgePending: {
    backgroundColor: '#FFFBEB',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  statusBadgeTextCompleted: {
    color: '#10B981',
  },
  statusBadgeTextReview: {
    color: '#2563EB',
  },
  statusBadgeTextPending: {
    color: '#D97706',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
    marginBottom: 10,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreNumber: {
    fontSize: 12,
    fontWeight: '800',
  },
  starRow: {
    flexDirection: 'row',
    gap: 1,
  },
  notRatedText: {
    fontSize: 11.5,
    color: '#D97706',
    fontWeight: '700',
  },
  excerptBox: {
    padding: 10,
    borderRadius: radii.md,
    marginBottom: 12,
  },
  excerptLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  excerptText: {
    fontSize: 11.5,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  viewReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewReviewText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalEmpName: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalEmpSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScoreBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: radii.lg,
    marginBottom: 16,
  },
  modalScoreTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  modalScoreSub: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
  },
  modalScoreBig: {
    fontSize: 20,
    fontWeight: '900',
    color: '#2563EB',
  },
  compHeader: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 4,
  },
  compList: {
    gap: 10,
    marginBottom: 14,
  },
  compItem: {
    gap: 4,
  },
  compLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  compLabel: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  compScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  compBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  compBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  fullFeedbackText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  closeReviewModalBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: radii.md,
    alignItems: 'center',
  },
  closeReviewModalText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  modalSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  inputLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 5,
    marginTop: 10,
  },
  formInput: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    height: 42,
    fontSize: 13,
  },
  modalLaunchSubmit: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalLaunchSubmitText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  cycleModalBox: {
    borderRadius: radii.xl,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cycleModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 12,
  },
  cycleModalItem: {
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: radii.md,
  },
  cycleModalItemText: {
    fontSize: 13,
    color: '#475569',
  },
});
