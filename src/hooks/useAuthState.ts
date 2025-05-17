
import { useState, useRef, useCallback, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMounted = useRef(true);
  const initialCheckDone = useRef(false);
  const authCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authListenerInitialized = useRef(false);

  // Set a maximum timeout for the initial auth check to prevent endless loading
  useEffect(() => {
    isMounted.current = true;

    // Set timeout to 4 hours (14,400,000 milliseconds)
    authCheckTimeoutRef.current = setTimeout(() => {
      if (isMounted.current && isLoading) {
        console.log("AuthState: Auth check timeout reached (4 hours), forcing isLoading to false");
        setIsLoading(false);
      }
    }, 14400000); // 4 hours in milliseconds

    return () => {
      isMounted.current = false;
      if (authCheckTimeoutRef.current) {
        clearTimeout(authCheckTimeoutRef.current);
      }
    };
  }, []);

  // Initialize auth state and set up listeners - only once!
  useEffect(() => {
    // Skip if already initialized
    if (authListenerInitialized.current) {
      return;
    }
    
    console.log("AuthState: Initializing auth listener (once)");
    authListenerInitialized.current = true;

    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        if (!isMounted.current) return;
        console.log(`AuthState: Auth state changed: ${event}, user: ${newSession?.user?.id || 'none'}`);

        // Mark initial check as done since we received an auth state event
        initialCheckDone.current = true;

        // Update state with the new session information
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Always set loading to false after auth state change
        setIsLoading(false);
      }
    );

    // Initial check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();

        if (!isMounted.current) return;

        console.log(`AuthState: Initial session check: ${currentSession?.user?.id || 'none'}`);

        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);

          // Set loading to false as soon as we have confirmed a session
          setIsLoading(false);
          initialCheckDone.current = true;
        } else if (initialCheckDone.current === false) {
          // If no session and this is first check, set loading false with a slight delay
          // This gives time for the auth state listener to pick up any session
          setTimeout(() => {
            if (isMounted.current && !initialCheckDone.current) {
              console.log("AuthState: No session found in initial check");
              setIsLoading(false);
              initialCheckDone.current = true;
            }
          }, 300);
        }
      } catch (error) {
        console.error("AuthState: Error in initial getSession:", error);
        // Always set isLoading to false after initial check
        if (isMounted.current) {
          setIsLoading(false);
          initialCheckDone.current = true;
        }
      }
    };

    // Check for existing session
    checkSession();

    return () => {
      console.log("AuthState: Cleaning up auth listener");
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array to run only once

  const signOut = useCallback(async () => {
    try {
      console.log("AuthState: Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("AuthState: Error signing out:", error);
      return { error };
    }
    return { error: null };
  }, []);

  return {
    user,
    session,
    isLoading,
    signOut
  };
}
