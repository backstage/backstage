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
import { act, fireEvent, render, screen } from '@testing-library/react';
import {
  createMockAppHistory,
  renderTestApp,
} from '@backstage/frontend-test-utils';
import { AppRouteSwitch } from './AppRouteSwitch';
import {
  PageBlueprint,
  coreExtensionData,
  createExtension,
  createExtensionDataRef,
  createFrontendModule,
  createFrontendPlugin,
  createRouteRef,
  NotFoundErrorPage,
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

function renderError({ error }: { error: Error }) {
  return <p role="alert">{error.message}</p>;
}

/** Same data shape as the swappable component input of the app plugin. */
const swappableComponentDataRef = createExtensionDataRef<{
  ref: typeof NotFoundErrorPage.ref;
  loader: () => (props: object) => JSX.Element | null;
}>().with({ id: 'core.swappableComponent' });

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
          errorFallback={renderError}
        />,
      );
      const { pathname, search, hash } = history.getSnapshot().location;
      expect(`${pathname}${search}${hash}`).toBe(expected);
    },
  );

  it.each([
    ['/catalog', 'Catalog special', '/catalog/special'],
    ['/catalog/special', 'Other page', '/other'],
  ])(
    'ranks pages together with redirects from %s',
    async (from, expectedPage, expectedPath) => {
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
      expect(await screen.findByText(expectedPage)).toBeInTheDocument();
      expect(appHistory.getSnapshot().location.pathname).toBe(expectedPath);
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
          errorFallback={renderError}
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
          errorFallback={renderError}
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
    [
      // Incoming search and hash inherit verbatim; their placeholders are not
      // redirect template parameters.
      '/old/report?q=:id#*',
      '/new',
      '/new',
      '?q=:id',
      '#*',
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
          errorFallback={renderError}
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
        features: [
          createFrontendPlugin({
            pluginId: 'test',
            extensions: [entityPage, otherPage],
          }),
        ],
        initialRouteEntries: ['/catalog/broken'],
      });
      expect(
        await screen.findByText('Entity page crashed'),
      ).toBeInTheDocument();
      expect(
        screen.queryByText('ERROR 404: PAGE NOT FOUND'),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Error: Error in test' }),
      ).toBeVisible();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/broken'));
      expect(
        await screen.findByText('Entity page crashed'),
      ).toBeInTheDocument();
      await act(async () => appHistory.navigate('/other'));
      expect(await screen.findByText('Other page')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/unknown'));
      expect(
        await screen.findByText('ERROR 404: PAGE NOT FOUND'),
      ).toBeVisible();
    } finally {
      error.mockRestore();
    }
  });

  it('renders the not-found fallback for an explicitly empty route table', async () => {
    const { appHistory } = renderTestApp({
      extensions: [],
      initialRouteEntries: ['/nothing-here'],
    });
    expect(await screen.findByText(/PAGE NOT FOUND/i)).toBeInTheDocument();
    await act(async () => appHistory.navigate('/also-nothing'));
    expect(await screen.findByText(/PAGE NOT FOUND/i)).toBeInTheDocument();
  });

  it('routes a crashing not-found page to the ancestor extension boundary and recovers', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;
    function BrokenNotFound() {
      if (shouldThrow) {
        throw new Error('Not-found page crashed');
      }
      return <p>Healthy not-found</p>;
    }
    const brokenNotFound = createExtension({
      kind: 'component',
      name: 'core-not-found-error-page',
      attachTo: { id: 'api:app/swappable-components', input: 'components' },
      output: [swappableComponentDataRef],
      factory: () => [
        swappableComponentDataRef({
          ref: NotFoundErrorPage.ref,
          loader: () => () => <BrokenNotFound />,
        }),
      ],
    });
    try {
      const { appHistory } = renderTestApp({
        features: [
          createFrontendModule({
            pluginId: 'app',
            extensions: [brokenNotFound],
          }),
        ],
        extensions: [entityPage, otherPage],
        initialRouteEntries: ['/unknown'],
      });
      expect(await screen.findByText('Not-found page crashed')).toBeVisible();
      // The crash belongs to the app's own chrome, not to any plugin page:
      // the ancestor extension boundary of the app plugin catches it, where
      // the per-page boundary would have attributed it to the 'test' plugin.
      expect(
        screen.getByRole('heading', { name: 'Error: Error in app' }),
      ).toBeVisible();
      expect(screen.queryByText('Other page')).not.toBeInTheDocument();

      // The app-level boundary replaces the whole app chrome and keeps its
      // error across location changes; recovery goes through its retry
      // action rather than through navigation.
      await act(async () => appHistory.navigate('/other'));
      expect(screen.getByText('Not-found page crashed')).toBeVisible();
      expect(screen.queryByText('Other page')).not.toBeInTheDocument();

      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(await screen.findByText('Other page')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/unknown'));
      expect(await screen.findByText('Healthy not-found')).toBeInTheDocument();

      // The per-page boundary still recovers by navigating away and back.
      await act(async () => appHistory.navigate('/catalog/broken'));
      expect(await screen.findByText('Entity page crashed')).toBeVisible();
      await act(async () => appHistory.navigate('/catalog/healthy'));
      expect(await screen.findByText('Entity healthy')).toBeInTheDocument();
      await act(async () => appHistory.navigate('/unknown'));
      expect(await screen.findByText('Healthy not-found')).toBeInTheDocument();
    } finally {
      error.mockRestore();
    }
  });

  it('allows retrying a failed page through the app error display', async () => {
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    let shouldThrow = true;
    function RetryablePage() {
      if (shouldThrow) {
        throw new Error('Temporary page failure');
      }
      return <h1>Recovered page</h1>;
    }
    try {
      renderTestApp({
        features: [
          createFrontendPlugin({
            pluginId: 'test',
            extensions: [
              createExtension({
                name: 'retryable',
                attachTo: { id: 'app/routes', input: 'routes' },
                output: [
                  coreExtensionData.routePath,
                  coreExtensionData.reactElement,
                ],
                factory: () => [
                  coreExtensionData.routePath('/retryable'),
                  coreExtensionData.reactElement(<RetryablePage />),
                ],
              }),
            ],
          }),
        ],
        initialRouteEntries: ['/retryable'],
      });
      expect(await screen.findByText('Temporary page failure')).toBeVisible();
      expect(
        screen.getByRole('heading', { name: 'Error: Error in test' }),
      ).toBeVisible();
      shouldThrow = false;
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(
        await screen.findByRole('heading', { name: 'Recovered page' }),
      ).toBeVisible();
      expect(
        screen.queryByText('Temporary page failure'),
      ).not.toBeInTheDocument();
    } finally {
      error.mockRestore();
    }
  });
});
