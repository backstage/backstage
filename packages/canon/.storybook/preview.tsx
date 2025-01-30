import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Canon specific styles
import '../src/css/core.css';
import '../src/css/components.css';

// Custom themes
import './themes/backstage.css';
import { CanonProvider } from '../src/contexts/canon';

const preview: Preview = {
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
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        Light: 'light',
        Dark: 'dark',
        'Backstage Light': 'backstage-light',
        'Backstage Dark': 'backstage-dark',
      },
      defaultTheme: 'Light',
    }),
    Story => {
      document.body.style.backgroundColor = 'var(--canon-bg)';

      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'var(--canon-bg)';
      });

      return (
        <CanonProvider>
          <Story />
        </CanonProvider>
      );
    },
  ],
};

export default preview;
