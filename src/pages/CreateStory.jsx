import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Wand2, Users } from 'lucide-react';
import StoryForm from '@/components/create/StoryForm';
import { handleStoryGeneration } from '@/components/create/storyGenerator';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import MagicalLoadingIndicator from '@/components/create/MagicalLoadingIndicator';
import { supabase } from '@/lib/customSupabaseClient';
import { Header } from '@/components/Header';

const storySamples = [
  {
    characters: 'A brave little knight who is afraid of the dark.',
    plot: 'The knight must venture into the Whispering Woods at night to find a magical glowing flower that can bring light back to his kingdom, which has been plunged into darkness by a grumpy wizard.',
    setting: 'A medieval fantasy kingdom with a dark, enchanted forest.',
    illustrationStyle: 'classic-storybook',
  },
  {
    characters: 'A curious robot named Bolt who can talk to animals.',
    plot: 'Bolt discovers a secret plan by a group of mischievous squirrels to steal all the nuts from the city park for their winter hoard. With his animal friends, Bolt must create a clever plan to outsmart the squirrels and ensure everyone has enough food for winter.',
    setting: 'A bustling, futuristic city park.',
    illustrationStyle: '3d-cartoon',
  },
  {
    characters: 'A young witch named Willow who is still learning to control her magic.',
    plot: 'While trying to bake a magical birthday cake for her best friend, Willow accidentally mixes up a spell, causing all the desserts in the town to come to life. She must chase down and reverse the spell on dancing cupcakes and flying cookies before the birthday party starts.',
    setting: 'A charming, magical town where everything is a little bit enchanted.',
    illustrationStyle: 'whimsical-watercolor',
  },
  {
    characters: 'A shy octopus named Inky who loves to paint.',
    plot: 'Inky wants to enter the annual underwater art contest, but is too shy to show his work. A friendly dolphin encourages him to create a masterpiece in secret. On the day of the contest, a strong current threatens to ruin all the art, and only Inky, with his eight arms, can save the day and reveal his talent.',
    setting: 'A vibrant coral reef teeming with sea life.',
    illustrationStyle: 'vibrant-anime',
  }
];

const CreateStory = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [characters, setCharacters] = useState([]);
  const [formData, setFormData] = useState({
    characters: '',
    plot: '',
    setting: '',
    illustrationStyle: 'whimsical-watercolor',
    pageCount: 8,
    withImages: true,
    narratorVoiceId: '21m00Tcm4TlvDq8ikWAM', // Default voice
  });
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('characters')
        .select('name, description')
        .eq('user_id', user.id);
      if (error) {
        console.error("Error fetching characters:", error);
      } else {
        setCharacters(data);
      }
    };
    fetchCharacters();
  }, [user]);

  useEffect(() => {
    if (location.state?.prompt) {
      setFormData(prev => ({
        ...prev,
        plot: location.state.prompt,
      }));
      toast({
        title: t('toast_wishing_well_title'),
        description: t('toast_wishing_well_desc'),
      });
      window.history.replaceState({}, document.title)
    } else if (location.state?.remixPrompt) {
      const { characters, plot, setting, illustrationStyle } = location.state.remixPrompt;
      setFormData(prev => ({
        ...prev,
        characters: characters || '',
        plot: plot || '',
        setting: setting || '',
        illustrationStyle: illustrationStyle || 'whimsical-watercolor',
      }));
      toast({
        title: t('toast_remix_title'),
        description: t('toast_remix_desc'),
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.character) {
      const { name, description } = location.state.character;
      setFormData(prev => ({
        ...prev,
        characters: `${name}, who is ${description}`,
      }));
      toast({
        title: t('toast_character_ready_title'),
        description: t('toast_character_ready_desc', { name }),
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast, t]);

  const creditCost = useMemo(() => {
    const textCost = Math.ceil(formData.pageCount * 0.25);
    const imageCost = Math.ceil(formData.pageCount * 0.5);
    const totalCost = formData.withImages ? imageCost : textCost;
    return totalCost;
  }, [formData.pageCount, formData.withImages]);

  const handleGetInspiration = () => {
    const randomIndex = Math.floor(Math.random() * storySamples.length);
    const sample = storySamples[randomIndex];
    setFormData(prev => ({
      ...prev,
      characters: sample.characters,
      plot: sample.plot,
      setting: sample.setting,
      illustrationStyle: sample.illustrationStyle,
    }));
    toast({
      title: t('toast_inspiration_title'),
      description: t('toast_inspiration_desc'),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: t('toast_not_logged_in_title'),
        description: t('toast_not_logged_in_desc'),
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setLoadingMessage(t('create_page_loading_magic'));
    try {
      await handleStoryGeneration(formData, user, creditCost, setLoadingMessage, toast, navigate, t);
    } catch (error) {
      toast({
        title: t('toast_hiccup_title'),
        description: error.message || t('toast_hiccup_desc'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta_title_create_story')}</title>
        <meta name="description" content={t('meta_description_create_story')} />
      </Helmet>
      <AnimatePresence>
        {loading && <MagicalLoadingIndicator message={loadingMessage} />}
      </AnimatePresence>
      
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">{t('create_page_title')}</h1>
                <p className="text-gray-600 mt-2">{t('create_page_subtitle')}</p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <Button onClick={handleGetInspiration} variant="secondary" className="bg-yellow-300 text-yellow-900 hover:bg-yellow-400 shadow-lg transform hover:scale-105 transition-transform">
                  <Wand2 className="h-5 w-5 mr-2" />
                  {t('create_page_get_inspiration')}
                </Button>
                 <Link to="/my-cast">
                  <Button variant="secondary" className="bg-blue-300 text-blue-900 hover:bg-blue-400 shadow-lg transform hover:scale-105 transition-transform">
                    <Users className="h-5 w-5 mr-2" />
                    {t('create_page_choose_cast')}
                  </Button>
                </Link>
              </div>

              <StoryForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                creditCost={creditCost}
                loading={loading}
                characterList={characters}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default CreateStory;