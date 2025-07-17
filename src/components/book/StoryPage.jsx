import React, { forwardRef } from 'react';
import { Type } from 'lucide-react';
import NarrationButton from './NarrationButton';
import MagicalFrame from './MagicalFrame';

const PageContainer = forwardRef((props, ref) => {
  return (
    <div className="flip-page bg-gradient-to-br from-yellow-50 via-rose-50 to-sky-50" ref={ref} data-density={props.density}>
      <div className="flip-page-content">
        {props.children}
      </div>
    </div>
  );
});

const getEnglishText = (text) => {
  if (!text) return "";
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === 'object' && parsed.text_content_en) {
      return parsed.text_content_en;
    }
  } catch (e) {
    // Not a JSON string, so return as is
  }
  return text;
};

const StoryPage = forwardRef(({ page, withImages, onNarrate, narratingPageId, isPlaying }, ref) => {
  const textContent = getEnglishText(page.text_content);
  const textPreview = textContent.split(' ').slice(0, 15).join(' ') + (textContent.split(' ').length > 15 ? '...' : '');

  return (
    <PageContainer ref={ref}>
      <div className="w-full h-full flex flex-col items-center justify-between p-8 gap-4 bg-[url('/bg-texture.png')] bg-repeat">
        <div className="w-full">
          {withImages ? (
            <MagicalFrame>
              <div className="w-full aspect-video bg-gray-100">
                <img className="w-full h-full object-cover" alt={`Page ${page.page_number} illustration`} src={page.image_url} />
              </div>
            </MagicalFrame>
          ) : (
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden shadow-md flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300">
              <Type className="h-10 w-10 text-gray-400 mb-4" />
              <p className="text-center text-gray-500 italic font-['Comic_Neue'] leading-snug">
                {textPreview}
              </p>
            </div>
          )}
        </div>
        
        <NarrationButton 
          page={{...page, text_content: textContent}}
          onNarrate={onNarrate}
          narratingPageId={narratingPageId}
          isPlaying={isPlaying}
          language={'en'}
          className="my-2 text-purple-600 hover:bg-purple-100 hover:text-purple-700"
        />

        <p className="text-base text-gray-700 leading-relaxed font-['Comic_Neue'] text-center flex-grow">
          {textContent}
        </p>
        <div className="flex items-center justify-end w-full mt-auto">
          <span className="text-sm text-gray-400">Page {page.page_number}</span>
        </div>
      </div>
    </PageContainer>
  );
});

export default StoryPage;