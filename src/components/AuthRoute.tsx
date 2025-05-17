
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Log route information for debugging
  useEffect(() => {
    console.log(`AuthRoute: Path ${location.pathname}, isLoading: ${isLoading}, user: ${user?.id || 'none'}`);
  }, [location.pathname, isLoading, user]);

  // If still loading, show loading spinner
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // If not authenticated and not on an auth page, redirect to login
  if (!user) {
    console.log("AuthRoute: User not authenticated, redirecting to login");
    
    // Only redirect if we're not already on an auth page
    if (!location.pathname.startsWith("/auth")) {
      return <Navigate to="/auth" state={{ from: location }} replace />;
    }
  }

  // If authenticated, render the protected content
  console.log("AuthRoute: User authenticated or on auth page, rendering content");
  return <Outlet />;
};

export default AuthRoute;
