/*
 * Copyright 2020 Spotify AB
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

import { PublisherBase, PublisherOptions, PublisherResult } from './types';
import { initRepoAndPush } from './helpers';
import { GitHubIntegrationConfig } from '@backstage/integration';
import parseGitUrl from 'git-url-parse';
import { Octokit } from '@octokit/rest';

export type RepoVisibilityOptions = 'private' | 'internal' | 'public';
export type GithubBranchConfig = {
  [branchName: string]: {
    allowForcePush?: boolean;
    allowDeletions?: boolean;
    requireSignedCommits?: boolean;
    enforceAdmins?: boolean;
    /**
     * Enforce Pull request reviews. Required when specifying any of
     *  dismmissStaleReviews, requireCodeOwnerReviews or
     *  requiredApprovingReviewCount
     */
    requirePRReviews?: boolean; // TODO
    dismissStaleReviews?: boolean;
    requireCodeOwnerReviews?: boolean;
    requiredApprovingReviewCount?: number;
    /**
     * Enforce status checks. Required when specifying any of
     *  requireUpToDateBeforeMerging or requiredContexts
     */
    requireStatusChecksBeforeMerging?: boolean; // TODO
    requireUpToDateBeforeMerging?: boolean;
    requiredContexts?: string[];
  };
};
export type GithubPublisherConfig = {
  repoVisibility: RepoVisibilityOptions;
  readers: string[];
  writers: string[];
  enableAutomatedSecurityFixes?: boolean;
  enableVulnerabilityAlerts?: boolean;
  branchConfig?: GithubBranchConfig;
};
export class GithubPublisher implements PublisherBase {
  static async fromConfig(
    config: GitHubIntegrationConfig,
    {
      repoVisibility,
      readers,
      writers,
      enableVulnerabilityAlerts,
      enableAutomatedSecurityFixes,
      branchConfig,
    }: GithubPublisherConfig,
  ) {
    if (!config.token) {
      return undefined;
    }

    const githubClient = new Octokit({
      auth: config.token,
      baseUrl: config.apiBaseUrl,
    });

    return new GithubPublisher({
      token: config.token,
      client: githubClient,
      repoVisibility,
      readers,
      writers,
      enableAutomatedSecurityFixes,
      enableVulnerabilityAlerts,
      branchConfig,
    });
  }
  constructor(
    private readonly config: {
      token: string;
      client: Octokit;
    } & GithubPublisherConfig,
  ) {}

  async publish({
    values,
    directory,
    logger,
  }: PublisherOptions): Promise<PublisherResult> {
    const { owner, name } = parseGitUrl(values.storePath);

    const description = values.description as string;
    const access = values.access as string;
    const remoteUrl = await this.createRemote({
      description,
      access,
      name,
      owner,
    });

    await this.configureBranches({
      owner,
      name,
      branchConfig: this.config.branchConfig,
    });

    await initRepoAndPush({
      dir: directory,
      remoteUrl,
      auth: {
        username: this.config.token,
        password: 'x-oauth-basic',
      },
      logger,
    });

    const catalogInfoUrl = remoteUrl.replace(
      /\.git$/,
      '/blob/master/catalog-info.yaml',
    );

    return { remoteUrl, catalogInfoUrl };
  }

  private async createRemote(opts: {
    access: string;
    name: string;
    owner: string;
    description: string;
  }) {
    const { access, description, owner, name } = opts;

    const user = await this.config.client.users.getByUsername({
      username: owner,
    });

    const repoCreationPromise =
      user.data.type === 'Organization'
        ? this.config.client.repos.createInOrg({
            name,
            org: owner,
            private: this.config.repoVisibility !== 'public',
            visibility: this.config.repoVisibility,
            description,
          })
        : this.config.client.repos.createForAuthenticatedUser({
            name,
            private: this.config.repoVisibility === 'private',
            description,
          });

    const { data } = await repoCreationPromise;

    if (access?.startsWith(`${owner}/`)) {
      const [, team] = access.split('/');
      await this.config.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'admin',
      });
      // no need to add access if it's the person who own's the personal account
    } else if (access && access !== owner) {
      await this.config.client.repos.addCollaborator({
        owner,
        repo: name,
        username: access,
        permission: 'admin',
      });
    }

    for (const team of this.config.readers) {
      await this.config.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'pull',
      });
    }

    for (const team of this.config.writers) {
      await this.config.client.teams.addOrUpdateRepoPermissionsInOrg({
        org: owner,
        team_slug: team,
        owner,
        repo: name,
        permission: 'push',
      });
    }

    if (this.config.enableAutomatedSecurityFixes) {
      this.config.client.repos.enableAutomatedSecurityFixes({
        owner,
        repo: name,
      });
    }

    if (this.config.enableVulnerabilityAlerts) {
      this.config.client.repos.enableVulnerabilityAlerts({
        owner,
        repo: name,
      });
    }

    return data?.clone_url;
  }

  private async configureBranches(opts: {
    name: string;
    owner: string;
    branchConfig: GithubPublisherConfig['branchConfig'];
  }) {
    const { owner, name, branchConfig: branches = {} } = opts;

    for (const branchName of Object.keys(branches)) {
      const branchConfig = {
        ...branches[branchName as keyof typeof branches],
      };

      if (branchConfig.requireSignedCommits) {
        await this.config.client.repos.createCommitSignatureProtection({
          owner,
          repo: name,
          branch: branchName,
        });
        delete branchConfig.requireSignedCommits;
      }

      const hasBranchProtectionChanges = Object.keys(branchConfig).length > 0;
      if (hasBranchProtectionChanges) {
        const {
          data: existingConfig,
        } = await this.config.client.repos.getBranchProtection({
          owner,
          repo: name,
          branch: branchName,
        });

        // Set all values to the existing value unless specified in config:
        await this.config.client.repos.updateBranchProtection({
          owner,
          repo: name,
          branch: branchName,

          required_status_checks: branchConfig.requireStatusChecksBeforeMerging
            ? {
                contexts:
                  branchConfig.requiredContexts ??
                  existingConfig.required_status_checks.contexts,
                // this value is not returned from API "existingConfig". default false?
                strict: branchConfig.requireUpToDateBeforeMerging ?? false,
              }
            : null,
          required_pull_request_reviews:
            branchConfig.requirePRReviews ??
            existingConfig.required_pull_request_reviews
              ? {
                  dismiss_stale_reviews:
                    branchConfig.dismissStaleReviews ??
                    existingConfig.required_pull_request_reviews
                      ?.dismiss_stale_reviews,
                  require_code_owner_reviews:
                    branchConfig.requireCodeOwnerReviews ??
                    existingConfig.required_pull_request_reviews
                      ?.require_code_owner_reviews,
                  required_approving_review_count:
                    branchConfig.requiredApprovingReviewCount ??
                    existingConfig.required_pull_request_reviews
                      ?.required_approving_review_count,
                }
              : null,
          enforce_admins:
            branchConfig.enforceAdmins ??
            !!existingConfig.enforce_admins?.enabled,
          allow_deletions:
            branchConfig.allowDeletions ??
            !!existingConfig.allow_deletions?.enabled,
          allow_force_pushes:
            branchConfig.allowForcePush ??
            !!existingConfig.allow_force_pushes?.enabled,
          // required field, just keep existing values
          restrictions: {
            teams:
              existingConfig.restrictions?.teams
                .map(team => team.slug || '')
                .filter(Boolean) ?? [],
            users:
              existingConfig.restrictions?.users
                .map(user => user.login || '')
                .filter(Boolean) ?? [],
          },
        });
      }
    }
  }
}
