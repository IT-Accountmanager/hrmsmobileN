import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ModalSheet } from '../ui/ModalSheet';
import { useAppStore } from '../../store/useAppStore';
import { getThemeColors, radii, typography, colors } from '../../theme';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react-native';

export const NotificationsModal: React.FC = () => {
  const {
    notificationsModalOpen,
    setNotificationsModalOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    isDarkMode,
  } = useAppStore();

  const theme = getThemeColors(isDarkMode);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={16} color={colors.success[500]} />;
      case 'warning':
        return <AlertTriangle size={16} color={colors.warning[500]} />;
      case 'error':
        return <AlertCircle size={16} color={colors.danger[500]} />;
      case 'info':
      default:
        return <Info size={16} color={colors.accentBlue} />;
    }
  };

  return (
    <ModalSheet
      visible={notificationsModalOpen}
      onClose={() => setNotificationsModalOpen(false)}
      title="Notifications"
      subtitle={`${notifications.filter((n) => !n.isRead).length} unread updates`}
    >
      <View style={styles.container}>
        {notifications.length > 0 ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={markAllNotificationsRead}
            style={styles.markAllBtn}
          >
            <CheckCheck size={14} color={colors.accentBlue} />
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        ) : null}

        {notifications.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.7}
            onPress={() => markNotificationRead(item.id)}
            style={[
              styles.itemCard,
              {
                backgroundColor: !item.isRead
                  ? isDarkMode
                    ? 'rgba(37, 99, 235, 0.12)'
                    : '#EFF6FF'
                  : isDarkMode
                  ? '#1E293B'
                  : '#F8FAFC',
                borderColor: !item.isRead
                  ? colors.primary[300]
                  : theme.borderSubtle,
              },
            ]}
          >
            <View style={styles.iconCol}>{getIcon(item.type)}</View>
            <View style={styles.contentCol}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: theme.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.timestamp, { color: theme.muted }]}>
                  {item.timestamp}
                </Text>
              </View>
              <Text style={[styles.message, { color: theme.subtext }]}>
                {item.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  markAllText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
    color: colors.accentBlue,
    marginLeft: 4,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: radii.xl,
    borderWidth: 1,
    marginBottom: 8,
  },
  iconCol: {
    marginTop: 2,
    marginRight: 10,
  },
  contentCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: typography.sizes.xs + 0.5,
    fontWeight: typography.weights.bold,
    flex: 1,
    paddingRight: 6,
  },
  timestamp: {
    fontSize: 9.5,
  },
  message: {
    fontSize: 11,
    lineHeight: 15,
  },
});
