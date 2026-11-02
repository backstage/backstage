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
  it('reads the initial snapshot without replaying subscriptions', () => {
    const appHistory = createMockAppHistory({
      initialLocation: '/catalog?q=1#hash',
    });
    const listener = jest.fn();
    appHistory.subscribe(listener);
    expect(listener).not.toHaveBeenCalled();
    expect(appHistory.getSnapshot().location).toEqual({
      pathname: '/catalog',
      search: '?q=1',
      hash: '#hash',
      state: undefined,
    });
  });

  it('should publish snapshots and record navigate calls', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    const locs: AppLocation[] = [];
    appHistory.subscribe(() => locs.push(appHistory.getSnapshot().location));

    appHistory.navigate('/tools', { state: { step: 1 } });

    expect(appHistory.navigateCalls).toEqual([
      { to: '/tools', options: { state: { step: 1 } } },
    ]);
    expect(navigate).toHaveBeenCalledWith('/tools', { state: { step: 1 } });
    expect(locs[0]).toEqual({
      pathname: '/tools',
      search: '',
      hash: '',
      state: { step: 1 },
    });
  });

  it('records navigation order when a subscriber navigates again', () => {
    const appHistory = createMockAppHistory();
    const subscription = appHistory.subscribe(() => {
      const location = appHistory.getSnapshot().location;

      if (location.pathname === '/first') appHistory.navigate('/second');
    });
    appHistory.navigate('/first');
    expect(appHistory.navigateCalls.map(call => call.to)).toEqual([
      '/first',
      '/second',
    ]);
    expect(appHistory.getSnapshot().location.pathname).toBe('/second');
    subscription();
  });

  it('should preserve single-arg navigate arity for jest assertions', () => {
    const navigate = jest.fn();
    const appHistory = createMockAppHistory({ navigate });
    appHistory.navigate('/only-path');
    expect(navigate).toHaveBeenCalledWith('/only-path');
    expect(navigate.mock.calls[0]).toHaveLength(1);
  });

  it('should traverse locations with numeric navigation', () => {
    const appHistory = createMockAppHistory({ initialLocation: '/start' });
    appHistory.navigate('/first');
    appHistory.navigate('/second');

    appHistory.navigate(-1);

    expect(appHistory.getSnapshot().location.pathname).toBe('/first');
    expect(appHistory.navigateCalls.at(-1)).toEqual({ to: -1 });
  });

  it('should expose location as a stable reference that tracks navigation', () => {
    const appHistory = createMockAppHistory({ initialLocation: '/catalog' });

    const initial = appHistory.getSnapshot().location;
    expect(initial).toEqual({
      pathname: '/catalog',
      search: '',
      hash: '',
      state: undefined,
    });
    // Repeated reads must be reference-equal, or useSyncExternalStore loops.
    expect(appHistory.getSnapshot().location).toBe(initial);

    // Navigating to the location we are already on is not a change.
    appHistory.navigate('/catalog');
    expect(appHistory.getSnapshot().location).toBe(initial);

    appHistory.navigate('/tools?tab=1', { state: { step: 1 } });
    expect(appHistory.getSnapshot().location).not.toBe(initial);
    expect(appHistory.getSnapshot().location).toEqual({
      pathname: '/tools',
      search: '?tab=1',
      hash: '',
      state: { step: 1 },
    });

    // A subscriber reads the same cached location as any other consumer.
    let emitted: AppLocation | undefined;
    appHistory.subscribe(() => {
      const l = appHistory.getSnapshot().location;

      emitted = l;
    });
    expect(emitted).toBeUndefined();
    appHistory.navigate('/another');
    expect(emitted).toBe(appHistory.getSnapshot().location);
  });

  it('should give every history subscription its own handler', () => {
    const appHistory = createMockAppHistory();
    const seen: string[] = [];
    // The real app history wraps each subscription in its own handler, so the
    // same function subscribing twice is two subscriptions.
    const onNext = () => seen.push(appHistory.getSnapshot().location.pathname);

    const first = appHistory.subscribe(onNext);
    const second = appHistory.subscribe(onNext);
    expect(seen).toEqual([]);

    appHistory.navigate('/catalog');
    expect(seen).toEqual(['/catalog', '/catalog']);

    first();
    first(); // Unsubscribing twice is harmless.

    appHistory.navigate('/tools');
    expect(seen).toEqual(['/catalog', '/catalog', '/tools']);

    second();
  });

  it('should read the initial location the way the real app history reads the browser', () => {
    const appHistory = createMockAppHistory({
      basename: '/backstage',
      initialLocation: '/backstage/catalog?q=1#top',
    });

    // The initial location stands in for the browser URL, which carries the
    // deploy basename — and every location the API hands out is stripped of it.
    expect(appHistory.getSnapshot().location).toEqual({
      pathname: '/catalog',
      search: '?q=1',
      hash: '#top',
      state: undefined,
    });

    // navigate targets are app-relative and never stripped, so a path that
    // happens to repeat the basename stays exactly as navigated to.
    appHistory.navigate('/backstage/other');
    expect(appHistory.getSnapshot().location.pathname).toBe('/backstage/other');
  });

  it('should normalise hrefs the same way the real app history does', () => {
    const appHistory = createMockAppHistory();

    expect(appHistory.createHref('/catalog')).toBe('/catalog');
    expect(appHistory.createHref('/catalog?q=1#top')).toBe('/catalog?q=1#top');
    // Without a basename there is nothing to prepend, but the target is still
    // resolved to an app-absolute path, exactly as in production.
    expect(() => appHistory.createHref('catalog')).toThrow(
      'App routing requires',
    );
    expect(appHistory.createHref('/a/../b')).toBe('/b');
  });

  it('should treat targets that are not app-relative like the real app history', () => {
    const appHistory = createMockAppHistory({ basename: '/backstage' });

    expect(appHistory.createHref('/catalog')).toBe('/backstage/catalog');
    expect(appHistory.createHref('/catalog/foo/edit')).toBe(
      '/backstage/catalog/foo/edit',
    );
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

    const before = appHistory.getSnapshot().location;
    appHistory.navigate('https://example.com/x');
    appHistory.navigate('mailto:support@example.com', { replace: true });
    expect(appHistory.navigateCalls).toEqual([
      { to: 'https://example.com/x', options: undefined },
      { to: 'mailto:support@example.com', options: { replace: true } },
    ]);
    expect(appHistory.getSnapshot().location).toBe(before);
    expect(() =>
      appHistory.navigate('/search?q=https://example.com'),
    ).not.toThrow();
  });
});
