import { User, UserRole, Organization } from '../types';
import { INITIAL_USERS, INITIAL_ORGANIZATIONS } from './mockDb';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@hrms_current_user';
const ORG_STORAGE_KEY = '@hrms_current_org';

export const authService = {
  getCurrentUser: async (): Promise<User> => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    // Default to HR Admin as primary demo persona
    return INITIAL_USERS.find((u) => u.role === 'hr_admin') || INITIAL_USERS[0];
  },

  setCurrentUser: async (user: User): Promise<void> => {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  },

  getAllDemoUsers: (): User[] => {
    return INITIAL_USERS;
  },

  getAllOrganizations: (): Organization[] => {
    return INITIAL_ORGANIZATIONS;
  },

  switchRole: async (role: UserRole): Promise<User> => {
    const targetUser = INITIAL_USERS.find((u) => u.role === role) || {
      ...INITIAL_USERS[0],
      id: `user-${role}`,
      name: `${role.replace('_', ' ').toUpperCase()} User`,
      email: `${role}@acmecorp.com`,
      role,
    };
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(targetUser));
    return targetUser;
  },

  login: async (email: string, _password?: string): Promise<User> => {
    const cleanEmail = email.trim().toLowerCase();
    const matched = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (matched) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(matched));
      return matched;
    }

    // Role derivation if custom email entered
    let assignedRole: UserRole = 'employee';
    let designation = 'Software Engineer';
    let dept = 'Engineering';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

    if (cleanEmail.includes('hr') || cleanEmail.includes('admin')) {
      assignedRole = 'hr_admin';
      designation = 'HR Director';
      dept = 'Human Resources';
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';
    } else if (cleanEmail.includes('manager') || cleanEmail.includes('lead')) {
      assignedRole = 'manager';
      designation = 'VP of Engineering';
      dept = 'Engineering';
      avatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80';
    } else if (cleanEmail.includes('payroll') || cleanEmail.includes('finance')) {
      assignedRole = 'payroll_admin';
      designation = 'Payroll Manager';
      dept = 'Finance';
      avatar = 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80';
    } else if (cleanEmail.includes('saas') || cleanEmail.includes('owner')) {
      assignedRole = 'saas_owner';
      designation = 'SaaS Platform Owner';
      dept = 'Platform Operations';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
    }

    const namePart = cleanEmail.split('@')[0] || 'User';
    const formattedName = namePart
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formattedName || 'HR User',
      email: cleanEmail,
      role: assignedRole,
      avatar,
      organizationId: 'org-1',
      organizationName: 'Acme Corp',
      departmentName: dept,
      designation,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: async (): Promise<void> => {
    await AsyncStorage.removeItem(USER_STORAGE_KEY);
  },
};
