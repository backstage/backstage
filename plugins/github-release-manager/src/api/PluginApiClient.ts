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

import { CalverTagParts } from '../helpers/tagParts/getCalverTagParts';
import { getRcGitHubInfo } from '../cards/createRc/getRcGitHubInfo';
import { Project } from '../contexts/ProjectContext';
import { SemverTagParts } from '../helpers/tagParts/getSemverTagParts';

type UnboxPromise<T extends Promise<any>> = T extends Promise<infer U>
  ? U
  : never;

export type ApiMethodRetval<
  T extends (...args: any) => Promise<any>
> = UnboxPromise<ReturnType<T>>;

export type UnboxArray<T> = T extends (infer U)[] ? U : T;

type PartialProject = Omit<Project, 'versioningStrategy'>;

export interface IPluginApiClient {
  getHost: () => string;

  getRepoPath: (args: PartialProject) => string;

  getOwners: () => Promise<{ owners: string[] }>;

  getRepositories: (args: {
    owner: string;
  }) => Promise<{ repositories: string[] }>;

  getUsername: () => Promise<{ username: string }>;

  getRecentCommits: (
    args: { releaseBranchName?: string } & PartialProject,
  ) => Promise<
    {
      htmlUrl: string;
      sha: string;
      author: {
        htmlUrl?: string;
        login?: string;
      };
      commit: {
        message: string;
      };
      firstParentSha?: string;
    }[]
  >;

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
  ) => Promise<{
    sha: string;
    htmlUrl: string;
    commit: {
      message: string;
    };
  }>;

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
        selectedPatchCommit: UnboxArray<
          ApiMethodRetval<IPluginApiClient['getRecentCommits']>
        >;
      } & PartialProject,
    ) => Promise<{
      message: string;
      sha: string;
    }>;

    forceBranchHeadToTempCommit: (
      args: {
        releaseBranchName: string;
        tempCommit: ApiMethodRetval<
          IPluginApiClient['patch']['createTempCommit']
        >;
      } & PartialProject,
    ) => Promise<void>;

    merge: ({
      base,
      head,
    }: {
      base: string;
      head: string;
    } & PartialProject) => Promise<{
      htmlUrl: string;
      commit: {
        message: string;
        tree: {
          sha: string;
        };
      };
    }>;

    createCherryPickCommit: (
      args: {
        bumpedTag: string;
        selectedPatchCommit: UnboxArray<
          ApiMethodRetval<IPluginApiClient['getRecentCommits']>
        >;
        mergeTree: string;
        releaseBranchSha: string;
      } & PartialProject,
    ) => Promise<{
      message: string;
      sha: string;
    }>;

    replaceTempCommit: (
      args: {
        releaseBranchName: string;
        cherryPickCommit: ApiMethodRetval<
          IPluginApiClient['patch']['createCherryPickCommit']
        >;
      } & PartialProject,
    ) => Promise<{
      ref: string;
      object: {
        sha: string;
      };
    }>;

    createTagObject: ({
      bumpedTag,
      updatedReference,
    }: {
      bumpedTag: string;
      updatedReference: ApiMethodRetval<
        IPluginApiClient['patch']['replaceTempCommit']
      >;
    } & PartialProject) => Promise<{
      tag: string;
      sha: string;
    }>;

    createReference: (
      args: {
        bumpedTag: string;
        createdTagObject: ApiMethodRetval<
          IPluginApiClient['patch']['createTagObject']
        >;
      } & PartialProject,
    ) => Promise<{
      ref: string;
    }>;

    updateRelease: (
      args: {
        bumpedTag: string;
        latestRelease: NonNullable<
          ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
        >;
        tagParts: SemverTagParts | CalverTagParts;
        selectedPatchCommit: UnboxArray<
          ApiMethodRetval<IPluginApiClient['getRecentCommits']>
        >;
      } & PartialProject,
    ) => Promise<{
      name: string | null;
      tagName: string;
      htmlUrl: string;
    }>;
  };

  promoteRc: {
    promoteRelease: (
      args: {
        releaseId: NonNullable<
          ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
        >['id'];
        releaseVersion: string;
      } & PartialProject,
    ) => Promise<{
      name: string | null;
      tagName: string;
      htmlUrl: string;
    }>;
  };
}

const DISABLE_CACHE = {
  headers: {
    'If-None-Match': '',
  },
};

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

  async getOwners() {
    const { octokit } = await this.getOctokit();
    const orgListResponse = await octokit.paginate(
      octokit.orgs.listForAuthenticatedUser,
      { per_page: 100 },
    );

    return {
      owners: orgListResponse.map(organization => organization.login),
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
      ...DISABLE_CACHE,
    });

    return recentCommitsResponse.data.map(commit => ({
      htmlUrl: commit.html_url,
      sha: commit.sha,
      author: {
        htmlUrl: commit.author?.html_url,
        login: commit.author?.login,
      },
      commit: {
        message: commit.commit.message,
      },
      firstParentSha: commit.parents?.[0]?.sha,
    }));
  }

  async getLatestRelease({ owner, repo }: PartialProject) {
    const { octokit } = await this.getOctokit();
    const { data: latestReleases } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 1,
      ...DISABLE_CACHE,
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
      ...DISABLE_CACHE,
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
    const { data: latestCommit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref: defaultBranch,
      ...DISABLE_CACHE,
    });

    return {
      sha: latestCommit.sha,
      htmlUrl: latestCommit.html_url,
      commit: {
        message: latestCommit.commit.message,
      },
    };
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
      ...DISABLE_CACHE,
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
      selectedPatchCommit: UnboxArray<
        ApiMethodRetval<IPluginApiClient['getRecentCommits']>
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: tempCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message: `Temporary commit for patch ${tagParts.patch}`,
        tree: releaseBranchTree,
        parents: [selectedPatchCommit.firstParentSha ?? ''], // TODO: Avoid `??`
      });

      return {
        message: tempCommit.message,
        sha: tempCommit.sha,
      };
    },

    forceBranchHeadToTempCommit: async ({
      owner,
      repo,
      releaseBranchName,
      tempCommit,
    }: {
      releaseBranchName: string;
      tempCommit: ApiMethodRetval<
        IPluginApiClient['patch']['createTempCommit']
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      await octokit.git.updateRef({
        owner,
        repo,
        ref: releaseBranchName,
        sha: tempCommit.sha,
        force: true,
      });
    },

    merge: async ({
      owner,
      repo,
      base,
      head,
    }: { base: string; head: string } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: merge } = await octokit.repos.merge({
        owner,
        repo,
        base,
        head,
      });

      return {
        htmlUrl: merge.html_url,
        commit: {
          message: merge.commit.message,
          tree: {
            sha: merge.commit.tree.sha,
          },
        },
      };
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
      selectedPatchCommit: UnboxArray<
        ApiMethodRetval<IPluginApiClient['getRecentCommits']>
      >;
      mergeTree: string;
      releaseBranchSha: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: cherryPickCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message: `[patch ${bumpedTag}] ${selectedPatchCommit.commit.message}`,
        tree: mergeTree,
        parents: [releaseBranchSha],
      });

      return {
        message: cherryPickCommit.message,
        sha: cherryPickCommit.sha,
      };
    },

    replaceTempCommit: async ({
      owner,
      repo,
      releaseBranchName,
      cherryPickCommit,
    }: {
      releaseBranchName: string;
      cherryPickCommit: ApiMethodRetval<
        IPluginApiClient['patch']['createCherryPickCommit']
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: updatedReference } = await octokit.git.updateRef({
        owner,
        repo,
        ref: releaseBranchName,
        sha: cherryPickCommit.sha,
        force: true,
      });

      return {
        ref: updatedReference.ref,
        object: {
          sha: updatedReference.object.sha,
        },
      };
    },

    createTagObject: async ({
      owner,
      repo,
      bumpedTag,
      updatedReference,
    }: {
      bumpedTag: string;
      updatedReference: ApiMethodRetval<
        IPluginApiClient['patch']['replaceTempCommit']
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: createdTagObject } = await octokit.git.createTag({
        owner,
        repo,
        message:
          'Tag generated by your friendly neighborhood Backstage Release Manager',
        tag: bumpedTag,
        object: updatedReference.object.sha,
        type: 'commit',
      });

      return {
        tag: createdTagObject.tag,
        sha: createdTagObject.sha,
      };
    },

    createReference: async ({
      owner,
      repo,
      bumpedTag,
      createdTagObject,
    }: {
      bumpedTag: string;
      createdTagObject: ApiMethodRetval<
        IPluginApiClient['patch']['createTagObject']
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: reference } = await octokit.git.createRef({
        owner,
        repo,
        ref: `refs/tags/${bumpedTag}`,
        sha: createdTagObject.sha,
      });

      return {
        ref: reference.ref,
      };
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
      selectedPatchCommit: UnboxArray<
        ApiMethodRetval<IPluginApiClient['getRecentCommits']>
      >;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: updatedRelease } = await octokit.repos.updateRelease({
        owner,
        repo,
        release_id: latestRelease.id,
        tag_name: bumpedTag,
        body: `${latestRelease.body}

        #### [Patch ${tagParts.patch}](${selectedPatchCommit.htmlUrl})
  
        ${selectedPatchCommit.commit.message}`,
      });

      return {
        name: updatedRelease.name,
        tagName: updatedRelease.tag_name,
        htmlUrl: updatedRelease.html_url,
      };
    },
  };

  promoteRc = {
    promoteRelease: async ({
      owner,
      repo,
      releaseId,
      releaseVersion,
    }: {
      releaseId: NonNullable<
        ApiMethodRetval<IPluginApiClient['getLatestRelease']>['latestRelease']
      >['id'];
      releaseVersion: string;
    } & PartialProject) => {
      const { octokit } = await this.getOctokit();
      const { data: promotedRelease } = await octokit.repos.updateRelease({
        owner,
        repo,
        release_id: releaseId,
        tag_name: releaseVersion,
        prerelease: false,
      });

      return {
        name: promotedRelease.name,
        tagName: promotedRelease.tag_name,
        htmlUrl: promotedRelease.html_url,
      };
    },
  };
}
