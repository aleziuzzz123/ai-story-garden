
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BookControls = ({ onPrev, onNext, isFirstPage, isLastPage }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center items-center mt-8 w-full max-w-2xl gap-4">
      <Button
        onClick={onPrev}
        disabled={isFirstPage}
        variant="outline"
        className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t('previous')}
      </Button>
      <div className="flex-grow"></div>
      <Button
        onClick={onNext}
        disabled={isLastPage}
        variant="outline"
        className="bg-white/90 border-gray-300 text-gray-700 hover:bg-white disabled:opacity-50"
      >
        {t('next')}
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default BookControls;
