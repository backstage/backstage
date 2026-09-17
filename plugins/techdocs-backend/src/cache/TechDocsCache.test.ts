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
import { CacheInvalidationError, TechDocsCache } from './TechDocsCache';
import { mockServices } from '@backstage/backend-test-utils';

const cached = (str: string): string => {
  return Buffer.from(str).toString('base64');
};

describe('TechDocsCache', () => {
  let CacheUnderTest: TechDocsCache;
  const cache = mockServices.cache.mock();

  beforeEach(() => {
    jest.clearAllMocks();
    CacheUnderTest = TechDocsCache.fromConfig(new ConfigReader({}), {
      cache: cache,
      logger: mockServices.logger.mock(),
    });
  });

  describe('get', () => {
    it('returns undefined if no response', async () => {
      const expectedPath = 'some/index.html';
      cache.get.mockResolvedValueOnce(undefined);

      const actual = await CacheUnderTest.get(expectedPath);
      expect(cache.get).toHaveBeenCalledWith(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if cache get throws', async () => {
      const expectedPath = 'some/index.html';
      cache.get.mockRejectedValueOnce(new Error());

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if no response after 1s by default', async () => {
      const expectedPath = 'some/index.html';
      cache.get.mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(cached('value')), 1500);
        });
      });
      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns undefined if no response after configured readTimeout', async () => {
      const expectedPath = 'some/index.html';
      cache.get.mockImplementationOnce(() => {
        return new Promise(resolve => {
          setTimeout(() => resolve(cached('value')), 20);
        });
      });

      CacheUnderTest = TechDocsCache.fromConfig(
        new ConfigReader({
          techdocs: { cache: { readTimeout: 10 } },
        }),
        {
          cache: cache,
          logger: mockServices.logger.mock(),
        },
      );

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual).toBe(undefined);
    });

    it('returns data if cache get returns it', async () => {
      const expectedPath = 'some/index.html';
      cache.get.mockResolvedValueOnce(cached('expected value'));

      const actual = await CacheUnderTest.get(expectedPath);
      expect(actual?.toString()).toBe('expected value');
    });
  });

  describe('set', () => {
    it('sets a base64-encoded string', async () => {
      const expectedPath = 'some/index.html';
      cache.set.mockResolvedValueOnce(undefined);

      await CacheUnderTest.set(expectedPath, Buffer.from('some data'));
      expect(cache.set).toHaveBeenCalledWith(expectedPath, cached('some data'));
    });

    it('does not throw if client throws', () => {
      cache.set.mockRejectedValueOnce(new Error());
      expect(() => CacheUnderTest.set('i.html', Buffer.from(''))).not.toThrow();
    });
  });

  describe('invalidate', () => {
    it('calls delete on client', async () => {
      const expectedPath = 'some/index.html';
      cache.delete.mockResolvedValueOnce(undefined);

      await CacheUnderTest.invalidate(expectedPath);
      expect(cache.delete).toHaveBeenCalledWith(expectedPath);
    });
  });

  describe('invalidateMultiple', () => {
    it('calls delete once per given path', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      cache.delete.mockResolvedValue(undefined);

      await CacheUnderTest.invalidateMultiple(expectedPaths);
      expect(cache.delete).toHaveBeenNthCalledWith(1, expectedPaths[0]);
      expect(cache.delete).toHaveBeenNthCalledWith(2, expectedPaths[1]);
    });

    it('returns an array of as many paths provided', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      cache.delete.mockResolvedValue(undefined);

      const actual = await CacheUnderTest.invalidateMultiple(expectedPaths);
      expect(actual.length).toBe(2);
    });

    it('calls delete on all paths even if the first rejects', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      cache.delete.mockRejectedValueOnce(new Error());
      cache.delete.mockResolvedValueOnce(undefined);

      await expect(
        CacheUnderTest.invalidateMultiple(expectedPaths),
      ).rejects.toThrow(CacheInvalidationError);
      expect(cache.delete).toHaveBeenCalledTimes(2);
    });

    it('rejects with invalidations error response', async () => {
      const expectedPaths = ['one/index.html', 'two/index.html'];
      cache.delete.mockResolvedValueOnce(undefined);
      cache.delete.mockRejectedValueOnce(new Error());

      await expect(
        CacheUnderTest.invalidateMultiple.bind(CacheUnderTest, expectedPaths),
      ).rejects.toThrow(CacheInvalidationError);
    });
  });
});
