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
  AppHistorySnapshot,
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

/** A custom host with location snapshots and delayed change notifications. */
function deferNotifications(
  inner: ReturnType<typeof createFrameworkMockAppHistory>,
): AppHistoryApi {
  let source = inner.getSnapshot();
  let snapshot: AppHistorySnapshot = { location: source.location };
  return {
    getSnapshot() {
      const next = inner.getSnapshot();
      if (next !== source) {
        source = next;
        snapshot = { location: next.location };
      }
      return snapshot;
    },
    subscribe(listener) {
      let active = true;
      const unsubscribe = inner.subscribe(() => {
        void Promise.resolve().then(() => {
          if (active) listener();
        });
      });
      return () => {
        active = false;
        unsubscribe();
      };
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
  let source: AppHistorySnapshot | undefined;
  let snapshot: AppHistorySnapshot;
  const appHistory: AppHistoryApi = {
    getSnapshot() {
      const next = inner.appHistory.getSnapshot();
      if (next !== source) {
        source = next;
        snapshot = {
          location: next.location,
          ...(options.withMetadata
            ? {
                action: next.action,
                entry: { key: 'default', index: 0 },
                length: 1,
              }
            : {}),
        };
      }
      return snapshot;
    },
    subscribe: inner.appHistory.subscribe,
    navigate: inner.appHistory.navigate.bind(inner.appHistory),
    createHref: (...args) => inner.appHistory.createHref(...args),
  };
  return { appHistory, navigatedTo: inner.navigatedTo };
}

describe('createTanStackHistory', () => {
  it('uses independently available snapshot metadata without inventing entry positions', () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    let source: AppHistorySnapshot | undefined;
    let snapshot: AppHistorySnapshot;
    let includeIndex = false;
    const host: AppHistoryApi = {
      getSnapshot() {
        const next = inner.getSnapshot();
        if (next !== source) {
          source = next;
          snapshot = {
            location: next.location,
            action: next.action,
            entry: {
              key: next.entry!.key,
              ...(includeIndex ? { index: next.entry!.index } : {}),
            },
          };
        }
        return snapshot;
      },
      subscribe: inner.subscribe,
      navigate: inner.navigate.bind(inner),
      createHref: inner.createHref.bind(inner),
    };
    const history = createTanStackHistory(host);
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));
    const key = history.location.state.__TSR_key;
    inner.navigate('/tools');
    expect(actions).toEqual([{ type: 'PUSH' }]);
    expect(history.location.state.__TSR_key).not.toBe(key);
    expect(history.location.state.__TSR_index).toBe(0);
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);
    inner.navigate(-1);
    expect(history.location.state.__TSR_key).toBe(key);
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });
    includeIndex = true;
    inner.navigate('/indexed');
    expect(history.location.state.__TSR_index).toBe(1);
    expect(history.canGoBack()).toBe(true);
    expect(history.length).toBe(2);
    unsubscribe();
    history.destroy();
  });

  it('should project an app-absolute location and never write window.history', () => {
    const { appHistory } = createMockAppHistory('/tools/a');
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    const history = createTanStackHistory(appHistory);
    expect(history.location.pathname).toBe('/tools/a');
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

  it('should pass app-absolute destinations through unchanged', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);

    history.push('/entities/alpha');

    expect(navigatedTo()).toEqual(['/entities/alpha']);
    expect(history.createHref('/entities/alpha')).toBe('/entities/alpha');
    history.destroy();
  });

  it('keeps complete paths when the host changes mounts', () => {
    const { appHistory, navigatedTo } = createMockAppHistory(
      '/tools/entities/alpha',
    );
    const history = createTanStackHistory(appHistory);
    const unsubscribe = history.subscribe(() => {});
    expect(history.location.pathname).toBe('/tools/entities/alpha');
    appHistory.navigate('/tools/entities/beta');
    expect(history.location.pathname).toBe('/tools/entities/beta');
    history.push('/catalog/item?tab=docs#intro');
    expect(navigatedTo()).toEqual([
      '/tools/entities/beta',
      '/catalog/item?tab=docs#intro',
    ]);
    expect(history.location.href).toBe('/catalog/item?tab=docs#intro');
    unsubscribe();
    history.destroy();
  });

  it('should keep unknown entry facts conservative for a subscribed push', () => {
    const { appHistory } = createHostOwnedAppHistory({ withMetadata: false });
    const history = createTanStackHistory(appHistory);
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
    const history = createTanStackHistory(appHistory);
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    expect(navigatedTo()).toEqual(['/a']);
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
    const history = createTanStackHistory(appHistory);
    const unsubscribe = history.subscribe(() => {});

    history.push('/a');

    // Native history adds an entry key, but cannot infer the host's stack.
    expect(navigatedTo()).toEqual(['/a']);
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
    const history = createTanStackHistory(appHistory);

    // No subscriber, so this resyncs from `AppHistoryApi` after navigating
    // rather than through the location subscription.
    history.push('/a');

    expect(history.location.state.__TSR_key).toBe('default');
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    history.destroy();
  });

  it('should track cross-page navigation without rewriting subsequent destinations', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);
    const unsub = history.subscribe(() => {});

    history.push('/entities/alpha');
    expect(history.location.pathname).toBe('/entities/alpha');

    // The app navigates off this page entirely, so the page is on its way
    // out. Taking the off-page pathname on board is what used to make the
    // next push re-prefix it into `/tools/other/page`.
    appHistory.navigate('/other/page');
    expect(history.location.pathname).toBe('/other/page');

    history.push('/entities/alpha/tab');

    expect(navigatedTo()).toEqual([
      '/entities/alpha',
      '/other/page',
      '/entities/alpha/tab',
    ]);
    unsub();
    history.destroy();
  });

  it('should round-trip query and hash at the page root without adding a slash', () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);
    const unsub = history.subscribe(() => {});

    history.push('/?b=2#g');

    expect(navigatedTo()).toEqual(['/?b=2#g']);
    expect(history.createHref('/?b=2#g')).toBe('/?b=2#g');
    expect(history.location.pathname).toBe('/');
    expect(history.location.search).toBe('?b=2');
    expect(history.location.hash).toBe('#g');
    unsub();
    history.destroy();
  });

  it('should keep user state separate from local __TSR_* bookkeeping', () => {
    const { appHistory } = createMockAppHistory();
    const history = createTanStackHistory(appHistory);
    const unsubscribe = history.subscribe(() => {});

    history.push('/x', { foo: 'bar' });

    expect(history.location.state).toEqual(
      expect.objectContaining({ foo: 'bar', __TSR_index: expect.any(Number) }),
    );
    expect(appHistory.getSnapshot().location.state).toMatchObject({
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
    const history = createTanStackHistory(appHistory);
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
    const history = createTanStackHistory(appHistory);
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
    expect(history.location.pathname).toBe('/tools');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });

    const count = actions.length;
    history.back();
    expect(actions).toHaveLength(count);
    appHistory.navigate('/tools/unrelated');
    expect(history.location.pathname).toBe('/tools/unrelated');
    expect(actions.at(-1)).toEqual({ type: 'GO', index: 0 });
    expect(history.location.state.__TSR_index).toBe(0);
    unsubscribe();
    history.back();
    expect(history.location.pathname).toBe('/tools');
    expect(history.location.state.__TSR_index).toBe(0);
    history.destroy();
  });

  it('treats delayed custom-host notifications as uncorrelated locations', async () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    inner.navigate('/tools/one');
    inner.navigate('/tools/two');
    const appHistory: AppHistoryApi = {
      getSnapshot: deferNotifications(inner).getSnapshot,
      subscribe: inner.subscribe,
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
    const history = createTanStackHistory(appHistory);
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));

    history.back();
    expect(actions).toEqual([]);
    // This host update cannot be correlated with the scheduled traversal.
    inner.navigate('/tools/interleaved', { replace: true });
    expect(actions).toEqual([{ type: 'GO', index: 0 }]);
    await Promise.resolve();
    expect(history.location.pathname).toBe('/tools/one');
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
    const history = createTanStackHistory(appHistory);
    const actions: unknown[] = [];
    const unsubscribe = history.subscribe(event => actions.push(event.action));
    history.back();
    expect(inner.getSnapshot().location.pathname).toBe('/tools/one');
    expect(actions).toEqual([]);
    await Promise.resolve();
    expect(history.location.pathname).toBe('/tools/one');
    expect(actions).toEqual([{ type: 'GO', index: 0 }]);
    unsubscribe();
    history.destroy();
  });

  it('should notify subscribers on external (chrome-style) navigation', () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);
    const seen: string[] = [];
    const unsub = history.subscribe(({ location }) => {
      seen.push(location.pathname);
    });

    appHistory.navigate('/tools/external');

    expect(seen).toEqual(['/tools/external']);
    expect(history.location.pathname).toBe('/tools/external');
    unsub();
    history.destroy();
  });

  it('shares the host subscription and releases it when unused or destroyed', () => {
    const { appHistory } = createMockAppHistory('/tools');
    const unsubscriptions: jest.Mock[] = [];
    const hostSubscribe = appHistory.subscribe;
    const subscribe = jest
      .spyOn(appHistory, 'subscribe')
      .mockImplementation(listener => {
        const unsubscribe = jest.fn(hostSubscribe(listener));
        unsubscriptions.push(unsubscribe);
        return unsubscribe;
      });
    const history = createTanStackHistory(appHistory);
    expect(subscribe).not.toHaveBeenCalled();

    const unsubscribeFirst = history.subscribe(() => {});
    const unsubscribeSecond = history.subscribe(() => {});
    expect(subscribe).toHaveBeenCalledTimes(1);
    const first = unsubscriptions[0];
    unsubscribeFirst();
    expect(first).not.toHaveBeenCalled();
    unsubscribeSecond();
    expect(first).toHaveBeenCalledTimes(1);

    appHistory.navigate('/tools/reconnected');
    const seen: string[] = [];
    history.subscribe(({ location }) => seen.push(location.pathname));
    expect(subscribe).toHaveBeenCalledTimes(2);
    expect(seen).toEqual(['/tools/reconnected']);
    expect(history.location.pathname).toBe('/tools/reconnected');
    history.destroy();
    expect(unsubscriptions[1]).toHaveBeenCalledTimes(1);
    expect(history.subscribers.size).toBe(0);
    appHistory.navigate('/tools/after-destroy');
    expect(seen).toEqual(['/tools/reconnected']);
    subscribe.mockRestore();
  });

  it('suppresses delayed write echoes without changing native reentrant notifications', async () => {
    const inner = createFrameworkMockAppHistory({ initialLocation: '/tools' });
    const history = createTanStackHistory(deferNotifications(inner));
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
    expect(inner.navigateCalls.map(call => call.to)).toEqual(['/one', '/two']);
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
    expect(first.at(-1)).toBe('GO /tools/external');
    expect(second.at(-1)).toBe('GO /tools/external');
    unsubscribeFirst();
    unsubscribeSecond();
    history.destroy();
  });

  it('allows host navigation while a native blocker is pending and removes unregistered blockers', async () => {
    const { appHistory, navigatedTo } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);
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
    expect(seen).toEqual(['/tools/chrome']);
    resolveBlocker(false);
    await Promise.resolve();
    expect(seen).toEqual(['/tools/chrome', '/waiting']);
    expect(navigatedTo()).toEqual(['/tools/chrome', '/waiting']);

    history.replace('/ignored', undefined, { ignoreBlocker: true });
    expect(blocker).toHaveBeenCalledTimes(1);
    unblock();
    history.push('/unblocked');
    expect(blocker).toHaveBeenCalledTimes(1);
    expect(seen).toEqual([
      '/tools/chrome',
      '/waiting',
      '/ignored',
      '/unblocked',
    ]);
    unsubscribe();
    history.destroy();
  });

  it('does not discard reused host snapshots after unchanged writes or traversal', () => {
    const entries: AppLocation[] = [
      { pathname: '/tools', search: '', hash: '', state: undefined },
    ];
    let index = 0;
    let notify: (() => void) | undefined;
    let snapshot: AppHistorySnapshot = { location: entries[index] };
    const appHistory: AppHistoryApi = {
      getSnapshot: () => snapshot,
      subscribe(listener) {
        notify = listener;
        return () => {
          notify = undefined;
        };
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
        snapshot = { location: entries[index] };
        notify?.();
      },
      createHref: to => to,
    };
    const history = createTanStackHistory(appHistory);
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
    const history = createTanStackHistory(appHistory);
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
    expect(history.location.pathname).toBe('/tools');
    history.destroy();
  });

  it('should not run blockers before numeric traversal because the destination is browser-owned', async () => {
    const { appHistory } = createMockAppHistory('/tools');
    const history = createTanStackHistory(appHistory);
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
