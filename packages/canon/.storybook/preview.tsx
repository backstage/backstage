import React from 'react';
import type { Preview, ReactRenderer } from '@storybook/react';
import { withThemeByDataAttribute } from '@storybook/addon-themes';

import { themes } from '../src/theme/themes.css';
import './font.css';

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
      const theme = context.globals.theme || 'light';
      const backgroundColor = theme === 'light' ? '#ffffff' : '#000000';

      document.body.style.backgroundColor = backgroundColor;

      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = backgroundColor;
      });

      return (
        <div className={theme === 'light' ? themes.light : themes.dark}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
