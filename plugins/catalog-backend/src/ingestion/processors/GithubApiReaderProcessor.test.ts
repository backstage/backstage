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

import { GithubApiReaderProcessor } from './GithubApiReaderProcessor';
import { ConfigReader } from '@backstage/config';

describe('GithubApiReaderProcessor', () => {
  const createConfig = (token: string | undefined) =>
    ConfigReader.fromConfigs([
      {
        context: '',
        data: {
          catalog: {
            processors: {
              githubApi: {
                privateToken: token,
              },
            },
          },
        },
      },
    ]);

  it('should build raw api', () => {
    const processor = new GithubApiReaderProcessor(createConfig(undefined));

    const tests = [
      {
        target: 'https://github.com/a/b/blob/master/path/to/c.yaml',
        url: new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=master',
        ),
        err: undefined,
      },
      {
        target: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong GitHub URL or Invalid file path',
      },
      {
        target: 'com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
      },
      {
        target:
          'https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/playback-order-component.yaml',
        url: new URL(
          'https://api.github.com/repos/spotify/backstage/contents/packages/catalog-model/examples/playback-order-component.yaml?ref=master',
        ),
        err: undefined,
      },
    ];

    for (const test of tests) {
      if (test.err) {
        expect(() => processor.buildRawUrl(test.target)).toThrowError(test.err);
      } else if (test.url) {
        expect(processor.buildRawUrl(test.target).toString()).toEqual(
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
            Accept: 'application/vnd.github.v3.raw',
            Authorization: 'token 0123456789',
          },
        },
      },
      {
        token: '',
        err:
          "Invalid type in config for key 'catalog.processors.githubApi.privateToken' in '', got empty-string, wanted string",
        expect: {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        },
      },
      {
        token: undefined,
        expect: {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        },
      },
    ];

    for (const test of tests) {
      if (test.err) {
        expect(
          () => new GithubApiReaderProcessor(createConfig(test.token)),
        ).toThrowError(test.err);
      } else {
        const processor = new GithubApiReaderProcessor(
          createConfig(test.token),
        );
        expect(processor.getRequestOptions()).toEqual(test.expect);
      }
    }
  });
});
