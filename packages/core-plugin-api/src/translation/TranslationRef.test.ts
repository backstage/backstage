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
  toInternalTranslationRef,
} from './TranslationRef';
import { toInternalTranslationResource } from './TranslationResource';

describe('TranslationRefImpl', () => {
  it('should create a TranslationRef instance using the factory function', () => {
    const ref = createTranslationRef({
      id: 'test',
      messages: { key: 'value' },
    });

    const internalRef = toInternalTranslationRef(ref);

    expect(internalRef.$$type).toBe('@backstage/TranslationRef');
    expect(internalRef.version).toBe('v1');
    expect(internalRef.id).toBe('test');
    expect(internalRef.getDefaultMessages()).toEqual({ key: 'value' });
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
