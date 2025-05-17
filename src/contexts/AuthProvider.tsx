
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log('[AuthProvider] Initializing auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Log auth events for debugging
        console.log(`[AuthProvider] Auth state changed: ${event}`, { event, session: newSession });
        
        // Only synchronous state updates here
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          toast({
            title: "Signed out",
            description: "You have been signed out successfully.",
          });
        } else if (event === 'SIGNED_IN') {
          toast({
            title: "Signed in",
            description: "You have been signed in successfully.",
          });
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('[AuthProvider] Session token refreshed');
        }
      }
    );

    // THEN check for existing session
    console.log('[AuthProvider] Checking for existing session');
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('[AuthProvider] Session check complete', { 
        hasSession: !!currentSession,
        userId: currentSession?.user?.id 
      });
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    console.log('[AuthProvider] Signing out user');
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
  };

  // Log current auth state for debugging
  console.log('[AuthProvider] Current auth state:', { 
    isAuthenticated: !!user,
    isLoading,
    userId: user?.id,
    email: user?.email
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
