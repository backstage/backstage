'use client';

import { ReactNode } from 'react';
import { PlaygroundProvider } from '@/utils/playground-context';

export const Providers = ({ children }: { children: ReactNode }) => {
  return <PlaygroundProvider>{children}</PlaygroundProvider>;
};
