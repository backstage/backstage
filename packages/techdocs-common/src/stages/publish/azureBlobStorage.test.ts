/*
 * Copyright 2020 Spotify AB
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
import mockFs from 'mock-fs';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { AzureBlobStoragePublish } from './azureBlobStorage';
import { PublisherBase } from './types';
import type { Entity } from '@backstage/catalog-model';
import type { Logger } from 'winston';

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      namespace: 'test-namespace',
      annotations: {
        ...annotations,
      },
    },
  };
};

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;
  const entityRootDir = `${namespace}/${kind}/${name}`;
  return entityRootDir;
};

function createLogger() {
  const logger = getVoidLogger();
  jest.spyOn(logger, 'info').mockReturnValue(logger);
  jest.spyOn(logger, 'error').mockReturnValue(logger);
  return logger;
}

let publisher: PublisherBase;

describe('publishing with valid credentials', () => {
  let logger: Logger;

  beforeEach(async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'azureBlobStorage',
          azureBlobStorage: {
            credentials: {
              accountName: 'accountName',
              accountKey: 'accountKey',
            },
            containerName: 'containerName',
          },
        },
      },
    });

    logger = createLogger();

    publisher = await AzureBlobStoragePublish.fromConfig(mockConfig, logger);
  });

  describe('publish', () => {
    it('should publish a directory', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'index.html': '',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });

      expect(
        await publisher.publish({
          entity,
          directory: entityRootDir,
        }),
      ).toBeUndefined();
      mockFs.restore();
    });

    it('should fail to publish a directory', async () => {
      const wrongPathToGeneratedDirectory = 'wrong/path/to/generatedDirectory';
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'index.html': '',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });

      await publisher
        .publish({
          entity,
          directory: wrongPathToGeneratedDirectory,
        })
        .catch(error =>
          expect(error.message).toContain(
            'Unable to upload file(s) to Azure Blob Storage. Failed to read template directory: ENOENT, no such file or directory',
          ),
        );
      mockFs.restore();
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'index.html': 'file-content',
        },
      });

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
      mockFs.restore();
    });

    it('should return false if docs has not been generated', async () => {
      const entity = createMockEntity();

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(false);
    });
  });
});

describe('error reporting', () => {
  it('reports an error when unable to read container properties', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'azureBlobStorage',
          azureBlobStorage: {
            credentials: {
              accountName: 'accountName',
            },
            containerName: 'bad_container',
          },
        },
      },
    });

    const logger = createLogger();

    let error;
    try {
      publisher = await AzureBlobStoragePublish.fromConfig(mockConfig, logger);
    } catch (e) {
      error = e;
    }

    expect(error).toBeInstanceOf(Error);

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Could not retrieve metadata about the Azure Blob Storage container bad_container.`,
      ),
    );
  });

  it('reports an error when bad account credentials', async () => {
    const mockConfig = new ConfigReader({
      techdocs: {
        requestUrl: 'http://localhost:7000',
        publisher: {
          type: 'azureBlobStorage',
          azureBlobStorage: {
            credentials: {
              accountName: 'failupload',
              accountKey: 'accountKey',
            },
            containerName: 'containerName',
          },
        },
      },
    });

    const logger = createLogger();

    publisher = await AzureBlobStoragePublish.fromConfig(mockConfig, logger);

    const entity = createMockEntity();
    const entityRootDir = getEntityRootDir(entity);

    mockFs({
      [entityRootDir]: {
        'index.html': '',
      },
    });

    let error;
    try {
      await publisher.publish({
        entity,
        directory: entityRootDir,
      });
    } catch (e) {
      error = e;
    }

    expect(error.message).toContain(
      `Unable to upload file(s) to Azure Blob Storage.`,
    );

    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(
        `Unable to upload file(s) to Azure Blob Storage. Upload failed for test-namespace/TestKind/test-component-name/index.html with status code 500`,
      ),
    );

    mockFs.restore();
  });
});
