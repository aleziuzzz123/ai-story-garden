import React, { forwardRef } from 'react';
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

const CoverPage = forwardRef(({ image, title }, ref) => {
  const truncateTitle = (text, maxLength = 30) => {
    if (!text) return '';
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, maxLength) + '...';
  };

  return (
    <PageContainer ref={ref}>
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative bg-[url('/bg-texture.png')] bg-repeat">
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
          <MagicalFrame>
            <img src={image} alt="Cover" className="w-full h-full object-cover" />
          </MagicalFrame>
          <div className="mt-6 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 drop-shadow-md font-['Comic_Neue']">{truncateTitle(title)}</h2>
          </div>
        </div>
      </div>
    </PageContainer>
  );
});

export default CoverPage;