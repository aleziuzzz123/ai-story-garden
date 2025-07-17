import React, { forwardRef } from 'react';
import { Sparkles } from 'lucide-react';

const PageContainer = forwardRef((props, ref) => {
  return (
    <div className="flip-page bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50" ref={ref} data-density={props.density}>
      <div className="flip-page-content">
        {props.children}
      </div>
    </div>
  );
});

const EndPage = forwardRef(({ backCoverImage }, ref) => (
  <PageContainer ref={ref}>
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center relative bg-[url('/bg-texture.png')] bg-repeat">
      <div className="absolute inset-0 w-full h-full object-cover bg-gradient-to-br from-purple-400/50 via-pink-400/50 to-orange-300/50"></div>
      <img alt="Custom generated back cover" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply" src={backCoverImage} />
      <div className="relative z-10 text-center bg-black/40 backdrop-blur-sm p-6 rounded-2xl shadow-xl">
        <h2 className="text-5xl font-bold text-white mb-4 drop-shadow-md font-['Comic_Neue']">The End</h2>
        <Sparkles className="h-16 w-16 text-yellow-300 mx-auto animate-pulse" />
      </div>
    </div>
  </PageContainer>
));

export default EndPage;