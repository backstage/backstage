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

import { Config, ConfigReader } from '@backstage/config';
import {
  AwsCodeCommitIntegrationConfig,
  readAwsCodeCommitIntegrationConfig,
  readAwsCodeCommitIntegrationConfigs,
} from './config';

const AMAZON_AWS_CODECOMMIT_HOST = 'console.aws.amazon.com';

describe('readAwsCodeCommitIntegrationConfig', () => {
  function buildConfig(data: Partial<AwsCodeCommitIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads all values (default)', () => {
    const output = readAwsCodeCommitIntegrationConfig(
      buildConfig({ region: 'us-east-1' }),
    );
    expect(output).toEqual({
      host: `us-east-1.${AMAZON_AWS_CODECOMMIT_HOST}`,
      region: `us-east-1`,
    });
  });

  it('reads all values (custom entry)', () => {
    const output = readAwsCodeCommitIntegrationConfig(
      buildConfig({
        accessKeyId: 'fake-key',
        secretAccessKey: 'fake-secret-key',
        externalId: 'fake-external-id',
        roleArn: 'fake-role-arn',
        region: 'fake-region',
      }),
    );
    expect(output).toEqual({
      host: `fake-region.${AMAZON_AWS_CODECOMMIT_HOST}`,
      accessKeyId: 'fake-key',
      secretAccessKey: 'fake-secret-key',
      externalId: 'fake-external-id',
      roleArn: 'fake-role-arn',
      region: 'fake-region',
    });
  });
});

describe('readAwsCodeCommitIntegrationConfigs', () => {
  function buildConfig(
    data: Partial<AwsCodeCommitIntegrationConfig>[],
  ): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readAwsCodeCommitIntegrationConfigs(
      buildConfig([
        {
          host: AMAZON_AWS_CODECOMMIT_HOST,
          accessKeyId: 'key',
          secretAccessKey: 'secret',
          externalId: 'external-id',
          roleArn: 'role-arn',
          region: 'region',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: AMAZON_AWS_CODECOMMIT_HOST,
      accessKeyId: 'key',
      secretAccessKey: 'secret',
      externalId: 'external-id',
      roleArn: 'role-arn',
      region: 'region',
    });
  });

  it('adds a default entry when missing', () => {
    const output = readAwsCodeCommitIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([]);
  });
});
