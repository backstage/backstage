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

import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { DefaultReadTreeResponseFactory } from './tree';
import { DEFAULT_REGION, AwsS3UrlReader, parseUrl } from './AwsS3UrlReader';
import {
  AwsS3Integration,
  readAwsS3IntegrationConfig,
} from '@backstage/integration';
import { DefaultAwsCredentialsManager } from '@backstage/integration-aws-node';
import { UrlReaderPredicateTuple } from './types';
import path from 'path';
import { NotModifiedError } from '@backstage/errors';
import { mockClient } from 'aws-sdk-client-mock';
import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2Output,
  GetObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import fs from 'fs';
import { mockServices } from '@backstage/backend-test-utils';

const treeResponseFactory = DefaultReadTreeResponseFactory.create({
  config: new ConfigReader({}),
});

describe('parseUrl', () => {
  it('supports all aws formats', () => {
    expect(
      parseUrl('https://s3.amazonaws.com/my.bucket-3/a/puppy.jpg', {
        host: 'amazonaws.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-east-1',
    });
    expect(
      parseUrl('https://s3.amazonaws.com.cn/my.bucket-3/a/puppy.jpg', {
        host: 'amazonaws.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-east-1',
    });
    expect(
      parseUrl(
        'https://ec-backstage-staging.s3.cn-north-1.amazonaws.com.cn/payments-prod-oas30.json',
        {
          host: 'amazonaws.com',
        },
      ),
    ).toEqual({
      path: 'payments-prod-oas30.json',
      bucket: 'ec-backstage-staging',
      region: 'cn-north-1',
    });
    expect(
      parseUrl(
        'https://ec-backstage-staging.s3.cn-north-1.amazonaws.com.cn/payments-prod-oas30.json',
        {
          host: 'amazonaws.com.cn',
        },
      ),
    ).toEqual({
      path: 'payments-prod-oas30.json',
      bucket: 'ec-backstage-staging',
      region: 'cn-north-1',
    });
    expect(
      parseUrl('https://s3.us-west-2.amazonaws.com/my.bucket-3/a/puppy.jpg', {
        host: 'amazonaws.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-west-2',
    });
    expect(
      parseUrl('https://s3-us-west-2.amazonaws.com/my.bucket-3/a/puppy.jpg', {
        host: 'amazonaws.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-west-2',
    });
    expect(
      parseUrl('https://my.bucket-3.s3.us-west-2.amazonaws.com/a/puppy.jpg', {
        host: 'amazonaws.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-west-2',
    });
    expect(
      parseUrl(
        'https://ignored.s3.us-west-2.amazonaws.com/my.bucket-3/a/puppy.jpg',
        {
          host: 'amazonaws.com',
          s3ForcePathStyle: true,
        },
      ),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: 'us-west-2',
    });
  });

  it('supports all non-aws formats', () => {
    expect(
      parseUrl('https://my-host.com/my.bucket-3/a/puppy.jpg', {
        host: 'my-host.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: DEFAULT_REGION,
    });
    expect(
      parseUrl('https://my.bucket-3.my-host.com/a/puppy.jpg', {
        host: 'my-host.com',
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: DEFAULT_REGION,
    });
    expect(
      parseUrl('https://ignored.my-host.com/my.bucket-3/a/puppy.jpg', {
        host: 'my-host.com',
        s3ForcePathStyle: true,
      }),
    ).toEqual({
      path: 'a/puppy.jpg',
      bucket: 'my.bucket-3',
      region: DEFAULT_REGION,
    });
  });
});

describe('AwsS3UrlReader', () => {
  const s3Client = mockClient(S3Client);

  const createReader = (config: JsonObject): UrlReaderPredicateTuple[] => {
    return AwsS3UrlReader.factory({
      config: new ConfigReader(config),
      logger: mockServices.logger.mock(),
      treeResponseFactory,
    });
  };

  it('creates a sample reader without the awsS3 field', () => {
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
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.reset();

      s3Client.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(
          fs.createReadStream(
            path.resolve(
              __dirname,
              '__fixtures__/awsS3/awsS3-mock-object.yaml',
            ),
          ),
        ),
        ETag: '123abc',
      });
    });

    it('returns contents of an object in a bucket', async () => {
      const { buffer } = await reader.readUrl(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      const response = await buffer();
      expect(response.toString().trim()).toBe('site_name: Test');
    });

    it('rejects unknown targets', async () => {
      await expect(
        reader.readUrl(
          'https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml',
        ),
      ).rejects.toMatchInlineSnapshot(
        `[Error: Could not retrieve file from S3; caused by Error: Invalid AWS S3 URL https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml]`,
      );
    });
  });

  describe('readUrl', () => {
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.reset();

      s3Client.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(
          fs.createReadStream(
            path.resolve(
              __dirname,
              '__fixtures__/awsS3/awsS3-mock-object.yaml',
            ),
          ),
        ),
        ETag: '123abc',
        LastModified: new Date('2020-01-01T00:00:00Z'),
      });
    });

    it('returns contents of an object in a bucket via buffer', async () => {
      const { buffer, etag, lastModifiedAt } = await reader.readUrl(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      expect(etag).toBe('123abc');
      expect(lastModifiedAt).toEqual(new Date('2020-01-01T00:00:00Z'));
      const response = await buffer();
      expect(response.toString().trim()).toBe('site_name: Test');
    });

    it('returns contents of an object in a bucket via stream', async () => {
      const { buffer, etag, lastModifiedAt } = await reader.readUrl(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      expect(etag).toBe('123abc');
      expect(lastModifiedAt).toEqual(new Date('2020-01-01T00:00:00Z'));
      const response = await buffer();
      expect(response.toString().trim()).toBe('site_name: Test');
    });

    it('rejects unknown targets', async () => {
      await expect(
        reader.readUrl!(
          'https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml',
        ),
      ).rejects.toMatchInlineSnapshot(
        `[Error: Could not retrieve file from S3; caused by Error: Invalid AWS S3 URL https://test-bucket.s3.us-east-2.NOTamazonaws.com/file.yaml]`,
      );
    });
  });

  describe('readUrl towards custom host', () => {
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'localhost:4566',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
            endpoint: 'http://localhost:4566',
            s3ForcePathStyle: true,
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(
          fs.createReadStream(
            path.resolve(
              __dirname,
              '__fixtures__/awsS3/awsS3-mock-object.yaml',
            ),
          ),
        ),
        ETag: '123abc',
      });
    });

    it('returns contents of an object in a bucket via buffer', async () => {
      const { buffer, etag } = await reader.readUrl(
        'http://localhost:4566/test-bucket/awsS3-mock-object.yaml',
      );
      expect(etag).toBe('123abc');
      const response = await buffer();
      expect(response.toString().trim()).toBe('site_name: Test');
    });
  });

  describe('readUrl with etag', () => {
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.reset();
      const t = new S3ServiceException({
        name: '304',
        $fault: 'client',
        $metadata: { httpStatusCode: 304 },
      });
      s3Client.on(GetObjectCommand).rejects(t);
    });

    it('returns contents of an object in a bucket', async () => {
      await expect(
        reader.readUrl!(
          'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
          {
            etag: '123abc',
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });

  describe('readUrl with lastModifiedAfter', () => {
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.reset();
      const t = new S3ServiceException({
        name: '304',
        $fault: 'client',
        $metadata: { httpStatusCode: 304 },
      });
      s3Client.on(GetObjectCommand).rejects(t);
    });

    it('returns contents of an object in a bucket', async () => {
      await expect(
        reader.readUrl!(
          'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
          {
            lastModifiedAfter: new Date('2020-01-01T00:00:00Z'),
          },
        ),
      ).rejects.toThrow(NotModifiedError);
    });
  });

  describe('readTree', () => {
    let awsS3UrlReader: AwsS3UrlReader;

    beforeEach(() => {
      s3Client.reset();

      const object: Object = {
        Key: 'awsS3-mock-object.yaml',
      };

      const objectList: Object[] = [object];
      const output: ListObjectsV2Output = {
        Contents: objectList,
      };

      s3Client.on(ListObjectsV2Command).resolves(output);

      s3Client.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(
          fs.createReadStream(
            path.resolve(
              __dirname,
              '__fixtures__/awsS3/awsS3-mock-object.yaml',
            ),
          ),
        ),
      });

      const config = new ConfigReader({
        host: '.amazonaws.com',
        accessKeyId: 'fake-access-key',
        secretAccessKey: 'fake-secret-key',
      });

      const credsManager = DefaultAwsCredentialsManager.fromConfig(config);

      awsS3UrlReader = new AwsS3UrlReader(
        credsManager,
        new AwsS3Integration(readAwsS3IntegrationConfig(config)),
        { treeResponseFactory },
      );
    });

    it('returns contents of an object in a bucket', async () => {
      const response = await awsS3UrlReader.readTree(
        'https://test.s3.us-east-2.amazonaws.com',
      );
      const files = await response.files();
      const body = await files[0].content();

      expect(body.toString().trim()).toBe('site_name: Test');
    });
  });

  describe('search', () => {
    const [{ reader }] = createReader({
      integrations: {
        awsS3: [
          {
            host: 'amazonaws.com',
            accessKeyId: 'fake-access-key',
            secretAccessKey: 'fake-secret-key',
          },
        ],
      },
    });

    beforeEach(() => {
      s3Client.reset();

      s3Client.on(GetObjectCommand).resolves({
        Body: sdkStreamMixin(
          fs.createReadStream(
            path.resolve(
              __dirname,
              '__fixtures__/awsS3/awsS3-mock-object.yaml',
            ),
          ),
        ),
        ETag: '123abc',
        LastModified: new Date('2020-01-01T00:00:00Z'),
      });
    });

    it('should return a file when given an exact valid url', async () => {
      const data = await reader.search(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );

      expect(data.etag).toBe('123abc');
      expect(data.files.length).toBe(1);
      expect(data.files[0].url).toBe(
        'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-object.yaml',
      );
      expect((await data.files[0].content()).toString()).toEqual(
        'site_name: Test\n',
      );
    });

    it('throws if given URL with wildcard', async () => {
      await expect(
        reader.search(
          'https://test-bucket.s3.us-east-2.amazonaws.com/awsS3-mock-*.yaml',
        ),
      ).rejects.toThrow('Unsupported search pattern URL');
    });
  });
});
