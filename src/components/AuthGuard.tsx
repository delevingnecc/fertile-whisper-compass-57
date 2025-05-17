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

    // If user is not authenticated, redirect to auth page
    if (!user) {
      console.log("AuthGuard: No authenticated user, redirecting to /auth");
      navigate('/auth', { replace: true });
      return;
    }

    // If user is authenticated and not on onboarding page AND we haven't checked onboarding yet,
    // check if they have completed onboarding
    if (location.pathname !== '/onboarding' && !hasCheckedOnboarding && !isCheckingOnboarding) {
      const checkOnboardingStatus = async () => {
        setIsCheckingOnboarding(true);
        try {
          console.log("AuthGuard: Checking onboarding status for user", user.id);
          // Check if the user has completed onboarding
          const completed = await hasCompletedOnboarding(user.id);
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

      checkOnboardingStatus();
    } else if (location.pathname === '/onboarding') {
      // If we're on the onboarding page, we don't need to check completion status
      console.log("AuthGuard: On onboarding page, skipping check");
      setOnboardingComplete(true);
      setHasCheckedOnboarding(true); // Mark as checked
    }
  }, [user, isLoading, navigate, location.pathname, hasCheckedOnboarding, isCheckingOnboarding]);

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || (isCheckingOnboarding && !hasCheckedOnboarding)) {
    console.log("AuthGuard: Loading state, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if user is authenticated and (onboarding is complete or we're on the onboarding page)
  const shouldRender = !!user && (onboardingComplete || location.pathname === '/onboarding' || !hasCheckedOnboarding);
  console.log("AuthGuard: Rendering decision", { shouldRender, onboardingComplete, path: location.pathname });

  return shouldRender ? <>{children}</> : null;
};

export default AuthGuard;
