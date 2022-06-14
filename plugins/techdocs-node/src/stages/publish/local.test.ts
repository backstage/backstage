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
import {
  getVoidLogger,
  PluginEndpointDiscovery,
  resolvePackagePath,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import mockFs from 'mock-fs';
import * as os from 'os';
import { LocalPublish } from './local';
import path from 'path';

const createMockEntity = (annotations = {}, lowerCase = false) => {
  return {
    apiVersion: 'version',
    kind: lowerCase ? 'testkind' : 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
};

const testDiscovery: jest.Mocked<PluginEndpointDiscovery> = {
  getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007/api/techdocs'),
  getExternalBaseUrl: jest.fn(),
};

const logger = getVoidLogger();

const tmpDir =
  os.platform() === 'win32' ? 'C:\\tmp\\generatedDir' : '/tmp/generatedDir';

const resolvedDir = resolvePackagePath(
  '@backstage/plugin-techdocs-backend',
  'static/docs',
);

describe('local publisher', () => {
  describe('publish', () => {
    beforeEach(() => {
      mockFs({
        [tmpDir]: {
          'index.html': '',
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should publish generated documentation dir', async () => {
      const mockConfig = new ConfigReader({});

      const publisher = LocalPublish.fromConfig(
        mockConfig,
        logger,
        testDiscovery,
      );
      const mockEntity = createMockEntity();
      const lowerMockEntity = createMockEntity(undefined, true);

      await publisher.publish({ entity: mockEntity, directory: tmpDir });

      expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

      // Lower/upper should be treated the same.
      expect(await publisher.hasDocsBeenGenerated(lowerMockEntity)).toBe(true);

      mockFs.restore();
    });

    it('should respect legacy casing', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          legacyUseCaseSensitiveTripletPaths: true,
        },
      });

      const publisher = LocalPublish.fromConfig(
        mockConfig,
        logger,
        testDiscovery,
      );
      const mockEntity = createMockEntity();
      const lowerMockEntity = createMockEntity(undefined, true);

      await publisher.publish({ entity: mockEntity, directory: tmpDir });

      expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

      // Lower/upper should be treated differently.
      expect(await publisher.hasDocsBeenGenerated(lowerMockEntity)).toBe(false);

      mockFs.restore();
    });

    it('should throw with unsafe triplet', async () => {
      const mockConfig = new ConfigReader({});
      const publisher = LocalPublish.fromConfig(
        mockConfig,
        logger,
        testDiscovery,
      );
      const mockEntity = {
        ...createMockEntity(),
        ...{
          kind: '..',
          metadata: { name: '..', namespace: '..' },
        },
      };

      await expect(() =>
        publisher.publish({ entity: mockEntity, directory: tmpDir }),
      ).rejects.toThrowError('Unable to publish TechDocs site');
    });

    it('should throw with unsafe name', async () => {
      const mockConfig = new ConfigReader({});
      const publisher = LocalPublish.fromConfig(
        mockConfig,
        logger,
        testDiscovery,
      );
      const mockEntity = {
        ...createMockEntity(),
        ...{
          kind: 'component',
          metadata: {
            name: path.join('..', 'component', 'other-component'),
            namespace: 'default',
          },
        },
      };

      await expect(() =>
        publisher.publish({ entity: mockEntity, directory: tmpDir }),
      ).rejects.toThrowError('Unable to publish TechDocs site');
    });
  });

  describe('docsRouter', () => {
    const mockConfig = new ConfigReader({});
    const publisher = LocalPublish.fromConfig(
      mockConfig,
      logger,
      testDiscovery,
    );
    let app: express.Express;

    beforeEach(() => {
      app = express().use(publisher.docsRouter());

      mockFs.restore();
      mockFs({
        [resolvedDir]: {
          'unsafe.html': '<html></html>',
          'unsafe.svg': '<svg></svg>',
          default: {
            testkind: {
              testname: {
                'index.html': 'found it',
              },
            },
          },
        },
      });
    });

    afterEach(() => {
      mockFs.restore();
    });

    it('should pass text/plain content-type for unsafe types', async () => {
      const htmlResponse = await request(app).get(`/unsafe.html`);
      expect(htmlResponse.text).toEqual('<html></html>');
      expect(htmlResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });

      const svgResponse = await request(app).get(`/unsafe.svg`);
      expect(svgResponse.text).toEqual('<svg></svg>');
      expect(svgResponse.header).toMatchObject({
        'content-type': 'text/plain; charset=utf-8',
      });
    });

    it('should redirect case-sensitive triplet path to lower-case', async () => {
      const response = await request(app)
        .get('/default/TestKind/TestName/index.html')
        .expect('Location', '/default/testkind/testname/index.html');
      expect(response.status).toBe(301);
    });

    it('should resolve lower-case triplet path content eventually', async () => {
      const response = await request(app)
        .get('/default/TestKind/TestName/index.html')
        .redirects(1);
      expect(response.text).toEqual('found it');
    });

    it('should not redirect when legacy case setting is used', async () => {
      const legacyConfig = new ConfigReader({
        techdocs: {
          legacyUseCaseSensitiveTripletPaths: true,
        },
      });
      const legacyPublisher = LocalPublish.fromConfig(
        legacyConfig,
        logger,
        testDiscovery,
      );
      app = express().use(legacyPublisher.docsRouter());

      const response = await request(app).get(
        '/default/TestKind/TestName/index.html',
      );
      expect(response.status).toBe(404);
    });
  });
});
