import { apis } from './apis';
import { Content, AlertDisplay } from '@backstage/core-components';
import { TestApiProvider } from '@backstage/test-utils';
import { themes } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import React from 'react';
import { useDarkMode } from 'storybook-dark-mode';

export const decorators = [
  Story => (
    <TestApiProvider apis={apis}>
      <ThemeProvider theme={useDarkMode() ? themes.dark : themes.light}>
        <CssBaseline>
          <AlertDisplay />
          <Content>
            <Story />
          </Content>
        </CssBaseline>
      </ThemeProvider>
    </TestApiProvider>
  ),
];

export const parameters = {
  darkMode: {
    // Set the initial theme
    current: 'light',
  },
  layout: 'fullscreen',
  options: {
    storySort: {
      order: ['Plugins', 'Layout', 'Navigation'],
    },
  },
};
