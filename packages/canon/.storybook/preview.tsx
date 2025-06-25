import addonDocs from '@storybook/addon-docs';
import { definePreview } from '@storybook/react-webpack5';
import type { ReactRenderer } from '@storybook/react-webpack5';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/css/styles.css';

export default definePreview({
  parameters: {
    controls: {},
    backgrounds: {
      disable: true,
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['Core Concepts', 'Components'],
      },
    },
  },

  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        Light: 'light',
        Dark: 'dark',
      },
      defaultTheme: 'Light',
    }),
    Story => {
      document.body.style.backgroundColor = 'var(--canon-bg)';

      const docsStoryElements = document.getElementsByClassName('docs-story');
      Array.from(docsStoryElements).forEach(element => {
        (element as HTMLElement).style.backgroundColor = 'var(--canon-bg)';
      });

      return <Story />;
    },
  ],

  addons: [addonDocs()],
});
