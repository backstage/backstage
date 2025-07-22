import React, { useEffect } from 'react';
import type { Decorator, Preview, ReactRenderer } from '@storybook/react';
import { useGlobals } from '@storybook/preview-api';

// Default Backstage theme
import '../src/css/styles.css';

// Custom mocked styles
import '../src/css/storybook.css';

// Custom themes
import './themes/spotify.css';

export const withThemes: Decorator = StoryFn => {
  const [globals] = useGlobals();
  const selectedTheme = globals.themeMode || 'light';
  const selectedThemeName = globals.themeName || 'default';

  useEffect(() => {
    const htmlElement = document.documentElement;

    // Remove any existing theme data attributes
    htmlElement.removeAttribute('data-theme');
    htmlElement.removeAttribute('data-theme-name');

    // Add the selected theme data attribute
    htmlElement.setAttribute('data-theme', selectedTheme);
    htmlElement.setAttribute('data-theme-name', selectedThemeName);

    // Cleanup on unmount
    return () => {
      htmlElement.removeAttribute('data-theme');
      htmlElement.removeAttribute('data-theme-name');
    };
  }, [selectedTheme, selectedThemeName]);

  return <StoryFn />;
};

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
      defaultValue: 'default',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'default', title: 'Default (Backstage)' },
          { value: 'spotify', title: 'Spotify' },
        ],
        showName: true,
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    themeMode: 'light',
    themeName: 'default',
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Core Concepts', 'Components'],
      },
    },
    viewport: {
      viewports: {
        initial: {
          name: 'Initial',
          styles: {
            width: '320px',
            height: '100%',
          },
        },
        xs: {
          name: 'Extra Small',
          styles: {
            width: '640px',
            height: '100%',
          },
        },
        sm: {
          name: 'Small',
          styles: {
            width: '768px',
            height: '100%',
          },
        },
        md: {
          name: 'Medium',
          styles: {
            width: '1024px',
            height: '100%',
          },
        },
        lg: {
          name: 'Large',
          styles: {
            width: '1280px',
            height: '100%',
          },
        },
        xl: {
          name: 'Extra Large',
          styles: {
            width: '1536px',
            height: '100%',
          },
        },
      },
    },
  },
  decorators: [
    withThemes,
    Story => {
      document.body.style.backgroundColor = 'var(--bui-bg)';

      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'var(--bui-bg)';
      });

      return <Story />;
    },
  ],
};

export default preview;
