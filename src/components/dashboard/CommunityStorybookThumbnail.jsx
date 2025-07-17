import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CommunityStorybookThumbnail = ({ story, onRead }) => {
  const truncateTitle = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  const authorName = story.profiles?.username?.split('@')[0] || 'A Storyteller';

  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover="hover"
    >
      <motion.div 
        className="relative w-full aspect-[3/4] rounded-lg shadow-lg overflow-hidden cursor-pointer"
        variants={{
          hover: {
            y: -8,
            scale: 1.05,
            boxShadow: '0px 15px 30px -10px rgba(128, 90, 213, 0.5)',
          }
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        onClick={onRead}
      >
        <img
          src={story.thumbnail_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'}
          alt={`Cover for ${story.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4 text-center">
           <h3 className="text-base font-bold text-white truncate drop-shadow-md font-['Comic_Neue']">
              {truncateTitle(story.title)}
           </h3>
        </div>
        
        <motion.div 
          className="absolute inset-0 border-4 border-purple-500/80 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          variants={{ hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>

      <div className="mt-4 text-center">
        <p className="text-sm text-white/80 flex items-center justify-center gap-1.5">
          <User className="w-4 h-4" />
          <span>by {authorName}</span>
        </p>
        <motion.div 
          className="mt-2 flex justify-center"
          initial={{ opacity: 0 }}
          variants={{ hover: { opacity: 1 } }}
          transition={{ delay: 0.1 }}
        >
          <Button onClick={onRead} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
            <BookOpen className="mr-2 h-4 w-4" />
            Read Story
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CommunityStorybookThumbnail;