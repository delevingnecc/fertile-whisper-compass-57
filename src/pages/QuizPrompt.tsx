
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

const QuizPrompt = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartQuiz = async () => {
    // In the future this would navigate to the actual quiz
    // For now, we'll just mark that the user has seen the welcome screen
    if (user) {
      try {
        await supabase
          .from('user_profiles')
          .update({ has_seen_welcome: true })
          .eq('id', user.id);
      } catch (error) {
        console.error('Failed to update profile:', error);
      }
    }
    
    // Navigate to home (where they'll see the actual quiz later)
    navigate('/home');
  };

  const handleSkip = async () => {
    // If the user skips, we don't mark the welcome screen as seen
    // This way they'll see the welcome screen on their first visit to home
    navigate('/home');
  };

  const handleClose = () => {
    navigate('/onboarding');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-5 relative">
      {/* Close button */}
      <button 
        onClick={handleClose}
        className="absolute top-6 left-5 p-1 z-10"
      >
        <X size={28} strokeWidth={1.5} />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {/* Illustration */}
        <div className="w-full max-w-xs mb-10">
          <img 
            src="/lovable-uploads/e895f1d8-e673-4d0e-9373-c9c4845ffc02.png"
            alt="Quiz illustration" 
            className="w-full h-auto"
          />
        </div>

        {/* Text content */}
        <div className="space-y-3 mb-10">
          <h1 className="text-3xl font-bold">
            Take our quick quiz to complete your profile
          </h1>
          <p className="text-gray-600 text-lg">
            Get a great profile in just a few minutes!
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-4 w-full max-w-md mx-auto mb-8">
        <Button 
          onClick={handleStartQuiz}
          className="w-full py-6 text-lg rounded-full bg-black hover:bg-gray-800 text-white"
        >
          Start the quiz
        </Button>
        
        <Button 
          onClick={handleSkip}
          variant="ghost" 
          className="w-full text-lg font-normal hover:bg-transparent hover:text-gray-600"
        >
          Maybe later
        </Button>
      </div>

      {/* Bottom indicator */}
      <div className="flex justify-center pb-4">
        <div className="w-10 h-1 bg-black rounded-full"></div>
      </div>
    </div>
  );
};

export default QuizPrompt;
