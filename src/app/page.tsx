"use client";

import { useEffect, useState } from 'react';
import { Idea } from '@/types/app';
import BusinessIdeasGrid from '@/components/BusinessIdeasGrid';
import IdeaDetail from '@/components/IdeaDetail';
import { gemini } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Settings from '@/components/Settings';
import SavedIdeas from '@/components/SavedIdeas';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { language } = useLanguage();

  const loadInitialIdeas = async (forceRefresh = false) => {
    setLoading(true);
    try {
      if (!forceRefresh) {
        const storedIdeas = localStorage.getItem('currentIdeas');
        if (storedIdeas) {
          setIdeas(JSON.parse(storedIdeas));
          setLoading(false);
          return;
        }
      }

      const ideasWithCategories = await gemini.generateBusinessIdeas("innovative business ideas");
      const newIdeas = ideasWithCategories.map(({ title, category }) => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description: null,
        category,
        created_at: new Date().toISOString()
      }));
      
      setIdeas(newIdeas);
      localStorage.setItem('currentIdeas', JSON.stringify(newIdeas));
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialIdeas(false);
    const saved = localStorage.getItem('savedIdeas');
    if (saved) {
      setSavedIdeas(JSON.parse(saved));
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSelectedIdea(null);
    await loadInitialIdeas(true);
    setIsRefreshing(false);
  };

  const handleDeleteSavedIdea = (ideaId: string) => {
    const updatedSavedIdeas = savedIdeas.filter(idea => idea.id !== ideaId);
    localStorage.setItem('savedIdeas', JSON.stringify(updatedSavedIdeas));
    setSavedIdeas(updatedSavedIdeas);
  };

  const generateDescription = async () => {
    if (!selectedIdea) return;
    
    try {
      const prompt = language === 'ar'
        ? `اكتب خطة عمل مفصلة لـ: ${selectedIdea.title}`
        : selectedIdea.title;

      const description = await gemini.generateBusinessDescription(prompt);
      setIdeas(ideas.map(idea => 
        idea.id === selectedIdea.id ? { ...idea, description } : idea
      ));
      setSelectedIdea({ ...selectedIdea, description });
    } catch (error) {
      console.error('Failed to generate description:', error);
    }
  };

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea);
    // Smooth scroll to the detail view
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };

  // Add this function to update saved ideas
  const updateSavedIdeas = () => {
    const saved = localStorage.getItem('savedIdeas');
    if (saved) {
      setSavedIdeas(JSON.parse(saved));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header
        onRefresh={handleRefresh}
        onSettings={() => setShowSettings(true)}
        isRefreshing={isRefreshing}
        loading={loading}
      />
      <main className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
          </div>
        ) : (
          <>
            <BusinessIdeasGrid 
              ideas={ideas} 
              onIdeaClick={handleIdeaClick}
              selectedId={selectedIdea?.id || null}
            />
            <SavedIdeas 
              savedIdeas={savedIdeas}
              onIdeaClick={handleIdeaClick}
              onDelete={handleDeleteSavedIdea}
            />
            <AnimatePresence>
              {selectedIdea && (
                <IdeaDetail
                  idea={selectedIdea}
                  onClose={() => setSelectedIdea(null)}
                  onGenerateDescription={generateDescription}
                  onSaveChange={updateSavedIdeas}
                />
              )}
            </AnimatePresence>
            <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
          </>
        )}
      </main>
    </div>
  );
}
