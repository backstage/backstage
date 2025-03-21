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

import { InputError } from '@backstage/errors';
import {
  BitbucketIntegrationConfig,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { Config } from '@backstage/config';
import { examples } from './bitbucket.examples';

const createBitbucketCloudRepository = async (opts: {
  workspace: string;
  project: string;
  repo: string;
  description?: string;
  repoVisibility: 'private' | 'public';
  mainBranch: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    workspace,
    project,
    repo,
    description,
    repoVisibility,
    mainBranch,
    authorization,
    apiBaseUrl,
  } = opts;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
      project: { key: project },
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  let response: Response;
  try {
    response = await fetch(
      `${apiBaseUrl}/repositories/${workspace}/${repo}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }

  if (response.status !== 200) {
    throw new Error(
      `Unable to create repository, ${response.status} ${
        response.statusText
      }, ${await response.text()}`,
    );
  }

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'https') {
      remoteUrl = link.href;
    }
  }

  // "mainbranch.name" cannot be set neither at create nor update of the repo
  // the first pushed branch will be set as "main branch" then
  const repoContentsUrl = `${r.links.html.href}/src/${mainBranch}`;
  return { remoteUrl, repoContentsUrl };
};

const createBitbucketServerRepository = async (opts: {
  project: string;
  repo: string;
  description?: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    project,
    repo,
    description,
    authorization,
    repoVisibility,
    apiBaseUrl,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: description,
      public: repoVisibility === 'public',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(`${apiBaseUrl}/projects/${project}/repos`, options);
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

  const r = await response.json();
  let remoteUrl = '';
  for (const link of r.links.clone) {
    if (link.name === 'http') {
      remoteUrl = link.href;
    }
  }

  const repoContentsUrl = `${r.links.self[0].href}`;
  return { remoteUrl, repoContentsUrl };
};

const getAuthorizationHeader = (config: BitbucketIntegrationConfig) => {
  if (config.username && config.appPassword) {
    const buffer = Buffer.from(
      `${config.username}:${config.appPassword}`,
      'utf8',
    );

    return `Basic ${buffer.toString('base64')}`;
  }

  if (config.token) {
    return `Bearer ${config.token}`;
  }

  throw new Error(
    `Authorization has not been provided for Bitbucket. Please add either username + appPassword or token to the Integrations config`,
  );
};

const performEnableLFS = async (opts: {
  authorization: string;
  host: string;
  project: string;
  repo: string;
}) => {
  const { authorization, host, project, repo } = opts;

  const options: RequestInit = {
    method: 'PUT',
    headers: {
      Authorization: authorization,
    },
  };

  const { ok, status, statusText } = await fetch(
    `https://${host}/rest/git-lfs/admin/projects/${project}/repos/${repo}/enabled`,
    options,
  );

  if (!ok)
    throw new Error(
      `Failed to enable LFS in the repository, ${status}: ${statusText}`,
    );
};

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Bitbucket.
 * @public
 * @deprecated in favor of "createPublishBitbucketCloudAction" by \@backstage/plugin-scaffolder-backend-module-bitbucket-cloud and "createPublishBitbucketServerAction" by \@backstage/plugin-scaffolder-backend-module-bitbucket-server
 */
export function createPublishBitbucketAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    defaultBranch?: string;
    repoVisibility?: 'private' | 'public';
    sourcePath?: string;
    enableLFS?: boolean;
    token?: string;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    signCommit?: boolean;
  }>({
    id: 'publish:bitbucket',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Bitbucket.',
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
          repoVisibility: {
            title: 'Repository Visibility',
            type: 'string',
            enum: ['private', 'public'],
          },
          defaultBranch: {
            title: 'Default Branch',
            type: 'string',
            description: `Sets the default branch on the repository. The default value is 'master'`,
          },
          sourcePath: {
            title: 'Source Path',
            description:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          enableLFS: {
            title: 'Enable LFS?',
            description:
              'Enable LFS for the repository. Only available for hosted Bitbucket.',
            type: 'boolean',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to BitBucket',
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
      ctx.logger.warn(
        `[Deprecated] Please migrate the use of action "publish:bitbucket" to "publish:bitbucketCloud" or "publish:bitbucketServer".`,
      );
      const {
        repoUrl,
        description,
        defaultBranch = 'master',
        repoVisibility = 'private',
        enableLFS = false,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        signCommit,
      } = ctx.input;

      const { workspace, project, repo, host } = parseRepoUrl(
        repoUrl,
        integrations,
      );

      // Workspace is only required for bitbucket cloud
      if (host === 'bitbucket.org') {
        if (!workspace) {
          throw new InputError(
            `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing workspace`,
          );
        }
      }

      // Project is required for both bitbucket cloud and bitbucket server
      if (!project) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing project`,
        );
      }

      const integrationConfig = integrations.bitbucket.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(
        ctx.input.token
          ? {
              host: integrationConfig.config.host,
              apiBaseUrl: integrationConfig.config.apiBaseUrl,
              token: ctx.input.token,
            }
          : integrationConfig.config,
      );

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      const createMethod =
        host === 'bitbucket.org'
          ? createBitbucketCloudRepository
          : createBitbucketServerRepository;

      const { remoteUrl, repoContentsUrl } = await ctx.checkpoint({
        key: `create.repo.${host}.${repo}`,
        fn: async () =>
          createMethod({
            authorization,
            workspace: workspace || '',
            project,
            repo,
            repoVisibility,
            mainBranch: defaultBranch,
            description,
            apiBaseUrl,
          }),
      });

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

      let auth;

      if (ctx.input.token) {
        auth = {
          username: 'x-token-auth',
          password: ctx.input.token,
        };
      } else {
        auth = {
          username: integrationConfig.config.username
            ? integrationConfig.config.username
            : 'x-token-auth',
          password: integrationConfig.config.appPassword
            ? integrationConfig.config.appPassword
            : integrationConfig.config.token ?? '',
        };
      }

      const commitHash = await ctx.checkpoint({
        key: `init.repo.and.push${host}.${repo}`,
        fn: async () => {
          const commitResult = await initRepoAndPush({
            dir: getRepoSourceDirectory(
              ctx.workspacePath,
              ctx.input.sourcePath,
            ),
            remoteUrl,
            auth,
            defaultBranch,
            logger: ctx.logger,
            commitMessage: gitCommitMessage
              ? gitCommitMessage
              : config.getOptionalString('scaffolder.defaultCommitMessage'),
            gitAuthorInfo,
            signingKey: signCommit ? signingKey : undefined,
          });
          return commitResult?.commitHash;
        },
      });

      if (enableLFS && host !== 'bitbucket.org') {
        await performEnableLFS({ authorization, host, project, repo });
      }

      ctx.output('commitHash', commitHash);
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
