/*
 * Copyright 2021 The Backstage Authors
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
import { ConfigReader, JsonObject } from '@backstage/config';
import { getVoidLogger } from '../logging';
import { DefaultReadTreeResponseFactory } from './tree';
import { AwsS3UrlReader } from './AwsS3UrlReader';
import {
  AwsS3Integration,
  readAwsS3IntegrationConfig,
} from '@backstage/integration';
import { UrlReaderPredicateTuple } from './types';
import AWSMock from 'aws-sdk-mock';
import aws from 'aws-sdk';
import path from 'path';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('AwsS3UrlReader', () => {
  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return AwsS3UrlReader.factory({
      config: new ConfigReader(config),
      logger: getVoidLogger(),
      treeResponseFactory,
    });
  };

  afterEach(() => {
    AWSMock.restore();
  });

  it('creates a dummy reader without the awsS3 field', () => {
    const entries = createReader({
      integrations: {},
    });

    expect(entries).toHaveLength(1);
  });

  it('creates a reader with credentials correctly configured', () => {
    const awsS3Integrations = [];
    awsS3Integrations.push({
      host: 'amazonaws.com',
      accessKeyId: 'fakekey',
      secretAccessKey: 'fakekey',
    });

    const entries = createReader({
      integrations: {
        awsS3: awsS3Integrations,
      },
    });

    expect(entries).toHaveLength(1);
  });

  it('creates a reader with default credentials provider', () => {
    const awsS3Integrations = [];
    awsS3Integrations.push({
      host: 'amazonaws.com',
    });

    const entries = createReader({
      integrations: {
        awsS3: awsS3Integrations,
      },
    });

    expect(entries).toHaveLength(1);
  });

  describe('predicates', () => {
    const readers = createReader({
      integrations: {
        awsS3: [{}],
      },
    });
    const predicate = readers[0].predicate;

    it('returns true for the correct aws s3 storage host', () => {
      expect(
        predicate(new URL('https://test-bucket.s3.us-east-2.amazonaws.com')),
      ).toBe(true);
    });

    it('returns true for a url with the full path and the correct host', () => {
      expect(
        predicate(
          new URL(
            'https://test-bucket.s3.us-east-2.amazonaws.com/team/service/catalog-info.yaml',
          ),
        ),
      ).toBe(true);
    });

    it('returns false for an incorrect host', () => {
      expect(predicate(new URL('https://amazon.com'))).toBe(false);
    });

    it('returns false for a completely different host', () => {
      expect(predicate(new URL('https://storage.cloud.google.com'))).toBe(
        false,
      );
    });

    it("returns true for a url with a bucket with '.'", () => {
      expect(
        predicate(
          new URL(
            'https://test.bucket.s3.us-east-2.amazonaws.com/team/service/catalog-info.yaml',
          ),
        ),
      ).toBe(true);
    });
  });

  describe('read', () => {
    AWSMock.setSDKInstance(aws);
    AWSMock.mock(
      'S3',
      'getObject',
      Buffer.from(
        require('fs').readFileSync(
          path.resolve(__dirname, '__fixtures__/awsS3/awsS3-mock-object.yaml'),
        ),
      ),
    );
    const s3 = new aws.S3();
    const awsS3UrlReader = new AwsS3UrlReader(
      new AwsS3Integration(
        readAwsS3IntegrationConfig(
          new ConfigReader({
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          }),
        ),
      ),
      { s3, treeResponseFactory },
    );

    it('returns contents of an object in a bucket', async () => {
      const response = await awsS3UrlReader.read(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      expect(response.toString().trim()).toBe('site_name: Test');
    });

    it('rejects unknown targets', async () => {
      await expect(
        awsS3UrlReader.read(
          'https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml',
        ),
      ).rejects.toThrow(
        Error(
          `Could not retrieve file from S3: not a valid AWS S3 URL: https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml`,
        ),
      );
    });
  });

  describe('readUrl', () => {
    AWSMock.setSDKInstance(aws);

    AWSMock.mock(
      'S3',
      'getObject',
      Buffer.from(
        require('fs').readFileSync(
          path.resolve(__dirname, '__fixtures__/awsS3/awsS3-mock-object.yaml'),
        ),
      ),
    );

    const s3 = new aws.S3();

    const awsS3UrlReader = new AwsS3UrlReader(
      new AwsS3Integration(
        readAwsS3IntegrationConfig(
          new ConfigReader({
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          }),
        ),
      ),
      { s3, treeResponseFactory },
    );

    it('returns contents of an object in a bucket', async () => {
      const response = await awsS3UrlReader.readUrl(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      const buffer = await response.buffer();
      expect(buffer.toString().trim()).toBe('site_name: Test');
    });

    it('rejects unknown targets', async () => {
      await expect(
        awsS3UrlReader.readUrl(
          'https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml',
        ),
      ).rejects.toThrow(
        Error(
          `Could not retrieve file from S3: not a valid AWS S3 URL: https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml`,
        ),
      );
    });
  });
  describe('readTree', () => {
    const object: aws.S3.Types.Object = {
      Key: 'awsS3-mock-object.yaml',
    };
    const objectList: aws.S3.ObjectList = [object];
    const output: aws.S3.Types.ListObjectsV2Output = {
      Contents: objectList,
    };
    AWSMock.setSDKInstance(aws);
    AWSMock.mock('S3', 'listObjectsV2', output);

    AWSMock.mock(
      'S3',
      'getObject',
      Buffer.from(
        require('fs').readFileSync(
          path.resolve(__dirname, '__fixtures__/awsS3/awsS3-mock-object.yaml'),
        ),
      ),
    );

    const s3 = new aws.S3();
    const awsS3UrlReader = new AwsS3UrlReader(
      new AwsS3Integration(
        readAwsS3IntegrationConfig(
          new ConfigReader({
            host: '.amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          }),
        ),
      ),
      { s3, treeResponseFactory },
    );
    it('returns contents of an object in a bucket', async () => {
      const response = await awsS3UrlReader.readTree(
        'https://test.s3.us-east-2.amazonaws.com',
      );
      const files = await response.files();
      const body = await files[0].content();

      expect(body.toString().trim()).toBe('site_name: Test');
    });
  });
});
