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

import { createTanStackHistory } from './createTanStackHistory';
import type {
  AppHistoryApi,
  AppLocation,
  AppNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable } from '@backstage/types';
import { createMockAppHistory as createFrameworkMockAppHistory } from '@backstage/frontend-test-utils';

/**
 * Minimal hand-rolled `AppHistoryApi` for adapter-level tests, so this
 * package's unit tests don't depend on shared test-utils mocks.
 *
 * Matches the real implementation on the two properties these tests turn on:
 * `location` is a stable reference, and `location$` emits synchronously from
 * inside `navigate()`.
 */
function createMockAppHistory(initialPathname = '/'): {
  appHistory: AppHistoryApi;
  navigatedTo: () => string[];
  navigateCalls: Array<{ to: string; options?: AppNavigateOptions }>;
} {
  const navigateCalls: Array<{
    to: string;
    options?: AppNavigateOptions;
  }> = [];
  const initialUrl = new URL(initialPathname, 'http://localhost');
  let current: AppLocation = {
    pathname: initialUrl.pathname,
    search: initialUrl.search,
    hash: initialUrl.hash,
    state: undefined,
  };
  const listeners = new Set<(loc: AppLocation) => void>();

  const location$: Observable<AppLocation> = {
    subscribe: observerOrOnNext => {
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);
      const handler = (loc: AppLocation) => onNext?.(loc);
      listeners.add(handler);
      handler(current);
      return {
        unsubscribe: () => listeners.delete(handler),
        closed: false,
      };
    },
    [Symbol.observable]() {
      return this;
    },
  };

  function navigate(path: string, options?: AppNavigateOptions): void;
  function navigate(delta: number): void;
  function navigate(to: string | number, options?: AppNavigateOptions): void {
    if (typeof to === 'number') {
      return;
    }
    navigateCalls.push({ to, options });
    const url = new URL(to, 'http://localhost');
    current = {
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      state: options?.state,
    };
    for (const listener of [...listeners]) {
      listener(current);
    }
  }

  const appHistory: AppHistoryApi = {
    get location() {
      return current;
    },
    location$,
    navigate,
    createHref(to) {
      return to;
    },
  };

  return {
    appHistory,
    navigateCalls,
    navigatedTo: () => navigateCalls.map(call => call.to),
  };
}

describe('createTanStackHistory', () => {
  it('should project a scoped location and never write window.history', () => {
    const { appHistory } = createMockAppHistory('/tools/a');
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    expect(history.location.pathname).toBe('/a');
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    history.push('/b');
    expect(history.location.pathname).toBe('/b');
    expect(history.length).toBe(2);
    expect(history.canGoBack()).toBe(true);
    expect(history.location.state.__TSR_index).toEqual(expect.any(Number));

    expect(pushSpy).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
    history.destroy();
  });

  it('should navigate AppHistoryApi with the app-absolute path derived from the route pattern', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });

    history.push('/entities/alpha');

    expect(navigatedTo()).toEqual(['/tools/entities/alpha']);
    expect(history.createHref('/entities/alpha')).toBe('/tools/entities/alpha');
    history.destroy();
  });

  it('should stay scoped when the concrete prefix changes under the same pattern', () => {
    const { appHistory, navigatedTo } = createMockAppHistory(
      '/tools/entities/alpha',
    );
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools/entities/:id',
    });
    const unsub = history.subscribe(() => {});

    expect(history.location.pathname).toBe('/');

    // `AppHistoryApi` emits synchronously from inside navigate(), i.e. before
    // any re-render could hand this history a new concrete prefix. Deriving
    // the prefix from the route pattern is what keeps that emission scoped.
    appHistory.navigate('/tools/entities/beta');

    expect(history.location.pathname).toBe('/');

    // ...and a later in-page push must not re-prefix a stale mount point.
    history.push('/tab');

    expect(navigatedTo()).toEqual([
      '/tools/entities/beta',
      '/tools/entities/beta/tab',
    ]);
    expect(history.location.pathname).toBe('/tab');
    unsub();
    history.destroy();
  });

  it('should derive splat, optional, and case-insensitive mounts from the shared matcher', () => {
    const splat = createMockAppHistory('/docs/a/b');
    const splatHistory = createTanStackHistory(splat.appHistory, {
      routePattern: '/docs/*',
    });
    expect(splatHistory.location.pathname).toBe('/a/b');
    expect(splatHistory.createHref('/next')).toBe('/docs/next');
    splatHistory.destroy();

    const optional = createMockAppHistory('/things');
    const optionalHistory = createTanStackHistory(optional.appHistory, {
      routePattern: '/things/:id?',
    });
    expect(optionalHistory.location.pathname).toBe('/');
    expect(optionalHistory.createHref('/tab')).toBe('/things/tab');
    optionalHistory.destroy();

    const insensitive = createMockAppHistory('/CATALOG/details');
    const insensitiveHistory = createTanStackHistory(insensitive.appHistory, {
      routePattern: '/catalog',
    });
    expect(insensitiveHistory.location.pathname).toBe('/details');
    expect(insensitiveHistory.createHref('/next')).toBe('/CATALOG/next');
    insensitiveHistory.destroy();
  });

  it('should synthesize fallback metadata only once for a subscribed push', () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    expect(history.location.state.__TSR_index).toBe(1);
    expect(history.length).toBe(2);
    expect(history.canGoBack()).toBe(true);
    unsubscribe();
    history.destroy();
  });

  it('should ignore off-page locations rather than parking them in the scoped location', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsub = history.subscribe(() => {});

    history.push('/entities/alpha');
    expect(history.location.pathname).toBe('/entities/alpha');

    // The app navigates off this page entirely, so the page is on its way
    // out. Taking the off-page pathname on board is what used to make the
    // next push re-prefix it into `/tools/other/page`.
    appHistory.navigate('/other/page');
    expect(history.location.pathname).toBe('/entities/alpha');

    history.push('/entities/alpha/tab');

    expect(navigatedTo()).toEqual([
      '/tools/entities/alpha',
      '/other/page',
      '/tools/entities/alpha/tab',
    ]);
    unsub();
    history.destroy();
  });

  it('should round-trip query and hash at the page root without adding a slash', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsub = history.subscribe(() => {});

    history.push('/?b=2#g');

    expect(navigatedTo()).toEqual(['/tools?b=2#g']);
    expect(history.createHref('/?b=2#g')).toBe('/tools?b=2#g');
    expect(history.location.pathname).toBe('/');
    expect(history.location.search).toBe('?b=2');
    expect(history.location.hash).toBe('#g');
    unsub();
    history.destroy();
  });

  it('should keep user state separate from local __TSR_* bookkeeping', () => {
    const { appHistory } = createMockAppHistory();
    const history = createTanStackHistory(appHistory, { routePattern: '/' });

    history.push('/x', { foo: 'bar' });

    expect(history.location.state).toEqual(
      expect.objectContaining({ foo: 'bar', __TSR_index: expect.any(Number) }),
    );
    history.destroy();
  });

  it('should traverse through AppHistoryApi with stable keys and truthful actions', () => {
    const appHistory = createFrameworkMockAppHistory();
    const historyGoSpy = jest.spyOn(window.history, 'go');
    const history = createTanStackHistory(appHistory, { routePattern: '/' });
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));

    history.push('/one');
    const oneKey = history.location.state.__TSR_key;
    history.push('/two');
    const twoKey = history.location.state.__TSR_key;
    expect(twoKey).not.toBe(oneKey);

    history.back();
    expect(history.location.pathname).toBe('/one');
    expect(history.location.state.__TSR_key).toBe(oneKey);
    expect(actions.at(-1)).toEqual({ type: 'BACK' });

    history.forward();
    expect(history.location.pathname).toBe('/two');
    expect(history.location.state.__TSR_key).toBe(twoKey);
    expect(actions.at(-1)).toEqual({ type: 'FORWARD' });

    history.go(-2);
    expect(history.location.pathname).toBe('/');
    expect(history.canGoBack()).toBe(false);
    expect(actions.at(-1)).toEqual({ type: 'GO', index: -2 });

    expect(historyGoSpy).not.toHaveBeenCalled();
    expect(appHistory.navigateCalls.slice(-3)).toEqual([
      { to: -1 },
      { to: 1 },
      { to: -2 },
    ]);
    unsubscribe();
    historyGoSpy.mockRestore();
    history.destroy();
  });

  it('should notify subscribers on external (chrome-style) navigation', () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const seen: string[] = [];
    const unsub = history.subscribe(({ location }) => {
      seen.push(location.pathname);
    });

    appHistory.navigate('/tools/external');

    expect(seen).toEqual(['/external']);
    expect(history.location.pathname).toBe('/external');
    unsub();
    history.destroy();
  });

  it('should run local blockers on push and skip navigation when blocked', async () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    let blocked = false;
    let nextState: unknown;
    history.block({
      blockerFn: async ({ nextLocation }) => {
        blocked = true;
        nextState = nextLocation.state;
        return true;
      },
    });

    history.push('/blocked', { reason: 'unsaved' });
    await Promise.resolve();
    await Promise.resolve();

    expect(blocked).toBe(true);
    expect(nextState).toEqual({ reason: 'unsaved' });
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });

  it('should not run blockers before numeric traversal because the destination is browser-owned', async () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    let blockerCalls = 0;
    history.block({
      blockerFn: async () => {
        blockerCalls += 1;
        return true;
      },
    });

    history.go(-1);
    history.back();
    history.forward();
    await Promise.resolve();

    expect(blockerCalls).toBe(0);
    history.destroy();
  });
});
