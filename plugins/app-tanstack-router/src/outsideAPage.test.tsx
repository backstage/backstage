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
import { render, screen, waitFor } from '@testing-library/react';
import {
  TestApiProvider,
  createMockAppHistory,
} from '@backstage/frontend-test-utils';
import { appHistoryApiRef } from '@backstage/frontend-plugin-api';
import { PageMountProvider, usePageMount } from '@internal/frontend';
import { useRouter } from '@tanstack/react-router';
import {
  TanStackPageRouter,
  createTanStackPageRouter,
} from './TanStackPageRouter';

/**
 * The adapter rendered where there is no page: the old frontend system, and
 * any plain `render()` unit test.
 *
 * Many plugins ship for both frontend systems out of one package, and the
 * component that wraps itself in this adapter for the new system is very often
 * the same component the old system renders. Under the old system there is no
 * `PageMountProvider` above it, no framework route matching, and no framework
 * APIs registered at all. The wrap the ecosystem is being asked to add
 * therefore has to be invisible there — nothing scoped, nothing added, and in
 * particular nothing demanded of the surrounding app.
 *
 * Scoping needs two things: a page mount saying which part of the URL belongs
 * to the page, and the app history the page's history is projected from. The
 * cases below are every way of having fewer than both, because an adapter that
 * insists on one of them before checking for the other turns the wrap into a
 * crash rather than a no-op, in exactly the apps that have neither.
 */

function TanStackProbe() {
  // `warn: false` because "there is no router here" is the answer this probe
  // exists to record, not a problem to report — and because this hook hands
  // back `undefined` rather than throwing, so the absence has to be read from
  // the return value.
  const hasTanStackRouter = Boolean(useRouter({ warn: false }));
  const mount = usePageMount();
  return (
    <span data-testid="probe">
      {JSON.stringify({ hasTanStackRouter, mount: mount ?? null })}
    </span>
  );
}

function readProbe() {
  return JSON.parse(screen.getByTestId('probe').textContent!);
}

function renderWithContext(
  children: ReactNode,
  options: { appHistory?: boolean; mount?: boolean } = {},
) {
  let tree = <>{children}</>;
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
      <TestApiProvider
        apis={[
          [
            appHistoryApiRef,
            createMockAppHistory({ initialLocation: '/old/alpha' }),
          ],
        ]}
      >
        {tree}
      </TestApiProvider>
    );
  }
  return render(tree);
}

describe('TanStackPageRouter outside a page', () => {
  it.each([
    // A dual-mode package's own unit tests, and an old frontend system app.
    ['with neither a mount nor an app history', {}],
    // Content rendered outside any page in a new frontend system app.
    ['with an app history but no mount', { appHistory: true }],
    // The symmetric half: something published a mount, but the framework is
    // not the routing authority here and there is no location to project.
    ['with a mount but no app history', { mount: true }],
  ])('should be invisible %s', (_name, options) => {
    const { container } = renderWithContext(
      <TanStackPageRouter>
        <TanStackProbe />
      </TanStackPageRouter>,
      options,
    );

    // No page to scope to, so no TanStack router was built — the content is
    // left exactly as the surrounding app rendered it.
    expect(readProbe().hasTanStackRouter).toBe(false);
    // Nothing wrapped around the children either: the adapter is a fragment
    // here, so it cannot disturb layout or styling in a dual-mode package.
    expect(container.childElementCount).toBe(1);
    expect(container.firstElementChild).toBe(screen.getByTestId('probe'));
  });

  it('should demand nothing of the surrounding app', () => {
    // No API provider, no page mount, no router of any kind: the shape a
    // plugin's own unit tests have. Reaching for a framework API here — the
    // app history in particular — makes the wrap a crash rather than a no-op,
    // in every test the ecosystem already has.
    expect(() =>
      render(
        <TanStackPageRouter>
          <span data-testid="plain">Plain content</span>
        </TanStackPageRouter>,
      ),
    ).not.toThrow();

    expect(screen.getByTestId('plain')).toHaveTextContent('Plain content');
  });

  it('should never build the plugin-owned router without something to scope it to', () => {
    // `createTanStackPageRouter` is the same passthrough with a route tree the
    // plugin supplies. The factory needs the page history to build against, so
    // it must not be reached at all when there is none.
    const createRouter = jest.fn();
    const PageRouter = createTanStackPageRouter({ createRouter } as any);

    renderWithContext(
      <PageRouter>
        <span data-testid="plain">Plain content</span>
      </PageRouter>,
      { mount: true },
    );

    expect(screen.getByTestId('plain')).toHaveTextContent('Plain content');
    expect(createRouter).not.toHaveBeenCalled();
  });

  it('should still scope the page when it has both a mount and an app history', async () => {
    // The other side of the same switch: passing through when something is
    // missing must not turn into passing through when nothing is.
    renderWithContext(
      <TanStackPageRouter>
        <TanStackProbe />
      </TanStackPageRouter>,
      { mount: true, appHistory: true },
    );

    await waitFor(() => {
      expect(readProbe()).toEqual({
        hasTanStackRouter: true,
        mount: { basePath: '/old/alpha', routePattern: '/old/:id' },
      });
    });
  });
});
