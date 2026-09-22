import { create } from 'zustand';
import { User, UserRole, Organization, NotificationItem } from '../types';
import { authService } from '../services/authService';
import { INITIAL_NOTIFICATIONS, INITIAL_ORGANIZATIONS, INITIAL_USERS } from '../services/mockDb';

interface AppState {
  // Auth & Role
  currentUser: User;
  currentRole: UserRole;
  currentOrg: Organization;
  allOrgs: Organization[];
  allDemoUsers: User[];
  isAuthenticated: boolean;

  // UI State
  isDarkMode: boolean;
  drawerOpen: boolean;
  roleModalOpen: boolean;
  notificationsModalOpen: boolean;
  notifications: NotificationItem[];

  // Live Attendance & Timer
  isClockedIn: boolean;
  clockInTime: string | null;
  secondsElapsed: number;

  // Actions
  initialize: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  switchOrg: (orgId: string) => void;
  toggleDarkMode: () => void;
  setDrawerOpen: (open: boolean) => void;
  setRoleModalOpen: (open: boolean) => void;
  setNotificationsModalOpen: (open: boolean) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setClockInState: (active: boolean, time?: string) => void;
  tickClockTimer: () => void;
  loginUser: (email: string) => Promise<User>;
  logout: () => Promise<void>;
}

const defaultUser = INITIAL_USERS.find((u) => u.role === 'hr_admin') || INITIAL_USERS[0];
const defaultOrg = INITIAL_ORGANIZATIONS[0];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: defaultUser,
  currentRole: defaultUser.role,
  currentOrg: defaultOrg,
  allOrgs: INITIAL_ORGANIZATIONS,
  allDemoUsers: INITIAL_USERS,
  isAuthenticated: true,

  isDarkMode: false,
  drawerOpen: false,
  roleModalOpen: false,
  notificationsModalOpen: false,
  notifications: INITIAL_NOTIFICATIONS,

  isClockedIn: false,
  clockInTime: null,
  secondsElapsed: 0,

  initialize: async () => {
    const user = await authService.getCurrentUser();
    set({
      currentUser: user,
      currentRole: user.role,
      isAuthenticated: true,
    });
  },

  switchRole: async (role: UserRole) => {
    const updated = await authService.switchRole(role);
    set({
      currentUser: updated,
      currentRole: role,
      roleModalOpen: false,
      drawerOpen: false,
    });
  },

  switchOrg: (orgId: string) => {
    const target = get().allOrgs.find((o) => o.id === orgId) || get().allOrgs[0];
    set({ currentOrg: target });
  },

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),

  setDrawerOpen: (open) => set({ drawerOpen: open }),
  setRoleModalOpen: (open) => set({ roleModalOpen: open }),
  setNotificationsModalOpen: (open) => set({ notificationsModalOpen: open }),

  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  setClockInState: (active, time) =>
    set({
      isClockedIn: active,
      clockInTime: time || (active ? new Date().toISOString() : null),
      secondsElapsed: active ? 0 : 0,
    }),

  tickClockTimer: () => {
    const { isClockedIn, clockInTime } = get();
    if (isClockedIn && clockInTime) {
      const start = new Date(clockInTime).getTime();
      const now = Date.now();
      set({ secondsElapsed: Math.max(0, Math.floor((now - start) / 1000)) });
    }
  },

  loginUser: async (email: string) => {
    const user = await authService.login(email);
    set({
      currentUser: user,
      currentRole: user.role,
      isAuthenticated: true,
    });
    return user;
  },

  logout: async () => {
    await authService.logout();
    set({
      isAuthenticated: false,
      drawerOpen: false,
    });
  },
}));
