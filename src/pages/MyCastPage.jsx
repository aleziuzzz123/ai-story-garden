import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, User, Users, Trash2 } from 'lucide-react';
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
import { Header } from '@/components/Header'; // Import the reusable Header

const MyCastPage = () => {
  const { t } = useTranslation();
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
        toast({ title: t('toast_my_cast_fetch_error'), description: error.message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [user, toast, t]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCharacter(prev => ({...prev, [name]: value}));
  }

  const handleCreateCharacter = async (e) => {
    e.preventDefault();
    if (!newCharacter.name || !newCharacter.description) {
      toast({ title: t('toast_my_cast_missing_details'), description: t('toast_my_cast_missing_details_desc'), variant: "destructive" });
      return;
    }
    setIsCreating(true);
    try {
      const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-character-image', {
        body: { description: newCharacter.description },
      });

      if (imageError) throw new Error(imageError.message);
      
      const imageUrl = imageData.imageUrl;
      if(!imageUrl) throw new Error(t('toast_my_cast_image_fail'));

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
      toast({ title: t('toast_my_cast_creation_success_title'), description: t('toast_my_cast_creation_success_desc', { name: newCharacter.name }), variant: "success" });

    } catch(error) {
      toast({ title: t('toast_my_cast_creation_fail_title'), description: error.message, variant: 'destructive' });
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
      toast({ title: t('toast_my_cast_delete_success_title'), description: t('toast_my_cast_delete_success_desc', { name: characterToDelete.name }), variant: "success" });
    } catch(error) {
       toast({ title: t('toast_my_cast_delete_fail_title'), description: error.message, variant: 'destructive' });
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
        <title>{t('meta_title_my_cast')}</title>
        <meta name="description" content={t('meta_description_my_cast')} />
      </Helmet>
      
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 text-white p-4 sm:p-6 md:p-8">
        <main className="container mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users className="mx-auto h-20 w-20 text-white/80 mb-4" />
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">{t('my_cast_page_title')}</h1>
            <p className="mt-4 text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
              {t('my_cast_page_subtitle')}
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <motion.div 
              className="lg:col-span-1 bg-white/20 backdrop-blur-lg p-8 rounded-3xl shadow-lg border border-white/30"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">{t('my_cast_create_new_character')}</h2>
              <form onSubmit={handleCreateCharacter} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold">{t('my_cast_character_name_label')}</Label>
                  <Input 
                    id="name"
                    name="name"
                    value={newCharacter.name}
                    onChange={handleInputChange}
                    placeholder={t('my_cast_character_name_placeholder')}
                    className="mt-2 text-black"
                    disabled={isCreating}
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-lg font-semibold">{t('my_cast_character_desc_label')}</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={newCharacter.description}
                    onChange={handleInputChange}
                    placeholder={t('my_cast_character_desc_placeholder')}
                    rows={5}
                    className="mt-2 text-black"
                    disabled={isCreating}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 shadow-lg" disabled={isCreating}>
                  {isCreating ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> {t('my_cast_generating_button')}</> : <><User className="mr-2 h-5 w-5" /> {t('my_cast_add_to_cast_button')}</>}
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
                  <img alt={t('alt_empty_stage')} className="w-40 h-40 mx-auto mb-4 opacity-80" src="/placeholder.svg" />
                  <h3 className="text-2xl font-bold">{t('my_cast_empty_title')}</h3>
                  <p className="text-white/80 mt-2 max-w-sm mx-auto">
                    {t('my_cast_empty_desc')}
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
            <AlertDialogTitle className="text-2xl text-gray-800">{t('dialog_delete_title')}</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {t('my_cast_dialog_delete_message', { name: characterToDelete?.name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300">{t('dialog_cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCharacter} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white rounded-full">
              {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              {isDeleting ? t('my_cast_dialog_removing') : t('my_cast_dialog_confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MyCastPage;