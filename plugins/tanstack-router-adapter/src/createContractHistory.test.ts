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

import { createContractHistory } from './createContractHistory';
import { TANSTACK_ADAPTER_ID } from './constants';
import type {
  RoutingBlocker,
  RoutingContract,
  RoutingLocation,
  RoutingNavigateOptions,
} from '@backstage/frontend-plugin-api';
import type { Observable } from '@backstage/types';

function createMockContract(options?: {
  basePath?: string;
  initial?: RoutingLocation;
}): {
  contract: RoutingContract;
  entries: Array<{
    location: RoutingLocation;
    adapterState?: Record<string, unknown>;
  }>;
  index: { current: number };
} {
  const basePath = options?.basePath ?? '/tools';
  const entries: Array<{
    location: RoutingLocation;
    adapterState?: Record<string, unknown>;
  }> = [
    {
      location: options?.initial ?? {
        pathname: '/',
        search: '',
        hash: '',
        state: undefined,
      },
    },
  ];
  const index = { current: 0 };
  const listeners = new Set<(loc: RoutingLocation) => void>();
  let blockers: RoutingBlocker[] = [];

  const emit = () => {
    for (const listener of [...listeners]) {
      listener(entries[index.current].location);
    }
  };

  const location$: Observable<RoutingLocation> = {
    subscribe: observerOrOnNext => {
      const onNext =
        typeof observerOrOnNext === 'function'
          ? observerOrOnNext
          : observerOrOnNext?.next?.bind(observerOrOnNext);
      const handler = (loc: RoutingLocation) => onNext?.(loc);
      listeners.add(handler);
      handler(entries[index.current].location);
      return {
        unsubscribe: () => listeners.delete(handler),
        closed: false,
      };
    },
    [Symbol.observable]() {
      return this;
    },
  };

  const contract: RoutingContract = {
    basePath,
    routePattern: basePath,
    location$,
    navigate(to: string, navigateOptions?: RoutingNavigateOptions) {
      const url = new URL(to, 'http://localhost');
      const nextLocation: RoutingLocation = {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        state: navigateOptions?.state,
      };
      const currentLocation = entries[index.current].location;
      const performNavigate = () => {
        const entry = {
          location: nextLocation,
          adapterState: navigateOptions?.adapterState,
        };
        if (navigateOptions?.replace) {
          entries[index.current] = entry;
        } else {
          entries.splice(index.current + 1);
          entries.push(entry);
          index.current = entries.length - 1;
        }
        emit();
      };

      if (blockers.length === 0 || navigateOptions?.ignoreBlockers) {
        performNavigate();
        return;
      }
      const transition = {
        currentLocation,
        nextLocation,
        action: navigateOptions?.replace
          ? ('REPLACE' as const)
          : ('PUSH' as const),
      };
      void (async () => {
        for (const blocker of blockers) {
          // eslint-disable-next-line no-await-in-loop
          if (await blocker(transition)) {
            return;
          }
        }
        performNavigate();
      })();
    },
    block(blocker: RoutingBlocker) {
      blockers = [...blockers, blocker];
      return () => {
        blockers = blockers.filter(b => b !== blocker);
      };
    },
    go(delta: number) {
      const next = index.current + delta;
      if (next < 0 || next >= entries.length) {
        return;
      }
      index.current = next;
      emit();
    },
    canGoBack: () => index.current > 0,
    canGoForward: () => index.current < entries.length - 1,
    get historyLength() {
      return entries.length;
    },
    getAdapterState(adapterId: string) {
      return entries[index.current].adapterState?.[adapterId];
    },
  };

  return { contract, entries, index };
}

describe('createContractHistory', () => {
  it('should project location and never write window.history', () => {
    const { contract } = createMockContract({
      initial: { pathname: '/a', search: '', hash: '', state: undefined },
    });
    const pushSpy = jest.spyOn(window.history, 'pushState');
    const replaceSpy = jest.spyOn(window.history, 'replaceState');

    const history = createContractHistory(contract);
    expect(history.location.pathname).toBe('/a');
    expect(history.length).toBe(1);
    expect(history.canGoBack()).toBe(false);

    history.push('/b');
    expect(history.location.pathname).toBe('/b');
    expect(history.length).toBe(2);
    expect(history.canGoBack()).toBe(true);
    expect(contract.getAdapterState(TANSTACK_ADAPTER_ID)).toEqual(
      expect.objectContaining({ __TSR_index: expect.any(Number) }),
    );
    expect(history.location.state.__TSR_index).toEqual(expect.any(Number));

    // User state must not contain adapter pollution on the contract location.
    const syncSub = contract.location$.subscribe(loc => {
      expect(loc.state).toBeUndefined();
    });
    syncSub.unsubscribe();

    expect(pushSpy).not.toHaveBeenCalled();
    expect(replaceSpy).not.toHaveBeenCalled();
    pushSpy.mockRestore();
    replaceSpy.mockRestore();
    history.destroy();
  });

  it('should store __TSR_* in adapterState and keep user state separate', () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);

    history.push('/x', { foo: 'bar', __TSR_index: 99, __TSR_key: 'k' });

    const syncSub = contract.location$.subscribe(loc => {
      expect(loc.state).toEqual({ foo: 'bar' });
    });
    syncSub.unsubscribe();

    expect(contract.getAdapterState(TANSTACK_ADAPTER_ID)).toEqual(
      expect.objectContaining({
        __TSR_index: expect.any(Number),
        __TSR_key: expect.any(String),
      }),
    );
    history.destroy();
  });

  it('should delegate go/back/forward to the contract', () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    history.push('/one');
    history.push('/two');

    history.go(-1);
    expect(history.location.pathname).toBe('/one');
    expect(history.canGoBack()).toBe(true);

    history.forward();
    expect(history.location.pathname).toBe('/two');

    history.back();
    expect(history.location.pathname).toBe('/one');
    history.destroy();
  });

  it('should notify subscribers and keep canGoBack/length after chrome-style nav', () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    const seen: string[] = [];
    const unsub = history.subscribe(({ location }) => {
      seen.push(location.pathname);
    });

    expect(history.canGoBack()).toBe(false);
    expect(history.length).toBe(1);

    // Chrome / framework navigate bypasses TanStack history.push but still
    // updates the contract — length and canGoBack must track the controller.
    contract.navigate('/external');
    expect(seen).toContain('/external');
    expect(history.location.pathname).toBe('/external');
    expect(history.length).toBe(2);
    expect(history.canGoBack()).toBe(true);

    contract.navigate('/external-2');
    expect(history.length).toBe(3);
    expect(history.canGoBack()).toBe(true);

    history.back();
    expect(history.location.pathname).toBe('/external');
    expect(history.canGoBack()).toBe(true);

    unsub();
    history.destroy();
  });

  it('should run blockers on push and skip navigation when blocked', async () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    let blocked = false;
    history.block({
      blockerFn: async () => {
        blocked = true;
        return true;
      },
    });

    history.push('/blocked');
    // Allow the async blocker to settle.
    await Promise.resolve();
    await Promise.resolve();

    expect(blocked).toBe(true);
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });

  it('should share blockers with the underlying contract so chrome/framework navigate is also blocked', async () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    let calls = 0;
    history.block({
      blockerFn: async () => {
        calls += 1;
        return true;
      },
    });

    // Simulate a chrome/framework navigation that bypasses TanStack's own
    // history.push but goes through the same shared contract.
    contract.navigate('/from-chrome');
    await Promise.resolve();
    await Promise.resolve();

    expect(calls).toBe(1);
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });

  it('should let a blocker registered directly on the contract also block TanStack push', async () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    let calls = 0;
    contract.block(() => {
      calls += 1;
      return true;
    });

    history.push('/blocked-by-framework');
    await Promise.resolve();
    await Promise.resolve();

    expect(calls).toBe(1);
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });

  it('should not run blockers on go/back (matches TanStack createHistory)', async () => {
    const { contract } = createMockContract();
    const history = createContractHistory(contract);
    history.push('/one');
    await Promise.resolve();
    await Promise.resolve();

    let blockerCalls = 0;
    history.block({
      blockerFn: async () => {
        blockerCalls += 1;
        return true;
      },
    });

    history.go(-1);
    await Promise.resolve();
    await Promise.resolve();

    expect(blockerCalls).toBe(0);
    expect(history.location.pathname).toBe('/');
    history.destroy();
  });
});
