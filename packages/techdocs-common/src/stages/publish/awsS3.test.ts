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
import { AwsS3Publish } from './awsS3';

// NOTE: /packages/techdocs-common/__mocks__ is being used to mock aws-sdk client library

const rootDir = (global as any).rootDir; // Set by setupTests.ts

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(rootDir, namespace || ENTITY_DEFAULT_NAMESPACE, kind, name);
};

const logger = getVoidLogger();
const loggerInfoSpy = jest.spyOn(logger, 'info');
const loggerErrorSpy = jest.spyOn(logger, 'error');

const createPublisherFromConfig = ({
  bucketName = 'bucketName',
  bucketRootPath = '/',
  legacyUseCaseSensitiveTripletPaths = false,
}: {
  bucketName?: string;
  bucketRootPath?: string;
  legacyUseCaseSensitiveTripletPaths?: boolean;
} = {}) => {
  const mockConfig = new ConfigReader({
    techdocs: {
      requestUrl: 'http://localhost:7000',
      publisher: {
        type: 'awsS3',
        awsS3: {
          credentials: {
            accessKeyId: 'accessKeyId',
            secretAccessKey: 'secretAccessKey',
          },
          bucketName,
          bucketRootPath,
        },
      },
      legacyUseCaseSensitiveTripletPaths,
    },
  });

  return AwsS3Publish.fromConfig(mockConfig, logger);
};

describe('AwsS3Publish', () => {
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

  beforeEach(() => {
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
      const publisher = createPublisherFromConfig({
        bucketName: 'errorBucket',
      });
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: false,
      });
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

    it('should publish a directory when root path is specified', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      expect(await publisher.publish({ entity, directory })).toBeUndefined();
    });

    it('should publish a directory when root path is specified and legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
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

      const publisher = createPublisherFromConfig();

      const fails = publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(
          'Unable to upload file(s) to AWS S3. Error: Failed to read template directory: ENOENT, no such file or directory',
        ),
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });

    it('should delete stale files after upload', async () => {
      const bucketName = 'delete_stale_files_success';
      const publisher = createPublisherFromConfig({ bucketName: bucketName });
      await publisher.publish({ entity, directory });
      expect(loggerInfoSpy).toHaveBeenLastCalledWith(
        `Successfully deleted stale files for Entity ${entity.metadata.name}. Total number of files: 1`,
      );
    });

    it('should log error when the stale files deletion fails', async () => {
      const bucketName = 'delete_stale_files_error';
      const publisher = createPublisherFromConfig({ bucketName: bucketName });
      await publisher.publish({ entity, directory });
      expect(loggerErrorSpy).toHaveBeenLastCalledWith(
        'Unable to delete file(s) from AWS S3. Error: Message',
      );
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const publisher = createPublisherFromConfig();
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated if root path is specified', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated if root path is specified and legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return false if docs has not been generated', async () => {
      const publisher = createPublisherFromConfig();
      expect(
        await publisher.hasDocsBeenGenerated({
          kind: 'entity',
          metadata: {
            namespace: 'invalid',
            name: 'triplet',
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

    it('should return tech docs metadata even if root path is specified', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata if root path is specified and legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
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

    it('should pass expected object path to bucket if root path is specified', async () => {
      const rootPath = 'backstage-data/techdocs';
      const publisher = createPublisherFromConfig({
        bucketRootPath: rootPath,
      });
      await publisher.publish({ entity, directory });
      app = express().use(publisher.docsRouter());

      const pngResponse = await request(app).get(
        `/${rootPath}/${entityTripletPath}/img/with%20spaces.png`,
      );
      expect(Buffer.from(pngResponse.body).toString('utf8')).toEqual(
        'found it',
      );
      const jsResponse = await request(app).get(
        `/${rootPath}/${entityTripletPath}/some%20folder/also%20with%20spaces.js`,
      );
      expect(jsResponse.text).toEqual('found it too');
    });

    it('should pass expected object path to bucket if root path is specified and legacy case is enabled', async () => {
      const rootPath = 'backstage-data/techdocs';
      const publisher = createPublisherFromConfig({
        bucketRootPath: rootPath,
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      app = express().use(publisher.docsRouter());

      const pngResponse = await request(app).get(
        `/${rootPath}/${entityTripletPath}/img/with%20spaces.png`,
      );
      expect(Buffer.from(pngResponse.body).toString('utf8')).toEqual(
        'found it',
      );
      const jsResponse = await request(app).get(
        `/${rootPath}/${entityTripletPath}/some%20folder/also%20with%20spaces.js`,
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
