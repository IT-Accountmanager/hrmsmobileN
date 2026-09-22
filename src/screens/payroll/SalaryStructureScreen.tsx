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
  Plus,
  Edit2,
  X,
  Check,
  Percent,
  Sliders,
  Shield,
  Layers,
} from 'lucide-react-native';

interface SalaryStructureScreenProps {
  onNavigate?: (screenKey: string) => void;
}

interface CompensationBand {
  id: string;
  name: string;
  levels: string;
  badge: 'Active Schema' | 'Draft';
  basicPayShare: string;
  hraAllowance: string;
  specialAllowances: string;
  pfContribution: string;
}

const INITIAL_BANDS: CompensationBand[] = [
  {
    id: 'band-1',
    name: 'Executive / Leadership Band',
    levels: 'L6 - L7',
    badge: 'Active Schema',
    basicPayShare: '60%',
    hraAllowance: '25%',
    specialAllowances: '15%',
    pfContribution: '12%',
  },
  {
    id: 'band-2',
    name: 'Senior Engineering & Product Band',
    levels: 'L4 - L5',
    badge: 'Active Schema',
    basicPayShare: '55%',
    hraAllowance: '25%',
    specialAllowances: '20%',
    pfContribution: '12%',
  },
  {
    id: 'band-3',
    name: 'Mid-Level & Associate Band',
    levels: 'L2 - L3',
    badge: 'Active Schema',
    basicPayShare: '50%',
    hraAllowance: '25%',
    specialAllowances: '25%',
    pfContribution: '12%',
  },
  {
    id: 'band-4',
    name: 'Internship / Trainee Band',
    levels: 'L1',
    badge: 'Active Schema',
    basicPayShare: '100% Fixed Stipend',
    hraAllowance: '0%',
    specialAllowances: '0%',
    pfContribution: '0%',
  },
];

export const SalaryStructureScreen: React.FC<SalaryStructureScreenProps> = ({
  onNavigate,
}) => {
  const { isDarkMode } = useAppStore();

  const [bands, setBands] = useState<CompensationBand[]>(INITIAL_BANDS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBand, setEditingBand] = useState<CompensationBand | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formLevels, setFormLevels] = useState('L3 - L4');
  const [formBasic, setFormBasic] = useState('50%');
  const [formHra, setFormHra] = useState('25%');
  const [formSpecial, setFormSpecial] = useState('25%');
  const [formPf, setFormPf] = useState('12%');

  const openEditModal = (band: CompensationBand) => {
    setEditingBand(band);
    setFormName(band.name);
    setFormLevels(band.levels);
    setFormBasic(band.basicPayShare);
    setFormHra(band.hraAllowance);
    setFormSpecial(band.specialAllowances);
    setFormPf(band.pfContribution);
    setModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingBand(null);
    setFormName('');
    setFormLevels('L2 - L3');
    setFormBasic('50%');
    setFormHra('25%');
    setFormSpecial('25%');
    setFormPf('12%');
    setModalOpen(true);
  };

  const handleSaveBand = () => {
    if (!formName.trim()) {
      Alert.alert('Required', 'Please enter a compensation band name.');
      return;
    }

    if (editingBand) {
      setBands((prev) =>
        prev.map((b) =>
          b.id === editingBand.id
            ? {
                ...b,
                name: formName.trim(),
                levels: formLevels.trim(),
                basicPayShare: formBasic.trim(),
                hraAllowance: formHra.trim(),
                specialAllowances: formSpecial.trim(),
                pfContribution: formPf.trim(),
              }
            : b
        )
      );
      Alert.alert('Band Updated', `Compensation schema for "${formName}" updated.`);
    } else {
      const newBand: CompensationBand = {
        id: `band-${Date.now()}`,
        name: formName.trim(),
        levels: formLevels.trim(),
        badge: 'Active Schema',
        basicPayShare: formBasic.trim(),
        hraAllowance: formHra.trim(),
        specialAllowances: formSpecial.trim(),
        pfContribution: formPf.trim(),
      };
      setBands([...bands, newBand]);
      Alert.alert('Band Created', `Compensation band "${newBand.name}" added to payroll schema.`);
    }

    setModalOpen(false);
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
      <View style={styles.header}>
        <View style={styles.headerTitleGroup}>
          <Text
            style={[
              styles.screenTitle,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            Salary Structure & Compensation Bands
          </Text>
          <Text
            style={[
              styles.screenSubtitle,
              { color: isDarkMode ? '#94A3B8' : '#64748B' },
            ]}
          >
            Configure automated gross salary breakdown percentages, HRA, and provident fund schemas.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openCreateModal}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.createBtnText}>Create Compensation Band</Text>
        </TouchableOpacity>
      </View>

      {/* 4 Compensation Band Cards matching Screenshot 3 */}
      <View style={styles.bandsGrid}>
        {bands.map((band) => (
          <View
            key={band.id}
            style={[
              styles.bandCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#F1F5F9',
              },
            ]}
          >
            {/* Card Header: Band Name, Level & Active Schema Badge */}
            <View style={styles.bandHeader}>
              <Text
                style={[
                  styles.bandTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {band.name} ({band.levels})
              </Text>
              <View style={styles.schemaBadge}>
                <Text style={styles.schemaBadgeText}>{band.badge}</Text>
              </View>
            </View>

            {/* Percentage Component Breakdown */}
            <View style={styles.breakdownList}>
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Basic Pay Share:</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {band.basicPayShare}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>HRA Allowance:</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {band.hraAllowance}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Special Allowances:</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {band.specialAllowances}
                </Text>
              </View>

              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Statutory PF Contribution:</Text>
                <Text
                  style={[
                    styles.breakdownVal,
                    { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                  ]}
                >
                  {band.pfContribution}
                </Text>
              </View>
            </View>

            {/* Modify Band Config Button matching Screenshot 3 */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => openEditModal(band)}
              style={[
                styles.modifyBtn,
                {
                  backgroundColor: isDarkMode ? '#0F172A' : '#F8FAFC',
                  borderColor: isDarkMode ? '#334155' : '#E2E8F0',
                },
              ]}
            >
              <Edit2 size={13} color="#64748B" />
              <Text
                style={[
                  styles.modifyBtnText,
                  { color: isDarkMode ? '#E2E8F0' : '#475569' },
                ]}
              >
                Modify Band Config
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Modal to Create / Modify Compensation Band */}
      <Modal
        visible={modalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
                borderColor: isDarkMode ? '#334155' : '#E2E8F0',
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[
                  styles.modalTitle,
                  { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
                ]}
              >
                {editingBand ? 'Modify Compensation Band' : 'Create Compensation Band'}
              </Text>
              <TouchableOpacity onPress={() => setModalOpen(false)}>
                <X size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Band Name</Text>
              <TextInput
                value={formName}
                onChangeText={setFormName}
                placeholder="e.g. Executive Staff Band"
                placeholderTextColor="#94A3B8"
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

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>Levels Band</Text>
                <TextInput
                  value={formLevels}
                  onChangeText={setFormLevels}
                  placeholder="e.g. L4 - L5"
                  placeholderTextColor="#94A3B8"
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
                <Text style={styles.formLabel}>Basic Pay %</Text>
                <TextInput
                  value={formBasic}
                  onChangeText={setFormBasic}
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

            <View style={styles.formRow}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.formLabel}>HRA Allowance %</Text>
                <TextInput
                  value={formHra}
                  onChangeText={setFormHra}
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
                <Text style={styles.formLabel}>Special Allowance %</Text>
                <TextInput
                  value={formSpecial}
                  onChangeText={setFormSpecial}
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
              <Text style={styles.formLabel}>Statutory PF Contribution %</Text>
              <TextInput
                value={formPf}
                onChangeText={setFormPf}
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

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                onPress={() => setModalOpen(false)}
                style={[
                  styles.cancelBtn,
                  { backgroundColor: isDarkMode ? '#334155' : '#F1F5F9' },
                ]}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveBand}
                style={styles.submitBtn}
              >
                <Text style={styles.submitBtnText}>Save Schema</Text>
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
  header: {
    marginBottom: 16,
    gap: 12,
  },
  headerTitleGroup: {
    gap: 4,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
  },
  screenSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
    alignSelf: 'flex-start',
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  bandsGrid: {
    gap: 14,
  },
  bandCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  bandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    flexWrap: 'wrap',
    gap: 8,
  },
  bandTitle: {
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
  },
  schemaBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  schemaBadgeText: {
    color: '#2563EB',
    fontSize: 11,
    fontWeight: '700',
  },
  breakdownList: {
    gap: 10,
    marginBottom: 14,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  modifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 8,
    borderWidth: 1,
  },
  modifyBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  formGroup: {
    marginBottom: 12,
  },
  formRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  formInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  submitBtn: {
    flex: 1.5,
    height: 40,
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
