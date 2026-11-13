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

    it('should ignore go() past the ends of the stack', () => {
      const history = createMemoryHistoryBackend({
        initialEntries: ['/a', '/b'],
      });
      const listener = jest.fn();
      history.listen(listener);

      history.go(5);

      expect(listener).not.toHaveBeenCalled();
      expect(history.getLocation().pathname).toBe('/b');
    });
  });

  describe('createWindowHistoryBackend', () => {
    it('uses browser navigation for external targets and honors replace', () => {
      const history = createWindowHistoryBackend();
      const initialLength = window.history.length;
      history.navigateExternal(`${window.location.origin}/#external-push`);
      expect(window.location.hash).toBe('#external-push');
      expect(window.history.length).toBe(initialLength + 1);
      history.navigateExternal(`${window.location.origin}/#external-replace`, {
        replace: true,
      });
      expect(window.location.hash).toBe('#external-replace');
      expect(window.history.length).toBe(initialLength + 1);
    });

    afterEach(() => {
      window.history.replaceState(null, '', '/');
      delete (window as unknown as { navigation?: unknown }).navigation;
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
    });

    it.each([false, true])(
      'preserves owned state shaped like legacy metadata with Navigation API %s',
      hasNavigationApi => {
        const navigation = Object.assign(new EventTarget(), {
          currentEntry: { key: 'native-key', index: 3 },
          canGoBack: true,
        });
        if (hasNavigationApi) {
          Object.defineProperty(window, 'navigation', {
            configurable: true,
            value: navigation,
          });
        }
        window.history.replaceState(
          { usr: { from: '/catalog' }, key: 'legacy', idx: 1 },
          '',
          '/initial',
        );
        const history = createWindowHistoryBackend();
        expect(history.getLocation().state).toEqual({ from: '/catalog' });

        const state = {
          usr: { returnTo: '/catalog' },
          key: 'selection',
          idx: 0,
          other: 'retain-me',
        };
        history.push('/pushed', { state });
        expect(history.getLocation().state).toEqual(state);
        const pushedState = window.history.state;
        expect(createWindowHistoryBackend().getLocation().state).toEqual(state);

        const replacedState = { ...state, other: 'replaced' };
        history.replace('/replaced', { state: replacedState });
        expect(history.getLocation().state).toEqual(replacedState);
        expect(createWindowHistoryBackend().getLocation().state).toEqual(
          replacedState,
        );

        const listener = jest.fn();
        const unsubscribe = history.listen(listener);
        window.history.replaceState(pushedState, '', '/pushed');
        if (hasNavigationApi) {
          navigation.currentEntry = { key: 'pushed-key', index: 2 };
          navigation.dispatchEvent(new Event('currententrychange'));
        }
        window.dispatchEvent(new PopStateEvent('popstate'));
        expect(listener).toHaveBeenCalledTimes(1);
        expect(history.getLocation().state).toEqual(state);
        unsubscribe();
      },
    );

    it('imports React Router user state on initialization', () => {
      window.history.replaceState(
        { usr: { from: '/catalog' }, key: 'old', idx: 1 },
        '',
        '/legacy',
      );
      const history = createWindowHistoryBackend();
      expect(history.getLocation().state).toEqual({ from: '/catalog' });
    });

    it('imports React Router user state on back navigation', async () => {
      const history = createWindowHistoryBackend();
      window.history.pushState(
        { usr: { from: '/older' }, key: 'older', idx: 2 },
        '',
        '/older',
      );
      history.push('/new');
      const popped = new Promise<void>(resolve => {
        const onPop = () => {
          if (window.location.pathname === '/older') {
            window.removeEventListener('popstate', onPop);
            resolve();
          }
        };
        window.addEventListener('popstate', onPop);
      });
      const unsubscribe = history.listen(() => {});
      history.go(-1);
      await popped;
      expect(history.getLocation().state).toEqual({ from: '/older' });
      unsubscribe();
    });

    it('should read pre-existing window.history state', () => {
      window.history.replaceState({ legacy: true }, '', '/legacy');
      const history = createWindowHistoryBackend();

      expect(history.getLocation().state).toEqual({ legacy: true });
    });

    it('should notify on popstate', () => {
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      const unsubscribe = history.listen(listener);

      window.history.pushState(null, '', '/popped');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it('should use replaceState for replace()', () => {
      const history = createWindowHistoryBackend();
      const replaceSpy = jest.spyOn(window.history, 'replaceState');

      history.replace('/replaced-path', { state: { x: 1 } });

      expect(replaceSpy).toHaveBeenCalled();
      expect(window.location.pathname).toBe('/replaced-path');
      replaceSpy.mockRestore();
    });

    it('should unsubscribe each listener independently', () => {
      const history = createWindowHistoryBackend();
      const first = jest.fn();
      const second = jest.fn();
      const unsubscribeFirst = history.listen(first);
      const unsubscribeSecond = history.listen(second);

      // Owned writes advance every listener's baseline. The corresponding
      // browser event must not report the write as an external navigation.
      history.push('/owned');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(first).not.toHaveBeenCalled();
      expect(second).not.toHaveBeenCalled();

      unsubscribeFirst();
      unsubscribeFirst();

      window.history.pushState(null, '', '/after-unsubscribe');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);

      history.replace('/owned-replacement');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(second).toHaveBeenCalledTimes(1);

      unsubscribeSecond();
      window.history.pushState(null, '', '/after-both');
      window.dispatchEvent(new PopStateEvent('popstate'));
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });

    it('should expose stable entry metadata without leaking it as user state', () => {
      const history = createWindowHistoryBackend();
      const initial = history.getEntry();

      history.push('/next', { state: 'user-state' });
      const pushed = history.getEntry();

      expect(pushed.key).not.toBe(initial.key);
      expect(pushed.index).toBe(initial.index! + 1);
      expect(pushed.canGoBack).toBe(true);
      expect(history.getLocation().state).toBe('user-state');

      history.replace('/replaced', { state: { user: true } });
      expect(history.getEntry()).toEqual(pushed);
      expect(history.getLocation().state).toEqual({ user: true });
    });

    it('should seed a valid local index when an older browser stack is ambiguous', () => {
      window.history.pushState(null, '', '/older-a');
      window.history.pushState(null, '', '/older-b');

      const history = createWindowHistoryBackend();

      expect(history.getEntry()).toMatchObject({
        index: 0,
        length: 1,
        canGoBack: false,
      });

      history.push('/owned');
      const pushed = history.getEntry();
      expect(pushed).toMatchObject({ index: 1, length: 2, canGoBack: true });
      expect(pushed.index).toBeLessThan(pushed.length!);
    });

    it('should assign stable metadata to an unknown entry reached by traversal', () => {
      const history = createWindowHistoryBackend();
      const initial = history.getEntry();
      const listener = jest.fn();
      const unsubscribe = history.listen(listener);

      window.history.pushState({ outside: true }, '', '/outside');
      window.dispatchEvent(new PopStateEvent('popstate'));
      const unknown = history.getEntry();

      expect(unknown.key).not.toBe(initial.key);
      expect(unknown.index).toBeUndefined();
      expect(unknown.length).toBeUndefined();
      expect(unknown.canGoBack).toBeUndefined();
      expect(history.getLocation().state).toEqual({ outside: true });

      // Browsers can dispatch both events for one fragment traversal. The
      // metadata written above must not make the second event look new.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      expect(listener).toHaveBeenCalledTimes(1);
      expect(history.getEntry()).toEqual(unknown);
      history.replace('/page#replaced');
      expect(history.getEntry()).toEqual(unknown);
      history.push('/after-unknown');
      expect(history.getEntry()).toMatchObject({ canGoBack: true });
      expect(history.getEntry().index).toBeUndefined();
      expect(history.getEntry().length).toBeUndefined();

      unsubscribe();
    });

    it('should use Navigation API entry metadata and change events when available', () => {
      const navigation = new EventTarget() as EventTarget & {
        currentEntry: { key: string; index: number };
        canGoBack: boolean;
      };
      navigation.currentEntry = { key: 'native-key', index: 3 };
      navigation.canGoBack = true;
      Object.defineProperty(window, 'navigation', {
        configurable: true,
        value: navigation,
      });
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      const unsubscribe = history.listen(listener);

      expect(history.getEntry()).toEqual({
        key: 'native-key',
        index: 3,
        length: window.history.length,
        canGoBack: true,
      });

      navigation.currentEntry = { key: 'next-native-key', index: 4 };
      navigation.dispatchEvent(new Event('currententrychange'));
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it('should omit unknown coordinates for native hash navigation and restore them on back', async () => {
      window.history.replaceState(null, '', '/page');
      const history = createWindowHistoryBackend();
      const initial = history.getEntry();
      const unsubscribe = history.listen(jest.fn());
      const hashChanged = new Promise<void>(resolve => {
        const onHashChange = (event: HashChangeEvent) => {
          if (event.newURL.endsWith('/page#section')) {
            window.removeEventListener('hashchange', onHashChange);
            resolve();
          }
        };
        window.addEventListener('hashchange', onHashChange);
      });
      window.location.hash = '#section';
      await hashChanged;

      const unknown = history.getEntry();
      expect(unknown.key).not.toBe(initial.key);
      expect(unknown.index).toBeUndefined();
      expect(unknown.length).toBeUndefined();
      expect(unknown.canGoBack).toBeUndefined();
      expect(history.getEntry()).toEqual(unknown);

      const popped = new Promise(resolve =>
        window.addEventListener('popstate', resolve, { once: true }),
      );
      window.history.back();
      await popped;
      expect(history.getEntry()).toEqual(initial);
      expect(history.getLocation().hash).toBe('');
      unsubscribe();
    });
  });
});
