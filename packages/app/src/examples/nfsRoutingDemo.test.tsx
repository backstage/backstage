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

import { screen } from '@testing-library/react';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import { renderTestApp } from '@backstage/frontend-test-utils';
import { nfsRoutingDemoExtensions } from './nfsRoutingDemo';

// The demo is what a reviewer clicks through, so these assert on the content
// each panel actually renders. A panel that silently resolved to `undefined`
// would still mount an empty container without throwing, which is exactly the
// failure mode a "did not throw" assertion misses.
const demoPlugin = createFrontendPlugin({
  pluginId: 'pages',
  extensions: nfsRoutingDemoExtensions,
});

function renderDemoAt(path: string) {
  return renderTestApp({
    features: [demoPlugin],
    initialRouteEntries: [path],
  });
}

/** No panel may report a doubled base or a link that missed its target. */
function expectNoPathProblems() {
  expect(screen.queryByText(/PATH DOUBLED/)).toBeNull();
  expect(screen.queryByText(/expected \//)).toBeNull();
}

describe('nfsRoutingDemo', () => {
  it('should inherit React Router v6 for nested routes and resolve deep links without doubling the base', async () => {
    const { unmount } = renderDemoAt('/nfs-routing-demo/nested-v6');

    expect(
      await screen.findByText('Nested routes under React Router v6'),
    ).toBeInTheDocument();
    expect(screen.getByText('/nfs-routing-demo/nested-v6')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'widget/blue' })).toHaveAttribute(
      'href',
      '/nfs-routing-demo/nested-v6/widget/blue',
    );
    expect(screen.getByRole('link', { name: 'widget/green' })).toHaveAttribute(
      'href',
      '/nfs-routing-demo/nested-v6/widget/green',
    );
    expectNoPathProblems();
    unmount();

    // The inner route tree matches and reads its own params.
    renderDemoAt('/nfs-routing-demo/nested-v6/widget/blue');
    expect(await screen.findByText('blue')).toBeInTheDocument();
    expect(
      screen.getAllByText('/nfs-routing-demo/nested-v6/widget/blue').length,
    ).toBeGreaterThan(0);
    expectNoPathProblems();
  });

  it('should resolve links three segments below the page base against the sub-page mount', async () => {
    renderDemoAt('/nfs-routing-demo/deep-link/area/north/item/42');

    expect(
      await screen.findByText('Links from three segments down'),
    ).toBeInTheDocument();
    expect(screen.getByText('north')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();

    // Framework resolution from the route tree, from three segments down.
    expect(
      screen.getByRole('link', { name: "this tab's root" }),
    ).toHaveAttribute('href', '/nfs-routing-demo/deep-link');
    expect(
      screen.getByRole('link', { name: 'the TanStack page by route ref' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack');
    expect(
      screen.getByRole('link', { name: 'the TanStack page by absolute path' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack');
    // App-absolute, inside the page: the scoped router must not prefix it.
    expect(
      screen.getByRole('link', { name: 'a sibling area' }),
    ).toHaveAttribute('href', '/nfs-routing-demo/deep-link/area/south/item/7');
    expectNoPathProblems();
  });

  it('should host a TanStack sub-page inside a React Router v6 page', async () => {
    renderDemoAt('/nfs-routing-demo/tanstack');

    expect(
      await screen.findByText(
        'TanStack sub-page inside a React Router v6 page',
      ),
    ).toBeInTheDocument();
    // TanStack's own router is live and scoped to this sub-page's mount.
    expect(screen.getByText('/', { selector: 'code' })).toBeInTheDocument();
    expect(screen.getByText('/nfs-routing-demo/tanstack')).toBeInTheDocument();
    // RouteLink resolves from the route tree with no React Router involved.
    expect(
      screen.getByRole('link', { name: 'the v6 tab next door' }),
    ).toHaveAttribute('href', '/nfs-routing-demo/nested-v6');
    expect(
      screen.getByRole('link', { name: 'the TanStack page' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack');
    expectNoPathProblems();
  });

  it('should let a custom TanStack adapter own one tab and explicitly select the app default v6 adapter for its sibling', async () => {
    const { unmount } = renderDemoAt('/nfs-routing-demo-tanstack/tanstack');

    expect(
      await screen.findByText('TanStack all the way down'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'two segments deeper' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack/tanstack/extra/deep');
    expect(
      screen.getByRole('link', { name: 'the v6 tab next door' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack/v6-guest');
    expectNoPathProblems();
    unmount();

    renderDemoAt('/nfs-routing-demo-tanstack/v6-guest/report/q3');
    expect(
      await screen.findByText(
        'React Router v6 sub-page inside a TanStack page',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('q3')).toBeInTheDocument();
    expectNoPathProblems();
  });

  it('should explicitly select the app default v6 adapter for one v7-host tab and inherit v7 for its sibling', async () => {
    const { unmount } = renderDemoAt(
      '/nfs-routing-demo-v7/v6-guest/release/1-42',
    );

    expect(
      await screen.findByText('React Router v6 on a React Router v7 page'),
    ).toBeInTheDocument();
    expect(screen.getByText('1-42')).toBeInTheDocument();
    expectNoPathProblems();
    unmount();

    // With no sub-page override, this sibling automatically inherits the
    // page's React Router v7 adapter and has no React Router v6 context.
    renderDemoAt('/nfs-routing-demo-v7/v7-only');
    expect(await screen.findByText('React Router v7 only')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'the v6 tab next door' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-v7/v6-guest');
    expect(
      screen.getByRole('link', { name: 'the TanStack page' }),
    ).toHaveAttribute('href', '/nfs-routing-demo-tanstack');
    expectNoPathProblems();
  });
});
