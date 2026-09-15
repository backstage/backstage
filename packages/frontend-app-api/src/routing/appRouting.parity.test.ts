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

import { createPath, parsePath, resolvePath } from '@internal/frontend';
import {
  createPath as routerCreatePath,
  parsePath as routerParsePath,
  resolvePath as routerResolvePath,
} from 'react-router-dom';

/**
 * `@internal/frontend` vendors React Router's path algebra, and this pins the
 * copies against the real implementation.
 *
 * It lives here rather than beside the code for the same reason
 * `routePattern.parity.test.ts` does: `@internal/frontend` is inlined into
 * every consumer, `@backstage/frontend-plugin-api` included, so it declares no
 * React Router dependency at all — not even for tests. This package already
 * owns one.
 *
 * The vendoring exists because the React Router v6 beta this repo still
 * supports — `AppManager.compat.test.tsx` runs the old frontend system against
 * both, and the migration CLI writes `'6.0.0-beta.0 || ^6.3.0'` — exports
 * neither `createPath` nor `parsePath`, and because a package that carries no
 * React Router cannot import the third either. Every rule the framework's link
 * resolution branches on is one of these quirks, so the expectations here are
 * computed from React Router rather than written down: a divergence fails.
 */
describe('the vendored path helpers', () => {
  it('parses paths exactly like React Router', () => {
    for (const path of [
      '',
      '/',
      '.',
      './',
      '..',
      '/catalog',
      'catalog/create',
      '/catalog/',
      '/catalog?kind=component',
      '/catalog#frag',
      '/catalog?kind=component#frag',
      // The hash is taken first, so a `?` inside a fragment stays in it.
      '/catalog#frag?kind=component',
      '?tab=readme',
      '#section',
      '/search?query=https://example.com',
      // Degenerate prefixes: a bare `?` or `#` is a search or hash of its own,
      // and neither leaves a pathname behind.
      '?',
      '#',
      '?#',
      '#?',
    ]) {
      expect({ path, ...parsePath(path) }).toStrictEqual({
        path,
        ...routerParsePath(path),
      });
    }
  });

  it('renders paths exactly like React Router', () => {
    for (const parts of [
      {},
      { pathname: '/catalog' },
      // A missing pathname defaults to the app root, an empty one does not.
      { pathname: '' },
      { pathname: '', search: '?kind=component' },
      { search: '?kind=component' },
      { hash: '#frag' },
      { pathname: '/catalog', search: '?kind=component', hash: '#frag' },
      // A prefix the caller already wrote is kept rather than doubled, and one
      // that is missing is added.
      { pathname: '/catalog', search: 'kind=component' },
      { pathname: '/catalog', hash: 'frag' },
      // A bare `?` or `#` contributes nothing.
      { pathname: '/catalog', search: '?' },
      { pathname: '/catalog', hash: '#' },
      { pathname: '/catalog', search: '?', hash: '#' },
      { pathname: '/catalog', search: '', hash: '' },
    ]) {
      expect({ parts, path: createPath(parts) }).toEqual({
        parts,
        path: routerCreatePath(parts),
      });
    }
  });

  it('resolves paths exactly like React Router', () => {
    const targets = [
      '',
      '.',
      './',
      '..',
      '../',
      '../x',
      '../../x',
      '../../../../x',
      'widgets',
      'widgets/',
      'a/b',
      './a/../b',
      '/catalog',
      '/catalog/',
      '/catalog?kind=component',
      '/catalog#frag',
      '?tab=readme',
      '#section',
      '/search?query=https://example.com',
      // A search or hash without its prefix is normalized, a bare one dropped.
      '?',
      '#',
    ];
    const bases = [
      '/',
      '',
      '/catalog',
      // Trailing slashes are trimmed off the base rather than counted as
      // segments. The vendored copy scans for the run where React Router
      // matches `/\/+$/`; the two answer the same for every input, and only
      // the scan is safe against a long crafted run.
      '/catalog/',
      '/catalog///',
      '/catalog/default/component/foo',
      'catalog',
    ];

    for (const base of bases) {
      for (const to of targets) {
        expect({ base, to, ...resolvePath(to, base) }).toEqual({
          base,
          to,
          ...routerResolvePath(to, base),
        });
      }
      // The object form of a target is resolved the same way as the string.
      expect({
        base,
        ...resolvePath({ pathname: 'x', search: 'a=1' }, base),
      }).toEqual({
        base,
        ...routerResolvePath({ pathname: 'x', search: 'a=1' }, base),
      });
    }

    // The default base is the app root, on both.
    expect(resolvePath('widgets')).toEqual(routerResolvePath('widgets'));
  });
});
