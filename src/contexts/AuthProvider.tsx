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
  const [initialAuthCheckComplete, setInitialAuthCheckComplete] = useState(false);
  const { toast } = useToast();
  const sessionIdRef = useRef<string | null>(null);
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
      if (isMounted.current && !(error instanceof Error && error.message.includes("PGRST116"))) {
        toast({
          title: "Profile Error",
          description: "Could not load your profile information.",
          variant: "destructive",
        });
      }
    } finally {
      if (isMounted.current) {
        setIsProfileLoading(false);
      }
    }
  }, [toast]);

  const refreshUserProfile = useCallback(async () => {
    if (user) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  useEffect(() => {
    isMounted.current = true;
    
    console.log("AuthProvider: Initial auth check");
    setIsLoading(true);
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!isMounted.current) return;
        console.log("AuthProvider: Auth state changed:", event, newSession?.user?.id);

        setSession(newSession);
        const newAuthUser = newSession?.user ?? null;
        setUser(newAuthUser);
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') setIsLoading(true);

        if (event === 'SIGNED_IN') {
          if (newAuthUser) {
            if (newAuthUser.id !== sessionIdRef.current || !userProfile) {
              if (newAuthUser.id !== sessionIdRef.current) {
                toast({ title: "Signed in", description: "You have been signed in successfully." });
              }
              sessionIdRef.current = newAuthUser.id;
              await fetchUserProfile(newAuthUser);
            } else {
              if (isMounted.current) setIsProfileLoading(false);
            }
          } else {
            if (isMounted.current) {
              setUserProfile(null);
              setIsProfileLoading(false);
              sessionIdRef.current = null;
            }
          }
        } else if (event === 'SIGNED_OUT') {
          toast({ title: "Signed out", description: "You have been signed out successfully." });
          if (isMounted.current) {
            setUserProfile(null);
            setIsProfileLoading(false);
            sessionIdRef.current = null;
          }
        } else if (event === 'USER_UPDATED' && newAuthUser) {
          console.log("AuthProvider: User updated, refreshing profile.");
          await fetchUserProfile(newAuthUser);
        } else if (event === 'TOKEN_REFRESHED' && newAuthUser && !userProfile && !isProfileLoading) {
          console.log("AuthProvider: Token refreshed, user exists but profile missing. Refetching.");
          await fetchUserProfile(newAuthUser);
        } else if (event === 'INITIAL_SESSION') {
          if (newAuthUser && (!userProfile || newAuthUser.id !== sessionIdRef.current)) {
            sessionIdRef.current = newAuthUser.id;
            await fetchUserProfile(newAuthUser);
          } else if (!newAuthUser) {
            if (isMounted.current) {
              setUserProfile(null);
              setIsProfileLoading(false);
              sessionIdRef.current = null;
            }
          }
        }

        if (initialAuthCheckComplete && isMounted.current) {
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (!isMounted.current) return;
      console.log("AuthProvider: Initial session:", currentSession?.user?.id || "none");
      setSession(currentSession);
      const currentAuthUser = currentSession?.user ?? null;
      setUser(currentAuthUser);
      setInitialAuthCheckComplete(true);

      if (currentAuthUser) {
        await fetchUserProfile(currentAuthUser);
      } else {
        if (isMounted.current) setIsProfileLoading(false);
      }
      if (isMounted.current) setIsLoading(false);
    }).catch(error => {
      if (isMounted.current) {
        console.error("AuthProvider: Error in initial getSession:", error);
        setIsLoading(false);
        setIsProfileLoading(false);
      }
    });

    return () => {
      console.log("AuthProvider: Cleaning up");
      isMounted.current = false;
      subscription.unsubscribe();
      console.log("AuthProvider: Unsubscribing from auth state changes");
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
    isLoading: isLoading || !initialAuthCheckComplete,
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
