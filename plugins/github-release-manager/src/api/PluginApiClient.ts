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
  GhCreateCommitResponse,
  GhCreateReferenceResponse,
  GhCreateTagObjectResponse,
  GhGetCommitResponse,
  GhGetReleaseResponse,
  GhMergeResponse,
  GhUpdateReferenceResponse,
  GhUpdateReleaseResponse,
} from '../types/types';
import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { getRcGitHubInfo } from '../cards/createRc/getRcGitHubInfo';
import { SemverTagParts } from '../helpers/tagParts/getSemverTagParts';
import { Project } from '../contexts/ProjectContext';

type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

export type ApiMethodRetval<
  T extends (...args: any) => Promise<any>
> = UnboxPromise<ReturnType<T>>;

type Todo = any; // TODO:
type PartialProject = Omit<Project, 'versioningStrategy'>;

export interface IPluginApiClient {
  getHost: () => string;

  getRepoPath: (args: PartialProject) => string;

  getOrganizations: () => Promise<{ organizations: string[] }>;

  getRepositories: (args: {
    owner: string;
  }) => Promise<{ repositories: string[] }>;

  getUsername: () => Promise<{ username: string }>;

  getRecentCommits: (
    args: { releaseBranchName?: string } & PartialProject,
  ) => Promise<{
    recentCommits: {
      sha: string;
      author: {
        htmlUrl?: string;
        login?: string;
      };
      commit: {
        message: string;
      };
    }[];
  }>;

  getLatestRelease: (
    args: PartialProject,
  ) => Promise<{
    latestRelease: {
      targetCommitish: string;
      tagName: string;
      prerelease: boolean;
      id: number;
      htmlUrl: string;
      body?: string | null;
    } | null;
  }>;

  getRepository: (
    args: PartialProject,
  ) => Promise<{
    repository: {
      pushPermissions: boolean | undefined;
      defaultBranch: string;
      name: string;
    };
  }>;

  getLatestCommit: (
    args: {
      defaultBranch: string;
    } & PartialProject,
  ) => Promise<Todo>;

  getBranch: (
    args: {
      branchName: string;
    } & PartialProject,
  ) => Promise<{
    name: string;
    links: {
      html: string;
    };
    commit: {
      sha: string;
      commit: {
        tree: {
          sha: string;
        };
      };
    };
  }>;

  createRc: {
    createRef: (
      args: {
        mostRecentSha: string;
        targetBranch: string;
      } & PartialProject,
    ) => Promise<{ ref: string }>;

    getComparison: (
      args: {
        previousReleaseBranch: string;
        nextReleaseBranch: string;
      } & PartialProject,
    ) => Promise<{ htmlUrl: string; aheadBy: number }>;

    createRelease: (
      args: {
        nextGitHubInfo: ReturnType<typeof getRcGitHubInfo>;
        releaseBody: string;
      } & PartialProject,
    ) => Promise<{
      createReleaseResponse: {
        name: string | null;
        htmlUrl: string;
        tagName: string;
      };
    }>;
  };

  patch: {
    createTempCommit: (
      args: {
        tagParts: SemverTagParts | CalverTagParts;
        releaseBranchTree: string;
        selectedPatchCommit: GhGetCommitResponse;
      } & PartialProject,
    ) => Promise<Todo>;

    forceBranchHeadToTempCommit: (
      args: {
        releaseBranchName: string;
        tempCommit: GhCreateCommitResponse;
      } & PartialProject,
    ) => Promise<Todo>;

    merge: ({
      base,
      head,
    }: { base: string; head: string } & PartialProject) => Promise<Todo>;

    createCherryPickCommit: (
      args: {
        bumpedTag: string;
        selectedPatchCommit: GhGetCommitResponse;
        mergeTree: string;
        releaseBranchSha: string;
      } & PartialProject,
    ) => Promise<Todo>;

    replaceTempCommit: (
      args: {
        releaseBranchName: string;
        cherryPickCommit: GhCreateCommitResponse;
      } & PartialProject,
    ) => Promise<Todo>;

    createTagObject: ({
      bumpedTag,
      updatedReference,
    }: {
      bumpedTag: string;
      updatedReference: GhUpdateReferenceResponse;
    } & PartialProject) => Promise<Todo>;

    createReference: (
      args: {
        bumpedTag: string;
        tagObjectResponse: GhCreateTagObjectResponse;
      } & PartialProject,
    ) => Promise<Todo>;

    updateRelease: (
      args: {
        bumpedTag: string;
        latestRelease: NonNullable<
          ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
        >;
        tagParts: SemverTagParts | CalverTagParts;
        selectedPatchCommit: GhGetCommitResponse;
      } & PartialProject,
    ) => Promise<Todo>;
  };

  promoteRc: {
    promoteRelease: (
      args: {
        releaseId: GhGetReleaseResponse['id'];
        releaseVersion: string;
      } & PartialProject,
    ) => Promise<Todo>;
  };
}

export class PluginApiClient implements IPluginApiClient {
  private readonly githubAuthApi: OAuthApi;
  private readonly baseUrl: string;
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

    const githubIntegrationEnterpriseConfig = configs.find(v =>
      v.host.startsWith('ghe.'),
    );
    const githubIntegrationConfig = configs.find(v => v.host === 'github.com');

    // Prioritize enterprise configs if available
    return githubIntegrationEnterpriseConfig ?? githubIntegrationConfig;
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

  public getRepoPath({ owner, repo }: PartialProject) {
    return `${owner}/${repo}`;
  }

  async getOrganizations() {
    const { octokit } = await this.getOctokit();
    const orgListResponse = await octokit.paginate(
      octokit.orgs.listForAuthenticatedUser,
      { per_page: 100 },
    );

    return {
      organizations: orgListResponse.map(organization => organization.login),
    };
  }

  async getRepositories({ owner }: { owner: string }) {
    const { octokit } = await this.getOctokit();

    const repositoryResponse = await octokit
      .paginate(octokit.repos.listForOrg, { org: owner, per_page: 100 })
      .catch(async error => {
        // `owner` is not an org, try listing a user's repositories instead
        if (error.status === 404) {
          const userRepositoryResponse = await octokit.paginate(
            octokit.repos.listForUser,
            { username: owner, per_page: 100 },
          );
          return userRepositoryResponse;
        }

        throw error;
      });

    return {
      repositories: repositoryResponse.map(repository => repository.name),
    };
  }

  async getUsername() {
    const { octokit } = await this.getOctokit();
    const userResponse = await octokit.users.getAuthenticated();

    return {
      username: userResponse.data.login,
    };
  }

  async getRecentCommits({
    owner,
    repo,
    releaseBranchName,
  }: {
    releaseBranchName?: string;
  } & PartialProject) {
    const { octokit } = await this.getOctokit();
    const recentCommitsResponse = await octokit.repos.listCommits({
      owner,
      repo,
      ...(releaseBranchName ? { sha: releaseBranchName } : {}),
    });

    return {
      recentCommits: recentCommitsResponse.data.map(commit => ({
        sha: commit.sha,
        author: {
          htmlUrl: commit.author?.html_url,
          login: commit.author?.login,
        },
        commit: {
          message: commit.commit.message,
        },
      })),
    };
  }

  async getLatestRelease({ owner, repo }: PartialProject) {
    const { octokit } = await this.getOctokit();
    const { data: latestReleases } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 1,
    });

    if (latestReleases.length === 0) {
      return {
        latestRelease: null,
      };
    }

    const latestRelease = latestReleases[0];

    return {
      latestRelease: {
        targetCommitish: latestRelease.target_commitish,
        tagName: latestRelease.tag_name,
        prerelease: latestRelease.prerelease,
        id: latestRelease.id,
        htmlUrl: latestRelease.html_url,
        body: latestRelease.body,
      },
    };
  }

  async getRepository({ owner, repo }: PartialProject) {
    const { octokit } = await this.getOctokit();

    const { data: repository } = await octokit.repos.get({
      owner,
      repo,
    });

    return {
      repository: {
        pushPermissions: repository.permissions?.push,
        defaultBranch: repository.default_branch,
        name: repository.name,
      },
    };
  }

  async getLatestCommit({
    owner,
    repo,
    defaultBranch,
  }: { defaultBranch: string } & PartialProject) {
    const { octokit } = await this.getOctokit();
    const latestCommit: GhGetCommitResponse = (
      await octokit.request(
        `/repos/${this.getRepoPath({
          owner,
          repo,
        })}/commits/refs/heads/${defaultBranch}`,
      )
    ).data;

    return { latestCommit };
  }

  async getBranch({
    owner,
    repo,
    branchName,
  }: { branchName: string } & PartialProject) {
    const { octokit } = await this.getOctokit();

    const { data: branch } = await octokit.repos.getBranch({
      owner,
      repo,
      branch: branchName,
    });

    return {
      name: branch.name,
      links: {
        html: branch._links.html,
      },
      commit: {
        sha: branch.commit.sha,
        commit: {
          tree: {
            sha: branch.commit.commit.tree.sha,
          },
        },
      },
    };
  }

  createRc = {
    createRef: async ({
      owner,
      repo,
      mostRecentSha,
      targetBranch,
    }: {
      mostRecentSha: string;
      targetBranch: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const createRefResponse = await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${targetBranch}`,
        sha: mostRecentSha,
      });

      return {
        ref: createRefResponse.data.ref,
      };
    },

    getComparison: async ({
      owner,
      repo,
      previousReleaseBranch,
      nextReleaseBranch,
    }: {
      previousReleaseBranch: string;
      nextReleaseBranch: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const compareCommitsResponse = await octokit.repos.compareCommits({
        owner,
        repo,
        base: previousReleaseBranch,
        head: nextReleaseBranch,
      });

      return {
        htmlUrl: compareCommitsResponse.data.html_url,
        aheadBy: compareCommitsResponse.data.ahead_by,
      };
    },

    createRelease: async ({
      owner,
      repo,
      nextGitHubInfo,
      releaseBody,
    }: {
      nextGitHubInfo: ReturnType<typeof getRcGitHubInfo>;
      releaseBody: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const createReleaseResponse = await octokit.repos.createRelease({
        owner,
        repo,
        tag_name: nextGitHubInfo.rcReleaseTag,
        name: nextGitHubInfo.releaseName,
        target_commitish: nextGitHubInfo.rcBranch,
        body: releaseBody,
        prerelease: true,
      });

      return {
        createReleaseResponse: {
          name: createReleaseResponse.data.name,
          htmlUrl: createReleaseResponse.data.html_url,
          tagName: createReleaseResponse.data.tag_name,
        },
      };
    },
  };

  patch = {
    createTempCommit: async ({
      owner,
      repo,
      tagParts,
      releaseBranchTree,
      selectedPatchCommit,
    }: {
      tagParts: SemverTagParts | CalverTagParts;
      releaseBranchTree: string;
      selectedPatchCommit: GhGetCommitResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const tempCommit: GhCreateCommitResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/git/commits`,
          {
            method: 'POST',
            data: {
              message: `Temporary commit for patch ${tagParts.patch}`,
              tree: releaseBranchTree,
              parents: [selectedPatchCommit.parents[0].sha],
            },
          },
        )
      ).data;

      return { tempCommit };
    },

    forceBranchHeadToTempCommit: async ({
      owner,
      repo,
      releaseBranchName,
      tempCommit,
    }: {
      releaseBranchName: string;
      tempCommit: GhCreateCommitResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      await octokit.request(
        `/repos/${this.getRepoPath({
          owner,
          repo,
        })}/git/refs/heads/${releaseBranchName}`,
        {
          method: 'PATCH',
          data: {
            sha: tempCommit.sha,
            force: true,
          },
        },
      );
    },

    merge: async ({
      owner,
      repo,
      base,
      head,
    }: { base: string; head: string } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const merge: GhMergeResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/merges`,
          {
            method: 'POST',
            data: { base, head },
          },
        )
      ).data;

      return { merge };
    },

    createCherryPickCommit: async ({
      owner,
      repo,
      bumpedTag,
      selectedPatchCommit,
      mergeTree,
      releaseBranchSha,
    }: {
      bumpedTag: string;
      selectedPatchCommit: GhGetCommitResponse;
      mergeTree: string;
      releaseBranchSha: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const cherryPickCommit: GhCreateCommitResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/git/commits`,
          {
            method: 'POST',
            data: {
              message: `[patch ${bumpedTag}] ${selectedPatchCommit.commit.message}`,
              tree: mergeTree,
              parents: [releaseBranchSha],
            },
          },
        )
      ).data;

      return { cherryPickCommit };
    },

    replaceTempCommit: async ({
      owner,
      repo,
      releaseBranchName,
      cherryPickCommit,
    }: {
      releaseBranchName: string;
      cherryPickCommit: GhCreateCommitResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const updatedReference: GhUpdateReferenceResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({
            owner,
            repo,
          })}/git/refs/heads/${releaseBranchName}`,
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
      owner,
      repo,
      bumpedTag,
      updatedReference,
    }: {
      bumpedTag: string;
      updatedReference: GhUpdateReferenceResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const tagObjectResponse: GhCreateTagObjectResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/git/tags`,
          {
            method: 'POST',
            data: {
              type: 'commit',
              message:
                'Tag generated by your friendly neighborhood GitHub Release Manager',
              tag: bumpedTag,
              object: updatedReference.object.sha,
            },
          },
        )
      ).data;

      return { tagObjectResponse };
    },

    createReference: async ({
      owner,
      repo,
      bumpedTag,
      tagObjectResponse,
    }: {
      bumpedTag: string;
      tagObjectResponse: GhCreateTagObjectResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const reference: GhCreateReferenceResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/git/refs`,
          {
            method: 'POST',
            data: {
              ref: `refs/tags/${bumpedTag}`,
              sha: tagObjectResponse.sha,
            },
          },
        )
      ).data;

      return { reference };
    },

    updateRelease: async ({
      owner,
      repo,
      bumpedTag,
      latestRelease,
      tagParts,
      selectedPatchCommit,
    }: {
      bumpedTag: string;
      latestRelease: NonNullable<
        ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
      >;
      tagParts: SemverTagParts | CalverTagParts;
      selectedPatchCommit: GhGetCommitResponse;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const release: GhUpdateReleaseResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/releases/${
            latestRelease.id
          }`,
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
      owner,
      repo,
      releaseId,
      releaseVersion,
    }: {
      releaseId: GhGetReleaseResponse['id'];
      releaseVersion: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();

      const release: GhGetReleaseResponse = (
        await octokit.request(
          `/repos/${this.getRepoPath({ owner, repo })}/releases/${releaseId}`,
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
