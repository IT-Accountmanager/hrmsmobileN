export type UserRole =
  | 'saas_owner'
  | 'org_owner'
  | 'org_admin'
  | 'hr_admin'
  | 'hr_executive'
  | 'recruiter'
  | 'payroll_admin'
  | 'manager'
  | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organizationId: string;
  organizationName: string;
  departmentId?: string;
  departmentName?: string;
  designation?: string;
  employeeId?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string;
  plan: 'Basic' | 'Pro' | 'Business' | 'Enterprise';
  status: 'active' | 'trial' | 'inactive' | 'suspended';
  industry: string;
  totalEmployees: number;
  maxEmployees: number;
  contactEmail: string;
  contactPhone: string;
  location: string;
  website: string;
  createdAt: string;
  billingCycle: 'monthly' | 'annual';
  monthlyFee: number;
}

export interface Department {
  id: string;
  organizationId: string;
  name: string;
  code: string;
  headOfDepartmentId?: string;
  headName?: string;
  employeeCount: number;
  color: string;
}

export interface Designation {
  id: string;
  organizationId: string;
  title: string;
  departmentId: string;
  departmentName: string;
  level: string;
  employeeCount: number;
}

export interface Employee {
  id: string;
  organizationId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  personalEmail?: string;
  phone: string;
  avatar: string;
  department: string;
  departmentId?: string;
  designation: string;
  designationId?: string;
  managerId?: string;
  managerName?: string;
  joiningDate: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Single' | 'Married' | 'Divorced';
  bloodGroup?: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  workLocation: 'On-site' | 'Remote' | 'Hybrid';
  officeLocation?: string;
  status: 'Active' | 'On Leave' | 'Terminated' | 'Probation';
  salary?: {
    basic: number;
    hra: number;
    allowances: number;
    gross: number;
    deductions: {
      providentFund: number;
      professionalTax: number;
      incomeTax: number;
      insurance: number;
    };
    net: number;
  };
}

export interface AttendanceRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  date: string; // YYYY-MM-DD
  clockIn: string;
  clockOut: string;
  workingHours: number;
  breakHours: number;
  overtimeHours: number;
  status: 'Present' | 'Absent' | 'Late' | 'Half Day' | 'On Leave' | 'Work From Home' | 'Holiday';
  ipAddress?: string;
  location?: string;
  notes?: string;
}

export interface ShiftSchedule {
  id: string;
  organizationId: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDurationMinutes: number;
  graceTimeMinutes: number;
  color: string;
}

export interface LeaveBalance {
  employeeId: string;
  annual: { total: number; used: number; remaining: number };
  casual: { total: number; used: number; remaining: number };
  sick: { total: number; used: number; remaining: number };
  maternityPaternity: { total: number; used: number; remaining: number };
}

export interface LeaveRequest {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: 'Annual' | 'Casual' | 'Sick' | 'Maternity' | 'Paternity' | 'Unpaid' | string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: string;
  approverName?: string;
}

export interface Holiday {
  id: string;
  organizationId: string;
  name: string;
  date: string;
  day: string;
  type: 'Public' | 'Optional' | 'Company';
}

export interface PayrollRecord {
  id: string;
  organizationId: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  bonus: number;
  grossSalary: number;
  providentFund: number;
  taxDeduction: number;
  insuranceDeduction: number;
  totalDeductions: number;
  netSalary: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'Paid' | 'Processing' | 'Pending' | 'Draft';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface TaskItem {
  id: number;
  text: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  subtitle: string;
  content?: string;
  time: string;
  category?: string;
  author?: string;
}

export interface ExpenseClaim {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  receiptUrl?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  size: string;
  updatedAt: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  serialNumber: string;
  assignedDate: string;
  status: 'Active' | 'Under Repair' | 'Returned';
}
