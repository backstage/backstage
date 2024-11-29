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
  DeleteObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { Entity, DEFAULT_NAMESPACE } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  AwsCredentialProvider,
  AwsCredentialProviderOptions,
  DefaultAwsCredentialsManager,
} from '@backstage/integration-aws-node';
import { mockClient, AwsClientStub } from 'aws-sdk-client-mock';
import express from 'express';
import request from 'supertest';
import path from 'path';
import fs from 'fs-extra';
import { AwsS3Publish } from './awsS3';
import { Readable } from 'stream';
import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';

const env = process.env;
let s3Mock: AwsClientStub<S3Client>;

const mockDir = createMockDirectory();

function getMockCredentialProvider(): Promise<AwsCredentialProvider> {
  return Promise.resolve({
    sdkCredentialProvider: async () => {
      return Promise.resolve({
        accessKeyId: 'MY_ACCESS_KEY_ID',
        secretAccessKey: 'MY_SECRET_ACCESS_KEY',
      });
    },
  });
}
const getCredProviderMock = jest.spyOn(
  DefaultAwsCredentialsManager.prototype,
  'getCredentialProvider',
);

const getEntityRootDir = (entity: Entity) => {
  const {
    kind,
    metadata: { namespace, name },
  } = entity;

  return mockDir.resolve(namespace || DEFAULT_NAMESPACE, kind, name);
};

class ErrorReadable extends Readable {
  errorMessage: string;

  constructor(errorMessage: string) {
    super();
    this.errorMessage = errorMessage;
  }

  _read() {
    this.destroy(new Error(this.errorMessage));
  }

  _destroy(error: Error | null, callback: (error?: Error | null) => void) {
    callback(error);
  }
}

const logger = mockServices.logger.mock();
const loggerInfoSpy = jest.spyOn(logger, 'info');
const loggerErrorSpy = jest.spyOn(logger, 'error');

const createPublisherFromConfig = async ({
  bucketName = 'bucketName',
  bucketRootPath = '/',
  legacyUseCaseSensitiveTripletPaths = false,
  sse,
}: {
  bucketName?: string;
  bucketRootPath?: string;
  legacyUseCaseSensitiveTripletPaths?: boolean;
  sse?: string;
} = {}) => {
  const mockConfig = new ConfigReader({
    techdocs: {
      publisher: {
        type: 'awsS3',
        awsS3: {
          accountId: '111111111111',
          bucketName,
          bucketRootPath,
          sse,
        },
      },
      legacyUseCaseSensitiveTripletPaths,
    },
    aws: {
      accounts: [
        {
          accountId: '111111111111',
          accessKeyId: 'my-access-key',
          secretAccessKey: 'my-secret-access-key',
        },
      ],
    },
  });

  return await AwsS3Publish.fromConfig(mockConfig, logger);
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
    build_timestamp: 612741599,
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
    process.env = { ...env };
    process.env.AWS_REGION = 'us-west-2';

    jest.resetAllMocks();
    getCredProviderMock.mockImplementation((_?: AwsCredentialProviderOptions) =>
      getMockCredentialProvider(),
    );

    mockDir.setContent({
      [directory]: files,
    });

    s3Mock = mockClient(S3Client);

    s3Mock.on(HeadObjectCommand).callsFake(input => {
      if (!fs.pathExistsSync(mockDir.resolve(input.Key))) {
        throw new Error('File does not exist');
      }
      return {};
    });

    s3Mock.on(GetObjectCommand).callsFake(input => {
      if (fs.pathExistsSync(mockDir.resolve(input.Key))) {
        return {
          Body: Readable.from(fs.readFileSync(mockDir.resolve(input.Key))),
        };
      }

      throw new Error(`The file ${input.Key} does not exist!`);
    });

    s3Mock.on(HeadBucketCommand).callsFake(input => {
      if (input.Bucket === 'errorBucket') {
        throw new Error('Bucket does not exist');
      }
      return {};
    });

    s3Mock.on(ListObjectsV2Command).callsFake(input => {
      if (
        input.Bucket === 'delete_stale_files_success' ||
        input.Bucket === 'delete_stale_files_error'
      ) {
        return {
          Contents: [{ Key: 'stale_file.png' }],
        };
      }
      return {};
    });

    s3Mock.on(DeleteObjectCommand).callsFake(input => {
      if (input.Bucket === 'delete_stale_files_error') {
        throw new Error('Message');
      }
      return {};
    });

    s3Mock.on(UploadPartCommand).rejects();
    s3Mock.on(PutObjectCommand).callsFake(input => {
      mockDir.addContent({ [input.Key]: input.Body });
    });
  });

  afterEach(() => {
    process.env = env;
  });

  describe('buildCredentials', () => {
    it('should retrieve credentials for a specific account ID', async () => {
      await createPublisherFromConfig();
      expect(getCredProviderMock).toHaveBeenCalledWith({
        accountId: '111111111111',
      });
      expect(getCredProviderMock).toHaveBeenCalledTimes(1);
    });

    it('should retrieve default credentials when no config is present', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          publisher: {
            type: 'awsS3',
            awsS3: {
              bucketName: 'bucketName',
            },
          },
        },
      });

      await AwsS3Publish.fromConfig(mockConfig, logger);
      expect(getCredProviderMock).toHaveBeenCalledWith();
      expect(getCredProviderMock).toHaveBeenCalledTimes(1);
    });

    it('should fall back to deprecated method of retrieving credentials', async () => {
      const mockConfig = new ConfigReader({
        techdocs: {
          publisher: {
            type: 'awsS3',
            awsS3: {
              credentials: {
                accessKeyId: 'accessKeyId',
                secretAccessKey: 'secretAccessKey',
              },
              bucketName: 'bucketName',
              bucketRootPath: '/',
            },
          },
        },
      });

      await AwsS3Publish.fromConfig(mockConfig, logger);
      expect(getCredProviderMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('getReadiness', () => {
    it('should validate correct config', async () => {
      const publisher = await createPublisherFromConfig();
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: true,
      });
    });

    it('should reject incorrect config', async () => {
      const publisher = await createPublisherFromConfig({
        bucketName: 'errorBucket',
      });
      expect(await publisher.getReadiness()).toEqual({
        isAvailable: false,
      });
    });
  });

  describe('publish', () => {
    it('should publish a directory', async () => {
      const publisher = await createPublisherFromConfig();
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'default/component/backstage/404.html',
          `default/component/backstage/index.html`,
          `default/component/backstage/assets/main.css`,
        ]),
      });
    });

    it('should publish a directory as well when legacy casing is used', async () => {
      const publisher = await createPublisherFromConfig({
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
      const publisher = await createPublisherFromConfig({
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
      const publisher = await createPublisherFromConfig({
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

    it('should publish a directory when sse is specified', async () => {
      const publisher = await createPublisherFromConfig({
        sse: 'aws:kms',
      });
      expect(await publisher.publish({ entity, directory })).toMatchObject({
        objects: expect.arrayContaining([
          'default/component/backstage/404.html',
          'default/component/backstage/index.html',
          'default/component/backstage/assets/main.css',
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

      const publisher = await createPublisherFromConfig();

      const fails = publisher.publish({
        entity,
        directory: wrongPathToGeneratedDirectory,
      });

      await expect(fails).rejects.toThrow(
        `Unable to upload file(s) to AWS S3. Error: Failed to read template directory: ENOENT: no such file or directory, scandir '${wrongPathToGeneratedDirectory}'`,
      );

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(wrongPathToGeneratedDirectory),
      });
    });

    it('should delete stale files after upload', async () => {
      const bucketName = 'delete_stale_files_success';
      const publisher = await createPublisherFromConfig({
        bucketName: bucketName,
      });
      await publisher.publish({ entity, directory });
      expect(loggerInfoSpy).toHaveBeenLastCalledWith(
        `Successfully deleted stale files for Entity ${entity.metadata.name}. Total number of files: 1`,
      );
    });

    it('should log error when the stale files deletion fails', async () => {
      const bucketName = 'delete_stale_files_error';
      const publisher = await createPublisherFromConfig({
        bucketName: bucketName,
      });
      await publisher.publish({ entity, directory });
      expect(loggerErrorSpy).toHaveBeenLastCalledWith(
        'Unable to delete file(s) from AWS S3. Error: Message',
      );
    });
  });

  describe('hasDocsBeenGenerated', () => {
    it('should return true if docs has been generated', async () => {
      const publisher = await createPublisherFromConfig();
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated even if the legacy case is enabled', async () => {
      const publisher = await createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated if root path is specified', async () => {
      const publisher = await createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return true if docs has been generated if root path is specified and legacy casing is used', async () => {
      const publisher = await createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.hasDocsBeenGenerated(entity)).toBe(true);
    });

    it('should return false if docs has not been generated', async () => {
      const publisher = await createPublisherFromConfig();
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
      const publisher = await createPublisherFromConfig();
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata even if the legacy case is enabled', async () => {
      const publisher = await createPublisherFromConfig({
        legacyUseCaseSensitiveTripletPaths: true,
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata even if root path is specified', async () => {
      const publisher = await createPublisherFromConfig({
        bucketRootPath: 'backstage-data/techdocs',
      });
      await publisher.publish({ entity, directory });
      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );
    });

    it('should return tech docs metadata if root path is specified and legacy casing is used', async () => {
      const publisher = await createPublisherFromConfig({
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

      const publisher = await createPublisherFromConfig();
      await publisher.publish({ entity, directory });

      expect(await publisher.fetchTechDocsMetadata(entityName)).toStrictEqual(
        techdocsMetadata,
      );

      fs.writeFileSync(techdocsMetadataPath, techdocsMetadataContent);
    });

    it('should return an error if the techdocs_metadata.json file is not present', async () => {
      const publisher = await createPublisherFromConfig();

      const invalidEntityName = {
        namespace: 'invalid',
        kind: 'triplet',
        name: 'path',
      };

      const fails = publisher.fetchTechDocsMetadata(invalidEntityName);

      await expect(fails).rejects.toMatchObject({
        message: expect.stringContaining(
          'The file invalid/triplet/path/techdocs_metadata.json does not exist',
        ),
      });
    });

    it('should return an error if the techdocs_metadata.json file cannot be read from stream', async () => {
      s3Mock.on(GetObjectCommand).callsFake(_ => {
        return {
          Body: new ErrorReadable('No stream!'),
        };
      });

      const publisher = await createPublisherFromConfig();

      const invalidEntityName = {
        namespace: 'invalid',
        kind: 'triplet',
        name: 'path',
      };

      const fails = publisher.fetchTechDocsMetadata(invalidEntityName);

      await expect(fails).rejects.toMatchObject({
        message: expect.stringMatching(
          'TechDocs metadata fetch failed; caused by Error: Unable to read stream; caused by Error: No stream!',
        ),
      });
    });
  });

  describe('docsRouter', () => {
    const entityTripletPath = `${entity.metadata.namespace}/${entity.kind}/${entity.metadata.name}`;

    let app: express.Express;

    beforeEach(async () => {
      const publisher = await createPublisherFromConfig();
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
      const publisher = await createPublisherFromConfig({
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
      const publisher = await createPublisherFromConfig({
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
      const publisher = await createPublisherFromConfig({
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

    it('should return 404 if file cannot be read from stream', async () => {
      s3Mock.on(GetObjectCommand).callsFake(_ => {
        return {
          Body: new ErrorReadable('No stream!'),
        };
      });

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
