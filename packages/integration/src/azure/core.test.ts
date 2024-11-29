/*
 * Copyright 2020 The Backstage Authors
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

import { getAzureFileFetchUrl, getAzureDownloadUrl } from './core';
import {
  AccessToken,
  ClientSecretCredential,
  ManagedIdentityCredential,
} from '@azure/identity';

const MockedClientSecretCredential = ClientSecretCredential as jest.MockedClass<
  typeof ClientSecretCredential
>;

const MockedManagedIdentityCredential =
  ManagedIdentityCredential as jest.MockedClass<
    typeof ManagedIdentityCredential
  >;

jest.mock('@azure/identity');

MockedClientSecretCredential.prototype.getToken.mockImplementation(() =>
  Promise.resolve({ token: 'fake-client-secret-token' } as AccessToken),
);
MockedManagedIdentityCredential.prototype.getToken.mockImplementation(() =>
  Promise.resolve({ token: 'fake-managed-identity-token' } as AccessToken),
);

describe('azure core', () => {
  describe('getAzureFileFetchUrl', () => {
    it.each([
      {
        url: 'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        result:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml&version=master',
      },
      {
        url: 'https://dev.azure.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
        result:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml',
      },
      {
        url: 'https://api.com/org-name/project-name/_git/repo-name?path=my-template.yaml',
        result:
          'https://api.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml',
      },
      {
        url: 'https://api.com/org-name/project-name/_git/repo-name?path=my-template.yaml&version=GBmaster',
        result:
          'https://api.com/org-name/project-name/_apis/git/repositories/repo-name/items?api-version=6.0&path=my-template.yaml&version=master',
      },
    ])('should handle happy path %#', async ({ url, result }) => {
      expect(getAzureFileFetchUrl(url)).toBe(result);
    });

    it.each([
      {
        url: 'https://api.com/a/b/blob/master/path/to/c.yaml',
        error: 'Azure URL must point to a git repository',
      },
      {
        url: 'com/a/b/blob/master/path/to/c.yaml',
        error: 'Invalid URL: com/a/b/blob/master/path/to/c.yaml',
      },
    ])('should handle error path %#', ({ url, error }) => {
      expect(() => getAzureFileFetchUrl(url)).toThrow(error);
    });
  });

  describe('getAzureDownloadUrl', () => {
    it('do not add scopePath if no path is specified', async () => {
      const result = getAzureDownloadUrl(
        'https://dev.azure.com/organization/project/_git/repository',
      );

      expect(new URL(result).searchParams.get('scopePath')).toBeNull();
    });

    it('add scopePath if a path is specified', async () => {
      const result = getAzureDownloadUrl(
        'https://dev.azure.com/organization/project/_git/repository?path=%2Fdocs',
      );
      expect(new URL(result).searchParams.get('scopePath')).toEqual('/docs');
    });

    it.each([
      {
        url: 'https://dev.azure.com/org-name/project-name/_git/repo-name',
        result:
          'https://dev.azure.com/org-name/project-name/_apis/git/repositories/repo-name/items?recursionLevel=full&download=true&api-version=6.0',
      },
      {
        url: 'https://api.com/org-name/project-name/_git/repo-name',
        result:
          'https://api.com/org-name/project-name/_apis/git/repositories/repo-name/items?recursionLevel=full&download=true&api-version=6.0',
      },
    ])('should handle happy path %#', async ({ url, result }) => {
      expect(getAzureDownloadUrl(url)).toBe(result);
    });
  });
});
