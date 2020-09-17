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

import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  getRawUrl,
  getRequestOptions,
  GithubApiReaderProcessor,
  ProviderConfig,
  readConfig,
} from './GithubApiReaderProcessor';

describe('GithubApiReaderProcessor', () => {
  describe('getRequestOptions', () => {
    it('sets the correct API version', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect((getRequestOptions(config).headers as any).Accept).toEqual(
        'application/vnd.github.v3.raw',
      );
    });

    it('inserts a token when needed', () => {
      const withToken: ProviderConfig = {
        target: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: ProviderConfig = {
        target: '',
        apiBaseUrl: '',
      };
      expect(
        (getRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getRawUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect(() => getRawUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('passes through the happy path', () => {
      const config: ProviderConfig = {
        target: 'https://github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getRawUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
    });
  });

  describe('readConfig', () => {
    function config(
      providers: { target: string; apiBaseUrl?: string; token?: string }[],
    ) {
      return ConfigReader.fromConfigs([
        {
          context: '',
          data: {
            catalog: { processors: { githubApi: { providers } } },
          },
        },
      ]);
    }

    it('adds a default GitHub entry when missing', () => {
      const output = readConfig(config([]));
      expect(output).toEqual([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
    });

    it('injects the correct GitHub API base URL when missing', () => {
      const output = readConfig(config([{ target: 'https://github.com' }]));
      expect(output).toEqual([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
    });

    it('rejects custom targets with no API base URL', () => {
      expect(() =>
        readConfig(config([{ target: 'https://ghe.company.com' }])),
      ).toThrow(
        'Provider at https://ghe.company.com must configure an explicit apiBaseUrl',
      );
    });

    it('rejects funky configs', () => {
      expect(() => readConfig(config([{ target: 7 } as any]))).toThrow(
        /target/,
      );
      expect(() => readConfig(config([{ noTarget: '7' } as any]))).toThrow(
        /target/,
      );
      expect(() =>
        readConfig(
          config([{ target: 'https://github.com', apiBaseUrl: 7 } as any]),
        ),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(config([{ target: 'https://github.com', token: 7 } as any])),
      ).toThrow(/token/);
    });
  });

  describe('implementation', () => {
    it('rejects unknown types', async () => {
      const processor = new GithubApiReaderProcessor([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
      const location: LocationSpec = {
        type: 'not-github/api',
        target: 'https://github.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = new GithubApiReaderProcessor([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
      const location: LocationSpec = {
        type: 'github/api',
        target: 'https://not.github.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        /There is no GitHub provider that matches https:\/\/not.github.com\/apa/,
      );
    });
  });
});
