import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

// Storybook specific styles
import '../docs/components/styles.css';

// Canon specific styles
import '../src/theme/styles.css';

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
  },
  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story, context) => {
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
