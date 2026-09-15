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

import { act, render, screen, waitFor } from '@testing-library/react';
import { renderTestApp } from '@backstage/frontend-test-utils';
import {
  PageBlueprint,
  SubPageBlueprint,
  useHref as useFrameworkHref,
} from '@backstage/frontend-plugin-api';
import { MemoryRouter, Route, Routes, useResolvedPath } from 'react-router-dom';
import { ReactRouterV6PageRouter } from './ReactRouterV6PageRouter';

/**
 * The duplicated path segment — `/catalog/catalog/x` — which is the worst
 * routing bug class Backstage has had.
 *
 * Every instance of it has the same cause: a relative target resolved against
 * the page it was written in when it should have walked up the tree first, so
 * the page's own prefix ends up applied twice. It is nastiest at sub-page
 * depth, where there are two mounts to confuse — the page and the sub-page —
 * and where `..` is written most often, since a tab that wants a sibling tab
 * has to climb exactly one level to reach it.
 *
 * Guarding it by writing down the paths that look right is how it came back
 * last time: `/catalog/component/foo/overview/create` looks entirely plausible
 * whether or not the prefix is in it twice. So the guard is differential
 * instead. Three independent answers have to agree for every target:
 *
 *  - the v6 adapter's projected route context, read through `useResolvedPath`;
 *  - a real `react-router-dom` route tree of the same shape at the same URL,
 *    which is the definition of the right answer;
 *  - the framework's own `useHref`, which resolves from the page mount with no
 *    routing library involved at all, and is what a `RouteLink`, a tab href
 *    and every `@backstage/ui` link go through.
 *
 * The third is not redundant. The framework and the library resolve the same
 * target by completely different routes — one walks a stack of page mounts,
 * the other a stack of route matches — and a page whose links duplicate a
 * segment while its `<Link>`s do not is precisely the shape that survives a
 * test suite. They are documented to agree, so they are required to agree.
 */

/** Targets that have caused a duplicated segment, or would expose one. */
const TARGETS = [
  // The climb. Under-climbing lands back inside the page and re-applies its
  // prefix; over-climbing lands at the app root and loses it.
  '..',
  '../',
  // Climb, then re-enter by name — a tab pointing at its sibling tab.
  '../create',
  // Bare and dot-prefixed relatives, the two spellings of "below me".
  'create',
  './create',
  '.',
  // Climbing off the top of the stack must stop at the app root rather than
  // running off the end of it.
  '../../..',
] as const;

/**
 * Targets whose own first segment repeats the page's, e.g. `catalog` written
 * on a page mounted at `/catalog`.
 *
 * Kept apart from the sweep below because a repeated segment in the *answer*
 * is correct for these — the caller asked for it — so they cannot be checked
 * by counting prefixes. They are checked against the real router instead,
 * which is the point: the danger is not that `/catalog/catalog` appears, it is
 * that it appears when a real router would not have produced it.
 */
const SELF_NAMING_TARGETS = ['catalog', '../catalog'] as const;

const ALL_TARGETS = [...TARGETS, ...SELF_NAMING_TARGETS];

function ResolvedPathProbe(props: { testId?: string }) {
  const resolved = Object.fromEntries(
    // Constant list, so the hook order is the same on every render.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ALL_TARGETS.map(target => [target, useResolvedPath(target).pathname]),
  );
  return (
    <span data-testid={props.testId ?? 'library'}>
      {JSON.stringify(resolved)}
    </span>
  );
}

function FrameworkHrefProbe() {
  const hrefs = Object.fromEntries(
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ALL_TARGETS.map(target => [target, useFrameworkHref(target)]),
  );
  return <span data-testid="framework">{JSON.stringify(hrefs)}</span>;
}

function readResolved(testId: 'library' | 'framework' | 'real') {
  return JSON.parse(screen.getByTestId(testId).textContent!) as Record<
    string,
    string
  >;
}

/**
 * Renders the probe under a real `react-router-dom` tree shaped the way the
 * framework mounts a page and its sub-pages: the page is one route however
 * many segments its pattern has, and the sub-page is one route below it.
 */
function resolveWithRealRouter(options: {
  pagePattern: string;
  subPagePath?: string;
  url: string;
}) {
  const { pagePattern, subPagePath, url } = options;
  const rendered = render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        {subPagePath ? (
          <Route path={pagePattern}>
            <Route
              path={`${subPagePath}/*`}
              element={<ResolvedPathProbe testId="real" />}
            />
          </Route>
        ) : (
          <Route
            path={`${pagePattern}/*`}
            element={<ResolvedPathProbe testId="real" />}
          />
        )}
      </Routes>
    </MemoryRouter>,
  );
  const resolved = readResolved('real');
  rendered.unmount();
  return resolved;
}

/** How many times `prefix` occurs in `path`, as a whole run of segments. */
function countPrefixOccurrences(path: string, prefix: string): number {
  return path.split(prefix).length - 1;
}

/**
 * Asserts the page's prefix never lands in a resolved path more than once,
 * which is the whole signature of this bug class.
 *
 * Only ever a ceiling: whether a prefix is present at all depends on the
 * target — climbing off the page is supposed to leave it behind — and that
 * half is pinned by the written-out expectations in each case instead. Failing
 * with the offending target *and* its answer, because "expected [] to equal
 * [...]" is only useful if it says which link would have been broken.
 *
 * Targets that spell the page's own segment themselves are excluded: a second
 * `/catalog` in their answer is the one the caller asked for.
 */
function expectNoDuplicatedPrefix(
  resolved: Record<string, string>,
  pagePrefix: string,
) {
  const duplicated = TARGETS.filter(
    target => countPrefixOccurrences(resolved[target], pagePrefix) > 1,
  ).map(target => [target, resolved[target]]);
  expect(duplicated).toEqual([]);
}

describe('duplicate path segment guard', () => {
  describe('a static page with sub-pages', () => {
    const PAGE_PATTERN = '/catalog';

    function renderCatalog(initialPath: string) {
      const catalogPage = PageBlueprint.make({
        name: 'catalog',
        params: { path: PAGE_PATTERN, title: 'Catalog' },
      });
      const elsewherePage = PageBlueprint.make({
        name: 'elsewhere',
        params: {
          path: '/elsewhere',
          loader: async () => <div data-testid="elsewhere">Elsewhere</div>,
        },
      });
      const overviewSubPage = SubPageBlueprint.make({
        name: 'overview',
        attachTo: { id: 'page:test/catalog', input: 'pages' },
        params: {
          path: 'overview',
          title: 'Overview',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <ResolvedPathProbe />
              <FrameworkHrefProbe />
            </ReactRouterV6PageRouter>
          ),
        },
      });
      const createSubPage = SubPageBlueprint.make({
        name: 'create',
        attachTo: { id: 'page:test/catalog', input: 'pages' },
        params: {
          path: 'create',
          title: 'Create',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <ResolvedPathProbe />
              <FrameworkHrefProbe />
            </ReactRouterV6PageRouter>
          ),
        },
      });

      return renderTestApp({
        extensions: [
          catalogPage,
          elsewherePage,
          overviewSubPage,
          createSubPage,
        ],
        initialRouteEntries: [initialPath],
      });
    }

    it('should resolve every relative shape at sub-page depth the way a real route tree does', async () => {
      renderCatalog('/catalog/overview');
      await waitFor(() =>
        expect(screen.getByTestId('library')).toBeInTheDocument(),
      );

      const real = resolveWithRealRouter({
        pagePattern: PAGE_PATTERN,
        subPagePath: 'overview',
        url: '/catalog/overview',
      });

      expect(readResolved('library')).toEqual(real);
      expect(readResolved('framework')).toEqual(real);

      // Written out as well as compared, so a change to both sides at once
      // still has to face the paths a reviewer can read.
      expect(real).toEqual({
        // The climb lands on the page, exactly one `catalog` deep.
        '..': '/catalog',
        '../': '/catalog/',
        '../create': '/catalog/create',
        create: '/catalog/overview/create',
        './create': '/catalog/overview/create',
        '.': '/catalog/overview',
        '../../..': '/',
        // The caller asked for a second `catalog`, so there is one — and only
        // the one they asked for.
        catalog: '/catalog/overview/catalog',
        '../catalog': '/catalog/catalog',
      });

      expectNoDuplicatedPrefix(readResolved('library'), '/catalog');
    });

    it('should not accumulate the prefix across sub-page and off-page navigation', async () => {
      const { appHistory } = renderCatalog('/catalog/overview');
      await waitFor(() =>
        expect(screen.getByTestId('library')).toBeInTheDocument(),
      );
      const fromOverview = readResolved('library');

      // Tab across to the sibling and back. Each hop re-derives the mount from
      // the live location, which is where a prefix left over from the previous
      // one would show up.
      await act(async () => {
        appHistory.navigate('/catalog/create');
      });
      await waitFor(() =>
        expect(readResolved('library')['.']).toBe('/catalog/create'),
      );
      const fromCreate = readResolved('library');
      expect(fromCreate['..']).toBe('/catalog');
      expect(fromCreate.create).toBe('/catalog/create/create');
      expectNoDuplicatedPrefix(fromCreate, '/catalog');
      expect(readResolved('framework')).toEqual(fromCreate);

      await act(async () => {
        appHistory.navigate('/catalog/overview');
      });
      await waitFor(() =>
        expect(readResolved('library')['.']).toBe('/catalog/overview'),
      );
      expect(readResolved('library')).toEqual(fromOverview);

      // Off the page entirely and back again, which tears the adapter down and
      // builds it afresh at the same mount.
      await act(async () => {
        appHistory.navigate('/elsewhere');
      });
      await waitFor(() =>
        expect(screen.getByTestId('elsewhere')).toBeInTheDocument(),
      );
      await act(async () => {
        appHistory.navigate('/catalog/overview');
      });
      await waitFor(() =>
        expect(readResolved('library')['.']).toBe('/catalog/overview'),
      );
      expect(readResolved('library')).toEqual(fromOverview);
      expect(readResolved('framework')).toEqual(fromOverview);
    });
  });

  describe('a parameterised page with sub-pages', () => {
    // The pattern that made the climb hard: the page's address is four
    // segments long but is still a single route match, so `..` has to leave
    // all four behind at once. Climbing one *segment* instead lands on
    // `/catalog/component`, where nothing is mounted; re-applying the mount
    // instead of climbing lands on the duplicate.
    const PAGE_PATTERN = '/catalog/:kind/:name';
    const MOUNT = '/catalog/component/foo';

    function renderEntity(initialPath: string) {
      const entityPage = PageBlueprint.make({
        name: 'entity',
        params: { path: PAGE_PATTERN, title: 'Entity' },
      });
      const overviewSubPage = SubPageBlueprint.make({
        name: 'overview',
        attachTo: { id: 'page:test/entity', input: 'pages' },
        params: {
          path: 'overview',
          title: 'Overview',
          loader: async () => (
            <ReactRouterV6PageRouter>
              <ResolvedPathProbe />
              <FrameworkHrefProbe />
            </ReactRouterV6PageRouter>
          ),
        },
      });
      const createSubPage = SubPageBlueprint.make({
        name: 'create',
        attachTo: { id: 'page:test/entity', input: 'pages' },
        params: {
          path: 'create',
          title: 'Create',
          loader: async () => <div data-testid="create-subpage">Create</div>,
        },
      });

      return renderTestApp({
        extensions: [entityPage, overviewSubPage, createSubPage],
        initialRouteEntries: [initialPath],
      });
    }

    it.each([
      ['at the sub-page root', `${MOUNT}/overview`],
      // Below the sub-page, the tail belongs to the sub-page's splat. A splat
      // that leaks back into the base is the other way this bug is spelled.
      ['below the sub-page', `${MOUNT}/overview/deep/deeper`],
    ])('should resolve %s the way a real route tree does', async (_n, url) => {
      renderEntity(url);
      await waitFor(() =>
        expect(screen.getByTestId('library')).toBeInTheDocument(),
      );

      const real = resolveWithRealRouter({
        pagePattern: PAGE_PATTERN,
        subPagePath: 'overview',
        url,
      });

      expect(readResolved('library')).toEqual(real);
      expect(readResolved('framework')).toEqual(real);
      expect(real['..']).toBe(MOUNT);
      expect(real['../create']).toBe(`${MOUNT}/create`);
      expect(real.create).toBe(`${MOUNT}/overview/create`);
      expectNoDuplicatedPrefix(readResolved('library'), MOUNT);
      // The page's first segment on its own must not be treated as the mount.
      expect(readResolved('library')['..']).not.toBe('/catalog/component');
    });

    it('should keep the prefix applied once across a change of concrete mount', async () => {
      const { appHistory } = renderEntity(`${MOUNT}/overview`);
      await waitFor(() =>
        expect(screen.getByTestId('library')).toBeInTheDocument(),
      );

      // Entity A to entity B under one pattern: the page stays mounted while
      // its concrete prefix is replaced, which is where a stale prefix would
      // be appended to a fresh one.
      await act(async () => {
        appHistory.navigate('/catalog/component/bar/overview');
      });
      await waitFor(() =>
        expect(readResolved('library')['..']).toBe('/catalog/component/bar'),
      );

      const resolved = readResolved('library');
      expect(resolved['..']).toBe('/catalog/component/bar');
      expect(resolved.create).toBe('/catalog/component/bar/overview/create');
      expect(screen.getByTestId('library')).not.toHaveTextContent('/foo');
      expectNoDuplicatedPrefix(resolved, '/catalog/component/bar');
      expect(readResolved('framework')).toEqual(resolved);
    });
  });

  describe('a page with no sub-pages', () => {
    // Page depth, where the target that names the page's own segment is at its
    // most tempting: `catalog` written on `/catalog` really does mean
    // `/catalog/catalog`, and the guard has to accept that while still
    // rejecting a prefix applied twice by the router.
    const PAGE_PATTERN = '/catalog';

    it('should resolve a self-naming target exactly as a real route tree does', async () => {
      const catalogPage = PageBlueprint.make({
        name: 'catalog',
        params: {
          path: PAGE_PATTERN,
          loader: async () => (
            <ReactRouterV6PageRouter>
              <ResolvedPathProbe />
              <FrameworkHrefProbe />
            </ReactRouterV6PageRouter>
          ),
        },
      });

      renderTestApp({
        extensions: [catalogPage],
        initialRouteEntries: ['/catalog'],
      });
      await waitFor(() =>
        expect(screen.getByTestId('library')).toBeInTheDocument(),
      );

      const real = resolveWithRealRouter({
        pagePattern: PAGE_PATTERN,
        url: '/catalog',
      });

      expect(readResolved('library')).toEqual(real);
      expect(readResolved('framework')).toEqual(real);
      expect(real).toMatchObject({
        // One `catalog` from the mount, one from the target — and no third.
        catalog: '/catalog/catalog',
        // Climbing first leaves the mount behind, so the only `catalog` left
        // is the one the target spelled.
        '../catalog': '/catalog',
        '..': '/',
        create: '/catalog/create',
      });
      expectNoDuplicatedPrefix(readResolved('library'), '/catalog');
    });
  });
});
