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

import fs from 'fs-extra';
import path from 'path';
import { parseRepoUrl } from './util';

import {
  GithubCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import { zipObject } from 'lodash';
import { createTemplateAction } from '../../createTemplateAction';
import { Octokit } from '@octokit/rest';
import { InputError, CustomErrorBase } from '@backstage/errors';
import { createPullRequest } from 'octokit-plugin-create-pull-request';
import globby from 'globby';
import { resolveSafeChildPath } from '@backstage/backend-common';

class GithubResponseError extends CustomErrorBase {}

type CreatePullRequestResponse = {
  data: { html_url: string };
};

export interface PullRequestCreator {
  createPullRequest(
    options: createPullRequest.Options,
  ): Promise<CreatePullRequestResponse | null>;
}

export type PullRequestCreatorConstructor = (
  octokit: Octokit,
) => PullRequestCreator;

export type GithubPullRequestActionInput = {
  title: string;
  branchName: string;
  description: string;
  repoUrl: string;
  targetPath?: string;
  sourcePath?: string;
};

export type ClientFactoryInput = {
  integrations: ScmIntegrationRegistry;
  host: string;
  owner: string;
  repo: string;
};

export const defaultClientFactory = async ({
  integrations,
  owner,
  repo,
  host = 'github.com',
}: ClientFactoryInput): Promise<PullRequestCreator> => {
  const integrationConfig = integrations.github.byHost(host)?.config;

  if (!integrationConfig) {
    throw new InputError(`No integration for host ${host}`);
  }

  const credentialsProvider =
    GithubCredentialsProvider.create(integrationConfig);

  if (!credentialsProvider) {
    throw new InputError(
      `No matching credentials for host ${host}, please check your integrations config`,
    );
  }

  const { token } = await credentialsProvider.getCredentials({
    url: `https://${host}/${encodeURIComponent(owner)}/${encodeURIComponent(
      repo,
    )}`,
  });

  if (!token) {
    throw new InputError(
      `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
    );
  }

  const OctokitPR = Octokit.plugin(createPullRequest);

  return new OctokitPR({
    auth: token,
    baseUrl: integrationConfig.apiBaseUrl,
  });
};

interface CreateGithubPullRequestActionOptions {
  integrations: ScmIntegrationRegistry;
  clientFactory?: (input: ClientFactoryInput) => Promise<PullRequestCreator>;
}

export const createPublishGithubPullRequestAction = ({
  integrations,
  clientFactory = defaultClientFactory,
}: CreateGithubPullRequestActionOptions) => {
  return createTemplateAction<GithubPullRequestActionInput>({
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
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        branchName,
        title,
        description,
        targetPath,
        sourcePath,
      } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!owner) {
        throw new InputError(
          `No owner provided for host: ${host}, and repo ${repo}`,
        );
      }

      const client = await clientFactory({ integrations, host, owner, repo });
      const fileRoot = sourcePath
        ? resolveSafeChildPath(ctx.workspacePath, sourcePath)
        : ctx.workspacePath;

      const localFilePaths = await globby(['./**', './**/.*', '!.git'], {
        cwd: fileRoot,
        gitignore: true,
        dot: true,
      });

      const fileContents = await Promise.all(
        localFilePaths.map(filePath => {
          const absPath = path.resolve(fileRoot, filePath);
          const content = fs.readFileSync(absPath).toString();
          const fileStat = fs.statSync(absPath);
          const isExecutable = fileStat.mode === 33277 // aka. 100755;
          // See the properties of tree items
          // in https://docs.github.com/en/rest/reference/git#trees
          const githubTreeItemMode = isExecutable ? '100755' : '100644';
          return {
            encoding: 'utf-8',
            content: content,
            mode: githubTreeItemMode,
          };
        }),
      );

      const repoFilePaths = localFilePaths.map(repoFilePath => {
        return targetPath ? `${targetPath}/${repoFilePath}` : repoFilePath;
      });

      const changes = [
        {
          files: zipObject(
            repoFilePaths,
            fileContents,
          ),
          commit: title,
        },
      ];

      try {
        const response = await client.createPullRequest({
          owner,
          repo,
          title,
          changes,
          body: description,
          head: branchName,
        });

        if (!response) {
          throw new GithubResponseError('null response from Github');
        }

        ctx.output('remoteUrl', response.data.html_url);
      } catch (e) {
        throw new GithubResponseError('Pull request creation failed', e);
      }
    },
  });
};
