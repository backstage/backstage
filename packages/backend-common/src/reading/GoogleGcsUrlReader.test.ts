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

import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { getVoidLogger } from '../logging';
import { DefaultReadTreeResponseFactory } from './tree';
import { GoogleGcsUrlReader } from './GoogleGcsUrlReader';
import { UrlReaderPredicateTuple } from './types';

const bucketGetFilesMock = jest.fn();
jest.mock('@google-cloud/storage', () => {
  class Bucket {
    getFiles(query: any) {
      return bucketGetFilesMock(query);
    }
  }
  class Storage {
    bucket() {
      return new Bucket();
    }
  }
  return {
    __esModule: true,
    Storage,
  };
});

describe('GcsUrlReader', () => {
  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return GoogleGcsUrlReader.factory({
      config: new ConfigReader(config),
      logger: getVoidLogger(),
      treeResponseFactory: DefaultReadTreeResponseFactory.create({
        config: new ConfigReader({}),
      }),
    });
  };

  it('does not create a reader without the googleGcs field', () => {
    const entries = createReader({
      integrations: {},
    });
    expect(entries).toHaveLength(0);
  });

  it('creates a reader with credentials correctly configured', () => {
    const entries = createReader({
      integrations: {
        googleGcs: {
          privateKey: '--- BEGIN KEY ---- fakekey --- END KEY ---',
          clientEmail: 'someone@example.com',
        },
      },
    });
    expect(entries).toHaveLength(1);
  });

  it('creates a reader with default credentials provider', () => {
    const entries = createReader({
      integrations: {
        googleGcs: {},
      },
    });
    expect(entries).toHaveLength(1);
  });

  describe('predicates', () => {
    const readers = createReader({
      integrations: {
        googleGcs: {},
      },
    });
    const predicate = readers[0].predicate;

    it('returns true for the correct google cloud storage host', () => {
      expect(predicate(new URL('https://storage.cloud.google.com'))).toBe(true);
    });
    it('returns true for a url with the full path and the correct host', () => {
      expect(
        predicate(
          new URL(
            'https://storage.cloud.google.com/team1/service1/catalog-info.yaml',
          ),
        ),
      ).toBe(true);
    });
    it('returns false for the wrong hostname under cloud.google.com', () => {
      expect(predicate(new URL('https://storage2.cloud.google.com'))).toBe(
        false,
      );
    });
    it('returns false for a partially correct host', () => {
      expect(predicate(new URL('https://cloud.google.com'))).toBe(false);
    });
    it('returns false for a completely different host', () => {
      expect(predicate(new URL('https://a.example.com/test'))).toBe(false);
    });
  });

  describe('search', () => {
    const { reader } = createReader({ integrations: { googleGcs: {} } })[0];

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('throws if search url does not end with *', async () => {
      const glob = 'https://storage.cloud.google.com/bucket/no-asterisk';
      await expect(() => reader.search(glob)).rejects.toThrow(
        'GcsUrlReader only supports prefix-based searches',
      );
    });

    it('throws if search url looks truly glob-y', async () => {
      const glob = 'https://storage.cloud.google.com/bucket/**/path*';
      await expect(() => reader.search(glob)).rejects.toThrowError(
        'GcsUrlReader only supports prefix-based searches',
      );
    });

    it('searches with expected prefix and pagination', () => {
      bucketGetFilesMock.mockResolvedValue([[]]);
      const glob = 'https://storage.cloud.google.com/bucket/path/some-prefix-*';

      reader.search(glob);
      expect(bucketGetFilesMock).toHaveBeenCalledWith(
        expect.objectContaining({
          autoPaginate: true,
          prefix: 'path/some-prefix-',
        }),
      );
    });

    it('returns valid SearchResponse object', async () => {
      const expectedFile = { name: 'path/some-prefix-1.txt' };
      bucketGetFilesMock.mockResolvedValue([[expectedFile]]);
      const glob = 'https://storage.cloud.google.com/bucket/path/some-prefix-*';

      const result = await reader.search(glob);
      expect(result.files).toHaveLength(1);
      expect(result.files[0].url).toEqual(
        'https://storage.cloud.google.com/bucket/path/some-prefix-1.txt',
      );
    });
  });
});
