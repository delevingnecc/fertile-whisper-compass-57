
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

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
                
                toast({
                    title: "Success!",
                    description: "You've been successfully authenticated."
                });
                
                // Simply navigate to home page without any checks
                navigate('/', { replace: true });
            } catch (error) {
                console.error('AuthCallback: Auth callback error:', error);
                toast({
                    variant: "destructive",
                    title: "Authentication Failed",
                    description: "There was a problem with your authentication. Please try again."
                });
                navigate('/auth', { replace: true });
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
