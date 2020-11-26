/*
 * Copyright 2020 Spotify AB
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

import {
  getGitRepoType,
  getGithubHostToken,
  getTokenForGitRepo,
} from './git-auth';
import { Config } from '@backstage/config';

describe('getGitRepoType', () => {
  it('should get the repo type github', async () => {
    const url = 'https://github.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('github');
  });

  it('should get the repo type gitlab', async () => {
    const url = 'https://gitlab.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('gitlab');
  });
  it('should get the repo type azure/api', async () => {
    const url = 'https://azure.com/backstage/backstage/blob/master/subfolder/';

    const output = getGitRepoType(url);

    expect(output).toBe('azure/api');
  });
});
describe('getGithubHostToken', () => {
  it('should get the github host token from the config', async () => {
    const host = '';
    class MockConfig implements Partial<Config> {
      getOptionalConfigArray() {
        return [];
      }
      get() {
        return '';
      }
      getBoolean() {
        return true;
      }
      getConfig() {
        return <Config>{};
      }
      has() {
        return false;
      }
      keys() {
        return [];
      }
      getConfigArray() {
        return [<Config>{}];
      }
      getNumber() {
        return 0;
      }
      getOptional() {
        return '';
      }
      getOptionalBoolean() {
        return true;
      }
      getOptionalConfig() {
        return undefined;
      }
      getOptionalNumber() {
        return 0;
      }
      getOptionalString() {
        return '';
      }
      getOptionalStringArray() {
        return [''];
      }
      getString() {
        return '';
      }
      getStringArray() {
        return [];
      }
    }

    const output = getGithubHostToken(new MockConfig(), host);

    expect(output).toBe('');
  });
});
describe('getTokenForGitRepo', () => {
  it('should get the github token for github repo', async () => {
    const repositoryUrl =
      'https://github.com/backstage/backstage/blob/master/subfolder/';

    const output = await getTokenForGitRepo(repositoryUrl);

    expect(output).toBe(undefined);
  });
});
