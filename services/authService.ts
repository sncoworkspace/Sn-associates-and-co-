
import { authDb, simHelpers, securityDb } from './localDb';

// This wrapper service connects directly to localDb and manages simulated OAuth flows
export const authService = {
  ...authDb,

  // Simulate Google OAuth 2.0 Flow
  loginWithGoogle: (): Promise<{ success: boolean; user?: any; message: string }> => {
    return new Promise((resolve) => {
      // Simulate the latency of a real Google OAuth popup
      setTimeout(() => {
        const googleEmail = "google.user@gmail.com";
        const users = JSON.parse(localStorage.getItem('sn_db_users') || '[]');
        let user = users.find((u: any) => u.email === googleEmail);

        if (!user) {
          // If user doesn't exist, create a new profile from Google data
          const newUserResult = authDb.register(
            "Google User", 
            googleEmail, 
            'google_oauth_bypass_' + Math.random().toString(36).substr(2, 5), 
            ''
          );
          
          if (!newUserResult.success) {
            resolve({ success: false, message: 'Failed to create account via Google' });
            return;
          }
          
          user = JSON.parse(localStorage.getItem('sn_db_users') || '[]').find((u: any) => u.email === googleEmail);
        }

        if (user.isBlocked) {
          securityDb.addLog(user.id, "Blocked Google Login Attempt", "error");
          resolve({ success: false, message: 'Your account has been restricted. Please contact support.' });
          return;
        }

        const { password, ...safeUser } = user;
        localStorage.setItem('sn_db_current_user', JSON.stringify(safeUser));
        
        // Audit Log for Security
        securityDb.addLog(user.id, "Authenticated via Google OAuth", "success");
        
        // Notify other components (like Layout) of storage change
        window.dispatchEvent(new Event("storage"));
        
        resolve({ success: true, user: safeUser, message: 'Login successful via Google' });
      }, 1200);
    });
  },

  // Simulate sending OTP via SMS
  sendOTP: (phone: string): Promise<string> => {
    return new Promise((resolve) => {
      const otp = simHelpers.generateOTP();
      setTimeout(() => {
        // In production, this would call an SMS gateway API
        console.log(`%c[SMS GATEWAY] Sending OTP ${otp} to ${phone}`, 'color: #10b981; font-weight: bold;');
        alert(`SNA Security: Your one-time password is ${otp}. Valid for 5 minutes.`);
        resolve(otp);
      }, 1000);
    });
  },

  // Verify OTP and establish session
  loginWithOTP: (phone: string): { success: boolean; message: string; user?: any } => {
    const users = JSON.parse(localStorage.getItem('sn_db_users') || '[]');
    let user = users.find((u: any) => u.phone === phone);

    if (!user) {
      // For demo purposes, we auto-onboard phone users
      authDb.register(`Client ${phone.substr(-4)}`, `${phone}@mobile.user`, 'otp_bypass', phone);
      user = JSON.parse(localStorage.getItem('sn_db_users') || '[]').find((u: any) => u.phone === phone);
    }

    if (user.isBlocked) return { success: false, message: 'Account is blocked' };

    const { password, ...safeUser } = user;
    localStorage.setItem('sn_db_current_user', JSON.stringify(safeUser));
    securityDb.addLog(user.id, "Authenticated via Phone OTP", "success");
    window.dispatchEvent(new Event("storage"));
    
    return { success: true, message: 'Login successful', user: safeUser };
  },

  resetPassword: (email: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        simHelpers.sendEmail(email, "Reset Your SNA Password", "Click here to securely reset your password: [SECURE_LINK]");
        resolve(true);
      }, 1200);
    });
  }
};
