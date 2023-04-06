/*
 * Copyright 2020 The Backstage Authors
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

import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Navigate, Route } from 'react-router-dom';
import { FlatRoutes } from '../routing';
import { AppManager } from './AppManager';
import { AppOptions } from './types';

jest.mock('react-router', () => jest.requireActual('react-router-stable'));
jest.mock('react-router-dom', () =>
  jest.requireActual('react-router-dom-stable'),
);

const mockAppOptions: AppOptions = {
  apis: [],
  defaultApis: [],
  themes: [
    {
      id: 'light',
      title: 'Light Theme',
      variant: 'light',
      Provider: ({ children }) => <>{children}</>,
    },
  ],
  icons: {} as any,
  plugins: [],
  components: {
    NotFoundErrorPage: () => null,
    BootErrorPage: () => null,
    Progress: () => null,
    Router: props => <MemoryRouter {...props} />,
    ErrorBoundaryFallback: () => null,
    ThemeProvider: ({ children }) => <>{children}</>,
  },
  configLoader: async () => [],
  bindRoutes: () => {},
};

describe('AppManager', () => {
  it('supports base path', async () => {
    const app = new AppManager({
      ...mockAppOptions,
      components: {
        ...mockAppOptions.components,
        Router: props => <MemoryRouter {...props} initialEntries={['/foo']} />,
      },
      configLoader: async () => [
        {
          context: 'test',
          data: {
            app: { baseUrl: 'http://localhost/foo' },
          },
        },
      ],
    });

    const AppProvider = app.getProvider();
    const AppRouter = app.getRouter();

    const rendered = render(
      <AppProvider>
        <AppRouter>
          <FlatRoutes>
            <Route path="/" element={<Navigate to="bar" />} />
            <Route path="/bar" element={<span>bar</span>} />
          </FlatRoutes>
        </AppRouter>
      </AppProvider>,
    );

    await expect(rendered.findByText('bar')).resolves.toBeInTheDocument();
  });

  it('supports base path with absolute navigation', async () => {
    const app = new AppManager({
      ...mockAppOptions,
      components: {
        ...mockAppOptions.components,
        Router: props => <MemoryRouter {...props} initialEntries={['/foo']} />,
      },
      configLoader: async () => [
        {
          context: 'test',
          data: {
            app: { baseUrl: 'http://localhost/foo' },
          },
        },
      ],
    });

    const AppProvider = app.getProvider();
    const AppRouter = app.getRouter();

    const rendered = render(
      <AppProvider>
        <AppRouter>
          <FlatRoutes>
            <Route path="/" element={<Navigate to="/bar" />} />
            <Route path="/bar" element={<span>bar</span>} />
          </FlatRoutes>
        </AppRouter>
      </AppProvider>,
    );

    await expect(rendered.findByText('bar')).resolves.toBeInTheDocument();
  });
});
