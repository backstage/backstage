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

import { rest } from 'msw';
import { setupServer } from 'msw/node';
import fetch from 'cross-fetch';
import { setupRequestMockHandlers } from '@backstage/test-utils';
import { GerritIntegrationConfig } from './config';
import {
  buildGerritGitilesUrl,
  getGerritBranchApiUrl,
  getGerritCloneRepoUrl,
  getGerritRequestOptions,
  parseGerritJsonResponse,
  parseGerritGitilesUrl,
  getGerritFileContentsApiUrl,
} from './core';

describe('gerrit core', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  describe('buildGerritGitilesUrl', () => {
    it('can create an url from arguments', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      };
      expect(
        buildGerritGitilesUrl(config, 'repo', 'dev', 'catalog-info.yaml'),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+/refs/heads/dev/catalog-info.yaml',
      );
    });
  });

  describe('getGerritRequestOptions', () => {
    it('adds headers when a password is specified', () => {
      const authRequest: GerritIntegrationConfig = {
        host: 'gerrit.com',
        username: 'U',
        password: 'P',
      };
      const anonymousRequest: GerritIntegrationConfig = {
        host: 'gerrit.com',
      };
      expect(
        (getGerritRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual('Basic VTpQ');
      expect(
        getGerritRequestOptions(anonymousRequest).headers as any,
      ).toBeUndefined();
    });
  });

  describe('parseGitilesUrl', () => {
    it('can parse a valid gitiles urls.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      };
      const { branch, filePath, project } = parseGerritGitilesUrl(
        config,
        'https://gerrit.com/gitiles/web/project/+/refs/heads/master/README.md',
      );
      expect(project).toEqual('web/project');
      expect(branch).toEqual('master');
      expect(filePath).toEqual('README.md');

      const { filePath: rootPath } = parseGerritGitilesUrl(
        config,
        'https://gerrit.com/gitiles/web/project/+/refs/heads/master',
      );
      expect(rootPath).toEqual('/');
    });
    it('throws on incorrect gitiles urls.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
      };
      expect(() =>
        parseGerritGitilesUrl(
          config,
          'https://gerrit.com/+/refs/heads/master/README.md',
        ),
      ).toThrow(/project/);
      expect(() =>
        parseGerritGitilesUrl(
          config,
          'https://gerrit.com/web/project/+/refs/changes/1/11/master/README.md',
        ),
      ).toThrow(/branch/);
    });
  });

  describe('getGerritBranchApiUrl', () => {
    it('can create an url for anonymous access.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
      };
      const fileContentUrl = getGerritBranchApiUrl(
        config,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(fileContentUrl).toEqual(
        'https://gerrit.com/projects/web%2Fproject/branches/master',
      );
    });
    it('can create an url for authenticated access.', () => {
      const authConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
        username: 'u',
        password: 'u',
      };
      const authFileContentUrl = getGerritBranchApiUrl(
        authConfig,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(authFileContentUrl).toEqual(
        'https://gerrit.com/a/projects/web%2Fproject/branches/master',
      );
    });
  });

  describe('getGerritCloneRepoUrl', () => {
    it('can create an url for anonymous clone.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        cloneUrl: 'https://gerrit.com/clone',
        gitilesBaseUrl: 'https://gerrit.com',
      };
      const fileContentUrl = getGerritCloneRepoUrl(
        config,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(fileContentUrl).toEqual('https://gerrit.com/clone/web/project');
    });
    it('can create an url for authenticated clone.', () => {
      const authConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        cloneUrl: 'https://gerrit.com/clone',
        gitilesBaseUrl: 'https://gerrit.com',
        username: 'u',
        password: 'u',
      };
      const authFileContentUrl = getGerritCloneRepoUrl(
        authConfig,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(authFileContentUrl).toEqual(
        'https://gerrit.com/clone/a/web/project',
      );
    });
  });

  describe('getGerritFileContentsApiUrl', () => {
    it('can create an url for anonymous access to the file fetch api.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
      };
      const fileContentUrl = getGerritFileContentsApiUrl(
        config,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(fileContentUrl).toEqual(
        'https://gerrit.com/projects/web%2Fproject/branches/master/files/README.md/content',
      );
    });
    it('can create an url for authenticated access to the file fetch api.', () => {
      const authConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
        username: 'u',
        password: 'u',
      };
      const authFileContentUrl = getGerritFileContentsApiUrl(
        authConfig,
        'https://gerrit.com/web/project/+/refs/heads/master/README.md',
      );
      expect(authFileContentUrl).toEqual(
        'https://gerrit.com/a/projects/web%2Fproject/branches/master/files/README.md/content',
      );
    });
  });

  describe('parseGerritJsonResponse', () => {
    it('can strip the magic prefix from the response.', async () => {
      const responseBody = ")]}'[]";
      const apiUrl = 'https://gerrit.com/projects/';
      worker.use(
        rest.get(apiUrl, (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.text(responseBody),
          ),
        ),
      );
      const response = await fetch(apiUrl, { method: 'GET' });
      const jsonData = await parseGerritJsonResponse(response);
      expect(jsonData).toEqual([]);
    });
    it('will throw if the magic prefix is missing from the response.', async () => {
      const responseBody = '[]';
      const apiUrl = 'https://gerrit.com/projects/';
      worker.use(
        rest.get(apiUrl, (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.text(responseBody),
          ),
        ),
      );
      const response = await fetch(apiUrl, { method: 'GET' });
      await expect(parseGerritJsonResponse(response)).rejects.toThrow(
        /body prefix missing/,
      );
    });
    it('will throw on invalid json with the magic prefix.', async () => {
      const responseBody = ")]}']{}[";
      const apiUrl = 'https://gerrit.com/projects/';
      worker.use(
        rest.get(apiUrl, (_, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.text(responseBody),
          ),
        ),
      );
      const response = await fetch(apiUrl, { method: 'GET' });
      await expect(parseGerritJsonResponse(response)).rejects.toThrow(
        /response from/,
      );
    });
  });
});
