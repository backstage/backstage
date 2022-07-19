import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { lightTheme, darkTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useDarkMode } from 'storybook-dark-mode';
import { apis } from './apis';

import { Content, AlertDisplay } from '@backstage/core-components';
import { TestApiProvider } from '@backstage/test-utils';

addDecorator(story => (
  <TestApiProvider apis={apis}>
    <ThemeProvider theme={useDarkMode() ? darkTheme : lightTheme}>
      <CssBaseline>
        <AlertDisplay />
        <Content>{story()}</Content>
      </CssBaseline>
    </ThemeProvider>
  </TestApiProvider>
));

addParameters({
  darkMode: {
    // Set the initial theme
    current: 'light',
  },
  layout: 'fullscreen',
});

export const parameters = {
  options: {
    storySort: {
      order: ['Plugins', 'Layout', 'Navigation'],
    },
  },
};
