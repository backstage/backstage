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

import { setupServer } from 'msw/node';
import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { GiteaIntegrationConfig } from './config';
import {
  getGiteaArchiveUrl,
  getGiteaEditContentsUrl,
  getGiteaFileContentsUrl,
  getGiteaLatestCommitUrl,
  getGiteaRequestOptions,
  parseGiteaUrl,
} from './core';

describe('gitea core', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('getGiteaFileCatalogInfoCntentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.com',
      };
      expect(
        getGiteaFileContentsUrl(
          config,
          'https://gitea.com/org1/repo1/src/branch/main/catalog-info.yaml',
        ),
      ).toEqual(
        'https://gitea.com/api/v1/repos/org1/repo1/contents/catalog-info.yaml?ref=main',
      );
    });
  });

  describe('getGiteaFileContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.com',
      };
      expect(
        getGiteaFileContentsUrl(
          config,
          'https://gitea.com/a/b/src/branch/branch_name/path/to/c.yaml',
        ),
      ).toEqual(
        'https://gitea.com/api/v1/repos/a/b/contents/path/to/c.yaml?ref=branch_name',
      );
    });
  });

  describe('getGiteaEditContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        getGiteaEditContentsUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/branch_name/path/to/c.yaml',
        ),
      ).toEqual(
        'https://gitea.example.com/owner/repo/_edit/branch_name/path/to/c.yaml',
      );
    });
  });

  describe('getGiteaArchiveUrl', () => {
    it('can create an url from arguments', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        getGiteaArchiveUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/branch_name',
        ),
      ).toEqual(
        'https://gitea.example.com/api/v1/repos/owner/repo/archive/branch_name.tar.gz',
      );
    });
  });

  describe('getGiteaLatestCommitUrl', () => {
    it('can create an url from arguments', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        getGiteaLatestCommitUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/branch_name/',
        ),
      ).toEqual(
        'https://gitea.example.com/api/v1/repos/owner/repo/git/commits/branch_name',
      );
    });
  });

  describe('getGiteaRequestOptions', () => {
    it('adds basic auth when username and password are specified', () => {
      const authRequest: GiteaIntegrationConfig = {
        host: 'gitea.com',
        username: 'username',
        password: 'P',
      };

      const basicAuthentication = `basic ${Buffer.from(
        `${authRequest.username}:${authRequest.password}`,
      ).toString('base64')}`;

      expect(
        (getGiteaRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual(basicAuthentication);
    });
  });

  describe('parseGiteaUrl', () => {
    it('can fetch gitea url', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        parseGiteaUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/branch_name/',
        ),
      ).toEqual({
        url: 'https://gitea.example.com',
        owner: 'owner',
        name: 'repo',
        ref: 'branch_name',
        path: '',
      });
    });

    it('provide path without starting slash', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        parseGiteaUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/branch_name/simple/path',
        ),
      ).toEqual({
        url: 'https://gitea.example.com',
        owner: 'owner',
        name: 'repo',
        ref: 'branch_name',
        path: 'simple/path',
      });
    });

    it('use base url if provided', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
        baseUrl: 'https://base-gitea.example.com',
      };
      expect(
        parseGiteaUrl(
          config,
          'https://base-gitea.example.com/owner/repo/src/branch/branch_name/',
        ),
      ).toEqual({
        url: 'https://base-gitea.example.com',
        owner: 'owner',
        name: 'repo',
        ref: 'branch_name',
        path: '',
      });
    });

    it('keeps encoded refs and dotted path segments intact', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(
        parseGiteaUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/release%2Fv1/some.dir/catalog-info.yaml',
        ),
      ).toEqual({
        url: 'https://gitea.example.com',
        owner: 'owner',
        name: 'repo',
        ref: 'release%2Fv1',
        path: 'some.dir/catalog-info.yaml',
      });
      expect(
        parseGiteaUrl(
          config,
          'https://gitea.example.com/owner/repo/src/branch/main/docs/50%off/catalog-info.yaml',
        ),
      ).toEqual({
        url: 'https://gitea.example.com',
        owner: 'owner',
        name: 'repo',
        ref: 'main',
        path: 'docs/50%off/catalog-info.yaml',
      });
    });

    it('rejects path traversal in any URL component', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };

      const traversalUrls = [
        // traversal in the owner component
        'https://gitea.example.com/../victim/repo/src/branch/main/catalog-info.yaml',
        'https://gitea.example.com/%2e%2e/victim/repo/src/branch/main/catalog-info.yaml',
        // traversal in the repo name component
        'https://gitea.example.com/owner/../victim/src/branch/main/catalog-info.yaml',
        'https://gitea.example.com/owner/%2e%2e/victim/src/branch/main/catalog-info.yaml',
        // traversal in the ref component
        'https://gitea.example.com/owner/repo/src/branch/../../victim/catalog-info.yaml',
        'https://gitea.example.com/owner/repo/src/branch/%2e%2e/%2e%2e/victim/catalog-info.yaml',
        // traversal in the file path component
        'https://gitea.example.com/owner/repo/src/branch/main/../../../../victim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/%2e%2e/%2e%2e/%2e%2e/%2e%2e/victim/v2/secret.yaml',
        // encoded separators and multi-level encodings
        'https://gitea.example.com/owner/repo/src/branch/main/%2e%2e%2f%2e%2e%2f%2e%2e%2f%2e%2e%2fvictim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/%252e%252e%252f%252e%252e%252fvictim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/%2E%2E/%2E%2E/victim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/.%2e/.%2e/victim/v2/secret.yaml',
        // a malformed escape in one segment must not disable the check for
        // traversal in the other segments
        'https://gitea.example.com/owner/repo/src/branch/main/%2e%2e/%2e%2e/%2e%2e/%2e%2e/victim/v2/secret.yaml#%ZZ',
        // backslashes as separators
        'https://gitea.example.com/owner/repo/src/branch/main/..\\..\\victim/v2/secret.yaml',
        // tab, line feed and carriage return inside dot segments
        'https://gitea.example.com/owner/repo/src/branch/main/.\t./.\t./.\t./.\t./victim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/.\n./.\n./victim/v2/secret.yaml',
        'https://gitea.example.com/owner/repo/src/branch/main/.\r./victim/v2/secret.yaml',
      ];

      for (const url of traversalUrls) {
        expect(() => parseGiteaUrl(config, url)).toThrow(/path traversal/);
      }
    });

    it('rejects URL query and fragment delimiters in the owner and repository name', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };

      const delimiterUrls = [
        // a raw ? or # in the owner ends the path of the request
        'https://gitea.example.com/owner?marker=1/repo/src/branch/main/catalog-info.yaml',
        'https://gitea.example.com/owner#frag/repo/src/branch/main/catalog-info.yaml',
        // traversal payloads with a delimiter are caught by the same rule
        'https://gitea.example.com/..?/victim/repo/src/branch/main/catalog-info.yaml',
        'https://gitea.example.com/%2e%2e#/victim/repo/src/branch/main/catalog-info.yaml',
        // encoded delimiters, revealed by decoding
        'https://gitea.example.com/owner%3Fmarker/repo/src/branch/main/catalog-info.yaml',
        'https://gitea.example.com/owner/repo%23frag/src/branch/main/catalog-info.yaml',
        // a delimiter that is only revealed after a second decoding pass
        'https://gitea.example.com/own%253Fer/repo/src/branch/main/catalog-info.yaml',
      ];

      for (const url of delimiterUrls) {
        expect(() => parseGiteaUrl(config, url)).toThrow(
          /fragment and query delimiters/,
        );
      }
    });

    it('rejects URLs for hosts other than the integration host', () => {
      const config: GiteaIntegrationConfig = {
        host: 'gitea.example.com',
      };
      expect(() =>
        parseGiteaUrl(
          config,
          'https://gitea.example.com.evil.com/owner/repo/src/branch/main/catalog-info.yaml',
        ),
      ).toThrow(/expected URL host to be gitea\.example\.com/);
    });
  });

  describe('traversal rejection', () => {
    const config: GiteaIntegrationConfig = {
      host: 'gitea.example.com',
    };

    it('rejects traversal payloads in all URL builders', () => {
      const fileUrl =
        'https://gitea.example.com/owner/repo/src/branch/main/%2e%2e/%2e%2e/%2e%2e/%2e%2e/victim/v2/secret.yaml';
      expect(() => getGiteaFileContentsUrl(config, fileUrl)).toThrow(
        /path traversal/,
      );
      expect(() => getGiteaEditContentsUrl(config, fileUrl)).toThrow(
        /path traversal/,
      );

      const branchUrl =
        'https://gitea.example.com/owner/repo/src/branch/%2e%2e/%2e%2e/victim';
      expect(() => getGiteaArchiveUrl(config, branchUrl)).toThrow(
        /path traversal/,
      );
      expect(() => getGiteaLatestCommitUrl(config, branchUrl)).toThrow(
        /path traversal/,
      );
    });
  });
});
