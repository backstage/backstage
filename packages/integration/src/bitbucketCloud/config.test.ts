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
import { loadConfigSchema } from '@backstage/config-loader';
import {
  BitbucketCloudIntegrationConfig,
  readBitbucketCloudIntegrationConfig,
  readBitbucketCloudIntegrationConfigs,
} from './config';

describe('readBitbucketCloudIntegrationConfig', () => {
  function buildConfig(data: Partial<BitbucketCloudIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<BitbucketCloudIntegrationConfig>,
  ): Promise<Config> {
    const fullSchema = await loadConfigSchema({
      dependencies: ['@backstage/integration'],
    });
    const serializedSchema = fullSchema.serialize() as {
      schemas: { value: { properties?: { integrations?: object } } }[];
    };
    const schema = await loadConfigSchema({
      serialized: {
        ...serializedSchema, // only include schemas that apply to integrations
        schemas: serializedSchema.schemas.filter(
          s => s.value?.properties?.integrations,
        ),
      },
    });
    const processed = schema.process(
      [{ data: { integrations: { bitbucketCloud: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader(processed[0].data as any);
  }

  it('reads all values', () => {
    const output = readBitbucketCloudIntegrationConfig(
      buildConfig({
        username: 'u',
        appPassword: 'p',
      }),
    );
    expect(output).toEqual({
      apiBaseUrl: 'https://api.bitbucket.org/2.0',
      appPassword: 'p',
      host: 'bitbucket.org',
      username: 'u',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      username: 'u',
      appPassword: 'p',
    };
    expect(() =>
      readBitbucketCloudIntegrationConfig(
        buildConfig({ ...valid, username: 7 }),
      ),
    ).toThrow(/username/);
    expect(() =>
      readBitbucketCloudIntegrationConfig(
        buildConfig({ ...valid, appPassword: 7 }),
      ),
    ).toThrow(/appPassword/);
  });

  it('credentials hidden on the frontend', async () => {
    const frontendConfig = await buildFrontendConfig({
      appPassword: 'p',
      username: 'u',
    });
    expect(
      readBitbucketCloudIntegrationConfigs(
        frontendConfig.getOptionalConfigArray('integrations.bitbucketCloud') ??
          [],
      ),
    ).toEqual([
      {
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
        host: 'bitbucket.org',
      },
    ]);
  });
});

describe('readBitbucketCloudIntegrationConfigs', () => {
  function buildConfig(
    data: Partial<BitbucketCloudIntegrationConfig>[],
  ): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readBitbucketCloudIntegrationConfigs(
      buildConfig([
        {
          username: 'u',
          appPassword: 'p',
        },
      ]),
    );
    expect(output).toContainEqual({
      apiBaseUrl: 'https://api.bitbucket.org/2.0',
      appPassword: 'p',
      host: 'bitbucket.org',
      username: 'u',
    });
  });

  it('adds a default Bitbucket Cloud entry when missing', () => {
    const output = readBitbucketCloudIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
        host: 'bitbucket.org',
      },
    ]);
  });
});
