
import { ReactNode, useEffect, useState, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { hasCompletedOnboarding } from '@/integrations/supabase/profiles';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = memo(({ children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);
  const [checkInitiated, setCheckInitiated] = useState(false);

  useEffect(() => {
    console.log('[AuthGuard] Checking auth status', { 
      isLoading, 
      userId: user?.id, 
      path: location.pathname,
      checkInitiated
    });
    
    // Skip check if we're already on an auth page to prevent redirect loops
    if (['/auth', '/auth/callback'].includes(location.pathname)) {
      return;
    }
    
    // Check authentication status
    if (isLoading) {
      console.log('[AuthGuard] Auth still loading...');
      return;
    }

    // If user is not authenticated, redirect to auth page
    if (!user) {
      console.log('[AuthGuard] User not authenticated, redirecting to /auth');
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated but on onboarding page, allow access
    if (location.pathname === '/onboarding') {
      console.log('[AuthGuard] User is on onboarding page, allowing access');
      setOnboardingComplete(true);
      return;
    }

    // Only run the onboarding check once per authentication to prevent loops
    if (!checkInitiated && !isCheckingOnboarding) {
      setCheckInitiated(true);
      
      // If we get here, the user is authenticated and not on the onboarding page
      // Check if they have completed onboarding
      const checkOnboardingStatus = async () => {
        setIsCheckingOnboarding(true);
        try {
          // Check if the user has completed onboarding
          const completed = await hasCompletedOnboarding(user.id);
          setOnboardingComplete(completed);

          if (!completed) {
            console.log('[AuthGuard] Onboarding not complete, redirecting to /onboarding');
            navigate('/onboarding', { replace: true });
          } else {
            console.log('[AuthGuard] Authentication and onboarding complete, allowing access');
          }
        } catch (error) {
          console.error('[AuthGuard] Error checking onboarding status:', error);
          // On error, assume onboarding is not complete
          setOnboardingComplete(false);
          navigate('/onboarding', { replace: true });
        } finally {
          setIsCheckingOnboarding(false);
        }
      };

      checkOnboardingStatus();
    }
  }, [user, isLoading, navigate, location.pathname, checkInitiated, isCheckingOnboarding]);

  // Reset checkInitiated when user changes
  useEffect(() => {
    // If user changes, reset the check
    setCheckInitiated(false);
  }, [user?.id]);

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || isCheckingOnboarding || onboardingComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if user is authenticated and has completed onboarding if required
  return user ? <>{children}</> : null;
});

AuthGuard.displayName = 'AuthGuard';

export default AuthGuard;
