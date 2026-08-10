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

import { AppLocation } from '@backstage/frontend-plugin-api';
import { createMockAppHistory } from './createMockAppHistory';

describe('createMockAppHistory', () => {
  it('should emit the initial location synchronously on subscribe', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?q=1#hash',
    });
    const locs: AppLocation[] = [];
    appHistory.location$.subscribe(l => locs.push(l));
    expect(locs).toEqual([
      {
        pathname: '/catalog',
        search: '?q=1',
        hash: '#hash',
        state: undefined,
      },
    ]);
  });

  it('should update location$ and record navigate calls', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    const locs: AppLocation[] = [];
    appHistory.location$.subscribe(l => locs.push(l));

    appHistory.navigate('/tools', { state: { step: 1 } });

    expect(appHistory.navigateCalls).toEqual([
      { to: '/tools', options: { state: { step: 1 } } },
    ]);
    expect(navigate).toHaveBeenCalledWith('/tools', { state: { step: 1 } });
    expect(locs[1]).toEqual({
      pathname: '/tools',
      search: '',
      hash: '',
      state: { step: 1 },
    });
  });

  it('should preserve single-arg navigate arity for jest assertions', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    appHistory.navigate('/only-path');
    expect(navigate).toHaveBeenCalledWith('/only-path');
    expect(navigate.mock.calls[0]).toHaveLength(1);
  });

  it('should expose location as a stable reference that tracks navigation', () => {
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });

    const initial = appHistory.location;
    expect(initial).toEqual({
      pathname: '/catalog',
      search: '',
      hash: '',
      state: undefined,
    });
    // Repeated reads must be reference-equal, or useSyncExternalStore loops.
    expect(appHistory.location).toBe(initial);

    // Navigating to the location we are already on is not a change.
    appHistory.navigate('/catalog');
    expect(appHistory.location).toBe(initial);

    appHistory.navigate('/tools?tab=1', { state: { step: 1 } });
    expect(appHistory.location).not.toBe(initial);
    expect(appHistory.location).toEqual({
      pathname: '/tools',
      search: '?tab=1',
      hash: '',
      state: { step: 1 },
    });

    // location$ hands out the same reference the accessor returns.
    let emitted: AppLocation | undefined;
    appHistory.location$.subscribe(l => {
      emitted = l;
    });
    expect(emitted).toBe(appHistory.location);
  });

  it('should give every location$ subscription its own handler', () => {
    const appHistory = createMockAppHistory();
    const seen: string[] = [];
    // The real app history wraps each subscription in its own handler, so the
    // same function subscribing twice is two subscriptions.
    const onNext = (l: AppLocation) => seen.push(l.pathname);

    const first = appHistory.location$.subscribe(onNext);
    const second = appHistory.location$.subscribe(onNext);
    expect(seen).toEqual(['/', '/']);

    appHistory.navigate('/catalog');
    expect(seen).toEqual(['/', '/', '/catalog', '/catalog']);

    first.unsubscribe();
    expect(first.closed).toBe(true);
    expect(second.closed).toBe(false);

    appHistory.navigate('/tools');
    expect(seen).toEqual(['/', '/', '/catalog', '/catalog', '/tools']);

    second.unsubscribe();
  });

  it('should read the initial location the way the real app history reads the browser', () => {
    const appHistory = createMockAppHistory({
      basename: '/backstage',
      initialLocation: '/backstage/catalog?q=1#top',
    });

    // The initial location stands in for the browser URL, which carries the
    // deploy basename — and every location the API hands out is stripped of it.
    expect(appHistory.location).toEqual({
      pathname: '/catalog',
      search: '?q=1',
      hash: '#top',
      state: undefined,
    });

    // navigate targets are app-relative and never stripped, so a path that
    // happens to repeat the basename stays exactly as navigated to.
    appHistory.navigate('/backstage/other');
    expect(appHistory.location.pathname).toBe('/backstage/other');
  });

  it('should normalise hrefs the same way the real app history does', () => {
    const appHistory = createMockAppHistory();

    expect(appHistory.createHref('/catalog')).toBe('/catalog');
    expect(appHistory.createHref('/catalog?q=1#top')).toBe('/catalog?q=1#top');
    // Without a basename there is nothing to prepend, but the target is still
    // resolved to an app-absolute path, exactly as in production.
    expect(appHistory.createHref('catalog')).toBe('/catalog');
    expect(appHistory.createHref('/a/../b')).toBe('/b');
  });

  it('should treat targets that are not app-relative like the real app history', () => {
    const appHistory = createMockAppHistory({ basename: '/backstage' });

    expect(appHistory.createHref('/catalog')).toBe('/backstage/catalog');
    // Pass-through rather than basename-prefixed.
    expect(appHistory.createHref('https://example.com/x')).toBe(
      'https://example.com/x',
    );
    expect(appHistory.createHref('//example.com/x')).toBe('//example.com/x');
    expect(appHistory.createHref('mailto:support@example.com')).toBe(
      'mailto:support@example.com',
    );
    // Only the path portion counts, so a URL in the query is still app-relative.
    expect(appHistory.createHref('/search?q=https://example.com')).toBe(
      '/backstage/search?q=https://example.com',
    );

    // navigate is strict for exactly the same inputs.
    expect(() => appHistory.navigate('https://example.com/x')).toThrow(
      /does not support absolute or protocol-relative URLs/,
    );
    expect(() => appHistory.navigate('mailto:support@example.com')).toThrow();
    expect(() =>
      appHistory.navigate('/search?q=https://example.com'),
    ).not.toThrow();
  });
});
