
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
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

// Add an app-wide ID to prevent duplicate listeners
const APP_INSTANCE_ID = `auth-provider-${Math.random().toString(36).substr(2, 9)}`;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Use a ref to track if we've already initialized
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) {
      console.log(`[AuthProvider ${APP_INSTANCE_ID}] Already initialized, skipping setup`);
      return;
    }

    console.log(`[AuthProvider ${APP_INSTANCE_ID}] Setting up authentication (first time)`);
    setInitialized(true);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        // Log auth events for debugging
        console.log(`[AuthProvider ${APP_INSTANCE_ID}] Auth state changed: ${event}`, { 
          event, 
          userId: newSession?.user?.id,
          session: newSession ? 'present' : 'null' 
        });
        
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
        }
      }
    );

    // THEN check for existing session
    console.log(`[AuthProvider ${APP_INSTANCE_ID}] Checking for existing session`);
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log(`[AuthProvider ${APP_INSTANCE_ID}] Session check complete`, { 
        hasSession: !!currentSession,
        userId: currentSession?.user?.id 
      });
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Cleanup function - only runs on unmount
    return () => {
      console.log(`[AuthProvider ${APP_INSTANCE_ID}] Cleaning up auth subscription`);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - this effect runs once on mount

  // Memoize the signOut function to prevent unnecessary rerenders
  const signOut = useCallback(async () => {
    console.log(`[AuthProvider ${APP_INSTANCE_ID}] Signing out user`);
    await supabase.auth.signOut();
  }, []);

  // Memoize the context value
  const value = useMemo(() => ({
    session,
    user,
    isLoading,
    signOut,
  }), [session, user, isLoading, signOut]);

  // Log current auth state for debugging
  console.log(`[AuthProvider ${APP_INSTANCE_ID}] Current auth state:`, { 
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
