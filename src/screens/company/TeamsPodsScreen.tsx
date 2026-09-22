import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Search,
  Plus,
  ChevronDown,
  ArrowRight,
  Target,
  Users,
  Check,
  X,
  Building,
} from 'lucide-react-native';

interface TeamsPodsScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface TeamSquad {
  id: string;
  department: string;
  name: string;
  membersCount: number;
  leadName: string;
  leadRole: string;
  leadAvatar: string;
  okrProgress: number;
  accentColor: string;
  memberAvatars: string[];
  extraCount: number;
}

const INITIAL_TEAMS: TeamSquad[] = [
  {
    id: 'team-1',
    department: 'ENGINEERING',
    name: 'Frontend Architecture Core',
    membersCount: 8,
    leadName: 'David Miller',
    leadRole: 'Principal UI Architect',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    okrProgress: 88,
    accentColor: '#3B82F6', // Blue
    memberAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 5,
  },
  {
    id: 'team-2',
    department: 'ENGINEERING',
    name: 'Cloud & DevOps Infrastructure',
    membersCount: 6,
    leadName: 'Michael Chang',
    leadRole: 'DevOps Lead',
    leadAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    okrProgress: 94,
    accentColor: '#6366F1', // Indigo
    memberAvatars: [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 4,
  },
  {
    id: 'team-3',
    department: 'MARKETING',
    name: 'Growth & Demand Generation',
    membersCount: 7,
    leadName: 'Sarah Wilson',
    leadRole: 'Growth Marketing Lead',
    leadAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    okrProgress: 75,
    accentColor: '#10B981', // Emerald
    memberAvatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 5,
  },
  {
    id: 'team-4',
    department: 'PRODUCT',
    name: 'Product Design & Research',
    membersCount: 5,
    leadName: 'Elena Rostova',
    leadRole: 'Design Director',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    okrProgress: 90,
    accentColor: '#EC4899', // Pink
    memberAvatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 3,
  },
  {
    id: 'team-5',
    department: 'SALES',
    name: 'Enterprise Accounts Team',
    membersCount: 11,
    leadName: 'James Wilson',
    leadRole: 'VP Sales',
    leadAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    okrProgress: 82,
    accentColor: '#F59E0B', // Amber
    memberAvatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 9,
  },
  {
    id: 'team-6',
    department: 'HUMAN RESOURCES',
    name: 'People Operations & Culture',
    membersCount: 6,
    leadName: 'Rachel Green',
    leadRole: 'Head of People',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    okrProgress: 96,
    accentColor: '#8B5CF6', // Purple
    memberAvatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ],
    extraCount: 4,
  },
];

const DEPARTMENTS = [
  'All Departments',
  'Engineering',
  'Marketing',
  'Product',
  'Sales',
  'Human Resources',
];

export const TeamsPodsScreen: React.FC<TeamsPodsScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();

  const [teams, setTeams] = useState<TeamSquad[]>(INITIAL_TEAMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [deptModalOpen, setDeptModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Team Form State
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('Engineering');
  const [newTeamLead, setNewTeamLead] = useState('');
  const [newTeamRole, setNewTeamRole] = useState('');
  const [newTeamCount, setNewTeamCount] = useState('4');

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDept === 'All Departments' ||
      team.department.toLowerCase() === selectedDept.toLowerCase();

    return matchesSearch && matchesDept;
  });

  const handleCreateTeam = () => {
    if (!newTeamName.trim() || !newTeamLead.trim()) {
      Alert.alert('Required Fields', 'Please provide a team name and team lead.');
      return;
    }

    const deptColors: Record<string, string> = {
      Engineering: '#3B82F6',
      Marketing: '#10B981',
      Product: '#EC4899',
      Sales: '#F59E0B',
      'Human Resources': '#8B5CF6',
    };

    const newSquad: TeamSquad = {
      id: `team-${Date.now()}`,
      department: newTeamDept.toUpperCase(),
      name: newTeamName.trim(),
      membersCount: parseInt(newTeamCount, 10) || 4,
      leadName: newTeamLead.trim(),
      leadRole: newTeamRole.trim() || 'Team Lead',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      okrProgress: 85,
      accentColor: deptColors[newTeamDept] || '#2563EB',
      memberAvatars: [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      ],
      extraCount: Math.max(0, (parseInt(newTeamCount, 10) || 4) - 2),
    };

    setTeams([newSquad, ...teams]);
    setAddModalOpen(false);
    setNewTeamName('');
    setNewTeamLead('');
    setNewTeamRole('');
    setNewTeamCount('4');
    Alert.alert('Success', 'New team squad created successfully.');
  };

  const handleViewRoster = (team: TeamSquad) => {
    // Specifically requested: "when i will be click the view rooster i need to open the employee screeen"
    if (onNavigate) {
      onNavigate('Employees');
    }
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
      <View style={styles.headerRow}>
        <View style={styles.headerTextGroup}>
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.screenTitle,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              Teams & Pods
            </Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{teams.length} Active Teams</Text>
            </View>
          </View>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Cross-functional squads, reporting pods, sprint OKRs, and team lead delegations.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setAddModalOpen(true)}
          style={styles.addBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addBtnText}>Create New Team</Text>
        </TouchableOpacity>
      </View>

      {/* Filter and Search Bar */}
      <View style={styles.filterSection}>
        {/* Search Input */}
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Search size={16} color="#94A3B8" />
          <TextInput
            placeholder="Search teams by name or lead..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[
              styles.searchInput,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Department Dropdown */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setDeptModalOpen(true)}
          style={[
            styles.deptDropdown,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <Text
            style={[
              styles.deptDropdownText,
              { color: isDarkMode ? '#F8FAFC' : '#334155' },
            ]}
          >
            {selectedDept}
          </Text>
          <ChevronDown size={16} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* Teams Grid / Cards */}
      <View style={styles.teamsGrid}>
        {filteredTeams.map((team) => (
          <View
            key={team.id}
            style={[
              styles.teamCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#F1F5F9',
              },
            ]}
          >
            {/* Top Color Accent Bar */}
            <View
              style={[
                styles.topAccentBar,
                { backgroundColor: team.accentColor },
              ]}
            />

            <View style={styles.cardContent}>
              {/* Category & Member Count Header */}
              <View style={styles.cardHeaderRow}>
                <Text style={styles.categoryText}>{team.department}</Text>
                <View style={styles.memberPill}>
                  <Text style={styles.memberPillText}>{team.membersCount} Members</Text>
                </View>
              </View>

              {/* Team Name */}
              <Text
                style={[
                  styles.teamName,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
                numberOfLines={2}
              >
                {team.name}
              </Text>

              {/* Lead Row */}
              <View style={styles.leadRow}>
                <Image
                  source={{ uri: team.leadAvatar }}
                  style={styles.leadAvatar}
                />
                <View style={styles.leadInfo}>
                  <Text
                    style={[
                      styles.leadName,
                      { color: isDarkMode ? '#F1F5F9' : '#1E293B' },
                    ]}
                  >
                    {team.leadName}
                  </Text>
                  <Text style={styles.leadRole}>{team.leadRole}</Text>
                </View>
              </View>

              {/* Sprint OKR Progress */}
              <View style={styles.okrSection}>
                <View style={styles.okrLabelRow}>
                  <View style={styles.targetIconRow}>
                    <Target size={13} color={team.accentColor} />
                    <Text style={styles.okrTitle}>Sprint OKR Progress</Text>
                  </View>
                  <Text
                    style={[
                      styles.okrPercent,
                      { color: isDarkMode ? '#F1F5F9' : '#0F172A' },
                    ]}
                  >
                    {team.okrProgress}%
                  </Text>
                </View>

                {/* Progress Bar Track */}
                <View
                  style={[
                    styles.progressBarTrack,
                    { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${team.okrProgress}%`,
                        backgroundColor: team.accentColor,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Card Footer: Avatar Stack & View Roster Link */}
              <View style={styles.cardFooterRow}>
                {/* Overlapping Avatar Stack */}
                <View style={styles.avatarStack}>
                  {team.memberAvatars.map((url, idx) => (
                    <Image
                      key={idx}
                      source={{ uri: url }}
                      style={[
                        styles.stackedAvatar,
                        {
                          marginLeft: idx > 0 ? -8 : 0,
                          borderColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        },
                      ]}
                    />
                  ))}
                  {team.extraCount > 0 && (
                    <View
                      style={[
                        styles.extraAvatarBadge,
                        {
                          borderColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                          backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.extraAvatarText,
                          { color: isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        +{team.extraCount}
                      </Text>
                    </View>
                  )}
                </View>

                {/* View Roster Link -> opens employee screen */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleViewRoster(team)}
                  style={styles.viewRosterBtn}
                >
                  <Text style={styles.viewRosterText}>View Roster</Text>
                  <ArrowRight size={14} color="#2563EB" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Department Filter Modal */}
      <Modal
        visible={deptModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDeptModalOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDeptModalOpen(false)}
        >
          <View
            style={[
              styles.filterModalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <Text
                style={[
                  styles.filterModalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                Filter by Department
              </Text>
              <TouchableOpacity onPress={() => setDeptModalOpen(false)}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.filterOptionRow,
                  selectedDept === dept && {
                    backgroundColor: isDarkMode ? '#334155' : '#EFF6FF',
                  },
                ]}
                onPress={() => {
                  setSelectedDept(dept);
                  setDeptModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color:
                        selectedDept === dept
                          ? '#2563EB'
                          : isDarkMode
                          ? '#E2E8F0'
                          : '#334155',
                      fontWeight: selectedDept === dept ? '700' : '500',
                    },
                  ]}
                >
                  {dept}
                </Text>
                {selectedDept === dept && <Check size={16} color="#2563EB" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Add New Team Modal */}
      <Modal
        visible={addModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.addTeamModalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.filterModalHeader}>
              <View>
                <Text
                  style={[
                    styles.filterModalTitle,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  Create New Team Pod
                </Text>
                <Text style={styles.modalSubtitle}>
                  Set up a cross-functional squad and assign leadership.
                </Text>
              </View>
              <TouchableOpacity onPress={() => setAddModalOpen(false)}>
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
                Team Name
              </Text>
              <TextInput
                placeholder="e.g. Platform Reliability Squad"
                placeholderTextColor="#94A3B8"
                value={newTeamName}
                onChangeText={setNewTeamName}
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
              <Text
                style={[
                  styles.formLabel,
                  { color: isDarkMode ? '#CBD5E1' : '#475569' },
                ]}
              >
                Department
              </Text>
              <View style={styles.deptChipRow}>
                {['Engineering', 'Marketing', 'Product', 'Sales', 'Human Resources'].map(
                  (dept) => (
                    <TouchableOpacity
                      key={dept}
                      onPress={() => setNewTeamDept(dept)}
                      style={[
                        styles.deptChip,
                        newTeamDept === dept && styles.deptChipSelected,
                        {
                          backgroundColor:
                            newTeamDept === dept
                              ? '#2563EB'
                              : isDarkMode
                              ? '#334155'
                              : '#F1F5F9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.deptChipText,
                          {
                            color:
                              newTeamDept === dept
                                ? '#FFFFFF'
                                : isDarkMode
                                ? '#E2E8F0'
                                : '#475569',
                          },
                        ]}
                      >
                        {dept}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
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
                  Team Lead Name
                </Text>
                <TextInput
                  placeholder="e.g. Liam Scott"
                  placeholderTextColor="#94A3B8"
                  value={newTeamLead}
                  onChangeText={setNewTeamLead}
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
                  Initial Members
                </Text>
                <TextInput
                  placeholder="e.g. 6"
                  keyboardType="numeric"
                  placeholderTextColor="#94A3B8"
                  value={newTeamCount}
                  onChangeText={setNewTeamCount}
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
                Lead Role / Job Title
              </Text>
              <TextInput
                placeholder="e.g. Lead SRE Architect"
                placeholderTextColor="#94A3B8"
                value={newTeamRole}
                onChangeText={setNewTeamRole}
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

            {/* Submit Buttons */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setAddModalOpen(false)}
                style={[
                  styles.cancelBtn,
                  {
                    backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
                  },
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
                onPress={handleCreateTeam}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Create Team</Text>
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
    marginBottom: 16,
  },
  headerTextGroup: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 4,
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
  addBtn: {
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
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  filterSection: {
    gap: 10,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  deptDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 40,
  },
  deptDropdownText: {
    fontSize: 13,
    fontWeight: '600',
  },
  teamsGrid: {
    gap: 16,
  },
  teamCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  topAccentBar: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#64748B',
  },
  memberPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  memberPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
    marginBottom: 14,
  },
  leadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  leadAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  leadRole: {
    fontSize: 12,
    color: '#64748B',
  },
  okrSection: {
    marginBottom: 16,
  },
  okrLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  targetIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  okrTitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  okrPercent: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  cardFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stackedAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
  },
  extraAvatarBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    marginLeft: -8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraAvatarText: {
    fontSize: 10,
    fontWeight: '700',
  },
  viewRosterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewRosterText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  filterModalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  filterModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  filterModalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterOptionText: {
    fontSize: 14,
  },
  addTeamModalCard: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 14,
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
    height: 42,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  deptChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  deptChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deptChipSelected: {},
  deptChipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 42,
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
    height: 42,
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
