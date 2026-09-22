import { Employee, Department } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS } from './mockDb';
import { apiClient } from './api';

let localEmployees = [...INITIAL_EMPLOYEES];

export const employeeService = {
  getEmployees: async (): Promise<Employee[]> => {
    const backendData = await apiClient.get<Employee[]>('/employees');
    if (backendData && Array.isArray(backendData)) {
      return backendData;
    }
    return localEmployees;
  },

  getDepartments: async (): Promise<Department[]> => {
    const backendData = await apiClient.get<Department[]>('/departments');
    if (backendData && Array.isArray(backendData)) {
      return backendData;
    }
    return INITIAL_DEPARTMENTS;
  },

  getEmployeeById: async (id: string): Promise<Employee | undefined> => {
    const backendData = await apiClient.get<Employee>(`/employees/${id}`);
    if (backendData) return backendData;
    return localEmployees.find((e) => e.id === id || e.employeeId === id);
  },

  createEmployee: async (data: Partial<Employee>): Promise<Employee> => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      organizationId: 'org-1',
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: data.firstName || 'New',
      lastName: data.lastName || 'Staff',
      fullName: `${data.firstName || 'New'} ${data.lastName || 'Staff'}`,
      email: data.email || 'staff@acmecorp.com',
      phone: data.phone || '+1 (555) 000-0000',
      avatar:
        data.avatar ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: data.department || 'Engineering',
      designation: data.designation || 'Software Engineer',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      employmentType: data.employmentType || 'Full-time',
      workLocation: data.workLocation || 'Hybrid',
      status: 'Active',
    };

    localEmployees = [newEmp, ...localEmployees];
    await apiClient.post('/employees', newEmp);
    return newEmp;
  },

  deleteEmployee: async (id: string): Promise<boolean> => {
    localEmployees = localEmployees.filter((e) => e.id !== id);
    return true;
  },
};
