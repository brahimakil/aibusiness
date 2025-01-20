"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Idea } from '@/types/app';
import { useState, useEffect } from 'react';
import { LightbulbIcon } from './Icons';

type Props = {
  idea: Idea;
  onClose: () => void;
  onGenerateDescription: () => Promise<void>;
  onSaveChange: () => void;
};

export default function IdeaDetail({ idea, onClose, onGenerateDescription, onSaveChange }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
    setIsSaved(savedIdeas.some((saved: Idea) => saved.id === idea.id));
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [idea.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateDescription();
    setIsGenerating(false);
  };

  const handleSave = () => {
    const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
    if (isSaved) {
      const filtered = savedIdeas.filter((saved: Idea) => saved.id !== idea.id);
      localStorage.setItem('savedIdeas', JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      const ideaToSave = {
        ...idea,
        description: idea.description || null
      };
      const updatedSavedIdeas = [...savedIdeas, ideaToSave];
      localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
      setIsSaved(true);
    }
    onSaveChange();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40 touch-none"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            damping: 25,
            stiffness: 200
          }
        }}
        exit={{ opacity: 0, y: '100%' }}
        className="fixed inset-x-0 bottom-0 w-full bg-white dark:bg-gray-800 
                   rounded-t-3xl shadow-2xl p-4 sm:p-6
                   border-t-4 border-blue-500
                   sm:max-w-2xl sm:mx-auto
                   max-h-[85vh] overflow-y-auto z-50
                   touch-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <motion.div 
            layoutId={`title-${idea.id}`} 
            className="flex-1 flex items-start space-x-3 min-w-0"
          >
            <div className="flex-shrink-0 mt-1">
              <LightbulbIcon />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
              {idea.title}
            </h2>
          </motion.div>
          <div className="flex-shrink-0 flex space-x-2 ml-4">
            <button
              onClick={handleSave}
              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 
                       dark:hover:text-blue-400 transition-colors"
            >
              <svg 
                className={`w-6 h-6 ${isSaved ? 'fill-blue-500' : 'fill-none'}`} 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 
                       dark:hover:text-gray-200"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {!idea.description && !isGenerating && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white rounded-xl font-medium shadow-lg hover:shadow-xl 
                       transition-all duration-300"
          >
            Generate Business Plan
          </motion.button>
        )}

        {isGenerating && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
          </div>
        )}

        <AnimatePresence>
          {idea.description && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose dark:prose-invert max-w-none mt-6"
            >
              {idea.description.split('\n').map((paragraph, i) => {
                // Clean any markdown symbols from the text
                const cleanText = paragraph.replace(/[*_]/g, '');
                
                // Check if this is a section header
                if (cleanText.includes(':')) {
                  return (
                    <h3 key={i} className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3">
                      {cleanText}
                    </h3>
                  );
                }
                // Regular paragraph
                return (
                  <p key={i} className="text-gray-700 dark:text-gray-200 mb-4">
                    {cleanText}
                  </p>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
} 