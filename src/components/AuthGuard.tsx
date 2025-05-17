
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
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  
  // Use refs to track initialization state
  const initialCheckDone = useRef(false);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Authentication check - ONLY on initial mount
  useEffect(() => {
    // Skip if already checked or component is unmounting
    if (!isMounted.current || initialCheckDone.current) return;
    
    // Skip if still loading auth state
    if (isLoading) {
      console.log("AuthGuard: Still loading auth state");
      return;
    }

    console.log("AuthGuard: Initial auth check, path:", location.pathname);
    initialCheckDone.current = true;

    // If no user, redirect to auth (but only if not already on auth path)
    if (!user) {
      if (!location.pathname.startsWith('/auth')) {
        console.log("AuthGuard: No authenticated user, redirecting to /auth");
        navigate('/auth', { replace: true });
      }
      return;
    }

    // Check onboarding status only once for authenticated users
    // Skip if already on onboarding page
    if (location.pathname !== '/onboarding') {
      checkOnboardingStatus(user.id);
    } else {
      // If we're already on onboarding page, no need to check
      setOnboardingComplete(false);
    }
  }, [isLoading, user]); // Only depend on auth state changes

  // Separate function to check onboarding status
  const checkOnboardingStatus = async (userId: string) => {
    if (isCheckingOnboarding || !isMounted.current) return;
    
    setIsCheckingOnboarding(true);
    try {
      console.log("AuthGuard: Checking onboarding status for user", userId);
      const completed = await hasCompletedOnboarding(userId);
      console.log("AuthGuard: Onboarding completed:", completed);
      
      if (!isMounted.current) return;
      
      setOnboardingComplete(completed);

      if (!completed && location.pathname !== '/onboarding') {
        console.log("AuthGuard: Onboarding not complete, redirecting to /onboarding");
        navigate('/onboarding', { replace: true });
      }
    } catch (error) {
      console.error('AuthGuard: Error checking onboarding status:', error);
      
      if (!isMounted.current) return;
      setOnboardingComplete(false);
      
      if (location.pathname !== '/onboarding') {
        navigate('/onboarding', { replace: true });
      }
    } finally {
      if (isMounted.current) {
        setIsCheckingOnboarding(false);
      }
    }
  };

  // Don't render anything while checking initial authentication
  if (isLoading || (user && isCheckingOnboarding && onboardingComplete === null)) {
    console.log("AuthGuard: Initial loading state, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Allow rendering for authenticated users who:
  // 1. Have completed onboarding, or
  // 2. Are on the onboarding page
  const shouldRender = 
    !!user && (
      onboardingComplete === true || 
      location.pathname === '/onboarding'
    );
    
  console.log("AuthGuard: Final rendering decision", { 
    shouldRender, 
    onboardingComplete, 
    path: location.pathname
  });

  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard;
