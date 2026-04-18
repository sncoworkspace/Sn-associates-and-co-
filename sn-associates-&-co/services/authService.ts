import { User } from '../types';
import { supabase } from './supabase';

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
}

const API_BASE = '/api/auth';
let cachedUser: User | null = null; // In-memory JS store for current session. Eliminates XSS vectors.

export const authService = {
  initializeAuth: async () => {
     cachedUser = await authService.getCurrentUserSecure();
  },
  getCurrentUser: (): User | null => cachedUser,
  getCurrentUserSync: (): User | null => cachedUser,
  setCachedUser: (user: User | null) => {
     if (user) {
       // Ensure all required properties exist to prevent frontend crashes
       user.purchasedCourses = user.purchasedCourses || [];
       user.name = user.name || 'User';
       user.joinedAt = user.joinedAt || new Date().toISOString();
       user.storageUsed = user.storageUsed || 0;
     }
     cachedUser = user;
     // Fire the legacy storage event so old components auto-update natively without deep refactors
     window.dispatchEvent(new Event('storage'));
  },
  /**
   * Registration remains via Supabase directly for simplicity unless moved to Node.js backend.
   * If they sign up here, they must still trigger login() right after to gain the HttpOnly Cookie.
   */
  register: async (name: string, email: string, password: string, phone?: string): Promise<AuthResponse> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone, role: 'user' } }
    });

    if (error) return { success: false, message: error.message };

    return {
      success: true,
      message: 'Registration successful! Please login.'
    };
  },

  /**
   * Login now heavily protected. It pipes coordinates purely to the Node.js server.
   * The Node.js server retrieves the JWT tokens and returns them as `HttpOnly` Cookies.
   */
  login: async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Mandates cookies are saved correctly in browser
        body: JSON.stringify({ email, password, rememberMe })
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, message: data.error || 'Authentication failed.' };
      }

      // We do NOT store users in localStorage anymore. 
      // Update memory cache and trigger re-renders natively.
      authService.setCachedUser(data.user);

      return {
        success: true,
        user: data.user,
        message: data.user?.role === 'admin' ? 'Admin Access Granted.' : 'Login Successful.'
      };
    } catch (err) {
      console.error("Login block failed:", err);
      return { success: false, message: "Network error reaching secure Auth gateway." };
    }
  },

  /**
   * Polls the Node.js endpoint strictly to test and fetch the `HttpOnly` session.
   * Replaces `getCurrentUser` from parsing unsafe `localStorage`.
   */
  getCurrentUserSecure: async (): Promise<User | null> => {
    try {
      // Fast bypass: if public `auth_status` cookie is missing, don't even bother hitting the server
      if (!document.cookie.includes('auth_status=logged_in')) {
        return null;
      }

      const response = await fetch(`${API_BASE}/me`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include' // Mandates browser passes the strict HttpOnly cookie
      });

      const data = await response.json();

      if (!response.ok) {
        // If token expired, /me instructs us to attempt a silent refresh
        if (data.needsRefresh) {
          const refreshed = await authService.silentRefresh();
          if (refreshed) {
             // Second attempt purely internal caching
             return await authService.getCurrentUserSecure();
          }
        }
        return null;
      }

      return data.user;
    } catch {
      return null;
    }
  },

  /**
   * Rotates a stale access_token using the long-term refresh_token cookie
   */
  silentRefresh: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  /**
   * Instructs the Node.js server to systematically destroy the HttpOnly cookies.
   */
  logout: async () => {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) { console.error("Logout network fail", e); }
    
    authService.setCachedUser(null);
  },

  resetPassword: async (email: string): Promise<AuthResponse> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Recovery link sent.' };
  },

  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) throw error;
  },

  syncSessionWithBackend: async (session: any): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          access_token: session.access_token,
          refresh_token: session.refresh_token
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Session sync failed');

      authService.setCachedUser(data.user);
      return { success: true, user: data.user, message: 'OAuth Session Established.' };
    } catch (err: any) {
      console.error("OAuth sync error:", err);
      return { success: false, message: err.message };
    }
  }
};
