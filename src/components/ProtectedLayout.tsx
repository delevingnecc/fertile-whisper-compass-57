
import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { hasCompletedOnboarding } from '@/integrations/supabase/profiles';
import { useToast } from "@/components/ui/use-toast";

interface ProtectedLayoutProps {
  children: ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  // Only run this effect once on initial mount
  useEffect(() => {
    const checkAuth = async () => {
      // If still loading auth state, wait
      if (isLoading) return;

      // If no authenticated user, redirect to auth
      if (!user) {
        console.log("ProtectedLayout: No authenticated user, redirecting to /auth");
        navigate('/auth', { replace: true });
        return;
      }

      // Check onboarding status only for authenticated users
      try {
        setIsCheckingOnboarding(true);
        const completed = await hasCompletedOnboarding(user.id);
        
        if (!completed) {
          console.log("ProtectedLayout: Onboarding not complete, redirecting to /onboarding");
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('ProtectedLayout: Error checking onboarding status:', error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem verifying your account setup."
        });
        navigate('/onboarding', { replace: true });
      } finally {
        setIsCheckingOnboarding(false);
        setInitialized(true);
      }
    };

    checkAuth();
  }, [isLoading, user, navigate]);

  // Show loading state only during initial check
  if (isLoading || (user && isCheckingOnboarding && !initialized)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Only render children when properly authenticated and onboarded
  return user ? <>{children}</> : null;
};

export default ProtectedLayout;
