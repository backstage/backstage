/*
 * Copyright 2023 The Backstage Authors
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

import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import {
  getGiteaRequestOptions,
  GiteaIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './gitea.examples';
import fetch, { RequestInit, Response } from 'node-fetch';
import crypto from 'crypto';

const createGiteaProject = async (
  config: GiteaIntegrationConfig,
  options: {
    projectName: string;
    // parent: string;
    owner?: string;
    description: string;
  },
): Promise<void> => {
  const { projectName, owner, description } = options;

  const fetchOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      description,
    }),
    headers: {
      ...getGiteaRequestOptions(config).headers,
      'Content-Type': 'application/json',
    },
  };

  // TODO
  // Create a repository in Gitea
  // API request: https://gitea.com/api/swagger#/user/createCurrentUserRepo
  let response: Response;
  try {
    response = await fetch(`${config.baseUrl}/api/v1/user/repos`, fetchOptions);
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }
  if (response.status !== 201) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }
};

const generateCommitMessage = (
  config: Config,
  commitSubject?: string,
): string => {
  const changeId = crypto.randomBytes(20).toString('hex');
  const msg = `${
    config.getOptionalString('scaffolder.defaultCommitMessage') || commitSubject
  }\n\nChange-Id: I${changeId}`;
  return msg;
};

/**
 * Creates a new action that initializes a git repository using the content of the workspace.
 * and publishes it to a Gitea instance.
 * @public
 */
export function createPublishGiteaAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description: string;
    defaultBranch?: string;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    sourcePath?: string;
  }>({
    id: 'publish:gitea',
    description:
      'Initializes a git repository using the content of the workspace, and publishes it to Gitea.',
    examples,
    schema: {
      input: {
        type: 'object',
        required: ['repoUrl'],
        properties: {
          repoUrl: {
            title: 'Repository Location',
            type: 'string',
          },
          description: {
            title: 'Repository Description',
            type: 'string',
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'main'`,
          },
          gitCommitMessage: {
            title: 'Git Commit Message',
            type: 'string',
            description: `Sets the commit message on the repository. The default value is 'initial commit'`,
          },
          gitAuthorName: {
            title: 'Default Author Name',
            type: 'string',
            description: `Sets the default author name for the commit. The default value is 'Scaffolder'`,
          },
          gitAuthorEmail: {
            title: 'Default Author Email',
            type: 'string',
            description: `Sets the default author email for the commit.`,
          },
          sourcePath: {
            title: 'Source Path',
            type: 'string',
            description: `Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.`,
          },
        },
      },
      output: {
        type: 'object',
        properties: {
          remoteUrl: {
            title: 'A URL to the repository with the provider',
            type: 'string',
          },
          repoContentsUrl: {
            title: 'A URL to the root of the repository',
            type: 'string',
          },
          commitHash: {
            title: 'The git commit hash of the initial commit',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        repoUrl,
        description,
        defaultBranch = 'main',
        gitAuthorName,
        gitAuthorEmail,
        gitCommitMessage = 'initial commit',
        sourcePath,
      } = ctx.input;

      const { owner, repo, host } = parseRepoUrl(repoUrl, integrations);

      const integrationConfig = integrations.gitea.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      if (
        !integrationConfig.config.username ||
        !integrationConfig.config.password
      ) {
        throw new Error(
          'Credentials for Gitea integration required for this action.',
        );
      }

      // TODO
      // Check if the integration config includes a baseUrl

      await createGiteaProject(integrationConfig.config, {
        description,
        owner: owner,
        projectName: repo,
        // parent: workspace,
      });

      const auth = {
        username: integrationConfig.config.username!,
        password: integrationConfig.config.password!,
      };
      const gitAuthorInfo = {
        name: gitAuthorName
          ? gitAuthorName
          : config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: gitAuthorEmail
          ? gitAuthorEmail
          : config.getOptionalString('scaffolder.defaultAuthor.email'),
      };
      // TODO
      const remoteUrl = `${integrationConfig.config.baseUrl}/api/v1/user/${repo}`;
      const commitResult = await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, sourcePath),
        remoteUrl,
        auth,
        defaultBranch,
        logger: ctx.logger,
        commitMessage: generateCommitMessage(config, gitCommitMessage),
        gitAuthorInfo,
      });

      const repoContentsUrl = `${integrationConfig.config.baseUrl}/${repo}/+/refs/heads/${defaultBranch}`;
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('commitHash', commitResult?.commitHash);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
