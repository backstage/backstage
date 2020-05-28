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
import { MemoryRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { lightTheme } from '@backstage/theme';
import privateExports, {
  defaultSystemIcons,
  ApiTestRegistry,
} from '@backstage/core-api';
const { PrivateAppImpl } = privateExports;

const NotFoundErrorPage = () => {
  throw new Error('Reached NotFound Page');
};

/**
 * Options to customize the behavior of the test app wrapper.
 */
type TestAppOptions = {
  /**
   * Initial route entries to pass along as `initialEntries` to the router.
   */
  routeEntries?: string[];
};

export function wrapInTestApp(
  Component: ComponentType | ReactNode,
  options: TestAppOptions = {},
) {
  const { routeEntries = ['/'] } = options;

  const app = new PrivateAppImpl({
    apis: new ApiTestRegistry(),
    components: {
      NotFoundErrorPage,
    },
    icons: defaultSystemIcons,
    plugins: [],
    themes: [
      {
        id: 'light',
        theme: lightTheme,
        title: 'Test App Theme',
        variant: 'light',
      },
    ],
  });

  let Wrapper: ComponentType;
  if (Component instanceof Function) {
    Wrapper = Component;
  } else {
    Wrapper = (() => Component) as FunctionComponent;
  }

  const AppProvider = app.getProvider();

  return (
    <AppProvider>
      <MemoryRouter initialEntries={routeEntries}>
        <Route component={Wrapper} />
      </MemoryRouter>
    </AppProvider>
  );
}
