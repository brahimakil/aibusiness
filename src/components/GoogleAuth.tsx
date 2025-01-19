"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

export default function GoogleAuth() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
        Sign in to save your ideas
      </h2>
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: '#4F46E5',
                brandAccent: '#4338CA',
              },
            },
            dark: {
              colors: {
                brand: '#6366F1',
                brandAccent: '#4F46E5',
              },
            },
          },
        }}
        providers={['google']}
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
      />
    </motion.div>
  );
} 