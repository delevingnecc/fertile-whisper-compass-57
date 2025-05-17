
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { getProfile, UserProfile } from '@/integrations/supabase/profiles';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();
  const initialCheckDone = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchUserProfile = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      if (isMounted.current) {
        setUserProfile(null);
        setIsProfileLoading(false);
      }
      return;
    }

    console.log("AuthProvider: Fetching user profile for", currentUser.id);
    if (isMounted.current) setIsProfileLoading(true);

    try {
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
      if (isMounted.current) {
        setIsProfileLoading(false);
      }
    }
  }, []);

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    console.log("AuthProvider: Setting up auth state listener");
    
    // Set up the auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted.current) return;
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);

        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Use setTimeout to avoid potential deadlock with Supabase client
        if (newSession?.user) {
          setTimeout(() => {
            if (isMounted.current) {
              fetchUserProfile(newSession.user);
            }
          }, 0);
        } else {
          if (isMounted.current) {
            setUserProfile(null);
          }
        }

        // Make sure we're not stuck in loading state
        if (isMounted.current && initialCheckDone.current) {
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (!isMounted.current) return;
      console.log("AuthProvider: Initial session check:", currentSession?.user?.id || "none");
      
      initialCheckDone.current = true;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        fetchUserProfile(currentSession.user);
      }
      
      // Always set isLoading to false after initial check to avoid stuck loading state
      if (isMounted.current) {
        setIsLoading(false);
      }
    }).catch(error => {
      console.error("AuthProvider: Error in initial getSession:", error);
      if (isMounted.current) {
        initialCheckDone.current = true;
        setIsLoading(false);
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up");
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

  const signOut = useCallback(async () => {
    try {
      console.log("AuthProvider: Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Redirect to auth page after sign out
      navigate('/auth');
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: (error instanceof Error ? error.message : "An error occurred while signing out."),
      });
    }
  }, [toast, navigate]);

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
