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

import { Git } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { assertError } from '@backstage/errors';
import { spawn, SpawnOptionsWithoutStdio } from 'child_process';
import { Octokit } from 'octokit';
import { PassThrough, Writable } from 'stream';
import { Logger } from 'winston';

/** @public */
export type RunCommandOptions = {
  /** command to run */
  command: string;
  /** arguments to pass the command */
  args: string[];
  /** options to pass to spawn */
  options?: SpawnOptionsWithoutStdio;
  /** stream to capture stdout and stderr output */
  logStream?: Writable;
};

/**
 * Run a command in a sub-process, normally a shell command.
 *
 * @public
 */
export const executeShellCommand = async (options: RunCommandOptions) => {
  const {
    command,
    args,
    options: spawnOptions,
    logStream = new PassThrough(),
  } = options;
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args, spawnOptions);

    process.stdout.on('data', stream => {
      logStream.write(stream);
    });

    process.stderr.on('data', stream => {
      logStream.write(stream);
    });

    process.on('error', error => {
      return reject(error);
    });

    process.on('close', code => {
      if (code !== 0) {
        return reject(
          new Error(`Command ${command} failed, exit code: ${code}`),
        );
      }
      return resolve();
    });
  });
};

export async function initRepoAndPush({
  dir,
  remoteUrl,
  auth,
  logger,
  defaultBranch = 'master',
  commitMessage = 'Initial commit',
  gitAuthorInfo,
}: {
  dir: string;
  remoteUrl: string;
  // For use cases where token has to be used with Basic Auth
  // it has to be provided as password together with a username
  // which may be a fixed value defined by the provider.
  auth: { username: string; password: string } | { token: string };
  logger: Logger;
  defaultBranch?: string;
  commitMessage?: string;
  gitAuthorInfo?: { name?: string; email?: string };
}): Promise<void> {
  const git = Git.fromAuth({
    ...auth,
    logger,
  });

  await git.init({
    dir,
    defaultBranch,
  });

  await git.add({ dir, filepath: '.' });

  // use provided info if possible, otherwise use fallbacks
  const authorInfo = {
    name: gitAuthorInfo?.name ?? 'Scaffolder',
    email: gitAuthorInfo?.email ?? 'scaffolder@backstage.io',
  };

  await git.commit({
    dir,
    message: commitMessage,
    author: authorInfo,
    committer: authorInfo,
  });

  await git.addRemote({
    dir,
    url: remoteUrl,
    remote: 'origin',
  });

  await git.push({
    dir,
    remote: 'origin',
  });
}

export async function commitAndPushRepo({
  dir,
  auth,
  logger,
  commitMessage,
  gitAuthorInfo,
  branch = 'master',
  remoteRef,
}: {
  dir: string;
  // For use cases where token has to be used with Basic Auth
  // it has to be provided as password together with a username
  // which may be a fixed value defined by the provider.
  auth: { username: string; password: string } | { token: string };
  logger: Logger;
  commitMessage: string;
  gitAuthorInfo?: { name?: string; email?: string };
  branch?: string;
  remoteRef?: string;
}): Promise<void> {
  const git = Git.fromAuth({
    ...auth,
    logger,
  });

  await git.fetch({ dir });
  await git.checkout({ dir, ref: branch });
  await git.add({ dir, filepath: '.' });

  // use provided info if possible, otherwise use fallbacks
  const authorInfo = {
    name: gitAuthorInfo?.name ?? 'Scaffolder',
    email: gitAuthorInfo?.email ?? 'scaffolder@backstage.io',
  };

  await git.commit({
    dir,
    message: commitMessage,
    author: authorInfo,
    committer: authorInfo,
  });

  await git.push({
    dir,
    remote: 'origin',
    remoteRef: remoteRef ?? `refs/heads/${branch}`,
  });
}

type BranchProtectionOptions = {
  client: Octokit;
  owner: string;
  repoName: string;
  logger: Logger;
  requireCodeOwnerReviews: boolean;
  requiredStatusCheckContexts?: string[];
  bypassPullRequestAllowances?: {
    users?: string[];
    teams?: string[];
    apps?: string[];
  };
  requiredApprovingReviewCount?: number;
  restrictions?: {
    users: string[];
    teams: string[];
    apps?: string[];
  };
  requireBranchesToBeUpToDate?: boolean;
  requiredConversationResolution?: boolean;
  defaultBranch?: string;
  enforceAdmins?: boolean;
  dismissStaleReviews?: boolean;
  requiredCommitSigning?: boolean;
};

export const enableBranchProtectionOnDefaultRepoBranch = async ({
  repoName,
  client,
  owner,
  logger,
  requireCodeOwnerReviews,
  bypassPullRequestAllowances,
  requiredApprovingReviewCount,
  restrictions,
  requiredStatusCheckContexts = [],
  requireBranchesToBeUpToDate = true,
  requiredConversationResolution = false,
  defaultBranch = 'master',
  enforceAdmins = true,
  dismissStaleReviews = false,
  requiredCommitSigning = false,
}: BranchProtectionOptions): Promise<void> => {
  const tryOnce = async () => {
    try {
      await client.rest.repos.updateBranchProtection({
        mediaType: {
          /**
           * 👇 we need this preview because allowing a custom
           * reviewer count on branch protection is a preview
           * feature
           *
           * More here: https://docs.github.com/en/rest/overview/api-previews#require-multiple-approving-reviews
           */
          previews: ['luke-cage-preview'],
        },
        owner,
        repo: repoName,
        branch: defaultBranch,
        required_status_checks: {
          strict: requireBranchesToBeUpToDate,
          contexts: requiredStatusCheckContexts,
        },
        restrictions: restrictions ?? null,
        enforce_admins: enforceAdmins,
        required_pull_request_reviews: {
          required_approving_review_count: requiredApprovingReviewCount,
          require_code_owner_reviews: requireCodeOwnerReviews,
          bypass_pull_request_allowances: bypassPullRequestAllowances,
          dismiss_stale_reviews: dismissStaleReviews,
        },
        required_conversation_resolution: requiredConversationResolution,
      });

      if (requiredCommitSigning) {
        await client.rest.repos.createCommitSignatureProtection({
          owner,
          repo: repoName,
          branch: defaultBranch,
        });
      }
    } catch (e) {
      assertError(e);
      if (
        e.message.includes(
          'Upgrade to GitHub Pro or make this repository public to enable this feature',
        )
      ) {
        logger.warn(
          'Branch protection was not enabled as it requires GitHub Pro for private repositories',
        );
      } else {
        throw e;
      }
    }
  };

  try {
    await tryOnce();
  } catch (e) {
    if (!e.message.includes('Branch not found')) {
      throw e;
    }

    // GitHub has eventual consistency. Fail silently, wait, and try again.
    await new Promise(resolve => setTimeout(resolve, 600));
    await tryOnce();
  }
};

export function getGitCommitMessage(
  gitCommitMessage: string | undefined,
  config: Config,
): string | undefined {
  return gitCommitMessage
    ? gitCommitMessage
    : config.getOptionalString('scaffolder.defaultCommitMessage');
}
