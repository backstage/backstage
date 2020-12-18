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

import { renderWithEffects, withLogCollector } from '@backstage/test-utils';
import { lightTheme } from '@backstage/theme';
import { render, screen } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { createRoutableExtension } from '../extensions';
import { defaultSystemIcons } from '../icons';
import { createPlugin } from '../plugin';
import { useRouteRef } from '../routing/hooks';
import { createExternalRouteRef, createRouteRef } from '../routing/RouteRef';
import { generateBoundRoutes, PrivateAppImpl } from './App';

describe('generateBoundRoutes', () => {
  it('runs happy path', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef({ path: '', title: '' });
    const result = generateBoundRoutes(({ bind }) => {
      bind(external, { myRoute: ref });
    });

    expect(result.get(external.myRoute)).toBe(ref);
  });

  it('throws on unknown keys', () => {
    const external = { myRoute: createExternalRouteRef() };
    const ref = createRouteRef({ path: '', title: '' });
    expect(() =>
      generateBoundRoutes(({ bind }) => {
        bind(external, { someOtherRoute: ref } as any);
      }),
    ).toThrow('Key someOtherRoute is not an existing external route');
  });
});

describe('Integration Test', () => {
  const plugin1RouteRef = createRouteRef({ path: '/blah1', title: '' });
  const plugin2RouteRef = createRouteRef({ path: '/blah2', title: '' });
  const externalRouteRef = createExternalRouteRef();

  const plugin1 = createPlugin({
    id: 'blob',
    externalRoutes: {
      foo: externalRouteRef,
    },
  });

  const plugin2 = createPlugin({
    id: 'plugin2',
  });

  const HiddenComponent = plugin2.provide(
    createRoutableExtension({
      component: () => Promise.resolve((_: { path?: string }) => <div />),
      mountPoint: plugin2RouteRef,
    }),
  );

  const ExposedComponent = plugin1.provide(
    createRoutableExtension({
      component: () =>
        Promise.resolve((_: PropsWithChildren<{ path?: string }>) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const routeRefFunction = useRouteRef(externalRouteRef);
          return <div>Our Route Is: {routeRefFunction({})}</div>;
        }),
      mountPoint: plugin1RouteRef,
    }),
  );

  it('runs happy path', async () => {
    const components = {
      NotFoundErrorPage: () => null,
      BootErrorPage: () => null,
      Progress: () => null,
      Router: BrowserRouter,
    };

    const app = new PrivateAppImpl({
      apis: [],
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultSystemIcons,
      plugins: [],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, { foo: plugin2RouteRef });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();

    await renderWithEffects(
      <Provider>
        <Router>
          <Routes>
            <ExposedComponent path="/" />
            <HiddenComponent path="/foo/bar" />
          </Routes>
        </Router>
      </Provider>,
    );

    expect(screen.getByText('Our Route Is: /foo/bar')).toBeInTheDocument();
  });

  it('should throw some error when the route has duplicate params', () => {
    const components = {
      NotFoundErrorPage: () => null,
      BootErrorPage: () => null,
      Progress: () => null,
      Router: BrowserRouter,
    };

    const app = new PrivateAppImpl({
      apis: [],
      defaultApis: [],
      themes: [
        {
          id: 'light',
          title: 'Light Theme',
          variant: 'light',
          theme: lightTheme,
        },
      ],
      icons: defaultSystemIcons,
      plugins: [],
      components,
      bindRoutes: ({ bind }) => {
        bind(plugin1.externalRoutes, { foo: plugin2RouteRef });
      },
    });

    const Provider = app.getProvider();
    const Router = app.getRouter();
    const { error: errorLogs } = withLogCollector(() => {
      expect(() =>
        render(
          <Provider>
            <Router>
              <Routes>
                <ExposedComponent path="/test/:thing">
                  <HiddenComponent path="/some/:thing" />
                </ExposedComponent>
              </Routes>
            </Router>
          </Provider>,
        ),
      ).toThrow(
        'Parameter :thing is duplicated in path /test/:thing/some/:thing',
      );
    });
    expect(errorLogs).toEqual([
      expect.stringContaining(
        'Parameter :thing is duplicated in path /test/:thing/some/:thing',
      ),
      expect.stringContaining(
        'The above error occurred in the <Provider> component',
      ),
    ]);
  });
});
