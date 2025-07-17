import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Trash2, Shuffle, Share2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StorybookThumbnail = ({ story, onRead, onDelete, onRemix, onPublish }) => {
  const [isPublished, setIsPublished] = useState(story.is_public);

  const handlePublish = (e) => {
    e.stopPropagation();
    if (isPublished) return;
    onPublish();
    setIsPublished(true);
  };

  const truncateTitle = (text, maxLength = 25) => {
    if (!text) return '';
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        <div className="absolute bottom-4 left-4 right-4">
           <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-2 rounded-md shadow-lg border-2 border-yellow-200/50 transform-gpu">
              <h3 className="text-sm font-bold text-white text-center truncate drop-shadow-sm px-2 font-['Comic_Neue']">
                {truncateTitle(story.title)}
              </h3>
          </div>
        </div>
        
        <motion.div 
          className="absolute inset-0 border-4 border-purple-500/80 rounded-lg pointer-events-none"
          initial={{ opacity: 0 }}
          variants={{ hover: { opacity: 1 } }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </motion.div>

      <motion.div 
        className="mt-6 flex justify-center items-center flex-wrap gap-2 opacity-0"
        variants={{
          hover: { opacity: 1, y: -10 }
        }}
        transition={{ delay: 0.1 }}
      >
        <Button onClick={onRead} size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105">
          <BookOpen className="mr-2 h-4 w-4" />
          Read
        </Button>
        <Button onClick={onRemix} size="sm" variant="outline" className="rounded-full bg-white/80 backdrop-blur-sm border-purple-300 text-purple-600 hover:bg-white hover:text-purple-700 hover:border-purple-400 transform hover:scale-105 transition-all shadow-lg">
          <Shuffle className="mr-2 h-4 w-4" />
          Remix
        </Button>
        <Button onClick={handlePublish} disabled={isPublished} size="sm" variant="outline" className={`rounded-full transform hover:scale-105 transition-all shadow-lg ${isPublished ? 'bg-green-100 border-green-300 text-green-700 cursor-not-allowed' : 'bg-white/80 backdrop-blur-sm border-blue-300 text-blue-600 hover:bg-white hover:text-blue-700 hover:border-blue-400'}`}>
          {isPublished ? <CheckCircle className="mr-2 h-4 w-4" /> : <Share2 className="mr-2 h-4 w-4" />}
          {isPublished ? 'Shared' : 'Share'}
        </Button>
        <Button onClick={(e) => {e.stopPropagation(); onDelete();}} size="icon" variant="destructive" className="rounded-full bg-red-400/80 hover:bg-red-500 w-8 h-8 transform hover:scale-110 transition-all shadow-lg">
          <Trash2 className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default StorybookThumbnail;