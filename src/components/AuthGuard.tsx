
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

    // If user is authenticated and not on onboarding page,
    // check if they have completed onboarding
    if (location.pathname !== '/onboarding') {
      const checkOnboardingStatus = async () => {
        setIsCheckingOnboarding(true);
        try {
          console.log("AuthGuard: Checking onboarding status for user", user.id);
          // Check if the user has completed onboarding
          const completed = await hasCompletedOnboarding(user.id);
          console.log("AuthGuard: Onboarding completed:", completed);
          setOnboardingComplete(completed);

          if (!completed) {
            console.log("AuthGuard: Onboarding not complete, redirecting to /onboarding");
            navigate('/onboarding', { replace: true });
          }
        } catch (error) {
          console.error('AuthGuard: Error checking onboarding status:', error);
          // On error, assume onboarding is not complete
          setOnboardingComplete(false);
          navigate('/onboarding', { replace: true });
        } finally {
          setIsCheckingOnboarding(false);
        }
      };

      checkOnboardingStatus();
    } else {
      // If we're on the onboarding page, we don't need to check completion status
      console.log("AuthGuard: On onboarding page, skipping check");
      setOnboardingComplete(true);
    }
  }, [user, isLoading, navigate, location.pathname]);

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || isCheckingOnboarding || onboardingComplete === null) {
    console.log("AuthGuard: Loading state, showing spinner");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if user is authenticated
  console.log("AuthGuard: Rendering children, user is authenticated");
  return user ? <>{children}</> : null;
};

export default AuthGuard;
