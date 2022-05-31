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
import { parseRepoUrl } from './util';
import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { createTemplateAction } from '../../createTemplateAction';
import { Octokit } from 'octokit';
import { InputError, CustomErrorBase } from '@backstage/errors';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { getOctokitOptions } from '../github/helpers';
import { serializeDirectoryContents } from '../../../../lib/files';

export type Encoding = 'utf-8' | 'base64';

class GithubResponseError extends CustomErrorBase {}

/** @public */
export interface OctokitWithPullRequestPluginClient {
  createPullRequest(options: createPullRequest.Options): Promise<{
    data: {
      html_url: string;
      number: number;
    };
  } | null>;
}

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
  return new OctokitPR(octokitOptions);
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
  clientFactory?: (
    input: CreateGithubPullRequestClientFactoryInput,
  ) => Promise<OctokitWithPullRequestPluginClient>;
}

/**
 * Creates a Github Pull Request action.
 * @public
 */
export const createPublishGithubPullRequestAction = ({
  integrations,
  githubCredentialsProvider,
  clientFactory = defaultClientFactory,
}: CreateGithubPullRequestActionOptions) => {
  return createTemplateAction<{
    title: string;
    branchName: string;
    description: string;
    repoUrl: string;
    draft?: boolean;
    targetPath?: string;
    sourcePath?: string;
    token?: string;
  }>({
    id: 'publish:github:pull-request',
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
        },
      },
      output: {
        required: ['remoteUrl'],
        type: 'object',
        properties: {
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
        title,
        description,
        draft,
        targetPath,
        sourcePath,
        token: providedToken,
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
      const files = Object.fromEntries(
        directoryContents.map(file => [
          targetPath ? path.posix.join(targetPath, file.path) : file.path,
          {
            // See the properties of tree items
            // in https://docs.github.com/en/rest/reference/git#trees
            mode: file.executable ? '100755' : '100644',
            // Always use base64 encoding to avoid doubling a binary file in size
            // due to interpreting a binary file as utf-8 and sending github
            // the utf-8 encoded content.
            //
            // For example, the original gradle-wrapper.jar is 57.8k in https://github.com/kennethzfeng/pull-request-test/pull/5/files.
            // Its size could be doubled to 98.3K (See https://github.com/kennethzfeng/pull-request-test/pull/4/files)
            encoding: 'base64' as const,
            content: file.content.toString('base64'),
          },
        ]),
      );

      try {
        const response = await client.createPullRequest({
          owner,
          repo,
          title,
          changes: [
            {
              files,
              commit: title,
            },
          ],
          body: description,
          head: branchName,
          draft,
        });

        if (!response) {
          throw new GithubResponseError('null response from Github');
        }

        ctx.output('remoteUrl', response.data.html_url);
        ctx.output('pullRequestNumber', response.data.number);
      } catch (e) {
        throw new GithubResponseError('Pull request creation failed', e);
      }
    },
  });
};
