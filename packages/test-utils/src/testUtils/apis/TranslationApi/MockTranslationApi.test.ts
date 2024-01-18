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

import { createTranslationRef } from '@backstage/core-plugin-api/alpha';
import { MockTranslationApi } from './MockTranslationApi';

describe('MockTranslationApi', () => {
  function snapshotWithMessages<
    const TMessages extends { [key in string]: string },
  >(messages: TMessages) {
    const translationApi = MockTranslationApi.create();
    const ref = createTranslationRef({
      id: 'test',
      messages,
    });
    const snapshot = translationApi.getTranslation(ref);
    if (!snapshot.ready) {
      throw new Error('Translation snapshot is not ready');
    }
    return snapshot;
  }

  it('should format plain messages', () => {
    const snapshot = snapshotWithMessages({
      foo: 'Foo',
      bar: 'Bar',
      baz: 'Baz',
    });

    expect(snapshot.t('foo')).toBe('Foo');
    expect(snapshot.t('bar')).toBe('Bar');
    expect(snapshot.t('baz')).toBe('Baz');
  });

  it('should support interpolation', () => {
    const snapshot = snapshotWithMessages({
      shallow: 'Foo {{ bar }}',
      multiple: 'Foo {{ bar }} {{ baz }}',
      deep: 'Foo {{ bar.baz }}',
    });

    // @ts-expect-error
    expect(snapshot.t('shallow')).toBe('Foo {{ bar }}');
    expect(snapshot.t('shallow', { bar: 'Bar' })).toBe('Foo Bar');

    // @ts-expect-error
    expect(snapshot.t('multiple')).toBe('Foo {{ bar }} {{ baz }}');
    // @ts-expect-error
    expect(snapshot.t('multiple', { bar: 'Bar' })).toBe('Foo Bar {{ baz }}');
    expect(snapshot.t('multiple', { bar: 'Bar', baz: 'Baz' })).toBe(
      'Foo Bar Baz',
    );

    // @ts-expect-error
    expect(snapshot.t('deep')).toBe('Foo {{ bar.baz }}');
    expect(snapshot.t('deep', { bar: { baz: 'Baz' } })).toBe('Foo Baz');
  });

  // Escaping isn't as useful in React, since we don't need to escape HTML in strings
  it('should not escape by default', () => {
    const snapshot = snapshotWithMessages({
      foo: 'Foo {{ foo }}',
    });

    expect(snapshot.t('foo', { foo: '<div>' })).toBe('Foo <div>');
    expect(
      snapshot.t('foo', {
        foo: '<div>',
        interpolation: { escapeValue: true },
      }),
    ).toBe('Foo &lt;div&gt;');
  });

  it('should support nesting', () => {
    const snapshot = snapshotWithMessages({
      foo: 'Foo $t(bar) $t(baz)',
      bar: 'Nested',
      baz: 'Baz {{ qux }}',
    });

    expect(snapshot.t('foo', { qux: 'Deep' })).toBe('Foo Nested Baz Deep');
  });

  it('should support formatting', () => {
    const snapshot = snapshotWithMessages({
      plain: '= {{ x }}',
      number: '= {{ x, number }}',
      numberFixed: '= {{ x, number(minimumFractionDigits: 2) }}',
      relativeTime: '= {{ x, relativeTime }}',
      relativeSeconds: '= {{ x, relativeTime(second) }}',
      relativeSecondsShort:
        '= {{ x, relativeTime(range: second; style: short) }}',
      list: '= {{ x, list }}',
    });

    expect(snapshot.t('plain', { x: '5' })).toBe('= 5');
    expect(snapshot.t('number', { x: 5 })).toBe('= 5');
    expect(
      snapshot.t('number', {
        x: 5,
        formatParams: { x: { minimumFractionDigits: 1 } },
      }),
    ).toBe('= 5.0');
    expect(snapshot.t('numberFixed', { x: 5 })).toBe('= 5.00');
    expect(
      snapshot.t('numberFixed', {
        x: 5,
        formatParams: { x: { minimumFractionDigits: 3 } },
      }),
    ).toBe('= 5.000');
    expect(snapshot.t('relativeTime', { x: 3 })).toBe('= in 3 days');
    expect(snapshot.t('relativeTime', { x: -3 })).toBe('= 3 days ago');
    expect(
      snapshot.t('relativeTime', {
        x: 15,
        formatParams: { x: { range: 'weeks' } },
      }),
    ).toBe('= in 15 weeks');
    expect(
      snapshot.t('relativeTime', {
        x: 15,
        formatParams: { x: { range: 'weeks', style: 'short' } },
      }),
    ).toBe('= in 15 wk.');
    expect(snapshot.t('relativeSeconds', { x: 1 })).toBe('= in 1 second');
    expect(snapshot.t('relativeSeconds', { x: 2 })).toBe('= in 2 seconds');
    expect(snapshot.t('relativeSeconds', { x: -3 })).toBe('= 3 seconds ago');
    expect(snapshot.t('relativeSeconds', { x: 0 })).toBe('= in 0 seconds');
    expect(snapshot.t('relativeSecondsShort', { x: 1 })).toBe('= in 1 sec.');
    expect(snapshot.t('relativeSecondsShort', { x: 2 })).toBe('= in 2 sec.');
    expect(snapshot.t('relativeSecondsShort', { x: -3 })).toBe('= 3 sec. ago');
    expect(snapshot.t('relativeSecondsShort', { x: 0 })).toBe('= in 0 sec.');
    expect(snapshot.t('list', { x: ['a'] })).toBe('= a');
    expect(snapshot.t('list', { x: ['a', 'b'] })).toBe('= a and b');
    expect(snapshot.t('list', { x: ['a', 'b', 'c'] })).toBe('= a, b, and c');
  });

  it('should support plurals', () => {
    const snapshot = snapshotWithMessages({
      derp_one: 'derp',
      derp_other: 'derps',
      derpWithCount_one: '{{ count }} derp',
      derpWithCount_other: '{{ count }} derps',
    });

    expect(snapshot.t('derp', { count: 1 })).toBe('derp');
    expect(snapshot.t('derp', { count: 2 })).toBe('derps');
    expect(snapshot.t('derp', { count: 0 })).toBe('derps');
    expect(snapshot.t('derpWithCount', { count: 1 })).toBe('1 derp');
    expect(snapshot.t('derpWithCount', { count: 2 })).toBe('2 derps');
    expect(snapshot.t('derpWithCount', { count: 0 })).toBe('0 derps');
  });
});
