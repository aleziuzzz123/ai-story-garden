import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const authorLevels = [
  { name: 'Sprout', threshold: 0, next: 2 },
  { name: 'Budding Author', threshold: 2, next: 5 },
  { name: 'Story Weaver', threshold: 5, next: 10 },
  { name: 'Dream Architect', threshold: 10, next: 20 },
  { name: 'Master Storyteller', threshold: 20, next: Infinity },
];

const AuthorStats = ({ storyCount, creativeStreak }) => {
  const currentLevel = authorLevels.slice().reverse().find(level => storyCount >= level.threshold) || authorLevels[0];
  const nextLevel = authorLevels.find(level => level.threshold > currentLevel.threshold);

  const progressPercentage = nextLevel
    ? Math.min(((storyCount - currentLevel.threshold) / (nextLevel.threshold - currentLevel.threshold)) * 100, 100)
    : 100;

  return (
    <motion.div 
      className="flex items-center space-x-4 sm:space-x-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-semibold text-white/80 drop-shadow">Author Level: {currentLevel.name}</span>
          {nextLevel && (
            <span className="text-xs font-medium text-white/70">{storyCount}/{nextLevel.threshold}</span>
          )}
        </div>
        <Progress value={progressPercentage} className="h-2 bg-white/20 [&>div]:bg-gradient-to-r [&>div]:from-yellow-300 [&>div]:to-orange-400" />
      </div>
      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/30 shadow-sm">
        <Flame className="h-5 w-5 text-orange-400 drop-shadow-md" />
        <span className="font-bold text-lg text-white drop-shadow-md">{creativeStreak}</span>
        <span className="text-sm text-white/80 -ml-1">Streak</span>
      </div>
    </motion.div>
  );
};

export default AuthorStats;