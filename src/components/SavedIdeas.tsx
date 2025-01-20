import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Idea } from '@/types/app';

type Props = {
  savedIdeas: Idea[];
  onIdeaClick: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
};

export default function SavedIdeas({ savedIdeas, onIdeaClick, onDelete }: Props) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Saved Ideas
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer 
                     shadow-md hover:shadow-xl transition-all relative group"
          >
            <div 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 
                       transition-opacity"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(idea.id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900 
                         rounded-full text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <div onClick={() => onIdeaClick(idea)}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {idea.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {idea.category}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 