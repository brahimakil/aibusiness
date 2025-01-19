"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { BusinessIdea } from '@/types/database';
import BusinessIdeasGrid from './BusinessIdeasGrid';

export default function UserProfile() {
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUserProfile();
    loadSavedIdeas();
  }, []);

  const loadUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadSavedIdeas = async () => {
    const { data: ideas } = await supabase
      .from('business_ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (ideas) {
      setSavedIdeas(ideas);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.user_metadata?.full_name}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Your saved business ideas
        </p>
      </div>
      
      {savedIdeas.length > 0 ? (
        <BusinessIdeasGrid
          ideas={savedIdeas}
          onIdeaClick={() => {}}
          selectedId={null}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">
            No saved ideas yet. Generate some ideas to get started!
          </p>
        </div>
      )}
    </div>
  );
} 