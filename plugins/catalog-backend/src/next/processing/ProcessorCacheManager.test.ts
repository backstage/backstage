/*
 * Copyright 2021 The Backstage Authors
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

import { CatalogProcessor } from '../../ingestion/processors';
import { ProcessorCacheManager } from './ProcessorCacheManager';

class MyProcessor implements CatalogProcessor {
  getProcessorName = () => 'my-processor';
}

class OtherProcessor implements CatalogProcessor {}

describe('ProcessorCacheManager', () => {
  const myProcessor = new MyProcessor();
  const otherProcessor = new OtherProcessor();

  it('should forward existing state and collect new state', async () => {
    const cache = new ProcessorCacheManager({
      'my-processor': { 'my-key': 'my-value' },
    });

    // Should be empty to begin with
    expect(cache.collect()).toEqual({});

    // instance should be cached
    const processorCache = cache.forProcessor(myProcessor);
    expect(processorCache).toBe(cache.forProcessor(myProcessor));

    // Initial values should be visible, writes should not
    await expect(processorCache.get<string>('my-key')).resolves.toBe(
      'my-value',
    );

    // If set hasn't been called yet we should get the existing data
    expect(cache.collect()).toEqual({
      'my-processor': { 'my-key': 'my-value' },
    });

    processorCache.set('my-new-key', 'my-new-value');
    // Once set has been called the old values should disappear
    expect(cache.collect()).toEqual({
      'my-processor': { 'my-new-key': 'my-new-value' },
    });

    // Getting the cache should return the initial state value
    await expect(processorCache.get<string>('my-key')).resolves.toBe(
      'my-value',
    );
    await expect(
      processorCache.get<string>('my-new-key'),
    ).resolves.toBeUndefined();

    // There should be isolation between processors
    await expect(
      cache.forProcessor(otherProcessor).get<string>('my-key'),
    ).resolves.toBeUndefined();

    // Collecting the state and passing it to a new manager should make the new values visible
    const newCache = new ProcessorCacheManager(cache.collect());
    await expect(
      newCache.forProcessor(myProcessor).get<string>('my-new-key'),
    ).resolves.toBe('my-new-value');
  });
});

describe('ScopedProcessorCache', () => {
  const myProcessor = new MyProcessor();

  it('should forward existing state and collect new state', async () => {
    const cache = new ProcessorCacheManager({
      'my-processor': { 'scope-1': { 'my-key': 'my-value' } },
    });

    const scopedCache1 = cache.forProcessor(myProcessor, 'scope-1');
    const scopedCache2 = cache.forProcessor(myProcessor, 'scope-2');

    // Should be empty to begin with
    expect(cache.collect()).toEqual({
      'my-processor': { 'scope-1': { 'my-key': 'my-value' } },
    });

    await scopedCache2.set('my-new-key-2', 'my-new-value-2');

    expect(cache.collect()).toEqual({
      'my-processor': {
        'scope-1': { 'my-key': 'my-value' },
        'scope-2': { 'my-new-key-2': 'my-new-value-2' },
      },
    });

    await scopedCache1.set('my-new-key', 'my-new-value');

    await expect(scopedCache1.get<string>('my-key')).resolves.toBe('my-value');
    await expect(
      scopedCache1.get<string>('my-new-key'),
    ).resolves.toBeUndefined();

    expect(cache.collect()).toEqual({
      'my-processor': {
        'scope-1': { 'my-new-key': 'my-new-value' },
        'scope-2': { 'my-new-key-2': 'my-new-value-2' },
      },
    });
  });
});
