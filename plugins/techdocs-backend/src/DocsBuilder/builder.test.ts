/*
 * Copyright 2026 The Backstage Authors
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
import { JsonObject } from '@backstage/types';
import { preserveTechDocsSources } from '@backstage/plugin-techdocs-node';
import fs from 'fs-extra';
import { DocsBuilder } from './builder';

const mockGeneratorRun = jest.fn().mockResolvedValue(undefined);
const mockPublisherPublish = jest.fn().mockResolvedValue({ objects: [] });
const mockPublisherHasDocsBeenGenerated = jest.fn().mockResolvedValue(false);
const mockFetchTechDocsMetadata = jest.fn().mockResolvedValue({});
const mockPreparerPrepare = jest.fn();
const mockPreparerShouldClean = jest.fn().mockReturnValue(false);

jest.mock('@backstage/plugin-techdocs-node', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-node'),
  getLocationForEntity: jest.fn().mockReturnValue({
    type: 'url',
    target: 'https://github.com/org/repo',
  }),
  preserveTechDocsSources: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('fs-extra', () => ({
  mkdtemp: jest.fn().mockResolvedValue('/tmp/techdocs-tmp-123'),
  realpathSync: jest.fn().mockImplementation((p: string) => p),
  remove: jest.fn().mockResolvedValue(undefined),
  readJson: jest.fn().mockResolvedValue({ etag: 'test-etag' }),
  writeJson: jest.fn().mockResolvedValue(undefined),
}));

function createEntity(annotation?: string): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: 'test-uid',
      name: 'test-component',
      annotations: {
        'backstage.io/techdocs-ref': 'dir:.',
        ...(annotation && {
          'backstage.io/techdocs-source-storage': annotation,
        }),
      },
    },
    spec: { type: 'service' },
  };
}

function createDocsBuilder(entity: Entity, preserveSources?: JsonObject) {
  const logger = {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as any;
  const builder = new DocsBuilder({
    preparers: {
      get: jest.fn().mockReturnValue({
        prepare: mockPreparerPrepare,
        shouldCleanPreparedDirectory: mockPreparerShouldClean,
      }),
    } as any,
    generators: {
      get: jest.fn().mockReturnValue({ run: mockGeneratorRun }),
    } as any,
    publisher: {
      publish: mockPublisherPublish,
      hasDocsBeenGenerated: mockPublisherHasDocsBeenGenerated,
      getReadiness: jest.fn().mockResolvedValue({ isAvailable: true }),
      fetchTechDocsMetadata: mockFetchTechDocsMetadata,
    } as any,
    entity,
    logger,
    config: new ConfigReader(
      preserveSources ? { techdocs: { generator: { preserveSources } } } : {},
    ),
    scmIntegrations: {} as any,
  });
  return { builder, logger };
}

/** Builds with the given settings and returns the stored fingerprint, if any. */
async function buildAndGetFingerprint(
  preserveSources?: JsonObject,
): Promise<string | undefined> {
  jest.mocked(fs.writeJson).mockClear();
  const { builder } = createDocsBuilder(createEntity(), preserveSources);
  await builder.build();
  const call = jest.mocked(fs.writeJson).mock.calls[0];
  return (call?.[1] as { source_storage?: string })?.source_storage;
}

describe('DocsBuilder source storage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPreparerPrepare.mockResolvedValue({
      preparedDir: '/tmp/prepared',
      etag: 'test-etag',
    });
    mockPublisherHasDocsBeenGenerated.mockResolvedValue(false);
    mockFetchTechDocsMetadata.mockResolvedValue({});
  });

  it.each([
    [undefined, undefined, false],
    [undefined, 'enabled', false],
    ['disabled', 'enabled', false],
    ['allowed', undefined, false],
    ['allowed', 'enabled', true],
    ['allowed', 'disabled', false],
    ['enabled', undefined, true],
    ['enabled', 'disabled', false],
    ['enabled', 'bogus', true],
  ])(
    'with mode %s and annotation %s, stores sources: %s',
    async (mode, annotation, expected) => {
      const { builder } = createDocsBuilder(
        createEntity(annotation),
        mode ? { mode } : undefined,
      );
      await builder.build();
      expect(jest.mocked(preserveTechDocsSources).mock.calls.length).toBe(
        expected ? 1 : 0,
      );
    },
  );

  it('passes settings to the helper and records them in the metadata', async () => {
    const { builder, logger } = createDocsBuilder(createEntity('bogus'), {
      mode: 'enabled',
      excludes: ['*.png'],
      additionalFiles: ['CONTRIBUTING.md'],
    });
    await builder.build();

    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "unrecognized backstage.io/techdocs-source-storage annotation value 'bogus'",
      ),
    );
    expect(preserveTechDocsSources).toHaveBeenCalledWith({
      inputDir: '/tmp/prepared',
      outputDir: '/tmp/techdocs-tmp-123',
      logger,
      excludes: ['*.png'],
      additionalFiles: ['CONTRIBUTING.md'],
      etag: 'test-etag',
    });
    expect(fs.writeJson).toHaveBeenCalledWith(
      '/tmp/techdocs-tmp-123/techdocs_metadata.json',
      expect.objectContaining({ source_storage: expect.any(String) }),
    );
    expect(mockGeneratorRun).toHaveBeenCalledWith(
      expect.not.objectContaining({ preserveSources: expect.anything() }),
    );
  });

  it('rejects an unknown mode', async () => {
    const { builder } = createDocsBuilder(createEntity(), { mode: 'maybe' });
    await expect(builder.build()).rejects.toThrow(
      "Invalid techdocs.generator.preserveSources.mode 'maybe'",
    );
  });

  it('only reuses the stored site when the source storage settings are unchanged', async () => {
    const enabled = { mode: 'enabled' };
    const fingerprint = await buildAndGetFingerprint(enabled);
    expect(fingerprint).toEqual(expect.any(String));
    expect(
      await buildAndGetFingerprint({ ...enabled, excludes: ['*.png'] }),
    ).not.toBe(fingerprint);

    mockPublisherHasDocsBeenGenerated.mockResolvedValue(true);
    const preparedWithEtag = async (
      stored: JsonObject,
      settings?: JsonObject,
    ) => {
      mockFetchTechDocsMetadata.mockResolvedValue({
        etag: 'stored-etag',
        ...stored,
      });
      mockPreparerPrepare.mockClear();
      const { builder } = createDocsBuilder(createEntity(), settings);
      await builder.build();
      return mockPreparerPrepare.mock.calls[0][1].etag;
    };

    // Unchanged settings keep the cache check
    expect(await preparedWithEtag({}, undefined)).toBe('stored-etag');
    expect(
      await preparedWithEtag({ source_storage: fingerprint }, enabled),
    ).toBe('stored-etag');
    // Turning source storage on or off, or changing its settings, forces a rebuild
    expect(await preparedWithEtag({}, enabled)).toBeUndefined();
    expect(
      await preparedWithEtag({ source_storage: fingerprint }, undefined),
    ).toBeUndefined();
    expect(
      await preparedWithEtag(
        { source_storage: fingerprint },
        { ...enabled, excludes: ['*.png'] },
      ),
    ).toBeUndefined();
  });
});
