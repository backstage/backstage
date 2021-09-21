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
    processorCache.set('my-key', 'my-new-value');
    await expect(processorCache.get<string>('my-key')).resolves.toBe(
      'my-value',
    );

    // There should be isolation between processors
    await expect(
      cache.forProcessor(otherProcessor).get<string>('my-key'),
    ).resolves.toBeUndefined();

    // Collecting the state and passing it to a new manager should make the new values visible
    const newCache = new ProcessorCacheManager(cache.collect());
    await expect(
      newCache.forProcessor(myProcessor).get<string>('my-key'),
    ).resolves.toBe('my-new-value');
  });
});
