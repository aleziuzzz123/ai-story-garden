import { supabase } from '@/lib/customSupabaseClient';

const generateTextPages = async (formData, setLoadingMessage) => {
  setLoadingMessage("Crafting your unique story...");
  const { data: generatedData, error: functionError } = await supabase.functions.invoke('generate-story', {
    body: JSON.stringify(formData),
  });

  if (functionError) throw new Error(`Story generation failed: ${functionError.message}`);
  if (generatedData.error) throw new Error(`Story generation failed: ${generatedData.error}`);
  
  const { title, pages: pageTexts } = generatedData;
  if (!title || !pageTexts || !Array.isArray(pageTexts) || pageTexts.length === 0) {
    throw new Error("AI failed to generate a valid story. Please try again.");
  }
  return { title, pageTexts };
};

const generateImageForPage = async (text, formData, storyId, pageNumber, setLoadingMessage) => {
  setLoadingMessage(`Drawing page ${pageNumber} of ${formData.pageCount}...`);
  try {
    const { data: imageData, error: imageError } = await supabase.functions.invoke('generate-image', {
      body: JSON.stringify({
        page_text: text,
        story_context: {
          characters: formData.characters,
          setting: formData.setting,
          plot: formData.plot,
        },
        style: formData.illustrationStyle,
        story_id: storyId,
        page_number: pageNumber,
      }),
    });

    if (imageError || imageData.error) {
      throw new Error(imageError?.message || imageData.error);
    }
    return { imageUrl: imageData.imageUrl, error: null };
  } catch (error) {
    console.warn(`Could not generate image for page ${pageNumber}. Using a placeholder. Error: ${error.message}`);
    return { imageUrl: `https://placehold.co/1024x1024/EAD9FF/5C2D91?text=Illustration+Failed`, error: error.message };
  }
};

const generateBackCover = async (formData, storyId, setLoadingMessage) => {
  setLoadingMessage("Crafting the perfect ending...");
  try {
    const { data: backCoverData, error: backCoverError } = await supabase.functions.invoke('generate-back-cover', {
      body: JSON.stringify({
        story_context: {
          characters: formData.characters,
          setting: formData.setting,
          plot: formData.plot,
        },
        style: formData.illustrationStyle,
        story_id: storyId,
      }),
    });

    if (backCoverError || backCoverData.error) {
      throw new Error(backCoverError?.message || backCoverData.error);
    }
    return backCoverData?.backCoverUrl;
  } catch (error) {
     console.warn("Could not generate back cover image:", error.message);
     return null;
  }
};

export const handleStoryGeneration = async (formData, user, creditCost, setLoadingMessage, toast, navigate) => {
  setLoadingMessage("Checking your credits...");
  const { error: creditError } = await supabase.rpc('decrement_credits', { user_id_in: user.id, amount: creditCost });
  if (creditError) throw new Error("Not enough credits to create this story. Please top up your account.");

  const { title, pageTexts } = await generateTextPages(formData, setLoadingMessage);

  setLoadingMessage("Saving your masterpiece...");
  const { data: storyData, error: storyError } = await supabase
    .from('stories')
    .insert({ 
      user_id: user.id, 
      title: title, 
      prompt_text: JSON.stringify(formData), 
      with_images: formData.withImages,
      narrator_voice_id: formData.narratorVoiceId,
    })
    .select()
    .single();
  if (storyError) throw storyError;

  const pagesToInsert = [];
  let thumbnailUrl = `https://placehold.co/1024x1024/EAD9FF/5C2D91?text=AI+Story+Garden`;
  let backCoverUrl = null;

  if (formData.withImages) {
    setLoadingMessage("Bringing pages to life with illustrations...");
    let imageGenerationFailed = false;
    for (let i = 0; i < pageTexts.length; i++) {
      const { imageUrl, error: imageGenError } = await generateImageForPage(pageTexts[i], formData, storyData.id, i + 1, setLoadingMessage);
      if (imageGenError) {
        imageGenerationFailed = true;
      }
      pagesToInsert.push({
        story_id: storyData.id,
        page_number: i + 1,
        text_content: pageTexts[i],
        image_url: imageUrl,
      });
    }

    if(imageGenerationFailed) {
      toast({
        title: "Image Generation Hiccup!",
        description: "Some images could not be generated and placeholders were used. This may be due to a service issue or insufficient credits with the image provider.",
        variant: "destructive",
        duration: 10000,
      });
    }

    if (pagesToInsert.length > 0 && pagesToInsert[0].image_url) {
      setLoadingMessage("Generating a beautiful thumbnail...");
      thumbnailUrl = pagesToInsert[0].image_url;
    }
    backCoverUrl = await generateBackCover(formData, storyData.id, setLoadingMessage);
  } else {
    for (let i = 0; i < pageTexts.length; i++) {
      pagesToInsert.push({
        story_id: storyData.id,
        page_number: i + 1,
        text_content: pageTexts[i],
        image_url: null,
      });
    }
  }

  setLoadingMessage("Putting it all together...");
  const { error: pagesError } = await supabase.from('story_pages').insert(pagesToInsert);
  if (pagesError) throw pagesError;

  const { error: updateStoryError } = await supabase
    .from('stories')
    .update({ thumbnail_url: thumbnailUrl, back_cover_url: backCoverUrl })
    .eq('id', storyData.id);

  if (updateStoryError) {
    console.warn("Could not update story with thumbnail and back cover:", updateStoryError.message);
  }

  toast({
    title: "Story created successfully! 🎉",
    description: `Your magical storybook is ready! ${formData.withImages ? 'Enjoy the illustrations!' : ''}`,
  });

  navigate(`/book/${storyData.id}`);
};