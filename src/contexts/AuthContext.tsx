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
  refreshProfile: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileCache, setProfileCache] = useState<Record<string, AuthUser>>({});

  const fetchProfile = async (userId: string) => {
    // 检查缓存
    if (profileCache[userId]) {
      return profileCache[userId];
    }

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      // 更新缓存
      setProfileCache(prev => ({
        ...prev,
        [userId]: profile as AuthUser
      }));
      
      return profile as DatabaseProfile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);
      if (profile) {
        setUser(profile as AuthUser);
      }
    }
  };

  useEffect(() => {
    let mounted = true;
    let authChangeTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(initialSession);
        
        if (initialSession?.user) {
          const profile = await fetchProfile(initialSession.user.id);
          if (mounted && profile) {
            setUser(profile as AuthUser);
          }
        }
      } catch (error) {
        console.error('Error during auth initialization:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        // 使用防抖，避免频繁更新
        clearTimeout(authChangeTimeout);
        authChangeTimeout = setTimeout(async () => {
          if (!mounted) return;
          
          setSession(newSession);
          
          if (newSession?.user) {
            const profile = await fetchProfile(newSession.user.id);
            if (mounted) {
              if (profile) {
                setUser(profile as AuthUser);
              } else {
                setUser(null);
              }
            }
          } else {
            if (mounted) {
              setUser(null);
            }
          }
          
          if (mounted) {
            setLoading(false);
          }
        }, 300); // 300ms 防抖
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(authChangeTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }
      return {};
    } catch (error: any) {
      return { error: error.message };
    } finally {
      setLoading(false);
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
      refreshProfile,
      isAuthenticated: !!session && !!user,
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
