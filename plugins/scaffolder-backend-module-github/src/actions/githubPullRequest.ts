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

import path from 'path';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  parseRepoUrl,
  SerializedFile,
  serializeDirectoryContents,
} from '@backstage/plugin-scaffolder-node';
import { Octokit } from 'octokit';
import { InputError, CustomErrorBase } from '@backstage/errors';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { getOctokitOptions } from './helpers';
import { Logger } from 'winston';
import { examples } from './githubPullRequest.examples';

export type Encoding = 'utf-8' | 'base64';

class GithubResponseError extends CustomErrorBase {}

export const defaultClientFactory: CreateGithubPullRequestActionOptions['clientFactory'] =
  async ({
    integrations,
    githubCredentialsProvider,
    owner,
    repo,
    host = 'github.com',
    token: providedToken,
  }) => {
    const [encodedHost, encodedOwner, encodedRepo] = [host, owner, repo].map(
      encodeURIComponent,
    );

    const octokitOptions = await getOctokitOptions({
      integrations,
      credentialsProvider: githubCredentialsProvider,
      repoUrl: `${encodedHost}?owner=${encodedOwner}&repo=${encodedRepo}`,
      token: providedToken,
    });

    const OctokitPR = Octokit.plugin(createPullRequest);
    return new OctokitPR({
      ...octokitOptions,
      ...{ throttle: { enabled: false } },
    });
  };

/**
 * The options passed to {@link createPublishGithubPullRequestAction} method
 * @public
 */
export interface CreateGithubPullRequestActionOptions {
  /**
   * An instance of {@link @backstage/integration#ScmIntegrationRegistry} that will be used in the action.
   */
  integrations: ScmIntegrationRegistry;
  /**
   * An instance of {@link @backstage/integration#GithubCredentialsProvider} that will be used to get credentials for the action.
   */
  githubCredentialsProvider?: GithubCredentialsProvider;
  /**
   * A method to return the Octokit client with the Pull Request Plugin.
   */
  clientFactory?: (input: {
    integrations: ScmIntegrationRegistry;
    githubCredentialsProvider?: GithubCredentialsProvider;
    host: string;
    owner: string;
    repo: string;
    token?: string;
  }) => Promise<
    Octokit & {
      createPullRequest(options: createPullRequest.Options): Promise<{
        data: {
          html_url: string;
          number: number;
          base: {
            ref: string;
          };
        };
      } | null>;
    }
  >;
}

type GithubPullRequest = {
  owner: string;
  repo: string;
  number: number;
};

/**
 * Creates a Github Pull Request action.
 * @public
 */
export const createPublishGithubPullRequestAction = (
  options: CreateGithubPullRequestActionOptions,
) => {
  const {
    integrations,
    githubCredentialsProvider,
    clientFactory = defaultClientFactory,
  } = options;

  return createTemplateAction<{
    title: string;
    branchName: string;
    targetBranchName?: string;
    description: string;
    repoUrl: string;
    draft?: boolean;
    targetPath?: string;
    sourcePath?: string;
    token?: string;
    reviewers?: string[];
    teamReviewers?: string[];
    commitMessage?: string;
    update?: boolean;
    forceFork?: boolean;
  }>({
    id: 'publish:github:pull-request',
    examples,
    schema: {
      input: {
        required: ['repoUrl', 'title', 'description', 'branchName'],
        type: 'object',
        properties: {
          repoUrl: {
            title: 'Repository Location',
            description: `Accepts the format 'github.com?repo=reponame&owner=owner' where 'reponame' is the repository name and 'owner' is an organization or username`,
            type: 'string',
          },
          branchName: {
            type: 'string',
            title: 'Branch Name',
            description: 'The name for the branch',
          },
          targetBranchName: {
            type: 'string',
            title: 'Target Branch Name',
            description: 'The target branch name of the merge request',
          },
          title: {
            type: 'string',
            title: 'Pull Request Name',
            description: 'The name for the pull request',
          },
          description: {
            type: 'string',
            title: 'Pull Request Description',
            description: 'The description of the pull request',
          },
          draft: {
            type: 'boolean',
            title: 'Create as Draft',
            description: 'Create a draft pull request',
          },
          sourcePath: {
            type: 'string',
            title: 'Working Subdirectory',
            description:
              'Subdirectory of working directory to copy changes from',
          },
          targetPath: {
            type: 'string',
            title: 'Repository Subdirectory',
            description: 'Subdirectory of repository to apply changes to',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to GitHub',
          },
          reviewers: {
            title: 'Pull Request Reviewers',
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'The users that will be added as reviewers to the pull request',
          },
          teamReviewers: {
            title: 'Pull Request Team Reviewers',
            type: 'array',
            items: {
              type: 'string',
            },
            description:
              'The teams that will be added as reviewers to the pull request',
          },
          commitMessage: {
            type: 'string',
            title: 'Commit Message',
            description: 'The commit message for the pull request commit',
          },
          update: {
            type: 'boolean',
            title: 'Update',
            description: 'Update pull request if already exists',
          },
          forceFork: {
            type: 'boolean',
            title: 'Force Fork',
            description: 'Create pull request from a fork',
          },
        },
      },
      output: {
        required: ['remoteUrl'],
        type: 'object',
        properties: {
          targetBranchName: {
            title: 'Target branch name of the merge request',
            type: 'string',
          },
          remoteUrl: {
            type: 'string',
            title: 'Pull Request URL',
            description: 'Link to the pull request in Github',
          },
          pullRequestNumber: {
            type: 'number',
            title: 'Pull Request Number',
            description: 'The pull request number',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        branchName,
        targetBranchName,
        title,
        description,
        draft,
        targetPath,
        sourcePath,
        token: providedToken,
        reviewers,
        teamReviewers,
        commitMessage,
        update,
        forceFork,
      } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(
          `No owner provided for host: ${host}, and repo ${repo}`,
        );
      }

      const client = await clientFactory({
        integrations,
        githubCredentialsProvider,
        host,
        owner,
        repo,
        token: providedToken,
      });

      const fileRoot = sourcePath
        ? resolveSafeChildPath(ctx.workspacePath, sourcePath)
        : ctx.workspacePath;

      const directoryContents = await serializeDirectoryContents(fileRoot, {
        gitignore: true,
      });

      const determineFileMode = (file: SerializedFile): string => {
        if (file.symlink) return '120000';
        if (file.executable) return '100755';
        return '100644';
      };

      const determineFileEncoding = (
        file: SerializedFile,
      ): 'utf-8' | 'base64' => (file.symlink ? 'utf-8' : 'base64');

      const files = Object.fromEntries(
        directoryContents.map(file => [
          targetPath ? path.posix.join(targetPath, file.path) : file.path,
          {
            // See the properties of tree items
            // in https://docs.github.com/en/rest/reference/git#trees
            mode: determineFileMode(file),
            // Always use base64 encoding where possible to avoid doubling a binary file in size
            // due to interpreting a binary file as utf-8 and sending github
            // the utf-8 encoded content. Symlinks are kept as utf-8 to avoid them
            // being formatted as a series of scrambled characters
            //
            // For example, the original gradle-wrapper.jar is 57.8k in https://github.com/kennethzfeng/pull-request-test/pull/5/files.
            // Its size could be doubled to 98.3K (See https://github.com/kennethzfeng/pull-request-test/pull/4/files)
            encoding: determineFileEncoding(file),
            content: file.content.toString(determineFileEncoding(file)),
          },
        ]),
      );

      try {
        const createOptions: createPullRequest.Options = {
          owner,
          repo,
          title,
          changes: [
            {
              files,
              commit: commitMessage ?? title,
            },
          ],
          body: description,
          head: branchName,
          draft,
          update,
          forceFork,
        };
        if (targetBranchName) {
          createOptions.base = targetBranchName;
        }
        const response = await client.createPullRequest(createOptions);

        if (!response) {
          throw new GithubResponseError('null response from Github');
        }

        const pullRequestNumber = response.data.number;
        if (reviewers || teamReviewers) {
          const pullRequest = { owner, repo, number: pullRequestNumber };
          await requestReviewersOnPullRequest(
            pullRequest,
            reviewers,
            teamReviewers,
            client,
            ctx.logger,
          );
        }

        const targetBranch = response.data.base.ref;
        ctx.output('targetBranchName', targetBranch);
        ctx.output('remoteUrl', response.data.html_url);
        ctx.output('pullRequestNumber', pullRequestNumber);
      } catch (e) {
        throw new GithubResponseError('Pull request creation failed', e);
      }
    },
  });

  async function requestReviewersOnPullRequest(
    pr: GithubPullRequest,
    reviewers: string[] | undefined,
    teamReviewers: string[] | undefined,
    client: Octokit,
    logger: Logger,
  ) {
    try {
      const result = await client.rest.pulls.requestReviewers({
        owner: pr.owner,
        repo: pr.repo,
        pull_number: pr.number,
        reviewers,
        team_reviewers: teamReviewers ? [...new Set(teamReviewers)] : undefined,
      });
      const addedUsers = result.data.requested_reviewers?.join(', ') ?? '';
      const addedTeams = result.data.requested_teams?.join(', ') ?? '';
      logger.info(
        `Added users [${addedUsers}] and teams [${addedTeams}] as reviewers to Pull request ${pr.number}`,
      );
    } catch (e) {
      logger.error(
        `Failure when adding reviewers to Pull request ${pr.number}`,
        e,
      );
    }
  }
};
