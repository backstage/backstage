/*
 * Copyright 2024 The Backstage Authors
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
import { HarnessIntegrationConfig, readHarnessConfig } from './config';

describe('readHarnessConfig', () => {
  function buildConfig(data: Partial<HarnessIntegrationConfig>): Config {
    return new ConfigReader(data);
  }

  async function buildFrontendConfig(
    data: Partial<HarnessIntegrationConfig>,
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
      [{ data: { integrations: { harness: [data] } }, context: 'app' }],
      { visibility: ['frontend'] },
    );
    return new ConfigReader((processed[0].data as any).integrations.harness[0]);
  }

  it('reads all values', () => {
    const output = readHarnessConfig(
      buildConfig({
        host: 'a.com',
        token: 'p',
        apiKey: 'a',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      token: 'p',
      apiKey: 'a',
    });
  });

  it('can create a default value if the API base URL is missing', () => {
    const output = readHarnessConfig(
      buildConfig({
        host: 'a.com',
      }),
    );
    expect(output).toEqual({
      host: 'a.com',
      token: undefined,
    });
  });

  it('rejects funky configs', () => {
    const valid: any = {
      host: 'a.com',
    };
    expect(() => readHarnessConfig(buildConfig({ ...valid, host: 2 }))).toThrow(
      /host/,
    );
  });

  it('works on the frontend', async () => {
    expect(
      readHarnessConfig(
        await buildFrontendConfig({
          host: 'a.com',
          token: 'p',
        }),
      ),
    ).toEqual({
      host: 'a.com',
    });
  });
});
