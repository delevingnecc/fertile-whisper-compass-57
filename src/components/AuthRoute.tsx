import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";

const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [localLoading, setLocalLoading] = useState(true);
  
  // Set a shorter local timeout to prevent UI hanging
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 1000); // Only show loading spinner for 1 second max
    
    return () => clearTimeout(timer);
  }, []);

  // Log route information for debugging
  useEffect(() => {
    console.log(`AuthRoute: Path ${location.pathname}, isLoading: ${isLoading}, user: ${user?.id || 'none'}`);
  }, [location.pathname, isLoading, user]);

  // Use a combination of auth loading state and local loading state
  const showLoading = isLoading && localLoading;
  
  // If still loading, show loading spinner, but only briefly
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

  // If not authenticated, redirect to login
  if (!user) {
    console.log("AuthRoute: User not authenticated, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }
  
  // Otherwise render the protected content
  console.log("AuthRoute: User authenticated, rendering content");
  return <Outlet />;
};

export default AuthRoute;
