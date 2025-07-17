
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Loader2, Volume2, Pause, Play } from 'lucide-react';

const NarrationButton = ({ page, onNarrate, narratingPageId, isPlaying, language, className }) => {
  const { t } = useTranslation();
  const isCurrentPageNarrating = narratingPageId === page.id;
  
  const audioUrlForLang = page[`audio_url_${language}`];
  const isLoading = isCurrentPageNarrating && !isPlaying && !audioUrlForLang;

  const handleClick = (e) => {
    e.stopPropagation();
    onNarrate(page);
  };

  const getButtonText = () => {
    if (isCurrentPageNarrating) {
      return isPlaying ? t('Pause') : t('Play');
    }
    return t('Listen');
  };

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="ghost"
      className={className}
    >
      {isCurrentPageNarrating ? (
        isPlaying ? (
          <Pause className="h-4 w-4 mr-2" /> 
        ) : (
          <Play className="h-4 w-4 mr-2" />
        )
      ) : (
        <Volume2 className="h-4 w-4 mr-2" />
      )}
      {getButtonText()}
      {isLoading && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
    </Button>
  );
};

export default NarrationButton;
