
import React, { createContext, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/components/ui/use-toast';
import { UserProfile } from '@/integrations/supabase/profiles';
import { useAuthState } from '@/hooks/useAuthState';
import { useUserProfile } from '@/hooks/useUserProfile';

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
  const { toast } = useToast();
  const { user, session, isLoading, signOut: baseSignOut } = useAuthState();
  const { userProfile, isProfileLoading, refreshUserProfile } = useUserProfile(user);

  // Wrap the signOut function to add toast functionality
  const signOut = async () => {
    try {
      const { error } = await baseSignOut();
      if (error) throw error;
    } catch (error) {
      console.error("AuthProvider: Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: (error instanceof Error ? error.message : "An error occurred while signing out."),
      });
    }
  };

  const value = {
    session,
    user,
    userProfile,
    isLoading,
    isProfileLoading,
    signOut,
    refreshUserProfile,
  };

  // Only log once when AuthProvider is initially rendered
  React.useEffect(() => {
    console.log("AuthProvider: Initialized");
  }, []);

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
