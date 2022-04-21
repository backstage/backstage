/*
 * Copyright 2022 The Backstage Authors
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
  GerritIntegrationConfig,
  readGerritIntegrationConfig,
  readGerritIntegrationConfigs,
} from './config';

describe('readGerritIntegrationConfig', () => {
  function buildConfig(data: Partial<GerritIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<GerritIntegrationConfig>,
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
      [{ data: { integrations: { gerrit: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.gerrit[0]);
  }

  it('reads all values', () => {
    const output = readGerritIntegrationConfig(
      buildConfig({
        host: 'a.com',
        baseUrl: 'https://a.com/api',
        gitilesBaseUrl: 'https://a.com/git',
        username: 'u',
        password: 'p',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com/api',
      gitilesBaseUrl: 'https://a.com/git',
      username: 'u',
      password: 'p',
    });
  });

  it('can create a default value if the API base URL is missing', () => {
    const output = readGerritIntegrationConfig(
      buildConfig({
        host: 'a.com',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com',
      gitilesBaseUrl: 'https://a.com',
      username: undefined,
      password: undefined,
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
    };
    expect(() =>
      readGerritIntegrationConfig(buildConfig({ ...valid, host: 2 })),
    ).toThrow(/host/);
    expect(() =>
      readGerritIntegrationConfig(buildConfig({ ...valid, baseUrl: 2 })),
    ).toThrow(/baseUrl/);
  });

  it('works on the frontend', async () => {
    expect(
      readGerritIntegrationConfig(
        await buildFrontendConfig({
          host: 'a.com',
          baseUrl: 'https://a.com/gerrit',
          username: 'u',
          password: 'p',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com/gerrit',
      gitilesBaseUrl: 'https://a.com',
    });
  });
});

describe('readGerritIntegrationConfigs', () => {
  function buildConfig(data: Partial<GerritIntegrationConfig>[]): Config[] {
    return data.map(item => new ConfigReader(item));
  }

  it('reads multiple configs', () => {
    const output = readGerritIntegrationConfigs(
      buildConfig([
        {
          host: 'a.com',
          baseUrl: 'https://a.com/api',
          username: 'u',
          password: 'p',
        },
        {
          host: 'b.com',
          baseUrl: 'https://b.com/api',
        },
      ]),
    );
    expect(output).toEqual([
      {
        host: 'a.com',
        baseUrl: 'https://a.com/api',
        gitilesBaseUrl: 'https://a.com',
        username: 'u',
        password: 'p',
      },
      {
        host: 'b.com',
        baseUrl: 'https://b.com/api',
        gitilesBaseUrl: 'https://b.com',
        username: undefined,
        password: undefined,
      },
    ]);
  });
});
