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

// Mock constants
const BITBUCKET_CLOUD_HOST = 'bitbucket.org';
const BITBUCKET_CLOUD_API_BASE_URL = 'https://api.bitbucket.org/2.0';

function makeConfig(values: Record<string, unknown>): Config {
  return {
    getOptionalString: (key: string): string | undefined => {
      const value = values[key];
      return typeof value === 'string' ? value : undefined;
    },
  } as unknown as Config;
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

describe('readBitbucketCloudIntegrationConfig', () => {
  function buildConfig(data: Partial<BitbucketCloudIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  it('reads all values', () => {
    const output = readBitbucketCloudIntegrationConfig(
      buildConfig({
        username: 'u',
        appPassword: '\n\n\np',
        host: BITBUCKET_CLOUD_HOST,
        apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
        token: 'abc123',
        commitSigningKey: undefined,
      }),
    );
    expect(output).toEqual({
      username: 'u',
      appPassword: 'p',
      host: BITBUCKET_CLOUD_HOST,
      apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
      token: 'abc123',
      commitSigningKey: undefined,
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      username: 'u',
      appPassword: 'p',
      host: 'bitbucket.org',
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

  it('throws if neither token nor username+appPassword are provided', () => {
    const config = makeConfig({});
    expect(() => readBitbucketCloudIntegrationConfig(config)).toThrow(
      /must configure either a token or both username and appPassword/,
    );
  });

  it('returns config with token when provided', () => {
    const config = makeConfig({ token: 'abc123' });

    const result = readBitbucketCloudIntegrationConfig(config);

    expect(result).toEqual<BitbucketCloudIntegrationConfig>({
      host: BITBUCKET_CLOUD_HOST,
      apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
      username: undefined,
      appPassword: undefined,
      token: 'abc123',
      commitSigningKey: undefined,
    });
  });

  it('returns config with username + appPassword when provided (no token)', () => {
    const config = makeConfig({ username: 'user1', appPassword: 'secret' });

    const result = readBitbucketCloudIntegrationConfig(config);

    expect(result).toEqual<BitbucketCloudIntegrationConfig>({
      host: BITBUCKET_CLOUD_HOST,
      apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
      username: 'user1',
      appPassword: 'secret',
      token: undefined,
      commitSigningKey: undefined,
    });
  });

  it('throws if only username is provided without appPassword', () => {
    const config = makeConfig({ username: 'user1' });
    expect(() => readBitbucketCloudIntegrationConfig(config)).toThrow();
  });

  it('throws if only appPassword is provided without username', () => {
    const config = makeConfig({ appPassword: 'secret' });
    expect(() => readBitbucketCloudIntegrationConfig(config)).toThrow();
  });

  it('trims whitespace from appPassword', () => {
    const config = makeConfig({ username: 'user1', appPassword: '  secret  ' });

    const result = readBitbucketCloudIntegrationConfig(config);

    expect(result.appPassword).toBe('secret');
  });

  it('returns config with token when both token and username+appPassword are provided', () => {
    const config = makeConfig({
      token: 'priority-token',
      username: 'user1',
      appPassword: 'secret',
    });

    const result = readBitbucketCloudIntegrationConfig(config);

    // token is always set, username/appPassword are also returned but downstream code prefers token
    expect(result).toEqual<BitbucketCloudIntegrationConfig>({
      host: BITBUCKET_CLOUD_HOST,
      apiBaseUrl: BITBUCKET_CLOUD_API_BASE_URL,
      username: 'user1',
      appPassword: 'secret',
      token: 'priority-token',
      commitSigningKey: undefined,
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
          username: 'u',
          appPassword: 'p',
          host: 'bitbucket.org',
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
