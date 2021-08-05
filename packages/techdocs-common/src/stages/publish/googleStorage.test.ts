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
import { GoogleGCSPublish } from './googleStorage';

// NOTE: /packages/techdocs-common/__mocks__ is being used to mock Google Cloud Storage client library

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

const createPublisherFromConfig = ({
  bucketName = 'bucketName',
  legacyUseCaseSensitiveTripletPaths = false,
}: {
  bucketName?: string;
  legacyUseCaseSensitiveTripletPaths?: boolean;
} = {}) => {
  const mockConfig = new ConfigReader({
    techdocs: {
      requestUrl: 'http://localhost:7000',
      publisher: {
        type: 'googleGcs',
        googleGcs: {
          credentials: '{}',
          bucketName,
        },
      },
      legacyUseCaseSensitiveTripletPaths,
    },
  });

  return GoogleGCSPublish.fromConfig(mockConfig, logger);
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

  beforeAll(() => {
    mockFs({
      [localRootDir]: files,
      [storageRootDir]: files,
      [storageSingleQuoteDir]: {
        'techdocs_metadata.json': files['techdocs_metadata.json'].replace(
          /"/g,
          "'",
        ),
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
      expect(
        await publisher.publish({
          entity,
          directory: localRootDir,
        }),
      ).toBeUndefined();
    });

    it('should publish a directory as well when legacy casing is used', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
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
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const publisher = createPublisherFromConfig();
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
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
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
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

      const techDocsMetadaFilePath = path.join(
        rootDir,
        ...Object.values(invalidEntityName),
        'techdocs_metadata.json',
      );

      const fails = publisher.fetchTechDocsMetadata(invalidEntityName);

      await expect(fails).rejects.toMatchObject({
        message: `The file ${techDocsMetadaFilePath} does not exist !`,
      });
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

    it('should pass expected object path to bucket even if the legacy case is enabled', async () => {
      const publisher = createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
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
  });
});
