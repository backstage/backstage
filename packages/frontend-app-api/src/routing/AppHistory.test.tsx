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
import { createAppHistory, type AppHistory } from './AppHistory';

describe('AppHistory', () => {
  let history: AppHistory;

  beforeEach(() => {
    window.history.replaceState(null, '', '/');
    history = createAppHistory();
  });

  afterEach(() => {
    history.dispose();
  });

  it('should navigate by updating window.history', () => {
    history.navigate('/catalog/entity/foo');
    expect(window.location.pathname).toBe('/catalog/entity/foo');
  });

  describe('with memory history backend', () => {
    let memoryHistory: AppHistory;
    let memoryBackend: ReturnType<typeof createMemoryHistoryBackend>;

    beforeEach(() => {
      memoryBackend = createMemoryHistoryBackend({
        initialEntries: ['/start'],
      });
      memoryHistory = createAppHistory({ history: memoryBackend });
    });

    afterEach(() => {
      memoryHistory.dispose();
    });

    it('should use the initial memory entry without touching window.history', () => {
      const windowBefore = window.location.pathname;
      const locations: string[] = [];
      memoryHistory.location$.subscribe(loc => locations.push(loc.pathname));

      expect(locations[0]).toBe('/start');
      expect(window.location.pathname).toBe(windowBefore);
    });

    it('should navigate programmatically through memory history', () => {
      const windowBefore = window.location.pathname;
      memoryHistory.navigate('/catalog/entity/foo');

      const locations: string[] = [];
      memoryHistory.location$.subscribe(loc => locations.push(loc.pathname));

      expect(locations[locations.length - 1]).toBe('/catalog/entity/foo');
      expect(memoryBackend.getLocation().pathname).toBe('/catalog/entity/foo');
      expect(window.location.pathname).toBe(windowBefore);
    });

    it('should apply basename with memory history', () => {
      memoryHistory.dispose();
      memoryBackend = createMemoryHistoryBackend({
        initialEntries: ['/backstage'],
      });
      memoryHistory = createAppHistory({
        basename: '/backstage',
        history: memoryBackend,
      });

      memoryHistory.navigate('/catalog');
      expect(memoryBackend.getLocation().pathname).toBe('/backstage/catalog');

      const locations: string[] = [];
      memoryHistory.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/catalog');
    });
  });

  it('should accept an explicit window history backend', () => {
    history.dispose();
    history = createAppHistory({
      history: createWindowHistoryBackend(),
    });
    history.navigate('/explicit-window');
    expect(window.location.pathname).toBe('/explicit-window');
  });

  it('should emit location on navigate', () => {
    const locations: string[] = [];
    const sub = history.location$.subscribe(loc =>
      locations.push(loc.pathname),
    );
    history.navigate('/catalog');
    expect(locations).toContain('/catalog');
    sub.unsubscribe();
  });

  it('should mark subscription as closed after unsubscribe', () => {
    const sub = history.location$.subscribe(() => {});
    expect(sub.closed).toBe(false);
    sub.unsubscribe();
    expect(sub.closed).toBe(true);
  });

  it('should preserve state through navigate and location$', () => {
    const state = { from: '/login', returnTo: '/dashboard' };
    history.navigate('/catalog/entity/foo', { state });

    const locations: Array<{ state: unknown }> = [];
    const sub = history.location$.subscribe(loc =>
      locations.push({ state: loc.state }),
    );

    expect(locations[locations.length - 1].state).toEqual(state);
    sub.unsubscribe();
  });

  it('should handle dispose', () => {
    const sub = history.location$.subscribe(() => {});
    history.dispose();
    expect(sub.closed).toBe(false); // sub itself is not auto-closed
    // But no more emissions will occur from popstate
  });

  it('should not dispatch popstate on navigate (only emit directly)', () => {
    const popstateSpy = jest.fn();
    window.addEventListener('popstate', popstateSpy);
    history.navigate('/catalog/foo');
    expect(popstateSpy).not.toHaveBeenCalled();
    window.removeEventListener('popstate', popstateSpy);
  });

  it('should emit exactly once per navigate call (no double-emission)', () => {
    const emissions: string[] = [];
    history.location$.subscribe(loc => emissions.push(loc.pathname));
    const countBefore = emissions.length;

    history.navigate('/catalog/foo');

    // Exactly one new emission (from direct this.emit()), not two
    expect(emissions.length - countBefore).toBe(1);
    expect(emissions[emissions.length - 1]).toBe('/catalog/foo');
  });

  it('should emit on popstate events (back/forward)', () => {
    history.navigate('/catalog/foo');
    const locations: string[] = [];
    history.location$.subscribe(loc => locations.push(loc.pathname));

    window.history.pushState(null, '', '/other/page');
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(locations).toContain('/other/page');
  });

  it('should use replaceState when replace option is true', () => {
    const replaceSpy = jest.spyOn(window.history, 'replaceState');
    history.navigate('/catalog/foo', { replace: true });
    expect(replaceSpy).toHaveBeenCalled();
    expect(window.location.pathname).toBe('/catalog/foo');
    replaceSpy.mockRestore();
  });

  it('should throw for absolute URLs', () => {
    expect(() => history.navigate('https://evil.com/path')).toThrow(
      'does not support absolute or protocol-relative URLs',
    );
  });

  it('should throw for protocol-relative URLs', () => {
    expect(() => history.navigate('//evil.com/path')).toThrow(
      'does not support absolute or protocol-relative URLs',
    );
  });

  it('should not emit after dispose', () => {
    const emissions: string[] = [];
    history.location$.subscribe(loc => emissions.push(loc.pathname));
    const countAfterSubscribe = emissions.length;
    history.dispose();
    window.history.pushState(null, '', '/new');
    window.dispatchEvent(new PopStateEvent('popstate'));
    expect(emissions.length).toBe(countAfterSubscribe);
  });

  it('should support observer object with next method', () => {
    const locations: string[] = [];
    const sub = history.location$.subscribe({
      next: loc => locations.push(loc.pathname),
    });
    history.navigate('/test');
    expect(locations).toContain('/test');
    sub.unsubscribe();
  });

  it('should handle subscriber adding new subscriber during emit', () => {
    const results: string[] = [];
    const sub = history.location$.subscribe(loc => {
      results.push(`first:${loc.pathname}`);
      history.location$.subscribe(l => results.push(`nested:${l.pathname}`));
    });
    history.navigate('/test');
    expect(results.filter(r => r.startsWith('first:')).length).toBe(2);
    sub.unsubscribe();
  });

  describe('createHref', () => {
    it('should return the path unchanged without a basename', () => {
      expect(history.createHref('/catalog/entity/foo')).toBe(
        '/catalog/entity/foo',
      );
    });
  });

  describe('with basename', () => {
    let bnHistory: AppHistory;

    beforeEach(() => {
      window.history.replaceState(null, '', '/backstage');
      bnHistory = createAppHistory({ basename: '/backstage' });
    });

    afterEach(() => {
      bnHistory.dispose();
    });

    it('should prepend basename on navigate', () => {
      bnHistory.navigate('/catalog/entity/foo');
      expect(window.location.pathname).toBe('/backstage/catalog/entity/foo');
    });

    it('should strip basename from location$ emissions', () => {
      bnHistory.navigate('/catalog/entity/foo');
      const locations: string[] = [];
      bnHistory.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/catalog/entity/foo');
    });

    it('should not strip a path that only shares a basename prefix', () => {
      window.history.replaceState(null, '', '/backstage-extra/page');
      const locations: string[] = [];
      bnHistory.location$.subscribe(l => locations.push(l.pathname));
      expect(locations).toContain('/backstage-extra/page');
      expect(locations).not.toContain('-extra/page');
    });

    it('should prepend basename in createHref', () => {
      expect(bnHistory.createHref('/catalog')).toBe('/backstage/catalog');
    });
  });
});
