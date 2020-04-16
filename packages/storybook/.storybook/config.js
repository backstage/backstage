import React from 'react';
import { addDecorator } from '@storybook/react';
import { BackstageTheme } from '@backstage/theme';
import { CssBaseline, ThemeProvider } from '@material-ui/core';

addDecorator(story => (
  <ThemeProvider theme={BackstageTheme}>
    <CssBaseline>{story()}</CssBaseline>
  </ThemeProvider>
));
