"use client";

import { useState } from 'react';
import { BusinessIdea } from '@/types/database';

type Props = {
  ideas: BusinessIdea[];
  onIdeaClick: (idea: BusinessIdea) => void;
};

export default function IdeasGrid({ ideas, onIdeaClick }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {ideas.map((idea) => (
        <div
          key={idea.id}
          onClick={() => onIdeaClick(idea)}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer
                     transform transition-all hover:scale-105 hover:shadow-xl"
        >
          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
            {idea.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {idea.category}
          </p>
        </div>
      ))}
    </div>
  );
} 