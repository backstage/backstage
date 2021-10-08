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
import path from 'path';
import fs from 'fs-extra';
import { AzureBlobStoragePublish } from './azureBlobStorage';

// NOTE: /packages/techdocs-common/__mocks__ is being used to mock Azure client library

const rootDir = global.rootDir;

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(rootDir, namespace || ENTITY_DEFAULT_NAMESPACE, kind, name);
};

const logger = getVoidLogger();
jest.spyOn(logger, 'error').mockReturnValue(logger);

const createPublisherFromConfig = ({
  accountName = 'accountName',
  containerName = 'containerName',
  legacyUseCaseSensitiveTripletPaths = false,
}: {
  accountName?: string;
  containerName?: string;
  legacyUseCaseSensitiveTripletPaths?: boolean;
} = {}) => {
  const config = new ConfigReader({
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
      legacyUseCaseSensitiveTripletPaths,
    },
  });
  return AzureBlobStoragePublish.fromConfig(config, logger);
};

describe('AzureBlobStoragePublish', () => {
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

  const directory = getEntityRootDir(entity);

  beforeEach(() => {
    (logger.error as jest.Mock).mockClear();
  });

  const files = {
    'index.html': '',
    '404.html': '',
    'techdocs_metadata.json': JSON.stringify(techdocsMetadata),
    assets: {
      'main.css': '',
    },
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
  };

  beforeEach(async () => {
    mockFs({
      [directory]: files,
    });
  });

  afterEach(() => {
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
      const errorPublisher = createPublisherFromConfig({
        containerName: 'bad_container',
      });

      expect(await errorPublisher.getReadiness()).toEqual({
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
      expect(await publisher.publish({ entity, directory })).toBeUndefined();
    });

    it('should publish a directory as well when legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      expect(await publisher.publish({ entity, directory })).toBeUndefined();
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
          'Unable to upload file(s) to Azure. Error: Failed to read template directory: ENOENT, no such file or directory',
        ),
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });

    it('reports an error when bad account credentials', async () => {
      const publisher = createPublisherFromConfig({
        accountName: 'bad_account_credentials',
      });

      let error;
      try {
        await publisher.publish({ entity, directory });
      } catch (e: any) {
        error = e;
      }

      expect(error.message).toContain(`Unable to upload file(s) to Azure`);

      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining(
          `Unable to upload file(s) to Azure. Error: Upload failed for ${path.join(
            directory,
            '404.html',
          )} with status code 500`,
        ),
      );
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should check expected file', async () => {
      const publisher = createPublisherFromConfig();
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should check expected file when legacy case flag is passed', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
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
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata when json encoded with single quotes', async () => {
      const techdocsMetadataPath = path.join(
        directory,
        'techdocs_metadata.json',
      );
      const techdocsMetadataContent = files['techdocs_metadata.json'];

      fs.writeFileSync(
        techdocsMetadataPath,
        techdocsMetadataContent.replace(/"/g, "'"),
      );

      const publisher = createPublisherFromConfig();
      await publisher.publish({ entity, directory });

      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );

      fs.writeFileSync(techdocsMetadataPath, techdocsMetadataContent);
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const publisher = createPublisherFromConfig();

      const invalidEntityName = {
        namespace: 'invalid',
        kind: 'triplet',
        name: 'path',
      };

      const techDocsMetadaFilePath = path.posix.join(
        ...Object.values(invalidEntityName),
        'techdocs_metadata.json',
      );

      const fails = publisher.fetchTechDocsMetadata(invalidEntityName);

      await expect(fails).rejects.toMatchObject({
        message: `TechDocs metadata fetch failed; caused by Error: The file ${techDocsMetadaFilePath} does not exist!`,
      });
    });
  });

  describe('docsRouter', () => {
    const entityTripletPath = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

    let app: express.Express;

    beforeEach(async () => {
      const publisher = createPublisherFromConfig();
      await publisher.publish({ entity, directory });
      app = express().use(publisher.docsRouter());
    });

    afterEach(() => {
      mockFs.restore();
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

    it('should pass expected object path to bucket even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      app = express().use(publisher.docsRouter());
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

    it('should return 404 if file is not found', async () => {
      const response = await request(app).get(
        `/${entityTripletPath}/not-found.html`,
      );
      expect(response.status).toBe(404);

      expect(Buffer.from(response.text).toString('utf8')).toEqual(
        'File Not Found',
      );
    });
  });
});
