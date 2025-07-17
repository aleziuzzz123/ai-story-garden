import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const LatestSticker = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <Link to="/sticker-book">
      <motion.div
        className="relative w-48 h-48 cursor-pointer group"
        whileHover="hover"
        initial="initial"
        animate="initial"
      >
        <motion.img
          src={imageUrl}
          alt="Latest unlocked sticker"
          className="w-full h-full object-contain drop-shadow-2xl"
          variants={{
            initial: {
              rotate: -8,
            },
            hover: {
              rotate: 0,
              scale: 1.1,
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            },
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-br from-white/50 to-transparent"
          style={{
            clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            transformOrigin: 'bottom right',
          }}
          variants={{
            initial: {
              rotate: 0,
              scale: 1,
            },
            hover: {
              rotate: -20,
              scale: 1.5,
              transition: { type: 'spring', stiffness: 300, damping: 15 },
            },
          }}
        />
      </motion.div>
    </Link>
  );
};

export default LatestSticker;