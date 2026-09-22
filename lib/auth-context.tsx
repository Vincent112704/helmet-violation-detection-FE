'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase_client } from '../client/supabase_client';

// Matches what the `personnel` insert trigger expects from raw_user_meta_data
export type SignupMetadata = {
  display_name: string;
  user_role: string;
};

interface AuthContextType {
  user: User | null;
  session: Session | null;
  token: string | null; // current bearer access token, kept in sync with the session
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    metadata: SignupMetadata
  ) => Promise<{ requiresEmailConfirmation: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Separate key so any of your own fetch() calls can read the token
// without reaching back into Supabase's internal storage format.
const TOKEN_STORAGE_KEY = 'ts_auth_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistToken = (accessToken: string | null) => {
    setToken(accessToken);
    if (typeof window === 'undefined') return;
    if (accessToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  };

  useEffect(() => {
    // Hydrate from whatever Supabase already persisted (e.g. after a refresh)
    supabase_client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      persistToken(session?.access_token ?? null);
      setIsLoading(false);
    });

    // Keep everything in sync on sign-in, sign-out, and token refresh
    const {
      data: { subscription },
    } = supabase_client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      persistToken(session?.access_token ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase_client.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(error.message);
    persistToken(data.session?.access_token ?? null);
  };

  const signup = async (
    email: string,
    password: string,
    metadata: SignupMetadata
  ) => {
    console.log(metadata.user_role)
    const { data, error } = await supabase_client.auth.signUp({
      email,
      password,
      options: {
        // Lands in NEW.raw_user_meta_data for your `personnel` insert trigger
        data: {
          display_name: metadata.display_name,
          role: metadata.user_role,
        },
      },
    });
    console.log(error)
    console.log(data)
    if (error) throw new Error(error.message);

    // If email confirmation is enabled in your Supabase auth settings,
    // signUp succeeds but returns no session/token until the user confirms.
    if (data.session) {
      persistToken(data.session.access_token);
      return { requiresEmailConfirmation: false };
    }
    return { requiresEmailConfirmation: true };
  };

  const logout = async () => {
    const { error } = await supabase_client.auth.signOut();
    if (error) throw new Error(error.message);
    persistToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, token, isLoading, isAuthenticated: !!session ,login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
