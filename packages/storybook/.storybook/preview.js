import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { lightTheme, darkTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useDarkMode } from 'storybook-dark-mode';
import { Content, ApiProvider, AlertDisplay } from '@backstage/core';
import { apis } from './apis';

addDecorator(story => (
  <ApiProvider apis={apis}>
    <ThemeProvider theme={useDarkMode() ? darkTheme : lightTheme}>
      <CssBaseline>
        <AlertDisplay />
        <Content>{story()}</Content>
      </CssBaseline>
    </ThemeProvider>
  </ApiProvider>
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
