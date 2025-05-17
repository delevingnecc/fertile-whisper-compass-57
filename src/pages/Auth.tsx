
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple } from "@fortawesome/free-brands-svg-icons";
import { hasCompletedOnboarding } from '@/integrations/supabase/profiles';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address"
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters"
  })
});
const signupSchema = loginSchema.extend({
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

const Auth = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  // Check if user is already authenticated
  useEffect(() => {
    console.log("Auth page: Checking authentication status");
    
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Auth page: Current user:", user?.id || "none");
        
        if (user) {
          // User is authenticated, check if onboarding is complete
          const onboardingComplete = await hasCompletedOnboarding(user.id);
          console.log("Auth page: Onboarding complete:", onboardingComplete);
          
          // Redirect based on onboarding status
          if (onboardingComplete) {
            console.log("Auth page: Redirecting to home page, onboarding complete");
            navigate("/", { replace: true });
          } else {
            console.log("Auth page: Redirecting to onboarding page, onboarding incomplete");
            navigate("/onboarding", { replace: true });
          }
        }
      } catch (error) {
        console.error("Auth page: Error checking authentication status:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleLogin = async (values: LoginFormValues) => {
    console.log("Auth page: Attempting login with email:", values.email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) throw error;
      console.log("Auth page: Login successful, user:", data.user?.id);

      toast({
        title: "Success!",
        description: "You've been logged in successfully."
      });

      // After successful login, we let authentication state propagate
      // The auth change will be picked up by onAuthStateChange and redirected appropriately
    } catch (error: any) {
      console.error("Auth page: Login error:", error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignup = async (values: SignupFormValues) => {
    setIsLoading(true);
    console.log("Auth page: Attempting signup with email:", values.email);
    
    supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: window.location.origin + '/auth/callback'
      }
    }).then(({ data, error }) => {
      if (error) {
        console.error("Auth page: Signup error:", error);
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message || "Please try again later."
        });
        return;
      }
      
      console.log("Auth page: Signup successful, user:", data.user?.id);
      toast({
        title: "Account created!",
        description: "Please check your email to verify your account."
      });
    }).finally(() => {
      setIsLoading(false);
    });
  };
  
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    console.log(`Auth page: Attempting ${provider} login`);
    
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      }
    }).then(({ data, error }) => {
      if (error) {
        console.error(`Auth page: ${provider} login error:`, error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || `Failed to sign in with ${provider}. Please try again.`
        });
      }
      // The user will be redirected, so we don't need to do anything here
    }).catch(error => {
      console.error(`Auth page: Unexpected ${provider} login error:`, error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: `An unexpected error occurred. Please try again.`
      });
    }).finally(() => {
      setSocialLoading(null);
    });
  };
  
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-primary-50 px-4">
    <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <div className="mb-6 text-center">
        <motion.div className="flex justify-center mb-4" animate={{
          y: [0, -5, 0]
        }} transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}>
          <img src="/lovable-uploads/eb70d7b3-a429-42b6-aa8d-6f378554327b.png" alt="Elephant mascot" className="h-20 w-auto" />
        </motion.div>
        <h1 className="text-2xl font-bold text-primary-800">Welcome to FertilityPal</h1>
        <p className="text-gray-600 mt-1">Your personal fertility companion</p>
      </div>

      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField control={loginForm.control} name="email" render={({
                field
              }) => <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={loginForm.control} name="password" render={({
                field
              }) => <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {/* Google Sign-In Button - Following Brand Guidelines */}
                <Button type="button" variant="outline" onClick={() => handleSocialLogin('google')} disabled={!!socialLoading} className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 flex items-center justify-center gap-2">
                  <img src="/lovable-uploads/551a6746-11e9-4669-9d6e-133ec8b8e6b4.png" alt="Google logo" className="w-5 h-5 mr-1" />
                  <span>Sign in with Google</span>
                </Button>

                {/* Apple Sign-In Button - Following Brand Guidelines */}
                <Button type="button" variant="outline" onClick={() => handleSocialLogin('apple')} disabled={!!socialLoading} className="w-full bg-black hover:bg-gray-900 text-white border-black">
                  <FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
                  <span>Sign in with Apple</span>
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>

        <TabsContent value="signup">
          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <FormField control={signupForm.control} name="email" render={({
                field
              }) => <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={signupForm.control} name="password" render={({
                field
              }) => <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <FormField control={signupForm.control} name="confirmPassword" render={({
                field
              }) => <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                {/* Google Sign-In Button - Following Brand Guidelines */}
                <Button type="button" variant="outline" onClick={() => handleSocialLogin('google')} disabled={!!socialLoading} className="w-full bg-white hover:bg-gray-50 text-gray-700 border-gray-300 flex items-center justify-center gap-2">
                  <img src="/lovable-uploads/551a6746-11e9-4669-9d6e-133ec8b8e6b4.png" alt="Google logo" className="w-5 h-5 mr-1" />
                  <span>Google</span>
                </Button>

                {/* Apple Sign-In Button - Following Brand Guidelines */}
                <Button type="button" variant="outline" onClick={() => handleSocialLogin('apple')} disabled={!!socialLoading} className="w-full bg-black hover:bg-gray-900 text-white border-black">
                  <FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
                  <span>Apple</span>
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </motion.div>
  </div>;
};

export default Auth;
