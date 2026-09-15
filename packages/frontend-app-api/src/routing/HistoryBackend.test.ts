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

      history.dispose();
    });

    it('should read pre-existing window.history state', () => {
      window.history.replaceState({ legacy: true }, '', '/legacy');
      const history = createWindowHistoryBackend();

      expect(history.getLocation().state).toEqual({ legacy: true });
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

    it('should use replaceState for replace()', () => {
      const history = createWindowHistoryBackend();
      const replaceSpy = jest.spyOn(window.history, 'replaceState');

      history.replace('/replaced-path', { state: { x: 1 } });

      expect(replaceSpy).toHaveBeenCalled();
      expect(window.location.pathname).toBe('/replaced-path');
      replaceSpy.mockRestore();
      history.dispose();
    });

    it('should stop notifying after dispose', () => {
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      history.listen(listener);
      history.dispose();

      window.history.pushState(null, '', '/after-dispose');
      window.dispatchEvent(new PopStateEvent('popstate'));

      expect(listener).not.toHaveBeenCalled();
    });

    it('should expose stable entry metadata without leaking it as user state', () => {
      const history = createWindowHistoryBackend();
      const initial = history.getEntry();

      history.push('/next', { state: 'user-state' });
      const pushed = history.getEntry();

      expect(pushed.key).not.toBe(initial.key);
      expect(pushed.index).toBe(initial.index + 1);
      expect(pushed.canGoBack).toBe(true);
      expect(history.getLocation().state).toBe('user-state');

      history.replace('/replaced', { state: { user: true } });
      expect(history.getEntry()).toEqual(pushed);
      expect(history.getLocation().state).toEqual({ user: true });
      history.dispose();
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
      expect(pushed.index).toBeLessThan(pushed.length);
      history.dispose();
    });

    it('should assign stable metadata to an unknown entry reached by traversal', () => {
      const history = createWindowHistoryBackend();
      const initial = history.getEntry();
      const listener = jest.fn();
      history.listen(listener);

      window.history.pushState({ outside: true }, '', '/outside');
      window.dispatchEvent(new PopStateEvent('popstate'));
      const unknown = history.getEntry();

      expect(unknown.key).not.toBe(initial.key);
      expect(unknown.index).toBeGreaterThanOrEqual(0);
      expect(unknown.index).toBeLessThan(unknown.length);
      expect(history.getLocation().state).toEqual({ outside: true });

      // Browsers can dispatch both events for one fragment traversal. The
      // metadata written above must not make the second event look new.
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      expect(listener).toHaveBeenCalledTimes(1);
      expect(history.getEntry()).toEqual(unknown);
      history.dispose();
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
      history.listen(listener);

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
      history.dispose();
    });

    it('should observe hash navigation when Navigation API is unavailable', () => {
      const history = createWindowHistoryBackend();
      const listener = jest.fn();
      history.listen(listener);

      window.history.pushState(null, '', '/page#section');
      window.dispatchEvent(new HashChangeEvent('hashchange'));

      expect(listener).toHaveBeenCalledTimes(1);
      history.dispose();
    });
  });
});
