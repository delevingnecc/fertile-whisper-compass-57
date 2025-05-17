
import { useState, useRef, useCallback, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { getProfile, UserProfile } from '@/integrations/supabase/profiles';

export function useUserProfile(user: User | null) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const isMounted = useRef(true);
  const profileFetchInProgress = useRef(false);
  
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
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

  // Initial fetch and fetch when user changes
  useEffect(() => {
    if (user && !profileFetchInProgress.current) {
      let profileTimeout: ReturnType<typeof setTimeout> | null = null;
      
      // Use setTimeout to avoid potential deadlock with Supabase client
      profileTimeout = setTimeout(() => {
        if (isMounted.current && !profileFetchInProgress.current) {
          fetchUserProfile(user);
        }
      }, 100);
      
      return () => {
        if (profileTimeout) clearTimeout(profileTimeout);
      };
    } else if (!user) {
      setUserProfile(null);
    }
  }, [user, fetchUserProfile]);

  const refreshUserProfile = useCallback(async () => {
    if (user && !profileFetchInProgress.current) {
      await fetchUserProfile(user);
    }
  }, [user, fetchUserProfile]);

  return {
    userProfile,
    isProfileLoading,
    refreshUserProfile
  };
}
