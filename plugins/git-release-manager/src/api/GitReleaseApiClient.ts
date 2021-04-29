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
import { DISABLE_CACHE } from '../constants/constants';
import { Project } from '../contexts/ProjectContext';
import { SemverTagParts } from '../helpers/tagParts/getSemverTagParts';
import { UnboxArray, UnboxReturnedPromise } from '../types/helpers';

export class GitReleaseApiClient implements GitReleaseApi {
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

  public getHost: GitReleaseApi['getHost'] = () => {
    return this.host;
  };

  public getRepoPath: GitReleaseApi['getRepoPath'] = ({ owner, repo }) => {
    return `${owner}/${repo}`;
  };

  getOwners: GitReleaseApi['getOwners'] = async () => {
    const { octokit } = await this.getOctokit();
    const orgListResponse = await octokit.paginate(
      octokit.orgs.listForAuthenticatedUser,
      { per_page: 100 },
    );

    return {
      owners: orgListResponse.map(organization => organization.login),
    };
  };

  getRepositories: GitReleaseApi['getRepositories'] = async ({ owner }) => {
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
  };

  getUser: GitReleaseApi['getUser'] = async () => {
    const { octokit } = await this.getOctokit();
    const userResponse = await octokit.users.getAuthenticated();

    return {
      username: userResponse.data.login,
      email: userResponse.data.email ?? undefined,
    };
  };

  getRecentCommits: GitReleaseApi['getRecentCommits'] = async ({
    owner,
    repo,
    releaseBranchName,
  }) => {
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
  };

  getLatestRelease: GitReleaseApi['getLatestRelease'] = async ({
    owner,
    repo,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: latestReleases } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 1,
      ...DISABLE_CACHE,
    });

    if (latestReleases.length === 0) {
      return null;
    }

    const latestRelease = latestReleases[0];

    return {
      targetCommitish: latestRelease.target_commitish,
      tagName: latestRelease.tag_name,
      prerelease: latestRelease.prerelease,
      id: latestRelease.id,
      htmlUrl: latestRelease.html_url,
      body: latestRelease.body,
    };
  };

  getRepository: GitReleaseApi['getRepository'] = async ({ owner, repo }) => {
    const { octokit } = await this.getOctokit();
    const { data: repository } = await octokit.repos.get({
      owner,
      repo,
      ...DISABLE_CACHE,
    });

    return {
      pushPermissions: repository.permissions?.push,
      defaultBranch: repository.default_branch,
      name: repository.name,
    };
  };

  getCommit: GitReleaseApi['getCommit'] = async ({ owner, repo, ref }) => {
    const { octokit } = await this.getOctokit();
    const { data: latestCommit } = await octokit.repos.getCommit({
      owner,
      repo,
      ref,
      ...DISABLE_CACHE,
    });

    return {
      sha: latestCommit.sha,
      htmlUrl: latestCommit.html_url,
      commit: {
        message: latestCommit.commit.message,
      },
      createdAt: latestCommit.commit.committer?.date,
    };
  };

  getBranch: GitReleaseApi['getBranch'] = async ({
    owner,
    repo,
    branchName,
  }) => {
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
  };

  createRef: GitReleaseApi['createRef'] = async ({ owner, repo, sha, ref }) => {
    const { octokit } = await this.getOctokit();
    const createRefResponse = await octokit.git.createRef({
      owner,
      repo,
      ref,
      sha,
    });

    return {
      ref: createRefResponse.data.ref,
      objectSha: createRefResponse.data.object.sha,
    };
  };

  createRc: GitReleaseApi['createRc'] = {
    getComparison: async ({ owner, repo, base, head }) => {
      const { octokit } = await this.getOctokit();
      const compareCommitsResponse = await octokit.repos.compareCommits({
        owner,
        repo,
        base,
        head,
      });

      return {
        htmlUrl: compareCommitsResponse.data.html_url,
        aheadBy: compareCommitsResponse.data.ahead_by,
      };
    },

    createRelease: async ({
      owner,
      repo,
      rcReleaseTag,
      releaseName,
      rcBranch,
      releaseBody,
    }) => {
      const { octokit } = await this.getOctokit();
      const createReleaseResponse = await octokit.repos.createRelease({
        owner,
        repo,
        tag_name: rcReleaseTag,
        name: releaseName,
        target_commitish: rcBranch,
        body: releaseBody,
        prerelease: true,
      });

      return {
        name: createReleaseResponse.data.name,
        htmlUrl: createReleaseResponse.data.html_url,
        tagName: createReleaseResponse.data.tag_name,
      };
    },
  };

  createTagObject: GitReleaseApi['createTagObject'] = async ({
    owner,
    repo,
    tag,
    objectSha,
    taggerName,
    taggerEmail,
    message,
  }) => {
    const { octokit } = await this.getOctokit();
    const { data: createdTagObject } = await octokit.git.createTag({
      owner,
      repo,
      message,
      tag,
      object: objectSha,
      type: 'commit',
      tagger: {
        date: new Date().toISOString(),
        email: taggerEmail,
        name: taggerName,
      },
    });

    return {
      tagName: createdTagObject.tag,
      tagSha: createdTagObject.sha,
    };
  };

  patch: GitReleaseApi['patch'] = {
    createTempCommit: async ({
      owner,
      repo,
      tagParts,
      releaseBranchTree,
      selectedPatchCommit,
    }) => {
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
    }) => {
      const { octokit } = await this.getOctokit();
      await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${releaseBranchName}`,
        sha: tempCommit.sha,
        force: true,
      });
    },

    merge: async ({ owner, repo, base, head }) => {
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
      messageSuffix,
    }) => {
      const { octokit } = await this.getOctokit();
      const { data: cherryPickCommit } = await octokit.git.createCommit({
        owner,
        repo,
        message: `[patch ${bumpedTag}] ${selectedPatchCommit.commit.message}

${messageSuffix}`,
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
    }) => {
      const { octokit } = await this.getOctokit();
      const { data: updatedReference } = await octokit.git.updateRef({
        owner,
        repo,
        ref: `heads/${releaseBranchName}`,
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

    updateRelease: async ({
      owner,
      repo,
      bumpedTag,
      latestRelease,
      tagParts,
      selectedPatchCommit,
    }) => {
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

  promoteRc: GitReleaseApi['promoteRc'] = {
    promoteRelease: async ({ owner, repo, releaseId, releaseVersion }) => {
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

  stats: GitReleaseApi['stats'] = {
    getAllTags: async ({ owner, repo }) => {
      const { octokit } = await this.getOctokit();

      const tags = await octokit.paginate(octokit.repos.listTags, {
        owner,
        repo,
        per_page: 100,
        ...DISABLE_CACHE,
      });

      return tags.map(tag => ({
        tagName: tag.name,
        sha: tag.commit.sha,
      }));
    },

    getAllReleases: async ({ owner, repo }) => {
      const { octokit } = await this.getOctokit();

      const releases = await octokit.paginate(octokit.repos.listReleases, {
        owner,
        repo,
        per_page: 100,
        ...DISABLE_CACHE,
      });

      return releases.map(release => ({
        id: release.id,
        name: release.name,
        tagName: release.tag_name,
        createdAt: release.published_at,
        htmlUrl: release.html_url,
      }));
    },

    getSingleTag: async ({ owner, repo, tagSha }) => {
      const { octokit } = await this.getOctokit();
      const singleTag = await octokit.git.getTag({
        owner,
        repo,
        tag_sha: tagSha,
      });

      return {
        date: singleTag.data.tagger.date,
        username: singleTag.data.tagger.name,
        userEmail: singleTag.data.tagger.email,
      };
    },
  };
}

type OwnerRepo = {
  owner: Project['owner'];
  repo: Project['repo'];
};

export interface GitReleaseApi {
  getHost: () => string;

  getRepoPath: (args: OwnerRepo) => string;

  getOwners: () => Promise<{
    owners: string[];
  }>;

  getRepositories: (args: {
    owner: OwnerRepo['owner'];
  }) => Promise<{
    repositories: string[];
  }>;

  getUser: (
    args: OwnerRepo,
  ) => Promise<{
    username: string;
    email?: string;
  }>;

  getRecentCommits: (
    args: {
      releaseBranchName?: string;
    } & OwnerRepo,
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
    args: OwnerRepo,
  ) => Promise<{
    targetCommitish: string;
    tagName: string;
    prerelease: boolean;
    id: number;
    htmlUrl: string;
    body?: string | null;
  } | null>;
  getRepository: (
    args: OwnerRepo,
  ) => Promise<{
    pushPermissions: boolean | undefined;
    defaultBranch: string;
    name: string;
  }>;

  getCommit: (
    args: {
      ref: string;
    } & OwnerRepo,
  ) => Promise<{
    sha: string;
    htmlUrl: string;
    commit: {
      message: string;
    };
    createdAt?: string;
  }>;

  getBranch: (
    args: {
      branchName: string;
    } & OwnerRepo,
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

  createRef: (
    args: {
      ref: string;
      sha: string;
    } & OwnerRepo,
  ) => Promise<{
    ref: string;
    objectSha: string;
  }>;

  createRc: {
    getComparison: (
      args: {
        base: string;
        head: string;
      } & OwnerRepo,
    ) => Promise<{
      htmlUrl: string;
      aheadBy: number;
    }>;

    createRelease: (
      args: {
        rcReleaseTag: string;
        releaseName: string;
        rcBranch: string;
        releaseBody: string;
      } & OwnerRepo,
    ) => Promise<{
      name: string | null;
      htmlUrl: string;
      tagName: string;
    }>;
  };

  createTagObject: (
    args: {
      tag: string;
      taggerEmail?: string;
      message: string;
      objectSha: string;
      taggerName: string;
    } & OwnerRepo,
  ) => Promise<{
    tagName: string;
    tagSha: string;
  }>;

  patch: {
    createTempCommit: (
      args: {
        tagParts: SemverTagParts | CalverTagParts;
        releaseBranchTree: string;
        selectedPatchCommit: UnboxArray<
          UnboxReturnedPromise<GitReleaseApi['getRecentCommits']>
        >;
      } & OwnerRepo,
    ) => Promise<{
      message: string;
      sha: string;
    }>;

    forceBranchHeadToTempCommit: (
      args: {
        releaseBranchName: string;
        tempCommit: CreateTempCommitResult;
      } & OwnerRepo,
    ) => Promise<void>;

    merge: (
      args: {
        base: string;
        head: string;
      } & OwnerRepo,
    ) => Promise<{
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
          UnboxReturnedPromise<GitReleaseApi['getRecentCommits']>
        >;
        mergeTree: string;
        releaseBranchSha: string;
        messageSuffix: string;
      } & OwnerRepo,
    ) => Promise<{
      message: string;
      sha: string;
    }>;

    replaceTempCommit: (
      args: {
        releaseBranchName: string;
        cherryPickCommit: UnboxReturnedPromise<
          GitReleaseApi['patch']['createCherryPickCommit']
        >;
      } & OwnerRepo,
    ) => Promise<{
      ref: string;
      object: {
        sha: string;
      };
    }>;

    updateRelease: (
      args: {
        bumpedTag: string;
        latestRelease: NonNullable<GetLatestReleaseResult>;
        tagParts: SemverTagParts | CalverTagParts;
        selectedPatchCommit: GetRecentCommitsResultSingle;
      } & OwnerRepo,
    ) => Promise<{
      name: string | null;
      tagName: string;
      htmlUrl: string;
    }>;
  };
  promoteRc: {
    promoteRelease: (
      args: {
        releaseId: NonNullable<GetLatestReleaseResult>['id'];
        releaseVersion: string;
      } & OwnerRepo,
    ) => Promise<{
      name: string | null;
      tagName: string;
      htmlUrl: string;
    }>;
  };
  stats: {
    getAllTags: (
      args: OwnerRepo,
    ) => Promise<
      Array<{
        tagName: string;
        sha: string;
      }>
    >;

    getAllReleases: (
      args: OwnerRepo,
    ) => Promise<
      Array<{
        id: number;
        name: string | null;
        tagName: string;
        createdAt: string | null;
        htmlUrl: string;
      }>
    >;

    getSingleTag: (
      args: {
        tagSha: string;
      } & OwnerRepo,
    ) => Promise<{
      date: string;
      username: string;
      userEmail: string;
    }>;
  };
}

export type GetOwnersResult = UnboxReturnedPromise<GitReleaseApi['getOwners']>;
export type GetRepositoriesResult = UnboxReturnedPromise<
  GitReleaseApi['getRepositories']
>;
export type GetUserResult = UnboxReturnedPromise<GitReleaseApi['getUser']>;
export type GetRecentCommitsResult = UnboxReturnedPromise<
  GitReleaseApi['getRecentCommits']
>;
export type GetRecentCommitsResultSingle = UnboxArray<GetRecentCommitsResult>;
export type GetLatestReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['getLatestRelease']
>;
export type GetRepositoryResult = UnboxReturnedPromise<
  GitReleaseApi['getRepository']
>;
export type GetLatestCommitResult = UnboxReturnedPromise<
  GitReleaseApi['getCommit']
>;
export type GetBranchResult = UnboxReturnedPromise<GitReleaseApi['getBranch']>;
export type CreateRefResult = UnboxReturnedPromise<GitReleaseApi['createRef']>;
export type GetComparisonResult = UnboxReturnedPromise<
  GitReleaseApi['createRc']['getComparison']
>;
export type CreateReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['createRc']['createRelease']
>;
export type CreateTempCommitResult = UnboxReturnedPromise<
  GitReleaseApi['patch']['createTempCommit']
>;
export type ForceBranchHeadToTempCommitResult = UnboxReturnedPromise<
  GitReleaseApi['patch']['forceBranchHeadToTempCommit']
>;
export type MergeResult = UnboxReturnedPromise<GitReleaseApi['patch']['merge']>;
export type CreateCherryPickCommitResult = UnboxReturnedPromise<
  GitReleaseApi['patch']['createCherryPickCommit']
>;
export type ReplaceTempCommitResult = UnboxReturnedPromise<
  GitReleaseApi['patch']['replaceTempCommit']
>;
export type CreateTagObjectResult = UnboxReturnedPromise<
  GitReleaseApi['createTagObject']
>;
export type UpdateReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['patch']['updateRelease']
>;
export type PromoteReleaseResult = UnboxReturnedPromise<
  GitReleaseApi['promoteRc']['promoteRelease']
>;
export type GetAllTagsResult = UnboxReturnedPromise<
  GitReleaseApi['stats']['getAllTags']
>;
export type GetAllReleasesResult = UnboxReturnedPromise<
  GitReleaseApi['stats']['getAllReleases']
>;
export type GetSingleTagResult = UnboxReturnedPromise<
  GitReleaseApi['stats']['getSingleTag']
>;
