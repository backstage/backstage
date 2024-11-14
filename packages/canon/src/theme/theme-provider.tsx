import React, { ReactNode } from 'react';
import { assignInlineVars } from '@vanilla-extract/dynamic';
import { vars } from './themes.css';

type Theme = typeof vars;

interface ThemeProviderProps {
  children: ReactNode;
  theme: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  theme,
}) => {
  const style = assignInlineVars(vars, theme);

  return <div style={style}>{children}</div>;
};
