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

import { GitlabApiReaderProcessor } from './GitlabApiReaderProcessor';
import { ConfigReader } from '@backstage/config';

describe('GitlabApiReaderProcessor', () => {
  const createConfig = (token: string | undefined) =>
    ConfigReader.fromConfigs([
      {
        context: '',
        data: {
          catalog: {
            processors: {
              gitlabApi: {
                privateToken: token,
              },
            },
          },
        },
      },
    ]);

  it('should build raw api', () => {
    const processor = new GitlabApiReaderProcessor(createConfig(undefined));

    const tests = [
      {
        target:
          'https://gitlab.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        url: new URL(
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
        ),
        err: undefined,
      },
      {
        target:
          'https://gitlab.example.com/groupA/teams/teamA/subgroupA/repoA/-/blob/branch/my/path/to/file.yaml',
        url: new URL(
          'https://gitlab.example.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
        ),
        err: undefined,
      },
      {
        target:
          'https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path/to/file.yaml', // Repo not in subgroup
        url: new URL(
          'https://gitlab.com/api/v4/projects/12345/repository/files/my%2Fpath%2Fto%2Ffile.yaml/raw?ref=branch',
        ),
        err: undefined,
      },
      {
        target:
          'https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path/',
        url: null,
        err:
          'Incorrect url: https://gitlab.com/groupA/teams/teamA/repoA/-/blob/branch/my/path/, Error: GitLab url does not end in .ya?ml',
      },
    ];

    for (const test of tests) {
      if (test.err) {
        expect(() => processor.buildRawUrl(test.target, 12345)).toThrowError(
          test.err,
        );
      } else if (test.url) {
        expect(processor.buildRawUrl(test.target, 12345).toString()).toEqual(
          test.url.toString(),
        );
      } else {
        throw new Error(
          'This should not have happened. Either err or url should have matched.',
        );
      }
    }
  });

  it('should return request options', () => {
    const tests = [
      {
        token: '0123456789',
        expect: {
          headers: {
            'PRIVATE-TOKEN': '0123456789',
          },
        },
      },
      {
        token: '',
        err:
          "Invalid type in config for key 'catalog.processors.gitlabApi.privateToken' in '', got empty-string, wanted string",
        expect: {
          headers: {
            'PRIVATE-TOKEN': '',
          },
        },
      },
      {
        token: undefined,
        expect: {
          headers: {
            'PRIVATE-TOKEN': '',
          },
        },
      },
    ];

    for (const test of tests) {
      if (test.err) {
        expect(
          () => new GitlabApiReaderProcessor(createConfig(test.token)),
        ).toThrowError(test.err);
      } else {
        const processor = new GitlabApiReaderProcessor(
          createConfig(test.token),
        );
        expect(processor.getRequestOptions()).toEqual(test.expect);
      }
    }
  });
});
