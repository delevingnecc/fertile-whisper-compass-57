
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getProfile, UserProfile } from '@/integrations/supabase/profiles';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const { toast } = useToast();
  const isMounted = useRef(true);
  const initialCheckDone = useRef(false);
  const authCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileFetchInProgress = useRef(false);

  // Set a maximum timeout for the initial auth check to prevent endless loading
  useEffect(() => {
    isMounted.current = true;
    
    // Shorter timeout for better UX
    authCheckTimeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        console.log("AuthProvider: Auth check timeout reached, forcing isLoading to false");
        setIsLoading(false);
      }
    }, 1500); // 1.5 second max wait time
    
    return () => {
      isMounted.current = false;
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
    };
  }, []);

  const fetchUserProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser || profileFetchInProgress.current) {
      if (isMounted.current && !currentUser) {
        setUserProfile(null);
      }
      return;
    }

    try {
      profileFetchInProgress.current = true;
      console.log("AuthProvider: Fetching user profile for", currentUser.id);
      if (isMounted.current) setIsProfileLoading(true);

      const profile = await getProfile(currentUser.id);
      
      if (isMounted.current) {
        setUserProfile(profile);
        console.log("AuthProvider: User profile fetched:", profile);
      }
    } catch (error) {
      console.error("AuthProvider: Error in fetchUserProfile:", error);
      if (isMounted.current) {
        setUserProfile(null);
      }
    } finally {
      profileFetchInProgress.current = false;
      if (isMounted.current) {
        setIsProfileLoading(false);
      }
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (user && !profileFetchInProgress.current) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    let profileTimeout: ReturnType<typeof setTimeout> | null = null;
    
    // First check for existing session to set initial state faster
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (!isMounted.current) return;
        
        console.log(`AuthProvider: Initial session check: ${currentSession?.user?.id || 'none'}`);
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          // Set loading to false as soon as we have confirmed a session
          setIsLoading(false);
          initialCheckDone.current = true;
          
          // Fetch profile in a non-blocking way
          setTimeout(() => {
            if (isMounted.current && !profileFetchInProgress.current) {
              fetchUserProfile(currentSession.user);
            }
          }, 100);
        } else if (initialCheckDone.current === false) {
          // If no session and this is first check, set loading false with a slight delay
          // This gives time for the auth state listener to pick up any session
          setTimeout(() => {
            if (isMounted.current && !initialCheckDone.current) {
              console.log("AuthProvider: No session found in initial check");
              setIsLoading(false);
              initialCheckDone.current = true;
            }
          }, 300);
        }
      } catch (error) {
        console.error("AuthProvider: Error in initial getSession:", error);
        // Always set isLoading to false after initial check
        if (isMounted.current) {
          setIsLoading(false);
          initialCheckDone.current = true;
        }
      }
    };
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted.current) return;
        console.log(`AuthProvider: Auth state changed: ${event}, user: ${newSession?.user?.id || 'none'}`);
        
        // Mark initial check as done since we received an auth state event
        initialCheckDone.current = true;

        // Update state with the new session information
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Always set loading to false after auth state change
        setIsLoading(false);

        // Avoid potential deadlocks by using timeout for profile fetch
        if (newSession?.user) {
          // Clear any existing timeouts to prevent multiple fetches
          if (profileTimeout) clearTimeout(profileTimeout);
          
          // Use setTimeout to avoid potential deadlock with Supabase client
          profileTimeout = setTimeout(() => {
            if (isMounted.current && !profileFetchInProgress.current) {
              fetchUserProfile(newSession.user);
            }
          }, 100);
        } else {
          if (isMounted.current) {
            setUserProfile(null);
          }
        }
      }
    );
    
    // Check for existing session
    checkSession();

    return () => {
      console.log("AuthProvider: Cleaning up auth listener");
      isMounted.current = false;
      if (profileTimeout) clearTimeout(profileTimeout);
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

  const signOut = useCallback(async () => {
    try {
      console.log("AuthProvider: Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: (error instanceof Error ? error.message : "An error occurred while signing out."),
      });
    }
  }, [toast]);

  const value = {
    session,
    user,
    userProfile,
    isLoading,
    isProfileLoading,
    signOut,
    refreshUserProfile,
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
