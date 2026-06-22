/*
 * Copyright 2025 The Backstage Authors
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
    it('produces kind_name format', () => {
      expect(renderFragment({ kind: 'filter', name: 'foo' })).toBe(
        'filter_foo',
      );
    });

    it('handles names with underscores', () => {
      expect(renderFragment({ kind: 'filter', name: 'my_custom_filter' })).toBe(
        'filter_my_custom_filter',
      );
    });
  });

  describe('parseFragment', () => {
    it('parses a simple fragment', () => {
      expect(parseFragment('filter_foo')).toEqual({
        kind: 'filter',
        name: 'foo',
      });
    });

    it('parses a function fragment', () => {
      expect(parseFragment('function_myFunc')).toEqual({
        kind: 'function',
        name: 'myFunc',
      });
    });

    it('parses a value fragment', () => {
      expect(parseFragment('value_myVal')).toEqual({
        kind: 'value',
        name: 'myVal',
      });
    });

    it('THE BUG CASE — round-trip with underscore in name', () => {
      const ext = { kind: 'filter' as ExtensionKind, name: 'my_custom_filter' };
      expect(parseFragment(renderFragment(ext))).toEqual(ext);
    });

    it('multi-underscore name: a_b_c', () => {
      expect(parseFragment('function_a_b_c')).toEqual({
        kind: 'function',
        name: 'a_b_c',
      });
    });

    it('name-less fragment with valid kind returns empty name', () => {
      expect(parseFragment('value')).toEqual({ kind: 'value', name: '' });
    });

    it('invalid kind throws', () => {
      expect(() => parseFragment('bogus_x')).toThrow();
    });
  });

  describe('round-trip: all kinds with underscore names', () => {
    const kinds: ExtensionKind[] = ['filter', 'function', 'value'];
    for (const kind of kinds) {
      it(`round-trips ${kind} with underscore name`, () => {
        const ext = { kind, name: `my_${kind}_name` };
        expect(parseFragment(renderFragment(ext))).toEqual(ext);
      });
    }
  });
});
