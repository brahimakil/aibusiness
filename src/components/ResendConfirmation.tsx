"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type Props = {
  email: string;
};

export default function ResendConfirmation({ email }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      
      if (error) throw error;
      setMessage('Confirmation email resent successfully!');
    } catch (error) {
      setMessage('Failed to resend confirmation email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleResend}
        disabled={loading}
        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Resend confirmation email'}
      </button>
      {message && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{message}</p>
      )}
    </div>
  );
} 