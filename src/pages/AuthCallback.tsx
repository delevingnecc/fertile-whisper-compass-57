
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { getProfile, hasCompletedOnboarding } from '@/integrations/supabase/profiles';

const AuthCallback = () => {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(false);
    const [hasChecked, setHasChecked] = useState(false);

    useEffect(() => {
        // Only run this effect once authentication is loaded and only once
        if (isLoading || hasChecked) return;

        const handleRedirect = async () => {
            setIsCheckingOnboarding(true);
            try {
                // Check if user is authenticated
                if (!user) {
                    console.log('[AuthCallback] No user found after auth callback');
                    throw new Error("Authentication failed");
                }

                console.log('[AuthCallback] User authenticated, checking if anonymous user');
                
                // Check if user is anonymous
                const isAnonymous = user.app_metadata?.is_anonymous || 
                                    user.email?.includes('@anonymous.user');
                
                console.log('[AuthCallback] User type:', isAnonymous ? 'anonymous' : 'registered');
                
                // For anonymous users, we'll check and create a profile if needed
                if (isAnonymous) {
                    // Try to get or create a profile for anonymous users
                    await getProfile(user.id, true);
                }
                
                // Check if user has already completed onboarding
                const completed = await hasCompletedOnboarding(user.id);
                
                setHasChecked(true);
                console.log('[AuthCallback] Onboarding status:', { completed });

                // Decide where to redirect
                if (!completed) {
                    console.log('[AuthCallback] Redirecting to onboarding');
                    navigate('/onboarding', { replace: true });
                } else {
                    console.log('[AuthCallback] Redirecting to home');
                    navigate('/', { replace: true });
                }

                toast({
                    title: "Success!",
                    description: "You've been successfully authenticated."
                });
            } catch (error) {
                console.error('[AuthCallback] Auth callback error:', error);
                toast({
                    variant: "destructive",
                    title: "Authentication Failed",
                    description: "There was a problem with your authentication. Please try again."
                });
                navigate('/auth', { replace: true });
            } finally {
                setIsCheckingOnboarding(false);
            }
        };

        handleRedirect();
    }, [user, isLoading, navigate, toast, hasChecked]);

    // Show loading spinner while processing
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
