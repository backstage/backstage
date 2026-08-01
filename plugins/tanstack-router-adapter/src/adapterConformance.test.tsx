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
import '@testing-library/jest-dom';
import {
  TestApiProvider,
  createMockAppHistory,
  renderTestApp,
} from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  PageRouterBlueprint,
  SubPageBlueprint,
  appHistoryApiRef,
} from '@backstage/frontend-plugin-api';
import { Link, useParams, useSearch } from '@tanstack/react-router';
import { TanStackPageRouter } from './TanStackPageRouter';

/**
 * Page router adapter conformance.
 *
 * The behaviour a page adapter owes the framework is the same whichever
 * routing library it wraps, so the scenarios below are written once against
 * the framework — sub-page routing, the index redirect, staying mounted while
 * the concrete mount prefix changes, query and hash surviving, an off-page
 * location, and a round trip that must not accumulate the page prefix. The
 * adapter and its in-page probe are the only things that vary; every
 * assertion is shared, so an adapter that drifts fails here rather than
 * quietly behaving differently from its siblings.
 *
 * This adapter's own half — that a scoped TanStack location and an
 * app-absolute one convert back and forth without gaining or losing a prefix
 * — is pinned directly in `createTanStackHistory.test.ts`, where the
 * conversion can be driven at the emission ordering React never lets a test
 * reach from the outside.
 */

/**
 * The page content, written with this adapter's routing library. Carries a
 * piece of in-page state that a remount would reset, what the library makes
 * of the current search params, a link, and content one level deeper than the
 * sub-page itself (TanStack hands that tail over as the `_splat` param rather
 * than through a descendant route tree).
 */
function SubPageProbe(props: { name: string }) {
  const [bumped, setBumped] = useState(0);
  const search = useSearch({ strict: false }) as { q?: string };
  const params = useParams({ strict: false }) as { _splat?: string };
  return (
    <div>
      <span data-testid="sub-page">{props.name}</span>
      <span data-testid="bumped">{bumped}</span>
      <span data-testid="lib-query">{search.q ?? ''}</span>
      <button type="button" onClick={() => setBumped(n => n + 1)}>
        Bump
      </button>
      <Link to={`/${props.name}/deep` as never}>Deep</Link>
      {params._splat === 'deep' && <span data-testid="deep">deep</span>}
    </div>
  );
}

const adapter = {
  name: 'TanStack Router',
  PageRouter: TanStackPageRouter,
  SubPageProbe,
};

const PAGE_PATTERN = '/things/:id';

/** Sub-pages as the framework hands them over, for adapter-level rendering. */
const SUB_PAGES = [
  {
    path: 'overview',
    label: 'Overview',
    element: <adapter.SubPageProbe name="overview" />,
  },
  {
    path: 'settings',
    label: 'Settings',
    element: <adapter.SubPageProbe name="settings" />,
  },
];

function renderPage(initialPath: string) {
  const thingsPage = PageBlueprint.make({
    name: 'things',
    params: { path: PAGE_PATTERN, title: 'Things' },
  });
  const elsewherePage = PageBlueprint.make({
    name: 'elsewhere',
    params: {
      path: '/elsewhere',
      loader: async () => <div data-testid="elsewhere-page">Elsewhere</div>,
    },
  });
  const overviewSubPage = SubPageBlueprint.make({
    name: 'overview',
    attachTo: { id: 'page:test/things', input: 'pages' },
    params: {
      path: 'overview',
      title: 'Overview',
      loader: async () => <adapter.SubPageProbe name="overview" />,
    },
  });
  const settingsSubPage = SubPageBlueprint.make({
    name: 'settings',
    attachTo: { id: 'page:test/things', input: 'pages' },
    params: {
      path: 'settings',
      title: 'Settings',
      loader: async () => <adapter.SubPageProbe name="settings" />,
    },
  });
  const pageRouter = PageRouterBlueprint.make({
    name: 'under-test',
    attachTo: { id: 'page:test/things', input: 'router' },
    params: { component: adapter.PageRouter },
  });

  return renderTestApp({
    extensions: [
      thingsPage,
      elsewherePage,
      overviewSubPage,
      settingsSubPage,
      pageRouter,
    ],
    initialRouteEntries: [initialPath],
  });
}

describe(`${adapter.name} page adapter conformance`, () => {
  it('should route sub-pages, redirect the page root to the first tab, and keep deeper paths inside the sub-page', async () => {
    const { appHistory } = renderPage('/things/alpha/overview');

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Settings' })).toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/things/alpha/settings');
    });
    expect(await screen.findByTestId('sub-page')).toHaveTextContent('settings');
    expect(screen.queryByTestId('deep')).not.toBeInTheDocument();

    // The page root lands on the first sub-page, and says so in the URL.
    await act(async () => {
      appHistory.navigate('/things/alpha?q=1');
    });
    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    expect(appHistory.location.pathname).toBe('/things/alpha/overview');

    // A path deeper than the sub-page path still belongs to that sub-page.
    await act(async () => {
      appHistory.navigate('/things/alpha/overview/deep');
    });
    expect(await screen.findByTestId('deep')).toBeInTheDocument();
  });

  it('should not accumulate the mount prefix across a change of concrete prefix', async () => {
    const { appHistory } = renderPage('/things/alpha/overview');

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');

    // Entity A → entity B: the same page pattern at a different concrete
    // prefix.
    await act(async () => {
      appHistory.navigate('/things/beta/overview');
    });

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    expect(appHistory.location.pathname).toBe('/things/beta/overview');

    // Strip → navigate → emit → strip: an in-page link after the prefix
    // changed must target the new prefix exactly once.
    await act(async () => {
      screen.getByRole('link', { name: 'Deep' }).click();
    });

    expect(await screen.findByTestId('deep')).toBeInTheDocument();
    expect(appHistory.location.pathname).toBe('/things/beta/overview/deep');
  });

  it('should keep in-page state while the concrete mount prefix changes', async () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/things/alpha/overview',
    });
    const pageAt = (basePath: string) => (
      <TestApiProvider apis={[[appHistoryApiRef, appHistory]]}>
        <adapter.PageRouter
          basePath={basePath}
          routePattern={PAGE_PATTERN}
          subPages={SUB_PAGES}
          indexPath="overview"
        />
      </TestApiProvider>
    );

    const { rerender } = render(pageAt('/things/alpha'));

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    await act(async () => {
      screen.getByRole('button', { name: 'Bump' }).click();
    });
    await act(async () => {
      screen.getByRole('button', { name: 'Bump' }).click();
    });
    expect(screen.getByTestId('bumped')).toHaveTextContent('2');

    // The app history emits synchronously from navigate(), and only the
    // re-render it triggers hands the adapter its new concrete prefix — the
    // ordering that used to make the adapter rebuild its router and throw
    // away page state, scroll position and in-flight requests.
    await act(async () => {
      appHistory.navigate('/things/beta/overview');
    });
    rerender(pageAt('/things/beta'));

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    expect(screen.getByTestId('bumped')).toHaveTextContent('2');
  });

  it('should carry query and hash into the page and out through in-page hrefs', async () => {
    const { appHistory } = renderPage('/things/alpha/overview?q=1#frag');

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');
    expect(screen.getByTestId('lib-query')).toHaveTextContent('1');
    expect(appHistory.location.search).toBe('?q=1');
    expect(appHistory.location.hash).toBe('#frag');
    expect(screen.getByRole('link', { name: 'Deep' })).toHaveAttribute(
      'href',
      '/things/alpha/overview/deep',
    );
  });

  it('should hand the page over cleanly when the app navigates off it and back', async () => {
    const { appHistory } = renderPage('/things/alpha/overview');

    expect(await screen.findByTestId('sub-page')).toHaveTextContent('overview');

    await act(async () => {
      appHistory.navigate('/elsewhere');
    });
    expect(await screen.findByTestId('elsewhere-page')).toBeInTheDocument();
    expect(screen.queryByTestId('sub-page')).not.toBeInTheDocument();

    await act(async () => {
      appHistory.navigate('/things/gamma/settings');
    });
    expect(await screen.findByTestId('sub-page')).toHaveTextContent('settings');
    expect(appHistory.location.pathname).toBe('/things/gamma/settings');
  });
});
