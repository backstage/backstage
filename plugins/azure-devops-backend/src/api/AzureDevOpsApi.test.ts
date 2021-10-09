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
import { mappedPullRequest, mappedRepoBuild } from './AzureDevOpsApi';
import { PullRequest, RepoBuild } from './types';
import {
  Build,
  BuildResult,
  BuildStatus,
  DefinitionReference,
} from 'azure-devops-node-api/interfaces/BuildInterfaces';
import {
  GitPullRequest,
  PullRequestStatus,
} from 'azure-devops-node-api/interfaces/GitInterfaces';
import { GitRepository } from 'azure-devops-node-api/interfaces/TfvcInterfaces';
import { IdentityRef } from 'azure-devops-node-api/interfaces/common/VSSInterfaces';

describe('AzureDevOpsApi', () => {
  describe('mappedRepoBuild', () => {
    it('should return RepoBuild from Build', () => {
      const inputBuildDefinition: DefinitionReference = {
        name: 'My Build Definition',
      };

      const inputLinks: any = {
        web: {
          href: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        },
      };

      const inputBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b3100b2923982bdf60c89c57ce6fd2d9a1c',
        definition: inputBuildDefinition,
        _links: inputLinks,
      };

      const outputRepoBuild: RepoBuild = {
        id: 1,
        title: 'My Build Definition - Build-1',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        source: 'refs/heads/develop (f4f78b31)',
      };

      expect(mappedRepoBuild(inputBuild)).toEqual(outputRepoBuild);
    });
  });

  describe('mappedRepoBuild with no Build definition name', () => {
    it('should return RepoBuild with only Build Number for title', () => {
      const inputLinks: any = {
        web: {
          href: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        },
      };

      const inputBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b3100b2923982bdf60c89c57ce6fd2d9a1c',
        definition: undefined,
        _links: inputLinks,
      };

      const outputRepoBuild: RepoBuild = {
        id: 1,
        title: 'Build-1',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        status: BuildStatus.Completed,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        source: 'refs/heads/develop (f4f78b31)',
      };

      expect(mappedRepoBuild(inputBuild)).toEqual(outputRepoBuild);
    });
  });

  describe('mappedRepoBuild with undefined status', () => {
    it('should return BuildStatus of None for status', () => {
      const inputLinks: any = {
        web: {
          href: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        },
      };

      const inputBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: undefined,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b3100b2923982bdf60c89c57ce6fd2d9a1c',
        definition: undefined,
        _links: inputLinks,
      };

      const outputRepoBuild: RepoBuild = {
        id: 1,
        title: 'Build-1',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        status: BuildStatus.None,
        result: BuildResult.Succeeded,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        source: 'refs/heads/develop (f4f78b31)',
      };

      expect(mappedRepoBuild(inputBuild)).toEqual(outputRepoBuild);
    });
  });

  describe('mappedRepoBuild with undefined result', () => {
    it('should return BuildResult of None for result', () => {
      const inputLinks: any = {
        web: {
          href: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        },
      };

      const inputBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.InProgress,
        result: undefined,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b3100b2923982bdf60c89c57ce6fd2d9a1c',
        definition: undefined,
        _links: inputLinks,
      };

      const outputRepoBuild: RepoBuild = {
        id: 1,
        title: 'Build-1',
        link: 'https://host.com/myOrg/0bcc0c0d-2d02/_build/results?buildId=1',
        status: BuildStatus.InProgress,
        result: BuildResult.None,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        source: 'refs/heads/develop (f4f78b31)',
      };

      expect(mappedRepoBuild(inputBuild)).toEqual(outputRepoBuild);
    });
  });

  describe('mappedRepoBuild with undefined link', () => {
    it('should return empty string for link', () => {
      const inputBuild: Build = {
        id: 1,
        buildNumber: 'Build-1',
        status: BuildStatus.InProgress,
        result: undefined,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceBranch: 'refs/heads/develop',
        sourceVersion: 'f4f78b3100b2923982bdf60c89c57ce6fd2d9a1c',
        definition: undefined,
        _links: undefined,
      };

      const outputRepoBuild: RepoBuild = {
        id: 1,
        title: 'Build-1',
        link: '',
        status: BuildStatus.InProgress,
        result: BuildResult.None,
        queueTime: new Date('2020-09-12T06:10:23.9325232Z'),
        source: 'refs/heads/develop (f4f78b31)',
      };

      expect(mappedRepoBuild(inputBuild)).toEqual(outputRepoBuild);
    });
  });

  describe('mappedPullRequest', () => {
    it('should return PullRequest from GitPullRequest', () => {
      const inputGitRepository: GitRepository = {
        name: 'super-feature-repo',
      };

      const inputIdentityRef: IdentityRef = {
        displayName: 'Jane Doe',
      };

      const inputPullRequest: GitPullRequest = {
        pullRequestId: 7181,
        repository: inputGitRepository,
        title: 'My Awesome New Feature',
        createdBy: inputIdentityRef,
        creationDate: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceRefName: 'refs/heads/topic/super-awesome-feature',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
      };

      const inputBaseUrl =
        'https://host.com/myOrg/_git/super-feature-repo/pullrequest';

      const outputPullRequest: PullRequest = {
        pullRequestId: 7181,
        repoName: 'super-feature-repo',
        title: 'My Awesome New Feature',
        createdBy: 'Jane Doe',
        creationDate: new Date('2020-09-12T06:10:23.9325232Z'),
        sourceRefName: 'refs/heads/topic/super-awesome-feature',
        targetRefName: 'refs/heads/main',
        status: PullRequestStatus.Active,
        isDraft: false,
        link: 'https://host.com/myOrg/_git/super-feature-repo/pullrequest/7181',
      };

      expect(mappedPullRequest(inputPullRequest, inputBaseUrl)).toEqual(
        outputPullRequest,
      );
    });
  });
});
