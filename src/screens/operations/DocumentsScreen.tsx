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
  FileText,
  CheckCircle2,
  Clock,
  Upload,
  Search,
  Plus,
  X,
  FileCheck,
  Download,
  Eye,
  Shield,
  FolderOpen,
  ArrowRight,
  Info,
} from 'lucide-react-native';

interface DocItem {
  id: string;
  name: string;
  subname: string;
  category: string;
  fileType: 'PDF' | 'JPG' | 'PNG' | string;
  size: string;
  uploadedOn: string;
  status: 'Verified' | 'Pending';
}

const INITIAL_DOCS: DocItem[] = [
  {
    id: 'doc-1',
    name: 'Aadhaar Card',
    subname: 'ID Document',
    category: 'Identification Documents',
    fileType: 'PDF',
    size: '1.2 MB',
    uploadedOn: 'Apr 05, 2025 10:32 AM',
    status: 'Verified',
  },
  {
    id: 'doc-2',
    name: 'PAN Card',
    subname: 'ID Document',
    category: 'Identification Documents',
    fileType: 'PDF',
    size: '856 KB',
    uploadedOn: 'Apr 06, 2025 11:15 AM',
    status: 'Verified',
  },
  {
    id: 'doc-3',
    name: 'Educational Certificate',
    subname: 'Education',
    category: 'Educational Documents',
    fileType: 'PDF',
    size: '2.4 MB',
    uploadedOn: 'Apr 08, 2025 09:20 AM',
    status: 'Verified',
  },
  {
    id: 'doc-4',
    name: 'Experience Letter',
    subname: 'Experience',
    category: 'Experience Certificates',
    fileType: 'PDF',
    size: '1.8 MB',
    uploadedOn: 'Apr 10, 2025 03:45 PM',
    status: 'Verified',
  },
  {
    id: 'doc-5',
    name: 'Bonafide Certificate',
    subname: 'Other',
    category: 'Other Documents',
    fileType: 'PDF',
    size: '620 KB',
    uploadedOn: 'Apr 12, 2025 11:10 AM',
    status: 'Verified',
  },
  {
    id: 'doc-6',
    name: 'Bank Account Details',
    subname: 'Financial',
    category: 'Tax & Financial',
    fileType: 'PDF',
    size: '1.1 MB',
    uploadedOn: 'Apr 14, 2025 03:25 PM',
    status: 'Pending',
  },
  {
    id: 'doc-7',
    name: 'Passport Size Photo',
    subname: 'Personal',
    category: 'Personal Documents',
    fileType: 'JPG',
    size: '320 KB',
    uploadedOn: 'Apr 16, 2025 10:40 AM',
    status: 'Pending',
  },
  {
    id: 'doc-8',
    name: 'Medical Certificate',
    subname: 'Health',
    category: 'Personal Documents',
    fileType: 'PDF',
    size: '980 KB',
    uploadedOn: 'Apr 18, 2025 07:20 PM',
    status: 'Verified',
  },
];

const CATEGORIES = [
  { name: 'All Documents', count: 12 },
  { name: 'Personal Documents', count: 3 },
  { name: 'Educational Documents', count: 2 },
  { name: 'Experience Certificates', count: 2 },
  { name: 'Identification Documents', count: 2 },
  { name: 'Tax & Financial', count: 2 },
  { name: 'Other Documents', count: 1 },
];

export const DocumentsScreen: React.FC<{ onNavigate?: (screenKey: string) => void }> = () => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const [docs, setDocs] = useState<DocItem[]>(INITIAL_DOCS);
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

  // New Document upload inputs
  const [newDocName, setNewDocName] = useState('');
  const [newDocCat, setNewDocCat] = useState('Personal Documents');

  const filteredDocs = docs.filter((d) => {
    const matchesCat =
      selectedCategory === 'All Documents' || d.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      d.name.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.subname.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const verifiedCount = docs.filter((d) => d.status === 'Verified').length;
  const pendingCount = docs.filter((d) => d.status === 'Pending').length;

  const handleUploadDoc = () => {
    if (!newDocName.trim()) {
      Alert.alert('Validation Error', 'Please enter a document title.');
      return;
    }
    const newDoc: DocItem = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      subname: 'User Upload',
      category: newDocCat,
      fileType: 'PDF',
      size: '1.4 MB',
      uploadedOn: 'Just now',
      status: 'Pending',
    };
    setDocs([newDoc, ...docs]);
    setUploadModalOpen(false);
    setNewDocName('');
    Alert.alert('Upload Successful', `${newDoc.name} uploaded for HR verification.`);
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
            My Documents
          </Text>
          <Text style={styles.screenSubtitle}>
            Access and manage your official documents, certificates and important files in one place.
          </Text>
        </View>
      </View>

      {/* 2. Stat Metric Cards (4 Cards matching Screenshot 5) */}
      <View style={styles.statsGrid}>
        {/* Total Documents */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setSelectedCategory('All Documents')}
          style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}
        >
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Total Documents</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <FileText size={15} color="#2563EB" />
            </View>
          </View>
          <Text style={[styles.statVal, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
            {docs.length + 4}
          </Text>
          <Text style={styles.statLinkText}>View All →</Text>
        </TouchableOpacity>

        {/* Verified Documents */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Verified Documents</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#ECFDF5' }]}>
              <CheckCircle2 size={15} color="#10B981" />
            </View>
          </View>
          <Text style={[styles.statVal, { color: '#10B981' }]}>10</Text>
          <Text style={styles.statLinkText}>View Verified →</Text>
        </View>

        {/* Pending Verification */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Pending Verification</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <Clock size={15} color="#D97706" />
            </View>
          </View>
          <Text style={[styles.statVal, { color: '#D97706' }]}>2</Text>
          <Text style={styles.statLinkText}>View Pending →</Text>
        </View>

        {/* Recent Uploads */}
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' }]}>
          <View style={styles.statHeader}>
            <Text style={styles.statTitle}>Recent Uploads</Text>
            <View style={[styles.statIconWrap, { backgroundColor: '#FFFBEB' }]}>
              <Upload size={15} color="#F59E0B" />
            </View>
          </View>
          <Text style={[styles.statVal, { color: '#2563EB' }]}>3</Text>
          <Text style={styles.statLinkText}>View Uploads →</Text>
        </View>
      </View>

      {/* 3. Category Filter Horizontal Scroll Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.name}
              activeOpacity={0.7}
              onPress={() => setSelectedCategory(cat.name)}
              style={[
                styles.categoryPill,
                { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
                isSelected && styles.categoryPillActive,
              ]}
            >
              <Text
                style={[
                  styles.categoryPillText,
                  { color: isDarkMode ? '#94A3B8' : '#64748B' },
                  isSelected && styles.categoryPillTextActive,
                ]}
              >
                {cat.name} ({cat.count})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 4. Search & Upload Action Bar */}
      <View style={styles.actionBarRow}>
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
            placeholder="Search documents..."
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
          activeOpacity={0.85}
          onPress={() => setUploadModalOpen(true)}
          style={styles.uploadBtn}
        >
          <Upload size={14} color="#FFFFFF" strokeWidth={2.5} style={{ marginRight: 6 }} />
          <Text style={styles.uploadBtnText}>Upload Document</Text>
        </TouchableOpacity>
      </View>

      {/* 5. Documents Cards List */}
      <View style={styles.docList}>
        {filteredDocs.map((item) => {
          const isVerified = item.status === 'Verified';

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => setPreviewDoc(item)}
              style={[
                styles.docCard,
                { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
              ]}
            >
              <View style={styles.docCardTop}>
                <View style={styles.docIconWrap}>
                  <FileText size={18} color="#2563EB" />
                </View>
                <View style={styles.docTitleCol}>
                  <Text style={[styles.docName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {item.name}
                  </Text>
                  <Text style={styles.docSub}>{item.subname}</Text>
                </View>

                {/* Status Badge */}
                <View
                  style={[
                    styles.statusPill,
                    isVerified ? styles.statusPillVerified : styles.statusPillPending,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isVerified ? { color: '#10B981' } : { color: '#D97706' },
                    ]}
                  >
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Meta Row: Category, File Type, Size, Uploaded On */}
              <View style={styles.docMetaRow}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{item.category.replace(' Documents', '')}</Text>
                </View>
                <Text style={styles.docMetaText}>
                  {item.fileType} • {item.size}
                </Text>
                <Text style={styles.docDateText}>{item.uploadedOn}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 6. Quick Actions & Activity Section */}
      <View
        style={[
          styles.activityCard,
          { backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF' },
        ]}
      >
        <Text style={[styles.activitySectionTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
          Recent Activity
        </Text>

        <View style={styles.activityList}>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#3B82F6' }]} />
            <Text style={[styles.activityText, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
              You uploaded <Text style={{ fontWeight: '700' }}>Experience Letter.pdf</Text>
            </Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#10B981' }]} />
            <Text style={[styles.activityText, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
              Document verified: <Text style={{ fontWeight: '700' }}>Aadhaar Card</Text>
            </Text>
          </View>
          <View style={styles.activityItem}>
            <View style={[styles.activityDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={[styles.activityText, { color: isDarkMode ? '#CBD5E1' : '#475569' }]}>
              Document pending: <Text style={{ fontWeight: '700' }}>Bank Account Details</Text>
            </Text>
          </View>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Info size={16} color="#2563EB" style={{ marginRight: 8 }} />
          <Text style={styles.infoBannerText}>
            Keep your documents updated for a smooth HR and payroll verification process.
          </Text>
        </View>
      </View>

      {/* 7. Upload Document Modal */}
      <Modal visible={uploadModalOpen} transparent animationType="slide" onRequestClose={() => setUploadModalOpen(false)}>
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
                  Upload Document
                </Text>
                <Text style={styles.modalSub}>
                  Select category and upload valid scan (PDF, JPG up to 10MB).
                </Text>
              </View>
              <TouchableOpacity onPress={() => setUploadModalOpen(false)} style={styles.closeBtn}>
                <X size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Document Name *</Text>
            <TextInput
              value={newDocName}
              onChangeText={setNewDocName}
              placeholder="e.g. Degree Certificate or Passport"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              value={newDocCat}
              onChangeText={setNewDocCat}
              placeholder="Personal, Educational, Identification, Tax & Financial"
              placeholderTextColor="#94A3B8"
              style={[
                styles.formInput,
                { color: isDarkMode ? '#FFFFFF' : '#0F172A', borderColor: isDarkMode ? '#334155' : '#CBD5E1' },
              ]}
            />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => Alert.alert('File Picker', 'Simulated file picker: Document attached (PDF - 1.4 MB)')}
              style={styles.pickFileBox}
            >
              <Upload size={22} color="#2563EB" style={{ marginBottom: 6 }} />
              <Text style={styles.pickFileTitle}>Tap to choose file from device</Text>
              <Text style={styles.pickFileSub}>Supported: PDF, JPG, PNG (Max 10 MB)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUploadDoc}
              style={styles.modalSubmitBtn}
            >
              <Text style={styles.modalSubmitBtnText}>Upload & Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. Document Preview Modal */}
      <Modal visible={!!previewDoc} transparent animationType="fade" onRequestClose={() => setPreviewDoc(null)}>
        <View style={styles.modalOverlayCenter}>
          <View
            style={[
              styles.previewModalBox,
              { backgroundColor: isDarkMode ? '#0F172A' : '#FFFFFF' },
            ]}
          >
            {previewDoc && (
              <>
                <View style={styles.modalHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                      {previewDoc.name}
                    </Text>
                    <Text style={styles.modalSub}>{previewDoc.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => setPreviewDoc(null)} style={styles.closeBtn}>
                    <X size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={styles.previewFileCard}>
                  <FileText size={36} color="#2563EB" style={{ marginBottom: 8 }} />
                  <Text style={[styles.previewFileName, { color: isDarkMode ? '#FFFFFF' : '#0F172A' }]}>
                    {previewDoc.name}.{previewDoc.fileType.toLowerCase()}
                  </Text>
                  <Text style={styles.previewFileSize}>
                    {previewDoc.fileType} • {previewDoc.size} • Status: {previewDoc.status}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => {
                    Alert.alert('Download Started', `Downloading ${previewDoc.name}.${previewDoc.fileType.toLowerCase()} to device.`);
                    setPreviewDoc(null);
                  }}
                  style={styles.modalSubmitBtn}
                >
                  <Download size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.modalSubmitBtnText}>Download File</Text>
                </TouchableOpacity>
              </>
            )}
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
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  statIconWrap: {
    width: 26,
    height: 26,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statVal: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  statLinkText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  categoryScroll: {
    gap: 8,
    paddingBottom: 4,
    marginBottom: 14,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.7)',
  },
  categoryPillActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryPillText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  actionBarRow: {
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
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    height: 42,
    borderRadius: radii.lg,
  },
  uploadBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12.5,
  },
  docList: {
    gap: 10,
    marginBottom: 18,
  },
  docCard: {
    padding: 14,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
  },
  docCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  docIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  docTitleCol: {
    flex: 1,
  },
  docName: {
    fontSize: 13.5,
    fontWeight: '800',
  },
  docSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 1,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.sm,
  },
  statusPillVerified: {
    backgroundColor: '#ECFDF5',
  },
  statusPillPending: {
    backgroundColor: '#FFFBEB',
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  docMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '700',
  },
  docMetaText: {
    fontSize: 11,
    color: '#64748B',
  },
  docDateText: {
    fontSize: 10.5,
    color: '#94A3B8',
    marginLeft: 'auto',
  },
  activityCard: {
    padding: 16,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.6)',
  },
  activitySectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 12,
  },
  activityList: {
    gap: 10,
    marginBottom: 14,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activityText: {
    fontSize: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: radii.md,
  },
  infoBannerText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    padding: 20,
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '85%',
  },
  previewModalBox: {
    borderRadius: 20,
    padding: 20,
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
  pickFileBox: {
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    borderRadius: radii.lg,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    marginTop: 14,
  },
  pickFileTitle: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  pickFileSub: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    paddingVertical: 13,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  previewFileCard: {
    padding: 24,
    borderRadius: radii.lg,
    backgroundColor: 'rgba(148, 163, 184, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  previewFileName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  previewFileSize: {
    fontSize: 11,
    color: '#64748B',
  },
});
