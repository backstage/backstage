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
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { GiteaIntegrationConfig } from './config';
import {
  getGiteaEditContentsUrl,
  getGiteaFileContentsUrl,
  getGiteaRequestOptions,
} from './core';

describe('gitea core', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

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

  describe('getGerritRequestOptions', () => {
    it('adds token header when only a password is specified', () => {
      const authRequest: GiteaIntegrationConfig = {
        host: 'gerrit.com',
        password: 'P',
      };
      const anonymousRequest: GiteaIntegrationConfig = {
        host: 'gerrit.com',
      };
      expect(
        (getGiteaRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual('token P');
      expect(getGiteaRequestOptions(anonymousRequest).headers).toBeUndefined();
    });

    it('adds basic auth when username and password are specified', () => {
      const authRequest: GiteaIntegrationConfig = {
        host: 'gerrit.com',
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
});
