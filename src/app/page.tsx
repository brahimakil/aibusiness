"use client";

import { useEffect, useState } from 'react';
import { BusinessIdea } from '@/types/database';
import BusinessIdeasGrid from '@/components/BusinessIdeasGrid';
import IdeaDetail from '@/components/IdeaDetail';
import Settings from '@/components/Settings';
import Header from '@/components/Header';
import { database } from '@/lib/database';
import { gemini } from '@/lib/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

export default function Home() {
  const [ideas, setIdeas] = useState<BusinessIdea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<BusinessIdea | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDarkMode, toggleDarkMode } = useApp();

  useEffect(() => {
    loadInitialIdeas();
  }, []);

  const loadInitialIdeas = async () => {
    try {
      const titles = await gemini.generateBusinessIdeas();
      const newIdeas = titles.map((title, index) => ({
        id: `temp-${index}`,
        title,
        description: null,
        category: "Business Innovation",
        ai_generated: true,
        created_at: new Date().toISOString(),
        popularity_score: 0,
        metadata: {}
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

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <Header
        onRefresh={handleRefresh}
        onSettings={() => setShowSettings(true)}
        isRefreshing={isRefreshing}
        loading={loading}
      />
      <main className="max-w-7xl mx-auto py-6 sm:py-12 px-4">
        <BusinessIdeasGrid
          ideas={ideas}
          onIdeaClick={setSelectedIdea}
          selectedId={selectedIdea?.id}
        />
      </main>
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
