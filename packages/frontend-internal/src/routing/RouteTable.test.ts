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

import { RouteTable } from './RouteTable';

describe('RouteTable', () => {
  it('should match a simple path', () => {
    const table = new RouteTable(['/catalog']);
    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  it('should perform longest-prefix match', () => {
    const table = new RouteTable(['/', '/catalog']);
    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  it('should return undefined for unmatched paths', () => {
    const table = new RouteTable(['/catalog']);
    expect(table.match('/unknown')).toBeUndefined();
  });

  it('should match exact paths', () => {
    const table = new RouteTable(['/catalog']);
    expect(table.match('/catalog')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  it('should handle root path /', () => {
    const table = new RouteTable(['/', '/catalog']);
    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    expect(table.match('/unknown')).toEqual({ path: '/', basePath: '/' });
  });

  it('should not match partial prefixes without separator', () => {
    const table = new RouteTable(['/cat', '/catalog']);
    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    expect(table.match('/cat/foo')).toEqual({ path: '/cat', basePath: '/cat' });
    expect(table.match('/category')).toBeUndefined();
  });

  it('should handle trailing slashes', () => {
    const table = new RouteTable(['/catalog']);
    expect(table.match('/catalog/')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  it('should prefer static segments over params over splats', () => {
    const table = new RouteTable([
      '/catalog/:namespace/:kind/:name',
      '/catalog/entities',
      '/catalog/*',
    ]);

    expect(table.match('/catalog/entities')).toEqual({
      path: '/catalog/entities',
      basePath: '/catalog/entities',
    });
  });

  it('should prefer static routes even when a longer param pattern also matches', () => {
    const table = new RouteTable(['/x/:a/:b/:c', '/x/y/z']);

    expect(table.match('/x/y/z')).toEqual({
      path: '/x/y/z',
      basePath: '/x/y/z',
    });
  });

  it('should prefer the static prefix over a longer param pattern that swallows the whole path', () => {
    const table = new RouteTable(['/x/y/z', '/x/:a/:b/:c/:d']);

    // Picking the param route here would mount the page at /x/y/z/q/r, so
    // every relative link inside it would append to the wrong base.
    expect(table.match('/x/y/z/q/r')).toEqual({
      path: '/x/y/z',
      basePath: '/x/y/z',
    });
  });

  it('should mount a splat route at the prefix before the splat', () => {
    // Handing back the whole pathname would mount the page at its own current
    // URL, so every relative link inside it would append to itself.
    expect(new RouteTable(['/docs/*']).match('/docs/a/b')).toEqual({
      path: '/docs/*',
      basePath: '/docs',
    });
    expect(new RouteTable(['/docs/*']).match('/docs')).toEqual({
      path: '/docs/*',
      basePath: '/docs',
    });
    expect(new RouteTable(['/:x/*']).match('/a/b/c')).toEqual({
      path: '/:x/*',
      basePath: '/a',
    });
    expect(new RouteTable(['/*']).match('/a/b')).toEqual({
      path: '/*',
      basePath: '/',
    });
  });

  it('should break a tie between equally specific paths by registration order', () => {
    // Both patterns score the same, so the one the app registered first wins —
    // the tie-break react-router applies to sibling routes.
    expect(new RouteTable(['/:x/b', '/a/:id']).match('/a/b')).toEqual({
      path: '/:x/b',
      basePath: '/a/b',
    });
    expect(new RouteTable(['/a/:id', '/:x/b']).match('/a/b')).toEqual({
      path: '/a/:id',
      basePath: '/a/b',
    });
  });

  it('should match case-insensitively while keeping the pathname casing in basePath', () => {
    const table = new RouteTable(['/catalog']);

    expect(table.match('/CATALOG/foo')).toEqual({
      path: '/catalog',
      basePath: '/CATALOG',
    });
  });

  it('should not throw on malformed percent encoding in the pathname', () => {
    const table = new RouteTable(['/catalog/:name']);

    expect(table.match('/catalog/100%')).toEqual({
      path: '/catalog/:name',
      basePath: '/catalog/100%',
    });
  });

  it('should prefer parameterized entity routes over index routes', () => {
    const table = new RouteTable([
      '/catalog',
      '/catalog/:namespace/:kind/:name',
    ]);

    expect(table.match('/catalog/default/component/wayback-archive')).toEqual({
      path: '/catalog/:namespace/:kind/:name',
      basePath: '/catalog/default/component/wayback-archive',
    });
  });

  it('should return a concrete basePath for parameterized matches', () => {
    const table = new RouteTable(['/catalog/:namespace/:kind/:name']);

    expect(
      table.match('/catalog/default/component/wayback-archive/kubernetes'),
    ).toEqual({
      path: '/catalog/:namespace/:kind/:name',
      basePath: '/catalog/default/component/wayback-archive',
    });
  });

  it('should match nested entity subpaths using parameterized base routes', () => {
    const table = new RouteTable([
      '/catalog',
      '/catalog/:namespace/:kind/:name',
    ]);

    expect(
      table.match('/catalog/default/component/wayback-archive/kubernetes'),
    ).toEqual({
      path: '/catalog/:namespace/:kind/:name',
      basePath: '/catalog/default/component/wayback-archive',
    });
  });

  it('should still match the index route for exact /catalog when parameterized route coexists', () => {
    const table = new RouteTable([
      '/catalog',
      '/catalog/:namespace/:kind/:name',
    ]);

    expect(table.match('/catalog')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    expect(table.match('/catalog/')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  it('should fall through to the index route for paths with fewer segments than the parameterized route', () => {
    const table = new RouteTable([
      '/catalog',
      '/catalog/:namespace/:kind/:name',
    ]);

    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    expect(table.match('/catalog/foo/bar')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
  });

  describe('sub-pages', () => {
    it('should return the page and the sub-page it selects as one chain', () => {
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['overview', 'detail'] },
      ]);

      expect(table.match('/catalog/overview')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        subPage: {
          path: 'overview',
          routePattern: '/catalog/overview',
          basePath: '/catalog/overview',
        },
      });

      // A path below the sub-page still belongs to that sub-page, and mounts
      // it at its own base rather than at the whole pathname.
      expect(table.match('/catalog/detail/deep/deeper')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        subPage: {
          path: 'detail',
          routePattern: '/catalog/detail',
          basePath: '/catalog/detail',
        },
      });
    });

    it('should carry the params of a parameterized page into the sub-page mount', () => {
      const table = new RouteTable([
        { path: '/catalog/:namespace/:kind/:name', subPaths: ['overview'] },
      ]);

      expect(
        table.match('/catalog/default/component/foo/overview/deep'),
      ).toEqual({
        path: '/catalog/:namespace/:kind/:name',
        basePath: '/catalog/default/component/foo',
        subPage: {
          path: 'overview',
          routePattern: '/catalog/:namespace/:kind/:name/overview',
          basePath: '/catalog/default/component/foo/overview',
        },
      });
    });

    it('should register a sub-page of a splat page below the splat, not through it', () => {
      // Joining the page pattern to the sub-path verbatim would give
      // `/docs/*/overview`, which matches nothing and leaves the sub-page with
      // no mount of its own to resolve relative targets against.
      const table = new RouteTable([{ path: '/docs/*', subPaths: ['intro'] }]);

      expect(table.match('/docs/intro/chapter-1')).toEqual({
        path: '/docs/*',
        basePath: '/docs',
        subPage: {
          path: 'intro',
          routePattern: '/docs/intro',
          basePath: '/docs/intro',
        },
      });
    });

    it('should rank sub-page routes with every other route', () => {
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['entities'] },
        '/catalog/:namespace/:kind/:name',
      ]);

      // The static sub-page route beats the page it belongs to.
      expect(table.match('/catalog/entities')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        subPage: {
          path: 'entities',
          routePattern: '/catalog/entities',
          basePath: '/catalog/entities',
        },
      });
      // A sibling page that matches more specifically still wins outright.
      expect(table.match('/catalog/default/component/foo')).toEqual({
        path: '/catalog/:namespace/:kind/:name',
        basePath: '/catalog/default/component/foo',
      });
    });

    it('should send the root of a page with sub-pages to its first sub-page', () => {
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['overview', 'detail'] },
        { path: '/', subPaths: ['start'] },
        '/plain',
      ]);

      expect(table.match('/catalog')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        indexRedirect: '/catalog/overview',
      });
      expect(table.match('/catalog/')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        indexRedirect: '/catalog/overview',
      });
      expect(table.match('/')).toEqual({
        path: '/',
        basePath: '/',
        indexRedirect: '/start',
      });

      // A page without sub-pages is never redirected, at its root or below it.
      expect(table.match('/plain')).toEqual({
        path: '/plain',
        basePath: '/plain',
      });
      expect(table.match('/plain/deeper')).toEqual({
        path: '/plain',
        basePath: '/plain',
      });
    });

    it('should leave a path below the page that no sub-page claims on the page', () => {
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['overview'] },
      ]);

      // Not the page root, so redirecting to a tab would paper over a bad URL.
      expect(table.match('/catalog/bogus')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
      });
    });

    it('should ignore an empty sub-page path', () => {
      // It would register the page's own pattern a second time and make the
      // index redirect point back at the page root it came from.
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['', 'overview'] },
      ]);

      expect(table.match('/catalog')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        indexRedirect: '/catalog/overview',
      });
    });

    it('should ignore sub-page paths that do not name anything below the page', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // `/` is the page itself spelled as a path, and `..` builds a literal
      // `/x/..` route that no location ever reaches — a browser resolves it
      // away long before the app sees it. Neither may become the index
      // redirect: `//` re-matches to `//` and parks the page on a blank
      // content region.
      const table = new RouteTable([
        { path: '/', subPaths: ['/', '..', 'start'] },
        { path: '/catalog', subPaths: ['../escape', 'a/../b', 'overview'] },
      ]);

      expect(table.match('/')).toEqual({
        path: '/',
        basePath: '/',
        indexRedirect: '/start',
      });
      expect(table.match('/catalog')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        indexRedirect: '/catalog/overview',
      });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sub-page path ".." of page "/"'),
      );
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Sub-page path "a/../b" of page "/catalog"'),
      );
      warnSpy.mockRestore();
    });

    it('should normalize a sub-page path written with separators of its own', () => {
      const table = new RouteTable([
        { path: '/catalog', subPaths: ['/overview/'] },
      ]);

      // Joining the two verbatim would give a `/catalog//overview/` redirect
      // that never reaches the sub-page it names.
      expect(table.match('/catalog')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        indexRedirect: '/catalog/overview',
      });
      expect(table.match('/catalog/overview')).toEqual({
        path: '/catalog',
        basePath: '/catalog',
        subPage: {
          // Reported exactly as registered, since that is what the page
          // matches its own sub-page content against.
          path: '/overview/',
          routePattern: '/catalog/overview',
          basePath: '/catalog/overview',
        },
      });
    });

    it('should let a registered page keep a path a sub-page route would take, in either registration order', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const tabbedCatalog = {
        path: '/catalog',
        subPaths: ['overview', 'detail'],
      };

      for (const pages of [
        [tabbedCatalog, '/catalog/overview'],
        ['/catalog/overview', tabbedCatalog],
      ]) {
        warnSpy.mockClear();
        const table = new RouteTable(pages);

        // The page keeps its own path — a page is a claim its author made on a
        // URL, so it cannot be shadowed by a route generated below somebody
        // else's page, and which plugin loaded first cannot decide it.
        expect(table.match('/catalog/overview')).toEqual({
          path: '/catalog/overview',
          basePath: '/catalog/overview',
        });
        // The tabbed page still works, and its root lands on the first tab
        // that is actually reachable rather than inside the other page.
        expect(table.match('/catalog')).toEqual({
          path: '/catalog',
          basePath: '/catalog',
          indexRedirect: '/catalog/detail',
        });
        expect(table.match('/catalog/detail')).toEqual({
          path: '/catalog',
          basePath: '/catalog',
          subPage: {
            path: 'detail',
            routePattern: '/catalog/detail',
            basePath: '/catalog/detail',
          },
        });
        expect(warnSpy).toHaveBeenCalledWith(
          expect.stringContaining(
            'Sub-page "overview" of page "/catalog" would be routed at "/catalog/overview"',
          ),
        );
      }

      warnSpy.mockRestore();
    });

    it('should keep the first registration when two pages generate the same sub-page route', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable([
        { path: '/docs', subPaths: ['guides/intro'] },
        { path: '/docs/guides', subPaths: ['intro'] },
      ]);

      expect(table.match('/docs/guides/intro')).toEqual({
        path: '/docs',
        basePath: '/docs',
        subPage: {
          path: 'guides/intro',
          routePattern: '/docs/guides/intro',
          basePath: '/docs/guides/intro',
        },
      });
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          'Sub-page "intro" of page "/docs/guides" would be routed at "/docs/guides/intro"',
        ),
      );
      warnSpy.mockRestore();
    });
  });

  it('should warn on duplicate base paths', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const table = new RouteTable(['/catalog', '/scaffolder', '/catalog']);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Duplicate base path "/catalog"'),
    );
    // Should still work correctly after deduplication
    expect(table.match('/catalog/foo')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    expect(table.match('/scaffolder/bar')).toEqual({
      path: '/scaffolder',
      basePath: '/scaffolder',
    });
    warnSpy.mockRestore();
  });

  it('should not warn when all paths are unique', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const table = new RouteTable(['/catalog', '/scaffolder', '/']);
    expect(warnSpy).not.toHaveBeenCalled();
    expect(table.match('/catalog')).toEqual({
      path: '/catalog',
      basePath: '/catalog',
    });
    warnSpy.mockRestore();
  });

  describe('root catch-all dev warning', () => {
    const env = process.env as Record<string, string | undefined>;
    const originalEnv = env.NODE_ENV;

    afterEach(() => {
      env.NODE_ENV = originalEnv;
    });

    it('should warn when a multi-segment path falls through to root', () => {
      env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable(['/', '/catalog']);

      table.match('/unknown/deep/path');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('fell through to the root "/" catch-all'),
      );
      warnSpy.mockRestore();
    });

    it('should not warn for single-segment paths falling through to root', () => {
      env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable(['/', '/catalog']);

      table.match('/unknown');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should not warn when a non-root route matches', () => {
      env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable(['/', '/catalog']);

      table.match('/catalog/foo/bar');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should not warn for the root path itself', () => {
      env.NODE_ENV = 'development';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable(['/']);

      table.match('/');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    it('should not warn in production', () => {
      env.NODE_ENV = 'production';
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      const table = new RouteTable(['/', '/catalog']);

      table.match('/unknown/deep/path');

      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
