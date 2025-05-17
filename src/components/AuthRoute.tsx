
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";

const AuthRoute = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner for a maximum of 1 second
  // This prevents an endless loading state if something goes wrong
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

  // If not authenticated, redirect to login
  if (!user) {
    console.log("AuthRoute: User not authenticated, redirecting to login");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected content
  console.log("AuthRoute: User authenticated, rendering protected content");
  return <Outlet />;
};

export default AuthRoute;
