/*
 * Copyright 2022 The Backstage Authors
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
  getVoidLogger,
  ReadUrlResponse,
  UrlReader,
  UrlReaders,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { Readable } from 'stream';
import { NewlineDelimitedJsonCollatorFactory } from './NewlineDelimitedJsonCollatorFactory';
import { TestPipeline } from '../test-utils';

describe('DefaultCatalogCollatorFactory', () => {
  const config = new ConfigReader({});
  const logger = getVoidLogger();

  it('has expected type', () => {
    const factory = NewlineDelimitedJsonCollatorFactory.fromConfig(config, {
      type: 'expected-type',
      searchPattern: 'test://folder/prefix-*',
      logger,
      reader: UrlReaders.default({ logger, config }),
    });
    expect(factory.type).toBe('expected-type');
  });

  describe('getCollator', () => {
    let readable: Readable;
    let reader: jest.Mocked<
      UrlReader & { readUrl: jest.Mock<Promise<ReadUrlResponse>> }
    >;
    let factory: NewlineDelimitedJsonCollatorFactory;

    beforeEach(async () => {
      jest.clearAllMocks();

      readable = new Readable();
      readable._read = () => {};
      reader = {
        search: jest.fn(),
        read: jest.fn(),
        readTree: jest.fn(),
        readUrl: jest.fn(),
      };
      factory = NewlineDelimitedJsonCollatorFactory.fromConfig(config, {
        type: 'expected-type',
        searchPattern: 'test://folder/prefix-*',
        logger,
        reader: UrlReaders.create({
          logger,
          config,
          factories: [() => [{ predicate: () => true, reader }]],
        }),
      });
    });

    it('throws if url reader throws an error during search', async () => {
      reader.search.mockRejectedValue(new Error('Expected error'));

      await expect(() => factory.getCollator()).rejects.toThrowError(
        'Expected error',
      );
    });

    it('throws if no matching files are found', async () => {
      reader.search.mockResolvedValue({ files: [], etag: '' });

      await expect(() => factory.getCollator()).rejects.toThrowError(
        'Could not find an .ndjson file matching',
      );
    });

    it('throws if matching file is not .ndjson', async () => {
      reader.search.mockResolvedValue({
        files: [{ url: 'test://folder/prefix-1.avro', content: jest.fn() }],
        etag: '',
      });
      reader.readUrl.mockResolvedValue({
        buffer: jest.fn(),
        stream: jest.fn().mockReturnValue(readable),
      });

      await expect(() => factory.getCollator()).rejects.toThrowError(
        'Could not find an .ndjson file matching',
      );
    });

    it('gets stream using latest matched url', async () => {
      reader.search.mockResolvedValue({
        files: [
          { url: 'test://folder/prefix-1.ndjson', content: jest.fn() },
          { url: 'test://folder/prefix-2.ndjson', content: jest.fn() },
        ],
        etag: '',
      });
      reader.readUrl.mockResolvedValue({
        buffer: jest.fn(),
        stream: jest.fn().mockReturnValue(readable),
      });

      await factory.getCollator();

      expect(reader.search).toHaveBeenCalledWith(
        'test://folder/prefix-*',
        undefined,
      );
      expect(reader.readUrl).toHaveBeenCalledWith(
        'test://folder/prefix-2.ndjson',
        undefined,
      );
    });

    it('transforms newline delimited json into readable stream of documents', async () => {
      reader.search.mockResolvedValue({
        files: [{ url: 'test://folder/prefix-1.ndjson', content: jest.fn() }],
        etag: '',
      });
      reader.readUrl.mockResolvedValue({
        buffer: jest.fn(),
        stream: jest
          .fn()
          .mockReturnValue(
            Readable.from(
              '{"title": "Title 1", "location": "/title-1", "text": "text 1"}\n{"title": "Title 2", "location": "/title-2", "text": "text 2"}',
            ),
          ),
      });

      const collator = await factory.getCollator();
      const pipeline = TestPipeline.withSubject(collator);
      const { documents } = await pipeline.execute();

      expect(documents).toHaveLength(2);
      expect(documents[0].title).toBe('Title 1');
      expect(documents[0].location).toBe('/title-1');
      expect(documents[0].text).toBe('text 1');
      expect(documents[1].title).toBe('Title 2');
      expect(documents[1].location).toBe('/title-2');
      expect(documents[1].text).toBe('text 2');
    });
  });
});
