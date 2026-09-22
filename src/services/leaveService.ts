import { LeaveRequest } from '../types';
import { INITIAL_LEAVE_RECORDS } from './mockDb';
import { apiClient } from './api';

let localLeaves = [...INITIAL_LEAVE_RECORDS];

export const leaveService = {
  getLeaves: async (): Promise<LeaveRequest[]> => {
    const backendData = await apiClient.get<LeaveRequest[]>('/leaves');
    if (backendData && Array.isArray(backendData)) {
      return backendData;
    }
    return localLeaves;
  },

  applyLeave: async (data: {
    type: string;
    startDate: string;
    endDate: string;
    days?: number;
    reason: string;
    employeeName?: string;
  }): Promise<LeaveRequest> => {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      organizationId: 'org-1',
      employeeId: 'emp-1',
      employeeCode: 'EMP-0412',
      employeeName: data.employeeName || 'Sarah Wilson',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Design',
      leaveType: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      days: data.days || 1,
      reason: data.reason,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    localLeaves = [newReq, ...localLeaves];
    await apiClient.post('/leaves', newReq);
    return newReq;
  },

  updateLeaveStatus: async (id: string, status: 'Approved' | 'Rejected'): Promise<boolean> => {
    localLeaves = localLeaves.map((l) => (l.id === id ? { ...l, status } : l));
    return true;
  },
};
