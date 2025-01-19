"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { BusinessIdea } from '@/types/database';
import { useState } from 'react';

type Props = {
  idea: BusinessIdea;
  onClose: () => void;
  onGenerateDescription: () => Promise<void>;
  onSave?: () => Promise<void>;
  isSaved?: boolean;
};

export default function IdeaDetail({ idea, onClose, onGenerateDescription }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGenerateDescription();
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl p-4 sm:p-8 
                 border-t-4 border-blue-500 max-w-4xl mx-auto mt-4 sm:mt-8
                 fixed bottom-0 left-0 right-0 sm:relative
                 max-h-[80vh] sm:max-h-none overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.div layoutId={`title-${idea.id}`}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {idea.title}
          </h2>
        </motion.div>
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
            {idea.description.split('\n').map((paragraph, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-200 mb-4">
                {paragraph}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 