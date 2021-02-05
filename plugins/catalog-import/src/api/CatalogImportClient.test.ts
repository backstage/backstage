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

import { CatalogImportClient } from './CatalogImportClient';

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => {
    return {
      repos: {
        get: () =>
          Promise.resolve({
            data: {
              default_branch: 'main',
            },
          }),
      },
      search: {
        code: () =>
          Promise.resolve({
            data: {
              total_count: 2,
              items: [
                { path: 'simple/path/catalog-info.yaml' },
                { path: 'co/mple/x/path/catalog-info.yaml' },
                { path: 'catalog-info.yaml' },
              ],
            },
          }),
      },
    };
  }),
}));

describe('CatalogImportClient', () => {
  describe('checkForExistingCatalogInfo', () => {
    const cic = new CatalogImportClient({
      discoveryApi: { getBaseUrl: () => Promise.resolve('base') },
      githubAuthApi: { getAccessToken: (_, __) => Promise.resolve('token') },
      configApi: {} as any,
    });
    it('should return the closest-to-root catalog-info from multiple responses', async () => {
      const respo = await cic.checkForExistingCatalogInfo({
        owner: 'test-user',
        repo: 'rest-repo',
        githubIntegrationConfig: { host: 'https://github.com' },
      });
      expect(respo.exists).toBe(true);
      expect(respo.url).toBe('blob/main/catalog-info.yaml');
    });
  });
});
