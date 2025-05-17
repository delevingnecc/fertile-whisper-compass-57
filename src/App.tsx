
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProtectedLayout from "./components/ProtectedLayout";

// Create the query client instance outside of the component to avoid recreating it on each render
const queryClient = new QueryClient();

const App = () => (
  // BrowserRouter is the outermost wrapper to prevent routing issues
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes - no auth required */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected routes - wrapped in ProtectedLayout */}
            <Route path="/onboarding" element={<ProtectedLayout><Onboarding /></ProtectedLayout>} />
            <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
            <Route path="/community" element={<ProtectedLayout><Community /></ProtectedLayout>} />
            <Route path="/clinician" element={<ProtectedLayout><Clinician /></ProtectedLayout>} />
            <Route path="/progress" element={<ProtectedLayout><Progress /></ProtectedLayout>} />
            <Route path="/products" element={<ProtectedLayout><Products /></ProtectedLayout>} />
            <Route path="/profile" element={<ProtectedLayout><Profile /></ProtectedLayout>} />
            
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
