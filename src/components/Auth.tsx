"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';

export default function AuthComponent() {
  return (
    <div className="max-w-md w-full mx-auto p-4">
      <Auth
        supabaseClient={supabase}
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brandAccent: '#3B82F6',
                inputBackground: 'transparent',
                inputText: 'white',
                inputPlaceholder: 'rgb(156 163 175)',
              },
            },
            dark: {
              colors: {
                brandAccent: '#3B82F6',
                inputBackground: 'rgb(17 24 39)',
                inputText: 'white',
                inputPlaceholder: 'rgb(156 163 175)',
                inputBorder: 'rgb(55 65 81)',
              },
            },
          },
          className: {
            input: 'dark:text-white dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400',
            label: 'dark:text-gray-200',
            button: 'dark:hover:bg-blue-600',
          },
        }}
        providers={['google']}
        redirectTo={`${window.location.origin}/auth/callback`}
      />
    </div>
  );
} 