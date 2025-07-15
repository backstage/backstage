import type { Component } from '@/utils/changelog';
import { ReactNode } from 'react';

export interface ComponentInfosProps {
  usageCode?: string;
  classNames?: string[];
  component: Component;
  children: ReactNode;
}
