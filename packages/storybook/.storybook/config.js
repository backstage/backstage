import React from 'react';
import { addDecorator } from '@storybook/react';
import { lightTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

addDecorator(story => (
  <ThemeProvider theme={lightTheme}>
    <CssBaseline>{story()}</CssBaseline>
  </ThemeProvider>
));
