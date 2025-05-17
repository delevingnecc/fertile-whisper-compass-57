
import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

type WelcomeScreenProps = {
  onGetStarted: () => void;
};

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-primary-50 p-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-md text-center"
      >
        <motion.div 
          className="mb-8 flex justify-center"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <img 
            src="/lovable-uploads/eb70d7b3-a429-42b6-aa8d-6f378554327b.png" 
            alt="Elephant mascot" 
            className="h-40 w-auto"
          />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-3 text-primary-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Welcome to FertilityPal
        </motion.h1>
        
        <motion.p 
          className="text-lg mb-8 text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Your personal fertility companion on your journey to wellness
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <Button 
            onClick={onGetStarted}
            className="w-full py-6 text-lg bg-primary hover:bg-primary-700"
          >
            Get Started
          </Button>
          <Button 
            variant="link" 
            className="text-primary-700"
            onClick={onGetStarted}
          >
            I already have an account
          </Button>
        </motion.div>
      </motion.div>
      
      <p className="text-xs text-gray-500 absolute bottom-6">
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </div>
  );
};

export default WelcomeScreen;
