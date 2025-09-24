import React, { useEffect } from 'react';
import { TestApiProvider } from '@backstage/test-utils';
import { Content, AlertDisplay } from '@backstage/core-components';
import { apis } from './support/apis';
import type { Decorator, Preview } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { UnifiedThemeProvider, themes } from '@backstage/theme';
import { allModes } from './modes';

// Default Backstage theme CSS (from packages/ui)
import '../packages/ui/src/css/styles.css';

// Custom Storybook chrome/styles
import './storybook.css';

// Custom themes
import './themes/spotify.css';

const preview: Preview = {
  globalTypes: {
    themeMode: {
      name: 'Theme Mode',
      description: 'Global theme mode for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'circlehollow', title: 'Light' },
          { value: 'dark', icon: 'circle', title: 'Dark' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
    themeName: {
      name: 'Theme Name',
      description: 'Global theme name for components',
      defaultValue: 'backstage',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'backstage', title: 'Backstage' },
          { value: 'spotify', title: 'Spotify' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    themeMode: 'light',
    themeName: 'backstage',
  },
  parameters: {
    layout: 'fullscreen',

    backgrounds: {
      disable: true,
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    options: {
      storySort: {
        order: ['Backstage UI', 'Plugins', 'Layout', 'Navigation'],
      },
    },

    viewport: {
      viewports: {
        initial: {
          name: 'Initial',
          styles: { width: '320px', height: '100%' },
        },
        xs: { name: 'Extra Small', styles: { width: '640px', height: '100%' } },
        sm: { name: 'Small', styles: { width: '768px', height: '100%' } },
        md: { name: 'Medium', styles: { width: '1024px', height: '100%' } },
        lg: { name: 'Large', styles: { width: '1280px', height: '100%' } },
        xl: {
          name: 'Extra Large',
          styles: { width: '1536px', height: '100%' },
        },
      },
    },

    docs: {
      codePanel: true,
    },

    chromatic: {
      modes: {
        'light backstage': allModes['light backstage'],
        // TODO: Enable these modes when we have more Chromatic snapshots.
        // 'dark backstage': allModes['dark backstage'],
        // 'light spotify': allModes['light spotify'],
        // 'dark spotify': allModes['dark spotify'],
      },
    },
  },
  decorators: [
    Story => {
      const [globals] = useGlobals();
      const selectedTheme =
        globals.themeMode === 'light' ? themes.light : themes.dark;
      const selectedThemeMode = globals.themeMode || 'light';
      const selectedThemeName = globals.themeName || 'backstage';

      useEffect(() => {
        document.body.removeAttribute('data-theme-mode');
        document.body.removeAttribute('data-theme-name');
        document.body.setAttribute('data-theme-mode', selectedThemeMode);
        document.body.setAttribute('data-theme-name', selectedThemeName);
        return () => {
          document.body.removeAttribute('data-theme-mode');
          document.body.removeAttribute('data-theme-name');
        };
      }, [selectedTheme, selectedThemeName]);

      document.body.style.backgroundColor = 'var(--bui-bg)';
      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'var(--bui-bg)';
      });

      return (
        <UnifiedThemeProvider theme={selectedTheme}>
          {/* @ts-ignore */}
          <TestApiProvider apis={apis}>
            <AlertDisplay />
            <Content>
              <Story />
            </Content>
          </TestApiProvider>
        </UnifiedThemeProvider>
      );
    },
  ],
};

export default preview;
