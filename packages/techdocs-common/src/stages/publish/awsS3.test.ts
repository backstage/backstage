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
import * as winston from 'winston';
import { ConfigReader } from '@backstage/config';
import { AwsS3Publish } from './awsS3';
import { PublisherBase } from './types';

const createMockEntity = (annotations = {}) => {
  return {
    apiVersion: 'version',
    kind: 'TestKind',
    metadata: {
      name: 'test-component-name',
      annotations: {
        ...annotations,
      },
    },
  };
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
      mockFs({
        '/path/to/generatedDirectory': {
          'index.html': '',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });

      const entity = createMockEntity();
      expect(
        await publisher.publish({
          entity,
          directory: '/path/to/generatedDirectory',
        }),
      ).toBeUndefined();
      mockFs.restore();
    });

    it('should fail to publish a directory', async () => {
      mockFs({
        '/path/to/generatedDirectory': {
          'index.html': 'mock-error',
          '404.html': '',
          assets: {
            'main.css': '',
          },
        },
      });

      const entity = createMockEntity();
      await publisher
        .publish({
          entity,
          directory: '/path/to/generatedDirectory',
        })
        .catch(error =>
          expect(error).toBe(`Unable to upload file(s) to AWS S3. Error`),
        );
      mockFs.restore();
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const entityMock = {
        apiVersion: 'apiVersion',
        kind: 'kind',
        metadata: {
          namespace: '/namespace',
          name: 'name',
        },
      };
      const entityRootDir = `${entityMock.metadata.namespace}/${entityMock.kind}/${entityMock.metadata.name}`;
      mockFs({
        [entityRootDir]: {
          'index.html': 'file-content',
        },
      });

      expect(await publisher.hasDocsBeenGenerated(entityMock)).toBe(true);
      mockFs.restore();
    });

    it('should return false if docs has not been generated', async () => {
      const entityMock = {
        apiVersion: 'apiVersion',
        kind: 'kind',
        metadata: {
          namespace: 'namespace',
          name: 'name',
        },
      };

      expect(await publisher.hasDocsBeenGenerated(entityMock)).toBe(false);
    });
  });

  describe('fetchTechDocsMetadata', () => {
    it('should return tech docs metadata', async () => {
      const entityNameMock = {
        name: 'name',
        namespace: '/namespace',
        kind: 'kind',
      };
      const entityRootDir = `${entityNameMock.namespace}/${entityNameMock.kind}/${entityNameMock.name}`;
      mockFs({
        [entityRootDir]: {
          'techdocs_metadata.json': 'file-content',
        },
      });

      expect(await publisher.fetchTechDocsMetadata(entityNameMock)).toBe(
        'file-content',
      );
      mockFs.restore();
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const entityNameMock = {
        name: 'name',
        namespace: 'namespace',
        kind: 'kind',
      };
      const entityRootDir = `${entityNameMock.namespace}/${entityNameMock.kind}/${entityNameMock.name}`;
      await publisher
        .fetchTechDocsMetadata(entityNameMock)
        .catch(error =>
          expect(error).toBe(
            `The file ${entityRootDir}/techdocs_metadata.json doest not exist.`,
          ),
        );
    });
  });
});
