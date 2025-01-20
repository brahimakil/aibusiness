import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Idea } from '@/types/app';

type Props = {
  savedIdeas: Idea[];
  onIdeaClick: (idea: Idea) => void;
  onDelete: (ideaId: string) => void;
};

export default function SavedIdeas({ savedIdeas, onIdeaClick, onDelete }: Props) {
  if (savedIdeas.length === 0) return null;
  
  return (
    <div id="saved-ideas-section" className="mt-12 bg-[#1a1f2e] rounded-2xl p-6 shadow-xl scroll-mt-24">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
        <span>Saved Ideas</span>
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 p-1">
        {savedIdeas.map((idea) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white/10 backdrop-blur-lg rounded-xl p-4 cursor-pointer 
                     shadow-md hover:shadow-xl transition-all relative group"
          >
            <div onClick={() => onIdeaClick(idea)} className="text-white pr-8">
              <h3 className="text-lg font-bold mb-2">{idea.title}</h3>
              <p className="text-sm text-gray-300">{idea.category}</p>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(idea.id);
              }}
              className="absolute top-2 right-2 opacity-100
                       p-1 hover:bg-red-500/20 rounded-full text-red-400 transition-all"
              aria-label="Delete idea"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 