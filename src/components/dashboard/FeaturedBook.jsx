import React from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';

const FeaturedBook = ({ image, title, alt }) => {
  const { toast } = useToast();

  const handleClick = () => {
    toast({
      title: '🚧 Coming Soon!',
      description: "This featured story isn't ready for reading yet, but it will be soon! 🚀",
    });
  };

  return (
    <motion.div
      className="flex-shrink-0 w-40 cursor-pointer group"
      onClick={handleClick}
      whileHover={{ y: -10, scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="relative aspect-[3/4] rounded-lg shadow-2xl overflow-hidden">
        <img-replace
          className="w-full h-full object-cover"
          src={image}
          alt={alt}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-bold text-sm text-center drop-shadow-md truncate">{title}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedBook;