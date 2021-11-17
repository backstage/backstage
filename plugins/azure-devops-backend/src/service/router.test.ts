/*
 * Copyright 2021 The Backstage Authors
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

import {
  BuildResult,
  BuildStatus,
  PullRequest,
  PullRequestStatus,
  RepoBuild,
} from '@backstage/plugin-azure-devops-common';

import { AzureDevOpsApi } from '../api';
import { Build } from 'azure-devops-node-api/interfaces/BuildInterfaces';
import { ConfigReader } from '@backstage/config';
import { GitRepository } from 'azure-devops-node-api/interfaces/GitInterfaces';
import { createRouter } from './router';
import express from 'express';
import { getVoidLogger } from '@backstage/backend-common';
import request from 'supertest';

describe('createRouter', () => {
  let azureDevOpsApi: jest.Mocked<AzureDevOpsApi>;
  let app: express.Express;

  beforeAll(async () => {
    azureDevOpsApi = {
      getGitRepository: jest.fn(),
      getBuildList: jest.fn(),
      getRepoBuilds: jest.fn(),
      getPullRequests: jest.fn(),
    } as any;
    const router = await createRouter({
      azureDevOpsApi,
      logger: getVoidLogger(),
      config: new ConfigReader({
        azureDevOps: {
          token: 'foo',
          host: 'host.com',
          organization: 'myOrg',
          top: 5,
        },
      }),
    });
    app = express().use(router);
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('returns ok', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /repository/:projectName/:repoName', () => {
    it('fetches a single repository', async () => {
      const gitRepository: GitRepository = {
        id: 'af4ae3af-e747-4129-9bbc-d1329f6b0998',
        name: 'myRepo',
        url: 'https://host.com/repo',
        defaultBranch: 'refs/heads/develop',
        sshUrl: 'ssh://host.com/repo',
        webUrl: 'https://host.com/webRepo',
      };

      azureDevOpsApi.getGitRepository.mockResolvedValueOnce(gitRepository);

      const response = await request(app).get('/repository/myProject/myRepo');

      expect(azureDevOpsApi.getGitRepository).toHaveBeenCalledWith(
        'myProject',
        'myRepo',
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(gitRepository);
    });
  });

  describe('GET /builds/:projectName/:repoId', () => {
    it('fetches a list of builds', async () => {
      const firstBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: undefined,
        sourceBranch: 'refs/heads/develop',
        sourceVersion: '9bedf67800b2923982bdf60c89c57ce6fd2d9a1c',
      };

      const secondBuild: Build = {
        id: 2,
        buildNumber: 'Build-2',
        status: BuildStatus.InProgress,
        result: BuildResult.None,
        queueTime: undefined,
        sourceBranch: 'refs/heads/develop',
        sourceVersion: '13c988d4f15e06bcdd0b0af290086a3079cdadb0',
      };

      const thirdBuild: Build = {
        id: 3,
        buildNumber: 'Build-3',
        status: BuildStatus.Completed,
        result: BuildResult.PartiallySucceeded,
        queueTime: undefined,
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b319c308600eab015a5d6529add21660dc1',
      };

      const builds: Build[] = [firstBuild, secondBuild, thirdBuild];

      azureDevOpsApi.getBuildList.mockResolvedValueOnce(builds);

      const response = await request(app)
        .get('/builds/myProject/af4ae3af-e747-4129-9bbc-d1329f6b0998')
        .query({ top: '40' });

      expect(azureDevOpsApi.getBuildList).toHaveBeenCalledWith(
        'myProject',
        'af4ae3af-e747-4129-9bbc-d1329f6b0998',
        40,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(builds);
    });
  });

  describe('GET /repo-builds/:projectName/:repoName', () => {
    it('fetches a list of repo builds', async () => {
      const firstRepoBuild: RepoBuild = {
        id: 1,
        title: 'My Build Definition - Build 1',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        status: BuildStatus.Completed,
        result: BuildResult.PartiallySucceeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        source: 'refs/heads/develop (f4f78b31)',
      };

      const secondRepoBuild: RepoBuild = {
        id: 2,
        title: 'My Build Definition - Build 2',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=2',
        status: BuildStatus.InProgress,
        result: BuildResult.None,
        queueTime: '2020-09-12T06:10:23.932Z',
        source: 'refs/heads/develop (13c988d4)',
      };

      const thirdRepoBuild: RepoBuild = {
        id: 3,
        title: 'My Build Definition - Build 3',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=3',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: '2020-09-12T06:10:23.932Z',
        source: 'refs/heads/develop (9bedf678)',
      };

      const repoBuilds: RepoBuild[] = [
        firstRepoBuild,
        secondRepoBuild,
        thirdRepoBuild,
      ];

      azureDevOpsApi.getRepoBuilds.mockResolvedValueOnce(repoBuilds);

      const response = await request(app)
        .get('/repo-builds/myProject/myRepo')
        .query({ top: '50' });

      expect(azureDevOpsApi.getRepoBuilds).toHaveBeenCalledWith(
        'myProject',
        'myRepo',
        50,
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(repoBuilds);
    });
  });

  describe('GET /pull-requests/:projectName/:repoName', () => {
    it('fetches a list of pull requests', async () => {
      const firstPullRequest: PullRequest = {
        pullRequestId: 7181,
        repoName: 'super-feature-repo',
        title: 'My Awesome New Feature',
        createdBy: 'Jane Doe',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/super-awesome-feature',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'https://host.com/myOrg/_git/super-feature-repo/pullrequest/7181',
      };

      const secondPullRequest: PullRequest = {
        pullRequestId: 7182,
        repoName: 'super-feature-repo',
        title: 'Refactoring My Awesome New Feature',
        createdBy: 'Jane Doe',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/refactor-super-awesome-feature',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'https://host.com/myOrg/_git/super-feature-repo/pullrequest/7182',
      };

      const thirdPullRequest: PullRequest = {
        pullRequestId: 7183,
        repoName: 'super-feature-repo',
        title: 'Bug Fix for My Awesome New Feature',
        createdBy: 'Jane Doe',
        creationDate: '2020-09-12T06:10:23.932Z',
        sourceRefName: 'refs/heads/topic/fix-super-awesome-feature',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'https://host.com/myOrg/_git/super-feature-repo/pullrequest/7183',
      };

      const pullRequests: PullRequest[] = [
        firstPullRequest,
        secondPullRequest,
        thirdPullRequest,
      ];

      azureDevOpsApi.getPullRequests.mockResolvedValueOnce(pullRequests);

      const response = await request(app)
        .get('/pull-requests/myProject/myRepo')
        .query({ top: '50', status: 1 });

      expect(azureDevOpsApi.getPullRequests).toHaveBeenCalledWith(
        'myProject',
        'myRepo',
        { status: 1, top: 50 },
      );
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(pullRequests);
    });
  });
});
