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
        token: 't',
        username: 'u',
      }),
    );
    expect(output).toEqual({
      apiBaseUrl: 'https://api.bitbucket.org/2.0',
      host: 'bitbucket.org',
      token: 't',
      username: 'u',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      token: 't',
      username: 'u',
    };
    expect(() =>
      readBitbucketCloudIntegrationConfig(
        buildConfig({ ...valid, username: 7 }),
      ),
    ).toThrow(/username/);
    expect(() =>
      readBitbucketCloudIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('credentials hidden on the frontend', async () => {
    const frontendConfig = await buildFrontendConfig({
      token: 't',
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

  // TODO: appPassword can be removed once fully
  // deprecated by BitBucket on 9th June 2026.
  describe('handles deprecated appPassword', () => {
    it('reads all values', () => {
      const output = readBitbucketCloudIntegrationConfig(
        buildConfig({
          appPassword: '\n\np',
          username: 'u',
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
        appPassword: 'p',
        username: 'u',
      };
      expect(() =>
        readBitbucketCloudIntegrationConfig(
          buildConfig({ ...valid, appPassword: 7 }),
        ),
      ).toThrow(/appPassword/);
    });

    it('rejects if misconfigured', () => {
      const valid: any = {
        appPassword: 'p',
        token: 't',
        username: 'u',
      };
      expect(() =>
        readBitbucketCloudIntegrationConfig(
          buildConfig({ ...valid, appPassword: undefined, token: undefined }),
        ),
      ).toThrow(/must configure either a token or appPassword/);
    });

    it('credentials hidden on the frontend', async () => {
      const frontendConfig = await buildFrontendConfig({
        appPassword: 'p',
        username: 'u',
      });
      expect(
        readBitbucketCloudIntegrationConfigs(
          frontendConfig.getOptionalConfigArray(
            'integrations.bitbucketCloud',
          ) ?? [],
        ),
      ).toEqual([
        {
          apiBaseUrl: 'https://api.bitbucket.org/2.0',
          host: 'bitbucket.org',
        },
      ]);
    });
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
          token: 't',
          username: 'u',
        },
      ]),
    );
    expect(output).toContainEqual({
      apiBaseUrl: 'https://api.bitbucket.org/2.0',
      host: 'bitbucket.org',
      token: 't',
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
