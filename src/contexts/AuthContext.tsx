"use client";

import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    // Simplified sign out
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 