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

import { UrlReaders } from '@backstage/backend-defaults/urlReader';
import { ConfigReader } from '@backstage/config';
import { AwsS3DiscoveryProcessor } from './AwsS3DiscoveryProcessor';
import {
  CatalogProcessorEntityResult,
  CatalogProcessorResult,
  processingResult,
} from '@backstage/plugin-catalog-node';
import {
  S3Client,
  ListObjectsV2Command,
  ListObjectsV2Output,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import fs from 'fs';
import path from 'path';
import YAML from 'yaml';
import { mockServices } from '@backstage/backend-test-utils';

const s3Client = mockClient(S3Client);
const object: Object = {
  Key: 'awsS3-mock-object.txt',
};
const objectList: Object[] = [object];
const output: ListObjectsV2Output = {
  Contents: objectList,
};

const logger = mockServices.logger.mock();
const reader = UrlReaders.default({
  logger,
  config: new ConfigReader({
    backend: { reading: { allow: [{ host: 'localhost' }] } },
  }),
});

describe('readLocation', () => {
  const processor = new AwsS3DiscoveryProcessor(reader);
  const spec = {
    type: 's3-discovery',
    target: 'https://testbucket.s3.us-east-2.amazonaws.com',
  };

  beforeEach(() => {
    s3Client.reset();
    s3Client.on(ListObjectsV2Command).resolves(output);
    s3Client.on(GetObjectCommand).resolves({
      Body: sdkStreamMixin(
        fs.createReadStream(
          path.resolve(__dirname, '__fixtures__/awsS3-mock-object.txt'),
        ),
      ),
    });
  });

  it('should load from url', async () => {
    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(
        spec,
        false,
        emit,
        async function* r({ data, location }) {
          yield processingResult.entity(
            location,
            YAML.parse(data.toString('utf8')) as any,
          );
        },
      ),
    )) as CatalogProcessorEntityResult;
    expect(generated.type).toBe('entity');
    expect(generated.location).toEqual({
      target: 'awsS3-mock-object.txt',
      type: 's3-discovery',
    });
    expect(generated.entity).toEqual({ site_name: 'Test' });
  });
});
