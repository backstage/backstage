/*
 * Copyright 2021 Spotify AB
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

import { ConcreteCacheClient } from './CacheClient';
import cacheManager from 'cache-manager';

describe('CacheClient', () => {
  const pluginId = 'test';
  let client: cacheManager.Cache;
  const b64 = (k: string) => Buffer.from(k).toString('base64');

  beforeEach(() => {
    client = cacheManager.caching({ store: 'none', ttl: 0 });
    client.get = jest.fn();
    client.set = jest.fn();
    client.del = jest.fn();
  });

  afterEach(() => jest.resetAllMocks());

  describe('CacheClient.get', () => {
    it('calls client with normalized key', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const keyPartial = 'somekey';

      await sut.get(keyPartial);

      expect(client.get).toHaveBeenCalledWith(b64(`${pluginId}:${keyPartial}`));
    });

    it('calls client with normalized key (very long key)', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const keyPartial = 'x'.repeat(251);

      await sut.get(keyPartial);

      const spy = client.get as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).not.toEqual(b64(`${pluginId}:${keyPartial}`));
      expect(actualKey.length).toBeLessThan(250);
    });

    it('performs deserialization on returned data', async () => {
      const expectedValue = { some: 'value' };
      const sut = new ConcreteCacheClient({ client, pluginId });
      client.get = jest.fn().mockResolvedValue(JSON.stringify(expectedValue));

      const actualValue = await sut.get('someKey');

      expect(actualValue).toMatchObject(expectedValue);
    });

    it('returns null on any underlying error', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      client.get = jest.fn().mockRejectedValue(undefined);

      const actualValue = await sut.get('someKey');

      expect(actualValue).toStrictEqual(null);
    });
  });

  describe('CacheClient.set', () => {
    it('calls client with normalized key', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const keyPartial = 'somekey';

      await sut.set(keyPartial, {});

      const spy = client.set as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(`${pluginId}:${keyPartial}`));
    });

    it('performs serialization on given data', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const expectedData = { some: 'value' };

      await sut.set('someKey', expectedData);

      const spy = client.set as jest.Mock;
      const actualData = spy.mock.calls[0][1];
      expect(actualData).toEqual(JSON.stringify(expectedData));
    });

    it('passes ttl to client when given', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const expectedTtl = 3600;

      await sut.set('someKey', {}, expectedTtl);

      const spy = client.set as jest.Mock;
      const actualOptions = spy.mock.calls[0][2];
      expect(actualOptions.ttl).toEqual(expectedTtl);
    });

    it('does not throw errors on any client error', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      client.set = jest.fn().mockRejectedValue(undefined);

      expect(async () => {
        await sut.set('someKey', {});
      }).not.toThrow();
    });
  });

  describe('CacheClient.delete', () => {
    it('calls client with normalized key', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      const keyPartial = 'somekey';

      await sut.delete(keyPartial);

      const spy = client.del as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(`${pluginId}:${keyPartial}`));
    });

    it('does not throw errors on any client error', async () => {
      const sut = new ConcreteCacheClient({ client, pluginId });
      client.del = jest.fn().mockRejectedValue(undefined);

      expect(async () => {
        await sut.delete('someKey');
      }).not.toThrow();
    });
  });
});
