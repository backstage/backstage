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

import { DefaultCacheClient } from './CacheClient';
import Keyv from 'keyv';
import { JsonValue } from '@backstage/types';

describe('CacheClient', () => {
  let client: Keyv;
  const b64 = (k: string) => Buffer.from(k).toString('base64');

  beforeEach(() => {
    client = new Keyv();
    client.get = jest.fn();
    client.set = jest.fn();
    client.delete = jest.fn();
  });

  afterEach(() => jest.resetAllMocks());

  describe('CacheClient.get', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const key = 'somekey';

      await sut.get(key);

      expect(client.get).toHaveBeenCalledWith(b64(key));
    });

    it('calls client with normalized key (very long key)', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const key = 'x'.repeat(251);

      await sut.get(key);

      const spy = client.get as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).not.toEqual(b64(key));
      expect(actualKey.length).toBeLessThan(250);
    });

    it('rejects on underlying error', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedError = new Error('Some runtime error');
      client.get = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.get('someKey')).rejects.toEqual(expectedError);
    });

    it('resolves what underlying client resolves', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedValue = 'some value';
      client.get = jest.fn().mockResolvedValue(expectedValue);

      const actualValue = await sut.get('someKey');

      return expect(actualValue).toEqual(expectedValue);
    });
  });

  describe('CacheClient.set', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const key = 'somekey';

      await sut.set(key, {});

      const spy = client.set as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(key));
    });

    it('passes ttl to client when given', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedTtl = 3600;

      await sut.set('someKey', {}, { ttl: expectedTtl });

      const spy = client.set as jest.Mock;
      const actualTtl = spy.mock.calls[0][2];
      expect(actualTtl).toEqual(expectedTtl);
    });

    it('rejects on underlying error if configured', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedError = new Error('Some runtime error');
      client.set = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.set('someKey', {})).rejects.toEqual(expectedError);
    });
  });

  describe('CacheClient.delete', () => {
    it('calls client with normalized key', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const key = 'somekey';

      await sut.delete(key);

      const spy = client.delete as jest.Mock;
      const actualKey = spy.mock.calls[0][0];
      expect(actualKey).toEqual(b64(key));
    });

    it('rejects on underlying error if configured', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedError = new Error('Some runtime error');
      client.delete = jest.fn().mockRejectedValue(expectedError);

      return expect(sut.delete('someKey')).rejects.toEqual(expectedError);
    });
  });

  describe('CacheClient.iterator', () => {
    it('returns an async generator', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedGenerator = (async function* generator() {})();
      client.iterator = jest.fn().mockReturnValue(expectedGenerator);

      const actualGenerator = sut.iterator();
      expect(actualGenerator).toEqual(expectedGenerator);
    });

    it('ensures that data does not spill over between clients', async () => {
      const client1 = new Keyv();
      const client2 = new Keyv();

      const sut1 = new DefaultCacheClient(client1, () => client1, {});
      const sut2 = new DefaultCacheClient(client2, () => client2, {});

      // Populate client1 with data
      await sut1.set('key1', 'value1');
      await sut1.set('key2', 'value2');

      // Populate client2 with data
      await sut2.set('key3', 'value3');
      await sut2.set('key4', 'value4');

      // Ensure that client1's iterator contains exactly client1's data
      const client1Data: Record<string, JsonValue> = {};
      for await (const [key, value] of sut1.iterator()) {
        client1Data[key] = value;
      }
      expect(client1Data).toEqual({ key1: 'value1', key2: 'value2' });

      // Ensure that client2's iterator contains exactly client2's data
      const client2Data: Record<string, JsonValue> = {};
      for await (const [key, value] of sut2.iterator()) {
        client2Data[key] = value;
      }
      expect(client2Data).toEqual({ key3: 'value3', key4: 'value4' });
    });

    it('fail for long keys', async () => {
      const keyv = new Keyv();
      const sut = new DefaultCacheClient(keyv, () => keyv, {});
      const key = 'x'.repeat(251);

      await sut.set(key, 'foo');

      try {
        for await (const _ of sut.iterator()) {
          // consume the iterator
        }
      } catch (err) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(err).toBeDefined();
        return;
      }
      throw new Error('Expected an error to be thrown');
    });
  });

  describe('CacheClient.clear', () => {
    it('resolves without error when underlying client resolves', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      client.clear = jest.fn().mockResolvedValue(undefined);

      await expect(sut.clear()).resolves.not.toThrow();
    });

    it('rejects on underlying error', async () => {
      const sut = new DefaultCacheClient(client, () => client, {});
      const expectedError = new Error('Some runtime error');
      client.clear = jest.fn().mockRejectedValue(expectedError);

      await expect(sut.clear()).rejects.toEqual(expectedError);
    });

    it('ensures that data does not spill over between clients', async () => {
      const client1 = new Keyv();
      const client2 = new Keyv();

      const sut1 = new DefaultCacheClient(client1, () => client1, {});
      const sut2 = new DefaultCacheClient(client2, () => client2, {});

      // Populate client1 with data
      await sut1.set('key1', 'value1');

      // Populate client2 with data
      await sut2.set('key2', 'value2');

      // Ensure that client1's data does not spill over
      expect(await sut1.get('key1')).toEqual('value1');
      expect(await sut2.get('key2')).toEqual('value2');
      expect(await sut1.get('key2')).toBeUndefined();
      expect(await sut2.get('key1')).toBeUndefined();

      // Clear client1's data and ensure it does not affect client2
      await sut1.clear();
      expect(await sut1.get('key1')).toBeUndefined();
      expect(await sut2.get('key2')).toEqual('value2');
    });
  });

  describe('CacheClient.withOptions', () => {
    it('merges together options to create a new instance', async () => {
      const factory = jest.fn();
      const sut = new DefaultCacheClient(client, factory, { foo: 1 } as any);
      expect(factory).not.toHaveBeenCalled();

      const sutA = await sut.withOptions({});
      expect(factory).toHaveBeenLastCalledWith({ foo: 1 });

      const sutA2 = await sutA.withOptions({ bar: 2 } as any);
      expect(factory).toHaveBeenCalledWith({ foo: 1, bar: 2 });

      await sutA2.withOptions({ foo: 3 } as any);
      expect(factory).toHaveBeenCalledWith({ foo: 3, bar: 2 });

      // calling .withOptions should not mutate state
      const sutB = await sut.withOptions({ foo: 2 } as any);
      expect(factory).toHaveBeenLastCalledWith({ foo: 2 });

      await sutB.withOptions({ bar: 3 } as any);
      expect(factory).toHaveBeenLastCalledWith({ foo: 2, bar: 3 });
    });
  });
});
