'use client';

import { ReactNode } from 'react';
import { CanonProvider } from '@backstage/canon';
import { ThemeProvider } from 'next-themes';
import { PlaygroundProvider } from '@/utils/playground-context';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CanonProvider>
      <ThemeProvider defaultTheme="light">
        <PlaygroundProvider>{children}</PlaygroundProvider>
      </ThemeProvider>
    </CanonProvider>
  );
};
