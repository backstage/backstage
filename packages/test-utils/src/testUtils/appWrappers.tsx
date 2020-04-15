/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { ComponentType, ReactNode, FunctionComponent } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { lightTheme } from '@backstage/theme';

export function wrapInTestApp(
  Component: ComponentType | ReactNode,
  initialRouterEntries: string[] = ['/'],
) {
  let Wrapper: ComponentType;
  if (Component instanceof Function) {
    Wrapper = Component;
  } else {
    Wrapper = (() => Component) as FunctionComponent;
  }

  return (
    <MemoryRouter initialEntries={initialRouterEntries}>
      <Route component={Wrapper} />
    </MemoryRouter>
  );
}

export function wrapInThemedTestApp(
  component: ReactNode,
  initialRouterEntries: string[] = ['/'],
) {
  const themed = <ThemeProvider theme={lightTheme}>{component}</ThemeProvider>;
  return wrapInTestApp(themed, initialRouterEntries);
}

export const wrapInTheme = (component: ReactNode, theme = lightTheme) => (
  <ThemeProvider theme={theme}>{component}</ThemeProvider>
);
