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
import path from 'path';
import * as winston from 'winston';
import { ConfigReader } from '@backstage/config';
import { AwsS3Publish } from './awsS3';
import { PublisherBase, TechDocsMetadata } from './types';
import type { Entity, EntityName } from '@backstage/catalog-model';

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

const createMockEntityName = (): EntityName => ({
  kind: 'TestKind',
  name: 'test-component-name',
  namespace: 'test-namespace',
});

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;
  const entityRootDir = path.join(namespace as string, kind, name);
  return entityRootDir;
};

const logger = winston.createLogger();
jest.spyOn(logger, 'info').mockReturnValue(logger);
jest.spyOn(logger, 'error').mockReturnValue(logger);

let publisher: PublisherBase;

beforeEach(() => {
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
          bucketName: 'bucketName',
        },
      },
    },
  });

  publisher = AwsS3Publish.fromConfig(mockConfig, logger);
});

describe('AwsS3Publish', () => {
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
          directory: '/wrong/path/to/generatedDirectory',
        })
        .catch(error =>
          expect(error.message).toContain(
            'Unable to upload file(s) to AWS S3. Error Failed to read template directory',
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

  describe('fetchTechDocsMetadata', () => {
    it('should return tech docs metadata', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'techdocs_metadata.json':
            '{"site_name": "backstage", "site_description": "site_content"}',
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
      mockFs.restore();
    });

    it('should return tech docs metadata when json encoded with single quotes', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const entityRootDir = getEntityRootDir(entity);

      mockFs({
        [entityRootDir]: {
          'techdocs_metadata.json': `{'site_name': 'backstage', 'site_description': 'site_content'}`,
        },
      });

      const expectedMetadata: TechDocsMetadata = {
        site_name: 'backstage',
        site_description: 'site_content',
      };
      expect(
        await publisher.fetchTechDocsMetadata(entityNameMock),
      ).toStrictEqual(expectedMetadata);
      mockFs.restore();
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const entityNameMock = createMockEntityName();
      const entity = createMockEntity();
      const {
        metadata: { name, namespace },
        kind,
      } = entity;

      await publisher
        .fetchTechDocsMetadata(entityNameMock)
        .catch(error =>
          expect(error).toEqual(
            new Error(
              `TechDocs metadata fetch failed, The file ${namespace}/${kind}/${name}/techdocs_metadata.json doest not exist.`,
            ),
          ),
        );
    });
  });
});
