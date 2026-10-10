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
import { ExtensionKind, parseFragment, renderFragment } from './navigation';

describe('navigation', () => {
  describe('renderFragment', () => {
    it('joins the kind and name with an underscore', () => {
      expect(renderFragment({ kind: 'filter', name: 'foo' })).toBe(
        'filter_foo',
      );
      expect(renderFragment({ kind: 'filter', name: 'my_custom_filter' })).toBe(
        'filter_my_custom_filter',
      );
    });
  });

  describe('parseFragment', () => {
    it('splits a fragment into its kind and name', () => {
      expect(parseFragment('filter_foo')).toEqual({
        kind: 'filter',
        name: 'foo',
      });
      expect(parseFragment('function_myFunc')).toEqual({
        kind: 'function',
        name: 'myFunc',
      });
      expect(parseFragment('value_myVal')).toEqual({
        kind: 'value',
        name: 'myVal',
      });
    });

    it('keeps underscores that belong to the name', () => {
      expect(parseFragment('function_a_b_c')).toEqual({
        kind: 'function',
        name: 'a_b_c',
      });
      expect(parseFragment('filter_')).toEqual({ kind: 'filter', name: '' });
    });

    it('round-trips a name containing underscores for every kind', () => {
      const kinds: ExtensionKind[] = ['filter', 'function', 'value'];
      for (const kind of kinds) {
        const ext = { kind, name: `my_${kind}_name` };
        expect(parseFragment(renderFragment(ext))).toEqual(ext);
      }
    });

    it('returns an empty name for a fragment that is only a kind', () => {
      expect(parseFragment('value')).toEqual({ kind: 'value', name: '' });
    });

    it('throws for a fragment without a known kind', () => {
      expect(() => parseFragment('bogus_x')).toThrow();
      expect(() => parseFragment('')).toThrow();
    });
  });
});
