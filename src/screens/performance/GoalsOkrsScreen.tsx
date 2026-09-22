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
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trophy,
  Plus,
  Search,
  X,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from 'lucide-react-native';

interface OKRGoal {
  id: string;
  title: string;
  description: string;
  department: string;
  ownerName: string;
  ownerAvatar: string;
  dueDate: string;
  status: 'In Progress' | 'Completed' | 'At Risk';
  progress: number;
}

const INITIAL_GOALS: OKRGoal[] = [
  {
    id: 'g-1',
    title: 'Migrate Core Services to Microservices Architecture',
    description:
      'Decompose monolith APIs into scalable microservices to achieve sub-100ms P99 latency.',
    department: 'Engineering',
    ownerName: 'Rahul Sharma',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    dueDate: 'Jun 30, 2024',
    status: 'In Progress',
    progress: 75,
  },
  {
    id: 'g-2',
    title: 'Grow Organic SaaS Signups by 40%',
    description:
      'Execute new content strategy, SEO optimization, and interactive demo landing page.',
    department: 'Marketing',
    ownerName: 'Priya Singh',
    ownerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    dueDate: 'Jun 30, 2024',
    status: 'In Progress',
    progress: 60,
  },
  {
    id: 'g-3',
    title: 'Automate Month-End Payroll Reconciliation',
    description:
      'Integrate automated tax calculation engine and 1-click payslip generation.',
    department: 'Finance',
    ownerName: 'Amit Kumar',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    dueDate: 'Jun 15, 2024',
    status: 'In Progress',
    progress: 90,
  },
  {
    id: 'g-4',
    title: 'SOC-2 Type II Annual Security Certification',
    description:
      'Complete end-to-end vulnerability assessment and publish compliance trust portal.',
    department: 'DevOps & Security',
    ownerName: 'Alex Johnson',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    dueDate: 'Jul 20, 2024',
    status: 'Completed',
    progress: 100,
  },
];

const LEADERBOARD = [
  { rank: '#1', name: 'Rahul Sharma', role: 'Senior Software Engineer', score: 98, color: '#10B981' },
  { rank: '#2', name: 'Priya Singh', role: 'Marketing Director', score: 95, color: '#2563EB' },
  { rank: '#3', name: 'Sarah Connor', role: 'Frontend Lead', score: 94, color: '#6366F1' },
  { rank: '#4', name: 'Neha Gupta', role: 'HR Executive', score: 91, color: '#F59E0B' },
];

export const GoalsOkrsScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [goals, setGoals] = useState<OKRGoal[]>(INITIAL_GOALS);
  const [filterStatus, setFilterStatus] = useState<'All' | 'In Progress' | 'Completed' | 'At Risk'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newOwner, setNewOwner] = useState('Rahul Sharma');
  const [newDueDate, setNewDueDate] = useState('Jun 30, 2024');

  const filteredGoals = goals.filter((g) => {
    const matchesFilter = filterStatus === 'All' || g.status === filterStatus;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.ownerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateGoal = () => {
    if (!newTitle.trim()) {
      Alert.alert('Validation Error', 'Please enter a goal title.');
      return;
    }
    const newGoal: OKRGoal = {
      id: `g-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Key quarterly milestone achievement.',
      department: newDept,
      ownerName: newOwner,
      ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      dueDate: newDueDate,
      status: 'In Progress',
      progress: 10,
    };
    setGoals([newGoal, ...goals]);
    setModalOpen(false);
    setNewTitle('');
    setNewDesc('');
    Alert.alert('Goal Created', 'New quarterly OKR goal has been successfully set.');
  };

  const handleUpdateProgress = (id: string, newProgress: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? {
              ...g,
              progress: newProgress,
              status: newProgress >= 100 ? 'Completed' : 'In Progress',
            }
          : g
      )
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, { backgroundColor: isDarkMode ? '#0B1120' : '#F8FAFC' }]}
    >
      {/* 1. Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.titleCol}>
          <Text style={[styles.screenTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Performance, OKRs & Appraisals
          </Text>
          <Text style={styles.screenSubtitle}>
            Track company key results, align departmental objectives, and manage 360° reviews.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setModalOpen(true)}
          style={styles.setGoalBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.setGoalBtnText}>Set New OKR Goal</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Stat Metric Cards (4 Cards) */}
      <View style={styles.statsGrid}>
        {/* Total Goals */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>TOTAL GOALS</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Target size={16} color="#2563EB" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>48</Text>
          <View style={styles.statBadgeRow}>
            <TrendingUp size={12} color="#10B981" />
            <Text style={styles.statBadgeGreen}>+8 goals</Text>
          </View>
        </View>

        {/* Completed */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>COMPLETED</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <CheckCircle2 size={16} color="#10B981" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>32</Text>
          <View style={styles.statBadgeRow}>
            <Text style={styles.statBadgeGreen}>67% rate</Text>
          </View>
        </View>

        {/* In Progress */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>IN PROGRESS</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={16} color="#D97706" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>12</Text>
          <View style={styles.statBadgeRow}>
            <Text style={styles.statBadgeGreen}>Active track</Text>
          </View>
        </View>

        {/* At Risk / Overdue */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>AT RISK / OVERDUE</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEE2E2' }]}>
              <AlertTriangle size={16} color="#EF4444" />
            </View>
          </View>
          <Text style={[styles.statValue, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>4</Text>
          <View style={styles.statBadgeRow}>
            <Text style={styles.statBadgeRed}>Needs focus</Text>
          </View>
        </View>
      </View>

      {/* 3. Overall Organization Progress & Leaderboard */}
      <View style={styles.midSectionRow}>
        {/* Left: Overall Organization Progress */}
        <View
          style={[
            styles.progressCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <View style={styles.donutContainer}>
            <View style={styles.donutRing}>
              <Text style={[styles.donutPercent, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                67%
              </Text>
              <Text style={styles.donutLabel}>GOAL COMPLETION</Text>
            </View>
          </View>
          <Text style={[styles.progressCardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Overall Organization Progress
          </Text>
          <Text style={styles.progressCardSub}>
            32 out of 48 strategic quarterly objectives achieved across all departments.
          </Text>
        </View>

        {/* Right: Top Performers Leaderboard (Q1) */}
        <View
          style={[
            styles.leaderboardCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
          ]}
        >
          <View style={styles.leaderboardHeader}>
            <Trophy size={17} color="#F59E0B" style={{ marginRight: 6 }} />
            <Text style={[styles.leaderboardTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Top Performers Leaderboard (Q1)
            </Text>
          </View>

          <View style={styles.leaderboardList}>
            {LEADERBOARD.map((item, idx) => (
              <View key={idx} style={styles.leaderboardRow}>
                <Text style={styles.leaderboardRank}>{item.rank}</Text>
                <View style={styles.leaderboardUserCol}>
                  <Text style={[styles.leaderboardName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.leaderboardRole}>{item.role}</Text>
                </View>
                <View style={styles.leaderboardBarWrap}>
                  <View style={styles.leaderboardBarBg}>
                    <View
                      style={[
                        styles.leaderboardBarFill,
                        { width: `${item.score}%`, backgroundColor: '#10B981' },
                      ]}
                    />
                  </View>
                  <Text style={[styles.leaderboardScore, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {item.score}%
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 4. Active Quarterly Goals Section */}
      <View style={styles.goalsSection}>
        <View style={styles.goalsHeaderRow}>
          <Text style={[styles.goalsHeaderTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            Active Quarterly Goals
          </Text>

          {/* Filter Pills */}
          <View style={styles.filterPillsRow}>
            {(['All', 'In Progress', 'Completed', 'At Risk'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                activeOpacity={0.7}
                onPress={() => setFilterStatus(tab)}
                style={[
                  styles.filterPill,
                  filterStatus === tab && styles.filterPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    filterStatus === tab && styles.filterPillTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Search Goals Input */}
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
            placeholder="Search active goals, leads, or departments..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Goals List / Cards */}
        <View style={styles.goalsGrid}>
          {filteredGoals.map((goal) => (
            <View
              key={goal.id}
              style={[
                styles.goalCard,
                { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
              ]}
            >
              <View style={styles.goalCardHeader}>
                <View style={styles.statusBadgeYellow}>
                  <Text style={styles.statusBadgeYellowText}>{goal.status}</Text>
                </View>
                <Text style={styles.dueDateText}>Due {goal.dueDate}</Text>
              </View>

              <Text style={[styles.goalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                {goal.title}
              </Text>
              <Text style={styles.goalDesc}>{goal.description}</Text>

              <View style={styles.ownerRow}>
                <View style={styles.ownerAvatarBox}>
                  <Text style={styles.ownerAvatarInitial}>{goal.ownerName[0]}</Text>
                </View>
                <Text style={[styles.ownerNameText, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                  {goal.ownerName}
                </Text>
                <Text style={styles.departmentBadge}>{goal.department}</Text>
              </View>

              {/* Progress Slider / Bar */}
              <View style={styles.progressRow}>
                <View style={styles.progressLabels}>
                  <Text style={styles.progressLabelText}>Progress</Text>
                  <Text style={[styles.progressValText, { color: '#2563EB' }]}>
                    {goal.progress}%
                  </Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[styles.progressBarFill, { width: `${goal.progress}%` }]}
                  />
                </View>

                {/* Quick Increment Controls */}
                <View style={styles.quickStepRow}>
                  {[25, 50, 75, 100].map((step) => (
                    <TouchableOpacity
                      key={step}
                      onPress={() => handleUpdateProgress(goal.id, step)}
                      style={[
                        styles.quickStepBtn,
                        goal.progress === step && styles.quickStepBtnActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.quickStepText,
                          goal.progress === step && styles.quickStepTextActive,
                        ]}
                      >
                        {step}%
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Set New OKR Goal Modal */}
      <Modal visible={modalOpen} transparent animationType="slide" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalSheet,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            <View style={styles.modalHeader}>
              <View>
                <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                  Set New OKR Goal
                </Text>
                <Text style={styles.modalSub}>
                  Define a strategic company objective and measurable key results.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalOpen(false)} style={styles.modalCloseBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.modalBody}>
              <Text style={styles.inputLabel}>Goal Title *</Text>
              <TextInput
                value={newTitle}
                onChangeText={setNewTitle}
                placeholder="e.g. Launch Mobile App V2 in App Store"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Description & Key Results</Text>
              <TextInput
                value={newDesc}
                onChangeText={setNewDesc}
                placeholder="Outline the qualitative impact and milestones..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                style={[
                  styles.formTextarea,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Department</Text>
              <TextInput
                value={newDept}
                onChangeText={setNewDept}
                placeholder="Engineering, Marketing, Sales, etc."
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Lead Assignee</Text>
              <TextInput
                value={newOwner}
                onChangeText={setNewOwner}
                placeholder="Assignee Full Name"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <Text style={styles.inputLabel}>Target Completion Date</Text>
              <TextInput
                value={newDueDate}
                onChangeText={setNewDueDate}
                placeholder="e.g. Jun 30, 2024"
                placeholderTextColor="#94A3B8"
                style={[
                  styles.formInput,
                  { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
                ]}
              />

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleCreateGoal}
                style={styles.modalSubmitBtn}
              >
                <Text style={styles.modalSubmitBtnText}>Create OKR Goal</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  setGoalBtn: {
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
  setGoalBtnText: {
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
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  statIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  statBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statBadgeGreen: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#10B981',
  },
  statBadgeRed: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#EF4444',
  },
  midSectionRow: {
    gap: 12,
    marginBottom: 16,
  },
  progressCard: {
    padding: 18,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    alignItems: 'center',
  },
  donutContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 9,
    borderColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    marginBottom: 14,
  },
  donutRing: {
    alignItems: 'center',
  },
  donutPercent: {
    fontSize: 26,
    fontWeight: '900',
  },
  donutLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    marginTop: 2,
  },
  progressCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  progressCardSub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 12,
  },
  leaderboardCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  leaderboardTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  leaderboardList: {
    gap: 12,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardRank: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    width: 24,
  },
  leaderboardUserCol: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 12,
    fontWeight: '700',
  },
  leaderboardRole: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  leaderboardBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 100,
  },
  leaderboardBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  leaderboardBarFill: {
    height: 6,
    borderRadius: 3,
  },
  leaderboardScore: {
    fontSize: 11,
    fontWeight: '800',
    width: 32,
    textAlign: 'right',
  },
  goalsSection: {
    marginTop: 4,
  },
  goalsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  goalsHeaderTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.full,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  filterPillActive: {
    backgroundColor: '#2563EB',
  },
  filterPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  filterPillTextActive: {
    color: '#FFFFFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    fontSize: 12.5,
    paddingVertical: 0,
  },
  goalsGrid: {
    gap: 12,
  },
  goalCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadgeYellow: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusBadgeYellowText: {
    color: '#B45309',
    fontSize: 10,
    fontWeight: '800',
  },
  dueDateText: {
    fontSize: 10.5,
    color: '#64748B',
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
    lineHeight: 18,
  },
  goalDesc: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  ownerAvatarBox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ownerAvatarInitial: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ownerNameText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  departmentBadge: {
    fontSize: 10,
    color: '#64748B',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  progressRow: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  progressValText: {
    fontSize: 11,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2563EB',
  },
  quickStepRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
    marginTop: 4,
  },
  quickStepBtn: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
  },
  quickStepBtnActive: {
    backgroundColor: '#2563EB',
  },
  quickStepText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  quickStepTextActive: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  modalCloseBtn: {
    padding: 4,
  },
  modalBody: {
    marginBottom: 10,
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
  formTextarea: {
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 70,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  modalSubmitBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});
