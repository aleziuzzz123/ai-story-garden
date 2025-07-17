import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Trees, EarOff as AudioLines, Star, Trophy, Wand2, HeartHandshake, Users, PlayCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import CommunityStorybookThumbnail from '@/components/dashboard/CommunityStorybookThumbnail';
import { useToast } from "@/components/ui/use-toast";

const LandingPage = () => {
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

  const features = [
    {
      icon: Wand2,
      title: "AI Story & Illustration",
      description: "Turn simple ideas into fully illustrated storybooks with our powerful AI engine."
    },
    {
      icon: AudioLines,
      title: "Enchanting Narration",
      description: "Bring stories to life with professional audio narration in multiple languages and voices."
    },
    {
      icon: Users,
      title: "Create Your Own Cast",
      description: "Design unique characters with their own look and personality to star in your tales."
    },
    {
      icon: HeartHandshake,
      title: "Community Garden",
      description: "Share your creations with a vibrant community and get inspired by other storytellers."
    },
    {
      icon: Star,
      title: "Collect Magical Stickers",
      description: "Unlock and collect beautiful stickers from the illustrations in every story you create."
    },
    {
      icon: Trophy,
      title: "Level Up Your Creativity",
      description: "Track your progress with author levels, maintain creative streaks, and complete daily quests."
    }
  ];

  const handleVideoPlaceholderClick = () => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: "The promo video is being polished by our magical elves. Check back soon! 🚀",
    });
  };

  return (
    <>
      <Helmet>
        <title>AI Story Garden - Create Magical Children's Stories in Minutes</title>
        <meta name="description" content="Transform your imagination into beautiful, illustrated children's storybooks with AI. Perfect for parents and educators." />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300">
        {/* Header */}
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Sparkles className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">AI Story Garden</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link to="/login">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                Log In
              </Button>
            </Link>
          </motion.div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Create Magical Children's Stories in Minutes
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
              Describe your story idea, and let our AI bring it to life with beautiful text and illustrations. Perfect for bedtime stories, classroom adventures, and sparking imagination!
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Sparkles className="mr-2 h-6 w-6" />
                  Sign Up for Free
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
            <h2 className="text-4xl font-bold text-white mb-4">See The Magic in Action</h2>
            <p className="text-xl text-white/80">Watch how easy it is to create a beautiful storybook.</p>
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
                alt="Promo video thumbnail showing a magical storybook creation process"
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
              <h2 className="text-4xl font-bold text-white mb-4">From Our Community Garden</h2>
              <p className="text-xl text-white/80">The latest magical tales from our creative authors</p>
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
                  Explore the Full Garden
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Unlock a World of Magical Features</h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">Everything you need to create, share, and enjoy unforgettable stories.</p>
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
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/80 text-base leading-relaxed">{feature.description}</p>
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
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Create Magic?</h2>
            <p className="text-xl text-white/80 mb-8">Join thousands of parents and educators creating amazing stories. Your first story is on us!</p>
            <Link to="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-8 py-4 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                Start Creating For Free
              </Button>
            </Link>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;