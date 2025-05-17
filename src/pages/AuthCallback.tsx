
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { hasCompletedOnboarding } from '@/integrations/supabase/profiles';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        console.log("AuthCallback: Processing authentication callback");
        
        const processAuthCallback = async () => {
            try {
                // First, parse the hash from the URL if present (needed for some OAuth providers)
                const hashParams = new URLSearchParams(window.location.hash.substring(1));
                const accessToken = hashParams.get('access_token');
                const refreshToken = hashParams.get('refresh_token');
                
                if (accessToken && refreshToken) {
                    console.log("AuthCallback: Found tokens in URL hash, setting session");
                    try {
                        const { data, error } = await supabase.auth.setSession({
                            access_token: accessToken,
                            refresh_token: refreshToken
                        });
                        
                        if (error) throw error;
                        console.log("AuthCallback: Successfully set session from hash params");
                    } catch (error) {
                        console.error("AuthCallback: Error setting session from hash params:", error);
                    }
                }
                
                // Check if the user is authenticated
                const { data: { user } } = await supabase.auth.getUser();
                
                // Check if user is authenticated
                if (!user) {
                    console.log("AuthCallback: No authenticated user");
                    throw new Error("Authentication failed");
                }
                
                console.log("AuthCallback: User authenticated:", user.id);

                // Check if user has already completed onboarding
                const completed = await hasCompletedOnboarding(user.id);
                console.log("AuthCallback: Onboarding completed:", completed);

                // Decide where to redirect
                if (!completed) {
                    console.log("AuthCallback: Redirecting to onboarding");
                    navigate('/onboarding', { replace: true });
                } else {
                    console.log("AuthCallback: Redirecting to home");
                    navigate('/', { replace: true });
                }

                toast({
                    title: "Success!",
                    description: "You've been successfully authenticated."
                });
            } catch (error) {
                console.error('AuthCallback: Auth callback error:', error);
                toast({
                    variant: "destructive",
                    title: "Authentication Failed",
                    description: "There was a problem with your authentication. Please try again."
                });
                navigate('/auth', { replace: true });
            } finally {
                setIsProcessing(false);
            }
        };

        processAuthCallback();
    }, [navigate, toast]);

    // Show loading spinner while processing
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
};

export default AuthCallback;
