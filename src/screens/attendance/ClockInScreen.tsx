import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/useAppStore';
import {
  Clock,
  Play,
  Square,
  Coffee,
  MapPin,
  Wifi,
  CheckCircle2,
} from 'lucide-react-native';

interface ClockInScreenProps {
  onNavigate?: (screenKey: string) => void;
}

export const ClockInScreen: React.FC<ClockInScreenProps> = ({ onNavigate }) => {
  const {
    currentUser,
    isDarkMode,
    isClockedIn,
    clockInTime,
    secondsElapsed,
    setClockInState,
  } = useAppStore();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakSeconds, setBreakSeconds] = useState(0);

  // Live Digital Clock updating every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Break Timer
  useEffect(() => {
    let interval: any = null;
    if (isOnBreak) {
      interval = setInterval(() => setBreakSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnBreak]);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleClockIn = () => {
    if (isClockedIn) {
      Alert.alert(
        'Confirm Clock Out',
        'Are you sure you want to end your working session for today?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clock Out',
            style: 'destructive',
            onPress: () => {
              setClockInState(false);
              setIsOnBreak(false);
              Alert.alert('Session Recorded', 'Your working hours have been saved to your timesheet.');
            },
          },
        ]
      );
    } else {
      setClockInState(true, new Date().toISOString());
      Alert.alert('Clocked In', 'Work session started. GPS and Network verified.');
    }
  };

  const handleToggleBreak = () => {
    setIsOnBreak(!isOnBreak);
  };

  // Formatted date string e.g. "TUESDAY, SEPTEMBER 15, 2026"
  const formattedDate = currentTime
    .toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

  // Formatted digital clock e.g. "04:20:09 PM"
  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

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
          Web Attendance Check-In
        </Text>
        <Text
          style={[
            styles.screenSubtitle,
            { color: isDarkMode ? '#94A3B8' : '#64748B' },
          ]}
        >
          Record your daily working hours, break sessions, and shifts.
        </Text>
      </View>

      {/* Main Clock-In Card matching Screenshot */}
      <View
        style={[
          styles.mainCard,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        {/* Date Display */}
        <Text style={styles.dateLabel}>{formattedDate}</Text>

        {/* Big Digital Clock */}
        <Text
          style={[
            styles.bigDigitalClock,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          {timeString}
        </Text>

        {/* Circular Timer / Status Dial */}
        <View
          style={[
            styles.circularDial,
            {
              borderColor: isClockedIn
                ? isOnBreak
                  ? '#F59E0B'
                  : '#10B981'
                : isDarkMode
                ? '#334155'
                : '#E2E8F0',
            },
          ]}
        >
          <View style={styles.dialIconWrap}>
            <Clock
              size={24}
              color={
                isClockedIn
                  ? isOnBreak
                    ? '#F59E0B'
                    : '#10B981'
                  : '#94A3B8'
              }
            />
          </View>
          <Text
            style={[
              styles.dialTimerText,
              { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
            ]}
          >
            {isClockedIn ? formatTimer(secondsElapsed) : '00:00:00'}
          </Text>
          <Text style={styles.dialStatusLabel}>
            {isClockedIn
              ? isOnBreak
                ? 'ON BREAK'
                : 'WORKING - LIVE'
              : 'NOT CHECKED IN'}
          </Text>
        </View>

        {/* Main Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleToggleClockIn}
          style={[
            styles.actionButton,
            {
              backgroundColor: isClockedIn ? '#EF4444' : '#2563EB',
              shadowColor: isClockedIn ? '#EF4444' : '#2563EB',
            },
          ]}
        >
          {isClockedIn ? (
            <Square size={18} color="#FFFFFF" fill="#FFFFFF" />
          ) : (
            <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
          )}
          <Text style={styles.actionButtonText}>
            {isClockedIn ? 'Clock Out Now' : 'Clock In Now'}
          </Text>
        </TouchableOpacity>

        {/* Break Button (Visible when clocked in) */}
        {isClockedIn && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleToggleBreak}
            style={[
              styles.breakButton,
              {
                backgroundColor: isOnBreak
                  ? '#FEF3C7'
                  : isDarkMode
                  ? '#334155'
                  : '#F1F5F9',
                borderColor: isOnBreak ? '#F59E0B' : '#E2E8F0',
              },
            ]}
          >
            <Coffee size={16} color={isOnBreak ? '#D97706' : '#64748B'} />
            <Text
              style={[
                styles.breakButtonText,
                { color: isOnBreak ? '#B45309' : isDarkMode ? '#E2E8F0' : '#475569' },
              ]}
            >
              {isOnBreak
                ? `On Break (${formatTimer(breakSeconds)}) • Tap to Resume`
                : 'Take a Break'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Bottom Verification Info (Location & IP) */}
        <View style={styles.bottomInfoRow}>
          <View style={styles.infoBadge}>
            <MapPin size={14} color="#3B82F6" />
            <Text style={styles.infoBadgeText}>San Francisco HQ</Text>
          </View>
          <View style={styles.infoBadge}>
            <Wifi size={14} color="#10B981" />
            <Text style={styles.infoBadgeText}>192.168.1.104</Text>
          </View>
        </View>
      </View>

      {/* Today's Shift Rota Card matching Screenshot */}
      <View
        style={[
          styles.sideCard,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <Text
          style={[
            styles.sideCardTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Today's Shift Rota
        </Text>

        <View style={styles.rotaList}>
          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Shift Name</Text>
            <Text
              style={[
                styles.rotaVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              General Shift
            </Text>
          </View>

          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Timing</Text>
            <Text
              style={[
                styles.rotaVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              09:00 AM - 06:00 PM
            </Text>
          </View>

          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Break Allowance</Text>
            <Text
              style={[
                styles.rotaVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              60 mins
            </Text>
          </View>

          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Grace Time</Text>
            <Text
              style={[
                styles.rotaVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              15 mins
            </Text>
          </View>
        </View>
      </View>

      {/* Today's Summary Card matching Screenshot */}
      <View
        style={[
          styles.sideCard,
          {
            backgroundColor: isDarkMode ? '#1E293B' : '#FFFFFF',
            borderColor: isDarkMode ? '#334155' : '#F1F5F9',
          },
        ]}
      >
        <Text
          style={[
            styles.sideCardTitle,
            { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
          ]}
        >
          Today's Summary
        </Text>

        <View style={styles.rotaList}>
          {/* Check-In Time */}
          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Check-In Time</Text>
            <Text
              style={[
                styles.rotaVal,
                { color: isDarkMode ? '#F8FAFC' : '#0F172A' },
              ]}
            >
              {isClockedIn && clockInTime
                ? new Date(clockInTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '--:--'}
            </Text>
          </View>

          {/* Break Logged */}
          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Break Logged</Text>
            <Text style={styles.breakLoggedVal}>{formatTimer(breakSeconds)}</Text>
          </View>

          {/* Attendance Status */}
          <View style={styles.rotaRow}>
            <Text style={styles.rotaLabel}>Attendance Status</Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isClockedIn ? '#DCFCE7' : '#F1F5F9',
                },
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  {
                    color: isClockedIn ? '#166534' : '#64748B',
                  },
                ]}
              >
                {isClockedIn ? '• Present' : '• Pending'}
              </Text>
            </View>
          </View>
        </View>
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
    marginBottom: 20,
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
  mainCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#94A3B8',
    marginBottom: 8,
  },
  bigDigitalClock: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 20,
  },
  circularDial: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dialIconWrap: {
    marginBottom: 4,
  },
  dialTimerText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  dialStatusLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#94A3B8',
  },
  actionButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  breakButton: {
    width: '100%',
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 14,
  },
  breakButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  bottomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginTop: 8,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoBadgeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  sideCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  sideCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 14,
  },
  rotaList: {
    gap: 12,
  },
  rotaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rotaLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  rotaVal: {
    fontSize: 13,
    fontWeight: '700',
  },
  breakLoggedVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
