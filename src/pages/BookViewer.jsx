import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HTMLFlipBook from 'react-pageflip';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { BookOpen, Loader2 } from 'lucide-react';
import BookHeader from '@/components/book/BookHeader';
import BookControls from '@/components/book/BookControls';
import CoverPage from '@/components/book/CoverPage';
import StoryPage from '@/components/book/StoryPage';
import EndPage from '@/components/book/EndPage';
import PdfPages from '@/components/book/PdfPages';
import { Header } from '@/components/Header';

const BookViewer = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const bookRef = useRef();
  const audioRef = useRef(null);
  const pdfPagesRef = useRef(null);

  const [story, setStory] = useState(null);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [narratingPageId, setNarratingPageId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleNarration = async (page) => {
    if (!page || !story || !user) return;
  
    if (narratingPageId === page.id && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
  
    if (narratingPageId === page.id && !isPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      return;
    }
  
    if (audioRef.current) {
      audioRef.current.pause();
    }
  
    setNarratingPageId(page.id);
    setIsPlaying(false);
  
    try {
      let audioUrl = page.audio_url;
  
      if (!audioUrl) {
        toast({ title: t('toast_narration_generating_title'), description: t('toast_narration_generating_desc') });
        const { data, error } = await supabase.functions.invoke('generate-narration', {
          body: {
            story_page_id: page.id,
            text: page.text_content,
            voice_id: story.narrator_voice_id,
            user_id: user.id,
          },
        });
  
        if (error || (data && data.error)) {
          throw new Error(error?.message || (data && data.error));
        }
        audioUrl = data.audioUrl;
        const updatedPages = pages.map(p => p.id === page.id ? { ...p, audio_url: audioUrl } : p);
        setPages(updatedPages);
      }
  
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setIsPlaying(true);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setNarratingPageId(null);
      };
      audioRef.current.onerror = () => {
        toast({
          title: t('toast_narration_error_title'),
          description: t('toast_narration_error_desc'),
          variant: "destructive",
        });
        setIsPlaying(false);
        setNarratingPageId(null);
      }
  
    } catch (error) {
      toast({
        title: t('toast_narration_fail_title'),
        description: t('toast_narration_fail_desc', { error: error.message }),
        variant: "destructive",
      });
      setNarratingPageId(null);
    }
  };

  useEffect(() => {
    const fetchStory = async () => {
      if (!user || !id) return;
      setLoading(true);

      try {
        const { data: storyData, error: storyError } = await supabase
          .from('stories')
          .select('id, title, thumbnail_url, back_cover_url, with_images, narrator_voice_id')
          .eq('id', id)
          .single();

        if (storyError) throw storyError;
        setStory(storyData);

        const { data: pagesData, error: pagesError } = await supabase
          .from('story_pages')
          .select('id, page_number, image_url, text_content, audio_url')
          .eq('story_id', id)
          .order('page_number', { ascending: true });

        if (pagesError) throw pagesError;
        setPages(pagesData);

      } catch (error) {
         toast({
          title: t('toast_story_not_found_title'),
          description: t('toast_story_not_found_desc'),
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
    
    return () => {
        if(audioRef.current) {
            audioRef.current.pause();
        }
    };
  }, [id, user, toast, t]);
  
  const onPageFlip = (e) => {
    const newPageNumber = e.data;
    setCurrentPage(newPageNumber);

    if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
        setNarratingPageId(null);
    }
  };
  
  const downloadPdf = async () => {
    setIsDownloading(true);
    toast({
      title: t('toast_pdf_generating_title'),
      description: t('toast_pdf_generating_desc'),
    });

    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageElements = pdfPagesRef.current.children;

    for (let i = 0; i < pageElements.length; i++) {
        const pageElement = pageElements[i];
        
        pageElement.style.display = 'block';

        const canvas = await html2canvas(pageElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
        });

        pageElement.style.display = '';

        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        
        if (i > 0) {
            pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    }
    
    pdf.save(`${story.title.replace(/ /g, '_')}.pdf`);
    setIsDownloading(false);
    toast({
      title: t('toast_pdf_success_title'),
      description: t('toast_pdf_success_desc'),
    });
  };

  const truncateTitle = (title, maxLength = 50) => {
    if (!title) return '';
    if (title.length <= maxLength) {
      return title;
    }
    return title.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex items-center justify-center">
        <Loader2 className="h-16 w-16 text-white animate-spin" />
        <p className="text-white text-xl ml-4">{t('book_viewer_loading')}</p>
      </div>
    );
  }

  if (!story || pages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-white mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">{t('book_viewer_not_found_title')}</h1>
          <p className="text-white/80 mb-6">{t('book_viewer_not_found_desc')}</p>
          <Link to="/dashboard">
            <Button className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              {t('create_page_back_to_dashboard')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const totalPages = pages.length;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage >= totalPages + 1;
  const backCoverImage = story.back_cover_url || "https://images.unsplash.com/photo-1688239419860-5ade14376dd9";

  return (
    <>
      <Helmet>
        <title>{t('meta_title_book_viewer', { title: story.title })}</title>
        <meta name="description" content={t('meta_description_book_viewer', { title: story.title })} />
      </Helmet>
      
      <PdfPages ref={pdfPagesRef} story={story} pages={pages} backCoverImage={backCoverImage} />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-300 flex flex-col">
        <BookHeader onDownload={downloadPdf} isDownloading={isDownloading} />

        <main className="flex-grow flex flex-col items-center justify-center container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-6"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{truncateTitle(story.title)}</h1>
            <p className="text-white/80 text-lg">
              {currentPage > 0 && currentPage <= totalPages ? t('book_viewer_page_indicator', { currentPage, totalPages }) : t('book_viewer_cover_indicator')}
            </p>
          </motion.div>

          <div className="w-full flex-grow flex justify-center items-center">
            <HTMLFlipBook
              width={500}
              height={600}
              size="stretch"
              minWidth={315}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1533}
              maxShadowOpacity={0.5}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPageFlip}
              className="storybook-flip"
              ref={bookRef}
            >
              <CoverPage image={story.thumbnail_url} title={story.title} />

              {pages.map((page) => (
                <StoryPage 
                  key={page.id}
                  page={page}
                  withImages={story.with_images}
                  onNarrate={handleNarration}
                  narratingPageId={narratingPageId}
                  isPlaying={isPlaying}
                />
              ))}

              <EndPage backCoverImage={backCoverImage} />
            </HTMLFlipBook>
          </div>
          
          <BookControls 
            onPrev={() => { bookRef.current.pageFlip().flipPrev(); }}
            onNext={() => { bookRef.current.pageFlip().flipNext(); }}
            isFirstPage={isFirstPage}
            isLastPage={isLastPage}
          />
        </main>
      </div>
    </>
  );
};

export default BookViewer;