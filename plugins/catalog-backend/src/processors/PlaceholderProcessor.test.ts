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
import { Entity } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { ScmIntegrations } from '@backstage/integration';
import {
  CatalogProcessorResult,
  PlaceholderResolver,
  PlaceholderResolverParams,
  PlaceholderResolverRead,
} from '@backstage/plugin-catalog-node';
import {
  jsonPlaceholderResolver,
  PlaceholderProcessor,
  textPlaceholderResolver,
  yamlPlaceholderResolver,
} from './PlaceholderProcessor';
import { mockServices } from '@backstage/backend-test-utils';

const integrations = ScmIntegrations.fromConfig(new ConfigReader({}));

describe('PlaceholderProcessor', () => {
  const reader = mockServices.urlReader.mock();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns placeholder-free data unchanged', async () => {
    const input: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
    };
    const processor = new PlaceholderProcessor({
      resolvers: {
        foo: async () => 'replaced',
      },
      reader,
      integrations,
    });
    await expect(
      processor.preProcessEntity(input, { type: 't', target: 'l' }, () => {}),
    ).resolves.toBe(input);
  });

  it('replaces placeholders deep in the data', async () => {
    const upperResolver: PlaceholderResolver = jest.fn(async ({ value }) =>
      value!.toString().toUpperCase(),
    );
    const processor = new PlaceholderProcessor({
      resolvers: {
        upper: upperResolver,
      },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { a: [{ b: { $upper: 'text' } }] },
        },
        { type: 'fake', target: 'http://example.com' },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { a: [{ b: 'TEXT' }] },
    });

    expect(reader.readUrl).not.toHaveBeenCalled();
    expect(upperResolver).toHaveBeenCalledWith(
      expect.objectContaining({
        key: 'upper',
        value: 'text',
        baseUrl: 'http://example.com',
      }),
    );
  });

  it('ignores multiple placeholders', async () => {
    const processor = new PlaceholderProcessor({
      resolvers: {
        foo: jest.fn(),
        bar: jest.fn(),
      },
      reader,
      integrations,
    });
    const entity: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n', x: { $foo: 'a', $bar: 'b' } },
    };

    await expect(
      processor.preProcessEntity(entity, { type: 'a', target: 'b' }, () => {}),
    ).resolves.toEqual(entity);

    expect(reader.readUrl).not.toHaveBeenCalled();
  });

  it('ignores unknown placeholders', async () => {
    const processor = new PlaceholderProcessor({
      resolvers: {
        bar: jest.fn(),
      },
      reader,
      integrations,
    });
    const entity: Entity = {
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n', x: { $foo: 'a' } },
    };

    await expect(
      processor.preProcessEntity(entity, { type: 'a', target: 'b' }, () => {}),
    ).resolves.toEqual(entity);

    expect(reader.readUrl).not.toHaveBeenCalled();
  });

  it('works with the text resolver', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest.fn().mockResolvedValue(Buffer.from('TEXT', 'utf-8')),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $text: '../file.txt' } },
        },
        {
          type: 'url',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(reader.readUrl).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/a/file.txt',
    );
  });

  it('works with the json resolver', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest
        .fn()
        .mockResolvedValue(
          Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
        ),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { json: jsonPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $json: './file.json' } },
        },
        {
          type: 'url',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: { a: ['b', 7] } },
    });

    expect(reader.readUrl).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/a/b/file.json',
    );
  });

  it('works with the yaml resolver', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest
        .fn()
        .mockResolvedValue(Buffer.from('foo:\n  - bar: 7', 'utf-8')),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { yaml: yamlPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: { data: { $yaml: '../file.yaml' } },
        },
        {
          type: 'url',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: { foo: [{ bar: 7 }] } },
    });

    expect(reader.readUrl).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/a/file.yaml',
    );
  });

  it('resolves absolute path for absolute location', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest.fn().mockResolvedValue(Buffer.from('TEXT', 'utf-8')),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: 'https://github.com/backstage/backstage/catalog-info.yaml',
            },
          },
        },
        {
          type: 'url',
          target:
            'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(reader.readUrl).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
    );
  });

  it('resolves absolute path for relative file location', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest.fn().mockResolvedValue(Buffer.from('TEXT', 'utf-8')),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: 'https://github.com/backstage/backstage/catalog-info.yaml',
            },
          },
        },
        {
          type: 'url',
          target: './a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).resolves.toEqual({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { data: 'TEXT' },
    });

    expect(reader.readUrl).toHaveBeenCalledWith(
      'https://github.com/backstage/backstage/catalog-info.yaml',
    );
  });

  it('not resolves relative file path for relative file location', async () => {
    // We explicitly don't support this case, as it would allow for file system
    // traversal attacks. If we want to implement this, we need to have additional
    // security measures in place!
    reader.readUrl.mockResolvedValue({
      buffer: jest.fn().mockResolvedValue(Buffer.from('TEXT', 'utf-8')),
    });
    const processor = new PlaceholderProcessor({
      resolvers: { text: textPlaceholderResolver },
      reader,
      integrations,
    });

    await expect(
      processor.preProcessEntity(
        {
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: 'n' },
          spec: {
            data: {
              $text: '../c/catalog-info.yaml',
            },
          },
        },
        {
          type: 'url',
          target: './a/b/catalog-info.yaml',
        },
        () => {},
      ),
    ).rejects.toThrow(
      /^Placeholder \$text could not form a URL out of \.\/a\/b\/catalog-info\.yaml and \.\.\/c\/catalog-info\.yaml, TypeError/,
    );

    expect(reader.readUrl).not.toHaveBeenCalled();
  });
  it('should emit the resolverValue as a refreshKey', async () => {
    reader.readUrl.mockResolvedValue({
      buffer: jest
        .fn()
        .mockResolvedValue(
          Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
        ),
    });

    const processor = new PlaceholderProcessor({
      resolvers: {
        json: jsonPlaceholderResolver,
      },
      reader,
      integrations,
    });

    const emitted = new Array<CatalogProcessorResult>();
    await processor.preProcessEntity(
      {
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: 'n' },
        spec: { a: [{ b: { $json: './path-to-file.json' } }] },
      },
      { type: 'fake', target: 'http://example.com' },
      result => emitted.push(result),
    );
    expect(emitted[0]).toEqual({
      type: 'refresh',
      key: 'url:http://example.com/path-to-file.json',
    });
  });

  it('accepts arbitrary object as value', async () => {
    const processor = new PlaceholderProcessor({
      resolvers: {
        merge: async ({ value }) => {
          if (value instanceof Object) {
            return { merged: 'value', ...value };
          }
          return value;
        },
      },
      reader,
      integrations,
    });

    const result = await processor.preProcessEntity(
      {
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: 'n' },
        spec: { a: { $merge: { passed: 'value' } } },
      },
      { type: 'fake', target: 'http://example.com' },
      () => {},
    );

    expect(result).toMatchObject({
      apiVersion: 'a',
      kind: 'k',
      metadata: { name: 'n' },
      spec: { a: { passed: 'value', merged: 'value' } },
    });
  });
});

describe('yamlPlaceholderResolver', () => {
  const read: jest.MockedFunction<PlaceholderResolverRead> = jest.fn();
  const params: PlaceholderResolverParams = {
    key: 'a',
    value: './file.yaml',
    baseUrl: 'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
    read,
    resolveUrl: (url, base) => integrations.resolveUrl({ url, base }),
    emit: () => {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses valid yaml', async () => {
    read.mockResolvedValue(Buffer.from('foo:\n  - bar: 7', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).resolves.toEqual({
      foo: [{ bar: 7 }],
    });
  });

  it('rejects invalid yaml', async () => {
    read.mockResolvedValue(Buffer.from('a: 1\n----\n', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).rejects.toThrow(
      /Placeholder \$a found an error in the data at .\/file.yaml, YAMLParseError: Implicit map keys need to be followed by map values at line 2, column 1:\s+a: 1/,
    );
  });

  it('rejects multi-document yaml', async () => {
    read.mockResolvedValue(Buffer.from('foo: 1\n---\nbar: 2\n', 'utf-8'));
    await expect(yamlPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $a expected to find exactly one document of data at ./file.yaml, found 2',
    );
  });

  it('parses valid json', async () => {
    read.mockResolvedValue(
      Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
    );
    await expect(yamlPlaceholderResolver(params)).resolves.toEqual({
      a: ['b', 7],
    });
  });
});

describe('jsonPlaceholderResolver', () => {
  const read: jest.MockedFunction<PlaceholderResolverRead> = jest.fn();
  const params: PlaceholderResolverParams = {
    key: 'a',
    value: './file.json',
    baseUrl: 'https://github.com/backstage/backstage/a/b/catalog-info.yaml',
    read,
    resolveUrl: (url, base) => integrations.resolveUrl({ url, base }),
    emit: () => {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('parses valid json', async () => {
    read.mockResolvedValue(
      Buffer.from(JSON.stringify({ a: ['b', 7] }), 'utf-8'),
    );
    await expect(jsonPlaceholderResolver(params)).resolves.toEqual({
      a: ['b', 7],
    });
  });

  it('rejects invalid json', async () => {
    read.mockResolvedValue(Buffer.from('}', 'utf-8'));
    await expect(jsonPlaceholderResolver(params)).rejects.toThrow(
      'Placeholder $a failed to parse JSON data at ./file.json',
    );
  });
});
