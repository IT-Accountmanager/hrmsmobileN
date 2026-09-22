import { AttendanceRecord } from '../types';
import { apiClient } from './api';

const MOCK_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id: 'att-1',
    organizationId: 'org-1',
    employeeId: 'emp-1',
    employeeName: 'Sarah Wilson',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Design & Engineering',
    date: '2024-05-20',
    clockIn: '09:15 AM',
    clockOut: '05:45 PM',
    workingHours: 8.5,
    breakHours: 1.0,
    overtimeHours: 0.5,
    status: 'Present',
  },
  {
    id: 'att-2',
    organizationId: 'org-1',
    employeeId: 'emp-1',
    employeeName: 'Sarah Wilson',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Design & Engineering',
    date: '2024-05-19',
    clockIn: '09:10 AM',
    clockOut: '06:00 PM',
    workingHours: 8.8,
    breakHours: 1.0,
    overtimeHours: 0.8,
    status: 'Present',
  },
  {
    id: 'att-3',
    organizationId: 'org-1',
    employeeId: 'emp-1',
    employeeName: 'Sarah Wilson',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Design & Engineering',
    date: '2024-05-18',
    clockIn: '09:42 AM',
    clockOut: '06:15 PM',
    workingHours: 8.5,
    breakHours: 1.0,
    overtimeHours: 0.0,
    status: 'Late',
  },
  {
    id: 'att-4',
    organizationId: 'org-1',
    employeeId: 'emp-1',
    employeeName: 'Sarah Wilson',
    employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Design & Engineering',
    date: '2024-05-17',
    clockIn: '09:05 AM',
    clockOut: '05:30 PM',
    workingHours: 8.4,
    breakHours: 1.0,
    overtimeHours: 0.0,
    status: 'Present',
  },
];

export const attendanceService = {
  getDailyLogs: async (date?: string): Promise<AttendanceRecord[]> => {
    const backendData = await apiClient.get<AttendanceRecord[]>(`/attendance/daily?date=${date || '2024-05-20'}`);
    if (backendData && Array.isArray(backendData)) {
      return backendData;
    }
    return MOCK_ATTENDANCE_LOGS;
  },

  clockIn: async (employeeId: string, employeeName: string, avatar: string, department: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);

    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}`,
      organizationId: 'org-1',
      employeeId,
      employeeName,
      employeeAvatar: avatar,
      department,
      date: now.toISOString().split('T')[0],
      clockIn: timeStr,
      clockOut: '--:--',
      workingHours: 0,
      breakHours: 0,
      overtimeHours: 0,
      status: isLate ? 'Late' : 'Present',
    };

    // Attempt backend sync
    await apiClient.post('/attendance/check-in', { employeeId });
    return newRecord;
  },

  clockOut: async (employeeId: string) => {
    await apiClient.post('/attendance/check-out', { employeeId });
    return true;
  },
};
