import React, { forwardRef } from 'react';

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

const PdfPages = forwardRef(({ story, pages, backCoverImage }, ref) => {
  if (!story || !pages) {
    return null;
  }

  return (
    <div ref={ref} style={{ position: 'absolute', left: '-9999px', top: 0 }}>
      {/* Cover Page */}
      <div className="pdf-page">
        <div className="pdf-page-content">
          <div className="w-full h-full bg-gray-800 text-white flex flex-col items-center justify-center p-8 text-center">
            <img src={story.thumbnail_url} alt="Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-8">
              <h1 className="text-5xl font-bold mb-4">{story.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Story Pages */}
      {pages.map((page) => (
        <div key={page.id} className="pdf-page">
          <div className="pdf-page-content">
            <div className="w-full h-full flex flex-col items-center justify-between p-8 gap-4 bg-white">
              {story.with_images && (
                <div className="w-full aspect-video bg-gray-100">
                  <img className="w-full h-full object-cover" alt={`Page ${page.page_number} illustration`} src={page.image_url} />
                </div>
              )}
              <p className="text-lg text-gray-800 leading-relaxed text-center flex-grow mt-4">
                {getEnglishText(page.text_content)}
              </p>
              <div className="flex items-center justify-end w-full mt-auto">
                <span className="text-sm text-gray-500">Page {page.page_number}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* End Page */}
      <div className="pdf-page">
        <div className="pdf-page-content">
          <div className="w-full h-full bg-gray-800 text-white flex flex-col items-center justify-center p-8 text-center">
            <img src={backCoverImage} alt="Back Cover" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-8">
              <h2 className="text-4xl font-bold">The End</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default PdfPages;