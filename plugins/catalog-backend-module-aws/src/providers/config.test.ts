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

import { ConfigReader } from '@backstage/config';
import { readAwsS3Configs } from './config';

describe('readAwsS3Configs', () => {
  it('reads single provider config', () => {
    const provider = {
      bucketName: 'bucket-1',
      region: 'us-east-1',
      prefix: 'sub/dir/',
    };
    const config = {
      catalog: {
        providers: {
          awsS3: provider,
        },
      },
    };

    const actual = readAwsS3Configs(new ConfigReader(config));

    expect(actual).toHaveLength(1);
    expect(actual[0]).toEqual({
      ...provider,
      id: 'default',
    });
  });

  it('reads all provider configs', () => {
    const provider1 = {
      bucketName: 'bucket-1',
      region: 'us-east-1',
      prefix: 'sub/dir/',
    };
    const provider2 = {
      bucketName: 'bucket-2',
      region: 'eu-west-1',
    };
    const provider3 = {
      bucketName: 'bucket-3',
    };
    const config = {
      catalog: {
        providers: {
          awsS3: { provider1, provider2, provider3 },
        },
      },
    };

    const actual = readAwsS3Configs(new ConfigReader(config));

    expect(actual).toHaveLength(3);
    expect(actual[0]).toEqual({
      ...provider1,
      id: 'provider1',
    });
    expect(actual[1]).toEqual({
      ...provider2,
      id: 'provider2',
    });
    expect(actual[2]).toEqual({
      ...provider3,
      id: 'provider3',
    });
  });

  it('fails if bucketName is missing', () => {
    const provider = {
      region: 'us-east-1',
    };
    const config = {
      catalog: {
        providers: {
          awsS3: { provider },
        },
      },
    };

    expect(() => readAwsS3Configs(new ConfigReader(config))).toThrow(
      "Missing required config value at 'catalog.providers.awsS3.provider.bucketName'",
    );
  });
});
