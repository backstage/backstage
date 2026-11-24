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
import {
  createTranslationRef,
  TranslationRefTuple,
  toInternalTranslationRef,
} from './TranslationRef';
import { toInternalTranslationResource } from './TranslationResource';
import { coreExtensionData } from '../wiring/coreExtensionData';

describe('createTranslationRef', () => {
  it('should create a TranslationRef instance using the factory function', () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: { key: 'value', nested: { title: 'Nested' } },
    });

    const internalRef = toInternalTranslationRef(ref);

    expect(internalRef.$$type).toBe('@backstage/TranslationRef');
    expect(internalRef.version).toBe('v1');
    expect(internalRef.id).toBe('test');
    expect(internalRef.getDefaultMessages()).toEqual({
      key: 'value',
      'nested.title': 'Nested',
    });
    expect(ref('key')).toEqual({ ref, key: 'key' });
    expect(ref('key').ref).toBe(ref);
    expect(ref('key').key).toBe('key');
    expect(String(ref)).toBe('TranslationRef{id=test}');
    expect(() => ref.T).toThrow('Not implemented');
    // @ts-expect-error Unknown keys cannot be selected from this ref.
    ref('missing');
    expect(ref('nested.title')).toEqual({ ref, key: 'nested.title' });
    // @ts-expect-error Only flattened message keys can be selected.
    ref('nested');
  });

  it('carries only inferred formatting options in tuple types', () => {
    const ref = createTranslationRef({
      id: 'titles',
      messages: {
        plain: 'Plain',
        interpolation: 'Hello {{name}}',
        formatted: '{{value, number}}',
        plainCount: '{{count}} things',
        nested: '$t(interpolation)',
        deep: '$t(nested)',
        deeper: '$t(deep)',
        deepest: '$t(deeper)',
        nestedPlain: '$t(plain)',
        widened: 'Hello {{name}}' as string,
        nestedWidened: '$t(widened)',
        items_one: 'One',
        items_other: '{{count}} items',
      },
    });
    const titles: TranslationRefTuple<undefined>[] = [
      ref('plain'),
      ref('nestedPlain'),
      // @ts-expect-error Interpolated messages require values.
      ref('interpolation'),
      // @ts-expect-error Formatted messages require values.
      ref('formatted'),
      // @ts-expect-error Count interpolation requires a value even without plural variants.
      ref('plainCount'),
      // @ts-expect-error Nested messages inherit required values.
      ref('nested'),
      // @ts-expect-error Deeply nested values are checked too.
      ref('deepest'),
      // @ts-expect-error Plural messages require a count.
      ref('items'),
      // @ts-expect-error Widened messages have unknown formatting requirements.
      ref('widened'),
      // @ts-expect-error Nested messages also inherit unknown requirements.
      ref('nestedWidened'),
    ];
    expect(titles.map(title => title.key)).toEqual([
      'plain',
      'nestedPlain',
      'interpolation',
      'formatted',
      'plainCount',
      'nested',
      'deepest',
      'items',
      'widened',
      'nestedWidened',
    ]);
    const selections: TranslationRefTuple[] = [
      ref('plain'),
      ref('interpolation'),
      ref('formatted'),
      ref('plainCount'),
      ref('nested'),
      ref('items'),
      ref('widened'),
      ref('nestedWidened'),
    ];
    expect(selections.map(item => item.key)).toEqual([
      'plain',
      'interpolation',
      'formatted',
      'plainCount',
      'nested',
      'items',
      'widened',
      'nestedWidened',
    ]);
    const plain = ref('plain');
    expect(coreExtensionData.titleTranslation(plain).value).toBe(plain);
    // @ts-expect-error Unknown options cannot be assumed absent, even for a plain selected key.
    coreExtensionData.titleTranslation(selections[0]);
    // @ts-expect-error Title translation data cannot require formatting values.
    coreExtensionData.titleTranslation(ref('interpolation'));
    const reselected = ref('interpolation').ref('interpolation');
    // @ts-expect-error An erased ref cannot prove that a message requires no values.
    coreExtensionData.titleTranslation(reselected);
    const selection: TranslationRefTuple<
      { name: string } | { replace: { name: string } }
    > = ref('interpolation');
    expect(selection).toEqual({ ref, key: 'interpolation' });
    expect(selection.T).toBeUndefined();
    // @ts-expect-error Use a checked selector rather than constructing an unchecked tuple.
    const unchecked: TranslationRefTuple = { ref, key: 'interpolation' };
    expect(unchecked.key).toBe('interpolation');
  });

  it('should create a TranslationRef instance with nested messages', () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: {
        key: 'value',
        'nested.conflict1': 'outer conflict1',
        nested: {
          key: 'nested value',
          key2: 'nested value2',
          conflict1: 'inner conflict1',
          conflict2: 'inner conflict2',
          inner: {
            key: 'inner value',
          },
        },
        'nested.conflict2': 'outer conflict2',
      },
    });

    expect(ref('nested.inner.key')).toEqual({ ref, key: 'nested.inner.key' });

    const internalRef = toInternalTranslationRef(ref);

    expect(internalRef.$$type).toBe('@backstage/TranslationRef');
    expect(internalRef.version).toBe('v1');
    expect(internalRef.id).toBe('test');
    expect(internalRef.getDefaultMessages()).toEqual({
      key: 'value',
      'nested.key': 'nested value',
      'nested.key2': 'nested value2',
      'nested.conflict1': 'inner conflict1',
      'nested.inner.key': 'inner value',
      'nested.conflict2': 'outer conflict2',
    });
  });

  it('should be created with lazy translations', async () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: { key: 'value' },
      translations: {
        de: () => Promise.resolve({ default: { key: 'other-value' } }),
      },
    });

    const internalRef = toInternalTranslationRef(ref);

    expect(internalRef.$$type).toBe('@backstage/TranslationRef');
    expect(internalRef.version).toBe('v1');
    expect(internalRef.id).toBe('test');
    expect(internalRef.getDefaultMessages()).toEqual({ key: 'value' });

    const internalResource = toInternalTranslationResource(
      internalRef.getDefaultResource()!,
    );
    expect(internalResource).toEqual({
      $$type: '@backstage/TranslationResource',
      version: 'v1',
      id: 'test',
      resources: [
        {
          language: 'de',
          loader: expect.any(Function),
        },
      ],
    });
    await expect(internalResource.resources[0].loader()).resolves.toEqual({
      messages: {
        key: 'other-value',
      },
    });
  });
});
