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
import { ConfigReader } from '@backstage/config';
import { GitLabIntegration } from '@backstage/integration';

import {
  readGitLabOrgProviderConfig,
  groupByIntegrationConfig,
} from './config';

describe('readGitLabOrgProviderConfig', () => {
  it('provides empty array if empty config', () => {
    expect(readGitLabOrgProviderConfig(new ConfigReader({}))).toEqual([]);
  });

  it('errors out if target is missing', () => {
    const config = {
      gitlabOrg: {
        providers: [
          {}, // missing target
        ],
      },
    };
    expect(() =>
      readGitLabOrgProviderConfig(new ConfigReader(config)),
    ).toThrowError();
  });

  it('uses default config values for users and groups', () => {
    const config = {
      gitlabOrg: {
        providers: [
          {
            target: 'https://example.com/group/subgroup',
          },
        ],
      },
    };
    const providerConfig = readGitLabOrgProviderConfig(
      new ConfigReader(config),
    );
    expect(providerConfig[0]).toEqual({
      target: 'https://example.com/group/subgroup',
      users: {
        ingest: true,
        exclude: [],
        prefix: '',
      },
      groups: {
        ingest: true,
        exclude: [],
        prefix: '',
        delimiter: '.',
      },
    });
  });

  it('uses all values from user provided config', () => {
    const config = {
      gitlabOrg: {
        providers: [
          {
            target: 'https://example.com/group/subgroup',
            users: {
              ingest: true,
              exclude: ['1001'],
              prefix: 'prefix-a-',
            },
            groups: {
              ingest: false,
              exclude: ['1002'],
              prefix: 'prefix-b-',
              delimiter: '--',
            },
          },
        ],
      },
    };
    const providerConfig = readGitLabOrgProviderConfig(
      new ConfigReader(config),
    );
    expect(providerConfig[0]).toEqual({
      target: 'https://example.com/group/subgroup',
      users: {
        ingest: true,
        exclude: ['1001'],
        prefix: 'prefix-a-',
      },
      groups: {
        ingest: false,
        exclude: ['1002'],
        prefix: 'prefix-b-',
        delimiter: '--',
      },
    });
  });

  it('should trim trailing forward slash in target', () => {
    const config = {
      gitlabOrg: {
        providers: [
          {
            target: 'https://example.com/group/subgroup/',
          },
        ],
      },
    };
    const providerConfig = readGitLabOrgProviderConfig(
      new ConfigReader(config),
    );
    expect(providerConfig[0]).toHaveProperty(
      'target',
      'https://example.com/group/subgroup',
    );
  });

  it('handles multiple targets', () => {
    const config = {
      gitlabOrg: {
        providers: [
          {
            target: 'https://example.com/group/subgroup',
          },
          {
            target: 'https://gitlab.com/group',
          },
        ],
      },
    };
    const providerConfig = readGitLabOrgProviderConfig(
      new ConfigReader(config),
    );
    expect(providerConfig).toHaveLength(2);
    expect(providerConfig[0]).toHaveProperty(
      'target',
      'https://example.com/group/subgroup',
    );
    expect(providerConfig[1]).toHaveProperty(
      'target',
      'https://gitlab.com/group',
    );
  });

  it('sets values using user defaults over built-in defaults', () => {
    const config = {
      gitlabOrg: {
        defaults: {
          users: {
            ingest: false,
            exclude: ['123'],
            prefix: 'test',
          },
          groups: {
            ingest: false,
            exclude: ['456'],
            prefix: 'value',
            delimiter: '__',
          },
        },
        providers: [
          {
            target: 'https://example.com/group/subgroup',
          },
        ],
      },
    };
    const providerConfig = readGitLabOrgProviderConfig(
      new ConfigReader(config),
    );
    expect(providerConfig[0]).toEqual({
      target: 'https://example.com/group/subgroup',
      users: {
        ingest: false,
        exclude: ['123'],
        prefix: 'test',
      },
      groups: {
        ingest: false,
        exclude: ['456'],
        prefix: 'value',
        delimiter: '__',
      },
    });
  });
});

describe('groupByIntegrationConfig', () => {
  const mockIntegrationConfig = new GitLabIntegration({
    host: 'example.com',
    apiBaseUrl: 'https://example.com/api/v4',
    token: 'token',
    baseUrl: 'https://example.com',
  });

  it('should throw if integration config is missing', () => {
    const mockByUrl = jest.fn();
    // ensure all calls to byUrl are undefined
    mockByUrl.mockReturnValue(undefined);

    const providerConfigs = [
      {
        target: 'https://example.com/group/subgroup',
        users: {
          ingest: true,
          exclude: [],
          prefix: '',
        },
        groups: {
          ingest: true,
          exclude: [],
          prefix: '',
          delimiter: '.',
        },
      },
    ];

    expect(() =>
      groupByIntegrationConfig(mockByUrl, providerConfigs),
    ).toThrowError();
  });

  it('should use integration config as key and add provider config to value', () => {
    const mockByUrl = jest.fn();
    mockByUrl.mockReturnValue(mockIntegrationConfig);

    const testProviderConfig = {
      target: 'https://example.com/group/subgroup',
      users: {
        ingest: true,
        exclude: [],
        prefix: '',
      },
      groups: {
        ingest: true,
        exclude: [],
        prefix: '',
        delimiter: '.',
      },
    };
    const grouping = groupByIntegrationConfig(mockByUrl, [testProviderConfig]);

    expect(grouping.has(mockIntegrationConfig.config)).toEqual(true);
    expect(grouping.get(mockIntegrationConfig.config)).toContain(
      testProviderConfig,
    );
  });

  it('should group providers which should use the same integration config together', () => {
    const mockByUrl = jest.fn();
    mockByUrl.mockReturnValue(mockIntegrationConfig);

    const testProviderConfigOne = {
      target: 'https://example.com/group',
      users: {
        ingest: true,
        exclude: [],
        prefix: '',
      },
      groups: {
        ingest: true,
        exclude: [],
        prefix: '',
        delimiter: '.',
      },
    };
    const testProviderConfigTwo = {
      target: 'https://example.com/group/subgroup',
      users: {
        ingest: true,
        exclude: [],
        prefix: '',
      },
      groups: {
        ingest: true,
        exclude: [],
        prefix: '',
        delimiter: '.',
      },
    };
    const grouping = groupByIntegrationConfig(mockByUrl, [
      testProviderConfigOne,
      testProviderConfigTwo,
    ]);

    expect(grouping.has(mockIntegrationConfig.config)).toEqual(true);
    expect(grouping.size).toEqual(1);
    expect(grouping.get(mockIntegrationConfig.config)).toEqual(
      expect.arrayContaining([testProviderConfigOne, testProviderConfigTwo]),
    );
  });
});
