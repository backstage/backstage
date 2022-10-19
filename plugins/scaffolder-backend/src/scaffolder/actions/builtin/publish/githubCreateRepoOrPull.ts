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
import { resolveSafeChildPath } from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { CustomErrorBase, InputError } from '@backstage/errors';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { Octokit } from 'octokit';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import path from 'path';
import {
  SerializedFile,
  serializeDirectoryContents,
} from '../../../../lib/files';
import { createTemplateAction } from '../../createTemplateAction';
import {
  createGithubRepoWithCollaboratorsAndTopics,
  getOctokitOptions,
  initRepoPushAndProtect,
} from '../github/helpers';
import * as inputProps from '../github/inputProperties';
import * as outputProps from '../github/outputProperties';
import { parseRepoUrl } from './util';

class GithubResponseError extends CustomErrorBase {}

/** @public */
export type OctokitWithPullRequestPluginClient = Octokit & {
  createPullRequest(options: createPullRequest.Options): Promise<{
    data: {
      html_url: string;
      number: number;
    };
  } | null>;
};

/**
 * The options passed to the client factory function.
 * @public
 */
export type CreateGithubPullRequestClientFactoryInput = {
  integrations: ScmIntegrationRegistry;
  githubCredentialsProvider?: GithubCredentialsProvider;
  host: string;
  owner: string;
  repo: string;
  token?: string;
};

type GithubPullRequest = {
  owner: string;
  repo: string;
  number: number;
};

export const defaultClientFactory = async ({
  integrations,
  githubCredentialsProvider,
  owner,
  repo,
  host = 'github.com',
  token: providedToken,
}: CreateGithubPullRequestClientFactoryInput): Promise<OctokitWithPullRequestPluginClient> => {
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
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to GitHub.
 *
 * @public
 */
export function createPublishGithubAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
  githubCredentialsProvider?: GithubCredentialsProvider;
}) {
  const { integrations, config, githubCredentialsProvider } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    homepage?: string;
    access?: string;
    defaultBranch?: string;
    protectDefaultBranch?: boolean;
    protectEnforceAdmins?: boolean;
    deleteBranchOnMerge?: boolean;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    allowRebaseMerge?: boolean;
    allowSquashMerge?: boolean;
    allowMergeCommit?: boolean;
    allowAutoMerge?: boolean;
    sourcePath?: string;
    requireCodeOwnerReviews?: boolean;
    requiredStatusCheckContexts?: string[];
    repoVisibility?: 'private' | 'internal' | 'public';
    collaborators?: Array<
      | {
          user: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          team: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
      | {
          /** @deprecated This field is deprecated in favor of team */
          username: string;
          access: 'pull' | 'push' | 'admin' | 'maintain' | 'triage';
        }
    >;
    token?: string;
    topics?: string[];
  }>({
    id: 'publish:github',
    description:
      'Initializes a git repository of contents in workspace and publishes it to GitHub.',
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: inputProps.repoUrl,
          description: inputProps.description,
          homepage: inputProps.homepage,
          access: inputProps.access,
          requireCodeOwnerReviews: inputProps.requireCodeOwnerReviews,
          requiredStatusCheckContexts: inputProps.requiredStatusCheckContexts,
          repoVisibility: inputProps.repoVisibility,
          defaultBranch: inputProps.defaultBranch,
          protectDefaultBranch: inputProps.protectDefaultBranch,
          protectEnforceAdmins: inputProps.protectEnforceAdmins,
          deleteBranchOnMerge: inputProps.deleteBranchOnMerge,
          gitCommitMessage: inputProps.gitCommitMessage,
          gitAuthorName: inputProps.gitAuthorName,
          gitAuthorEmail: inputProps.gitAuthorEmail,
          allowMergeCommit: inputProps.allowMergeCommit,
          allowSquashMerge: inputProps.allowSquashMerge,
          allowRebaseMerge: inputProps.allowRebaseMerge,
          allowAutoMerge: inputProps.allowAutoMerge,
          sourcePath: inputProps.sourcePath,
          collaborators: inputProps.collaborators,
          token: inputProps.token,
          topics: inputProps.topics,
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: outputProps.remoteUrl,
          repoContentsUrl: outputProps.repoContentsUrl,
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        homepage,
        access,
        requireCodeOwnerReviews = false,
        requiredStatusCheckContexts = [],
        repoVisibility = 'private',
        defaultBranch = 'master',
        protectDefaultBranch = true,
        protectEnforceAdmins = true,
        deleteBranchOnMerge = false,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        allowMergeCommit = true,
        allowSquashMerge = true,
        allowRebaseMerge = true,
        allowAutoMerge = false,
        collaborators,
        topics,
        token: providedToken,
        sourcePath,
      } = ctx.input;

      const octokitOptions = await getOctokitOptions({
        integrations,
        credentialsProvider: githubCredentialsProvider,
        token: providedToken,
        repoUrl: repoUrl,
      });

      let client = new Octokit(octokitOptions);

      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError('Invalid repository owner provided in repoUrl');
      }

      let doesRepoAlreadyExists = true;

      try {
        await client.request(`GET /repos/{owner}/{repo}`, {
          owner: owner || '',
          repo: repo || '',
        });
      } catch (error) {
        if (error.status === 404) doesRepoAlreadyExists = false;
      }

      if (doesRepoAlreadyExists) {
        // if repo already exist create a new pull request
        client = await defaultClientFactory({
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

        const targetPath = '';

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

        const newBranchName = 'new-template';

        try {
          const response = await client.createPullRequest({
            owner,
            repo,
            title: 'new scaffolding template',
            changes: [
              {
                files,
                commit: 'new scaffolding template',
              },
            ],
            body: description,
            head: newBranchName,
            draft: false,
          });

          if (!response) {
            throw new GithubResponseError('null response from Github');
          }
          
          ctx.output('remoteUrl', `${host}/${owner}/${repo}.git`);
          ctx.output('repoContentsUrl', `${host}/${owner}/${repo}/blob/master`);
          return;
        } catch (e) {
          throw new GithubResponseError('Pull request creation failed', e);
        }
      }

      const newRepo = await createGithubRepoWithCollaboratorsAndTopics(
        client,
        repo,
        owner,
        repoVisibility,
        description,
        homepage,
        deleteBranchOnMerge,
        allowMergeCommit,
        allowSquashMerge,
        allowRebaseMerge,
        allowAutoMerge,
        access,
        collaborators,
        topics,
        ctx.logger,
      );

      const remoteUrl = newRepo.clone_url;
      const repoContentsUrl = `${newRepo.html_url}/blob/${defaultBranch}`;

      await initRepoPushAndProtect(
        remoteUrl,
        octokitOptions.auth,
        ctx.workspacePath,
        ctx.input.sourcePath,
        defaultBranch,
        protectDefaultBranch,
        protectEnforceAdmins,
        owner,
        client,
        repo,
        requireCodeOwnerReviews,
        requiredStatusCheckContexts,
        config,
        ctx.logger,
        gitCommitMessage,
        gitAuthorName,
        gitAuthorEmail,
      );

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
