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

import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import {
  TestApiProvider,
  createMockAppHistory,
} from '@backstage/frontend-test-utils';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { PageMountProvider, usePageMount } from '@internal/frontend';
import {
  MemoryRouter,
  Route,
  Routes,
  useParams,
  useResolvedPath,
} from 'react-router';
import { ReactRouterV7PageRouter } from './ReactRouterV7PageRouter';

/**
 * The adapter rendered where there is no page: the old frontend system, and
 * any plain `render()` unit test.
 *
 * Many plugins ship for both frontend systems out of one package, and the
 * component that wraps itself in this adapter for the new system is very often
 * the same component the old system renders. Under the old system there is no
 * `PageMountProvider` above it, no framework route matching, no framework APIs
 * registered at all, and an ordinary `<Router>` somewhere near the app root
 * doing all the routing. The wrap the ecosystem is being asked to add
 * therefore has to be *invisible* there: nothing scoped, nothing added, and in
 * particular nothing demanded of the surrounding app.
 *
 * Scoping needs two things — a page mount saying which part of the URL belongs
 * to the page, and the app history the projection reads its location from. The
 * cases below are every way of having fewer than both, because an adapter that
 * insists on one of them before checking for the other turns the wrap into a
 * crash rather than a no-op, in exactly the apps that have neither.
 *
 * "Adds nothing" is checked differentially rather than by listing what the
 * children can see. The same probe is rendered twice under one legacy router —
 * once wrapped, once not — and the two have to agree. Writing down expected
 * params and paths instead would pass just as happily against an adapter that
 * quietly replaced the legacy route context with a coincidentally similar one.
 */

function LegacyProbe(props: { id: string }) {
  const params = useParams();
  const resolved = useResolvedPath('edit');
  const mount = usePageMount();
  return (
    <span data-testid={props.id}>
      {JSON.stringify({
        params,
        resolved: resolved.pathname,
        mount: mount ?? null,
      })}
    </span>
  );
}

function readProbe(id: string) {
  return JSON.parse(screen.getByTestId(id).textContent!);
}

/**
 * The old frontend system's shape: an ordinary React Router owning the
 * routing, and whatever framework context the surrounding app happened to
 * provide — by default, none.
 */
function renderUnderLegacyRouter(
  children: ReactNode,
  options: { appHistory?: boolean; mount?: boolean } = {},
) {
  let tree = (
    <MemoryRouter initialEntries={['/old/alpha/deep']}>
      <Routes>
        <Route path="/old/:id/*" element={children} />
      </Routes>
    </MemoryRouter>
  );
  if (options.mount) {
    tree = (
      <PageMountProvider
        mount={{ basePath: '/old/alpha', routePattern: '/old/:id' }}
      >
        {tree}
      </PageMountProvider>
    );
  }
  if (options.appHistory) {
    tree = (
      <TestApiProvider apis={[[appHistoryApiRef, createMockAppHistory()]]}>
        {tree}
      </TestApiProvider>
    );
  }
  return render(tree);
}

describe('ReactRouterV7PageRouter outside a page', () => {
  it.each([
    // A dual-mode package's own unit tests, and an old frontend system app.
    ['with neither a mount nor an app history', {}],
    // Content rendered outside any page in a new frontend system app.
    ['with an app history but no mount', { appHistory: true }],
    // The symmetric half: something published a mount, but the framework is
    // not the routing authority here and there is no location to project.
    ['with a mount but no app history', { mount: true }],
  ])('should be invisible %s', (_name, options) => {
    renderUnderLegacyRouter(
      <>
        <ReactRouterV7PageRouter>
          <LegacyProbe id="wrapped" />
        </ReactRouterV7PageRouter>
        <LegacyProbe id="bare" />
      </>,
      options,
    );

    // Identical to the same probe with no adapter around it: same match, same
    // relative resolution, same view of the page mount.
    expect(readProbe('wrapped')).toEqual(readProbe('bare'));
    // Spelled out too, so the comparison above cannot pass by both sides being
    // broken in the same way. The resolved path carries the splat tail, which
    // is v7's own relative-splat behaviour — further evidence that the legacy
    // router is the one still answering here.
    expect(readProbe('wrapped')).toMatchObject({
      params: { id: 'alpha', '*': 'deep' },
      resolved: '/old/alpha/deep/edit',
    });
  });

  it('should demand nothing of the surrounding app', () => {
    // No API provider, no page mount, no router of any kind: the shape a
    // plugin's own unit tests have. Reaching for a framework API here — the
    // app history in particular — makes the wrap a crash rather than a no-op,
    // in every test the ecosystem already has.
    expect(() =>
      render(
        <ReactRouterV7PageRouter>
          <span data-testid="plain">Plain content</span>
        </ReactRouterV7PageRouter>,
      ),
    ).not.toThrow();

    expect(screen.getByTestId('plain')).toHaveTextContent('Plain content');
  });

  it('should still scope the page when it has both a mount and an app history', () => {
    // The other side of the same switch: passing through when something is
    // missing must not turn into passing through when nothing is.
    render(
      <TestApiProvider
        apis={[
          [
            appHistoryApiRef,
            createMockAppHistory({ initialLocation: '/old/alpha/deep' }),
          ],
        ]}
      >
        <PageMountProvider
          mount={{ basePath: '/old/alpha', routePattern: '/old/:id' }}
        >
          <ReactRouterV7PageRouter>
            <LegacyProbe id="scoped" />
          </ReactRouterV7PageRouter>
        </PageMountProvider>
      </TestApiProvider>,
    );

    // v7 resolves a relative target against the leaf match's full pathname,
    // splat tail included — the behaviour its predecessor put behind
    // `v7_relativeSplatPath` — so the tail is part of the base here. The
    // adapter inherits that rather than overriding it, which is the point: a
    // page gets the library it asked for, not a Backstage dialect of it.
    expect(readProbe('scoped')).toMatchObject({
      params: { id: 'alpha', '*': 'deep' },
      resolved: '/old/alpha/deep/edit',
      mount: { basePath: '/old/alpha', routePattern: '/old/:id' },
    });
  });
});
