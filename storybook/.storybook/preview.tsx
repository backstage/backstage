import React from 'react';
import { TestApiProvider } from '@backstage/test-utils';
import { Content, AlertDisplay } from '@backstage/core-components';
import { lightTheme, darkTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useDarkMode } from 'storybook-dark-mode';
import { apis } from './apis';

import type { Preview } from '@storybook/react';

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
    Story => (
      // @ts-ignore - TODO: Fix this
      <TestApiProvider apis={apis}>
        <ThemeProvider theme={useDarkMode() ? darkTheme : lightTheme}>
          <CssBaseline>
            <AlertDisplay />
            <Content>
              <Story />
            </Content>
          </CssBaseline>
        </ThemeProvider>
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
