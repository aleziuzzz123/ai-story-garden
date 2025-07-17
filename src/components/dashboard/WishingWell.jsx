import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const storyIdeas = [
  "A brave knight who is afraid of the dark.",
  "A friendly dragon who can't breathe fire, but sneezes flowers instead.",
  "A squirrel who wants to collect moonbeams instead of acorns.",
  "A magical paintbrush that brings whatever it paints to life.",
  "Two best friends, a robot and a garden gnome, on a quest for the best pizza.",
  "A girl who discovers she can talk to cats, and they have a lot to say!",
  "A grumpy cloud that learns how to make rainbows.",
  "An underwater city populated by talking seahorses.",
  "A young wizard whose spells always have silly, unexpected results.",
  "A detective penguin who solves mysteries in the South Pole."
];

const WishingWell = () => {
  const [idea, setIdea] = useState(storyIdeas[0]);
  const [key, setKey] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const getNewIdea = () => {
    let newIdea = idea;
    while (newIdea === idea) {
      newIdea = storyIdeas[Math.floor(Math.random() * storyIdeas.length)];
    }
    setIdea(newIdea);
    setKey(prevKey => prevKey + 1);
  };

  const handleCreateWithIdea = () => {
    navigate('/create', { state: { prompt: idea } });
  };
  
  return (
    <motion.div
      className="bg-gradient-to-br from-cyan-400 to-blue-500 p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col justify-between h-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
    >
      <div>
        <h2 className="text-3xl font-bold text-white mb-4 text-center drop-shadow-md">Wishing Well</h2>
        <div className="relative text-center bg-white/20 backdrop-blur-md rounded-2xl p-4 min-h-[120px] flex items-center justify-center border border-white/30">
          <Sparkles className="absolute -top-3 -left-3 h-8 w-8 text-yellow-300 transform -rotate-12" />
          <Sparkles className="absolute -bottom-2 -right-2 h-6 w-6 text-yellow-300 transform rotate-12" />
          <AnimatePresence mode="wait">
            <motion.p
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="font-['Comic_Neue'] text-lg text-white font-semibold leading-snug drop-shadow"
            >
              "{idea}"
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <Button
          onClick={getNewIdea}
          size="lg"
          variant="outline"
          className="bg-white/30 text-white border-white/50 hover:bg-white/40 flex-1 rounded-full"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          New Idea
        </Button>
        <Button
          onClick={handleCreateWithIdea}
          size="lg"
          className="bg-white text-blue-500 hover:bg-blue-50 flex-1 rounded-full"
        >
          Create This!
        </Button>
      </div>
    </motion.div>
  );
};

export default WishingWell;