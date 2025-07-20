import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Header } from '@/components/Header'; // Import the reusable Header

const StickerBookPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('meta_title_sticker_book')}</title>
        <meta name="description" content={t('meta_description_sticker_book')} />
      </Helmet>
      
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 text-white p-4 sm:p-6 lg:p-8">
        <main className="container mx-auto text-center flex items-center justify-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="bg-white/20 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-2xl border border-white/30"
          >
            <Sparkles className="h-20 w-20 mx-auto text-yellow-300 mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white drop-shadow-lg">{t('sticker_book_coming_soon')}</h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8">
              {t('sticker_book_coming_soon_desc')}
            </p>
            <Link to="/create">
              <Button size="lg" className="bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
                {t('sticker_book_create_story_button')}
              </Button>
            </Link>
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default StickerBookPage;