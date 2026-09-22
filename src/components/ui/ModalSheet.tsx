import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography } from '../../theme';
import { X } from 'lucide-react-native';

const { height } = Dimensions.get('window');

interface ModalSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxHeight?: number;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = height * 0.85,
}) => {
  const { isDarkMode } = useAppStore();
  const theme = getThemeColors(isDarkMode);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                  maxHeight,
                },
              ]}
            >
              {/* Top Drag Indicator */}
              <View style={styles.indicatorContainer}>
                <View
                  style={[
                    styles.dragIndicator,
                    { backgroundColor: isDarkMode ? '#334155' : '#E2E8F0' },
                  ]}
                />
              </View>

              {/* Header */}
              {title ? (
                <View style={[styles.header, { borderBottomColor: theme.borderSubtle }]}>
                  <View style={styles.headerTitles}>
                    <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
                    {subtitle ? (
                      <Text style={[styles.subtitle, { color: theme.subtext }]}>
                        {subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <TouchableOpacity
                    onPress={onClose}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    style={[
                      styles.closeBtn,
                      { backgroundColor: isDarkMode ? '#1E293B' : '#F1F5F9' },
                    ]}
                  >
                    <X size={16} color={theme.subtext} />
                  </TouchableOpacity>
                </View>
              ) : null}

              {/* Body */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.body}
              >
                {children}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radii['2xl'],
    borderTopRightRadius: radii['2xl'],
    borderWidth: 1,
    borderBottomWidth: 0,
    width: '100%',
    paddingBottom: 24,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 6,
  },
  dragIndicator: {
    width: 36,
    height: 4,
    borderRadius: radii.full,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitles: {
    flex: 1,
    paddingRight: 10,
  },
  title: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
  },
});
