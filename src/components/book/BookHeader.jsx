import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft, Download, Loader2 } from 'lucide-react';

const BookHeader = ({ onDownload, isDownloading }) => {

  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Sparkles className="h-8 w-8 text-white" />
        <span className="text-2xl font-bold text-white">AI Story Garden</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Button onClick={onDownload} disabled={isDownloading} variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
          {isDownloading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Download PDF
        </Button>
        <Link to="/dashboard">
          <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default BookHeader;