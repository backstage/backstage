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
import { registerMswTestHooks } from '../helpers';
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
  });
});
