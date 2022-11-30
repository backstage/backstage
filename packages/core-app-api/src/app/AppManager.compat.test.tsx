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

import tlr, { render } from '@testing-library/react';
import React from 'react';

describe.each(['beta', 'stable'])('react-router %s', rrVersion => {
  beforeAll(() => {
    jest.doMock('react', () => React);
    // This has some side effects, so need this to be stable to avoid re-require
    jest.doMock('@testing-library/react', () => tlr);
    jest.doMock('react-router', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-beta')
        : jest.requireActual('react-router-stable'),
    );
    jest.doMock('react-router-dom', () =>
      rrVersion === 'beta'
        ? jest.requireActual('react-router-dom-beta')
        : jest.requireActual('react-router-dom-stable'),
    );
  });

  afterAll(() => {
    jest.resetModules();
  });

  function requireDeps() {
    return {
      ...(require('./AppManager') as typeof import('./AppManager')),
      ...(require('../routing') as typeof import('../routing')),
      ...(require('react-router-dom') as typeof import('react-router-dom')),
      ...(require('@backstage/test-utils') as typeof import('@backstage/test-utils')),
    };
  }

  describe('AppManager', () => {
    it('supports base path', async () => {
      const { AppManager, MemoryRouter, Navigate, Route, FlatRoutes } =
        requireDeps();
      const app = new AppManager({
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
          Router: ({ children, basename }) => (
            <MemoryRouter
              initialEntries={['/foo']}
              basename={basename}
              children={children}
            />
          ),
          ErrorBoundaryFallback: () => null,
          ThemeProvider: ({ children }) => <>{children}</>,
        },
        configLoader: async () => [
          {
            context: 'test',
            data: {
              app: { baseUrl: 'http://localhost/foo' },
            },
          },
        ],
        bindRoutes: () => {},
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
  });
});
