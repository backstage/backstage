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
  ActionContext,
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { examples } from './gitea.examples';
import crypto from 'crypto';

const checkGiteaContentUrl = async (
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
  };

  try {
    response = await fetch(
      `${config.baseUrl}/${owner}/${repo}/src/branch/${defaultBranch}`,
      getOptions,
    );
  } catch (e) {
    throw new Error(
      `Unable to get the repository: ${owner}/${repo} metadata , ${e}`,
    );
  }
  return response;
};

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
    throw new Error(
      `Unable to get the Organization: ${owner}; Error cause: ${e.message}, code: ${e.cause.code}`,
    );
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
    repoVisibility?: string;
    description: string;
  },
): Promise<void> => {
  const { projectName, description, owner, repoVisibility } = options;

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
  let isPrivate: boolean;

  if (repoVisibility === 'private') {
    isPrivate = true;
  } else if (repoVisibility === 'public') {
    isPrivate = false;
  } else {
    // Provide a default value if repoVisibility is neither "private" nor "public"
    isPrivate = false;
  }

  const postOptions: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: projectName,
      description,
      private: isPrivate,
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

async function checkAvailabilityGiteaRepository(
  maxDuration: number,
  integrationConfig: GiteaIntegrationConfig,
  options: {
    owner?: string;
    repo: string;
    defaultBranch: string;
    ctx: ActionContext<any>;
  },
) {
  const startTimestamp = Date.now();

  const { owner, repo, defaultBranch, ctx } = options;
  const sleep = (ms: number | undefined) => new Promise(r => setTimeout(r, ms));
  let response: Response;

  while (Date.now() - startTimestamp < maxDuration) {
    if (ctx.signal?.aborted) return;

    response = await checkGiteaContentUrl(integrationConfig, {
      owner,
      repo,
      defaultBranch,
    });

    if (response.status !== 200) {
      // Repository is not yet available/accessible ...
      await sleep(1000);
    } else {
      // Gitea repository exists !
      break;
    }
  }
}

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
    repoVisibility?: 'private' | 'public';
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    sourcePath?: string;
    signCommit?: boolean;
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
          repoVisibility: {
            title: 'Repository Visibility',
            description: `Sets the visibility of the repository. The default value is 'public'.`,
            type: 'string',
            enum: ['private', 'public'],
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
          signCommit: {
            title: 'Sign commit',
            type: 'boolean',
            description: 'Sign commit with configured PGP private key',
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
        repoVisibility = 'public',
        gitAuthorName,
        gitAuthorEmail,
        gitCommitMessage = 'initial commit',
        sourcePath,
        signCommit,
      } = ctx.input;

      const { repo, host, owner } = parseRepoUrl(repoUrl, integrations);

      const integrationConfig = integrations.gitea.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }
      const { username, password } = integrationConfig.config;

      if (!username || !password) {
        throw new Error('Credentials for the gitea ${host} required.');
      }

      // check if the org exists within the gitea server
      if (owner) {
        await checkGiteaOrg(integrationConfig.config, { owner });
      }

      await createGiteaProject(integrationConfig.config, {
        description,
        repoVisibility,
        owner: owner,
        projectName: repo,
      });

      const auth = {
        username: username,
        password: password,
      };
      const gitAuthorInfo = {
        name: gitAuthorName
          ? gitAuthorName
          : config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: gitAuthorEmail
          ? gitAuthorEmail
          : config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      const signingKey =
        integrationConfig.config.commitSigningKey ??
        config.getOptionalString('scaffolder.defaultCommitSigningKey');
      if (signCommit && !signingKey) {
        throw new Error(
          'Signing commits is enabled but no signing key is provided in the configuration',
        );
      }

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

      // Check if the gitea repo URL is available before to exit
      const maxDuration = 20000; // 20 seconds
      await checkAvailabilityGiteaRepository(
        maxDuration,
        integrationConfig.config,
        {
          owner,
          repo,
          defaultBranch,
          ctx,
        },
      );

      const repoContentsUrl = `${integrationConfig.config.baseUrl}/${owner}/${repo}/src/branch/${defaultBranch}/`;
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('commitHash', commitResult?.commitHash);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
