
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
    
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted.current) return;
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);

        setSession(newSession);
        const newAuthUser = newSession?.user ?? null;
        setUser(newAuthUser);

        if (newAuthUser) {
          await fetchUserProfile(newAuthUser);
        } else {
          if (isMounted.current) {
            setUserProfile(null);
          }
        }

        if (isMounted.current) setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!isMounted.current) return;
      console.log("AuthProvider: Initial session:", currentSession?.user?.id || "none");
      
      setSession(currentSession);
      const currentAuthUser = currentSession?.user ?? null;
      setUser(currentAuthUser);

      if (currentAuthUser) {
        await fetchUserProfile(currentAuthUser);
      } else {
        if (isMounted.current) setIsProfileLoading(false);
      }
      
      if (isMounted.current) setIsLoading(false);
    }).catch(error => {
      console.error("AuthProvider: Error in initial getSession:", error);
      if (isMounted.current) {
        setIsLoading(false);
        setIsProfileLoading(false);
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up");
      isMounted.current = false;
      subscription.unsubscribe();
    };
  }, [toast, fetchUserProfile]);

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
