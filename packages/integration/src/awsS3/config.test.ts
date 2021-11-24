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
  AwsS3IntegrationConfig,
  readAwsS3IntegrationConfig,
  readAwsS3IntegrationConfigs,
} from './config';

describe('readAwsS3IntegrationConfig', () => {
  function buildConfig(data: Partial<AwsS3IntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads all values', () => {
    const output = readAwsS3IntegrationConfig(
      buildConfig({
        host: 'amazonaws.com',
        accessKeyId: 'fake-key',
        secretAccessKey: 'fake-secret-key',
      }),
    );
    expect(output).toEqual({
      host: 'amazonaws.com',
      accessKeyId: 'fake-key',
      secretAccessKey: 'fake-secret-key',
    });
  });
});

describe('readAwsS3IntegrationConfigs', () => {
  function buildConfig(data: Partial<AwsS3IntegrationConfig>[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readAwsS3IntegrationConfigs(
      buildConfig([
        {
          host: 'amazonaws.com',
          accessKeyId: 'key',
          secretAccessKey: 'secret',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'amazonaws.com',
      accessKeyId: 'key',
      secretAccessKey: 'secret',
    });
  });

  it('adds a default entry when missing', () => {
    const output = readAwsS3IntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'amazonaws.com',
      },
    ]);
  });
});
