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
