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

// No React Router import anywhere in this package, which is what lets it drop
// the peer dependency: it is inlined into every consumer, including
// `@backstage/frontend-plugin-api`. The vendored helpers below are pinned
// against React Router's own in
// `@backstage/frontend-app-api`'s `appRouting.parity.test.ts`, next to the
// `routePattern` parity test that exists for the same reason.
import { PropsWithChildren } from 'react';
import { renderHook } from '@testing-library/react';
import { PageMountProvider, type PageMount } from './PageMountContext';
import {
  climbPageBase,
  createPath,
  normalizeBasePath,
  pageBasePaths,
  parsePath,
  resolveAppPath,
  resolvePath,
  useAppBasePath,
} from './AppRouting';

describe('normalizeBasePath', () => {
  it('strips trailing slashes and collapses the app root to an empty prefix', () => {
    expect(normalizeBasePath(undefined)).toBe('');
    expect(normalizeBasePath('')).toBe('');
    expect(normalizeBasePath('/')).toBe('');
    expect(normalizeBasePath('//')).toBe('');
    expect(normalizeBasePath('///')).toBe('');
    expect(normalizeBasePath('/catalog')).toBe('/catalog');
    expect(normalizeBasePath('/catalog/')).toBe('/catalog');
    expect(normalizeBasePath('/catalog//')).toBe('/catalog');
    expect(normalizeBasePath('/catalog/entities///')).toBe('/catalog/entities');
    expect(normalizeBasePath('catalog')).toBe('catalog');
    expect(normalizeBasePath('catalog/')).toBe('catalog');
    // Only the trailing run goes; separators inside the prefix are untouched
    expect(normalizeBasePath('//catalog')).toBe('//catalog');
    expect(normalizeBasePath('/catalog//entities//')).toBe(
      '/catalog//entities',
    );
    // The character before the run never matters here, so unlike
    // `trimTrailingSlash` this carries no line-terminator divergence from the
    // pattern it replaced — that pattern had no `.` in it.
    expect(normalizeBasePath('/catalog/foo\n//')).toBe('/catalog/foo\n');
    expect(normalizeBasePath('/catalog/foo\u2028//')).toBe(
      '/catalog/foo\u2028',
    );
  });

  it('handles a long run of trailing slashes without backtracking over it', () => {
    // A mount base path is derived from the pathname, which a crafted link
    // controls, so the cost has to follow its length and nothing else. The
    // expensive shape is a long run of slashes that is *not* at the end, which
    // a backtracking matcher retries from every position in the run.
    const slashes = '/'.repeat(5000);
    expect(normalizeBasePath(`/catalog${slashes}`)).toBe('/catalog');
    expect(normalizeBasePath(slashes)).toBe('');
    expect(normalizeBasePath(`/a${slashes}b`)).toBe(`/a${slashes}b`);
  });
});

describe('the vendored path helpers', () => {
  // `parsePath`, `createPath` and `resolvePath` are written out in
  // `AppRouting.ts` because this package carries no React Router at all, and
  // because the v6 beta this repo still supports exports neither `parsePath`
  // nor `createPath`. The expectations here are the behavior the rest of the
  // module branches on; that they are also React Router's, quirk for quirk, is
  // pinned against the real implementation in `@backstage/frontend-app-api`'s
  // `appRouting.parity.test.ts`.
  it('parses a path into the parts it actually carries', () => {
    expect(parsePath('/catalog?kind=component#frag')).toEqual({
      pathname: '/catalog',
      search: '?kind=component',
      hash: '#frag',
    });
    // The hash is taken first, so a `?` inside a fragment stays in it.
    expect(parsePath('/catalog#frag?kind=component')).toEqual({
      pathname: '/catalog',
      hash: '#frag?kind=component',
    });
    // A target with no pathname of its own comes back without the key at all,
    // rather than with an empty one — that absence is what `resolveAppPath`
    // reads as "resolve against the current location".
    expect(parsePath('?tab=readme')).toEqual({ search: '?tab=readme' });
    expect(parsePath('#section')).toEqual({ hash: '#section' });
    expect(parsePath('')).toEqual({});
    // Degenerate prefixes: a bare `?` or `#` is a search or hash of its own,
    // and neither leaves a pathname behind.
    expect(parsePath('?')).toEqual({ search: '?' });
    expect(parsePath('#?')).toEqual({ hash: '#?' });
  });

  it('renders parts back into a path', () => {
    // A missing pathname defaults to the app root, an empty one does not.
    expect(createPath({})).toBe('/');
    expect(createPath({ pathname: '' })).toBe('');
    expect(createPath({ pathname: '/catalog' })).toBe('/catalog');
    expect(
      createPath({ pathname: '/catalog', search: '?kind=x', hash: '#frag' }),
    ).toBe('/catalog?kind=x#frag');
    // A prefix the caller already wrote is kept rather than doubled, and one
    // that is missing is added.
    expect(createPath({ pathname: '/catalog', search: 'kind=x' })).toBe(
      '/catalog?kind=x',
    );
    expect(createPath({ pathname: '/catalog', hash: 'frag' })).toBe(
      '/catalog#frag',
    );
    // A bare `?` or `#` contributes nothing.
    expect(createPath({ pathname: '/catalog', search: '?', hash: '#' })).toBe(
      '/catalog',
    );
  });

  it('resolves a target against a base', () => {
    expect(resolvePath('widgets', '/catalog').pathname).toBe(
      '/catalog/widgets',
    );
    expect(resolvePath('/widgets', '/catalog').pathname).toBe('/widgets');
    // `..` and `.` are path segments here — the match-climbing rule lives in
    // `resolveAppPath`, which strips the leading `..` before calling this.
    expect(resolvePath('../x', '/catalog/foo').pathname).toBe('/catalog/x');
    expect(resolvePath('./a/../b', '/catalog').pathname).toBe('/catalog/b');
    // Climbing past the root stops at the root rather than going negative.
    expect(resolvePath('../../../x', '/catalog').pathname).toBe('/x');
    // Trailing slashes on the base are not segments of their own.
    expect(resolvePath('x', '/catalog///').pathname).toBe('/catalog/x');
    // No pathname of its own, so the base is the answer, and the search and
    // hash are normalized onto it.
    expect(resolvePath('?kind=x', '/catalog')).toEqual({
      pathname: '/catalog',
      search: '?kind=x',
      hash: '',
    });
    expect(resolvePath({ pathname: 'x', search: 'a=1' }, '/catalog')).toEqual({
      pathname: '/catalog/x',
      search: '?a=1',
      hash: '',
    });
    // The default base is the app root.
    expect(resolvePath('widgets').pathname).toBe('/widgets');
  });
});

describe('pageBasePaths', () => {
  it('reads a mount with no pattern of its own literally', () => {
    // A base path a caller holds on its own says nothing about how it was
    // matched, so it is read as a mount whose pattern is that very path — one
    // entry per segment, which is how a browser reads a path too.
    expect(pageBasePaths(undefined)).toEqual(['/']);
    expect(pageBasePaths('')).toEqual(['/']);
    expect(pageBasePaths('/')).toEqual(['/']);
    expect(pageBasePaths('///')).toEqual(['/']);
    expect(pageBasePaths('/catalog')).toEqual(['/', '/catalog']);
    expect(pageBasePaths('/catalog/')).toEqual(['/', '/catalog']);
    expect(pageBasePaths('/catalog/foo/tab-1')).toEqual([
      '/',
      '/catalog',
      '/catalog/foo',
      '/catalog/foo/tab-1',
    ]);
    // Empty segments contribute nothing rather than an entry that repeats its
    // parent, so a doubled separator cannot make `..` climb twice.
    expect(pageBasePaths('/catalog//foo')).toEqual([
      '/',
      '/catalog',
      '/catalog/foo',
    ]);
  });

  it('takes a parameterized run of a pattern as a single match', () => {
    // The entity page: four segments, one match, so the level above it is the
    // app root rather than `/catalog/default/component`, which no route
    // claims. This is React Router's own answer for the same page.
    expect(
      pageBasePaths(
        '/catalog/default/component/foo',
        '/catalog/:namespace/:kind/:name',
      ),
    ).toEqual(['/', '/catalog/default/component/foo']);
    // A sub-page's pattern is its page's with the sub-page's own path
    // appended, so the literal tail is a level of its own and `..` lands on
    // the page.
    expect(pageBasePaths('/catalog/foo/tab-1', '/catalog/:name/tab-1')).toEqual(
      ['/', '/catalog/foo', '/catalog/foo/tab-1'],
    );
    // A splat mounts at the prefix before it, and is not a parameter, so a
    // pattern that only ends in one is read literally.
    expect(pageBasePaths('/docs', '/docs/*')).toEqual(['/', '/docs']);
    expect(pageBasePaths('/docs/intro', '/docs/intro')).toEqual([
      '/',
      '/docs',
      '/docs/intro',
    ]);
    expect(pageBasePaths('/catalog/default', '/catalog/:namespace/*')).toEqual([
      '/',
      '/catalog/default',
    ]);
    // A page mounted at the app root has no level below it to climb from.
    expect(pageBasePaths('/', '/')).toEqual(['/']);
    // A pattern that claims more segments than the base has cannot push the
    // boundary past the end of the stack.
    expect(pageBasePaths('/catalog', '/catalog/:namespace/:kind')).toEqual([
      '/',
      '/catalog',
    ]);
  });
});

describe('climbPageBase', () => {
  const subPage = pageBasePaths('/catalog/foo/tab-1', '/catalog/:name/tab-1');

  it('names the base a leading `..` lands on, and hands back the rest', () => {
    // The pair is what a caller passes on: a target with no `..` left in it,
    // and the base it is now relative to.
    expect(climbPageBase('..', subPage)).toEqual({
      to: '/catalog/foo',
      basePath: '/catalog/foo',
    });
    expect(climbPageBase('../tab-2', subPage)).toEqual({
      to: 'tab-2',
      basePath: '/catalog/foo',
    });
    expect(climbPageBase('../..', subPage)).toEqual({
      to: '/',
      basePath: '/',
    });
    // Climbing past the outermost base stops at the app root.
    expect(climbPageBase('../../../x', subPage)).toEqual({
      to: 'x',
      basePath: '/',
    });
    // A search or hash written alongside the climb comes with it, rather than
    // being left to resolve against the current location.
    expect(climbPageBase('..?tab=readme', subPage).to).toBe(
      '/catalog/foo?tab=readme',
    );
    expect(climbPageBase('..#section', subPage).to).toBe(
      '/catalog/foo#section',
    );
    // A trailing slash the target asked for addresses the base itself.
    expect(climbPageBase('../', subPage).to).toBe('/catalog/foo/');
    expect(climbPageBase('../../', subPage).to).toBe('/');
  });

  it('leaves a target that climbs nothing untouched, on the deepest base', () => {
    for (const to of ['', '.', './x', 'widgets', '/x', '?tab=readme', 'a/..']) {
      expect(climbPageBase(to, subPage)).toEqual({
        to,
        basePath: '/catalog/foo/tab-1',
      });
    }
    // Only a *leading* `..` climbs a match; one written further along is an
    // ordinary path segment, which is React Router's rule too.
    expect(climbPageBase('#section', subPage)).toEqual({
      to: '#section',
      basePath: '/catalog/foo/tab-1',
    });
    // With no page in context there is nothing to climb but the app root.
    expect(climbPageBase('../x', pageBasePaths(''))).toEqual({
      to: 'x',
      basePath: '/',
    });
  });
});

describe('resolveAppPath', () => {
  // The one resolver both authorities share: the only thing that differs
  // between them is the stack handed to it — React Router's matched route
  // bases, or a page mount spelled out by `pageBasePaths`.
  const pageStack = pageBasePaths('/catalog/foo/tab-1');

  it('resolves a target against the deepest base, and climbs one entry per `..`', () => {
    const at = (to: string, location = '/catalog/foo/tab-1/details') =>
      resolveAppPath(to, pageStack, location).pathname;

    expect(at('widgets')).toBe('/catalog/foo/tab-1/widgets');
    expect(at('./widgets')).toBe('/catalog/foo/tab-1/widgets');
    expect(at('/widgets')).toBe('/widgets');
    // One `..` lands on the parent page, which is what makes a sub-page's
    // `../sibling` point at the sibling tab rather than at the app root.
    expect(at('..')).toBe('/catalog/foo');
    expect(at('../tab-2')).toBe('/catalog/foo/tab-2');
    expect(at('../..')).toBe('/catalog');
    // Climbing past the outermost base lands on the app root rather than
    // running off the end of the stack.
    expect(at('../../../../..')).toBe('/');
  });

  it('keeps a target with no pathname of its own at the current location', () => {
    const at = (to: string) =>
      resolveAppPath(to, pageStack, '/catalog/foo/tab-1/details');

    expect(at('?tab=readme')).toEqual({
      pathname: '/catalog/foo/tab-1/details',
      search: '?tab=readme',
      hash: '',
    });
    expect(at('#section')).toEqual({
      pathname: '/catalog/foo/tab-1/details',
      search: '',
      hash: '#section',
    });
    // An empty target is not the same as a pathname-less one: it means "this
    // page", so it resolves against the base rather than the location.
    expect(at('').pathname).toBe('/catalog/foo/tab-1');
  });

  it('preserves a trailing slash the target asked for, or the location already had', () => {
    expect(resolveAppPath('widgets/', pageStack, '/x').pathname).toBe(
      '/catalog/foo/tab-1/widgets/',
    );
    expect(resolveAppPath('./', pageStack, '/x').pathname).toBe(
      '/catalog/foo/tab-1/',
    );
    expect(resolveAppPath('.', pageStack, '/catalog/').pathname).toBe(
      '/catalog/foo/tab-1/',
    );
  });

  it('resolves against the app root when there is no base at all', () => {
    // Empty is what a consumer reads out of React Router where nothing
    // matched, and what a page mount spells out at the app root.
    for (const stack of [[], pageBasePaths('')]) {
      expect(resolveAppPath('catalog/create', stack, '/x').pathname).toBe(
        '/catalog/create',
      );
      expect(resolveAppPath('..', stack, '/x').pathname).toBe('/');
      expect(resolveAppPath('', stack, '/x').pathname).toBe('/');
    }
  });
});

describe('useAppBasePath', () => {
  const wrapper =
    (mount?: PageMount) =>
    ({ children }: PropsWithChildren<{}>) =>
      mount ? (
        <PageMountProvider mount={mount}>{children}</PageMountProvider>
      ) : (
        <>{children}</>
      );

  it('reports the page mount as a concatenable prefix, and nothing outside a page', () => {
    expect(renderHook(() => useAppBasePath()).result.current).toBe('');
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/catalog', routePattern: '/catalog' }),
      }).result.current,
    ).toBe('/catalog');
    // The app root normalizes to an empty prefix rather than to `/`, so it can
    // be concatenated with a `/`-prefixed suffix without doubling.
    expect(
      renderHook(() => useAppBasePath(), {
        wrapper: wrapper({ basePath: '/', routePattern: '/' }),
      }).result.current,
    ).toBe('');
  });
});
