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

import { CacheClient, getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { CacheInvalidationError, TechDocsCache } from './TechDocsCache';

const cached = (str: string): string => {
  return Buffer.from(str).toString('base64');
};

describe('TechDocsCache', () => {
  let CacheUnderTest: TechDocsCache;
  let MockClient: jest.Mocked<CacheClient>;

  beforeEach(() => {
    MockClient = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
    };
    CacheUnderTest = TechDocsCache.fromConfig(new ConfigReader({}), {
      cache: MockClient,
      logger: getVoidLogger(),
    });
  });

  describe('get', () => {
    it('returns undefined if no response', async () => {
      const expectedPath = 'some/index.html';
      MockClient.get.mockResolvedValueOnce(undefined);

      const actual = await CacheUnderTest.get(expectedPath);
      expect(MockClient.get).toHaveBeenCalledWith(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if cache get throws', async () => {
      const expectedPath = 'some/index.html';
      MockClient.get.mockRejectedValueOnce(new Error());

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if no response after 1s by default', async () => {
      const expectedPath = 'some/index.html';
      MockClient.get.mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(cached('value')), 1500);
        });
      });
      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if no response after configured readTimeout', async () => {
      const expectedPath = 'some/index.html';
      MockClient.get.mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(cached('value')), 20);
        });
      });

      CacheUnderTest = TechDocsCache.fromConfig(
        new ConfigReader({
          techdocs: { cache: { readTimeout: 10 } },
        }),
        {
          cache: MockClient,
          logger: getVoidLogger(),
        },
      );

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns data if cache get returns it', async () => {
      const expectedPath = 'some/index.html';
      MockClient.get.mockResolvedValueOnce(cached('expected value'));

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual?.toString()).toBe('expected value');
    });
  });

  describe('set', () => {
    it('sets a base64-encoded string', async () => {
      const expectedPath = 'some/index.html';
      MockClient.set.mockResolvedValueOnce(undefined);

      await CacheUnderTest.set(expectedPath, Buffer.from('some data'));
      expect(MockClient.set).toHaveBeenCalledWith(
        expectedPath,
        cached('some data'),
      );
    });

    it('does not throw if client throws', () => {
      MockClient.set.mockRejectedValueOnce(new Error());
      expect(() => CacheUnderTest.set('i.html', Buffer.from(''))).not.toThrow();
    });
  });

  describe('invalidate', () => {
    it('calls delete on client', async () => {
      const expectedPath = 'some/index.html';
      MockClient.delete.mockResolvedValueOnce(undefined);

      await CacheUnderTest.invalidate(expectedPath);
      expect(MockClient.delete).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('invalidateMultiple', () => {
    it('calls delete once per given path', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      MockClient.delete.mockResolvedValue(undefined);

      await CacheUnderTest.invalidateMultiple(expectedPaths);
      expect(MockClient.delete).toHaveBeenNthCalledWith(1, expectedPaths[0]);
      expect(MockClient.delete).toHaveBeenNthCalledWith(2, expectedPaths[1]);
    });

    it('returns an array of as many paths provided', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      MockClient.delete.mockResolvedValue(undefined);

      const actual = await CacheUnderTest.invalidateMultiple(expectedPaths);
      expect(actual.length).toBe(2);
    });

    it('calls delete on all paths even if the first rejects', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      MockClient.delete.mockRejectedValueOnce(new Error());
      MockClient.delete.mockResolvedValueOnce(undefined);

      await expect(
        CacheUnderTest.invalidateMultiple(expectedPaths),
      ).rejects.toThrow(CacheInvalidationError);
      expect(MockClient.delete).toHaveBeenCalledTimes(2);
    });

    it('rejects with invalidations error response', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      MockClient.delete.mockResolvedValueOnce(undefined);
      MockClient.delete.mockRejectedValueOnce(new Error());

      await expect(
        CacheUnderTest.invalidateMultiple.bind(CacheUnderTest, expectedPaths),
      ).rejects.toThrow(CacheInvalidationError);
    });
  });
});
