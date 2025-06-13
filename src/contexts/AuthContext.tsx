
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { DatabaseProfile } from '@/types/database';

interface AuthUser extends DatabaseProfile {
  // 继承 DatabaseProfile 的所有属性
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (username: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user ID:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile fetched successfully:', profile);
      return profile as DatabaseProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('Setting up auth state listener...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email || 'No session');
      setSession(session);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(profile => {
          if (profile) {
            console.log('Profile loaded from initial session:', profile);
            setUser(profile as AuthUser);
          }
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          console.log('User found in session, fetching profile...');
          const profile = await fetchProfile(session.user.id);
          if (profile) {
            console.log('Setting user profile:', profile);
            setUser(profile as AuthUser);
          } else {
            console.log('No profile found for user');
            setUser(null);
          }
        } else {
          console.log('No user in session');
          setUser(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      console.log('Login successful');
      return {};
    } catch (error: any) {
      console.error('Login failed:', error.message);
      return { error: error.message };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });

      if (error) throw error;
      return {};
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const logout = async () => {
    console.log('Logging out...');
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      register,
      logout,
      isAuthenticated: !!session,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
