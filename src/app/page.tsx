"use client";

import { useEffect, useState } from 'react';
import { BusinessIdea } from '@/types/database';
import BusinessIdeasGrid from '@/components/BusinessIdeasGrid';
import IdeaDetail from '@/components/IdeaDetail';
import { database } from '@/lib/database';
import { gemini } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Settings from '@/components/Settings';

export default function Home() {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadInitialIdeas();
  }, []);

  const loadInitialIdeas = async () => {
    try {
      const titles = await gemini.generateBusinessIdeas("innovative business ideas");
      const newIdeas = titles.map((title, index) => ({
        id: `temp-${index}`,
        title,
        description: null,
        category: "Business Innovation",
        ai_generated: true,
        created_at: new Date().toISOString(),
        popularity_score: 0,
        metadata: {},
        user_id: null
      }));
      setIdeas(newIdeas);
    } catch (error) {
      console.error('Failed to load ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSelectedIdea(null);
    await loadInitialIdeas();
    setIsRefreshing(false);
  };

  const generateDescription = async () => {
    if (!selectedIdea) return;
    
    try {
      const description = await gemini.generateBusinessDescription(selectedIdea.title);
      const result = await database.createBusinessIdea({
        ...selectedIdea,
        description
      });
      
      if (result.data) {
        setIdeas(ideas.map(idea => 
          idea.id === selectedIdea.id ? { ...idea, description } : idea
        ));
        setSelectedIdea({ ...selectedIdea, description });
      }
    } catch (error) {
      console.error('Failed to generate description:', error);
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
              onIdeaClick={setSelectedIdea}
              selectedId={selectedIdea?.id || null}
            />
            <AnimatePresence>
              {selectedIdea && (
                <IdeaDetail
                  idea={selectedIdea}
                  onClose={() => setSelectedIdea(null)}
                  onGenerateDescription={generateDescription}
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
