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

import { BitbucketIntegrationConfig } from '@backstage/integration';
import {
  BitbucketUrlReader,
  getApiRequestOptions,
  getApiUrl,
} from './BitbucketUrlReader';

describe('BitbucketUrlReader', () => {
  describe('getApiRequestOptions', () => {
    it('inserts a token when needed', () => {
      const withToken: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        token: 'A',
      };
      const withoutToken: BitbucketIntegrationConfig = {
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
      const withUsernameAndPassword: BitbucketIntegrationConfig = {
        host: '',
        apiBaseUrl: '',
        username: 'some-user',
        appPassword: 'my-secret',
      };
      const withoutUsernameAndPassword: BitbucketIntegrationConfig = {
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
      const config: BitbucketIntegrationConfig = { host: '', apiBaseUrl: '' };
      expect(() => getApiUrl('a/b', config)).toThrow(/Incorrect URL: a\/b/);
    });
    it('happy path for Bitbucket Cloud', () => {
      const config: BitbucketIntegrationConfig = {
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
      const config: BitbucketIntegrationConfig = {
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
