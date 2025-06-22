
import React, { createContext, useContext, useState } from 'react';

interface PrivacyContextType {
  isPrivate: boolean;
  setIsPrivate: (isPrivate: boolean) => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPrivate, setIsPrivate] = useState(false);

  return (
    <PrivacyContext.Provider value={{ isPrivate, setIsPrivate }}>
      {children}
    </PrivacyContext.Provider>
  );
};

export const usePrivacy = () => {
  const context = useContext(PrivacyContext);
  if (context === undefined) {
    throw new Error('usePrivacy must be used within a PrivacyProvider');
  }
  return context;
};
