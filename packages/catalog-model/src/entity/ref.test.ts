/*
 * Copyright 2020 The Backstage Authors
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

import { parseEntityRef } from './ref';

describe('ref', () => {
  describe('parseEntityRef', () => {
    it('handles some omissions', () => {
      expect(parseEntityRef('a:b/c')).toEqual({
        kind: 'a',
        namespace: 'b',
        name: 'c',
      });
      expect(parseEntityRef('a:c')).toEqual({
        kind: 'a',
        namespace: 'default',
        name: 'c',
      });
    });

    it('rejects bad inputs', () => {
      expect(() => parseEntityRef(null as any)).toThrow();
      expect(() => parseEntityRef(7 as any)).toThrow();
    });

    it('allows names with : and /', () => {
      expect(
        parseEntityRef('a:b:c', { defaultKind: 'k', defaultNamespace: 'ns' }),
      ).toEqual({ kind: 'a', namespace: 'ns', name: 'b:c' });
      expect(
        parseEntityRef('a/b/c', { defaultKind: 'k', defaultNamespace: 'ns' }),
      ).toEqual({ kind: 'k', namespace: 'a', name: 'b/c' });
      expect(
        parseEntityRef('a/b:c', { defaultKind: 'k', defaultNamespace: 'ns' }),
      ).toEqual({ kind: 'k', namespace: 'a', name: 'b:c' });
      expect(
        parseEntityRef('a:b/c/d', { defaultKind: 'k', defaultNamespace: 'ns' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c/d' });
      expect(
        parseEntityRef('a:b/c:d', { defaultKind: 'k', defaultNamespace: 'ns' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c:d' });
    });

    it('rejects empty parts in strings', () => {
      // one is empty
      expect(() => parseEntityRef(':b/c')).toThrow();
      expect(() => parseEntityRef('a:/c')).toThrow();
      expect(() => parseEntityRef('a:b/')).toThrow();
      // two are empty
      expect(() => parseEntityRef('a:/')).toThrow();
      expect(() => parseEntityRef(':b/')).toThrow();
      expect(() => parseEntityRef(':/c')).toThrow();
      // three are empty
      expect(() => parseEntityRef(':/')).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef('/c')).toThrow();
      expect(() => parseEntityRef('b/')).toThrow();
      expect(() => parseEntityRef(':c')).toThrow();
      expect(() => parseEntityRef('a:')).toThrow();
      // nothing at all
      expect(() => parseEntityRef('')).toThrow();
    });

    it('rejects empty parts in compounds', () => {
      // one is empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: 'b', name: '' }),
      ).toThrow();
      // two are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: '' }),
      ).toThrow();
      // three are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: '' }),
      ).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef({ namespace: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ namespace: 'b', name: '' })).toThrow();
      expect(() => parseEntityRef({ kind: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ kind: 'a', name: '' })).toThrow();
      // nothing at all
      expect(() => parseEntityRef({} as any)).toThrow();
    });

    it('adds defaults where necessary to strings', () => {
      expect(
        parseEntityRef('a:b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('a:c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef('c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
    });

    it('adds defaults where necessary to compounds', () => {
      expect(
        parseEntityRef(
          { kind: 'a', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { kind: 'a', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef(
          { name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      // empty strings are errors, not defaults
      expect(() =>
        parseEntityRef(
          { kind: '', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/kind/);
      expect(() =>
        parseEntityRef(
          { kind: 'a', namespace: '', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/namespace/);
    });
  });
});
