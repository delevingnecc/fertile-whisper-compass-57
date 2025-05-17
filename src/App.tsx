
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public routes - no auth required */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected routes - wrapped in AuthProvider */}
          <Route element={<AuthProvider><ProtectedLayout /></AuthProvider>}>
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/" element={<Home />} />
            <Route path="/community" element={<Community />} />
            <Route path="/clinician" element={<Clinician />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/products" element={<Products />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
