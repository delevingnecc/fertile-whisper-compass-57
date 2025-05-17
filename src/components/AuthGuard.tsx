
import { ReactNode, useEffect, useState, useRef } from 'react';
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
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  
  // Use refs to track state without triggering re-renders
  const initialAuthCheckDone = useRef(false);
  const lastNavigationPath = useRef<string | null>(null);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Authentication check
  useEffect(() => {
    // Skip checks if already navigating or if component is unmounted
    if (!isMounted.current) return;

    console.log("AuthGuard: Auth check triggered", {
      isLoading,
      user: user?.id || "none",
      path: location.pathname,
      initialAuthCheckDone: initialAuthCheckDone.current
    });

    // Skip if still loading auth state
    if (isLoading) {
      console.log("AuthGuard: Still loading auth state");
      return;
    }

    // If this is our first auth check after loading
    if (!initialAuthCheckDone.current) {
      initialAuthCheckDone.current = true;

      // If user is not authenticated, redirect to auth page
      if (!user) {
        console.log("AuthGuard: No authenticated user");
        
        // Only redirect if not already on auth-related paths
        if (!location.pathname.startsWith('/auth') && lastNavigationPath.current !== '/auth') {
          console.log("AuthGuard: Redirecting to /auth");
          lastNavigationPath.current = '/auth';
          navigate('/auth', { replace: true });
        }
        return;
      }

      // Check onboarding status only once per session
      if (user && !onboardingChecked && !isCheckingOnboarding) {
        // Skip onboarding check if user is already on the onboarding page
        if (location.pathname === '/onboarding') {
          console.log("AuthGuard: On onboarding page, skipping check");
          setOnboardingChecked(true);
        } else {
          // Check onboarding status
          checkOnboardingStatus(user.id);
        }
      }
    }
  }, [user, isLoading]); // Only depend on auth state, not location

  // Separate function to check onboarding status
  const checkOnboardingStatus = async (userId: string) => {
    if (isCheckingOnboarding || !isMounted.current) return;
    
    setIsCheckingOnboarding(true);
    try {
      console.log("AuthGuard: Checking onboarding status for user", userId);
      // Check if the user has completed onboarding
      const completed = await hasCompletedOnboarding(userId);
      console.log("AuthGuard: Onboarding completed:", completed);
      
      if (!isMounted.current) return;
      
      setOnboardingComplete(completed);
      setOnboardingChecked(true);

      if (!completed && location.pathname !== '/onboarding') {
        console.log("AuthGuard: Onboarding not complete, redirecting to /onboarding");
        lastNavigationPath.current = '/onboarding';
        navigate('/onboarding', { replace: true });
      }
    } catch (error) {
      console.error('AuthGuard: Error checking onboarding status:', error);
      
      if (!isMounted.current) return;
      
      // On error, assume onboarding is not complete
      setOnboardingComplete(false);
      setOnboardingChecked(true);
      
      if (location.pathname !== '/onboarding') {
        lastNavigationPath.current = '/onboarding';
        navigate('/onboarding', { replace: true });
      }
    } finally {
      if (isMounted.current) {
        setIsCheckingOnboarding(false);
      }
    }
  };

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || (isCheckingOnboarding && !onboardingChecked)) {
    console.log("AuthGuard: Loading state, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow rendering for authenticated users who:
  // 1. Have completed onboarding, or
  // 2. Are on the onboarding page, or
  // 3. Haven't been checked for onboarding yet (benefit of the doubt)
  const shouldRender = 
    !!user && (
      onboardingComplete === true || 
      location.pathname === '/onboarding' || 
      !onboardingChecked
    );
    
  console.log("AuthGuard: Rendering decision", { 
    shouldRender, 
    onboardingComplete, 
    path: location.pathname,
    onboardingChecked 
  });

  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard;
