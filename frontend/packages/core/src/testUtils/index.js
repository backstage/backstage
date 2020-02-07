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
import { act } from 'react-dom/test-utils';
import { render } from '@testing-library/react';

export { default as Keyboard } from './Keyboard';
export { default as mockBreakpoint } from './mockBreakpoint';

export function wrapInTestApp(Component, initialRouterEntries) {
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
  const themed = <ThemeProvider theme={V1}>{component}</ThemeProvider>;
  return wrapInTestApp(themed, initialRouterEntries);
}

export const wrapInTheme = (component, theme = V1) => (
  <ThemeProvider theme={theme}>{component}</ThemeProvider>
);

// Components using useEffect to perform an asynchronous action (such as fetch) must be rendered within an async
// act call to properly get the final state, even with mocked responses. This utility method makes the signature a bit
// cleaner, since act doesn't return the result of the evaluated function.
// https://github.com/testing-library/react-testing-library/issues/281
// https://github.com/facebook/react/pull/14853
export async function renderWithEffects(nodes) {
  let value;
  await act(async () => {
    value = await render(nodes);
  });
  return value;
}
