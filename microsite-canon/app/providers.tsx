'use client';

import { ReactNode } from 'react';
import { CanonProvider } from '@backstage/canon';
import { ThemeProvider } from 'next-themes';

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <CanonProvider>
      <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
    </CanonProvider>
  );
};
