"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Idea } from '@/types/app';
import IdeaDetail from '@/components/IdeaDetail';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { gemini } from '@/lib/gemini';

export default function SavedIdeasPage() {
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('savedIdeas');
    if (saved) {
      setSavedIdeas(JSON.parse(saved));
    }
  }, []);

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
  };

  const generateDescription = async () => {
    if (!selectedIdea) return;
    
    try {
      const description = await gemini.generateBusinessDescription(selectedIdea.title);
      const updatedIdea = { ...selectedIdea, description };
      
      // Update in local storage
      const savedIdeas = JSON.parse(localStorage.getItem('savedIdeas') || '[]');
      const updatedSavedIdeas = savedIdeas.map((idea: Idea) => 
        idea.id === selectedIdea.id ? updatedIdea : idea
      );
      localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
      
      // Update state
      setSavedIdeas(updatedSavedIdeas);
      setSelectedIdea(updatedIdea);
    } catch (error) {
      console.error('Failed to generate description:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Saved Ideas
          </h1>
          <Link href="/">
            <button className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-lg 
                             hover:bg-blue-600 transition-colors text-sm sm:text-base">
              Back to Home
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4
                      scale-[0.98] sm:scale-100 transform-gpu">
          {savedIdeas.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No saved ideas yet. Save some ideas to see them here!
              </p>
            </div>
          ) : (
            savedIdeas.map((idea) => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 cursor-pointer 
                         shadow-md hover:shadow-xl transition-all"
                onClick={() => handleIdeaClick(idea)}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 
                             line-clamp-2">
                  {idea.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {idea.category}
                </p>
                {!idea.description && (
                  <p className="text-xs text-blue-500 mt-2 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Generate description
                  </p>
                )}
              </motion.div>
            ))
          )}
        </div>

        <AnimatePresence>
          {selectedIdea && (
            <IdeaDetail
              idea={selectedIdea}
              onClose={() => setSelectedIdea(null)}
              onGenerateDescription={generateDescription}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 