"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BusinessIdea } from '@/types/database';
import BusinessIdeasGrid from './BusinessIdeasGrid';

export default function UserProfile() {
  const [savedIdeas, setSavedIdeas] = useState<BusinessIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setSavedIdeas([]);
      setUser({ user_metadata: { full_name: 'Guest User' } });
      setLoading(false);
    }, 1000);
  }, []);

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
      
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">
          No saved ideas yet. Generate some ideas to get started!
        </p>
      </div>
    </div>
  );
} 