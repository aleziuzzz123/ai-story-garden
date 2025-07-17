import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles, User, ArrowLeft, Users, Trash2 } from 'lucide-react';
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
import CharacterCard from '@/components/characters/CharacterCard';

const MyCastPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newCharacter, setNewCharacter] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchCharacters = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('characters')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCharacters(data);
      } catch (error) {
        toast({ title: "Couldn't fetch your cast", description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [user, toast]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({...prev, [name]: value}));
  }

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    if (!newCharacter.name || !newCharacter.description) {
      toast({ title: "Missing details", description: "Please provide a name and description.", variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      // 1. Generate Image
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-character-image', {
        body: { description: newCharacter.description },
      });

      if (imageError) throw new Error(imageError.message);
      
      const imageUrl = imageData.imageUrl;
      if(!imageUrl) throw new Error("Character image could not be generated.");

      // 2. Save character to DB
      const { data: newCharacterData, error: insertError } = await supabase
        .from('characters')
        .insert({
          user_id: user.id,
          name: newCharacter.name,
          description: newCharacter.description,
          image_url: imageUrl,
        })
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      setCharacters(prev => [newCharacterData, ...prev]);
      setNewCharacter({ name: '', description: '' });
      toast({ title: "Character Created! ✨", description: `${newCharacter.name} has joined your cast!`, variant: "success" });

    } catch(error) {
      toast({ title: "Creation Failed", description: error.message, variant: 'destructive' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCharacter = async () => {
    if (!characterToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('characters').delete().eq('id', characterToDelete.id);
      if (error) throw error;

      setCharacters(prev => prev.filter(c => c.id !== characterToDelete.id));
      toast({ title: "Character Removed", description: `${characterToDelete.name} has left the cast.`, variant: "success" });
    } catch(error) {
       toast({ title: "Deletion Failed", description: error.message, variant: 'destructive' });
    } finally {
      setIsDeleting(false);
      setCharacterToDelete(null);
    }
  };

  const handleUseInStory = (character) => {
    navigate('/create', { state: { character: character } });
  };


  return (
    <>
      <Helmet>
        <title>My Cast - AI Story Garden</title>
        <meta name="description" content="Create and manage your personal cast of characters for your stories." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 text-white p-4 sm:p-6 md:p-8">
        <header className="container mx-auto flex justify-between items-center mb-8">
            <Link to="/dashboard">
              <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
             <div className="flex items-center space-x-2">
              <Sparkles className="h-8 w-8" />
              <span className="text-2xl font-bold">AI Story Garden</span>
            </div>
        </header>
        
        <main className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users className="mx-auto h-20 w-20 text-white/80 mb-4" />
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">My Cast</h1>
            <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              Create your own reusable characters! Design their look and personality, and add them to any story.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div 
              className="lg:col-span-1 bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/30"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">Create a New Character</h2>
              <form onSubmit={handleCreateCharacter} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold">Character Name</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={newCharacter.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Barnaby the Brave Bear"
                    className="mt-2 text-black"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold">Character Description</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={newCharacter.description}
                    onChange={handleInputChange}
                    placeholder="Describe their appearance and personality. e.g., 'A fluffy brown bear wearing a tiny red cape. He's curious, kind, and loves honey cakes.'"
                    rows={5}
                    className="mt-2 text-black"
                    disabled={isCreating}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...</> : <><User className="mr-2 h-5 w-5" /> Add to Cast</>}
                </Button>
              </form>
            </motion.div>
            
            <div className="lg:col-span-2">
              {loading ? (
                <div className="flex justify-center items-center h-64"><Loader2 className="h-16 w-16 animate-spin" /></div>
              ) : characters.length > 0 ? (
                <motion.div 
                  className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: { staggerChildren: 0.1 }
                    }
                  }}
                >
                  {characters.map(character => (
                    <CharacterCard 
                      key={character.id} 
                      character={character} 
                      onDelete={() => setCharacterToDelete(character)}
                      onUseInStory={() => handleUseInStory(character)}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16 bg-white/20 backdrop-blur-lg rounded-3xl shadow-md border border-white/30 flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <img-replace alt="An empty stage with a single spotlight" className="w-40 h-40 mx-auto mb-4 opacity-80" />
                  <h3 className="text-2xl font-bold">Your cast is empty!</h3>
                  <p className="text-white/80 mt-2 max-w-sm mx-auto">
                    Create your first character and get them ready for their debut story.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </div>

       <AlertDialog open={!!characterToDelete} onOpenChange={() => setCharacterToDelete(null)}>
				<AlertDialogContent className="rounded-3xl bg-white/90 backdrop-blur-lg border-none shadow-2xl">
					<AlertDialogHeader>
						<AlertDialogTitle className="text-2xl text-gray-800">Are you sure?</AlertDialogTitle>
						<AlertDialogDescription className="text-gray-600">
							This will permanently remove "{characterToDelete?.name}" from your cast. They can't be brought back!
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isDeleting} className="rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDeleteCharacter} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white rounded-full">
							{isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
							{isDeleting ? 'Removing...' : 'Yes, remove them'}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
    </>
  );
};

export default MyCastPage;