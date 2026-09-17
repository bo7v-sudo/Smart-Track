'use client';

import * as React from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase-client';

export type UserRole = 'student' | 'professor';

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  onboarding_completed: boolean;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: UserRole | null;
  loading: boolean;
  refreshProfile: (userId?: string) => Promise<Profile | null>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  role: null,
  loading: true,
  refreshProfile: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  const fetchProfile = React.useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url, onboarding_completed')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Failed to load profile:', error.message);
    }

    const result: Profile = (data as Profile) ?? {
      id: userId,
      email: null,
      full_name: null,
      role: 'student',
      avatar_url: null,
      onboarding_completed: false,
    };
    setProfile(result);
    return result;
  }, []);

  const refreshProfile = React.useCallback(async (userId?: string): Promise<Profile | null> => {
    const uid = userId ?? session?.user?.id;
    if (!uid) return null;
    return fetchProfile(uid);
  }, [session, fetchProfile]);

  React.useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        fetchProfile(data.session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Skip INITIAL_SESSION — getSession() already handles it
        if (event === 'INITIAL_SESSION') return;

        if (!mounted) return;

        setSession(newSession);
        if (newSession?.user) {
          (async () => {
            await fetchProfile(newSession.user.id);
            if (mounted) setLoading(false);
          })();
        } else {
          setProfile(null);
          setLoading(false);
        }
      },
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  }, []);

  const value: AuthContextValue = {
    session,
    user: session?.user ?? null,
    profile,
    role: profile?.role ?? null,
    loading,
    refreshProfile,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return React.useContext(AuthContext);
}
