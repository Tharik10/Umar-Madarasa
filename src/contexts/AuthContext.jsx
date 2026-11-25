import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAdminRole = async (user) => {
    if (!user) {
      setAdminProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('id', user.id)
      .eq('is_active', true)
      .maybeSingle();

    if (error || !data) {
      setAdminProfile(null);
      return null;
    }
    setAdminProfile(data);
    return data;
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!mounted) return;
      setSession(currentSession);
      if (currentSession?.user) {
        await verifyAdminRole(currentSession.user);
      }
      if (mounted) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
      if (newSession?.user) {
        await verifyAdminRole(newSession.user);
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signInAdmin = async (email, password) => {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase environment variables are not configured.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) throw error;

    const profile = await verifyAdminRole(data.user);
    if (!profile) {
      await supabase.auth.signOut();
      throw new Error('Access Denied: This account is not registered as an authorized Madarasa Administrator.');
    }
    return profile;
  };

  const signOutAdmin = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setAdminProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        adminProfile,
        isAdmin: Boolean(session?.user && adminProfile?.is_active),
        loading,
        signInAdmin,
        signOutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
