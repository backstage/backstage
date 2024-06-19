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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  Entity,
  CompoundEntityRef,
  DEFAULT_NAMESPACE,
} from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import fs from 'fs-extra';
import path from 'path';
import { OpenStackSwiftPublish } from './openStackSwift';
import { PublisherBase, TechDocsMetadata } from './types';
import { Stream, Readable } from 'stream';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';

const mockDir = createMockDirectory();

jest.mock('@trendyol-js/openstack-swift-sdk', () => {
  const {
    ContainerMetaResponse,
    DownloadResponse,
    NotFound,
    ObjectMetaResponse,
    UploadResponse,
  }: typeof import('@trendyol-js/openstack-swift-sdk') = jest.requireActual(
    '@trendyol-js/openstack-swift-sdk',
  );

  const checkFileExists = async (Key: string): Promise<boolean> => {
    // Key will always have / as file separator irrespective of OS since cloud providers expects /.
    // Normalize Key to OS specific path before checking if file exists.
    const filePath = mockDir.resolve(Key);

    try {
      await fs.access(filePath, fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  };

  const streamToBuffer = (stream: Stream | Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      try {
        const chunks: any[] = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.on('end', () => resolve(Buffer.concat(chunks)));
      } catch (e) {
        throw new Error(`Unable to parse the response data ${e.message}`);
      }
    });
  };

  return {
    __esModule: true,
    SwiftClient: class {
      async getMetadata(_containerName: string, file: string) {
        const fileExists = await checkFileExists(file);
        if (fileExists) {
          return new ObjectMetaResponse({
            fullPath: file,
          });
        }
        return new NotFound();
      }

      async getContainerMetadata(containerName: string) {
        if (containerName === 'mock') {
          return new ContainerMetaResponse({
            size: 10,
          });
        }
        return new NotFound();
      }

      async upload(
        _containerName: string,
        destination: string,
        stream: Readable,
      ) {
        try {
          const filePath = mockDir.resolve(destination);
          const fileBuffer = await streamToBuffer(stream);

          await fs.writeFile(filePath, fileBuffer);
          const fileExists = await checkFileExists(destination);

          if (fileExists) {
            return new UploadResponse(filePath);
          }
          const errorMessage = `Unable to upload file(s) to OpenStack Swift.`;
          throw new Error(errorMessage);
        } catch (error) {
          const errorMessage = `Unable to upload file(s) to OpenStack Swift. ${error}`;
          throw new Error(errorMessage);
        }
      }

      async download(_containerName: string, file: string) {
        const filePath = mockDir.resolve(file);
        const fileExists = await checkFileExists(file);
        if (!fileExists) {
          return new NotFound();
        }
        return new DownloadResponse([], fs.createReadStream(filePath));
      }
    },
  };
});

const createMockEntity = (annotations = {}): Entity => {
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

const createMockEntityName = (): CompoundEntityRef => ({
  kind: 'TestKind',
  name: 'test-component-name',
  namespace: 'test-namespace',
});

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return mockDir.resolve(namespace || DEFAULT_NAMESPACE, kind, name);
};

const getPosixEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return path.posix.join(
    '/rootDir',
    namespace || DEFAULT_NAMESPACE,
    kind,
    name,
  );
};

const logger = loggerToWinstonLogger(mockServices.logger.mock());

let publisher: PublisherBase;

beforeEach(() => {
  const mockConfig = new ConfigReader({
    techdocs: {
      publisher: {
        type: 'openStackSwift',
        openStackSwift: {
          credentials: {
            id: 'mockid',
            secret: 'verystrongsecret',
          },
          authUrl: 'mockauthurl',
          swiftUrl: 'mockSwiftUrl',
          containerName: 'mock',
        },
      },
    },
  });

  publisher = OpenStackSwiftPublish.fromConfig(mockConfig, logger);
});

describe('OpenStackSwiftPublish', () => {
  afterEach(() => {
    mockDir.clear();
  });

  describe('getReadiness', () => {
    it('should validate correct config', async () => {
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: true,
      });
    });

    it('should reject incorrect config', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          publisher: {
            type: 'openStackSwift',
            openStackSwift: {
              credentials: {
                id: 'mockId',
                secret: 'mockSecret',
              },
              authUrl: 'mockauthurl',
              swiftUrl: 'mockSwiftUrl',
              containerName: 'errorBucket',
            },
          },
        },
      });

      const errorPublisher = OpenStackSwiftPublish.fromConfig(
        mockConfig,
        logger,
      );

      expect(await errorPublisher.getReadiness()).toEqual({
        isAvailable: false,
      });
    });
  });

  describe('publish', () => {
    beforeEach(() => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockDir.setContent({
        [entityRootDir]: {
          'index.html': '',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });
    });

    it('should publish a directory', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      await expect(
        publisher.publish({ entity, directory: entityRootDir }),
      ).resolves.toMatchObject({
        objects: expect.arrayContaining([
          'test-namespace/TestKind/test-component-name/404.html',
          `test-namespace/TestKind/test-component-name/index.html`,
          `test-namespace/TestKind/test-component-name/assets/main.css`,
        ]),
      });
    });

    it('should fail to publish a directory', async () => {
      const wrongPathToGeneratedDirectory = mockDir.resolve(
        'wrong',
        'path',
        'to',
        'generatedDirectory',
      );

      const entity = createMockEntity();
      await expect(
        publisher.publish({
          entity,
          directory: wrongPathToGeneratedDirectory,
        }),
      ).rejects.toThrow();

      const fails = publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      });

      await expect(fails).rejects.toThrow(
        `Unable to upload file(s) to OpenStack Swift. Error: Failed to read template directory: ENOENT: no such file or directory, scandir '${wrongPathToGeneratedDirectory}'`,
      );
      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockDir.setContent({
        [entityRootDir]: {
          'index.html': 'file-content',
        },
      });

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return false if docs has not been generated', async () => {
      const entity = createMockEntity();

      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(false);
    });
  });

  describe('fetchTechDocsMetadata', () => {
    it('should return tech docs metadata', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockDir.setContent({
        [entityRootDir]: {
          'techdocs_metadata.json':
            '{"site_name": "backstage", "site_description": "site_content", "etag": "etag", "build_timestamp": 612741599}',
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
        etag: 'etag',
        build_timestamp: 612741599,
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
    });

    it('should return tech docs metadata when json encoded with single quotes', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockDir.setContent({
        [entityRootDir]: {
          'techdocs_metadata.json': `{'site_name': 'backstage', 'site_description': 'site_content', 'etag': 'etag', 'build_timestamp': 612741599}`,
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
        etag: 'etag',
        build_timestamp: 612741599,
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getPosixEntityRootDir(entity);

      const fails = publisher.fetchTechDocsMetadata(entityNameMock);

      await expect(fails).rejects.toMatchObject({
        message: `TechDocs metadata fetch failed, The file ${path.posix.join(
          entityRootDir,
          'techdocs_metadata.json',
        )} does not exist !`,
      });
    });
  });

  describe('docsRouter', () => {
    let app: express.Express;
    const entity = createMockEntity();
    const entityRootDir = getEntityRootDir(entity);

    beforeEach(() => {
      app = express().use(publisher.docsRouter());
      mockDir.setContent({
        [entityRootDir]: {
          html: {
            'unsafe.html': '<html></html>',
          },
          img: {
            'unsafe.svg': '<svg></svg>',
            'with spaces.png': 'found it',
          },
          'some folder': {
            'also with spaces.js': 'found it too',
          },
        },
      });
    });

    it('should pass expected object path to bucket', async () => {
      const {
        kind,
        metadata: { namespace, name },
      } = entity;

      // Ensures leading slash is trimmed and encoded path is decoded.
      const pngResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/img/with%20spaces.png`,
      );
      expect(Buffer.from(pngResponse.body).toString('utf8')).toEqual(
        'found it',
      );
      const jsResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/some%20folder/also%20with%20spaces.js`,
      );
      expect(jsResponse.text).toEqual('found it too');
    });

    it('should pass text/plain content-type for unsafe types', async () => {
      const {
        kind,
        metadata: { namespace, name },
      } = entity;

      const htmlResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/html/unsafe.html`,
      );
      expect(htmlResponse.text).toEqual('<html></html>');
      expect(htmlResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });

      const svgResponse = await request(app).get(
        `/${namespace}/${kind}/${name}/img/unsafe.svg`,
      );
      expect(svgResponse.text).toEqual('<svg></svg>');
      expect(svgResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });
    });

    it('should return 404 if file is not found', async () => {
      const {
        kind,
        metadata: { namespace, name },
      } = entity;

      const response = await request(app).get(
        `/${namespace}/${kind}/${name}/not-found.html`,
      );
      expect(response.status).toBe(404);

      expect(Buffer.from(response.text).toString('utf8')).toEqual(
        'File Not Found',
      );
    });
  });
});
