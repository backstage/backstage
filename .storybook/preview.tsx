import addonA11y from '@storybook/addon-a11y';
import addonDocs from '@storybook/addon-docs';
import addonThemes from '@storybook/addon-themes';
import addonLinks from '@storybook/addon-links';
import { definePreview } from '@storybook/react-vite';
import React, { useEffect } from 'react';
import { TestApiProvider } from '@backstage/test-utils';
import { AlertDisplay } from '@backstage/core-components';
import { apis } from './support/apis';
import { useGlobals } from 'storybook/preview-api';
import { UnifiedThemeProvider, themes } from '@backstage/theme';
import { allModes } from './modes';

// Default Backstage theme CSS (from packages/ui)
import '../packages/ui/src/css/styles.css';

// Custom Storybook chrome/styles
import './storybook.css';

// Custom themes
import './themes/spotify.css';
import { Box } from '../packages/ui/src/components/Box';

export default definePreview({
  tags: ['manifest'],
  globalTypes: {
    themeMode: {
      name: 'Theme Mode',
      description: 'Global theme mode for components',
      defaultValue: 'light',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
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
        dynamicTitle: true,
      },
    },
    background: {
      name: 'Background',
      description: 'Global background for components',
      defaultValue: 'app',
      toolbar: {
        icon: 'contrast',
        items: [
          { value: 'app', title: 'App Background' },
          { value: 'neutral-1', title: 'Neutral 1 Background' },
          { value: 'neutral-2', title: 'Neutral 2 Background' },
          { value: 'neutral-3', title: 'Neutral 3 Background' },
        ],
      },
    },
  },

  initialGlobals: {
    themeMode: 'light',
    themeName: 'backstage',
    background: 'app',
  },

  parameters: {
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
        order: [
          'Backstage UI',
          'Guidelines',
          'Plugins',
          'Layout',
          'Navigation',
        ],
      },
    },

    viewport: {
      options: {
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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },

  decorators: [
    (Story, context) => {
      const [globals] = useGlobals();
      const selectedTheme =
        globals.themeMode === 'light' ? themes.light : themes.dark;
      const selectedThemeMode = globals.themeMode || 'light';
      const selectedThemeName = globals.themeName || 'backstage';
      const selectedBackground = globals.background || 'app';
      const isFullscreen = context.parameters.layout === 'fullscreen';

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

      document.body.style.backgroundColor = 'var(--bui-bg-app)';
      document.body.style.padding =
        isFullscreen && selectedBackground !== 'app' ? '1rem' : '';
      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'var(--bui-bg-app)';
      });

      return (
        <UnifiedThemeProvider theme={selectedTheme}>
          {/* @ts-ignore */}
          <TestApiProvider apis={apis}>
            <AlertDisplay />
            {Array.from({
              length:
                selectedBackground === 'app'
                  ? 0
                  : parseInt(selectedBackground.split('-')[1], 10),
            }).reduce<React.ReactNode>(
              children => (
                <Box bg="neutral" p="4">
                  {children}
                </Box>
              ),
              <Story />,
            )}
          </TestApiProvider>
        </UnifiedThemeProvider>
      );
    },
  ],

  addons: [addonLinks(), addonThemes(), addonDocs(), addonA11y()],
});
