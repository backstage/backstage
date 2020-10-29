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
import {
  BitbucketUrlReader,
  getApiRequestOptions,
  getApiUrl,
  ProviderConfig,
  readConfig,
} from './BitbucketUrlReader';

describe('BitbucketUrlReader', () => {
  describe('getApiRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: ProviderConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: ProviderConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getApiRequestOptions(withToken).headers as any).Authorization,
      ).toEqual('Bearer A');
      expect(
        (getApiRequestOptions(withoutToken).headers as any).Authorization,
      ).toBeUndefined();
    });

    it('insert basic auth when needed', () => {
      const withUsernameAndPassword: ProviderConfig = {
        host: '',
        apiBaseUrl: '',
        username: 'some-user',
        appPassword: 'my-secret',
      };
      const withoutUsernameAndPassword: ProviderConfig = {
        host: '',
        apiBaseUrl: '',
      };
      expect(
        (getApiRequestOptions(withUsernameAndPassword).headers as any)
          .Authorization,
      ).toEqual('Basic c29tZS11c2VyOm15LXNlY3JldA==');
      expect(
        (getApiRequestOptions(withoutUsernameAndPassword).headers as any)
          .Authorization,
      ).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('rejects targets that do not look like URLs', () => {
      const config: ProviderConfig = { host: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });
    it('happy path for Bitbucket Cloud', () => {
      const config: ProviderConfig = {
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      };
      expect(
        getApiUrl(
          'https://bitbucket.org/org-name/repo-name/src/master/templates/my-template.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://api.bitbucket.org/2.0/repositories/org-name/repo-name/src/master/templates/my-template.yaml',
        ),
      );
    });
    it('happy path for Bitbucket Server', () => {
      const config: ProviderConfig = {
        host: 'bitbucket.mycompany.net',
        apiBaseUrl: 'https://bitbucket.mycompany.net/rest/api/1.0',
      };
      expect(
        getApiUrl(
          'https://bitbucket.mycompany.net/projects/a/repos/b/browse/path/to/c.yaml',
          config,
        ),
      ).toEqual(
        new URL(
          'https://bitbucket.mycompany.net/rest/api/1.0/projects/a/repos/b/raw/path/to/c.yaml',
        ),
      );
    });
  });

  describe('readConfig', () => {
    function config(
      providers: {
        host: string;
        apiBaseUrl?: string;
        token?: string;
        username?: string;
        password?: string;
      }[],
    ) {
      return ConfigReader.fromConfigs([
        {
          context: '',
          data: {
            integrations: { bitbucket: providers },
          },
        },
      ]);
    }

    it('adds a default Bitbucket Cloud entry when missing', () => {
      const output = readConfig(config([]));
      expect(output).toEqual([
        {
          host: 'bitbucket.org',
          apiBaseUrl: 'https://api.bitbucket.org/2.0',
        },
      ]);
    });

    it('injects the correct Bitbucket Cloud API base URL when missing', () => {
      const output = readConfig(config([{ host: 'bitbucket.org' }]));
      expect(output).toEqual([
        {
          host: 'bitbucket.org',
          apiBaseUrl: 'https://api.bitbucket.org/2.0',
        },
      ]);
    });

    it('rejects custom targets with no base URLs', () => {
      expect(() =>
        readConfig(config([{ host: 'bitbucket.mycompany.net' }])),
      ).toThrow(
        "Bitbucket integration for 'bitbucket.mycompany.net' must configure an explicit apiBaseUrl",
      );
    });

    it('rejects funky configs', () => {
      expect(() => readConfig(config([{ host: 7 } as any]))).toThrow(/host/);
      expect(() => readConfig(config([{ token: 7 } as any]))).toThrow(/token/);
      expect(() =>
        readConfig(config([{ host: 'bitbucket.org', apiBaseUrl: 7 } as any])),
      ).toThrow(/apiBaseUrl/);
      expect(() =>
        readConfig(config([{ host: 'bitbucket.org', token: 7 } as any])),
      ).toThrow(/token/);
    });
  });

  describe('implementation', () => {
    it('rejects unknown targets', async () => {
      const processor = new BitbucketUrlReader({
        host: 'bitbucket.org',
        apiBaseUrl: 'https://api.bitbucket.org/2.0',
      });
      await expect(
        processor.read('https://not.bitbucket.com/apa'),
      ).rejects.toThrow(
        'Incorrect URL: https://not.bitbucket.com/apa, Error: Invalid Bitbucket URL or file path',
      );
    });
  });
});
