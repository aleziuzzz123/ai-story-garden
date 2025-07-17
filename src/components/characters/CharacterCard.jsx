import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trash2, BookUp } from 'lucide-react';

const CharacterCard = ({ character, onDelete, onUseInStory }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="bg-white/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden group flex flex-col"
      variants={cardVariants}
    >
      <div className="aspect-square w-full overflow-hidden">
        <img 
          src={character.image_url} 
          alt={`Portrait of ${character.name}`} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4 text-white flex flex-col flex-grow">
        <h3 className="text-xl font-bold truncate">{character.name}</h3>
        <p className="text-sm opacity-80 h-10 overflow-hidden text-ellipsis flex-grow">{character.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <Button size="sm" className="bg-green-500/80 hover:bg-green-600/80" onClick={onUseInStory}>
            <BookUp className="w-4 h-4 mr-2" />
            Use in Story
          </Button>
          <Button size="icon" variant="destructive" className="rounded-full w-8 h-8 bg-red-500/80" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterCard;