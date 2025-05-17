
import React from 'react';
import { motion } from 'framer-motion';

const FloatingElephant = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <motion.div 
        initial={{ y: 0 }}
        animate={{ 
          y: [-20, 0, -20],
          rotate: [0, 2, 0, -2, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut" 
        }}
        className="mb-6"
      >
        <img 
          src="/lovable-uploads/eb70d7b3-a429-42b6-aa8d-6f378554327b.png" 
          alt="Eve the elephant" 
          className="h-60 w-auto" // Changed from h-40 to h-60 (50% bigger)
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center"
      >
        <p className="text-lg mb-2 text-primary-700 font-medium">
          Hi there! I'm Eve, your fertility companion.
        </p>
        <p className="text-base text-gray-600">
          Send me a message to get started!
        </p>
      </motion.div>
    </div>
  );
};

export default FloatingElephant;
