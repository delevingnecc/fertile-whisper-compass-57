import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import Clinician from "./pages/Clinician";
import Progress from "./pages/Progress";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import AuthCallback from "./pages/AuthCallback";
import { AuthProvider } from "./contexts/AuthProvider";
import AuthRoute from "./components/AuthRoute";

// Create the query client instance outside of the component to avoid recreating it on each render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60000, // 1 minute
    },
  },
});

// AppLayout component keeps AuthProvider from remounting on route changes
const AppLayout = () => (
  <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Outlet />
    </TooltipProvider>
  </AuthProvider>
);

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<AppLayout />}>
          {/* Public routes - accessible without authentication */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Routes that require authentication */}
          <Route element={<AuthRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/clinician" element={<Clinician />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
