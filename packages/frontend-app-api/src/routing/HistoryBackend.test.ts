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

import {
  createMemoryHistoryBackend,
  createWindowHistoryBackend,
} from './HistoryBackend';

describe('HistoryBackend', () => {
  describe('createMemoryHistoryBackend', () => {
    it('should start at the last initial entry by default', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b'],
      });
      expect(history.getLocation().pathname).toBe('/b');
    });

    it('should honor initialIndex', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b', '/c'],
        initialIndex: 0,
      });
      expect(history.getLocation().pathname).toBe('/a');
    });

    it('should push and replace without notifying listen subscribers', () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
      const listener = jest.fn();
      history.listen(listener);

      history.push('/pushed', { state: { n: 1 } });
      history.replace('/replaced', { state: { n: 2 } });

      expect(listener).not.toHaveBeenCalled();
      expect(history.getLocation()).toEqual({
        pathname: '/replaced',
        search: '',
        hash: '',
        state: { n: 2 },
      });
    });

    it('should keep adapterState out of getLocation().state', () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/'] });
      history.push('/with-meta', {
        state: { user: true },
        adapterState: { 'tanstack-router': { key: 'k' } },
      });

      expect(history.getLocation().state).toEqual({ user: true });
      expect(history.getAdapterState('tanstack-router')).toEqual({ key: 'k' });
      expect(history.getAdapterState('other')).toBeUndefined();
    });

    it('should report canGoBack, canGoForward, and length', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b'],
      });
      expect(history.length).toBe(2);
      expect(history.canGoBack()).toBe(true);
      expect(history.canGoForward()).toBe(false);

      history.go(-1);
      expect(history.canGoBack()).toBe(false);
      expect(history.canGoForward()).toBe(true);
    });

    it('should notify listen subscribers on go()', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b'],
      });
      const listener = jest.fn();
      history.listen(listener);

      history.go(-1);

      expect(listener).toHaveBeenCalledTimes(1);
      expect(history.getLocation().pathname).toBe('/a');
    });

    it('should truncate forward entries on push after go back', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b', '/c'],
      });
      history.go(-2);
      history.push('/d');

      expect(history.getLocation().pathname).toBe('/d');
      history.go(-1);
      expect(history.getLocation().pathname).toBe('/a');
      history.go(1);
      expect(history.getLocation().pathname).toBe('/d');
    });

    it('should parse search and hash from entries', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/path?q=1#hash'],
      });
      expect(history.getLocation()).toEqual({
        pathname: '/path',
        search: '?q=1',
        hash: '#hash',
        state: undefined,
      });
    });

    it('should block push/replace and let the blocker see the pending transition', async () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/a'] });
      const seen: Array<{ current: string; next: string; action: string }> = [];
      const unblock = history.block(
        ({ currentLocation, nextLocation, action }) => {
          seen.push({
            current: currentLocation.pathname,
            next: nextLocation.pathname,
            action,
          });
          return true;
        },
      );

      const pushResult = history.push('/b');
      expect(pushResult).toBe(false);
      await Promise.resolve();
      await Promise.resolve();

      expect(history.getLocation().pathname).toBe('/a');
      expect(seen).toEqual([{ current: '/a', next: '/b', action: 'PUSH' }]);

      unblock();
      const allowed = history.push('/c');
      expect(allowed).toBe(true);
      expect(history.getLocation().pathname).toBe('/c');
    });

    it('should perform the write and notify listeners once an async blocker allows it', async () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/a'] });
      const listener = jest.fn();
      history.listen(listener);
      history.block(async () => false);

      const result = history.replace('/replaced');
      expect(result).toBe(false);
      expect(history.getLocation().pathname).toBe('/a');
      expect(listener).not.toHaveBeenCalled();

      await Promise.resolve();
      await Promise.resolve();

      expect(history.getLocation().pathname).toBe('/replaced');
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not run blockers for go()', async () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b'],
      });
      let calls = 0;
      history.block(() => {
        calls += 1;
        return true;
      });

      history.go(-1);
      await Promise.resolve();
      await Promise.resolve();

      expect(calls).toBe(0);
      expect(history.getLocation().pathname).toBe('/a');
    });

    it('should stop at the first blocker that returns true', async () => {
      const history = createMemoryHistoryBackend({ initialEntries: ['/a'] });
      const calls: string[] = [];
      history.block(() => {
        calls.push('first');
        return false;
      });
      history.block(() => {
        calls.push('second');
        return true;
      });
      history.block(() => {
        calls.push('third');
        return true;
      });

      history.push('/b');
      await Promise.resolve();
      await Promise.resolve();

      expect(calls).toEqual(['first', 'second']);
      expect(history.getLocation().pathname).toBe('/a');
    });
  });

  describe('createWindowHistoryBackend', () => {
    afterEach(() => {
      window.history.replaceState(null, '', '/');
    });

    it('should read and write window.history', () => {
      const history = createWindowHistoryBackend();
      history.push('/window-path', { state: { from: 'test' } });

      expect(window.location.pathname).toBe('/window-path');
      expect(history.getLocation()).toEqual({
        pathname: '/window-path',
        search: '',
        hash: '',
        state: { from: 'test' },
      });
      expect(window.history.state).toMatchObject({
        __backstageHistoryEnvelope: true,
        state: { from: 'test' },
      });

      history.dispose();
    });

    it('should unpack legacy history.state as user state', () => {
      window.history.replaceState({ legacy: true }, '', '/legacy');
      const history = createWindowHistoryBackend();

      expect(history.getLocation().state).toEqual({ legacy: true });
      expect(history.getAdapterState('tanstack-router')).toBeUndefined();
      history.dispose();
    });

    it('should notify on popstate', () => {
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      history.listen(listener);

      window.history.pushState(null, '', '/popped');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).toHaveBeenCalledTimes(1);
      history.dispose();
    });

    it('should go via window.history.go', () => {
      const history = createWindowHistoryBackend();
      const goSpy = jest.spyOn(window.history, 'go');

      history.go(-1);

      expect(goSpy).toHaveBeenCalledWith(-1);
      goSpy.mockRestore();
      history.dispose();
    });

    it('should block push/replace until an async blocker resolves, then notify listeners', async () => {
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      history.listen(listener);
      let allow = false;
      history.block(() => !allow);

      const pushResult = history.push('/blocked');
      expect(pushResult).toBe(false);
      await Promise.resolve();
      await Promise.resolve();

      expect(window.location.pathname).toBe('/');
      expect(listener).not.toHaveBeenCalled();

      allow = true;
      const secondResult = history.push('/allowed');
      await Promise.resolve();
      await Promise.resolve();

      expect(window.location.pathname).toBe('/allowed');
      expect(listener).toHaveBeenCalledTimes(1);
      expect(secondResult).toBe(false);

      history.dispose();
    });

    it('should stop blocking after unblock and never gate go()', async () => {
      const history = createWindowHistoryBackend();
      let calls = 0;
      const unblock = history.block(() => {
        calls += 1;
        return true;
      });

      history.push('/still-blocked');
      await Promise.resolve();
      await Promise.resolve();
      expect(window.location.pathname).toBe('/');
      expect(calls).toBe(1);

      unblock();
      const allowed = history.push('/now-allowed');
      expect(allowed).toBe(true);
      expect(window.location.pathname).toBe('/now-allowed');
      expect(calls).toBe(1);

      history.go(-1);
      expect(calls).toBe(1);

      history.dispose();
    });

    it('should report canGoForward false at the stack tip', () => {
      const history = createWindowHistoryBackend();
      history.listen(() => {});

      expect(history.canGoBack()).toBe(false);
      expect(history.canGoForward()).toBe(false);

      history.push('/a');
      history.push('/b');

      expect(history.canGoBack()).toBe(true);
      expect(history.canGoForward()).toBe(false);
      expect(window.history.state).toMatchObject({
        __backstageHistoryEnvelope: true,
        index: 2,
      });

      history.dispose();
    });

    it('should track canGoBack and canGoForward from envelope index', () => {
      const history = createWindowHistoryBackend();
      history.listen(() => {});

      history.push('/a');
      history.push('/b');

      // Simulate browser back: restore the previous envelope and fire popstate.
      window.history.replaceState(
        {
          __backstageHistoryEnvelope: true,
          index: 1,
        },
        '',
        '/a',
      );
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(history.getLocation().pathname).toBe('/a');
      expect(history.canGoBack()).toBe(true);
      expect(history.canGoForward()).toBe(true);

      history.push('/c');
      expect(history.canGoBack()).toBe(true);
      expect(history.canGoForward()).toBe(false);

      history.dispose();
    });
  });
});
