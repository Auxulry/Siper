'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useStore, {StoreState} from '@/store';

const ZustandContext = createContext<StoreState | null>(null);

interface ZustandProviderProps {
  children: ReactNode;
}

export const ZustandProvider: React.FC<ZustandProviderProps> = ({ children }) => {
  const store = useStore();
  return (
    <ZustandContext.Provider value={store}>
      {children}
    </ZustandContext.Provider>
  );
};

export const useZustandStore = (): StoreState => {
  const context = useContext(ZustandContext);
  if (!context) {
    throw new Error('useZustandStore must be used within a ZustandProvider');
  }
  return context;
};
