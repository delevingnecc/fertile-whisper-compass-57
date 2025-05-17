
import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from "@/components/ui/use-toast";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, userProfile, isLoading, isProfileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    console.log("ProtectedLayout: Effect triggered", {
      isLoading,
      isProfileLoading,
      user: user?.id,
      onboardingComplete: userProfile?.onboarding_completed,
      pathname: location.pathname
    });

    if (isLoading || isProfileLoading) {
      console.log("ProtectedLayout: Still loading auth or profile data.");
      return;
    }

    if (!user) {
      console.log("ProtectedLayout: No authenticated user, redirecting to /auth");
      if (location.pathname !== '/auth' && location.pathname !== '/auth/callback') {
        navigate('/auth', { replace: true });
      }
      return;
    }

    if (user && userProfile && !userProfile.onboarding_completed && location.pathname !== '/onboarding') {
      console.log("ProtectedLayout: User authenticated but onboarding not complete, redirecting to /onboarding");
      navigate('/onboarding', { replace: true });
      return;
    }

    if (user && userProfile && userProfile.onboarding_completed && location.pathname === '/onboarding') {
      console.log("ProtectedLayout: User onboarded but on /onboarding page, redirecting to /");
      navigate('/', { replace: true });
      return;
    }

    console.log("ProtectedLayout: All checks passed for path:", location.pathname);

  }, [user, userProfile, isLoading, isProfileLoading, navigate, location.pathname, toast]);

  if (isLoading || (user && isProfileLoading)) {
    console.log("ProtectedLayout: Showing loading spinner", { isLoading, isProfileLoading, userId: user?.id });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    console.log("ProtectedLayout: Render null because no user after loading checks.");
    return null;
  }

  console.log("ProtectedLayout: Rendering children for path:", location.pathname);
  return <>{children}</>;
};

export default ProtectedLayout;
