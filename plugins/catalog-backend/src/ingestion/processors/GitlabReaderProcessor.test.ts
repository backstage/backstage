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
  GitlabReaderProcessor,
  ProviderConfig,
  readConfig,
} from './GitlabReaderProcessor';

describe('GitlabReaderProcessor', () => {
  describe('getApiRequestOptions', () => {
    it('sets the correct API version', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect((getApiRequestOptions(config).headers as any).Accept).toEqual(
        'application/json',
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
        (getApiRequestOptions(withToken).headers as any)['PRIVATE-TOKEN'],
      ).toEqual('A');
      expect(
        (getApiRequestOptions(withoutToken).headers as any)['PRIVATE-TOKEN'],
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
        (getRawRequestOptions(withToken).headers as any)['PRIVATE-TOKEN'],
      ).toEqual('A');
      expect(
        (getRawRequestOptions(withoutToken).headers as any)['PRIVATE-TOKEN'],
      ).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for gitlab', () => {
      const config: ProviderConfig = {
        target: 'https://gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
      };
      expect(
        getApiUrl(
          'https://gitlab.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://gitlab.com/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for gitlab with extra /-/ in path', () => {
      const config: ProviderConfig = {
        target: 'https://gitlab.com',
        apiBaseUrl: 'https://gitlab.com/api/v4',
      };
      expect(
        getApiUrl(
          'https://gitlab.com/a/b/-/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://gitlab.com/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for self hosted', () => {
      const config: ProviderConfig = {
        target: 'https://git.mycompany.net',
        apiBaseUrl: 'https://git.mycompany.net/api/v4',
      };
      expect(
        getApiUrl(
          'https://git.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://git.mycompany.net/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for self hosted with extra /-/ in path', () => {
      const config: ProviderConfig = {
        target: 'https://git.mycompany.net',
        apiBaseUrl: 'https://git.mycompany.net/api/v4',
      };
      expect(
        getApiUrl(
          'https://git.mycompany.net/a/b/-/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://git.mycompany.net/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });
  });

  describe('getRawUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { target: '', apiBaseUrl: '' };
      expect(() => getRawUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });

    it('happy path for gitlab', () => {
      const config: ProviderConfig = {
        target: 'https://gitlab.com',
        rawBaseUrl: 'https://gitlab.com',
      };
      expect(
        getRawUrl(
          'https://gitlab.com/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://gitlab.com/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for gitlab with extra /-/ in path', () => {
      const config: ProviderConfig = {
        target: 'https://gitlab.com',
        rawBaseUrl: 'https://gitlab.com',
      };
      expect(
        getRawUrl(
          'https://gitlab.com/a/b/-/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://gitlab.com/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for self hosted', () => {
      const config: ProviderConfig = {
        target: 'https://git.mycompany.net',
        rawBaseUrl: 'https://git.mycompany.net',
      };
      expect(
        getRawUrl(
          'https://git.mycompany.net/a/b/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://git.mycompany.net/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
        ),
      );
    });

    it('happy path for self hosted with extra /-/ in path', () => {
      const config: ProviderConfig = {
        target: 'https://git.mycompany.net',
        rawBaseUrl: 'https://git.mycompany.net',
      };
      expect(
        getRawUrl(
          'https://git.mycompany.net/a/b/-/blob/branchname/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://git.mycompany.net/api/v4/projects/a/b/repository/files/path/to/c.yaml/raw?ref=branchname',
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
            catalog: { processors: { gitlab: { providers } } },
          },
        },
      ]);
    }

    it('adds a default GitLab entry when missing', () => {
      const output = readConfig(config([]), getVoidLogger());
      expect(output).toEqual([
        {
          target: 'https://gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
          rawBaseUrl: 'https://gitlab.com',
        },
      ]);
    });

    it('injects the correct GitLab API base URL when missing', () => {
      const output = readConfig(
        config([{ target: 'https://gitlab.com' }]),
        getVoidLogger(),
      );
      expect(output).toEqual([
        {
          target: 'https://gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
          rawBaseUrl: 'https://gitlab.com',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() =>
        readConfig(
          config([{ target: 'https://git.company.com' }]),
          getVoidLogger(),
        ),
      ).toThrow(
        'Provider at https://git.company.com must configure an explicit apiBaseUrl or rawBaseUrl',
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
          config([{ target: 'https://gitlab.com', apiBaseUrl: 7 } as any]),
          getVoidLogger(),
        ),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(
          config([{ target: 'https://gitlab.com', token: 7 } as any]),
          getVoidLogger(),
        ),
      ).toThrow(/token/);
    });
  });

  describe('implementation', () => {
    it('rejects unknown types', async () => {
      const processor = new GitlabReaderProcessor([
        {
          target: 'https://gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ]);
      const location: LocationSpec = {
        type: 'not-github/api',
        target: 'https://gitlab.com',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).resolves.toBeFalsy();
    });

    it('rejects unknown targets', async () => {
      const processor = new GitlabReaderProcessor([
        {
          target: 'https://gitlab.com',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ]);
      const location: LocationSpec = {
        type: 'gitlab',
        target: 'https://not.gitlab.com/apa',
      };
      await expect(
        processor.readLocation(location, false, () => {}),
      ).rejects.toThrow(
        'There is no GitLab provider that matches https://not.gitlab.com/apa. Please add a configuration entry for it under catalog.processors.gitlab.providers.',
      );
    });
  });
});
