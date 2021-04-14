/*
 * Copyright 2021 Spotify AB
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

import { ConfigApi, OAuthApi } from '@backstage/core';
import { Octokit } from '@octokit/rest';
import { readGitHubIntegrationConfigs } from '@backstage/integration';

import {
  GhCompareCommitsResponse,
  GhCreateCommitResponse,
  GhCreateReferenceResponse,
  GhCreateReleaseResponse,
  GhCreateTagObjectResponse,
  GhGetBranchResponse,
  GhGetCommitResponse,
  GhGetReleaseResponse,
  GhGetRepositoryResponse,
  GhMergeResponse,
  GhUpdateReferenceResponse,
  GhUpdateReleaseResponse,
} from '../types/types';
import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { getRcGitHubInfo } from '../cards/createRc/getRcGitHubInfo';
import { SemverTagParts } from '../helpers/tagParts/getSemverTagParts';
import { GitHubReleaseManagerError } from '../errors/GitHubReleaseManagerError';

export class PluginApiClient {
  private readonly githubAuthApi: OAuthApi;
  private readonly baseUrl: string;
  private repoPath?: string;
  readonly host: string;

  constructor({
    configApi,
    githubAuthApi,
  }: {
    configApi: ConfigApi;
    githubAuthApi: OAuthApi;
  }) {
    this.githubAuthApi = githubAuthApi;

    const githubIntegrationConfig = this.getGithubIntegrationConfig({
      configApi,
    });

    this.host = githubIntegrationConfig?.host ?? 'github.com';
    this.baseUrl =
      githubIntegrationConfig?.apiBaseUrl ?? 'https://api.github.com';
  }

  private getGithubIntegrationConfig({ configApi }: { configApi: ConfigApi }) {
    const configs = readGitHubIntegrationConfigs(
      configApi.getOptionalConfigArray('integrations.github') ?? [],
    );

    const githubIntegrationConfig = configs.find(
      v => v.host === 'github.com' || v.host.startsWith('ghe.'),
    );

    return githubIntegrationConfig;
  }

  private async getOctokit() {
    const token = await this.githubAuthApi.getAccessToken(['repo']);

    return {
      octokit: new Octokit({
        auth: token,
        baseUrl: this.baseUrl,
      }),
    };
  }

  public getHost() {
    return this.host;
  }

  public setRepoPath({ repoPath }: { repoPath: string }) {
    this.repoPath = repoPath;
  }

  public getRepoPath() {
    if (!this.repoPath) {
      throw new GitHubReleaseManagerError('Could not find repoPath');
    }

    return this.repoPath;
  }

  async getRecentCommits({
    releaseBranchName,
  }: { releaseBranchName?: string } = {}) {
    const { octokit } = await this.getOctokit();
    const sha = releaseBranchName ? `?sha=${releaseBranchName}` : '';

    const recentCommits: GhGetCommitResponse[] = (
      await octokit.request(`/repos/${this.getRepoPath()}/commits${sha}`)
    ).data;

    return { recentCommits };
  }

  async getReleases() {
    const { octokit } = await this.getOctokit();

    const releases: GhGetReleaseResponse[] = (
      await octokit.request(`/repos/${this.getRepoPath()}/releases`)
    ).data;

    return { releases };
  }

  async getRelease({ releaseId }: { releaseId: number }) {
    const { octokit } = await this.getOctokit();

    const latestRelease: GhGetReleaseResponse = (
      await octokit.request(
        `/repos/${this.getRepoPath()}/releases/${releaseId}`,
      )
    ).data;

    return { latestRelease };
  }

  async getRepository() {
    const { octokit } = await this.getOctokit();

    const repository: GhGetRepositoryResponse = (
      await octokit.request(`/repos/${this.getRepoPath()}`)
    ).data;

    return { repository };
  }

  async getLatestCommit({ defaultBranch }: { defaultBranch: string }) {
    const { octokit } = await this.getOctokit();

    const latestCommit: GhGetCommitResponse = (
      await octokit.request(
        `/repos/${this.getRepoPath()}/commits/refs/heads/${defaultBranch}`,
      )
    ).data;

    return { latestCommit };
  }

  async getBranch({ branchName }: { branchName: string }) {
    const { octokit } = await this.getOctokit();

    const branch: GhGetBranchResponse = (
      await octokit.request(
        `/repos/${this.getRepoPath()}/branches/${branchName}`,
      )
    ).data;

    return { branch };
  }

  createRc = {
    createRef: async ({
      mostRecentSha,
      targetBranch,
    }: {
      mostRecentSha: string;
      targetBranch: string;
    }) => {
      const { octokit } = await this.getOctokit();

      const createdRef: GhCreateReferenceResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/git/refs`, {
          method: 'POST',
          data: {
            ref: `refs/heads/${targetBranch}`,
            sha: mostRecentSha,
          },
        })
      ).data;

      return { createdRef };
    },

    getComparison: async ({
      previousReleaseBranch,
      nextReleaseBranch,
    }: {
      previousReleaseBranch: string;
      nextReleaseBranch: string;
    }) => {
      const { octokit } = await this.getOctokit();

      const comparison: GhCompareCommitsResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath()}/compare/${previousReleaseBranch}...${nextReleaseBranch}`,
        )
      ).data;

      return { comparison };
    },

    createRelease: async ({
      nextGitHubInfo,
      releaseBody,
    }: {
      nextGitHubInfo: ReturnType<typeof getRcGitHubInfo>;
      releaseBody: string;
    }) => {
      const { octokit } = await this.getOctokit();

      const createReleaseResponse: GhCreateReleaseResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/releases`, {
          method: 'POST',
          data: {
            tag_name: nextGitHubInfo.rcReleaseTag,
            name: nextGitHubInfo.releaseName,
            target_commitish: nextGitHubInfo.rcBranch,
            body: releaseBody,
            prerelease: true,
          },
        })
      ).data;

      return { createReleaseResponse };
    },
  };

  patch = {
    createTempCommit: async ({
      tagParts,
      releaseBranchTree,
      selectedPatchCommit,
    }: {
      tagParts: SemverTagParts | CalverTagParts;
      releaseBranchTree: string;
      selectedPatchCommit: GhGetCommitResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      const tempCommit: GhCreateCommitResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/git/commits`, {
          method: 'POST',
          data: {
            message: `Temporary commit for patch ${tagParts.patch}`,
            tree: releaseBranchTree,
            parents: [selectedPatchCommit.parents[0].sha],
          },
        })
      ).data;

      return { tempCommit };
    },

    forceBranchHeadToTempCommit: async ({
      releaseBranchName,
      tempCommit,
    }: {
      releaseBranchName: string;
      tempCommit: GhCreateCommitResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      await octokit.request(
        `/repos/${this.getRepoPath()}/git/refs/heads/${releaseBranchName}`,
        {
          method: 'PATCH',
          data: {
            sha: tempCommit.sha,
            force: true,
          },
        },
      );
    },

    merge: async ({ base, head }: { base: string; head: string }) => {
      const { octokit } = await this.getOctokit();

      const merge: GhMergeResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/merges`, {
          method: 'POST',
          data: { base, head },
        })
      ).data;

      return { merge };
    },

    createCherryPickCommit: async ({
      bumpedTag,
      selectedPatchCommit,
      mergeTree,
      releaseBranchSha,
    }: {
      bumpedTag: string;
      selectedPatchCommit: GhGetCommitResponse;
      mergeTree: string;
      releaseBranchSha: string;
    }) => {
      const { octokit } = await this.getOctokit();

      const cherryPickCommit: GhCreateCommitResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/git/commits`, {
          method: 'POST',
          data: {
            message: `[patch ${bumpedTag}] ${selectedPatchCommit.commit.message}`,
            tree: mergeTree,
            parents: [releaseBranchSha],
          },
        })
      ).data;

      return { cherryPickCommit };
    },

    replaceTempCommit: async ({
      releaseBranchName,
      cherryPickCommit,
    }: {
      releaseBranchName: string;
      cherryPickCommit: GhCreateCommitResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      const updatedReference: GhUpdateReferenceResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath()}/git/refs/heads/${releaseBranchName}`,
          {
            method: 'PATCH',
            data: {
              sha: cherryPickCommit.sha,
              force: true,
            },
          },
        )
      ).data;

      return { updatedReference };
    },

    createTagObject: async ({
      bumpedTag,
      updatedReference,
    }: {
      bumpedTag: string;
      updatedReference: GhUpdateReferenceResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      const tagObjectResponse: GhCreateTagObjectResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/git/tags`, {
          method: 'POST',
          data: {
            type: 'commit',
            message:
              'Tag generated by your friendly neighborhood GitHub Release Manager',
            tag: bumpedTag,
            object: updatedReference.object.sha,
          },
        })
      ).data;

      return { tagObjectResponse };
    },

    createReference: async ({
      bumpedTag,
      tagObjectResponse,
    }: {
      bumpedTag: string;
      tagObjectResponse: GhCreateTagObjectResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      const reference: GhCreateReferenceResponse = (
        await octokit.request(`/repos/${this.getRepoPath()}/git/refs`, {
          method: 'POST',
          data: {
            ref: `refs/tags/${bumpedTag}`,
            sha: tagObjectResponse.sha,
          },
        })
      ).data;

      return { reference };
    },

    updateRelease: async ({
      bumpedTag,
      latestRelease,
      tagParts,
      selectedPatchCommit,
    }: {
      bumpedTag: string;
      latestRelease: GhGetReleaseResponse;
      tagParts: SemverTagParts | CalverTagParts;
      selectedPatchCommit: GhGetCommitResponse;
    }) => {
      const { octokit } = await this.getOctokit();

      const release: GhUpdateReleaseResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath()}/releases/${latestRelease.id}`,
          {
            method: 'PATCH',
            data: {
              tag_name: bumpedTag,
              body: `${latestRelease.body}
  
  #### [Patch ${tagParts.patch}](${selectedPatchCommit.html_url})
  
  ${selectedPatchCommit.commit.message}`,
            },
          },
        )
      ).data;

      return { release };
    },
  };

  promoteRc = {
    promoteRelease: async ({
      releaseId,
      releaseVersion,
    }: {
      releaseId: GhGetReleaseResponse['id'];
      releaseVersion: string;
    }) => {
      const { octokit } = await this.getOctokit();

      const release: GhGetReleaseResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath()}/releases/${releaseId}`,
          {
            method: 'PATCH',
            data: {
              tag_name: releaseVersion,
              prerelease: false,
            },
          },
        )
      ).data;

      return { release };
    },
  };
}
