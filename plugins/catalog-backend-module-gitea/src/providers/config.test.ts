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

import { readGiteaConfigs } from './config';
import { ConfigReader } from '@backstage/config';
import { readSchedulerServiceTaskScheduleDefinitionFromConfig } from '@backstage/backend-plugin-api';

jest.mock('@backstage/backend-plugin-api', () => ({
  ...jest.requireActual('@backstage/backend-plugin-api'),
  readSchedulerServiceTaskScheduleDefinitionFromConfig: jest.fn(),
}));
jest.mock('p-limit');

describe('readGiteaConfigs', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns empty array when no gitea provider config is present', () => {
    const config = new ConfigReader({});

    const result = readGiteaConfigs(config);

    expect(result).toEqual([]);
  });

  it('parses multiple gitea provider configurations correctly', () => {
    (
      readSchedulerServiceTaskScheduleDefinitionFromConfig as jest.Mock
    ).mockReturnValue({
      frequency: { minutes: 5 },
      timeout: { minutes: 3 },
    });

    const config = new ConfigReader({
      catalog: {
        providers: {
          gitea: {
            myProvider: {
              host: 'gitea.example.com',
              organization: 'example-org',
              branch: 'dev',
              catalogPath: 'custom-path.yaml',
              schedule: {
                frequency: { minutes: 5 },
                timeout: { minutes: 3 },
              },
            },
          },
        },
      },
    });

    const result = readGiteaConfigs(config);

    expect(result).toEqual([
      {
        id: 'myProvider',
        host: 'gitea.example.com',
        organization: 'example-org',
        branch: 'dev',
        catalogPath: 'custom-path.yaml',
        schedule: {
          frequency: { minutes: 5 },
          timeout: { minutes: 3 },
        },
      },
    ]);
  });

  it('applies defaults for optional fields', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitea: {
            default: {
              host: 'gitea.com',
              organization: 'default-org',
            },
          },
        },
      },
    });

    const result = readGiteaConfigs(config);

    expect(result[0]).toMatchObject({
      id: 'default',
      host: 'gitea.com',
      organization: 'default-org',
      branch: 'main',
      catalogPath: 'catalog-info.yaml',
      schedule: undefined,
    });
  });

  it('throws if required fields are missing', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitea: {
            bad: {},
          },
        },
      },
    });

    expect(() => readGiteaConfigs(config)).toThrow(
      /Missing required config value/,
    );
  });
});
