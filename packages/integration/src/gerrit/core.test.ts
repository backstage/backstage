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
import { registerMswTestHooks } from '../helpers';
import { GerritIntegrationConfig } from './config';
import {
  buildGerritGitilesArchiveUrl,
  buildGerritGitilesArchiveUrlFromLocation,
  buildGerritGitilesUrl,
  getGerritBranchApiUrl,
  getGerritCloneRepoUrl,
  getGerritRequestOptions,
  parseGerritJsonResponse,
  parseGitilesUrlRef,
  parseGerritGitilesUrl,
  getGerritFileContentsApiUrl,
} from './core';

describe('gerrit core', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('buildGerritGitilesArchiveUrl', () => {
    const config: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com',
      gitilesBaseUrl: 'https://gerrit.com/gitiles',
    };
    const configWithPath: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com/gerrit',
      gitilesBaseUrl: 'https://gerrit.com/gerrit/plugins/gitiles',
    };
    const configWithDedicatedGitiles: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com/gerrit',
      gitilesBaseUrl: 'https://dedicated-gitiles-server.com/gerrit/gitiles',
    };
    it('can create an archive url for a branch', () => {
      expect(buildGerritGitilesArchiveUrl(config, 'repo', 'dev', '')).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/refs/heads/dev.tar.gz',
      );

      expect(buildGerritGitilesArchiveUrl(config, 'repo', 'dev', '/')).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/refs/heads/dev.tar.gz',
      );
    });
    it('can create an archive url for a specific directory', () => {
      expect(
        buildGerritGitilesArchiveUrl(config, 'repo', 'dev', 'docs'),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
    it('can create an authenticated url when auth is enabled', () => {
      const authConfig = {
        ...config,
        username: 'username',
        password: 'password',
      };
      expect(
        buildGerritGitilesArchiveUrl(authConfig, 'repo', 'dev', 'docs'),
      ).toEqual(
        'https://gerrit.com/a/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
    it('can create an authenticated url when auth is enabled and an url-path is used', () => {
      const authConfig = {
        ...configWithPath,
        username: 'username',
        password: 'password',
      };
      expect(
        buildGerritGitilesArchiveUrl(authConfig, 'repo', 'dev', 'docs'),
      ).toEqual(
        'https://gerrit.com/gerrit/a/plugins/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
    it('Cannot build an authenticated url when a dedicated Gitiles server is used', () => {
      const authConfig = {
        ...configWithDedicatedGitiles,
        username: 'username',
        password: 'password',
      };
      expect(() =>
        buildGerritGitilesArchiveUrl(authConfig, 'repo', 'dev', 'docs'),
      ).toThrow(
        'Since the baseUrl (Gerrit) is not part of the gitilesBaseUrl, an authentication URL could not be constructed.',
      );
    });
    it('Build a non-authenticated url when a dedicated Gitiles server is used', () => {
      const authConfig = {
        ...configWithDedicatedGitiles,
      };
      expect(
        buildGerritGitilesArchiveUrl(authConfig, 'repo', 'dev', 'docs'),
      ).toEqual(
        'https://dedicated-gitiles-server.com/gerrit/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
  });

  describe('buildGerritGitilesArchiveUrlFromLocation', () => {
    const config: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com',
      gitilesBaseUrl: 'https://gerrit.com/gitiles',
    };
    const configWithPath: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com/gerrit',
      gitilesBaseUrl: 'https://gerrit.com/gerrit/plugins/gitiles',
    };
    const configWithDedicatedGitiles: GerritIntegrationConfig = {
      host: 'gerrit.com',
      baseUrl: 'https://gerrit.com/gerrit',
      gitilesBaseUrl: 'https://dedicated-gitiles-server.com/gerrit/gitiles',
    };
    it('can create an archive url for a branch', () => {
      expect(
        buildGerritGitilesArchiveUrlFromLocation(
          config,
          'https://gerrit.com/gitiles/repo/+/refs/heads/dev/',
        ),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/refs/heads/dev.tar.gz',
      );
    });
    it('can create an archive url for a sha', () => {
      expect(
        buildGerritGitilesArchiveUrlFromLocation(
          config,
          'https://gerrit.com/gitiles/repo/+/2846e8dc327ae2f60249983b1c3b96f42f205bae/',
        ),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/2846e8dc327ae2f60249983b1c3b96f42f205bae.tar.gz',
      );
    });
    it('can create an archive url for a sha with a specific directory', () => {
      expect(
        buildGerritGitilesArchiveUrlFromLocation(
          config,
          'https://gerrit.com/gitiles/repo/+/2846e8dc327ae2f60249983b1c3b96f42f205bae/docs',
        ),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/2846e8dc327ae2f60249983b1c3b96f42f205bae/docs.tar.gz',
      );
    });
    it('can create an archive url for a specific directory', () => {
      expect(
        buildGerritGitilesArchiveUrlFromLocation(
          config,
          'https://gerrit.com/gitiles/repo/+/refs/heads/dev/docs/',
        ),
      ).toEqual(
        'https://gerrit.com/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
    it('can create an authenticated url when auth is enabled and an url-path is used', () => {
      const authConfig = {
        ...configWithPath,
        username: 'username',
        password: 'password',
      };
      expect(
        buildGerritGitilesArchiveUrlFromLocation(
          authConfig,
          'https://gerrit.com/gerrit/plugins/gitiles/repo/+/refs/heads/dev/docs/',
        ),
      ).toEqual(
        'https://gerrit.com/gerrit/a/plugins/gitiles/repo/+archive/refs/heads/dev/docs.tar.gz',
      );
    });
    it('Cannot build an authenticated url when a dedicated Gitiles server is used', () => {
      const authConfig = {
        ...configWithDedicatedGitiles,
        username: 'username',
        password: 'password',
      };
      expect(() =>
        buildGerritGitilesArchiveUrlFromLocation(
          authConfig,
          'https://gerrit.com/gitiles/repo/+/refs/heads/dev/',
        ),
      ).toThrow(
        'Since the baseUrl (Gerrit) is not part of the gitilesBaseUrl, an authentication URL could not be constructed.',
      );
    });
  });

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
        gitilesBaseUrl: 'https://gerrit.com/gerrit/plugins/gitiles',
      };
      const anonymousRequest: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gerrit/plugins/gitiles',
      };
      expect(
        (getGerritRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual('Basic VTpQ');
      expect(
        getGerritRequestOptions(anonymousRequest).headers as any,
      ).toBeUndefined();
    });
  });
  describe('parseGitilesUrlRef', () => {
    const config: GerritIntegrationConfig = {
      host: 'gerrit.com',
      gitilesBaseUrl: 'https://gerrit.googlesource.com',
    };
    it('can parse a gitiles urls that points to specific sha.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/cached-refdb/+/157f862803d45b9d269f0e390f88aece1ded51e8/Jenkinsfile',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/cached-refdb/+/157f862803d45b9d269f0e390f88aece1ded51e8',
        path: 'Jenkinsfile',
        project: 'modules/cached-refdb',
        ref: '157f862803d45b9d269f0e390f88aece1ded51e8',
        refType: 'sha',
      });
    });
    it('can parse gitiles urls that points to tags.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/refs/tags/v3.5.6/src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApi.java',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/refs/tags/v3.5.6',
        path: 'src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApi.java',
        project: 'modules/events-broker',
        ref: 'v3.5.6',
        refType: 'tag',
      });
    });
    it('can parse gitiles urls that points to HEAD.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/HEAD/src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApi.java',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/HEAD',
        path: 'src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApi.java',
        project: 'modules/events-broker',
        ref: 'HEAD',
        refType: 'head',
      });
    });
    it('can parse gitiles urls that points to HEAD without path.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/HEAD',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/HEAD',
        path: '/',
        project: 'modules/events-broker',
        ref: 'HEAD',
        refType: 'head',
      });
    });
    it('can parse gitiles urls that points to branches.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master/src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApiModule.java',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master',
        path: 'src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApiModule.java',
        project: 'modules/events-broker',
        ref: 'master',
        refType: 'branch',
      });
    });
    it('can parse gitiles urls that points directly to a branch without a path.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master',
        path: '/',
        project: 'modules/events-broker',
        ref: 'master',
        refType: 'branch',
      });
    });
    it('can parse gitiles urls that points to the repo root.', () => {
      const gitUrl = parseGitilesUrlRef(
        config,
        'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master/',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.googlesource.com/modules/events-broker/+/refs/heads/master',
        path: '/',
        project: 'modules/events-broker',
        ref: 'master',
        refType: 'branch',
      });
    });
    it('can parse a valid authenticated gitiles url.', () => {
      const gitilesConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      };
      const gitUrl = parseGitilesUrlRef(
        gitilesConfig,
        'https://gerrit.com/a/gitiles/web/project/+/refs/heads/master/README.md',
      );
      expect(gitUrl).toEqual({
        basePath:
          'https://gerrit.com/a/gitiles/web/project/+/refs/heads/master',
        path: 'README.md',
        project: 'web/project',
        ref: 'master',
        refType: 'branch',
      });
    });
  });
  describe('parseGerritGitilesUrl', () => {
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
    it('can parse a valid authenticated gitiles url.', () => {
      const config: GerritIntegrationConfig = {
        host: 'gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com/gitiles',
      };
      const { branch, filePath, project } = parseGerritGitilesUrl(
        config,
        'https://gerrit.com/a/gitiles/web/project/+/refs/heads/master/README.md',
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
    it('can create an authenticated url for a commit.', () => {
      const authConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
        username: 'u',
        password: 'u',
      };

      const authFileContentUrl = getGerritFileContentsApiUrl(
        authConfig,
        'https://gerrit.com/web/project/+/157f862803d45b9d269f0e390f88aece1ded51e8/README.md',
      );
      expect(authFileContentUrl).toEqual(
        'https://gerrit.com/a/projects/web%2Fproject/commits/157f862803d45b9d269f0e390f88aece1ded51e8/files/README.md/content',
      );
    });
    it('will throw for unsupported ref types (tag).', () => {
      const authConfig: GerritIntegrationConfig = {
        host: 'gerrit.com',
        baseUrl: 'https://gerrit.com',
        gitilesBaseUrl: 'https://gerrit.com',
        username: 'u',
        password: 'u',
      };

      expect(() =>
        getGerritFileContentsApiUrl(
          authConfig,
          'https://gerrit.com/modules/events-broker/+/refs/tags/v3.5.6/src/main/java/com/gerritforge/gerrit/eventbroker/BrokerApi.java',
        ),
      ).toThrow(/gitiles ref type/);
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
