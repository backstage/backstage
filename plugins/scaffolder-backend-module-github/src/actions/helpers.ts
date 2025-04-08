/*
 * Copyright 2022 The Backstage Authors
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

import { Config } from '@backstage/config';
import { assertError, NotFoundError } from '@backstage/errors';
import { Octokit } from 'octokit';

import {
  getRepoSourceDirectory,
  initRepoAndPush,
} from '@backstage/plugin-scaffolder-node';

import Sodium from 'libsodium-wrappers';
import {
  enableBranchProtectionOnDefaultRepoBranch,
  entityRefToName,
} from './gitHelpers';
import { LoggerService } from '@backstage/backend-plugin-api';

export async function createGithubRepoWithCollaboratorsAndTopics(
  client: Octokit,
  repo: string,
  owner: string,
  repoVisibility: 'private' | 'internal' | 'public' | undefined,
  description: string | undefined,
  homepage: string | undefined,
  deleteBranchOnMerge: boolean,
  allowMergeCommit: boolean,
  allowSquashMerge: boolean,
  squashMergeCommitTitle: 'PR_TITLE' | 'COMMIT_OR_PR_TITLE' | undefined,
  squashMergeCommitMessage: 'PR_BODY' | 'COMMIT_MESSAGES' | 'BLANK' | undefined,
  allowRebaseMerge: boolean,
  allowAutoMerge: boolean,
  access: string | undefined,
  collaborators:
    | (
        | {
            user: string;
            access: string;
          }
        | {
            team: string;
            access: string;
          }
        | {
            /** @deprecated This field is deprecated in favor of team */
            username: string;
            access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
          }
      )[]
    | undefined,
  hasProjects: boolean | undefined,
  hasWiki: boolean | undefined,
  hasIssues: boolean | undefined,
  topics: string[] | undefined,
  repoVariables: { [key: string]: string } | undefined,
  secrets: { [key: string]: string } | undefined,
  oidcCustomization:
    | {
        useDefault: boolean;
        includeClaimKeys?: string[];
      }
    | undefined,
  customProperties: { [key: string]: string } | undefined,
  subscribe: boolean | undefined,
  logger: LoggerService,
) {
  // eslint-disable-next-line testing-library/no-await-sync-queries
  const user = await client.rest.users.getByUsername({
    username: owner,
  });

  if (access?.startsWith(`${owner}/`)) {
    await validateAccessTeam(client, access);
  }

  const repoCreationPromise =
    user.data.type === 'Organization'
      ? client.rest.repos.createInOrg({
          name: repo,
          org: owner,
          private: repoVisibility === 'private',
          // @ts-ignore https://github.com/octokit/types.ts/issues/522
          visibility: repoVisibility,
          description: description,
          delete_branch_on_merge: deleteBranchOnMerge,
          allow_merge_commit: allowMergeCommit,
          allow_squash_merge: allowSquashMerge,
          squash_merge_commit_title: squashMergeCommitTitle,
          squash_merge_commit_message: squashMergeCommitMessage,
          allow_rebase_merge: allowRebaseMerge,
          allow_auto_merge: allowAutoMerge,
          homepage: homepage,
          has_projects: hasProjects,
          has_wiki: hasWiki,
          has_issues: hasIssues,
          // Custom properties only available on org repos
          custom_properties: customProperties,
        })
      : client.rest.repos.createForAuthenticatedUser({
          name: repo,
          private: repoVisibility === 'private',
          description: description,
          delete_branch_on_merge: deleteBranchOnMerge,
          allow_merge_commit: allowMergeCommit,
          allow_squash_merge: allowSquashMerge,
          squash_merge_commit_title: squashMergeCommitTitle,
          squash_merge_commit_message: squashMergeCommitMessage,
          allow_rebase_merge: allowRebaseMerge,
          allow_auto_merge: allowAutoMerge,
          homepage: homepage,
          has_projects: hasProjects,
          has_wiki: hasWiki,
          has_issues: hasIssues,
        });

  let newRepo;

  try {
    newRepo = (await repoCreationPromise).data;
  } catch (e) {
    assertError(e);
    if (e.message === 'Resource not accessible by integration') {
      logger.warn(
        `The GitHub app or token provided may not have the required permissions to create the ${user.data.type} repository ${owner}/${repo}.`,
      );
    }
    throw new Error(
      `Failed to create the ${user.data.type} repository ${owner}/${repo}, ${e.message}`,
    );
  }

  if (access?.startsWith(`${owner}/`)) {
    const [, team] = access.split('/');
    await client.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org: owner,
      team_slug: team,
      owner,
      repo,
      permission: 'admin',
    });
    // No need to add access if it's the person who owns the personal account
  } else if (access && access !== owner) {
    await client.rest.repos.addCollaborator({
      owner,
      repo,
      username: access,
      permission: 'admin',
    });
  }

  if (collaborators) {
    for (const collaborator of collaborators) {
      try {
        if ('user' in collaborator) {
          await client.rest.repos.addCollaborator({
            owner,
            repo,
            username: entityRefToName(collaborator.user),
            permission: collaborator.access,
          });
        } else if ('team' in collaborator) {
          await client.rest.teams.addOrUpdateRepoPermissionsInOrg({
            org: owner,
            team_slug: entityRefToName(collaborator.team),
            owner,
            repo,
            permission: collaborator.access,
          });
        }
      } catch (e) {
        assertError(e);
        const name = extractCollaboratorName(collaborator);
        logger.warn(
          `Skipping ${collaborator.access} access for ${name}, ${e.message}`,
        );
      }
    }
  }

  if (topics) {
    try {
      await client.rest.repos.replaceAllTopics({
        owner,
        repo,
        names: topics.map(t => t.toLowerCase()),
      });
    } catch (e) {
      assertError(e);
      logger.warn(`Skipping topics ${topics.join(' ')}, ${e.message}`);
    }
  }

  for (const [key, value] of Object.entries(repoVariables ?? {})) {
    await client.rest.actions.createRepoVariable({
      owner,
      repo,
      name: key,
      value: value,
    });
  }

  if (secrets) {
    const publicKeyResponse = await client.rest.actions.getRepoPublicKey({
      owner,
      repo,
    });

    await Sodium.ready;
    const binaryKey = Sodium.from_base64(
      publicKeyResponse.data.key,
      Sodium.base64_variants.ORIGINAL,
    );
    for (const [key, value] of Object.entries(secrets)) {
      const binarySecret = Sodium.from_string(value);
      const encryptedBinarySecret = Sodium.crypto_box_seal(
        binarySecret,
        binaryKey,
      );
      const encryptedBase64Secret = Sodium.to_base64(
        encryptedBinarySecret,
        Sodium.base64_variants.ORIGINAL,
      );

      await client.rest.actions.createOrUpdateRepoSecret({
        owner,
        repo,
        secret_name: key,
        encrypted_value: encryptedBase64Secret,
        key_id: publicKeyResponse.data.key_id,
      });
    }
  }

  if (oidcCustomization) {
    await client.request(
      'PUT /repos/{owner}/{repo}/actions/oidc/customization/sub',
      {
        owner,
        repo,
        use_default: oidcCustomization.useDefault,
        include_claim_keys: oidcCustomization.includeClaimKeys,
      },
    );
  }

  if (subscribe) {
    await client.rest.activity.setRepoSubscription({
      subscribed: true,
      ignored: false,
      owner,
      repo,
    });
  }

  return newRepo;
}

export async function initRepoPushAndProtect(
  remoteUrl: string,
  password: string,
  workspacePath: string,
  sourcePath: string | undefined,
  defaultBranch: string,
  protectDefaultBranch: boolean,
  protectEnforceAdmins: boolean,
  owner: string,
  client: Octokit,
  repo: string,
  requireCodeOwnerReviews: boolean,
  bypassPullRequestAllowances:
    | {
        users?: string[];
        teams?: string[];
        apps?: string[];
      }
    | undefined,
  requiredApprovingReviewCount: number,
  restrictions:
    | {
        users: string[];
        teams: string[];
        apps?: string[];
      }
    | undefined,
  requiredStatusCheckContexts: string[],
  requireBranchesToBeUpToDate: boolean,
  requiredConversationResolution: boolean,
  requireLastPushApproval: boolean,
  config: Config,
  logger: any,
  gitCommitMessage?: string,
  gitAuthorName?: string,
  gitAuthorEmail?: string,
  dismissStaleReviews?: boolean,
  requiredCommitSigning?: boolean,
  requiredLinearHistory?: boolean,
): Promise<{ commitHash: string }> {
  const gitAuthorInfo = {
    name: gitAuthorName
      ? gitAuthorName
      : config.getOptionalString('scaffolder.defaultAuthor.name'),
    email: gitAuthorEmail
      ? gitAuthorEmail
      : config.getOptionalString('scaffolder.defaultAuthor.email'),
  };

  const commitMessage =
    getGitCommitMessage(gitCommitMessage, config) || 'initial commit';

  const commitResult = await initRepoAndPush({
    dir: getRepoSourceDirectory(workspacePath, sourcePath),
    remoteUrl,
    defaultBranch,
    auth: {
      username: 'x-access-token',
      password,
    },
    logger,
    commitMessage,
    gitAuthorInfo,
  });

  if (protectDefaultBranch) {
    try {
      await enableBranchProtectionOnDefaultRepoBranch({
        owner,
        client,
        repoName: repo,
        logger,
        defaultBranch,
        bypassPullRequestAllowances,
        requiredApprovingReviewCount,
        restrictions,
        requireCodeOwnerReviews,
        requiredStatusCheckContexts,
        requireBranchesToBeUpToDate,
        requiredConversationResolution,
        requireLastPushApproval,
        enforceAdmins: protectEnforceAdmins,
        dismissStaleReviews: dismissStaleReviews,
        requiredCommitSigning: requiredCommitSigning,
        requiredLinearHistory: requiredLinearHistory,
      });
    } catch (e) {
      assertError(e);
      logger.warn(
        `Skipping: default branch protection on '${repo}', ${e.message}`,
      );
    }
  }

  return { commitHash: commitResult.commitHash };
}

function extractCollaboratorName(
  collaborator: { user: string } | { team: string } | { username: string },
) {
  if ('username' in collaborator) return collaborator.username;
  if ('user' in collaborator) return collaborator.user;
  return collaborator.team;
}

async function validateAccessTeam(client: Octokit, access: string) {
  const [org, team_slug] = access.split('/');
  try {
    // Below rule disabled because of a 'getByName' check for a different library
    // incorrectly triggers here.
    // eslint-disable-next-line testing-library/no-await-sync-queries
    await client.rest.teams.getByName({
      org,
      team_slug,
    });
  } catch (e) {
    if (e.response.data.message === 'Not Found') {
      const message = `Received 'Not Found' from the API; one of org:
        ${org} or team: ${team_slug} was not found within GitHub.`;
      throw new NotFoundError(message);
    }
  }
}

export function getGitCommitMessage(
  gitCommitMessage: string | undefined,
  config: Config,
): string | undefined {
  return gitCommitMessage
    ? gitCommitMessage
    : config.getOptionalString('scaffolder.defaultCommitMessage');
}
