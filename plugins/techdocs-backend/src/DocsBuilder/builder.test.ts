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
import { DocsBuilder } from './builder';

const mockGeneratorRun = jest.fn().mockResolvedValue(undefined);
const mockPublisherPublish = jest.fn().mockResolvedValue({ objects: [] });
const mockPublisherHasDocsBeenGenerated = jest.fn().mockResolvedValue(false);
const mockPreparerPrepare = jest.fn().mockResolvedValue({
  preparedDir: '/tmp/prepared',
  etag: 'test-etag',
});
const mockPreparerShouldClean = jest.fn().mockReturnValue(false);

jest.mock('@backstage/plugin-techdocs-node', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-node'),
  getLocationForEntity: jest.fn().mockReturnValue({
    type: 'url',
    target: 'https://github.com/org/repo',
  }),
}));

jest.mock('fs-extra', () => ({
  mkdtemp: jest.fn().mockResolvedValue('/tmp/techdocs-tmp-123'),
  realpathSync: jest.fn().mockImplementation((p: string) => p),
  remove: jest.fn().mockResolvedValue(undefined),
}));

function createMockLogger() {
  return {
    info: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  } as any;
}

function createEntity(annotations?: Record<string, string>): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: 'test-uid',
      name: 'test-component',
      annotations: {
        'backstage.io/techdocs-ref': 'dir:.',
        ...annotations,
      },
    },
    spec: { type: 'service' },
  };
}

function createDocsBuilder(
  entity: Entity,
  configData: Record<string, any> = {},
) {
  const logger = createMockLogger();
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
      fetchTechDocsMetadata: jest.fn().mockResolvedValue({}),
    } as any,
    entity,
    logger,
    config: new ConfigReader(configData),
    scmIntegrations: {} as any,
  });
  return { builder, logger };
}

describe('DocsBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPreparerPrepare.mockResolvedValue({
      preparedDir: '/tmp/prepared',
      etag: 'test-etag',
    });
    mockPublisherHasDocsBeenGenerated.mockResolvedValue(false);
    mockPublisherPublish.mockResolvedValue({ objects: [] });
    mockGeneratorRun.mockResolvedValue(undefined);
  });

  describe('preserveSources resolution', () => {
    it('should default preserveSources to false when no config or annotation', async () => {
      const { builder } = createDocsBuilder(createEntity());
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: false,
        }),
      );
    });

    it('should set preserveSources to true when global config is enabled', async () => {
      const { builder } = createDocsBuilder(createEntity(), {
        techdocs: {
          generator: {
            preserveSources: { enabled: true },
          },
        },
      });
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: true,
        }),
      );
    });

    it('should override global config when annotation is set to enabled', async () => {
      const entity = createEntity({
        'backstage.io/techdocs-source-storage': 'enabled',
      });
      const { builder } = createDocsBuilder(entity);
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: true,
        }),
      );
    });

    it('should override global config when annotation is set to disabled', async () => {
      const entity = createEntity({
        'backstage.io/techdocs-source-storage': 'disabled',
      });
      const { builder } = createDocsBuilder(entity, {
        techdocs: {
          generator: {
            preserveSources: { enabled: true },
          },
        },
      });
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: false,
        }),
      );
    });

    it('should warn and fall back to config for unrecognized annotation values', async () => {
      const entity = createEntity({
        'backstage.io/techdocs-source-storage': 'true',
      });
      const { builder, logger } = createDocsBuilder(entity);
      await builder.build();

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining(
          "Ignoring unrecognized backstage.io/techdocs-source-storage annotation value 'true'",
        ),
      );
      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: false,
        }),
      );
    });

    it('should pass sourceExcludes from config', async () => {
      const { builder } = createDocsBuilder(createEntity(), {
        techdocs: {
          generator: {
            preserveSources: {
              enabled: true,
              excludes: ['*.png', '*.jpg'],
            },
          },
        },
      });
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: true,
          sourceExcludes: ['*.png', '*.jpg'],
        }),
      );
    });

    it('should pass undefined sourceExcludes when not configured', async () => {
      const { builder } = createDocsBuilder(createEntity(), {
        techdocs: {
          generator: {
            preserveSources: { enabled: true },
          },
        },
      });
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: true,
          sourceExcludes: undefined,
        }),
      );
    });

    it('should pass additionalFiles from config', async () => {
      const { builder } = createDocsBuilder(createEntity(), {
        techdocs: {
          generator: {
            preserveSources: {
              enabled: true,
              additionalFiles: ['README.md', 'CONTRIBUTING.md'],
            },
          },
        },
      });
      await builder.build();

      expect(mockGeneratorRun).toHaveBeenCalledWith(
        expect.objectContaining({
          preserveSources: true,
          sourceAdditionalFiles: ['README.md', 'CONTRIBUTING.md'],
        }),
      );
    });
  });
});
