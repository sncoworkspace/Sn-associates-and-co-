
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { authService } from '../services/authService';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Supabase automatically picks up the session from the URL hash/URL
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        if (!session) {
          throw new Error('No session detected matching the OAuth redirect.');
        }

        // Sync with our Node.js backend to get HttpOnly Cookies
        const syncResult = await authService.syncSessionWithBackend(session);
        
        if (syncResult.success) {
          toast.success("Welcome back, " + (syncResult.user?.name || 'User'));
          
          // Route based on role
          if (syncResult.user?.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/my-learning');
          }
        } else {
          toast.error(syncResult.message);
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth Callback Error:', err);
        toast.error('Authentication failed: ' + err.message);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Authenticating with Google...</h2>
        <p className="text-slate-500 text-sm">Please wait while we establish your secure session.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
