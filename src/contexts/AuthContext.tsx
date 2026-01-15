import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface Doctor {
  id: string;
  email: string;
  name: string;
  specialty?: string;
}

interface AuthContextType {
  session: any;
  doctor: Doctor | null;
  isLoading: boolean;
  login: (session: any, doctor: Doctor) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<any>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          setSession(existingSession);
          
          // Retrieve doctor data from localStorage
          const storedDoctor = localStorage.getItem('doctor');
          if (storedDoctor) {
            setDoctor(JSON.parse(storedDoctor));
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      
      if (!newSession) {
        setDoctor(null);
        localStorage.removeItem('doctor');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = (newSession: any, doctorData: Doctor) => {
    setSession(newSession);
    setDoctor(doctorData);
    
    // Store doctor data in localStorage
    localStorage.setItem('doctor', JSON.stringify(doctorData));
    
    // Set session in Supabase client
    if (newSession) {
      supabase.auth.setSession(newSession);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setDoctor(null);
      localStorage.removeItem('doctor');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ session, doctor, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
