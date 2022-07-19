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
        branch: 'master',
        host: 'host',
        catalogFile: 'catalog-info.yaml',
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
              entityFilename: 'custom-file.yaml',
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
        host: 'host',
        catalogFile: 'custom-file.yaml',
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
});
