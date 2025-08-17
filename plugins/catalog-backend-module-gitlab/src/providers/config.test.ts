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

import { ConfigReader } from '@backstage/config';
import { readGitlabConfigs } from './config';

describe('config', () => {
  it('empty gitlab config', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {},
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(0);
  });

  it('valid config with default optional params', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: undefined,
        fallbackBranch: 'master',
        host: 'host',
        catalogFile: 'catalog-info.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        skipForkedRepos: false,
        includeArchivedRepos: false,
        excludeRepos: [],
        restrictUsersToGroup: false,
        includeUsersWithoutSeat: false,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with custom optional params', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              includeUsersWithoutSeat: true,
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        skipForkedRepos: false,
        includeArchivedRepos: false,
        excludeRepos: [],
        restrictUsersToGroup: false,
        includeUsersWithoutSeat: true,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with skipForkedRepos', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              skipForkedRepos: true,
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: true,
        includeArchivedRepos: false,
        includeUsersWithoutSeat: false,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with includeArchivedRepos', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              includeArchivedRepos: true,
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: false,
        includeArchivedRepos: true,
        includeUsersWithoutSeat: false,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with excludeRepos', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              skipForkedRepos: false,
              excludeRepos: ['foo/bar', 'quz/qux'],
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        skipForkedRepos: false,
        includeArchivedRepos: false,
        excludeRepos: ['foo/bar', 'quz/qux'],
        includeUsersWithoutSeat: false,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with schedule', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              schedule: {
                frequency: 'PT30M',
                timeout: {
                  minutes: 3,
                },
              },
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: undefined,
        fallbackBranch: 'master',
        host: 'host',
        catalogFile: 'catalog-info.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        skipForkedRepos: false,
        includeArchivedRepos: false,
        restrictUsersToGroup: false,
        excludeRepos: [],
        includeUsersWithoutSeat: false,
        membership: undefined,
        topics: undefined,
        schedule: {
          frequency: { minutes: 30 },
          timeout: {
            minutes: 3,
          },
          initialDelay: undefined,
          scope: undefined,
        },
      }),
    );
  });

  it('missing params', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              branch: 'not-master',
              entityFilename: 'custom-file.yaml',
            },
          },
        },
      },
    });

    expect(() => readGitlabConfigs(config)).toThrow(
      "Missing required config value at 'catalog.providers.gitlab.test.host'",
    );
  });

  it('read full gitlab project', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              host: 'host',
              branch: 'main',
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    expect(result[0].group).toEqual('');
  });

  it('valid config with membership', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              membership: true,
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: false,
        includeUsersWithoutSeat: false,
        includeArchivedRepos: false,
        membership: true,
        topics: undefined,
      }),
    );
  });

  it('valid config with empyt topics', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              topics: [],
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: false,
        includeUsersWithoutSeat: false,
        includeArchivedRepos: false,
        membership: undefined,
        topics: undefined,
      }),
    );
  });

  it('valid config with single topics', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              topics: ['topic1'],
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: false,
        includeUsersWithoutSeat: false,
        includeArchivedRepos: false,
        membership: undefined,
        topics: 'topic1',
      }),
    );
  });

  it('valid config with multiple topics', () => {
    const config = new ConfigReader({
      catalog: {
        providers: {
          gitlab: {
            test: {
              group: 'group',
              host: 'host',
              branch: 'not-master',
              fallbackBranch: 'main',
              entityFilename: 'custom-file.yaml',
              topics: ['topic1', 'topic2', 'topic3'],
            },
          },
        },
      },
    });

    const result = readGitlabConfigs(config);
    expect(result).toHaveLength(1);
    result.forEach(r =>
      expect(r).toStrictEqual({
        id: 'test',
        group: 'group',
        branch: 'not-master',
        fallbackBranch: 'main',
        host: 'host',
        catalogFile: 'custom-file.yaml',
        projectPattern: /[\s\S]*/,
        groupPattern: /[\s\S]*/,
        userPattern: /[\s\S]*/,
        orgEnabled: false,
        allowInherited: false,
        relations: [],
        schedule: undefined,
        restrictUsersToGroup: false,
        excludeRepos: [],
        skipForkedRepos: false,
        includeUsersWithoutSeat: false,
        includeArchivedRepos: false,
        membership: undefined,
        topics: 'topic1,topic2,topic3',
      }),
    );
  });
});
