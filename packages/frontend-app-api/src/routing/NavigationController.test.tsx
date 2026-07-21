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

import { render } from '@testing-library/react';
import type { FrameworkLocation } from '@backstage/frontend-plugin-api';
import {
  createMemoryHistoryBackend,
  createWindowHistoryBackend,
} from './HistoryBackend';
import {
  createNavigationController,
  type NavigationController,
} from './NavigationController';
// eslint-disable-next-line @backstage/no-relative-monorepo-imports
import { useObservableAsState } from '../../../frontend-plugin-api/src/routing/useObservableAsState';

describe('NavigationController', () => {
  let controller: NavigationController;

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    controller = createNavigationController();
  });

  afterEach(() => {
    controller.dispose();
  });

  it('should navigate by updating window.history', () => {
    controller.navigate('/catalog/entity/foo');
    expect(window.location.pathname).toBe('/catalog/entity/foo');
  });

  describe('with memory history backend', () => {
    let memoryController: NavigationController;
    let memoryHistory: ReturnType<typeof createMemoryHistoryBackend>;

    beforeEach(() => {
      memoryHistory = createMemoryHistoryBackend({
        initialEntries: ['/start'],
      });
      memoryController = createNavigationController({ history: memoryHistory });
    });

    afterEach(() => {
      memoryController.dispose();
    });

    it('should use the initial memory entry without touching window.history', () => {
      const windowBefore = window.location.pathname;
      const locations: string[] = [];
      memoryController.location$.subscribe(loc => locations.push(loc.pathname));

      expect(locations[0]).toBe('/start');
      expect(window.location.pathname).toBe(windowBefore);
    });

    it('should navigate programmatically through memory history', () => {
      const windowBefore = window.location.pathname;
      memoryController.navigate('/catalog/entity/foo');

      const locations: string[] = [];
      memoryController.location$.subscribe(loc => locations.push(loc.pathname));

      expect(locations[locations.length - 1]).toBe('/catalog/entity/foo');
      expect(memoryHistory.getLocation().pathname).toBe('/catalog/entity/foo');
      expect(window.location.pathname).toBe(windowBefore);
    });

    it('should emit on memory back/forward via go()', () => {
      memoryController.navigate('/catalog');
      memoryController.navigate('/scaffolder');

      const locations: string[] = [];
      memoryController.location$.subscribe(loc => locations.push(loc.pathname));
      const before = locations.length;

      memoryController.go(-1);

      expect(locations.slice(before)).toEqual(['/catalog']);
    });

    it('should scope contract navigate against memory history', () => {
      const contract = memoryController.createContract('/catalog');
      contract.navigate('/entity/bar');

      expect(memoryHistory.getLocation().pathname).toBe('/catalog/entity/bar');
    });

    it('should apply basename with memory history', () => {
      memoryController.dispose();
      memoryHistory = createMemoryHistoryBackend({
        initialEntries: ['/backstage'],
      });
      memoryController = createNavigationController({
        basename: '/backstage',
        history: memoryHistory,
      });

      memoryController.navigate('/catalog');
      expect(memoryHistory.getLocation().pathname).toBe('/backstage/catalog');

      const locations: string[] = [];
      memoryController.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/catalog');
    });
  });

  it('should accept an explicit window history backend', () => {
    controller.dispose();
    controller = createNavigationController({
      history: createWindowHistoryBackend(),
    });
    controller.navigate('/explicit-window');
    expect(window.location.pathname).toBe('/explicit-window');
  });

  it('should emit location on navigate', () => {
    const locations: string[] = [];
    const sub = controller.location$.subscribe(loc =>
      locations.push(loc.pathname),
    );
    controller.navigate('/catalog');
    expect(locations).toContain('/catalog');
    sub.unsubscribe();
  });

  it('should mark subscription as closed after unsubscribe', () => {
    const sub = controller.location$.subscribe(() => {});
    expect(sub.closed).toBe(false);
    sub.unsubscribe();
    expect(sub.closed).toBe(true);
  });

  it('should create a scoped contract', () => {
    controller.navigate('/catalog/entity/foo?filter=active#details');
    const contract = controller.createContract('/catalog');
    const locations: Array<{
      pathname: string;
      search: string;
      hash: string;
      state: unknown;
    }> = [];
    const sub = contract.location$.subscribe(loc => locations.push(loc));

    expect(contract.basePath).toBe('/catalog');
    expect(contract.routePattern).toBe('/catalog');
    expect(locations[locations.length - 1]).toEqual({
      pathname: '/entity/foo',
      search: '?filter=active',
      hash: '#details',
      state: undefined,
    });
    sub.unsubscribe();
  });

  it('should project basePath across concrete prefixes under the same routePattern', () => {
    const pattern = '/catalog/:namespace/:kind/:name';
    controller.navigate('/catalog/default/component/entity-a/overview');

    const contract = controller.createContract(
      '/catalog/default/component/entity-a',
      { routePattern: pattern },
    );

    expect(contract.routePattern).toBe(pattern);
    expect(contract.basePath).toBe('/catalog/default/component/entity-a');

    const locations: string[] = [];
    contract.location$.subscribe(loc => locations.push(loc.pathname));
    expect(locations[locations.length - 1]).toBe('/overview');

    controller.navigate('/catalog/default/component/entity-b/docs');

    // Same instance; concrete prefix and scoped location both update
    expect(contract.basePath).toBe('/catalog/default/component/entity-b');
    expect(locations[locations.length - 1]).toBe('/docs');

    contract.navigate('ci');
    expect(window.location.pathname).toBe(
      '/catalog/default/component/entity-b/ci',
    );
  });

  it('should keep subpage contracts projecting under a parent routePattern', () => {
    const parentPattern = '/catalog/:namespace/:kind/:name';
    controller.navigate('/catalog/default/component/entity-a/overview');

    const parent = controller.createContract(
      '/catalog/default/component/entity-a',
      { routePattern: parentPattern },
    );
    const child = controller.createContract(
      '/catalog/default/component/entity-a/overview',
      { routePattern: `${parentPattern}/overview` },
    );

    expect(child.basePath).toBe('/catalog/default/component/entity-a/overview');

    controller.navigate('/catalog/default/component/entity-b/overview');

    expect(parent.basePath).toBe('/catalog/default/component/entity-b');
    expect(child.basePath).toBe('/catalog/default/component/entity-b/overview');

    child.navigate('tab');
    expect(window.location.pathname).toBe(
      '/catalog/default/component/entity-b/overview/tab',
    );
  });

  it('should scope contract navigate to basePath', () => {
    const contract = controller.createContract('/catalog');
    contract.navigate('/entity/bar');
    expect(window.location.pathname).toBe('/catalog/entity/bar');
  });

  it('should join relative navigate targets without a leading slash', () => {
    const contract = controller.createContract('/catalog');
    contract.navigate('entity/bar');
    expect(window.location.pathname).toBe('/catalog/entity/bar');
  });

  it('should warn with actionable message and ignore contract navigate outside basePath', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const contract = controller.createContract('/catalog');
    const before = window.location.pathname;

    contract.navigate('/../../scaffolder');
    expect(window.location.pathname).toBe(before);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('navigationControllerApiRef'),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('framework navigation'),
    );
    warnSpy.mockRestore();
  });

  it('should preserve state through navigate and location$', () => {
    const state = { from: '/login', returnTo: '/dashboard' };
    controller.navigate('/catalog/entity/foo', { state });

    const locations: Array<{ state: unknown }> = [];
    const sub = controller.location$.subscribe(loc =>
      locations.push({ state: loc.state }),
    );

    expect(locations[locations.length - 1].state).toEqual(state);
    sub.unsubscribe();
  });

  it('should pass state through scoped contract navigate', () => {
    const contract = controller.createContract('/catalog');
    const state = { wizardStep: 2 };
    contract.navigate('/entity/bar', { state });

    expect(window.history.state).toMatchObject({
      __backstageHistoryEnvelope: true,
      state,
    });
    expect(controller.getAdapterState('tanstack-router')).toBeUndefined();
  });

  it('should keep adapterState out of FrameworkLocation.state', () => {
    const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
    const memoryController = createNavigationController({ history });
    const userState = { wizardStep: 2 };
    const adapterMeta = { __TSR_key: 'k1', __TSR_index: 1 };

    memoryController.navigate('/catalog/entity/foo', {
      state: userState,
      adapterState: { 'tanstack-router': adapterMeta },
    });

    const locations: FrameworkLocation[] = [];
    const sub = memoryController.location$.subscribe(loc =>
      locations.push(loc),
    );

    expect(locations[locations.length - 1].state).toEqual(userState);
    expect(locations[locations.length - 1].state).not.toHaveProperty(
      'tanstack-router',
    );
    expect(memoryController.getAdapterState('tanstack-router')).toEqual(
      adapterMeta,
    );
    expect(memoryController.getAdapterState('other-adapter')).toBeUndefined();
    sub.unsubscribe();
    memoryController.dispose();
  });

  it('should isolate adapter namespaces and preserve them across go()', () => {
    const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
    const memoryController = createNavigationController({ history });

    memoryController.navigate('/a', {
      adapterState: { 'tanstack-router': { key: 'a' } },
    });
    memoryController.navigate('/b', {
      state: { user: true },
      adapterState: {
        'tanstack-router': { key: 'b' },
        'other-adapter': { n: 1 },
      },
    });

    expect(memoryController.getAdapterState('tanstack-router')).toEqual({
      key: 'b',
    });
    expect(memoryController.getAdapterState('other-adapter')).toEqual({ n: 1 });

    memoryController.go(-1);

    expect(memoryController.getAdapterState('tanstack-router')).toEqual({
      key: 'a',
    });
    expect(memoryController.getAdapterState('other-adapter')).toBeUndefined();

    const locations: FrameworkLocation[] = [];
    memoryController.location$.subscribe(loc => locations.push(loc));
    expect(locations[locations.length - 1].state).toBeUndefined();
    memoryController.dispose();
  });

  it('should not leak adapter meta into state on external navigate without adapterState', () => {
    const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
    const memoryController = createNavigationController({ history });

    memoryController.navigate('/with-meta', {
      state: { keep: true },
      adapterState: { 'tanstack-router': { key: 'x' } },
    });
    memoryController.navigate('/external-chrome');

    const locations: FrameworkLocation[] = [];
    memoryController.location$.subscribe(loc => locations.push(loc));

    expect(locations[locations.length - 1]).toEqual({
      pathname: '/external-chrome',
      search: '',
      hash: '',
      state: undefined,
    });
    expect(memoryController.getAdapterState('tanstack-router')).toBeUndefined();
    memoryController.dispose();
  });

  it('should restore location and adapterState on back/forward after external navigate', () => {
    const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
    const memoryController = createNavigationController({ history });
    const adapterMeta = { key: 'scoped' };

    memoryController.navigate('/plugin/page', {
      state: { user: 1 },
      adapterState: { 'tanstack-router': adapterMeta },
    });
    // Chrome / out-of-scope hop with no adapterState must not leak prior meta.
    memoryController.navigate('/external-chrome');

    expect(memoryController.canGoBack()).toBe(true);
    expect(memoryController.canGoForward()).toBe(false);
    expect(memoryController.getAdapterState('tanstack-router')).toBeUndefined();
    expect(history.getLocation().state).toBeUndefined();

    memoryController.go(-1);

    expect(history.getLocation()).toEqual({
      pathname: '/plugin/page',
      search: '',
      hash: '',
      state: { user: 1 },
    });
    expect(history.getLocation().state).not.toHaveProperty('tanstack-router');
    expect(memoryController.getAdapterState('tanstack-router')).toEqual(
      adapterMeta,
    );
    expect(memoryController.canGoBack()).toBe(true);
    expect(memoryController.canGoForward()).toBe(true);

    memoryController.go(1);

    expect(history.getLocation().pathname).toBe('/external-chrome');
    expect(history.getLocation().state).toBeUndefined();
    expect(memoryController.getAdapterState('tanstack-router')).toBeUndefined();
    expect(memoryController.canGoBack()).toBe(true);
    expect(memoryController.canGoForward()).toBe(false);

    memoryController.dispose();
  });

  it('should expose canGoBack, canGoForward, and historyLength on controller and contract', () => {
    const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
    const memoryController = createNavigationController({ history });
    const contract = memoryController.createContract('/');

    expect(memoryController.canGoBack()).toBe(false);
    expect(memoryController.canGoForward()).toBe(false);
    expect(memoryController.historyLength).toBe(1);
    expect(contract.canGoBack()).toBe(false);
    expect(contract.historyLength).toBe(1);

    memoryController.navigate('/a');
    memoryController.navigate('/b');

    expect(memoryController.canGoBack()).toBe(true);
    expect(memoryController.canGoForward()).toBe(false);
    expect(memoryController.historyLength).toBe(3);
    expect(contract.canGoBack()).toBe(true);
    expect(contract.canGoForward()).toBe(false);
    expect(contract.historyLength).toBe(3);

    contract.go(-1);
    expect(history.getLocation().pathname).toBe('/a');
    expect(contract.canGoForward()).toBe(true);
    expect(memoryController.canGoForward()).toBe(true);

    memoryController.dispose();
  });

  it('should handle search-param-only navigation', () => {
    controller.navigate('/catalog/entities');
    const contract = controller.createContract('/catalog');
    contract.navigate('/entities?filter=active');
    expect(window.location.search).toBe('?filter=active');
  });

  it('should handle hash-only navigation', () => {
    controller.navigate('/catalog/entities');
    const contract = controller.createContract('/catalog');
    contract.navigate('/entities#section');
    expect(window.location.hash).toBe('#section');
  });

  it('should sync-emit last-in-scope or empty sentinel when currently out of scope', () => {
    controller.navigate('/catalog/entity/foo');
    const contract = controller.createContract('/catalog');

    controller.navigate('/scaffolder');

    const locations: Array<{ pathname: string }> = [];
    const sub = contract.location$.subscribe(loc => locations.push(loc));

    expect(locations).toHaveLength(1);
    expect(locations[0].pathname).toBe('/entity/foo');
    sub.unsubscribe();
  });

  it('should sync-emit empty sentinel when never in scope', () => {
    controller.navigate('/scaffolder');
    const contract = controller.createContract('/catalog');

    const locations: Array<{
      pathname: string;
      search: string;
      hash: string;
      state: unknown;
    }> = [];
    const sub = contract.location$.subscribe(loc => locations.push(loc));

    expect(locations).toEqual([
      { pathname: '/', search: '', hash: '', state: undefined },
    ]);
    sub.unsubscribe();
  });

  it('should not throw in useObservableAsState when subscribed out of scope', () => {
    controller.navigate('/scaffolder');
    const contract = controller.createContract('/catalog');

    function Probe() {
      const loc = useObservableAsState(contract.location$);
      return <div data-testid="path">{loc.pathname}</div>;
    }

    const { getByTestId } = render(<Probe />);
    expect(getByTestId('path')).toHaveTextContent('/');
  });

  it('should not emit to other contracts while they are out of scope', () => {
    const catalogContract = controller.createContract('/catalog');
    const scaffolderContract = controller.createContract('/scaffolder');
    const catalogLocs: string[] = [];
    const scaffolderLocs: string[] = [];
    catalogContract.location$.subscribe(l => catalogLocs.push(l.pathname));
    scaffolderContract.location$.subscribe(l =>
      scaffolderLocs.push(l.pathname),
    );

    const catalogBefore = catalogLocs.length;
    const scaffolderBefore = scaffolderLocs.length;

    controller.navigate('/catalog/entity/foo');
    expect(catalogLocs.slice(catalogBefore)).toEqual(['/entity/foo']);
    expect(scaffolderLocs.length).toBe(scaffolderBefore);
  });

  it('should handle dispose', () => {
    const sub = controller.location$.subscribe(() => {});
    controller.dispose();
    expect(sub.closed).toBe(false); // sub itself is not auto-closed
    // But no more emissions will occur from popstate
  });

  it('should not dispatch popstate on navigate (only emit directly)', () => {
    const popstateSpy = jest.fn();
    window.addEventListener('popstate', popstateSpy);
    controller.navigate('/catalog/foo');
    expect(popstateSpy).not.toHaveBeenCalled();
    window.removeEventListener('popstate', popstateSpy);
  });

  it('should emit exactly once per navigate call (no double-emission)', () => {
    const emissions: string[] = [];
    controller.location$.subscribe(loc => emissions.push(loc.pathname));
    const countBefore = emissions.length;

    controller.navigate('/catalog/foo');

    // Exactly one new emission (from direct this.emit()), not two
    expect(emissions.length - countBefore).toBe(1);
    expect(emissions[emissions.length - 1]).toBe('/catalog/foo');
  });

  it('should emit on popstate events (back/forward)', () => {
    controller.navigate('/catalog/foo');
    const locations: string[] = [];
    controller.location$.subscribe(loc => locations.push(loc.pathname));

    window.history.pushState(null, '', '/other/page');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(locations).toContain('/other/page');
  });

  it('should use replaceState when replace option is true', () => {
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    controller.navigate('/catalog/foo', { replace: true });
    expect(replaceSpy).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/catalog/foo');
    replaceSpy.mockRestore();
  });

  it('should forward replace option through contract navigate', () => {
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    const contract = controller.createContract('/catalog');
    contract.navigate('/entity/foo', { replace: true });
    expect(replaceSpy).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/catalog/entity/foo');
    replaceSpy.mockRestore();
  });

  it('should throw for absolute URLs', () => {
    expect(() => controller.navigate('https://evil.com/path')).toThrow(
      'does not support absolute or protocol-relative URLs',
    );
  });

  it('should throw for protocol-relative URLs', () => {
    expect(() => controller.navigate('//evil.com/path')).toThrow(
      'does not support absolute or protocol-relative URLs',
    );
  });

  it('should throw for protocol-relative contract navigate targets', () => {
    const contract = controller.createContract('/catalog');
    expect(() => contract.navigate('//evil.com/path')).toThrow(
      'does not support absolute or protocol-relative URLs',
    );
  });

  describe('blockers', () => {
    it('should block chrome/framework navigate and allow it again after unblock', async () => {
      const seen: Array<{ current: string; next: string }> = [];
      const unblock = controller.block(({ currentLocation, nextLocation }) => {
        seen.push({
          current: currentLocation.pathname,
          next: nextLocation.pathname,
        });
        return true;
      });

      controller.navigate('/blocked');
      await Promise.resolve();
      await Promise.resolve();

      expect(window.location.pathname).not.toBe('/blocked');
      expect(seen).toEqual([{ current: '/', next: '/blocked' }]);

      unblock();
      controller.navigate('/allowed');
      expect(window.location.pathname).toBe('/allowed');
    });

    it('should block navigation initiated through a scoped contract with the same shared blocker', async () => {
      let blockerCalls = 0;
      const unblock = controller.block(() => {
        blockerCalls += 1;
        return true;
      });
      const contract = controller.createContract('/catalog');

      contract.navigate('/entity/bar');
      await Promise.resolve();
      await Promise.resolve();

      expect(window.location.pathname).toBe('/');
      expect(blockerCalls).toBe(1);

      unblock();
      contract.navigate('/entity/bar');
      expect(window.location.pathname).toBe('/catalog/entity/bar');
    });

    it('should not run blockers for go()', async () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
      const memoryController = createNavigationController({ history });
      memoryController.navigate('/a');
      memoryController.navigate('/b');
      let calls = 0;
      memoryController.block(() => {
        calls += 1;
        return true;
      });

      memoryController.go(-1);

      expect(calls).toBe(0);
      expect(history.getLocation().pathname).toBe('/a');
      memoryController.dispose();
    });

    it('should strip basename from blocker transition locations', async () => {
      window.history.replaceState(null, '', '/backstage/catalog');
      const bnController = createNavigationController({
        basename: '/backstage',
      });
      const seen: Array<{ current: string; next: string }> = [];
      bnController.block(({ currentLocation, nextLocation }) => {
        seen.push({
          current: currentLocation.pathname,
          next: nextLocation.pathname,
        });
        return false;
      });

      bnController.navigate('/scaffolder');
      await Promise.resolve();
      await Promise.resolve();

      expect(seen).toEqual([{ current: '/catalog', next: '/scaffolder' }]);
      expect(window.location.pathname).toBe('/backstage/scaffolder');
      bnController.dispose();
    });
  });

  it('should not emit after dispose', () => {
    const emissions: string[] = [];
    controller.location$.subscribe(loc => emissions.push(loc.pathname));
    const countAfterSubscribe = emissions.length;
    controller.dispose();
    window.history.pushState(null, '', '/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(emissions.length).toBe(countAfterSubscribe);
  });

  it('should support observer object with next method', () => {
    const locations: string[] = [];
    const sub = controller.location$.subscribe({
      next: loc => locations.push(loc.pathname),
    });
    controller.navigate('/test');
    expect(locations).toContain('/test');
    sub.unsubscribe();
  });

  it('should handle subscriber adding new subscriber during emit', () => {
    const results: string[] = [];
    const sub = controller.location$.subscribe(loc => {
      results.push(`first:${loc.pathname}`);
      controller.location$.subscribe(l => results.push(`nested:${l.pathname}`));
    });
    controller.navigate('/test');
    expect(results.filter(r => r.startsWith('first:')).length).toBe(2);
    sub.unsubscribe();
  });

  it('should handle root basePath', () => {
    controller.navigate('/anything/here');
    const contract = controller.createContract('/');
    const locations: string[] = [];
    contract.location$.subscribe(l => locations.push(l.pathname));
    expect(locations).toContain('/anything/here');
  });

  describe('with basename', () => {
    let bnController: NavigationController;

    beforeEach(() => {
      window.history.replaceState(null, '', '/backstage');
      bnController = createNavigationController({ basename: '/backstage' });
    });

    afterEach(() => {
      bnController.dispose();
    });

    it('should prepend basename on navigate', () => {
      bnController.navigate('/catalog/entity/foo');
      expect(window.location.pathname).toBe('/backstage/catalog/entity/foo');
    });

    it('should strip basename from location$ emissions', () => {
      bnController.navigate('/catalog/entity/foo');
      const locations: string[] = [];
      bnController.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/catalog/entity/foo');
    });

    it('should strip basename from contract location$', () => {
      bnController.navigate('/catalog/entity/foo');
      const contract = bnController.createContract('/catalog');
      const locations: string[] = [];
      contract.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/entity/foo');
    });

    it('should not strip a path that only shares a basename prefix', () => {
      window.history.replaceState(null, '', '/backstage-extra/page');
      const locations: string[] = [];
      bnController.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/backstage-extra/page');
      expect(locations).not.toContain('-extra/page');
    });
  });
});
