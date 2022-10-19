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
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import mockFs from 'mock-fs';
import path from 'path';
import fs from 'fs-extra';
import { Readable } from 'stream';
import { GoogleGCSPublish } from './googleStorage';
import {
  storageRootDir,
  StorageFilesMock,
} from '../../testUtils/StorageFilesMock';

jest.mock('@google-cloud/storage', () => {
  class GCSFile {
    constructor(
      private readonly filePath: string,
      private readonly storage: StorageFilesMock,
    ) {}

    exists() {
      return new Promise(async (resolve, reject) => {
        if (this.storage.fileExists(this.filePath)) {
          resolve([true]);
        } else {
          reject();
        }
      });
    }

    createReadStream() {
      const readable = new Readable();
      readable._read = () => {};

      process.nextTick(() => {
        if (this.storage.fileExists(this.filePath)) {
          if (readable.eventNames().includes('pipe')) {
            readable.emit('pipe');
          }
          readable.emit('data', this.storage.readFile(this.filePath));
          readable.emit('end');
        } else {
          readable.emit(
            'error',
            new Error(`The file ${this.filePath} does not exist!`),
          );
        }
      });

      return readable;
    }

    delete() {
      return Promise.resolve();
    }
  }

  class Bucket {
    constructor(
      private readonly bucketName: string,
      private readonly storage: StorageFilesMock,
    ) {}

    async getMetadata() {
      if (this.bucketName === 'bad_bucket_name') {
        throw Error('Bucket does not exist');
      }
      return '';
    }

    upload(source: string, { destination }: { destination: string }) {
      return new Promise(async resolve => {
        this.storage.writeFile(destination, source);
        resolve(null);
      });
    }

    file(destinationFilePath: string) {
      if (this.bucketName === 'delete_stale_files_error') {
        throw Error('Message');
      }
      return new GCSFile(destinationFilePath, this.storage);
    }

    getFilesStream() {
      const readable = new Readable();
      readable._read = () => {};

      process.nextTick(() => {
        if (
          this.bucketName === 'delete_stale_files_success' ||
          this.bucketName === 'delete_stale_files_error'
        ) {
          readable.emit('data', { name: 'stale-file.png' });
        }
        readable.emit('end');
      });

      return readable;
    }
  }

  class Storage {
    storage = new StorageFilesMock();

    constructor() {
      this.storage.emptyFiles();
    }

    bucket(bucketName: string) {
      return new Bucket(bucketName, this.storage);
    }
  }

  return {
    __esModule: true,
    Storage,
  };
});

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.join(storageRootDir, namespace || DEFAULT_NAMESPACE, kind, name);
};

const logger = getVoidLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);
jest.spyOn(logger, 'error').mockReturnValue(logger);

const createPublisherFromConfig = ({
  bucketName = 'bucketName',
  bucketRootPath = '/',
  legacyUseCaseSensitiveTripletPaths = false,
}: {
  bucketName?: string;
  bucketRootPath?: string;
  legacyUseCaseSensitiveTripletPaths?: boolean;
} = {}) => {
  const config = new ConfigReader({
    techdocs: {
      publisher: {
        type: 'googleGcs',
        googleGcs: {
          credentials: '{}',
          bucketName,
          bucketRootPath,
        },
      },
      legacyUseCaseSensitiveTripletPaths,
    },
  });
  return GoogleGCSPublish.fromConfig(config, logger);
};

describe('GoogleGCSPublish', () => {
  const entity = {
    apiVersion: 'version',
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
    build_timestamp: 612741599,
  };

  const directory = getEntityRootDir(entity);

  const files = {
    'index.html': '',
    '404.html': '',
    assets: {
      'main.css': '',
    },
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
        bucketName: 'bad_bucket_name',
      });
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: false,
      });
    });
  });

  describe('publish', () => {
    it('should publish a directory', async () => {
      const publisher = createPublisherFromConfig();
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'default/component/backstage/404.html',
          `default/component/backstage/index.html`,
          `default/component/backstage/assets/main.css`,
        ]),
      });
    });

    it('should publish a directory as well when legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'default/Component/backstage/404.html',
          `default/Component/backstage/index.html`,
          `default/Component/backstage/assets/main.css`,
        ]),
      });
    });

    it('should publish a directory when root path is specified', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'backstage-data/techdocs/default/component/backstage/404.html',
          `backstage-data/techdocs/default/component/backstage/index.html`,
          `backstage-data/techdocs/default/component/backstage/assets/main.css`,
        ]),
      });
    });

    it('should publish a directory when root path is specified and legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
        legacyUseCaseSensitiveTripletPaths: true,
      });
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'backstage-data/techdocs/default/Component/backstage/404.html',
          `backstage-data/techdocs/default/Component/backstage/index.html`,
          `backstage-data/techdocs/default/Component/backstage/assets/main.css`,
        ]),
      });
    });

    it('should fail to publish a directory', async () => {
      const wrongPathToGeneratedDirectory = path.join(
        storageRootDir,
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

      // Can not do exact error message match due to mockFs adding unexpected characters in the path when throwing the error
      // Issue reported https://github.com/tschaub/mock-fs/issues/118
      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(
          `Unable to upload file(s) to Google Cloud Storage. Error: Failed to read template directory: ENOENT, no such file or directory`,
        ),
      });

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });

    it('should delete stale files after upload', async () => {
      const bucketName = 'delete_stale_files_success';
      const publisher = createPublisherFromConfig({ bucketName });
      await publisher.publish({ entity, directory });
      expect(logger.info).toHaveBeenLastCalledWith(
        `Successfully deleted stale files for Entity ${entity.metadata.name}. Total number of files: 1`,
      );
    });

    it('should log error when the stale files deletion fails', async () => {
      const bucketName = 'delete_stale_files_error';
      const publisher = createPublisherFromConfig({ bucketName });
      await publisher.publish({ entity, directory });
      expect(logger.error).toHaveBeenLastCalledWith(
        'Unable to delete file(s) from Google Cloud Storage. Error: Message',
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

      const fails = publisher.fetchTechDocsMetadata(invalidEntityName);

      await expect(fails).rejects.toMatchObject({
        message: expect.stringMatching(/The file .* does not exist/i),
      });
    });
  });

  describe('docsRouter', () => {
    const entityTripletPath = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;
    // const entityTripletPath =

    let app: Express.Application;

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

    it('should pass expected object path to bucket if root path is specified and legacy case is enabled', async () => {
      const rootPath = 'backstage-data/techdocs';
      const publisher = createPublisherFromConfig({
        bucketRootPath: rootPath,
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      app = express().use(publisher.docsRouter());

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
