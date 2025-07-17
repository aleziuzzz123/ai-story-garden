import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Sparkles, BookOpen, Image as ImageIcon, Users, Mic } from 'lucide-react';

const illustrationStyles = [
  { value: 'whimsical-watercolor', label: 'Whimsical Watercolor (Analog Film)' },
  { value: '3d-cartoon', label: '3D Cartoon (3D Model)' },
  { value: 'classic-storybook', label: 'Classic Storybook (Comic Book)' },
  { value: 'vibrant-anime', label: 'Vibrant Anime (Digital Art)' },
  { value: 'fantasy-art', label: 'Fantasy Art' },
  { value: 'cinematic', label: 'Cinematic' },
  { value: 'line-art', label: 'Line Art' },
  { value: 'neon-punk', label: 'Neon Punk' },
  { value: 'origami', label: 'Origami' },
  { value: 'photographic', label: 'Photographic' },
  { value: 'pixel-art', label: 'Pixel Art' },
];

const narratorVoices = [
  { value: '21m00Tcm4TlvDq8ikWAM', label: 'Rachel (Calm, American)' },
  { value: '29vD33N1CtxCmqQRPO9B', label: 'Drew (Clear, American)' },
  { value: '2EiwWnXFnvU5JabPnv8n', label: 'Fin (Storyteller, British)' },
  { value: '5Q0t7uMcjvnagumLfvZi', label: 'Paul (Conversational, British)' },
  { value: 'CYw3kZ02Hs0563khs1Fj', label: 'Dave (Conversational, American)' },
  { value: 'D38z5RcWu1voky8WS1ja', label: 'Sarah (Gentle, American)' },
  { value: 'TxGEqnHWrfWFTfGW9XjX', label: 'George (Raspy, British)' },
  { value: 'yoZ06aM5OJVAIjg9GMb7', label: 'Emily (Calm, American)' },
  { value: 'z9fAnlkpzviPz146aGWa', label: 'Charlotte (Pleasant, British)' },
  { value: 'zcAOhNBS3c14rBihAFp1', label: 'Alice (Pleasant, British)' },
  { value: 'KoVIHoyLDrQyd4pGalbs', label: 'Liam (Pleasant, American)' },
];


const StoryForm = ({ formData, setFormData, handleSubmit, creditCost, loading, characterList }) => {
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSwitchChange = (id, checked) => {
    setFormData(prev => ({ ...prev, [id]: checked }));
  };

  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSliderChange = (value) => {
    setFormData(prev => ({ ...prev, pageCount: value[0] }));
  };

  const handleCharacterSelect = (value) => {
    const selectedCharacter = characterList.find(c => c.name === value);
    if (selectedCharacter) {
      setFormData(prev => ({ ...prev, characters: `${selectedCharacter.name}, who is ${selectedCharacter.description}` }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="characters">Main Character(s)</Label>
        {characterList && characterList.length > 0 && (
          <div className="flex gap-2">
            <Textarea
              id="characters"
              placeholder="e.g., A brave little fox named Finn"
              value={formData.characters}
              onChange={handleInputChange}
              className="bg-white border-gray-300 flex-grow"
              rows={2}
            />
            <Select onValueChange={handleCharacterSelect}>
              <SelectTrigger className="bg-white border-gray-300 w-[180px]">
                <SelectValue placeholder="Or choose..." />
              </SelectTrigger>
              <SelectContent>
                {characterList.map((char) => (
                  <SelectItem key={char.name} value={char.name}>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      {char.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {(!characterList || characterList.length === 0) && (
           <Input
            id="characters"
            placeholder="e.g., A brave little fox named Finn"
            value={formData.characters}
            onChange={handleInputChange}
            className="bg-white border-gray-300"
          />
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="setting">Setting</Label>
        <Input
          id="setting"
          placeholder="e.g., A magical, moonlit forest"
          value={formData.setting}
          onChange={handleInputChange}
          className="bg-white border-gray-300"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="plot">Story Idea / Plot</Label>
        <Textarea
          id="plot"
          placeholder="e.g., Finn has to find a hidden treasure to save his family"
          value={formData.plot}
          onChange={handleInputChange}
          className="bg-white border-gray-300 min-h-[100px]"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4 bg-gray-50">
          <div className="space-y-0.5">
            <Label htmlFor="withImages" className="text-base flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Generate Images
            </Label>
            <p className="text-sm text-muted-foreground">
              Create a beautiful illustration for each page.
            </p>
          </div>
          <Switch
            id="withImages"
            checked={formData.withImages}
            onCheckedChange={(checked) => handleSwitchChange('withImages', checked)}
          />
        </div>
      </div>
      
      <motion.div
        initial={false}
        animate={{ height: formData.withImages ? 'auto' : 0, opacity: formData.withImages ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="space-y-2 pt-4">
          <Label htmlFor="illustrationStyle">Illustration Style</Label>
          <Select onValueChange={(value) => handleSelectChange('illustrationStyle', value)} value={formData.illustrationStyle}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Choose an illustration style" />
            </SelectTrigger>
            <SelectContent>
              {illustrationStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

       <div className="space-y-2 pt-4">
          <Label htmlFor="narratorVoiceId" className="flex items-center">
            <Mic className="h-4 w-4 mr-2" />
            Narrator Voice
          </Label>
          <Select onValueChange={(value) => handleSelectChange('narratorVoiceId', value)} value={formData.narratorVoiceId}>
            <SelectTrigger className="bg-white border-gray-300">
              <SelectValue placeholder="Choose a narrator's voice" />
            </SelectTrigger>
            <SelectContent>
              {narratorVoices.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label htmlFor="pageCount" className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2" />
            Number of Pages
          </Label>
          <span className="font-bold text-lg text-purple-600">{formData.pageCount}</span>
        </div>
        <Slider
          id="pageCount"
          min={4}
          max={124}
          step={2}
          value={[formData.pageCount]}
          onValueChange={handleSliderChange}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-3"
        disabled={loading}
      >
        <Sparkles className="mr-2 h-5 w-5" />
        Generate My Story ({creditCost} {creditCost === 1 ? 'Credit' : 'Credits'})
      </Button>
    </form>
  );
};

export default StoryForm;