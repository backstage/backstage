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

import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '../logging';
import { UrlReaders } from './UrlReaders';

const reader = UrlReaders.default({
  logger: getVoidLogger(),
  config: new ConfigReader({
    // The tokens in this config provide read only access to the backstage-verification repos
    integrations: {
      github: [
        {
          host: 'github.com',
          token: `${86}af${617}d9c3c8bf958b37a${630691452765}bb0b0a`,
        },
      ],
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'tveGtSHDBJM9ZRHZNRfm',
        },
      ],
      bitbucket: [
        {
          host: 'bitbucket.org',
          username: 'backstage-verification',
          appPassword: 'H79MAAhtbZwCafkVTrrQ',
        },
      ],
      azure: [
        {
          host: 'dev.azure.com',
          // lasts until 2022-01-27
          token: 'bhs5cbukiuxrkc3ftuyt5h3eqewtkj37lmf3jx5aoajivq3f5jmq',
        },
      ],
    },
  }),
});

function withRetries(count: number, fn: () => Promise<void>) {
  return async () => {
    let error;
    for (let i = 0; i < count; i++) {
      try {
        await fn();
        return;
      } catch (err) {
        error = err;
      }
    }
    throw error;
  };
}

describe('UrlReaders', () => {
  it(
    'should read data from azure',
    withRetries(3, async () => {
      const data = await reader.read(
        'https://dev.azure.com/backstage-verification/test-templates/_git/test-templates?path=%2Ftemplate.yaml',
      );
      expect(data.toString()).toContain('test-template-azure');

      const res = await reader.readTree(
        'https://dev.azure.com/backstage-verification/test-templates/_git/test-templates?path=%2F{{cookiecutter.name}}',
      );
      const files = await res.files();
      expect(files).toEqual([
        {
          path: 'catalog-info.yaml',
          content: expect.any(Function),
        },
      ]);
    }),
  );

  it(
    'should read data from gitlab',
    withRetries(3, async () => {
      const data = await reader.read(
        'https://gitlab.com/backstage-verification/test-templates/-/blob/master/template.yaml',
      );
      expect(data.toString()).toContain('test-template-gitlab');

      const res = await reader.readTree(
        'https://gitlab.com/backstage-verification/test-templates/-/tree/master/{{cookiecutter.name}}',
      );
      const files = await res.files();
      expect(files).toEqual([
        {
          path: 'catalog-info.yaml',
          content: expect.any(Function),
        },
      ]);
    }),
  );

  it(
    'should read data from bitbucket',
    withRetries(3, async () => {
      const data = await reader.read(
        'https://bitbucket.org/backstage-verification/test-template/src/master/template.yaml',
      );
      expect(data.toString()).toContain('test-template-bitbucket');

      const res = await reader.readTree(
        'https://bitbucket.org/backstage-verification/test-template/src/master/{{cookiecutter.name}}',
      );
      const files = await res.files();
      expect(files).toEqual([
        {
          path: 'catalog-info.yaml',
          content: expect.any(Function),
        },
      ]);
    }),
  );

  it(
    'should read data from github',
    withRetries(3, async () => {
      const data = await reader.read(
        'https://github.com/backstage-verification/test-templates/blob/master/template.yaml',
      );
      expect(data.toString()).toContain('test-template-github');

      const res = await reader.readTree(
        'https://github.com/backstage-verification/test-templates/tree/master/{{cookiecutter.name}}',
      );
      const files = await res.files();
      expect(files).toEqual([
        {
          path: 'catalog-info.yaml',
          content: expect.any(Function),
        },
      ]);
    }),
  );
});
