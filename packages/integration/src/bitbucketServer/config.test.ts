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
  BitbucketServerIntegrationConfig,
  readBitbucketServerIntegrationConfig,
  readBitbucketServerIntegrationConfigs,
} from './config';

describe('readBitbucketServerIntegrationConfig', () => {
  function buildConfig(
    data: Partial<BitbucketServerIntegrationConfig>,
  ): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<BitbucketServerIntegrationConfig>,
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
      [{ data: { integrations: { bitbucketServer: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader(
      (processed[0].data as any).integrations.bitbucketServer[0],
    );
  }

  it('reads all values, token', () => {
    const output = readBitbucketServerIntegrationConfig(
      buildConfig({
        host: 'a.com',
        apiBaseUrl: 'https://a.com/api',
        token: 't',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
    });
  });

  it('reads all values, basic auth', () => {
    const output = readBitbucketServerIntegrationConfig(
      buildConfig({
        host: 'a.com',
        apiBaseUrl: 'https://a.com/api',
        username: 'u',
        password: 'p',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      username: 'u',
      password: 'p',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
    };
    expect(() =>
      readBitbucketServerIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readBitbucketServerIntegrationConfig(
        buildConfig({ ...valid, apiBaseUrl: 7 }),
      ),
    ).toThrow(/apiBaseUrl/);
    expect(() =>
      readBitbucketServerIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('works on the frontend', async () => {
    expect(
      readBitbucketServerIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          token: 't',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
    });
  });
});

describe('readBitbucketServerIntegrationConfigs', () => {
  function buildConfig(
    data: Partial<BitbucketServerIntegrationConfig>[],
  ): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads all values', () => {
    const output = readBitbucketServerIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          token: 't',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      token: 't',
    });
  });

  it('adds no default Bitbucket Server entry when missing', () => {
    const output = readBitbucketServerIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([]);
  });

  it('injects the correct Bitbucket Server API base URL when missing', () => {
    const output = readBitbucketServerIntegrationConfigs(
      buildConfig([{ host: 'bitbucket.company.com' }]),
    );
    expect(output).toEqual([
      {
        host: 'bitbucket.company.com',
        apiBaseUrl: 'https://bitbucket.company.com/rest/api/1.0',
      },
    ]);
  });
});
