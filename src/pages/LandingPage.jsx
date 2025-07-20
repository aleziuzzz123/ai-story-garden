// src/pages/LandingPage.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Sparkles, Trees, EarOff as AudioLines, Star, Trophy, Wand2, HeartHandshake, Users, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import CommunityStorybookThumbnail from '@/components/dashboard/CommunityStorybookThumbnail';
import { useToast } from "@/components/ui/use-toast";
import { Header } from '@/components/Header'; // Import the new reusable Header

const LandingPage = () => {
  const { t } = useTranslation(); // Initialize translation hook
  const [communityStories, setCommunityStories] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchCommunityStories = async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, thumbnail_url, profiles(username)')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(4);

      if (error) {
        console.error("Error fetching community stories:", error);
      } else {
        setCommunityStories(data);
      }
    };
    fetchCommunityStories();
  }, []);

  // Use translation keys for features
  const features = [
    { icon: Wand2, titleKey: "home_feature_ai_story_title", descriptionKey: "home_feature_ai_story_desc" },
    { icon: AudioLines, titleKey: "home_feature_narration_title", descriptionKey: "home_feature_narration_desc" },
    { icon: Users, titleKey: "home_feature_cast_title", descriptionKey: "home_feature_cast_desc" },
    { icon: HeartHandshake, titleKey: "home_feature_community_title", descriptionKey: "home_feature_community_desc" },
    { icon: Star, titleKey: "home_feature_stickers_title", descriptionKey: "home_feature_stickers_desc" },
    { icon: Trophy, titleKey: "home_feature_creativity_title", descriptionKey: "home_feature_creativity_desc" }
  ];

  const handleVideoPlaceholderClick = () => {
    toast({
      title: t('toast_coming_soon_title'),
      description: t('toast_coming_soon_video_desc'),
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('meta_title_landing')}</title>
        <meta name="description" content={t('meta_description_landing')} />
      </Helmet>
      
      {/* Use the new reusable Header */}
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t('home_main_title')}
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              {t('home_subtitle')}
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="mr-2 h-6 w-6" />
                  {t('signup_button')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Promo Video Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">{t('home_magic_in_action')}</h2>
            <p className="text-xl text-white/80">{t('home_magic_in_action_subtitle')}</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div 
              className="relative aspect-video bg-black/50 rounded-2xl shadow-2xl overflow-hidden border border-white/20 cursor-pointer group"
              onClick={handleVideoPlaceholderClick}
            >
              <img 
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                alt={t('alt_promo_thumbnail')}
               src="https://images.unsplash.com/photo-1690681234542-361f2aecdbac" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300">
                <PlayCircle className="h-24 w-24 text-white/70 group-hover:text-white transition-all duration-300 transform group-hover:scale-110" />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Community Garden Section */}
        {communityStories.length > 0 && (
          <section className="container mx-auto px-4 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-white mb-4">{t('home_community_garden_title')}</h2>
              <p className="text-xl text-white/80">{t('home_community_garden_subtitle')}</p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20 max-w-6xl mx-auto">
              {communityStories.map((story) => (
                <CommunityStorybookThumbnail
                  key={story.id}
                  story={story}
                  onRead={() => navigate('/login')}
                />
              ))}
            </div>
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16"
            >
              <Link to="/login">
                <Button size="lg" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-lg px-8 py-3 rounded-full shadow-lg transform hover:scale-105 hover:bg-white/30 transition-all duration-300">
                  <Trees className="mr-2 h-5 w-5" />
                  {t('home_explore_garden')}
                </Button>
              </Link>
            </motion.div>
          </section>
        )}

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{t('home_features_title')}</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">{t('home_features_subtitle')}</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.1 }}
                className="text-left bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-lg flex flex-col"
              >
                <div className="flex-shrink-0 bg-gradient-to-r from-yellow-300 to-orange-300 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5 shadow-md">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{t(feature.titleKey)}</h3>
                <p className="text-white/80 text-base leading-relaxed">{t(feature.descriptionKey)}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-white mb-4">{t('home_ready_to_create')}</h2>
            <p className="text-xl text-white/80 mb-8">{t('home_join_us')}</p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                {t('home_start_creating')}
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;