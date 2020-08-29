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

import { AzureApiReaderProcessor } from './AzureApiReaderProcessor';
import { ConfigReader } from '@backstage/config';

describe('AzureApiReaderProcessor', () => {
  const createConfig = (token: string | undefined) =>
    ConfigReader.fromConfigs([
      {
        context: '',
        data: {
          catalog: {
            processors: {
              azureApi: {
                privateToken: token,
              },
            },
          },
        },
      },
    ]);

  it('should build raw api', () => {
    const processor = new AzureApiReaderProcessor(createConfig(undefined));
    const tests = [
      {
        target:
          'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        url: new URL(
          'https://dev.azure.com/org-name/project-name/_apis/sourceProviders/TfsGit/filecontents?repository=repo-name&commitOrBranch=master&path=my-template.yaml&api-version=6.0-preview.1',
        ),
        err: undefined,
      },
      {
        target: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: https://api.com/a/b/blob/master/path/to/c.yaml, Error: Wrong Azure Devops URL or Invalid file path',
      },
      {
        target: 'com/a/b/blob/master/path/to/c.yaml',
        url: null,
        err:
          'Incorrect url: com/a/b/blob/master/path/to/c.yaml, TypeError: Invalid URL: com/a/b/blob/master/path/to/c.yaml',
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
            Authorization: 'Basic OjAxMjM0NTY3ODk=',
          },
        },
      },
      {
        token: '',
        expect: {
          headers: {},
        },
      },
      {
        token: undefined,
        expect: {
          headers: {},
        },
      },
    ];

    for (const test of tests) {
      const processor = new AzureApiReaderProcessor(createConfig(test.token));
      expect(processor.getRequestOptions()).toEqual(test.expect);
    }
  });
});
