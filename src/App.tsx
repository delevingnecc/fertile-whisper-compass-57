
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
import AuthGuard from "./components/AuthGuard";

// Create the query client instance outside of the component to avoid recreating it on each render
const queryClient = new QueryClient();

const App = () => (
  // BrowserRouter is now the outermost wrapper to prevent routing issues
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
            <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
            <Route path="/community" element={<AuthGuard><Community /></AuthGuard>} />
            <Route path="/clinician" element={<AuthGuard><Clinician /></AuthGuard>} />
            <Route path="/progress" element={<AuthGuard><Progress /></AuthGuard>} />
            <Route path="/products" element={<AuthGuard><Products /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
