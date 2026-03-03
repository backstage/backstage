/*
 * Copyright 2022 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  useCallback,
  useMemo,
  useContext,
  createContext,
  createElement,
} from 'react';
import type { ReactNode } from 'react';
import { useSidebarPinState } from '@backstage/core-components';
import { Transformer } from '../transformer';
import { rules } from './rules';
import type { TechDocsTheme } from './rules/types';

/**
 * React context for providing a TechDocsTheme override.
 * In production, the context is null and useTechDocsTheme falls back to
 * CSS custom properties. In tests, provide a custom theme via
 * TechDocsThemeProvider.
 */
const TechDocsThemeContext = createContext<TechDocsTheme | null>(null);

/**
 * Provider component for injecting a custom TechDocsTheme.
 * Primarily used in tests to override theme values without relying on
 * browser-level CSS custom properties.
 *
 * @example
 * ```tsx
 * <TechDocsThemeProvider theme={myCustomTheme}>
 *   <ComponentUnderTest />
 * </TechDocsThemeProvider>
 * ```
 */
export const TechDocsThemeProvider = ({
  theme,
  children,
}: {
  theme: TechDocsTheme;
  children: ReactNode;
}) => createElement(TechDocsThemeContext.Provider, { value: theme }, children);

/**
 * Hook that provides a TechDocsTheme object for style rule generation.
 * Reads palette colors from CSS custom properties on document.documentElement.
 * Falls back to sensible defaults when properties are not set.
 * Can be overridden in tests via TechDocsThemeProvider.
 */
const useTechDocsTheme = (): TechDocsTheme => {
  const contextTheme = useContext(TechDocsThemeContext);

  return useMemo(() => {
    // If a theme was provided via context (e.g., in tests), use it directly
    if (contextTheme) return contextTheme;

    const style = window.getComputedStyle(document.documentElement);
    const get = (prop: string) => style.getPropertyValue(prop).trim();
    const themeMode =
      document.documentElement.getAttribute('data-theme-mode') === 'dark'
        ? 'dark'
        : 'light';

    return {
      palette: {
        type: themeMode,
        divider:
          get('--border') ||
          (themeMode === 'dark'
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(0,0,0,0.12)'),
        text: {
          primary:
            get('--foreground') ||
            (themeMode === 'dark' ? '#ffffff' : 'rgba(0,0,0,0.87)'),
          secondary:
            get('--muted-foreground') ||
            (themeMode === 'dark' ? '#a1a1aa' : 'rgba(0,0,0,0.54)'),
        },
        background: {
          default:
            get('--background') ||
            (themeMode === 'dark' ? '#303030' : '#fafafa'),
          paper:
            get('--card') || (themeMode === 'dark' ? '#424242' : '#ffffff'),
        },
        primary: {
          main: get('--primary') || '#1f5493',
          light:
            get('--ring') || (themeMode === 'dark' ? '#64b5f6' : '#42a5f5'),
          dark:
            get('--primary') || (themeMode === 'dark' ? '#1565c0' : '#1e88e5'),
          contrastText: get('--primary-foreground') || '#ffffff',
        },
        secondary: {
          light: get('--secondary') || '#ce93d8',
          dark: get('--secondary-foreground') || '#7b1fa2',
        },
        success: {
          main: get('--status-ok') || '#4caf50',
          light: get('--success-foreground') || '#81c784',
          dark: get('--status-ok') || '#388e3c',
        },
        error: {
          light: get('--status-error') || '#e57373',
          dark: get('--destructive') || '#d32f2f',
        },
        warning: {
          main: get('--status-warning') || '#ed6c02',
          light: get('--status-warning') || '#ff9800',
          dark: get('--warning-foreground') || '#e65100',
        },
        action: {
          hover:
            themeMode === 'dark'
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.04)',
          disabledBackground:
            themeMode === 'dark'
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(0,0,0,0.12)',
        },
        link: get('--primary') || '#1f5493',
      },
      shadows: [
        'none',
        '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
        '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
      ],
      typography: {
        fontFamily:
          get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontSize: '2.125rem',
          fontWeight: 300,
          lineHeight: 1.167,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        h2: {
          fontSize: '1.5rem',
          fontWeight: 300,
          lineHeight: 1.235,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        h3: {
          fontSize: '1.25rem',
          fontWeight: 400,
          lineHeight: 1.334,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        h4: {
          fontSize: '1.125rem',
          fontWeight: 400,
          lineHeight: 1.4,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        h5: {
          fontSize: '1rem',
          fontWeight: 400,
          lineHeight: 1.5,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        h6: {
          fontSize: '0.875rem',
          fontWeight: 500,
          lineHeight: 1.6,
          fontFamily:
            get('--font-sans') || '"Roboto", "Helvetica", "Arial", sans-serif',
        },
        htmlFontSize: 16,
      },
      shape: {
        borderRadius: 4,
      },
      spacing: (factor: number) => `${8 * factor}`,
    };
  }, [contextTheme]);
};

/**
 * Sidebar pinned state to be used in computing style injections.
 */
const useSidebar = () => useSidebarPinState();

/**
 * Process all rules and concatenate their definitions into a single style.
 * @returns a string containing all processed style definitions.
 */
const useRuleStyles = () => {
  const sidebar = useSidebar();
  const theme = useTechDocsTheme();

  return useMemo(() => {
    const options = { theme, sidebar };
    return rules.reduce<string>((styles, rule) => styles + rule(options), '');
  }, [theme, sidebar]);
};

/**
 * Returns a transformer that inserts all style rules into the given element's head tag.
 */
export const useStylesTransformer = (): Transformer => {
  const styles = useRuleStyles();

  return useCallback(
    (dom: Element) => {
      dom
        .getElementsByTagName('head')[0]
        .insertAdjacentHTML('beforeend', `<style>${styles}</style>`);
      return dom;
    },
    [styles],
  );
};
