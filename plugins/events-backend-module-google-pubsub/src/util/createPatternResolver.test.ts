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

import { createPatternResolver } from './createPatternResolver';

describe('createPatternResolver', () => {
  it('resolves patterns as expected', () => {
    expect(createPatternResolver('foo')({})).toEqual('foo');
    expect(createPatternResolver('{{a.b}}')({ a: { b: 'test' } })).toEqual(
      'test',
    );
    expect(createPatternResolver('{{a.b}}')({ a: { b: '7' } })).toEqual('7');
    expect(
      createPatternResolver('{{a.b-c}}')({ a: { 'b-c': 'test' } }),
    ).toEqual('test');
    expect(
      createPatternResolver("{{a['b-c']}}")({ a: { 'b-c': 'test' } }),
    ).toEqual('test');
    expect(
      createPatternResolver('{{a["b-c"]}}')({ a: { 'b-c': 'test' } }),
    ).toEqual('test');
    expect(
      createPatternResolver(' {{ a.b }} ')({ a: { b: ' test ' } }),
    ).toEqual('  test  ');
    expect(
      createPatternResolver('-{{ a.b[1] }}-')({
        a: { b: ['first', 'second'] },
      }),
    ).toEqual('-second-');
    expect(
      createPatternResolver('-{{ a.b.0 }}-')({
        a: { b: ['first', 'second'] },
      }),
    ).toEqual('-first-');
  });

  it('throws on bad / missing context values', () => {
    expect(() =>
      createPatternResolver('{{a.b}}')({ a: { b: [7] } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Expected string or number value for selector 'a.b', got object"`,
    );
    expect(() =>
      createPatternResolver('{{a.b}}')({ a: {} }),
    ).toThrowErrorMatchingInlineSnapshot(`"No value for selector 'a.b'"`);
    expect(() =>
      createPatternResolver("-{{ a.b['length'] }}-")({
        a: { b: ['first', 'second'] },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No value for selector 'a.b['length']'"`,
    );
    expect(() =>
      createPatternResolver('-{{ a.b.length }}-')({
        a: { b: ['first', 'second'] },
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No value for selector 'a.b.length'"`,
    );
  });

  it('just passes down broken parts of patterns', () => {
    expect(createPatternResolver('-{{a}}-}}')({ a: 1 })).toEqual('-1-}}');
    expect(createPatternResolver('{{-{{a}}-')({ a: 1 })).toEqual('{{-1-');
    expect(createPatternResolver('{{-{{a}}-}}')({ a: 1 })).toEqual('{{-1-}}');
    expect(createPatternResolver('{{-{{}}-}}')({ a: 1 })).toEqual('{{--}}');
  });

  it('only follows own properties', () => {
    expect(() =>
      createPatternResolver('{{a.constructor}}')({ a: { b: 'test' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No value for selector 'a.constructor'"`,
    );
    expect(() =>
      createPatternResolver('{{a.__proto__}}')({ a: { b: 'test' } }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"No value for selector 'a.__proto__'"`,
    );
  });
});
