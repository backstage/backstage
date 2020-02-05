/**
 *  Helpers for testing components
 */
import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';

import { V1 } from '../theme/BackstageTheme';
import ErrorBoundary from '../layout/ErrorBoundary';

export { default as Keyboard } from './Keyboard';
export { default as mockBreakpoint } from './mockBreakpoint';

export function wrapInTestApp(
  Component,
  initialRouterEntries,
) {
  const Wrapper = Component instanceof Function ? Component : () => Component;

  return (
    <MemoryRouter initialEntries={initialRouterEntries || ['/']}>
      <ErrorBoundary>
        <Route component={Wrapper} />
      </ErrorBoundary>
    </MemoryRouter>
  );
}

export function wrapInThemedTestApp(component, initialRouterEntries) {
  const themed = (
    <MuiThemeProvider theme={V1}>
      <ThemeProvider theme={V1}>{component}</ThemeProvider>
    </MuiThemeProvider>
  );
  return wrapInTestApp(themed, initialRouterEntries);
}

export const wrapInTheme = (component, theme = V1) => (
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={theme}>{component}</ThemeProvider>
  </MuiThemeProvider>
);
