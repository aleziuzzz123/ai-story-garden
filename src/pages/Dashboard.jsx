import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Sparkles, Plus, Trash2, Loader2, LogOut, Crown, BookMarked, Trees, Users } from 'lucide-react';
import StorybookThumbnail from '@/components/dashboard/StorybookThumbnail';
import LatestSticker from '@/components/dashboard/LatestSticker';
import AuthorStats from '@/components/dashboard/AuthorStats';
import WishingWell from '@/components/dashboard/WishingWell';
import CommunityStorybookThumbnail from '@/components/dashboard/CommunityStorybookThumbnail';

const Dashboard = () => {
	const { user, signOut } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { toast } = useToast();
	const [stories, setStories] = useState([]);
	const [publicStories, setPublicStories] = useState([]);
	const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ credits: 0, creative_streak: 0 });
	const [storyToDelete, setStoryToDelete] = useState(null);
	const [isDeleting, setIsDeleting] = useState(false);
	const [latestStickerUrl, setLatestStickerUrl] = useState(null);
  const [storyCount, setStoryCount] = useState(0);

	useEffect(() => {
		const fetchUserData = async () => {
			if (!user) return;
			try {
				setLoading(true);
				
				const { data: storiesData, error: storiesError } = await supabase
					.from('stories')
					.select('id, title, thumbnail_url, created_at, prompt_text, is_public')
					.eq('user_id', user.id)
					.order('created_at', { ascending: false });

				if (storiesError) throw storiesError;
				setStories(storiesData);
        
        const { count, error: countError } = await supabase
          .from('stories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (countError) throw countError;
        setStoryCount(count || 0);

				if (storiesData && storiesData.length > 0) {
					const latestStoryId = storiesData[0].id;
					const { data: pagesData, error: pageError } = await supabase
						.from('story_pages')
						.select('image_url')
						.eq('story_id', latestStoryId)
						.order('page_number', { ascending: true })
						.limit(1);
					
					if (pageError) {
            console.error("Error fetching sticker:", pageError.message);
          }
					if (pagesData && pagesData.length > 0 && pagesData[0].image_url) {
						setLatestStickerUrl(pagesData[0].image_url);
					}
				}
        
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('credits, creative_streak')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);

        const { data: publicStoriesData, error: publicStoriesError } = await supabase
          .from('stories')
          .select('id, title, thumbnail_url, created_at, profiles(username)')
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (publicStoriesError) throw publicStoriesError;
        setPublicStories(publicStoriesData);

			} catch (error) {
				toast({
					title: 'Error fetching data',
					description: error.message,
					variant: 'destructive',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, [user, toast]);

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		if (query.get('session_id')) {
			toast({
				title: 'Payment Successful!',
				description: 'Your credits have been added. Let the magic continue!',
				variant: 'success',
        className: 'bg-green-500 border-0 text-white',
			});
      window.history.replaceState(null, '', '/dashboard');
		}
	}, [location, toast]);

  const handleRemixStory = (story) => {
    navigate('/create', { state: { remixPrompt: story.prompt_text } });
  };

  const handlePublishStory = async (storyId) => {
    try {
      const { error } = await supabase
        .from('stories')
        .update({ is_public: true })
        .eq('id', storyId);
      
      if (error) throw error;
      
      toast({
        title: "Story Published! ✨",
        description: "Your story is now visible in the Community Garden.",
        variant: "success",
      });
    } catch(error) {
       toast({
        title: 'Oops! Could not publish story.',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

	const handleDeleteStory = async () => {
		if (!storyToDelete) return;
		setIsDeleting(true);
		try {
			const { error } = await supabase.functions.invoke('delete-story', {
				body: { storyId: storyToDelete.id },
			});

			if (error) {
        const errorContext = await error.context.json();
        throw new Error(errorContext.error);
      }

			setStories(stories.filter((story) => story.id !== storyToDelete.id));
      setStoryCount(prev => prev - 1);
			toast({
				title: 'Story Deleted!',
				description: `Poof! "${storyToDelete.title}" is gone.`,
				variant: 'success',
			});
		} catch (error) {
			toast({
				title: 'Oops! Something went wrong.',
				description: error.message,
				variant: 'destructive',
			});
		} finally {
			setIsDeleting(false);
			setStoryToDelete(null);
		}
	};

  const username = user?.email?.split('@')[0];

	return (
		<>
			<Helmet>
				<title>My Stories - AI Story Garden</title>
				<meta name="description" content="Your personal dashboard to manage and read your AI-generated storybooks." />
			</Helmet>
			<div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 text-white">
				<div className="relative z-10">
					<header className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
						<Link to="/" className="flex items-center space-x-2">
							<Sparkles className="h-8 w-8 text-white" />
							<span className="text-2xl font-bold text-white">AI Story Garden</span>
						</Link>
						<div className="flex items-center space-x-2 sm:space-x-4">
							<Link to="/my-cast">
								<Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
									<Users className="mr-2 h-4 w-4" />
									My Cast
								</Button>
							</Link>
							<Link to="/community">
								<Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
									<Trees className="mr-2 h-4 w-4" />
									Community
								</Button>
							</Link>
							<Link to="/sticker-book">
								<Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
									<BookMarked className="mr-2 h-4 w-4" />
									My Sticker Book
								</Button>
							</Link>
							<Link to="/credits">
								<Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
									<Crown className="mr-2 h-4 w-4" />
									Get Credits
								</Button>
							</Link>
							<Button onClick={signOut} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
								<LogOut className="mr-2 h-4 w-4" />
								Sign Out
							</Button>
						</div>
					</header>

					<main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
						<motion.div 
							initial={{ opacity: 0, y: 20 }} 
							animate={{ opacity: 1, y: 0 }} 
							className="mb-12 bg-black/10 backdrop-blur-sm p-6 rounded-3xl border border-white/20 shadow-lg"
						>
							<div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
								<div>
									<h1 className="text-4xl sm:text-5xl font-bold text-white drop-shadow-md">
                    {username ? `Welcome, ${username}!` : 'Welcome, Storyteller!'}
                  </h1>
									<p className="text-lg text-white/90 drop-shadow mt-1">What new adventure will you create today?</p>
								</div>
								<div className="flex-shrink-0">
									<AuthorStats storyCount={storyCount} creativeStreak={profile.creative_streak || 1} />
								</div>
							</div>
						</motion.div>

						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <motion.div 
                className="lg:col-span-1 bg-gradient-to-br from-yellow-300 to-orange-400 p-8 rounded-3xl shadow-xl text-center flex flex-col justify-center items-center transform hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 120, delay: 0.2 }}
              >
                  <h2 className="text-3xl font-bold text-white mb-4">Create a New Story</h2>
                  <Link to="/create">
                    <Button size="lg" className="bg-white text-orange-500 hover:bg-orange-50 rounded-full shadow-lg text-lg font-bold group">
                      <Plus className="mr-2 h-6 w-6 transform group-hover:rotate-90 transition-transform duration-300" />
                      Let's Go!
                    </Button>
                  </Link>
              </motion.div>
              <div className="lg:col-span-1">
                <WishingWell />
              </div>
              <div className="lg:col-span-1 flex flex-col gap-6">
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl h-full shadow-md border border-white/30">
                    <h3 className="font-bold text-xl mb-2 text-white/90">My Library</h3>
                    <p className="text-5xl font-bold">{loading ? <Loader2 className="h-10 w-10 animate-spin" /> : storyCount}</p>
                    <p className="text-white/80">Adventures created</p>
                  </div>
                </motion.div>
                 <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <div className="bg-white/20 backdrop-blur-lg p-6 rounded-3xl h-full shadow-md border border-white/30">
                    <h3 className="font-bold text-xl mb-2 text-white/90">Magic Credits</h3>
                    <p className="text-5xl font-bold">{loading ? <Loader2 className="h-10 w-10 animate-spin" /> : profile.credits}</p>
                    <p className="text-white/80">Ready to use</p>
                  </div>
                </motion.div>
              </div>
            </div>

						{latestStickerUrl && (
							<div className="mb-16">
								<h2 className="text-3xl font-bold mb-6 text-white drop-shadow">Latest Sticker Unlocked!</h2>
								<motion.div 
									className="flex justify-center items-center py-8 bg-white/20 backdrop-blur-lg rounded-3xl shadow-md border border-white/30"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<LatestSticker imageUrl={latestStickerUrl} />
								</motion.div>
							</div>
						)}

						<div className="mb-16">
							<h2 className="text-3xl font-bold mb-6 text-white drop-shadow">My Storybooks</h2>
							{loading ? (
								<div className="flex justify-center items-center h-64">
									<Loader2 className="h-16 w-16 animate-spin text-white" />
								</div>
							) : stories.length > 0 ? (
								<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-20">
									{stories.map((story) => (
										<StorybookThumbnail
											key={story.id}
											story={story}
											onRead={() => navigate(`/book/${story.id}`)}
											onDelete={() => setStoryToDelete(story)}
                      onRemix={() => handleRemixStory(story)}
                      onPublish={() => handlePublishStory(story.id)}
										/>
									))}
								</div>
							) : (
								<motion.div 
									className="text-center py-16 bg-white/20 backdrop-blur-lg rounded-3xl shadow-md border border-white/30"
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 }}
								>
									<img-replace alt="A cute, empty bookshelf illustration" className="w-40 h-40 mx-auto mb-4 opacity-80" />
									<h3 className="text-2xl font-bold text-white">Your bookshelf is empty!</h3>
									<p className="text-white/80 mt-2 mb-6 max-w-sm mx-auto">It's time to fill it with magical tales and heroic adventures. What will you create first?</p>
									<Link to="/create">
										<Button size="lg" className="bg-gradient-to-r from-yellow-300 to-orange-400 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
											<Plus className="mr-2 h-6 w-6" />
											Create My First Story
										</Button>
									</Link>
								</motion.div>
							)}
						</div>

						{publicStories.length > 0 && (
              <div className="mb-16">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-white drop-shadow">From Our Community Garden</h2>
                  <Link to="/community">
                    <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 rounded-full shadow-sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
                  {publicStories.map((story) => (
                    <CommunityStorybookThumbnail
                      key={story.id}
                      story={story}
                      onRead={() => navigate(`/book/${story.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
					</main>
				</div>
			</div>
			<AlertDialog open={!!storyToDelete} onOpenChange={() => setStoryToDelete(null)}>
				<AlertDialogContent className="rounded-3xl bg-white/90 backdrop-blur-lg border-none shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-2xl text-gray-800">Are you sure?</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-600">
							This will send "{storyToDelete?.title}" on a one-way trip to the land of forgotten tales. This action cannot be undone!
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting} className="rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300">Nevermind</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteStory} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white rounded-full">
							{isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
							{isDeleting ? 'Deleting...' : 'Yes, delete it!'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default Dashboard;