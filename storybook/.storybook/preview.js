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
  // addon-a11y automatic execution timing is not consistent for all components
  // to avoid catching an interim rendering state resulting in false positives
  // this is is set to true.
  a11y: {
    manual: true,
  },
};
