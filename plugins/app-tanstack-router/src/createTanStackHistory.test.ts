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
import { createMockAppHistory as createFrameworkMockAppHistory } from '@backstage/frontend-test-utils';

/** Ordinary adapter tests use the production memory history. */
function createMockAppHistory(initialLocation = '/') {
  const appHistory = createFrameworkMockAppHistory({ initialLocation });
  return {
    appHistory,
    navigateCalls: appHistory.navigateCalls,
    navigatedTo: () => appHistory.navigateCalls.map(call => call.to),
  };
}

/** Snapshots change immediately, while subscribers receive them later. */
function deferNotifications(
  inner: ReturnType<typeof createFrameworkMockAppHistory>,
): AppHistoryApi {
  return {
    get location() {
      return inner.location;
    },
    location$: {
      subscribe(observer) {
        const next =
          typeof observer === 'function'
            ? observer
            : observer?.next?.bind(observer);
        let replay = true;
        const subscription = inner.location$.subscribe(location => {
          if (replay) {
            next?.(location);
          } else {
            void Promise.resolve().then(() => {
              if (!subscription.closed) next?.(location);
            });
          }
        });
        replay = false;
        return subscription;
      },
      [Symbol.observable]() {
        return this;
      },
    },
    navigate: inner.navigate.bind(inner),
    createHref: inner.createHref.bind(inner),
  };
}

/** A public host wrapper, optionally reporting a single host-owned slot. */
function createHostOwnedAppHistory(options: { withMetadata: boolean }): {
  appHistory: AppHistoryApi;
  navigatedTo: () => Array<string | number>;
} {
  const inner = createMockAppHistory('/tools');
  let action: 'PUSH' | 'REPLACE' | 'POP' = 'POP';

  const appHistory: AppHistoryApi = {
    get location() {
      return inner.appHistory.location;
    },
    location$: inner.appHistory.location$,
    navigate(to: string | number, navOptions?: AppNavigateOptions) {
      if (typeof to !== 'number') {
        action = navOptions?.replace ? 'REPLACE' : 'PUSH';
      }
      (inner.appHistory.navigate as (t: any, o?: any) => void)(to, navOptions);
    },
    createHref: (...args) => inner.appHistory.createHref(...args),
  };

  if (options.withMetadata) {
    // Implemented the way any third-party history would: by looking the global
    // capability symbol up by name, with no import from the framework.
    Object.defineProperty(
      appHistory,
      Symbol.for('@backstage/app-history/metadata/v1'),
      {
        get: () => ({
          action,
          key: 'default',
          index: 0,
          length: 1,
          canGoBack: false,
        }),
      },
    );
  }

  return { appHistory, navigatedTo: inner.navigatedTo };
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

  it('should keep unknown entry facts conservative for a subscribed push', () => {
    const { appHistory } = createHostOwnedAppHistory({ withMetadata: false });
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);
    unsubscribe();
    history.destroy();
  });

  it('should trust a history that supplies metadata, even when it reports a first-entry shape', () => {
    const { appHistory, navigatedTo } = createHostOwnedAppHistory({
      withMetadata: true,
    });
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    expect(navigatedTo()).toEqual(['/tools/a']);
    expect(history.location.pathname).toBe('/a');
    // The host says the stack did not grow, and that is now taken at its word.
    expect(history.location.state.__TSR_key).toBe('default');
    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    unsubscribe();
    history.destroy();
  });

  it('should not infer a stack from a host without the capability', () => {
    const { appHistory, navigatedTo } = createHostOwnedAppHistory({
      withMetadata: false,
    });
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    // Native history adds an entry key, but cannot infer the host's stack.
    expect(navigatedTo()).toEqual(['/tools/a']);
    expect(history.location.pathname).toBe('/a');
    expect(history.location.state.__TSR_key).toEqual(expect.any(String));
    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    unsubscribe();
    history.destroy();
  });

  it('should trust supplied metadata on the unsubscribed path too', () => {
    const { appHistory } = createHostOwnedAppHistory({ withMetadata: true });
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });

    // No subscriber, so this resyncs from `AppHistoryApi` after navigating
    // rather than through the location subscription.
    history.push('/a');

    expect(history.location.state.__TSR_key).toBe('default');
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

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
    const unsubscribe = history.subscribe(() => {});

    history.push('/x', { foo: 'bar' });

    expect(history.location.state).toEqual(
      expect.objectContaining({ foo: 'bar', __TSR_index: expect.any(Number) }),
    );
    expect(appHistory.location.state).toMatchObject({
      foo: 'bar',
      __TSR_key: expect.any(String),
      __TSR_index: 1,
    });
    appHistory.navigate('/external', { state: ['host', 'state'] });
    expect(history.location.state).toMatchObject({ state: ['host', 'state'] });
    history.back();
    expect(history.location.state).toMatchObject({ foo: 'bar' });
    unsubscribe();
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

  it('keeps custom-host traversal metadata conservative', () => {
    const { appHistory } = createHostOwnedAppHistory({ withMetadata: false });
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));

    history.push('/one');
    history.push('/two');
    history.back();
    expect(history.location.pathname).toBe('/one');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });
    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    history.forward();
    expect(history.location.pathname).toBe('/two');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });
    history.go(-2);
    expect(history.location.pathname).toBe('/');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });

    const count = actions.length;
    history.back();
    expect(actions).toHaveLength(count);
    appHistory.navigate('/tools/unrelated');
    expect(history.location.pathname).toBe('/unrelated');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });
    expect(history.location.state.__TSR_index).toBe(0);
    unsubscribe();
    history.back();
    expect(history.location.pathname).toBe('/');
    expect(history.location.state.__TSR_index).toBe(0);
    history.destroy();
  });

  it('treats delayed custom-host notifications as uncorrelated locations', async () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    inner.navigate('/tools/one');
    inner.navigate('/tools/two');
    const appHistory: AppHistoryApi = {
      get location() {
        return inner.location;
      },
      location$: inner.location$,
      navigate(to: string | number, options?: AppNavigateOptions) {
        void Promise.resolve().then(() => {
          if (typeof to === 'number') {
            inner.navigate(to);
          } else {
            inner.navigate(to, options);
          }
        });
      },
      createHref: (...args) => inner.createHref(...args),
    };
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));

    history.back();
    expect(actions).toEqual([]);
    // This host update cannot be correlated with the scheduled traversal.
    inner.navigate('/tools/interleaved', { replace: true });
    expect(actions).toEqual([{ type: 'GO', index: 0 }]);
    await Promise.resolve();
    expect(history.location.pathname).toBe('/one');
    expect(actions).toEqual([
      { type: 'GO', index: 0 },
      { type: 'GO', index: 0 },
    ]);
    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.canGoBack()).toBe(false);
    expect(history.length).toBe(1);
    unsubscribe();
    history.destroy();
  });

  it('notifies when a custom host changes its snapshot before its delayed emission', async () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    inner.navigate('/tools/one');
    inner.navigate('/tools/two');
    const appHistory = deferNotifications(inner);
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));
    history.back();
    expect(inner.location.pathname).toBe('/tools/one');
    expect(actions).toEqual([]);
    await Promise.resolve();
    expect(history.location.pathname).toBe('/one');
    expect(actions).toEqual([{ type: 'GO', index: 0 }]);
    unsubscribe();
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

  it('shares the host subscription and releases it when unused or destroyed', () => {
    const { appHistory } = createMockAppHistory('/tools');
    const subscribe = jest.spyOn(appHistory.location$, 'subscribe');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    expect(subscribe).not.toHaveBeenCalled();

    const unsubscribeFirst = history.subscribe(() => {});
    const unsubscribeSecond = history.subscribe(() => {});
    expect(subscribe).toHaveBeenCalledTimes(1);
    const first = subscribe.mock.results[0].value;
    unsubscribeFirst();
    expect(first.closed).toBe(false);
    unsubscribeSecond();
    expect(first.closed).toBe(true);

    appHistory.navigate('/tools/reconnected');
    const seen: string[] = [];
    history.subscribe(({ location }) => seen.push(location.pathname));
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(seen).toEqual(['/reconnected']);
    history.destroy();
    expect(subscribe.mock.results[1].value.closed).toBe(true);
    expect(history.subscribers.size).toBe(0);
    appHistory.navigate('/tools/after-destroy');
    expect(seen).toEqual(['/reconnected']);
    subscribe.mockRestore();
  });

  it('suppresses delayed write echoes without changing native reentrant notifications', async () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    const history = createTanStackHistory(deferNotifications(inner), {
      routePattern: '/tools',
    });
    const first: string[] = [];
    const second: string[] = [];
    const unsubscribeFirst = history.subscribe(({ location, action }) => {
      first.push(`${action.type} ${location.pathname}`);
      if (location.pathname === '/one') history.replace('/two', { step: 2 });
    });
    const unsubscribeSecond = history.subscribe(({ location, action }) => {
      second.push(`${action.type} ${location.pathname}`);
    });

    history.push('/one', { step: 1 });
    expect(inner.navigateCalls.map(call => call.to)).toEqual([
      '/tools/one',
      '/tools/two',
    ]);
    expect(history.location.pathname).toBe('/two');
    expect(history.location.state).toMatchObject({ step: 2, __TSR_index: 0 });
    expect(first).toEqual(['PUSH /one', 'REPLACE /two']);
    // Native history reads the current location for each subscriber, including
    // the subscriber resumed after the nested replace.
    expect(second).toEqual(['REPLACE /two', 'PUSH /two']);
    await Promise.resolve();
    expect(first).toEqual(['PUSH /one', 'REPLACE /two']);
    expect(second).toEqual(['REPLACE /two', 'PUSH /two']);
    expect(history.location.pathname).toBe('/two');

    inner.navigate('/tools/external');
    await Promise.resolve();
    expect(first.at(-1)).toBe('GO /external');
    expect(second.at(-1)).toBe('GO /external');
    unsubscribeFirst();
    unsubscribeSecond();
    history.destroy();
  });

  it('allows host navigation while a native blocker is pending and removes unregistered blockers', async () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    let resolveBlocker!: (blocked: boolean) => void;
    const pending = new Promise<boolean>(resolve => {
      resolveBlocker = resolve;
    });
    const blocker = jest.fn(() => pending);
    const unblock = history.block({ blockerFn: blocker });
    const seen: string[] = [];
    const unsubscribe = history.subscribe(({ location }) =>
      seen.push(location.pathname),
    );

    history.push('/waiting');
    appHistory.navigate('/tools/chrome');
    expect(seen).toEqual(['/chrome']);
    resolveBlocker(false);
    await Promise.resolve();
    expect(seen).toEqual(['/chrome', '/waiting']);
    expect(navigatedTo()).toEqual(['/tools/chrome', '/tools/waiting']);

    history.replace('/ignored', undefined, { ignoreBlocker: true });
    expect(blocker).toHaveBeenCalledTimes(1);
    unblock();
    history.push('/unblocked');
    expect(blocker).toHaveBeenCalledTimes(1);
    expect(seen).toEqual(['/chrome', '/waiting', '/ignored', '/unblocked']);
    unsubscribe();
    history.destroy();
  });

  it('does not discard reused host snapshots after unchanged writes or traversal', () => {
    const entries: AppLocation[] = [
      { pathname: '/tools', search: '', hash: '', state: undefined },
    ];
    let index = 0;
    let notify: ((location: AppLocation) => void) | undefined;
    const appHistory: AppHistoryApi = {
      get location() {
        return entries[index];
      },
      location$: {
        subscribe(observer) {
          notify =
            typeof observer === 'function'
              ? observer
              : observer?.next?.bind(observer);
          notify?.(entries[index]);
          let closed = false;
          return {
            get closed() {
              return closed;
            },
            unsubscribe() {
              closed = true;
              notify = undefined;
            },
          };
        },
        [Symbol.observable]() {
          return this;
        },
      },
      navigate(to: string | number, options?: AppNavigateOptions) {
        if (options?.replace && to === entries[index].pathname) {
          return;
        }
        if (typeof to === 'number') {
          index += to;
        } else {
          entries.push({
            pathname: to,
            search: '',
            hash: '',
            state: options?.state,
          });
          index += 1;
        }
        notify?.(entries[index]);
      },
      createHref: to => to,
    };
    const history = createTanStackHistory(appHistory, {
      routePattern: '/tools',
    });
    const seen: string[] = [];
    const unsubscribe = history.subscribe(({ location }) =>
      seen.push(location.pathname),
    );

    history.replace('/');
    history.push('/one');
    history.push('/two');
    history.back();
    history.back();
    expect(seen).toEqual(['/', '/one', '/two', '/one', '/']);
    expect(history.location.pathname).toBe('/');
    unsubscribe();
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
    expect(nextState).toEqual({
      reason: 'unsaved',
      key: expect.any(String),
      __TSR_key: expect.any(String),
      __TSR_index: 1,
    });
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
