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

import { getVoidLogger } from '@backstage/backend-common';
import { Entity, ENTITY_DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import mockFs from 'mock-fs';
import os from 'os';
import path from 'path';
import { AzureBlobStoragePublish } from './azureBlobStorage';

// NOTE: /packages/techdocs-common/__mocks__ is being used to mock Azure client library

const rootDir = os.platform() === 'win32' ? 'C:\\rootDir' : '/rootDir';

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(rootDir, namespace || ENTITY_DEFAULT_NAMESPACE, kind, name);
};

const logger = getVoidLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);
jest.spyOn(logger, 'error').mockReturnValue(logger);

const createPublisherFromConfig = ({
  accountName = 'accountName',
  containerName = 'containerName',
}: undefined | { accountName?: string; containerName?: string } = {}) => {
  const mockConfig = new ConfigReader({
    techdocs: {
      requestUrl: 'http://localhost:7000',
      publisher: {
        type: 'azureBlobStorage',
        azureBlobStorage: {
          credentials: {
            accountName,
            accountKey: 'accountKey',
          },
          containerName,
        },
      },
    },
  });

  return AzureBlobStoragePublish.fromConfig(mockConfig, logger);
};

describe('publishing with valid credentials', () => {
  const entity = {
    apiVersion: '1',
    kind: 'Component',
    metadata: {
      name: 'backstage',
      namespace: 'default',
      annotations: {},
    },
  };

  const entityName = {
    kind: 'Component',
    name: 'backstage',
    namespace: 'default',
  };

  const techdocsMetadata = {
    site_name: 'backstage',
    site_description: 'site_content',
    etag: 'etag',
  };

  const localRootDir = getEntityRootDir(entity);
  const storageRootDir = getEntityRootDir({
    ...entity,
    kind: entity.kind.toLowerCase(),
  });
  const storageSingleQuoteDir = getEntityRootDir({
    metadata: {
      namespace: 'storage',
      name: 'quote',
    },
    kind: 'single',
  } as Entity);

  beforeEach(() => {
    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  beforeAll(async () => {
    mockFs({
      [localRootDir]: {
        'index.html': 'file-content',
        '404.html': '',
        assets: {
          'main.css': '',
        },
        'techdocs_metadata.json': JSON.stringify(techdocsMetadata),
      },
      [storageRootDir]: {
        'index.html': '',
        'techdocs_metadata.json': JSON.stringify(techdocsMetadata),
        html: {
          'unsafe.html': '<html></html>',
        },
        img: {
          'with spaces.png': 'found it',
          'unsafe.svg': '<svg></svg>',
        },
        'some folder': {
          'also with spaces.js': 'found it too',
        },
      },
      [storageSingleQuoteDir]: {
        'techdocs_metadata.json': `{'site_name': 'backstage', 'site_description': 'site_content', 'etag': 'etag'}`,
      },
    });
  });

  afterAll(() => {
    mockFs.restore();
  });

  describe('getReadiness', () => {
    it('should validate correct config', async () => {
      const publisher = createPublisherFromConfig();
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: true,
      });
    });

    it('should reject incorrect config', async () => {
      const publisher = createPublisherFromConfig({
        containerName: 'bad_container',
      });

      expect(await publisher.getReadiness()).toEqual({
        isAvailable: false,
      });

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `Could not retrieve metadata about the Azure Blob Storage container bad_container.`,
        ),
      );
    });
  });

  describe('publish', () => {
    it('should publish a directory', async () => {
      const publisher = createPublisherFromConfig();
      expect(
        await publisher.publish({
          entity,
          directory: localRootDir,
        }),
      ).toBeUndefined();
    });

    it('should fail to publish a directory', async () => {
      const wrongPathToGeneratedDirectory = path.join(
        rootDir,
        'wrong',
        'path',
        'to',
        'generatedDirectory',
      );

      const publisher = createPublisherFromConfig({
        containerName: 'bad_container',
      });

      const fails = publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(
          `Unable to upload file(s) to Azure Blob Storage. Error: Failed to read template directory: ENOENT, no such file or directory`,
        ),
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });

    it('reports an error when bad account credentials', async () => {
      const publisher = createPublisherFromConfig({
        accountName: 'failupload',
      });

      let error;
      try {
        await publisher.publish({
          entity,
          directory: localRootDir,
        });
      } catch (e) {
        error = e;
      }

      expect(error.message).toContain(
        `Unable to upload file(s) to Azure Blob Storage.`,
      );

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `Unable to upload file(s) to Azure Blob Storage. Error: Upload failed for ${path.join(
            localRootDir,
            '404.html',
          )} with status code 500`,
        ),
      );
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const publisher = createPublisherFromConfig();
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return false if docs has not been generated', async () => {
      const publisher = createPublisherFromConfig();
      expect(
        await publisher.hasDocsBeenGenerated({
          kind: 'triplet',
          metadata: {
            namespace: 'invalid',
            name: 'path',
          },
        } as Entity),
      ).toBe(false);
    });
  });

  describe('fetchTechDocsMetadata', () => {
    it('should return tech docs metadata', async () => {
      const publisher = createPublisherFromConfig();
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata when json encoded with single quotes', async () => {
      const publisher = createPublisherFromConfig();
      expect(
        await publisher.fetchTechDocsMetadata({
          namespace: 'storage',
          kind: 'single',
          name: 'quote',
        }),
      ).toStrictEqual(techdocsMetadata);
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const publisher = createPublisherFromConfig();
      const invalidEntityName = {
        namespace: 'invalid',
        kind: 'triplet',
        name: 'path',
      };

      let error;
      try {
        await publisher.fetchTechDocsMetadata(invalidEntityName);
      } catch (e) {
        error = e;
      }

      expect(error).toEqual(
        new Error(
          `TechDocs metadata fetch failed, The file ${path.join(
            rootDir,
            ...Object.values(invalidEntityName),
            'techdocs_metadata.json',
          )} does not exist !`,
        ),
      );
    });
  });

  describe('docsRouter', () => {
    const entityTripletPath = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

    let app: express.Express;

    beforeEach(() => {
      const publisher = createPublisherFromConfig();
      app = express().use(publisher.docsRouter());
    });

    it('should pass expected object path to bucket', async () => {
      // Ensures leading slash is trimmed and encoded path is decoded.
      const pngResponse = await request(app).get(
        `/${entityTripletPath}/img/with%20spaces.png`,
      );
      expect(Buffer.from(pngResponse.body).toString('utf8')).toEqual(
        'found it',
      );
      const jsResponse = await request(app).get(
        `/${entityTripletPath}/some%20folder/also%20with%20spaces.js`,
      );
      expect(jsResponse.text).toEqual('found it too');
    });

    it('should pass text/plain content-type for html', async () => {
      const htmlResponse = await request(app).get(
        `/${entityTripletPath}/html/unsafe.html`,
      );
      expect(htmlResponse.text).toEqual('<html></html>');
      expect(htmlResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });

      const svgResponse = await request(app).get(
        `/${entityTripletPath}/img/unsafe.svg`,
      );
      expect(svgResponse.text).toEqual('<svg></svg>');
      expect(svgResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });
    });
  });
});
