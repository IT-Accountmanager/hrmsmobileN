import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { ModalSheet } from './ModalSheet';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';
import { ChevronDown, Check } from 'lucide-react-native';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectPickerProps {
  label?: string;
  value: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

export const SelectPicker: React.FC<SelectPickerProps> = ({
  label,
  value,
  options,
  onSelect,
  placeholder = 'Select option...',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <View style={styles.container}>
      {label ? (
        <Text style={[styles.label, { color: isDarkMode ? '#CBD5E1' : '#334155' }]}>
          {label}
        </Text>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalOpen(true)}
        style={[
          styles.button,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#F8FAFC',
            borderColor: theme.border,
          },
        ]}
      >
        <Text
          style={[
            styles.valueText,
            { color: selectedOption ? theme.text : theme.muted },
          ]}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={16} color={theme.subtext} />
      </TouchableOpacity>

      <ModalSheet
        visible={modalOpen}
        onClose={() => setModalOpen(false)}
        title={label || 'Select Option'}
      >
        <View style={styles.optionsList}>
          {options.map((item) => {
            const isSelected = item.value === value;
            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(item.value);
                  setModalOpen(false);
                }}
                style={[
                  styles.optionItem,
                  {
                    backgroundColor: isSelected
                      ? isDarkMode
                        ? 'rgba(37, 99, 235, 0.18)'
                        : '#EFF6FF'
                      : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color: isSelected ? colors.primary[600] : theme.text,
                      fontWeight: isSelected
                        ? typography.weights.bold
                        : typography.weights.medium,
                    },
                  ]}
                >
                  {item.label}
                </Text>
                {isSelected ? <Check size={16} color={colors.primary[600]} /> : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </ModalSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    marginBottom: 5,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
    borderRadius: radii.lg,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  valueText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  optionsList: {
    paddingBottom: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.md,
    marginBottom: 4,
  },
  optionText: {
    fontSize: typography.sizes.sm,
  },
});
