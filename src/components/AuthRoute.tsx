
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useRef } from "react";
import MainLayout from "@/layouts/MainLayout";

const AuthRoute = () => {
  const { user, userProfile, isLoading, isProfileLoading } = useAuth();
  const location = useLocation();
  const loggedOnce = useRef(false);

  useEffect(() => {
    // Only log once per path to reduce console clutter
    if (!loggedOnce.current) {
      console.log(
        `AuthRoute: Initial check - Path ${location.pathname}, isLoading: ${isLoading}, isProfileLoading: ${isProfileLoading}, user: ${user?.id || 'none'}, onboarding: ${userProfile?.onboarding_completed}`
      );
      loggedOnce.current = true;
    }
  }, [location.pathname, isLoading, isProfileLoading, user, userProfile]);

  const showLoading = isLoading || isProfileLoading;

  if (showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log("AuthRoute: User not authenticated, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (user && userProfile) {
    const isOnboardingPage = location.pathname === "/onboarding";
    const onboardingCompleted = userProfile.onboarding_completed;

    if (!onboardingCompleted && !isOnboardingPage) {
      console.log("AuthRoute: Onboarding not complete, redirecting to /onboarding");
      return <Navigate to="/onboarding" state={{ from: location }} replace />;
    }

    if (onboardingCompleted && isOnboardingPage) {
      console.log("AuthRoute: Onboarding complete, redirecting from /onboarding to /");
      return <Navigate to={location.state?.from?.pathname || "/"} replace />;
    }
  }

  console.log("AuthRoute: User authenticated, rendering content");
  
  // Wrap the content in our MainLayout
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AuthRoute;
