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
    // Check authentication status first
    if (isLoading) return;

    // If user is not authenticated, redirect to auth page
    if (!user) {
      navigate('/auth');
      return;
    }

    // If user is authenticated and not on onboarding page,
    // check if they have completed onboarding
    if (location.pathname !== '/onboarding') {
      const checkOnboardingStatus = async () => {
        setIsCheckingOnboarding(true);
        try {
          // Check if the user has completed onboarding
          const completed = await hasCompletedOnboarding(user.id);
          setOnboardingComplete(completed);

          if (!completed) {
            navigate('/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding status:', error);
          // On error, assume onboarding is not complete
          setOnboardingComplete(false);
          navigate('/onboarding');
        } finally {
          setIsCheckingOnboarding(false);
        }
      };

      checkOnboardingStatus();
    } else {
      // If we're on the onboarding page, we don't need to check completion status
      setOnboardingComplete(true);
    }
  }, [user, isLoading, navigate, location.pathname]);

  // Don't render anything while checking authentication or onboarding status
  if (isLoading || isCheckingOnboarding || onboardingComplete === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children only if user is authenticated
  return user ? <>{children}</> : null;
};

export default AuthGuard;
