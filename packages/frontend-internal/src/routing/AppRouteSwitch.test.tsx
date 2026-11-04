/*
 * Copyright 2026 The Backstage Authors
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

import { useState } from 'react';
import { act, render, screen } from '@testing-library/react';
import {
  createMockAppHistory,
  renderTestApp,
} from '@backstage/frontend-test-utils';
import { AppRouteSwitch } from './AppRouteSwitch';
import {
  PageBlueprint,
  coreExtensionData,
  createExtension,
  createRouteRef,
  useAppLocation,
} from '@backstage/frontend-plugin-api';

const entityRef = createRouteRef({ params: ['name'] });

function EntityPage() {
  const name = useAppLocation().pathname.split('/')[2];
  const [count, setCount] = useState(0);
  if (name === 'broken') {
    throw new Error('Entity page crashed');
  }
  return (
    <>
      <p>Entity {name}</p>
      <button onClick={() => setCount(value => value + 1)}>
        Count {count}
      </button>
    </>
  );
}

const entityPage = createExtension({
  name: 'entity',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [
    coreExtensionData.routePath,
    coreExtensionData.routeRef,
    coreExtensionData.reactElement,
  ],
  factory() {
    return [
      coreExtensionData.routePath('/catalog/:name'),
      coreExtensionData.routeRef(entityRef),
      coreExtensionData.reactElement(<EntityPage />),
    ];
  },
});

const otherPage = createExtension({
  name: 'other',
  attachTo: { id: 'app/routes', input: 'routes' },
  output: [coreExtensionData.routePath, coreExtensionData.reactElement],
  factory() {
    return [
      coreExtensionData.routePath('/other'),
      coreExtensionData.reactElement(<p>Other page</p>),
    ];
  },
});

describe('AppRouteSwitch', () => {
  it.each([
    ['/old/a%20b/c%23d', '/old', '/new/*', '/new/a%20b/c%23d'],
    [
      '/old/a%23b',
      '/old/:id',
      '/new/:id.json?q=:id#:id',
      '/new/a%23b.json?q=a%23b#a%23b',
    ],
    ['/old/report', '/old/:id', '/new/:id.json', '/new/report.json'],
    ['/old/a/b', '/old', '/new/*/edit', '/new/a/b/edit'],
    ['/old/a/b', '/old', '/search?path=*#*', '/search?path=a/b#a/b'],
    ['/old?filter=stale#old', '/old', '/new?#', '/new'],
    ['/old', '/old', '/new/', '/new/'],
  ])(
    'preserves redirect templates from %s matching %s to %s',
    (initialLocation, from, to, expected) => {
      const history = createMockAppHistory({ initialLocation });
      render(
        <AppRouteSwitch
          history={history}
          matches={[]}
          pages={new Map()}
          redirects={[{ from, to }]}
          fallback={<p>Not found</p>}
        />,
      );
      const { pathname, search, hash } = history.getSnapshot().location;
      expect(`${pathname}${search}${hash}`).toBe(expected);
    },
  );

  it.each(['/catalog', '/catalog/special'])(
    'ranks pages together with redirects from %s',
    async from => {
      const { appHistory } = renderTestApp({
        extensions: [
          PageBlueprint.make({
            name: 'special',
            params: {
              path: '/catalog/special',
              loader: async () => <p>Catalog special</p>,
            },
          }),
          otherPage,
        ],
        initialRouteEntries: ['/catalog/special'],
        config: {
          app: {
            extensions: [
              {
                'app/routes': {
                  config: { redirects: [{ from, to: '/other' }] },
                },
              },
            ],
          },
        },
      });
      if (from === '/catalog') {
        expect(await screen.findByText('Catalog special')).toBeInTheDocument();
        expect(appHistory.getSnapshot().location.pathname).toBe(
          '/catalog/special',
        );
      } else {
        expect(await screen.findByText('Other page')).toBeInTheDocument();
      }
    },
  );

  it.each([false, true])(
    'ranks specific redirects before general ones (specific first: %s)',
    specificFirst => {
      const history = createMockAppHistory({ initialLocation: '/old/special' });
      const general = { from: '/old', to: '/general' };
      const specific = { from: '/old/special', to: '/specific' };
      render(
        <AppRouteSwitch
          history={history}
          matches={[]}
          pages={new Map()}
          redirects={specificFirst ? [specific, general] : [general, specific]}
          fallback={<p>Not found</p>}
        />,
      );
      expect(history.getSnapshot().location.pathname).toBe('/specific');
    },
  );

  it.each([
    ['/old/special', ['/old/:id', '/old/special'], '/winner-1'],
    ['/old/special', ['/old/*', '/old/:id'], '/winner-1'],
    ['/old/special', ['/old/:id?/:extra?', '/old/:name'], '/winner-0'],
    ['/old/special', ['/old/:name', '/old/:id?/:extra?'], '/winner-0'],
    ['/old/special', ['/old/:id', '/old/:name'], '/winner-0'],
  ])(
    'uses React Router ranking and stable ties for %s with %j',
    (initialLocation, patterns, expected) => {
      const history = createMockAppHistory({ initialLocation });
      render(
        <AppRouteSwitch
          history={history}
          matches={[]}
          pages={new Map()}
          redirects={patterns.map((from, index) => ({
            from,
            to: `/winner-${index}`,
          }))}
          fallback={<p>Not found</p>}
        />,
      );
      expect(history.getSnapshot().location.pathname).toBe(expected);
    },
  );

  it.each([
    [
      '/old/abc',
      '/search?entity=:id#item-:id',
      '/search',
      '?entity=abc',
      '#item-abc',
    ],
    [
      '/old/abc/details',
      '/new/:id/*?entity=:id#item-:id',
      '/new/abc/details',
      '?entity=abc',
      '#item-abc',
    ],
  ])(
    'substitutes redirect parameters in path, query, and fragment from %s',
    (initialLocation, to, pathname, search, hash) => {
      const history = createMockAppHistory({ initialLocation });
      render(
        <AppRouteSwitch
          history={history}
          matches={[]}
          pages={new Map()}
          redirects={[{ from: '/old/:id', to }]}
          fallback={<p>Not found</p>}
        />,
      );
      expect(history.getSnapshot().location).toMatchObject({
        pathname,
        search,
        hash,
      });
    },
  );

  it('preserves page state while route parameters and plugin paths change', async () => {
    const { appHistory } = renderTestApp({
      extensions: [entityPage],
      initialRouteEntries: ['/catalog/first'],
    });
    expect(await screen.findByText('Entity first')).toBeInTheDocument();
    act(() => screen.getByRole('button', { name: 'Count 0' }).click());
    await act(async () => appHistory.navigate('/catalog/first/details'));
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
    await act(async () => appHistory.navigate('/catalog/second/details'));
    expect(await screen.findByText('Entity second')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Count 1' })).toBeInTheDocument();
  });

  it('recovers from a page crash at another mount or another page', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    try {
      const { appHistory } = renderTestApp({
        extensions: [entityPage, otherPage],
        initialRouteEntries: ['/catalog/broken'],
      });
      expect(
        await screen.findByText('ERROR 404: PAGE NOT FOUND'),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/broken'));
      expect(
        await screen.findByText('ERROR 404: PAGE NOT FOUND'),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate('/other'));
      expect(await screen.findByText('Other page')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
    } finally {
      error.mockRestore();
    }
  });
});
