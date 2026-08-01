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
  FrameworkLocation,
  FrameworkNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable } from '@backstage/types';

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
  navigateCalls: Array<{ to: string; options?: FrameworkNavigateOptions }>;
} {
  const navigateCalls: Array<{
    to: string;
    options?: FrameworkNavigateOptions;
  }> = [];
  const initialUrl = new URL(initialPathname, 'http://localhost');
  let current: FrameworkLocation = {
    pathname: initialUrl.pathname,
    search: initialUrl.search,
    hash: initialUrl.hash,
    state: undefined,
  };
  const listeners = new Set<(loc: FrameworkLocation) => void>();

  const location$: Observable<FrameworkLocation> = {
    subscribe: observerOrOnNext => {
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);
      const handler = (loc: FrameworkLocation) => onNext?.(loc);
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

  const appHistory: AppHistoryApi = {
    get location() {
      return current;
    },
    location$,
    navigate(to, options) {
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
    },
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

  it('should warn and no-op on go/back/forward instead of touching window.history', () => {
    const { appHistory } = createMockAppHistory();
    const historyGoSpy = jest.spyOn(window.history, 'go');
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    const history = createTanStackHistory(appHistory, { routePattern: '/' });

    history.push('/one');
    history.go(-1);
    history.back();
    history.forward();

    expect(historyGoSpy).not.toHaveBeenCalled();
    expect(consoleWarn).toHaveBeenCalled();
    // Location is unaffected — go/back/forward are unsupported no-ops.
    expect(history.location.pathname).toBe('/one');
    historyGoSpy.mockRestore();
    consoleWarn.mockRestore();
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
    history.block({
      blockerFn: async () => {
        blocked = true;
        return true;
      },
    });

    history.push('/blocked');
    await Promise.resolve();
    await Promise.resolve();

    expect(blocked).toBe(true);
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });

  it('should not run blockers on go/back/forward', async () => {
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
