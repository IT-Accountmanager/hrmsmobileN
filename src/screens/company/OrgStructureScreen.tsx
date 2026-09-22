import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Users,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
} from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OrgStructureScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface ExecutiveNode {
  id: string;
  name: string;
  role: string;
  department: string;
  headcount: number;
  avatar: string;
  level: string;
  reports?: { name: string; role: string; avatar: string }[];
}

const CEO_NODE: ExecutiveNode = {
  id: 'ceo-1',
  name: 'Sarah Jenkins',
  role: 'Chief Executive Officer',
  department: 'Executive',
  headcount: 108,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  level: 'Executive Level',
};

const VP_NODES: ExecutiveNode[] = [
  {
    id: 'vp-1',
    name: 'Amit Verma',
    role: 'VP of Engineering',
    department: 'Engineering',
    headcount: 54,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=95',
    level: 'VP Level',
    reports: [
      {
        name: 'Rahul Sharma',
        role: 'Senior Software Engineer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      },
      {
        name: 'Michael Chang',
        role: 'DevOps Lead',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'vp-2',
    name: 'Priya Singh',
    role: 'VP of Marketing',
    department: 'Marketing',
    headcount: 22,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    level: 'VP Level',
    reports: [
      {
        name: 'Sarah Wilson',
        role: 'Growth Marketing Lead',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'vp-3',
    name: 'Marcus Sterling',
    role: 'VP of Finance',
    department: 'Finance',
    headcount: 14,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    level: 'VP Level',
    reports: [
      {
        name: 'Amit Kumar',
        role: 'Senior Accountant',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'vp-4',
    name: 'Sneha Gupta',
    role: 'VP of HR',
    department: 'HR & People',
    headcount: 12,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    level: 'VP Level',
    reports: [
      {
        name: 'Neha Gupta',
        role: 'HR Executive',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      },
    ],
  },
];

export const OrgStructureScreen: React.FC<OrgStructureScreenProps> = ({ onNavigate }) => {
  const { isDarkMode } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<ExecutiveNode | null>(null);

  const handleOpenDepartment = (department: string) => {
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
      {/* Screen Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.screenTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Organization Hierarchy Chart
        </Text>
        <Text
          style={[
            styles.screenSubtitle,
            { color: isDarkMode ? '#94A3B8' : '#64748B' },
          ]}
        >
          Visual executive reporting trees and department lead relationships.
        </Text>
      </View>

      {/* Hierarchy Tree Area with horizontal scroll for responsiveness */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.treeContainer}
      >
        <View style={styles.treeColumn}>
          {/* LEVEL 1: CEO Card */}
          <View style={styles.ceoWrapper}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setSelectedNode(CEO_NODE)}
              style={[
                styles.ceoCard,
                {
                  backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                },
              ]}
            >
              <Image source={{ uri: CEO_NODE.avatar }} style={styles.ceoAvatar} />
              <Text
                style={[
                  styles.ceoName,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {CEO_NODE.name}
              </Text>
              <Text style={styles.ceoRole}>{CEO_NODE.role}</Text>
              <View style={styles.executiveBadge}>
                <Text style={styles.executiveBadgeText}>{CEO_NODE.level}</Text>
              </View>
            </TouchableOpacity>

            {/* Vertical Connector Line */}
            <View
              style={[
                styles.verticalLine,
                { backgroundColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />
          </View>

          {/* Branching Line Structure */}
          <View style={styles.branchContainer}>
            {/* Horizontal Crossbar connecting the 4 direct report branches */}
            <View
              style={[
                styles.horizontalCrossbar,
                { backgroundColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            {/* LEVEL 2: Row of 4 VP Leads */}
            <View style={styles.vpRow}>
              {VP_NODES.map((vp, index) => (
                <View key={vp.id} style={styles.vpBranchColumn}>
                  {/* Vertical Line dropping into each VP card */}
                  <View
                    style={[
                      styles.verticalLineSmall,
                      { backgroundColor: isDarkMode ? '#334155' : '#CBD5E1' },
                    ]}
                  />

                  {/* VP Card */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setSelectedNode(vp)}
                    style={[
                      styles.vpCard,
                      {
                        backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                        borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                      },
                    ]}
                  >
                    <Image source={{ uri: vp.avatar }} style={styles.vpAvatar} />
                    <Text
                      style={[
                        styles.vpName,
                        { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                      ]}
                      numberOfLines={1}
                    >
                      {vp.name}
                    </Text>
                    <Text style={styles.vpRole} numberOfLines={1}>
                      {vp.role}
                    </Text>

                    {/* Department Headcount Pill */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => handleOpenDepartment(vp.department)}
                      style={[
                        styles.deptPill,
                        {
                          backgroundColor: isDarkMode ? '#334155' : '#F1F5F9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.deptPillText,
                          { color: isDarkMode ? '#CBD5E1' : '#475569' },
                        ]}
                      >
                        {vp.department} ({vp.headcount})
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Selected Node Details Card (Bottom Inspection Sheet) */}
      {selectedNode && (
        <View
          style={[
            styles.detailSheet,
            {
              backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
              borderColor: isDarkMode ? '#334155' : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.detailHeader}>
            <Image source={{ uri: selectedNode.avatar }} style={styles.detailAvatar} />
            <View style={styles.detailInfo}>
              <Text
                style={[
                  styles.detailName,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {selectedNode.name}
              </Text>
              <Text style={styles.detailRole}>{selectedNode.role}</Text>
              <Text style={styles.detailDept}>
                Department: <Text style={{ fontWeight: '700' }}>{selectedNode.department}</Text> • Headcount:{' '}
                <Text style={{ fontWeight: '700' }}>{selectedNode.headcount}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.detailBtnRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onNavigate && onNavigate('Employees')}
              style={styles.viewEmployeesBtn}
            >
              <Users size={16} color="#FFFFFF" />
              <Text style={styles.viewEmployeesBtnText}>View Team in Directory</Text>
              <ArrowRight size={14} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedNode(null)}
              style={[
                styles.closeDetailBtn,
                { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' },
              ]}
            >
              <Text
                style={[
                  styles.closeDetailBtnText,
                  { color: isDarkMode ? '#CBD5E1' : '#64748B' },
                ]}
              >
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Footer Branding matching Screenshot 2 */}
      <View
        style={[
          styles.footer,
          { borderTopColor: isDarkMode ? '#1E293B' : '#E2E8F0' },
        ]}
      >
        <View style={styles.footerLeft}>
          <View style={styles.logoDiamond}>
            <View style={styles.innerDiamond} />
          </View>
          <Text style={styles.footerBrand}>HRM</Text>
          <Text style={styles.footerTagline}>
            | Better People. Stronger Teams.
          </Text>
        </View>
        <Text style={styles.footerCopyright}>© 2026 HRM. All rights reserved.</Text>
      </View>
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
  header: {
    marginBottom: 24,
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
  treeContainer: {
    minWidth: 700,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  treeColumn: {
    alignItems: 'center',
    width: '100%',
  },
  ceoWrapper: {
    alignItems: 'center',
  },
  ceoCard: {
    width: 220,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6', // Blue border from screenshot
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  ceoAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 10,
    backgroundColor: '#E2E8F0',
  },
  ceoName: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  ceoRole: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 10,
  },
  executiveBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  executiveBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  verticalLine: {
    width: 2,
    height: 32,
  },
  branchContainer: {
    width: '100%',
    alignItems: 'center',
  },
  horizontalCrossbar: {
    height: 2,
    width: '80%',
    alignSelf: 'center',
  },
  vpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 16,
  },
  vpBranchColumn: {
    alignItems: 'center',
    flex: 1,
    minWidth: 150,
  },
  verticalLineSmall: {
    width: 2,
    height: 24,
  },
  vpCard: {
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  vpAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginBottom: 8,
    backgroundColor: '#E2E8F0',
  },
  vpName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  vpRole: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  deptPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deptPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  detailSheet: {
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  detailAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
  },
  detailInfo: {
    flex: 1,
  },
  detailName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  detailRole: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
    marginBottom: 2,
  },
  detailDept: {
    fontSize: 12,
    color: '#64748B',
  },
  detailBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  viewEmployeesBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewEmployeesBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  closeDetailBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  closeDetailBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    marginTop: 36,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logoDiamond: {
    width: 16,
    height: 16,
    backgroundColor: '#2563EB',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  footerBrand: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
  },
  footerTagline: {
    fontSize: 11,
    color: '#64748B',
  },
  footerCopyright: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
