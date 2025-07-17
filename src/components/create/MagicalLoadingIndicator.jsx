import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Wand2 } from 'lucide-react';

const icons = [
  <Sparkles key="sparkles" className="h-12 w-12 text-yellow-300" />,
  <BookOpen key="book" className="h-12 w-12 text-blue-300" />,
  <Wand2 key="wand" className="h-12 w-12 text-pink-300" />,
];

const MagicalLoadingIndicator = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50"
    >
      <div className="relative w-48 h-48 flex items-center justify-center">
        {icons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.5],
              rotate: [0, 180, 360, 360],
              x: [0, Math.cos((i * 2 * Math.PI) / 3) * 60, Math.cos((i * 2 * Math.PI) / 3) * 60, 0],
              y: [0, Math.sin((i * 2 * Math.PI) / 3) * 60, Math.sin((i * 2 * Math.PI) / 3) * 60, 0],
            }}
            transition={{
              duration: 4,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            {icon}
          </motion.div>
        ))}
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <Sparkles className="h-16 w-16 text-white" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-white text-2xl font-bold mt-8 text-center px-4"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default MagicalLoadingIndicator;