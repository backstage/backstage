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

import { spawn } from 'child_process';
import { PassThrough, Writable } from 'stream';
import { Logger } from 'winston';
import { Git } from '@backstage/backend-common';
import { Octokit } from '@octokit/rest';

export type RunCommandOptions = {
  command: string;
  args: string[];
  logStream?: Writable;
};

export const runCommand = async ({
  command,
  args,
  logStream = new PassThrough(),
}: RunCommandOptions) => {
  await new Promise<void>((resolve, reject) => {
    const process = spawn(command, args);

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
        return reject(`Command ${command} failed, exit code: ${code}`);
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
  auth: { username: string; password: string };
  logger: Logger;
  defaultBranch?: string;
  commitMessage?: string;
  gitAuthorInfo?: { name?: string; email?: string };
}): Promise<void> {
  const git = Git.fromAuth({
    username: auth.username,
    password: auth.password,
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

type BranchProtectionOptions = {
  client: Octokit;
  owner: string;
  repoName: string;
  logger: Logger;
  requireCodeOwnerReviews: boolean;
  defaultBranch?: string;
};

export const enableBranchProtectionOnDefaultRepoBranch = async ({
  repoName,
  client,
  owner,
  logger,
  requireCodeOwnerReviews,
  defaultBranch = 'master',
}: BranchProtectionOptions): Promise<void> => {
  const tryOnce = async () => {
    try {
      await client.repos.updateBranchProtection({
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
        required_status_checks: { strict: true, contexts: [] },
        restrictions: null,
        enforce_admins: true,
        required_pull_request_reviews: {
          required_approving_review_count: 1,
          require_code_owner_reviews: requireCodeOwnerReviews,
        },
      });
    } catch (e) {
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
