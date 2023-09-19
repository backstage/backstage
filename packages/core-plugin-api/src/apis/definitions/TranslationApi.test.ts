/*
 * Copyright 2023 The Backstage Authors
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

import { TranslationFunction } from './TranslationApi';

function unused(..._any: any[]) {}

describe('TranslationFunction', () => {
  it('should infer plurals', () => {
    const f = (() => {}) as TranslationFunction<{
      key_one: 'one';
      key_other: 'other';
      thingCount_one: '{{count}} thing';
      thingCount_other: '{{count}} things';
      foo: 'foo';
    }>;
    expect(f).toBeDefined();

    f('foo');
    // @ts-expect-error
    f('foo', { count: 1 });

    f('key', { count: 1 });
    // @ts-expect-error
    f('key');
    // @ts-expect-error
    f('key', { notCount: 1 });
    // @ts-expect-error
    f('key_one');
    // @ts-expect-error
    f('key_one', { count: 1 });
    // @ts-expect-error
    f('key_other');
    // @ts-expect-error
    f('key_other', { count: 6 });

    f('thingCount', { count: 1 });
    // @ts-expect-error
    f('thingCount');
    // @ts-expect-error
    f('thingCount', { notCount: 1 });
    // @ts-expect-error
    f('thingCount_one');
    // @ts-expect-error
    f('thingCount_one', { count: 1 });
    // @ts-expect-error
    f('thingCount_other');
    // @ts-expect-error
    f('thingCount_other', { count: 6 });

    const x1: 'one' | 'other' = f('key', { count: 6 });
    // @ts-expect-error
    const x2: 'one' = f('key', { count: 6 });
    unused(x1, x2);
  });

  it('should infer interpolation params', () => {
    const f = (() => {}) as TranslationFunction<{
      none: '=';
      simple: '= {{bar}}';
      multiple: '= {{bar   }} {{   baz}}';
      deep: '= {{x.y}} {{   x.z   }} {{      a.b.c      }}';
    }>;
    expect(f).toBeDefined();

    // @ts-expect-error
    f('none', { replace: { unknown: 1 } });
    f('simple', { bar: '' });
    // @ts-expect-error
    f('simple');
    // @ts-expect-error
    f('simple', {});
    // @ts-expect-error
    f('simple', { replace: {} });
    // @ts-expect-error
    f('simple', { replace: { wrong: '' } });
    f('multiple', { bar: '', baz: '' });
    // @ts-expect-error
    f('multiple', { bar: '' });
    // @ts-expect-error
    f('multiple', { baz: '' });
    // @ts-expect-error
    f('multiple');
    // @ts-expect-error
    f('multiple', {});
    // @ts-expect-error
    f('multiple', { replace: {} });
    f('deep', { replace: { x: { y: '', z: '' }, a: { b: { c: '' } } } });
    // @ts-expect-error
    f('deep');
    // @ts-expect-error
    f('deep', {});
    // @ts-expect-error
    f('deep', { replace: {} });
    // @ts-expect-error
    f('deep', { x: { y: '', z: '' }, a: { b: '' } });
    // @ts-expect-error
    f('deep', { x: { y: '', z: '' } });
    // @ts-expect-error
    f('deep', { replace: { a: { b: { c: '' } } } });
  });

  it('should infer interpolation params with count', () => {
    const f = (() => {}) as TranslationFunction<{
      simple_one: '= {{bar}}';
      simple_other: '= {{bar}}';
      multiple_one: '= {{   bar}} {{baz   }}';
      multiple_other: '= {{bar   }} {{   baz}}';
      deep_one: '= {{ x.y }}';
      deep_other: '= {{ x.z }} {{ a.b.c }}';
    }>;
    expect(f).toBeDefined();

    f('simple', { count: 1, bar: '' });
    // @ts-expect-error
    f('simple', { bar: '' });
    // @ts-expect-error
    f('simple', { count: 1, replace: {} });
    // @ts-expect-error
    f('simple', { replace: {} });
    // @ts-expect-error
    f('simple', { replace: { wrong: '' } });
    f('multiple', { count: 2, replace: { bar: '', baz: '' } });
    // @ts-expect-error
    f('multiple', { count: 2, replace: {} });
    // @ts-expect-error
    f('multiple', { replace: { bar: '', baz: '' } });
    // @ts-expect-error
    f('multiple', { replace: { baz: '' } });
    // @ts-expect-error
    f('multiple', { replace: {} });
    // @ts-expect-error
    f('multiple', {});
    f('deep', {
      count: 1,
      replace: { x: { y: '', z: '' }, a: { b: { c: '' } } },
    });
    // @ts-expect-error
    f('deep', { count: 1 });
    // @ts-expect-error
    f('deep', { x: { y: '', z: '' }, a: { b: { c: '' } } });
    // @ts-expect-error
    f('deep', { replace: {} });
    // @ts-expect-error
    f('deep', { x: { y: '', z: '' }, a: { b: '' } });
    // @ts-expect-error
    f('deep', { x: { y: '', z: '' } });
    // @ts-expect-error
    f('deep', { replace: { a: { b: { c: '' } } } });
  });

  it('should support formatting', () => {
    const f = (() => {}) as TranslationFunction<{
      none: '{{x}}';
      number: '{{x, number}}';
      numberOptions: '{{x, number(minimumFractionDigits: 2)}}';
      currency: '{{x, currency}}';
      datetime: '{{x, dateTime}}';
      relativeTimeOptions: '{{x, relativeTime(quarter)}}';
      list: '{{x, list}}';
    }>;
    expect(f).toBeDefined();

    f('none', { replace: { x: 'x' } });
    f('number', { x: 1 });
    f('number', {
      replace: { x: 1 },
      formatParams: { x: { minimumFractionDigits: 2 } },
    });
    f('numberOptions', { x: 1 });
    f('currency', { replace: { x: 1 } });
    f('datetime', { x: new Date() });
    f('relativeTimeOptions', { replace: { x: 1 } });
    f('relativeTimeOptions', {
      replace: { x: 1 },
      formatParams: { x: { style: 'short' } },
    });
    f('list', { replace: { x: ['a', 'b', 'c'] } });
    // @ts-expect-error
    f('none', { x: 1 });
    // @ts-expect-error
    f('number', { replace: { x: '1' } });
    // @ts-expect-error
    f('numberOptions', { x: '1' });
    // @ts-expect-error
    f('currency', { x: '1' });
    // @ts-expect-error
    f('datetime', { replace: { x: '1' } });
    // @ts-expect-error
    f('relativeTimeOptions', { x: '1' });
    f('relativeTimeOptions', {
      replace: { x: 1 },
      // @ts-expect-error
      formatParams: { x: { minimumFractionDigits: 2 } },
    });
    // @ts-expect-error
    f('list', { x: [1, 2, 3] });
  });

  it('should support nesting', () => {
    const f = (() => {}) as TranslationFunction<{
      simple: '$t(foo)';
      nested: '$t(bar)';
      nestedCount: '$t(qux)';
      deep: '$t(baz) $t(qux)';
      foo: 'foo';
      bar: '{{ bar }}';
      baz: '$t(bar) {{ baz }}';
      qux_one: '{{ qux1 }}';
      qux_other: '{{ qux2 }}';
    }>;
    expect(f).toBeDefined();

    f('simple');
    f('nested', { bar: 'bar' });
    f('nestedCount', { count: 1, replace: { qux1: 'qux', qux2: 'qux' } });
    f('deep', {
      count: 1,
      replace: { bar: 'bar', baz: 'baz', qux1: 'qux', qux2: 'qux' },
    });
    // @ts-expect-error
    f('deep', { count: 1, baz: 'baz', qux1: 'qux', qux2: 'qux' });
    // @ts-expect-error
    f('deep', { count: 1, replace: { bar: 'bar', qux1: 'qux', qux2: 'qux' } });
    // @ts-expect-error
    f('deep', { count: 1, bar: 'bar', baz: 'baz', qux2: 'qux' });
    // @ts-expect-error
    f('deep', { count: 1, bar: 'bar', baz: 'baz', qux1: 'qux' });
    // @ts-expect-error
    f('deep', {
      replace: { bar: 'bar', baz: 'baz', qux1: 'qux', qux2: 'qux' },
    });
  });

  it('should limit nesting depth', () => {
    const f = (() => {}) as TranslationFunction<{
      a: '$t(b) {{a}}';
      b: '$t(c) {{b}}';
      c: '$t(d) {{c}}';
      d: '$t(e) {{d}}';
      e: '$t(f) {{e}}';
    }>;
    expect(f).toBeDefined();

    f('a', { replace: { a: '', b: '', c: '', d: '' } });
    // @ts-expect-error
    f('a', { a: '', b: '', c: '' });
    // @ts-expect-error
    f('a', { replace: { a: '', b: '', c: '', d: '', e: '' } });
  });
});
