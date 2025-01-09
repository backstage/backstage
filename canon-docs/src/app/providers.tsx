'use client';

import { ReactNode } from 'react';
import { CanonProvider } from '../../../packages/canon/src/contexts/canon';
import { PlaygroundProvider } from '@/utils/playground-context';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CanonProvider>
      <PlaygroundProvider>{children}</PlaygroundProvider>
    </CanonProvider>
  );
};
