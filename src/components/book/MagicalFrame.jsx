import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const MagicalFrame = ({ children }) => {
  return (
    <div className="relative w-full p-2 bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl shadow-lg">
      <div className="absolute -top-2 -left-2 w-1/2 h-1/2 border-t-4 border-l-4 border-green-300 rounded-tl-2xl"></div>
      <div className="absolute -bottom-2 -right-2 w-1/2 h-1/2 border-b-4 border-r-4 border-green-300 rounded-br-2xl"></div>
      
      <motion.div
        className="absolute top-0 left-0"
        animate={{ x: [0, 5, 0], y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <Sparkles className="h-6 w-6 text-yellow-300 opacity-80" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-0 right-0"
        animate={{ x: [0, -5, 0], y: [0, 5, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut', delay: 2 }}
      >
        <Sparkles className="h-8 w-8 text-pink-300 opacity-80" />
      </motion.div>

      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default MagicalFrame;