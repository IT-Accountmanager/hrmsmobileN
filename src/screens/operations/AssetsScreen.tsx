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
  Laptop,
  Smartphone,
  BookOpen,
  Headphones,
  Search,
  Filter,
  Plus,
  AlertCircle,
  FileText,
  ChevronRight,
  X,
  CheckCircle2,
  HelpCircle,
  PhoneCall,
} from 'lucide-react-native';

interface AssetItem {
  id: string;
  num: number;
  name: string;
  subname: string;
  category: 'Laptop' | 'Mobile' | 'Stationery' | 'Accessory' | string;
  brandModel: string;
  serialNumber: string;
  assignedDate: string;
  status: 'In Use' | 'Under Repair' | 'Returned';
}

const INITIAL_ASSIGNED_ASSETS: AssetItem[] = [
  {
    id: 'ast-1',
    num: 1,
    name: 'Dell Laptop',
    subname: 'Work Laptop',
    category: 'Laptop',
    brandModel: 'Dell Inspiron 15',
    serialNumber: 'DL123456789',
    assignedDate: 'Apr 10, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-2',
    num: 2,
    name: 'HP Laptop',
    subname: 'Work Laptop',
    category: 'Laptop',
    brandModel: 'HP ProBook 440',
    serialNumber: 'HP987654321',
    assignedDate: 'May 05, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-3',
    num: 3,
    name: 'Samsung Galaxy S23',
    subname: 'Work Phone',
    category: 'Mobile',
    brandModel: 'Samsung S23',
    serialNumber: 'SM-S911U/DS',
    assignedDate: 'Apr 08, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-4',
    num: 4,
    name: 'Executive Notebook',
    subname: 'Official Diary / Book',
    category: 'Stationery',
    brandModel: 'A5 Leatherette Journal',
    serialNumber: 'NB-2025-009',
    assignedDate: 'Jan 12, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-5',
    num: 5,
    name: 'Parker Pen Set',
    subname: 'Executive Rollerball & Ballpoint',
    category: 'Stationery',
    brandModel: 'Parker Vector Metal',
    serialNumber: 'PEN-0832-BK',
    assignedDate: 'Jan 12, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-6',
    num: 6,
    name: 'Logitech Headset',
    subname: 'Audio Accessory',
    category: 'Accessory',
    brandModel: 'Logitech H111',
    serialNumber: 'LMZ4870013',
    assignedDate: 'Jan 12, 2025',
    status: 'In Use',
  },
  {
    id: 'ast-7',
    num: 7,
    name: 'Acer 24" Monitor',
    subname: 'Display Accessory',
    category: 'Accessory',
    brandModel: 'Acer 24" IPS FHD',
    serialNumber: 'AC9248112',
    assignedDate: 'Mar 15, 2025',
    status: 'In Use',
  },
];

export const AssetsScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSIGNED_ASSETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<'All' | 'Laptop' | 'Mobile' | 'Stationery' | 'Accessory'>('All');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  // Form states
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceCat, setNewDeviceCat] = useState('Laptop');
  const [newDeviceReason, setNewDeviceReason] = useState('');

  // Issue reporting form
  const [reportedAsset, setReportedAsset] = useState('Dell Inspiron 15 (DL123456789)');
  const [issueDesc, setIssueDesc] = useState('');

  const filteredAssets = assets.filter((a) => {
    const matchesCat = selectedCat === 'All' || a.category === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      a.name.toLowerCase().includes(q) ||
      a.brandModel.toLowerCase().includes(q) ||
      a.serialNumber.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const handleCreateRequest = () => {
    if (!newDeviceName.trim()) {
      Alert.alert('Validation Error', 'Please specify device or item needed.');
      return;
    }
    Alert.alert('Asset Request Submitted', `Your request for ${newDeviceName.trim()} has been forwarded to IT & Operations.`);
    setRequestModalOpen(false);
    setNewDeviceName('');
    setNewDeviceReason('');
  };

  const handleReportIssue = () => {
    if (!issueDesc.trim()) {
      Alert.alert('Validation Error', 'Please describe the hardware or software problem.');
      return;
    }
    Alert.alert('Issue Ticket Created', `IT Helpdesk ticket #TK-${Math.floor(Math.random() * 8999 + 1000)} has been opened.`);
    setIssueModalOpen(false);
    setIssueDesc('');
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
            My Assets
          </Text>
          <Text style={styles.screenSubtitle}>
            View and manage your assigned assets, laptops, mobile phones, stationery, books, pens, and accessories.
          </Text>
        </View>
      </View>

      {/* 2. Top Summary Horizontal Scroll Cards (5 Cards matching Screenshot 4) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScroll}
      >
        {/* Total Assets */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('All')}
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            selectedCat === 'All' && styles.statCardSelected,
          ]}
        >
          <View style={styles.statIconBoxBlue}>
            <Laptop size={17} color="#2563EB" />
          </View>
          <Text style={styles.statLabel}>Total Assets</Text>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>7</Text>
          <Text style={styles.statSub}>Assigned to you</Text>
        </TouchableOpacity>

        {/* Laptops */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('Laptop')}
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            selectedCat === 'Laptop' && styles.statCardSelected,
          ]}
        >
          <View style={styles.statIconBoxPurple}>
            <Laptop size={17} color="#7C3AED" />
          </View>
          <Text style={styles.statLabel}>Laptops</Text>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>2</Text>
          <Text style={styles.statSub}>Assigned to you</Text>
        </TouchableOpacity>

        {/* Mobile Phones */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('Mobile')}
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            selectedCat === 'Mobile' && styles.statCardSelected,
          ]}
        >
          <View style={styles.statIconBoxGreen}>
            <Smartphone size={17} color="#10B981" />
          </View>
          <Text style={styles.statLabel}>Mobile Phones</Text>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>1</Text>
          <Text style={styles.statSub}>Assigned to you</Text>
        </TouchableOpacity>

        {/* Books & Pens */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('Stationery')}
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            selectedCat === 'Stationery' && styles.statCardSelected,
          ]}
        >
          <View style={styles.statIconBoxTeal}>
            <BookOpen size={17} color="#0D9488" />
          </View>
          <Text style={styles.statLabel}>Books & Pens</Text>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>2</Text>
          <Text style={styles.statSub}>Assigned to you</Text>
        </TouchableOpacity>

        {/* Accessories */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('Accessory')}
          style={[
            styles.statCard,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            selectedCat === 'Accessory' && styles.statCardSelected,
          ]}
        >
          <View style={styles.statIconBoxAmber}>
            <Headphones size={17} color="#D97706" />
          </View>
          <Text style={styles.statLabel}>Accessories</Text>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>2</Text>
          <Text style={styles.statSub}>Assigned to you</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. Search Bar & Filter Buttons */}
      <View style={styles.searchRow}>
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
            placeholder="Search assets..."
            placeholderTextColor="#94A3B8"
            style={[styles.searchInput, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCat('All')}
          style={[
            styles.filterBtn,
            { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
          ]}
        >
          <Filter size={14} color="#64748B" style={{ marginRight: 6 }} />
          <Text style={[styles.filterBtnText, { color: isDarkMode ? '#FFFFFF' : '#334155' }]}>
            {selectedCat === 'All' ? 'All Items' : selectedCat}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. Assigned Assets Cards List */}
      <View style={styles.assetsList}>
        <Text style={[styles.listSectionTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          My Assigned Assets ({filteredAssets.length})
        </Text>

        {filteredAssets.map((asset) => (
          <View
            key={asset.id}
            style={[
              styles.assetCard,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <View style={styles.assetCardHeader}>
              <View style={styles.assetIconNameRow}>
                <View style={styles.assetNumBadge}>
                  <Text style={styles.assetNumText}>#{asset.num}</Text>
                </View>
                <View>
                  <Text style={[styles.assetName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {asset.name}
                  </Text>
                  <Text style={styles.assetSub}>{asset.subname}</Text>
                </View>
              </View>

              {/* Category Badge */}
              <View
                style={[
                  styles.catPill,
                  asset.category === 'Laptop' && styles.catLaptop,
                  asset.category === 'Mobile' && styles.catMobile,
                  asset.category === 'Stationery' && styles.catStationery,
                  asset.category === 'Accessory' && styles.catAccessory,
                ]}
              >
                <Text
                  style={[
                    styles.catPillText,
                    asset.category === 'Laptop' && { color: '#2563EB' },
                    asset.category === 'Mobile' && { color: '#7C3AED' },
                    asset.category === 'Stationery' && { color: '#0D9488' },
                    asset.category === 'Accessory' && { color: '#D97706' },
                  ]}
                >
                  {asset.category}
                </Text>
              </View>
            </View>

            {/* Spec / Serial Details */}
            <View style={styles.specsRow}>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>BRAND / MODEL</Text>
                <Text style={[styles.specVal, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                  {asset.brandModel}
                </Text>
              </View>
              <View style={styles.specItem}>
                <Text style={styles.specLabel}>SERIAL / IMEI</Text>
                <Text style={[styles.specVal, { color: isDarkMode ? '#E2E8F0' : '#334155' }]}>
                  {asset.serialNumber}
                </Text>
              </View>
            </View>

            {/* Bottom Row: Assigned Date + Status */}
            <View style={styles.assetCardFooter}>
              <Text style={styles.assignedDateText}>Assigned: {asset.assignedDate}</Text>
              <View style={styles.statusBadgeGreen}>
                <CheckCircle2 size={12} color="#10B981" style={{ marginRight: 4 }} />
                <Text style={styles.statusBadgeGreenText}>{asset.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* 5. Asset Summary Donut & Breakdown Card */}
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
        ]}
      >
        <Text style={[styles.summaryTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          Asset Summary
        </Text>
        <View style={styles.summaryDonutRow}>
          <View style={styles.donutSmall}>
            <Text style={[styles.donutSmallNum, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>7</Text>
            <Text style={styles.donutSmallLabel}>Assets</Text>
          </View>
          <View style={styles.summaryLegendList}>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
              <Text style={[styles.legendName, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>Laptop</Text>
              <Text style={styles.legendVal}>2</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#7C3AED' }]} />
              <Text style={[styles.legendName, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>Mobile</Text>
              <Text style={styles.legendVal}>1</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#0D9488' }]} />
              <Text style={[styles.legendName, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>Books & Pens</Text>
              <Text style={styles.legendVal}>2</Text>
            </View>
            <View style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: '#D97706' }]} />
              <Text style={[styles.legendName, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>Access.</Text>
              <Text style={styles.legendVal}>2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 6. Quick Actions Section */}
      <View
        style={[
          styles.actionsCard,
          { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
        ]}
      >
        <Text style={[styles.summaryTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          Quick Actions
        </Text>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setRequestModalOpen(true)}
          style={styles.actionItemRow}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Plus size={16} color="#2563EB" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={[styles.actionMainText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Request New Asset
            </Text>
            <Text style={styles.actionSubText}>Apply for device, notebook or pen</Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setIssueModalOpen(true)}
          style={styles.actionItemRow}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#FEF2F2' }]}>
            <AlertCircle size={16} color="#EF4444" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={[styles.actionMainText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Report Issue
            </Text>
            <Text style={styles.actionSubText}>Raise an issue with asset or repair</Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.75}
          onPress={() => setPolicyModalOpen(true)}
          style={styles.actionItemRow}
        >
          <View style={[styles.actionIconBox, { backgroundColor: '#F3E8FF' }]}>
            <FileText size={16} color="#7C3AED" />
          </View>
          <View style={styles.actionTextCol}>
            <Text style={[styles.actionMainText, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
              Asset Policy
            </Text>
            <Text style={styles.actionSubText}>View company hardware & usage rules</Text>
          </View>
          <ChevronRight size={16} color="#94A3B8" />
        </TouchableOpacity>

        {/* Need Help Box */}
        <View style={styles.helpBox}>
          <HelpCircle size={18} color="#2563EB" style={{ marginRight: 8 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpSub}>Contact IT & Operations for quick replacements.</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Contacting Operations', 'Connecting to IT Assets department: it-support@company.com')}
            style={styles.contactBtn}
          >
            <Text style={styles.contactBtnText}>Contact HR</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 7. Request New Asset Modal */}
      <Modal visible={requestModalOpen} transparent animationType="slide" onRequestClose={() => setRequestModalOpen(false)}>
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
                  Request New Asset
                </Text>
                <Text style={styles.modalSub}>Apply for laptop, monitor, phone, or office stationery.</Text>
              </View>
              <TouchableOpacity onPress={() => setRequestModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Asset Name / Description *</Text>
            <TextInput
              value={newDeviceName}
              onChangeText={setNewDeviceName}
              placeholder="e.g. 27-inch 4K Monitor or Wireless Mouse"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              value={newDeviceCat}
              onChangeText={setNewDeviceCat}
              placeholder="Laptop, Mobile, Stationery, Accessory"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Business Justification</Text>
            <TextInput
              value={newDeviceReason}
              onChangeText={setNewDeviceReason}
              placeholder="Explain project requirements..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={[
                styles.formTextarea,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleCreateRequest}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Submit Asset Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. Report Issue Modal */}
      <Modal visible={issueModalOpen} transparent animationType="slide" onRequestClose={() => setIssueModalOpen(false)}>
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
                  Report Asset Issue
                </Text>
                <Text style={styles.modalSub}>Log a malfunction, damage, or battery problem for repair.</Text>
              </View>
              <TouchableOpacity onPress={() => setIssueModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Select Asset</Text>
            <TextInput
              value={reportedAsset}
              onChangeText={setReportedAsset}
              placeholder="Device name & serial"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Issue Details *</Text>
            <TextInput
              value={issueDesc}
              onChangeText={setIssueDesc}
              placeholder="Describe what is broken or not functioning..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              style={[
                styles.formTextarea,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleReportIssue}
              style={[styles.modalSubmitBtn, { backgroundColor: '#EF4444' }]}
            >
              <Text style={styles.modalSubmitBtnText}>Create IT Support Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 9. Policy Modal */}
      <Modal visible={policyModalOpen} transparent animationType="fade" onRequestClose={() => setPolicyModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.policyBox,
              { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
            ]}
          >
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A', marginBottom: 8 }]}>
              Company Asset Policy
            </Text>
            <Text style={styles.policyBody}>
              1. All hardware and laptops must have full-disk BitLocker/FileVault encryption enabled.{'\n\n'}
              2. Lost or stolen items must be reported immediately to IT Security within 4 hours.{'\n\n'}
              3. Routine replacement cycles are 3 years for laptops and 2 years for mobile phones.{'\n\n'}
              4. Return of company hardware is mandatory upon departure or department relocation.
            </Text>
            <TouchableOpacity
              onPress={() => setPolicyModalOpen(false)}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Understood</Text>
            </TouchableOpacity>
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
    marginBottom: 16,
  },
  titleCol: {
    flex: 1,
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
  statsScroll: {
    gap: 10,
    paddingBottom: 4,
    marginBottom: 16,
  },
  statCard: {
    width: 124,
    padding: 12,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },
  statCardSelected: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  statIconBoxBlue: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statIconBoxPurple: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statIconBoxGreen: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statIconBoxTeal: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statIconBoxAmber: {
    width: 28,
    height: 28,
    borderRadius: radii.md,
    backgroundColor: '#FFFBEB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
  },
  statSub: {
    fontSize: 9.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  searchBox: {
    flex: 1,
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
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radii.lg,
    paddingHorizontal: 14,
    height: 42,
  },
  filterBtnText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  assetsList: {
    gap: 12,
    marginBottom: 18,
  },
  listSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 2,
  },
  assetCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  assetCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assetIconNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  assetNumBadge: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  assetNumText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
  },
  assetName: {
    fontSize: 14,
    fontWeight: '800',
  },
  assetSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  catPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  catLaptop: {
    backgroundColor: '#EFF6FF',
  },
  catMobile: {
    backgroundColor: '#F5F3FF',
  },
  catStationery: {
    backgroundColor: '#F0FDFA',
  },
  catAccessory: {
    backgroundColor: '#FFFBEB',
  },
  catPillText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    padding: 10,
    borderRadius: radii.md,
    marginBottom: 10,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  specVal: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  assetCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  assignedDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  statusBadgeGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusBadgeGreenText: {
    color: '#10B981',
    fontSize: 10.5,
    fontWeight: '800',
  },
  summaryCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  summaryDonutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  donutSmall: {
    width: 74,
    height: 74,
    borderRadius: 37,
    borderWidth: 6,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
  },
  donutSmallNum: {
    fontSize: 18,
    fontWeight: '900',
  },
  donutSmallLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#64748B',
  },
  summaryLegendList: {
    flex: 1,
    gap: 6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    fontSize: 11.5,
    flex: 1,
  },
  legendVal: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
  },
  actionsCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  actionIconBox: {
    width: 32,
    height: 32,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actionTextCol: {
    flex: 1,
  },
  actionMainText: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  actionSubText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  helpBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: radii.lg,
    marginTop: 14,
  },
  helpTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  helpSub: {
    fontSize: 10.5,
    color: '#3B82F6',
  },
  contactBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.md,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
  closeBtn: {
    padding: 4,
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
  policyBox: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
  },
  policyBody: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
  },
});
