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
  });
});
