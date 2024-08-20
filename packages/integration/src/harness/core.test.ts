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
import { HarnessIntegrationConfig } from './config';
import {
  getHarnessArchiveUrl,
  getHarnessEditContentsUrl,
  getHarnessFileContentsUrl,
  getHarnessLatestCommitUrl,
  getHarnessRequestOptions,
  parseHarnessUrl,
} from './core';

describe('Harness code core', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

  describe('getHarnessFileContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessFileContentsUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
        ),
      ).toEqual(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projName/repoName/+/raw/all-apis.yaml?routingId=accountId&git_ref=refs/heads/refMain',
      );
    });
  });

  describe('getHarnessEditContentsUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessEditContentsUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/edit/refMain/~/all-apis.yaml',
        ),
      ).toEqual(
        'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projName/repos/repoName/files/refMain/~/all-apis.yaml',
      );
    });
  });

  describe('getHarnessArchiveUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessArchiveUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projectName/repos/repoName/files/branchName',
        ),
      ).toEqual(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projectName/repoName/+/archive/branchName.zip?routingId=accountId',
      );
    });
  });

  describe('getHarnessLatestCommitUrl', () => {
    it('can create an url from arguments', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        getHarnessLatestCommitUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projectName/repos/repoName/files/branchName',
        ),
      ).toEqual(
        'https://app.harness.io/gateway/code/api/v1/repos/accountId/orgName/projectName/repoName/+/content?routingId=accountId&include_commit=true&git_ref=refs/heads/branchName',
      );
    });
  });

  describe('getHarnessRequestOptions', () => {
    it('adds token header when only a token is specified', () => {
      const authRequest: HarnessIntegrationConfig = {
        host: 'app.harness.io',
        token: 'P',
      };
      const anonymousRequest: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        (getHarnessRequestOptions(authRequest).headers as any).Authorization,
      ).toEqual('Bearer P');
      expect(getHarnessRequestOptions(anonymousRequest).headers).toStrictEqual(
        {},
      );
    });

    it('adds basic auth when apikey and token are specified', () => {
      const authRequest: HarnessIntegrationConfig = {
        host: 'app.harness.io',
        token: 'P',
        apiKey: 'a',
      };

      expect(
        (getHarnessRequestOptions(authRequest).headers as any)['x-api-key'],
      ).toEqual('a');
    });
  });

  describe('parseHarnessUrl', () => {
    it('can fetch harness url', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        parseHarnessUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projectName/repos/repoName/files/branchName',
        ),
      ).toEqual({
        accountId: 'accountId',
        baseUrl: 'https://app.harness.io',
        orgName: 'orgName',
        path: '',
        projectName: 'projectName',
        refDashStr: '',
        refString: '',
        repoName: 'repoName',
        branch: 'branchName',
      });
    });

    it('provide path without starting slash', () => {
      const config: HarnessIntegrationConfig = {
        host: 'app.harness.io',
      };
      expect(
        parseHarnessUrl(
          config,
          'https://app.harness.io/ng/account/accountId/module/code/orgs/orgName/projects/projectName/repos/repoName/files/branchName/simple/~/path',
        ),
      ).toEqual({
        accountId: 'accountId',
        baseUrl: 'https://app.harness.io',
        orgName: 'orgName',
        path: 'path',
        projectName: 'projectName',
        refDashStr: 'branchName-simple',
        refString: 'branchName/simple',
        repoName: 'repoName',
        branch: 'branchName/simple',
      });
    });
  });
});
