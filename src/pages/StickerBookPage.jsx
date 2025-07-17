import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, Home, BookMarked } from 'lucide-react';

const StickerBookPage = () => {
  return (
    <>
      <Helmet>
        <title>My Sticker Book - AI Story Garden</title>
        <meta name="description" content="Collect and view all your magical stickers unlocked from your stories." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-white p-4 sm:p-6 lg:p-8">
        <header className="container mx-auto flex justify-between items-center mb-12">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <BookMarked className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">My Sticker Book</span>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </header>

        <main className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30"
          >
            <Sparkles className="h-20 w-20 mx-auto text-yellow-300 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-lg">Coming Soon!</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              Your magical sticker collection will live here! Soon, you'll be able to see all the wonderful characters you've unlocked from your storybook adventures.
            </p>
            <Link to="/create">
              <Button size="lg" className="bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                Create a New Story to Unlock Stickers
              </Button>
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default StickerBookPage;