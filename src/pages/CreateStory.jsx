import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Sparkles, Wand2, Users } from 'lucide-react';
import StoryForm from '@/components/create/StoryForm';
import { handleStoryGeneration } from '@/components/create/storyGenerator';
import { useAuth } from '@/contexts/SupabaseAuthContext.jsx';
import MagicalLoadingIndicator from '@/components/create/MagicalLoadingIndicator';
import { supabase } from '@/lib/customSupabaseClient';

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
        title: "Wishing Well idea added! ✨",
        description: "Your story idea is ready. Just add characters and a setting!",
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
        title: "Ready to Remix! 🎨",
        description: "Your story has been loaded. Time to add a new twist!",
      });
      window.history.replaceState({}, document.title);
    } else if (location.state?.character) {
      const { name, description } = location.state.character;
      setFormData(prev => ({
        ...prev,
        characters: `${name}, who is ${description}`,
      }));
      toast({
        title: "Character Ready! 🎭",
        description: `${name} is ready for their close-up! Just add a plot and setting.`,
      });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);

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
      title: "Voilà! Inspiration served! ✨",
      description: "A fun new story idea has been filled in for you.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "You're not logged in!",
        description: "Please log in to create a story.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setLoadingMessage("Let the magic begin...");
    try {
      await handleStoryGeneration(formData, user, creditCost, setLoadingMessage, toast, navigate);
    } catch (error) {
      toast({
        title: "Oh no, a hiccup!",
        description: error.message || "Something went wrong while creating your story. Please try again.",
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
        <title>Create a New Story - AI Story Garden</title>
        <meta name="description" content="Bring your story idea to life. Describe your character, plot, and setting, and let our AI do the rest." />
      </Helmet>
      <AnimatePresence>
        {loading && <MagicalLoadingIndicator message={loadingMessage} />}
      </AnimatePresence>
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 p-4 sm:p-6 md:p-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center mb-6">
              <Link to="/dashboard">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">AI Story Garden</span>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800">Create Your Magical Story</h1>
                <p className="text-gray-600 mt-2">Fill in the details below, or get some inspiration!</p>
              </div>

              <div className="flex justify-center gap-4 mb-8">
                <Button onClick={handleGetInspiration} variant="secondary" className="bg-yellow-300 text-yellow-900 hover:bg-yellow-400 shadow-lg transform hover:scale-105 transition-transform">
                  <Wand2 className="h-5 w-5 mr-2" />
                  Get Inspiration
                </Button>
                 <Link to="/my-cast">
                  <Button variant="secondary" className="bg-blue-300 text-blue-900 hover:bg-blue-400 shadow-lg transform hover:scale-105 transition-transform">
                    <Users className="h-5 w-5 mr-2" />
                    Choose from My Cast
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