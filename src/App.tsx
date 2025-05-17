
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Community from "./pages/Community";
import NewCommunityPost from "./pages/NewCommunityPost";
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
import MainLayout from "./components/MainLayout";

// Create the query client outside of component rendering
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Route to handle the index page redirect */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            
            {/* Protected routes with MainLayout */}
            <Route element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }>
              <Route path="/home" element={<Home />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/new-post" element={<NewCommunityPost />} />
              <Route path="/clinician" element={<Clinician />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/products" element={<Products />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/onboarding" element={<Onboarding />} />
            </Route>
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
