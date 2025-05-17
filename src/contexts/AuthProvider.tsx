
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
    console.log("AuthProvider: Setting up auth state listener");
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);
        
        // Only synchronous state updates here
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Only show toasts for actual sign in/out events, not for session refreshes
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
        // Don't show toasts for INITIAL_SESSION or TOKEN_REFRESHED events
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("AuthProvider: Existing session:", currentSession?.user?.id || "none");
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      } catch (error) {
        console.error("AuthProvider: Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      console.log("AuthProvider: Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, [toast]);

  const signOut = async () => {
    try {
      console.log("AuthProvider: Signing out");
      await supabase.auth.signOut();
      console.log("AuthProvider: Successfully signed out");
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "An error occurred while signing out."
      });
    }
  };

  const value = {
    session,
    user,
    isLoading,
    signOut,
  };

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
