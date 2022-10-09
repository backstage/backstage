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
import { GiteaIntegrationConfig, readGiteaConfig } from './config';

describe('readGiteaConfig', () => {
  function buildConfig(data: Partial<GiteaIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<GiteaIntegrationConfig>,
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
      [{ data: { integrations: { gitea: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.gitea[0]);
  }

  it('reads all values', () => {
    const output = readGiteaConfig(
      buildConfig({
        host: 'a.com',
        baseUrl: 'https://a.com/route/api',
        username: 'u',
        password: 'p',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com/route/api',
      username: 'u',
      password: 'p',
    });
  });

  it('can create a default value if the API base URL is missing', () => {
    const output = readGiteaConfig(
      buildConfig({
        host: 'a.com',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com',
      username: undefined,
      password: undefined,
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
    };
    expect(() => readGiteaConfig(buildConfig({ ...valid, host: 2 }))).toThrow(
      /host/,
    );
    expect(() =>
      readGiteaConfig(buildConfig({ ...valid, baseUrl: 2 })),
    ).toThrow(/baseUrl/);
  });

  it('works on the frontend', async () => {
    expect(
      readGiteaConfig(
        await buildFrontendConfig({
          host: 'a.com',
          baseUrl: 'https://a.com/route',
          username: 'u',
          password: 'p',
        }),
      ),
    ).toEqual({
      host: 'a.com',
      baseUrl: 'https://a.com/route',
    });
  });
});
