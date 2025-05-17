
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
  const [initialCheckComplete, setInitialCheckComplete] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // First, check for existing session (without triggering events)
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
        setInitialCheckComplete(true);
      }
    };
    
    checkSession();

    // Only set up auth state listener AFTER checking the initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);
        
        // If we've completed the initial check and this is a real auth event
        if (initialCheckComplete) {
          // Only show toasts for actual sign in/out events, not for session refreshes
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully.",
            });
            setSession(null);
            setUser(null);
          } else if (event === 'SIGNED_IN' && !session) {
            // Only show sign in toast if we're truly signing in (not just refreshing)
            toast({
              title: "Signed in",
              description: "You have been signed in successfully.",
            });
            setSession(newSession);
            setUser(newSession?.user ?? null);
          } else {
            // For token refreshes and other events, update state without toast
            setSession(newSession);
            setUser(newSession?.user ?? null);
          }
        }
      }
    );
    
    return () => {
      console.log("AuthProvider: Unsubscribing from auth state changes");
      subscription.unsubscribe();
    };
  }, [toast, initialCheckComplete, session]);

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
