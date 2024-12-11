import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Storybook specific styles
import '../docs/components/styles.css';

// Canon specific styles

import '../src/css/backstage.css';
import '../src/css/components.css';

// Custom themes
import './themes/backstage.css';

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
      document.body.style.backgroundColor = 'var(--canon-background)';

      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor =
          'var(--canon-background)';
      });

      return <Story />;
    },
  ],
};

export default preview;
