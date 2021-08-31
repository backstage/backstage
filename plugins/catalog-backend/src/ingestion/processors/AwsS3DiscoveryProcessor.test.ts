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
import { getVoidLogger, UrlReaders } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { AwsS3DiscoveryProcessor } from './AwsS3DiscoveryProcessor';
import { CatalogProcessorEntityResult, CatalogProcessorResult } from './types';
import { defaultEntityDataParser } from './util/parse';
import AWSMock from 'aws-sdk-mock';
import aws from 'aws-sdk';
import path from 'path';

AWSMock.setSDKInstance(aws);
const object: aws.S3.Types.Object = {
  Key: 'awsS3-mock-object.txt',
};
const objectList: aws.S3.ObjectList = [object];
const output: aws.S3.Types.ListObjectsV2Output = {
  Contents: objectList,
};
AWSMock.mock('S3', 'listObjectsV2', output);
AWSMock.mock(
  'S3',
  'getObject',
  Buffer.from(
    require('fs').readFileSync(
      path.resolve(
        'src',
        'ingestion',
        'processors',
        '__fixtures__',
        'fileReaderProcessor',
        'awsS3',
        'awsS3-mock-object.txt',
      ),
    ),
  ),
);

const logger = getVoidLogger();
const reader = UrlReaders.default({
  logger,
  config: new ConfigReader({
    backend: { reading: { allow: [{ host: 'localhost' }] } },
  }),
});

describe('readLocation', () => {
  const processor = new AwsS3DiscoveryProcessor(reader);
  const spec = {
    type: 'awsS3-discovery',
    target: 'https://testbucket.s3.us-east-2.amazonaws.com',
  };

  it('should load from url', async () => {
    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(spec, false, emit, defaultEntityDataParser),
    )) as CatalogProcessorEntityResult;
    expect(generated.type).toBe('entity');
    expect(generated.location).toEqual({
      target: 'awsS3-mock-object.txt',
      type: 'awsS3-discovery',
    });
    expect(generated.entity).toEqual({ site_name: 'Test' });
  });
});
