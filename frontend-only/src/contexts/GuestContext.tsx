import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserMode = 'authenticated' | 'guest';

interface GuestContextType {
  userMode: UserMode;
  setUserMode: (mode: UserMode) => void;
  isGuest: boolean;
  isAuthenticated: boolean;
}

const GuestContext = createContext<GuestContextType | undefined>(undefined);

export const GuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userMode, setUserMode] = useState<UserMode>(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('user-mode');
    if (saved && (saved === 'authenticated' || saved === 'guest')) {
      return saved as UserMode;
    }
    // Default to guest mode for easy access
    return 'guest';
  });

  const isGuest = userMode === 'guest';
  const isAuthenticated = userMode === 'authenticated';

  // Save to localStorage when user mode changes
  useEffect(() => {
    localStorage.setItem('user-mode', userMode);
  }, [userMode]);

  return (
    <GuestContext.Provider value={{ userMode, setUserMode, isGuest, isAuthenticated }}>
      {children}
    </GuestContext.Provider>
  );
};

export const useGuest = () => {
  const context = useContext(GuestContext);
  if (context === undefined) {
    throw new Error('useGuest must be used within a GuestProvider');
  }
  return context;
};
