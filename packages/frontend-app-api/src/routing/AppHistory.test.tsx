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

  it('should expose a referentially stable current location', () => {
    // The accessor backs useSyncExternalStore's getSnapshot, which loops
    // forever if repeated reads return different references.
    expect(history.location).toEqual({
      pathname: '/',
      search: '',
      hash: '',
      state: undefined,
    });
    expect(history.location).toBe(history.location);

    const before = history.location;
    history.navigate('/catalog?kind=component#top');

    expect(history.location).not.toBe(before);
    expect(history.location).toEqual({
      pathname: '/catalog',
      search: '?kind=component',
      hash: '#top',
      state: undefined,
    });

    // A redundant navigation must not mint a new reference, otherwise every
    // subscriber re-renders for a location that did not change.
    const unchanged = history.location;
    history.navigate('/catalog?kind=component#top');
    expect(history.location).toBe(unchanged);

    // Subscribers observe exactly what the accessor reports.
    const seen: unknown[] = [];
    const sub = history.location$.subscribe(loc => seen.push(loc));
    expect(seen[0]).toBe(history.location);
    history.navigate('/other');
    expect(seen[1]).toBe(history.location);
    sub.unsubscribe();
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

  it('should throw for absolute and protocol-relative URLs, but not for URLs inside the query or hash', () => {
    const rejected = 'does not support absolute or protocol-relative URLs';
    expect(() => history.navigate('https://evil.com/path')).toThrow(rejected);
    expect(() => history.navigate('//evil.com/path')).toThrow(rejected);
    expect(() => history.navigate('mailto:x@y.z')).toThrow(rejected);

    // Only the path may carry a scheme. A query string or fragment that
    // happens to contain a URL is an ordinary app-relative target - links
    // such as /search?query=<url> are a common pattern.
    history.navigate('/search?query=https://example.com');
    expect(window.location.pathname).toBe('/search');
    expect(window.location.search).toBe('?query=https://example.com');

    history.navigate('/x#see-https://y');
    expect(window.location.pathname).toBe('/x');
    expect(window.location.hash).toBe('#see-https://y');

    history.navigate('/a?b=//c');
    expect(window.location.pathname).toBe('/a');
    expect(window.location.search).toBe('?b=//c');
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

  it('should release its popstate listener on dispose', () => {
    // Each instance attaches exactly one listener to the window, and dispose
    // is the only thing that takes it back off again - repeated app creation
    // (tests, HMR) leaks a listener for every instance left undisposed.
    const addSpy = jest.spyOn(window, 'addEventListener');
    const removeSpy = jest.spyOn(window, 'removeEventListener');

    const instances = [createAppHistory(), createAppHistory()];
    const added = addSpy.mock.calls.filter(([type]) => type === 'popstate');
    expect(added).toHaveLength(2);

    for (const instance of instances) {
      instance.dispose();
      instance.dispose(); // dispose is idempotent
    }

    const removed = removeSpy.mock.calls.filter(
      ([type]) => type === 'popstate',
    );
    expect(removed.map(([, listener]) => listener)).toEqual(
      added.map(([, listener]) => listener),
    );

    addSpy.mockRestore();
    removeSpy.mockRestore();
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

    it('should resolve a target against the page it was written in', () => {
      // The seam the whole new frontend system resolves links through: the
      // caller passes the mount of the page the target is written in, and this
      // is the single place that turns the two into a browser URL. Chrome and
      // page content therefore cannot disagree about what a target means.
      const basePath = '/catalog/foo';

      expect(history.createHref('widgets', { basePath })).toBe(
        '/catalog/foo/widgets',
      );
      expect(history.createHref('./widgets', { basePath })).toBe(
        '/catalog/foo/widgets',
      );
      // Absolute targets need no base and are unaffected by one.
      expect(history.createHref('/other', { basePath })).toBe('/other');
      // Each `..` climbs one segment of the mount, which is what makes a
      // sub-page's `../sibling` reach the sibling rather than the app root.
      expect(history.createHref('..', { basePath })).toBe('/catalog');
      expect(history.createHref('../bar', { basePath })).toBe('/catalog/bar');
      expect(history.createHref('../../..', { basePath })).toBe('/');
      // A trailing slash the target asked for survives.
      expect(history.createHref('widgets/', { basePath })).toBe(
        '/catalog/foo/widgets/',
      );
      // Not app-relative, so the base is irrelevant.
      expect(history.createHref('https://example.com/x', { basePath })).toBe(
        'https://example.com/x',
      );
      // No base at all means the app root, which is the pre-existing contract
      // for a caller that already holds an app-absolute path.
      expect(history.createHref('widgets')).toBe('/widgets');
      expect(history.createHref('widgets', {})).toBe('/widgets');
    });

    it('should keep a target with no pathname of its own at the current location', () => {
      window.history.replaceState(null, '', '/catalog/foo/docs?a=1');

      // Resolved against where the app is standing rather than against the
      // page base, so a fragment link written inside a page stays on the page
      // the reader is actually on.
      expect(history.createHref('#section', { basePath: '/catalog/foo' })).toBe(
        '/catalog/foo/docs#section',
      );
      expect(
        history.createHref('?tab=readme', { basePath: '/catalog/foo' }),
      ).toBe('/catalog/foo/docs?tab=readme');

      history.navigate('/catalog/bar/docs');
      expect(history.createHref('#section', { basePath: '/catalog/bar' })).toBe(
        '/catalog/bar/docs#section',
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

    it('should prepend basename in createHref, but pass through targets that are not app-relative', () => {
      expect(bnHistory.createHref('/catalog')).toBe('/backstage/catalog');
      expect(bnHistory.createHref('/search?query=https://example.com')).toBe(
        '/backstage/search?query=https://example.com',
      );

      // Prefixing these would silently turn an external link into a broken
      // internal one, and createHref runs during render where throwing is not
      // an option - so they are returned untouched.
      expect(bnHistory.createHref('https://example.com/evil')).toBe(
        'https://example.com/evil',
      );
      expect(bnHistory.createHref('//example.com/evil')).toBe(
        '//example.com/evil',
      );
      expect(bnHistory.createHref('mailto:support@example.com')).toBe(
        'mailto:support@example.com',
      );
      expect(bnHistory.createHref('tel:+15551234')).toBe('tel:+15551234');
    });
  });
});
