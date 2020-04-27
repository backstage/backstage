import React from 'react';
import { addDecorator } from '@storybook/react';
import { lightTheme, darkTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { useDarkMode } from 'storybook-dark-mode';
import { Content } from '@backstage/core';

addDecorator(story => (
  <ThemeProvider theme={useDarkMode() ? darkTheme : lightTheme}>
    <CssBaseline>
      <Content>{story()}</Content>
    </CssBaseline>
  </ThemeProvider>
));
