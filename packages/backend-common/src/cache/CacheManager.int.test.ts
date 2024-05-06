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

import { ConfigReader } from '@backstage/config';
import { CacheManager } from './CacheManager';
import { JsonValue } from '@backstage/types';
import { CacheServiceInternal } from '@backstage/backend-plugin-api';

describe('CacheManager', () => {
  const defaultConfigOptions = {
    backend: {},
  };
  const defaultConfig = () => new ConfigReader(defaultConfigOptions);

  afterEach(() => jest.resetAllMocks());

  describe('ensures that data does not spill over between clients', () => {
    let cache1: CacheServiceInternal;
    let cache2: CacheServiceInternal;

    beforeEach(() => {
      const manager = CacheManager.fromConfig(defaultConfig());
      cache1 = manager.forPlugin('p1').getClient() as CacheServiceInternal;
      cache2 = manager.forPlugin('p2').getClient() as CacheServiceInternal;
    });

    afterEach(() => {
      cache1.clear();
      cache2.clear();
    });

    it('test set', async () => {
      // Populate client1 with data
      await cache1.set('key', 'foo');
      await cache1.set('key1', 'value1');
      // Populate client2 with data

      await cache2.set('key', 'bar');
      await cache2.set('key2', 'value2');

      // Ensure that client1's data does not spill over
      expect(await cache1.get('key')).toEqual('foo');
      expect(await cache1.get('key2')).toBeUndefined();
      expect(await cache2.get('key')).toEqual('bar');
      expect(await cache2.get('key1')).toBeUndefined();
    });

    it('test iterate', async () => {
      // Populate client1 with data
      await cache1.set('key2', 'value2');
      await cache1.set('key1', 'value1');

      // Populate client2 with data
      await cache2.set('key3', 'value3');
      await cache2.set('key4', 'value4');

      // Ensure that client1's iterator contains exactly client1's data
      const client1Data: Record<string, JsonValue> = {};
      for await (const [key, value] of cache1.iterator()) {
        client1Data[key] = value;
      }
      expect(client1Data).toEqual({ key1: 'value1', key2: 'value2' });

      // Ensure that client2's iterator contains exactly client2's data
      const client2Data: Record<string, JsonValue> = {};
      for await (const [key, value] of cache2.iterator()) {
        client2Data[key] = value;
      }
      expect(client2Data).toEqual({ key3: 'value3', key4: 'value4' });
    });

    it('test clear', async () => {
      // Populate client1 with data
      await cache1.set('key1', 'value1');

      // Populate client2 with data
      await cache2.set('key2', 'value2');

      // Ensure that client1's data does not spill over
      expect(await cache1.get('key1')).toEqual('value1');
      expect(await cache1.get('key2')).toBeUndefined();

      expect(await cache2.get('key2')).toEqual('value2');
      expect(await cache2.get('key1')).toBeUndefined();

      // Clear client1's data and ensure it does not affect client2
      await cache1.clear();
      expect(await cache1.get('key1')).toBeUndefined();
      expect(await cache2.get('key2')).toEqual('value2');
    });
  });
});
