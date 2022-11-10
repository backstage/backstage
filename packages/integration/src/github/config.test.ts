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
  GithubIntegrationConfig,
  readGithubIntegrationConfig,
  readGithubIntegrationConfigs,
} from './config';

describe('readGithubIntegrationConfig', () => {
  function buildConfig(provider: Partial<GithubIntegrationConfig>) {
    return new ConfigReader(provider);
  }

  async function buildFrontendConfig(
    data: Partial<GithubIntegrationConfig>,
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
      [{ data: { integrations: { github: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.github[0]);
  }

  it('reads all values', () => {
    const output = readGithubIntegrationConfig(
      buildConfig({
        host: 'a.com',
        apiBaseUrl: 'https://a.com/api',
        rawBaseUrl: 'https://a.com/raw',
        token: 't',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    });
  });

  it('injects the correct GitHub API base URL when missing', () => {
    const output = readGithubIntegrationConfig(
      buildConfig({ host: 'github.com' }),
    );
    expect(output).toEqual({
      host: 'github.com',
      apiBaseUrl: 'https://api.github.com',
      rawBaseUrl: 'https://raw.githubusercontent.com',
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    };
    expect(() =>
      readGithubIntegrationConfig(buildConfig({ ...valid, host: 7 })),
    ).toThrow(/host/);
    expect(() =>
      readGithubIntegrationConfig(buildConfig({ ...valid, apiBaseUrl: 7 })),
    ).toThrow(/apiBaseUrl/);
    expect(() =>
      readGithubIntegrationConfig(buildConfig({ ...valid, rawBaseUrl: 7 })),
    ).toThrow(/rawBaseUrl/);
    expect(() =>
      readGithubIntegrationConfig(buildConfig({ ...valid, token: 7 })),
    ).toThrow(/token/);
  });

  it('works on the frontend', async () => {
    expect(
      readGithubIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          rawBaseUrl: 'https://a.com/raw',
          token: 't',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
    });
  });
});

describe('readGithubIntegrationConfigs', () => {
  function buildConfig(
    providers: Partial<GithubIntegrationConfig>[],
  ): Config[] {
    return providers.map(provider => new ConfigReader(provider));
  }

  it('reads all values', () => {
    const output = readGithubIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          apiBaseUrl: 'https://a.com/api',
          rawBaseUrl: 'https://a.com/raw',
          token: 't',
        },
      ]),
    );
    expect(output).toContainEqual({
      host: 'a.com',
      apiBaseUrl: 'https://a.com/api',
      rawBaseUrl: 'https://a.com/raw',
      token: 't',
    });
  });

  it('adds a default GitHub entry when missing', () => {
    const output = readGithubIntegrationConfigs(buildConfig([]));
    expect(output).toEqual([
      {
        host: 'github.com',
        apiBaseUrl: 'https://api.github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      },
    ]);
  });
});
