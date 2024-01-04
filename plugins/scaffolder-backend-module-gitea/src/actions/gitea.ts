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

/* NOT USED. See TODO hereafter
const checkGiteaOrgRepo = async (
  config: GiteaIntegrationConfig,
  options: {
    owner?: string;
    repo: string;
    defaultBranch?: string;
  },
): Promise<Response> => {
  const { owner, repo, defaultBranch } = options;
  let response: Response;
  const getOptions: RequestInit = {
    method: 'GET',
    headers: {
      ...getGiteaRequestOptions(config).headers,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `${config.baseUrl}/api/v1/repos/${owner}/${repo}/contents?ref=${defaultBranch}`,
      getOptions,
    );
  } catch (e) {
    throw new Error(
      `Unable to get the repository: ${owner}/${repo} metadata , ${e}`,
    );
  }
  return response;
};
*/

const checkGiteaOrg = async (
  config: GiteaIntegrationConfig,
  options: {
    owner: string;
  },
): Promise<void> => {
  const { owner } = options;
  let response: Response;
  // check first if the org = owner exists
  const getOptions: RequestInit = {
    method: 'GET',
    headers: {
      ...getGiteaRequestOptions(config).headers,
      'Content-Type': 'application/json',
    },
  };
  try {
    response = await fetch(
      `${config.baseUrl}/api/v1/orgs/${owner}`,
      getOptions,
    );
  } catch (e) {
    throw new Error(`Unable to get the Organization: ${owner}, ${e}`);
  }
  if (response.status !== 200) {
    throw new Error(
      `Organization ${owner} do not exist. Please create it first !`,
    );
  }
};

const createGiteaProject = async (
  config: GiteaIntegrationConfig,
  options: {
    projectName: string;
    owner?: string;
    description: string;
  },
): Promise<void> => {
  const { projectName, description, owner } = options;

  /*
    Several options exist to create a repository using either the user or organisation
    User: https://gitea.com/api/swagger#/user/createCurrentUserRepo
    Api: URL/api/v1/user/repos
    Remark: The user is the username defined part of the backstage integration config for the gitea URL !

    Org: https://gitea.com/api/swagger#/organization/createOrgRepo
    Api: URL/api/v1/orgs/${org_owner}/repos
    This is the default scenario that we support currently
  */
  let response: Response;

  const postOptions: RequestInit = {
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
  try {
    response = await fetch(
      `${config.baseUrl}/api/v1/orgs/${owner}/repos`,
      postOptions,
    );
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

      const sleep = (ms: number | undefined) =>
        new Promise(r => setTimeout(r, ms));

      const { repo, host, owner } = parseRepoUrl(repoUrl, integrations);

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

      // check if the org exists within the gitea server
      if (owner) {
        await checkGiteaOrg(integrationConfig.config, { owner });
      }

      await createGiteaProject(integrationConfig.config, {
        description,
        owner: owner,
        projectName: repo,
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
      // The owner to be used should be either the org name or user authenticated with the gitea server
      const remoteUrl = `${integrationConfig.config.baseUrl}/${owner}/${repo}.git`;
      const commitResult = await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, sourcePath),
        remoteUrl,
        auth,
        defaultBranch,
        logger: ctx.logger,
        commitMessage: generateCommitMessage(config, gitCommitMessage),
        gitAuthorInfo,
      });

      /*
      TODO: This code is commented till it will be fixed.
      When we use the code hereafter, we got the following error:
      "Unable to read url, Error: Unknown encoding: undefined\n    at DefaultLocationService.processEntities"
      as commented here: Still getting the error: https://github.com/backstage/backstage/pull/21890#issuecomment-1876733870

      Such an issue do not exist using sleep 3s.

      WARNING: To allow to register within the catalog the new project, it is also needed to pass within the catalogInfoPath the branch name (e.g: main/catalog-info.yaml)

      // Check if the repo is available
      let response: Response;
      response = await checkGiteaOrgRepo(integrationConfig.config, {
        owner,
        repo,
        defaultBranch,
      });
      while (response.status !== 200) {
        await sleep(1000);
        response = await checkGiteaOrgRepo(integrationConfig.config, {
          owner,
          repo,
          defaultBranch,
        });
      }
      */
      await sleep(3000);

      const repoContentsUrl = `${integrationConfig.config.baseUrl}/${owner}/${repo}/src/branch/${defaultBranch}/`;
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('commitHash', commitResult?.commitHash);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
