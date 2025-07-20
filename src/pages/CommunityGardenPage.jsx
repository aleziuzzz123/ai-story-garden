import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Loader2, Trees } from 'lucide-react';
import CommunityStorybookThumbnail from '@/components/dashboard/CommunityStorybookThumbnail';
import { Header } from '@/components/Header'; // Import the reusable Header

const CommunityGardenPage = () => {
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicStories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('stories')
          .select('id, title, thumbnail_url, created_at, profiles(username)')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStories(data);
      } catch (error) {
        toast({
          title: t('toast_community_fetch_error_title'),
          description: t('toast_community_fetch_error_desc'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPublicStories();
  }, [toast, t]);

  return (
    <>
      <Helmet>
        <title>{t('meta_title_community')}</title>
        <meta name="description" content={t('meta_description_community')} />
      </Helmet>

      <Header />

      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 text-white p-4 sm:p-6 md:p-8">
        <main className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <Trees className="mx-auto h-20 w-20 text-white/80 mb-4" />
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
              {t('community_page_title')}
            </h1>
            <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              {t('community_page_subtitle')}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-16 w-16 animate-spin text-white" />
            </div>
          ) : stories.length > 0 ? (
            <motion.div 
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-20"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.05 }
                }
              }}
            >
              {stories.map((story) => (
                <CommunityStorybookThumbnail
                  key={story.id}
                  story={story}
                  onRead={() => navigate(`/book/${story.id}`)}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-16 bg-white/20 backdrop-blur-lg rounded-3xl shadow-md border border-white/30"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img alt={t('alt_empty_garden')} className="w-40 h-40 mx-auto mb-4 opacity-80" src="/placeholder.svg" />
              <h3 className="text-2xl font-bold text-white">{t('community_page_empty_title')}</h3>
              <p className="text-white/80 mt-2 mb-6 max-w-sm mx-auto">
                {t('community_page_empty_desc')}
              </p>
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-full shadow-lg">
                  {t('community_page_share_my_story')}
                </Button>
              </Link>
            </motion.div>
          )}
        </main>
      </div>
    </>
  );
};

export default CommunityGardenPage;
