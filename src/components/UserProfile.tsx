"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function UserProfile() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to AI Business Ideas
        </h2>
      </div>
      
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300">
          Generate some ideas to get started!
        </p>
      </div>
    </div>
  );
} 