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

import { getVoidLogger } from '@backstage/backend-common';
import { LocationSpec } from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import {
  getApiRequestOptions,
  getApiUrl,
  getRawRequestOptions,
  getRawUrl,
  GithubReaderProcessor,
  ProviderConfig,
  readConfig,
} from './GithubReaderProcessor';

describe('GithubReaderProcessor', () => {
  describe('getApiRequestOptions', () => {
    it('sets the correct API version', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect((getApiRequestOptions(config).headers as any).Accept).toEqual(
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
        (getApiRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getApiRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getRawRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: ProviderConfig = {
        target: '',
        rawBaseUrl: '',
        token: 'A',
      };
      const withoutToken: ProviderConfig = {
        target: '',
        rawBaseUrl: '',
      };
      expect(
        (getRawRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('token A');
      expect(
        (getRawRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: ProviderConfig = {
        target: 'https://github.com',
        apiBaseUrl: 'https://api.github.com',
      };
      expect(
        getApiUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
      expect(
        getApiUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.github.com/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
    });

    it('happy path for ghe', () => {
      const config: ProviderConfig = {
        target: 'https://ghe.mycompany.net',
        apiBaseUrl: 'https://ghe.mycompany.net/api/v3',
      };
      expect(
        getApiUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://ghe.mycompany.net/api/v3/repos/a/b/contents/path/to/c.yaml?ref=branchname',
        ),
      );
    });
  });

  describe('getRawUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect(() => getRawUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for github', () => {
      const config: ProviderConfig = {
        target: 'https://github.com',
        rawBaseUrl: 'https://raw.githubusercontent.com',
      };
      expect(
        getRawUrl(
          'https://github.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://raw.githubusercontent.com/a/b/branchname/path/to/c.yaml',
        ),
      );
    });

    it('happy path for ghe', () => {
      const config: ProviderConfig = {
        target: 'https://ghe.mycompany.net',
        rawBaseUrl: 'https://ghe.mycompany.net/raw',
      };
      expect(
        getRawUrl(
          'https://ghe.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL('https://ghe.mycompany.net/raw/a/b/branchname/path/to/c.yaml'),
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
            catalog: { processors: { github: { providers } } },
          },
        },
      ]);
    }

    it('adds a default GitHub entry when missing', () => {
      const output = readConfig(config([]), getVoidLogger());
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
          rawBaseUrl: 'https://raw.githubusercontent.com',
        },
      ]);
    });

    it('injects the correct GitHub API base URL when missing', () => {
      const output = readConfig(
        config([{ target: 'https://github.com' }]),
        getVoidLogger(),
      );
      expect(output).toEqual([
        {
          target: 'https://github.com',
          apiBaseUrl: 'https://api.github.com',
          rawBaseUrl: 'https://raw.githubusercontent.com',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() =>
        readConfig(
          config([{ target: 'https://ghe.company.com' }]),
          getVoidLogger(),
        ),
      ).toThrow(
        'Provider at https://ghe.company.com must configure an explicit apiBaseUrl or rawBaseUrl',
      );
    });

    it('rejects funky configs', () => {
      expect(() =>
        readConfig(config([{ target: 7 } as any]), getVoidLogger()),
      ).toThrow(/target/);
      expect(() =>
        readConfig(config([{ noTarget: '7' } as any]), getVoidLogger()),
      ).toThrow(/target/);
      expect(() =>
        readConfig(
          config([{ target: 'https://github.com', apiBaseUrl: 7 } as any]),
          getVoidLogger(),
        ),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(
          config([{ target: 'https://github.com', token: 7 } as any]),
          getVoidLogger(),
        ),
      ).toThrow(/token/);
    });
  });

  describe('implementation', () => {
    it('rejects unknown types', async () => {
      const processor = new GithubReaderProcessor([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
      const location: LocationSpec = {
        type: 'not-github',
        target: 'https://github.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = new GithubReaderProcessor([
        { target: 'https://github.com', apiBaseUrl: 'https://api.github.com' },
      ]);
      const location: LocationSpec = {
        type: 'github',
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
