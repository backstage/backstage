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
  getBitbucketServerRequestOptions,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';

import { Config } from '@backstage/config';
import { examples } from './bitbucketServer.examples';

const createRepository = async (opts: {
  project: string;
  repo: string;
  description?: string;
  repoVisibility: 'private' | 'public';
  defaultBranch: string;
  authorization: string;
  apiBaseUrl: string;
}) => {
  const {
    project,
    repo,
    description,
    authorization,
    repoVisibility,
    defaultBranch,
    apiBaseUrl,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: description,
      defaultBranch: defaultBranch,
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
 * and publishes it to Bitbucket Server.
 * @public
 */
export function createPublishBitbucketServerAction(options: {
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
    id: 'publish:bitbucketServer',
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Bitbucket Server.',
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
            description: 'Enable LFS for the repository.',
            type: 'boolean',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description:
              'The token to use for authorization to BitBucket Server',
          },
          gitCommitMessage: {
            title: 'Git Commit Message',
            type: 'string',
            description: `Sets the commit message on the repository. The default value is 'initial commit'`,
          },
          gitAuthorName: {
            title: 'Author Name',
            type: 'string',
            description: `Sets the author name for the commit. The default value is 'Scaffolder'`,
          },
          gitAuthorEmail: {
            title: 'Author Email',
            type: 'string',
            description: `Sets the author email for the commit.`,
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
        defaultBranch = 'master',
        repoVisibility = 'private',
        enableLFS = false,
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        signCommit,
      } = ctx.input;

      const { project, repo, host } = parseRepoUrl(repoUrl, integrations);

      if (!project) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing project`,
        );
      }

      const integrationConfig = integrations.bitbucketServer.byHost(host);
      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your integrations config`,
        );
      }

      const token = ctx.input.token ?? integrationConfig.config.token;

      const authConfig = {
        ...integrationConfig.config,
        ...{ token },
      };
      const reqOpts = getBitbucketServerRequestOptions(authConfig);
      const authorization = reqOpts.headers.Authorization;
      if (!authorization) {
        throw new Error(
          `Authorization has not been provided for ${integrationConfig.config.host}. Please add either (a) a user login auth token, or (b) a token or (c) username + password to the integration config.`,
        );
      }

      const apiBaseUrl = integrationConfig.config.apiBaseUrl;

      const { remoteUrl, repoContentsUrl } = await createRepository({
        authorization,
        project,
        repo,
        repoVisibility,
        defaultBranch,
        description,
        apiBaseUrl,
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

      const auth = authConfig.token
        ? {
            token: token!,
          }
        : {
            username: authConfig.username!,
            password: authConfig.password!,
          };

      const commitResult = await initRepoAndPush({
        dir: getRepoSourceDirectory(ctx.workspacePath, ctx.input.sourcePath),
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

      if (enableLFS) {
        await performEnableLFS({ authorization, host, project, repo });
      }

      ctx.output('commitHash', commitResult?.commitHash);
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  });
}
