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

import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import * as os from 'os';
import { LocalPublish } from './local';
import path from 'path';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';

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

const testDiscovery = mockServices.discovery.mock({
  getBaseUrl: async () => 'http://localhost:7007/api/techdocs',
});

const mockPublishDir = createMockDirectory();

overridePackagePathResolution({
  packageName: '@backstage/plugin-techdocs-backend',
  paths: {
    'static/docs': mockPublishDir.path,
  },
});

const logger = mockServices.logger.mock();

describe('local publisher', () => {
  const mockDir = createMockDirectory();

  describe('publish', () => {
    beforeEach(() => {
      mockPublishDir.clear();
      mockDir.setContent({
        'index.html': '',
      });
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

      await publisher.publish({ entity: mockEntity, directory: mockDir.path });

      expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

      // Lower/upper should be treated the same.
      expect(await publisher.hasDocsBeenGenerated(lowerMockEntity)).toBe(true);
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

      await publisher.publish({ entity: mockEntity, directory: mockDir.path });

      expect(await publisher.hasDocsBeenGenerated(mockEntity)).toBe(true);

      // Lower/upper should be treated differently.
      expect(await publisher.hasDocsBeenGenerated(lowerMockEntity)).toBe(
        os.platform() === 'darwin', // MacOS is case-insensitive
      );
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
        publisher.publish({ entity: mockEntity, directory: mockDir.path }),
      ).rejects.toThrow('Unable to publish TechDocs site');
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
        publisher.publish({ entity: mockEntity, directory: mockDir.path }),
      ).rejects.toThrow('Unable to publish TechDocs site');
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
      mockPublishDir.setContent({
        'unsafe.html': '<html></html>',
        'unsafe.svg': '<svg></svg>',
        default: {
          testkind: {
            testname: {
              'index.html': 'found it',
            },
          },
        },
      });
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
      expect(response.status).toBe(os.platform() === 'darwin' ? 200 : 404);
    });

    it('should work with a configured directory', async () => {
      const customConfig = new ConfigReader({
        techdocs: {
          publisher: {
            local: {
              publishDirectory: mockDir.path,
            },
          },
        },
      });
      mockDir.setContent({
        'index.html': 'found it',
      });
      const legacyPublisher = LocalPublish.fromConfig(
        customConfig,
        logger,
        testDiscovery,
      );
      app = express().use(legacyPublisher.docsRouter());

      const response = await request(app).get('/index.html');
      expect(response.status).toBe(200);
      expect(response.text).toEqual('found it');
    });
  });
});
