import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
type WelcomeScreenProps = {
  onGetStarted: () => void;
};
const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted
}) => {
  return <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-white to-primary-50 p-6 pb-8">
      <div className="w-full max-w-md flex flex-col items-center justify-center flex-1">
        <motion.div initial={{
        y: 30,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.7
      }} className="w-full text-center">
          <motion.div className="mb-8 flex justify-center" animate={{
          y: [0, -10, 0]
        }} transition={{
          repeat: Infinity,
          duration: 2.5,
          ease: "easeInOut"
        }}>
            <img src="/lovable-uploads/eb70d7b3-a429-42b6-aa8d-6f378554327b.png" alt="Eve the elephant" className="h-48 w-auto" />
          </motion.div>
          
          <motion.h1 initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.3,
          duration: 0.5
        }} className="mb-4 text-primary-800 font-extrabold text-4xl">
            Meet Eve
          </motion.h1>
          
          <motion.p initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5,
          duration: 0.5
        }} className="text-xl mb-3 text-gray-700 font-semibold">
            Your AI companion on your journey to wellness
          </motion.p>
          
          <motion.p className="text-lg mb-6 text-gray-600" initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.7,
          duration: 0.5
        }}>
            Eve is here to provide guidance, support, and personalized advice for your fertility health
          </motion.p>
        </motion.div>
      </div>
      
      <motion.div className="w-full max-w-md" initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      delay: 0.9,
      duration: 0.5
    }}>
        <Button onClick={onGetStarted} className="w-full py-6 text-lg bg-primary hover:bg-primary-700 rounded-xl">
          Start chatting with Eve
        </Button>
      </motion.div>
      
      <p className="text-xs text-gray-500 mt-6">
        By continuing, you agree to our Terms and Privacy Policy
      </p>
    </div>;
};
export default WelcomeScreen;