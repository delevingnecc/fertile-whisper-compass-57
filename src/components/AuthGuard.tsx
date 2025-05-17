
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { hasCompletedOnboarding } from '@/integrations/supabase/profiles';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);
  const [initialPathChecked, setInitialPathChecked] = useState(false);

  useEffect(() => {
    console.log("AuthGuard: Auth check triggered", {
      isLoading,
      user: user?.id || "none",
      path: location.pathname
    });

    // Check authentication status first
    if (isLoading) {
      console.log("AuthGuard: Still loading auth state");
      return;
    }

    // If user is not authenticated, redirect to auth page unless already there
    if (!user) {
      console.log("AuthGuard: No authenticated user");
      
      // Only redirect if not already on auth-related paths
      if (!location.pathname.startsWith('/auth')) {
        console.log("AuthGuard: Redirecting to /auth");
        navigate('/auth', { replace: true });
      }
      return;
    }

    // Set initial path as checked after first auth check passes
    if (!initialPathChecked) {
      setInitialPathChecked(true);
      
      // Only check onboarding on initial path load, not on subsequent navigation
      if (location.pathname !== '/onboarding' && !hasCheckedOnboarding && !isCheckingOnboarding) {
        checkOnboardingStatus(user.id);
      } else if (location.pathname === '/onboarding') {
        // If we're on the onboarding page, we don't need to check completion status
        console.log("AuthGuard: On onboarding page, skipping check");
        setOnboardingComplete(true);
        setHasCheckedOnboarding(true); // Mark as checked
      }
    }
  }, [user, isLoading]); // Only run when auth state changes, not on every location change

  // Separate function to check onboarding status
  const checkOnboardingStatus = async (userId: string) => {
    setIsCheckingOnboarding(true);
    try {
      console.log("AuthGuard: Checking onboarding status for user", userId);
      // Check if the user has completed onboarding
      const completed = await hasCompletedOnboarding(userId);
      console.log("AuthGuard: Onboarding completed:", completed);
      setOnboardingComplete(completed);
      setHasCheckedOnboarding(true);

      if (!completed) {
        console.log("AuthGuard: Onboarding not complete, redirecting to /onboarding");
        navigate('/onboarding', { replace: true });
      }
    } catch (error) {
      console.error('AuthGuard: Error checking onboarding status:', error);
      // On error, assume onboarding is not complete
      setOnboardingComplete(false);
      setHasCheckedOnboarding(true);
      navigate('/onboarding', { replace: true });
    } finally {
      setIsCheckingOnboarding(false);
    }
  };

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || (isCheckingOnboarding && !hasCheckedOnboarding)) {
    console.log("AuthGuard: Loading state, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children in these cases:
  // 1. User is authenticated and has completed onboarding
  // 2. User is on the onboarding page
  // 3. Initial check hasn't been done yet (giving benefit of the doubt)
  const shouldRender = 
    !!user && (
      onboardingComplete === true || 
      location.pathname === '/onboarding' || 
      !initialPathChecked
    );
    
  console.log("AuthGuard: Rendering decision", { 
    shouldRender, 
    onboardingComplete, 
    path: location.pathname,
    initialPathChecked 
  });

  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard;
