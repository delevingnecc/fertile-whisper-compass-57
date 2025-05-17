
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  
  // Use a ref to track if we've shown a toast for the current session
  // This prevents repeated toasts when the component re-renders
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    let mounted = true;
    
    // First, check for existing session (without triggering events)
    const checkSession = async () => {
      try {
        console.log("AuthProvider: Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("AuthProvider: Existing session:", currentSession?.user?.id || "none");
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          // Store the session ID in our ref to prevent showing toast on initial load
          if (currentSession?.user) {
            sessionIdRef.current = currentSession.user.id;
          }
        }
      } catch (error) {
        console.error("AuthProvider: Error checking session:", error);
      } finally {
        if (mounted) {
          setIsLoading(false);
          setInitialCheckComplete(true);
        }
      }
    };
    
    checkSession();

    // Set up auth state listener AFTER checking the initial session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);
        
        // Only process events if we're still mounted
        if (!mounted) return;
        
        // Get the new session ID
        const newSessionId = newSession?.user?.id || null;
        
        // If this is a real auth event and not just a refresh
        if (initialCheckComplete) {
          // Handle sign out event
          if (event === 'SIGNED_OUT') {
            toast({
              title: "Signed out",
              description: "You have been signed out successfully.",
            });
            setSession(null);
            setUser(null);
            sessionIdRef.current = null;
          } 
          // Handle sign in event - only if it's a new session
          else if (event === 'SIGNED_IN' && newSessionId && newSessionId !== sessionIdRef.current) {
            toast({
              title: "Signed in",
              description: "You have been signed in successfully.",
            });
            setSession(newSession);
            setUser(newSession?.user ?? null);
            sessionIdRef.current = newSessionId;
          }
          // For token refreshes and other events, update state without toast
          else if (newSession !== session) {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            if (newSessionId) {
              sessionIdRef.current = newSessionId;
            }
          }
        }
      }
    );
    
    return () => {
      console.log("AuthProvider: Unsubscribing from auth state changes");
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, initialCheckComplete]); // Remove session from dependencies

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
