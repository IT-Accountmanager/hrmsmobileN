import { PayrollRecord } from '../types';
import { INITIAL_PAYSLIPS } from './mockDb';
import { apiClient } from './api';

let localPayslips = [...INITIAL_PAYSLIPS];

export const payrollService = {
  getPayslips: async (): Promise<PayrollRecord[]> => {
    const backendData = await apiClient.get<PayrollRecord[]>('/payroll');
    if (backendData && Array.isArray(backendData)) {
      return backendData;
    }
    return localPayslips;
  },

  generatePayslip: async (data: Partial<PayrollRecord>): Promise<PayrollRecord> => {
    const basic = data.basicSalary || 5000;
    const hra = basic * 0.25;
    const allowances = basic * 0.25;
    const gross = basic + hra + allowances;
    const pf = basic * 0.12;
    const tax = 600;
    const insurance = 150;
    const totalDeductions = pf + tax + insurance;
    const net = gross - totalDeductions;

    const newRecord: PayrollRecord = {
      id: `ps-${Date.now()}`,
      organizationId: 'org-1',
      employeeId: data.employeeId || 'emp-1',
      employeeCode: data.employeeCode || 'EMP-0412',
      employeeName: data.employeeName || 'Sarah Wilson',
      employeeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: data.department || 'Design',
      designation: data.designation || 'Senior Product Designer',
      month: data.month || 'June 2024',
      basicSalary: basic,
      hra,
      allowances,
      bonus: 0,
      grossSalary: gross,
      providentFund: pf,
      taxDeduction: tax,
      insuranceDeduction: insurance,
      totalDeductions,
      netSalary: net,
      paymentMethod: 'Direct Deposit',
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Paid',
    };

    localPayslips = [newRecord, ...localPayslips];
    return newRecord;
  },
};
