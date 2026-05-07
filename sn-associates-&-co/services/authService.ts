import { User } from '../types';
import { supabase } from './supabase';
import { APIClient } from './apiClient';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

let cachedUser: User | null = null;

export const authService = {
  initializeAuth: async () => {
     cachedUser = await authService.getCurrentUserSecure();
  },
  getCurrentUser: (): User | null => cachedUser,
  getCurrentUserSync: (): User | null => cachedUser,
  setCachedUser: (user: User | null) => {
     if (user) {
       user.purchasedCourses = user.purchasedCourses || [];
       user.name = user.name || 'User';
       user.joinedAt = user.joinedAt || new Date().toISOString();
       user.storageUsed = user.storageUsed || 0;
     }
     cachedUser = user;
     window.dispatchEvent(new Event('storage'));
  },
  
  register: async (name: string, email: string, password: string, phone?: string): Promise<AuthResponse> => {
    try {
      const data = await APIClient.post<any>('/api/auth/register', { name, email, password, phone });
      return {
        success: true,
        message: data.message || 'Registration successful!'
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Registration failed.' };
    }
  },

  login: async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    try {
      const data = await APIClient.post<any>('/api/auth/login', { email, password, rememberMe });
      authService.setCachedUser(data.user);

      return {
        success: true,
        user: data.user,
        message: data.user?.role === 'admin' ? 'Admin Access Granted.' : 'Login Successful.'
      };
    } catch (err: any) {
      console.error("Login failed:", err);
      return { success: false, message: err.message || "Authentication failed." };
    }
  },

  getCurrentUserSecure: async (): Promise<User | null> => {
    try {
      if (!document.cookie.includes('auth_status=logged_in')) {
        return null;
      }

      const data = await APIClient.get<any>('/api/auth/me');
      return data.user;
    } catch (err: any) {
      if (err.data?.needsRefresh) {
        const refreshed = await authService.silentRefresh();
        if (refreshed) {
           return await authService.getCurrentUserSecure();
        }
      }
      return null;
    }
  },

  silentRefresh: async (): Promise<boolean> => {
    try {
      await APIClient.post('/api/auth/refresh');
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    try {
      await APIClient.post('/api/auth/logout');
    } catch (e) { console.error("Logout network fail", e); }
    
    authService.setCachedUser(null);
  },

  resetPassword: async (email: string): Promise<AuthResponse> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Recovery link sent.' };
  }
};
