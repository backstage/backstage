import React from 'react';
import { TestApiProvider } from '@backstage/test-utils';
import { Content, AlertDisplay } from '@backstage/core-components';
import { lightTheme, darkTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { apis } from './apis';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';

import type { Preview, ReactRenderer } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    darkMode: {
      current: 'light',
    },
    layout: 'fullscreen',
  },
  decorators: [
    withThemeFromJSXProvider<ReactRenderer>({
      themes: {
        Light: lightTheme,
        Dark: darkTheme,
      },
      defaultTheme: 'Light',
      Provider: ThemeProvider,
      GlobalStyles: CssBaseline,
    }),
    Story => (
      // @ts-ignore - TODO: Fix this
      <TestApiProvider apis={apis}>
        <AlertDisplay />
        <Content>
          <Story />
        </Content>
      </TestApiProvider>
    ),
  ],
};

export default preview;

export const parameters = {
  options: {
    storySort: {
      order: ['Plugins', 'Layout', 'Navigation'],
    },
  },
};
