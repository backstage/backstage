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
  DefaultAzureDevOpsCredentialsProvider,
  ScmIntegrationRegistry,
} from '@backstage/integration';
import {
  createTemplateAction,
  getRepoSourceDirectory,
  initRepoAndPush,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { GitRepositoryCreateOptions } from 'azure-devops-node-api/interfaces/GitInterfaces';
import {
  getBearerHandler,
  getPersonalAccessTokenHandler,
  WebApi,
} from 'azure-devops-node-api';
import { Config } from '@backstage/config';
import { examples } from './azure.examples';

/**
 * Creates a new action that initializes a git repository of the content in the workspace
 * and publishes it to Azure.
 * @public
 */
export function createPublishAzureAction(options: {
  integrations: ScmIntegrationRegistry;
  config: Config;
}) {
  const { integrations, config } = options;

  return createTemplateAction<{
    repoUrl: string;
    description?: string;
    defaultBranch?: string;
    sourcePath?: string;
    token?: string;
    gitCommitMessage?: string;
    gitAuthorName?: string;
    gitAuthorEmail?: string;
    signCommit?: boolean;
  }>({
    id: 'publish:azure',
    examples,
    description:
      'Initializes a git repository of the content in the workspace, and publishes it to Azure.',
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
            description: `Sets the default branch on the repository. The default value is 'master'`,
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
            description:
              'Path within the workspace that will be used as the repository root. If omitted, the entire workspace will be published as the repository.',
            type: 'string',
          },
          token: {
            title: 'Authentication Token',
            type: 'string',
            description: 'The token to use for authorization to Azure',
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
          repositoryId: {
            title: 'The Id of the created repository',
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
        defaultBranch = 'master',
        gitCommitMessage = 'initial commit',
        gitAuthorName,
        gitAuthorEmail,
        signCommit,
      } = ctx.input;

      const { project, repo, host, organization } = parseRepoUrl(
        repoUrl,
        integrations,
      );

      if (!organization) {
        throw new InputError(
          `Invalid URL provider was included in the repo URL to create ${ctx.input.repoUrl}, missing organization`,
        );
      }

      const url = `https://${host}/${organization}`;
      const credentialProvider =
        DefaultAzureDevOpsCredentialsProvider.fromIntegrations(integrations);
      const credentials = await credentialProvider.getCredentials({ url: url });
      const integrationConfig = integrations.azure.byHost(host);

      if (credentials === undefined && ctx.input.token === undefined) {
        throw new InputError(
          `No credentials provided ${url}, please check your integrations config`,
        );
      }

      const authHandler =
        ctx.input.token || credentials?.type === 'pat'
          ? getPersonalAccessTokenHandler(ctx.input.token ?? credentials!.token)
          : getBearerHandler(credentials!.token);

      const webApi = new WebApi(url, authHandler);
      const client = await webApi.getGitApi();
      const createOptions: GitRepositoryCreateOptions = { name: repo };

      const { remoteUrl, repositoryId, repoContentsUrl } = await ctx.checkpoint(
        {
          key: `create.repo.${repo}`,
          fn: async () => {
            const returnedRepo = await client.createRepository(
              createOptions,
              project,
            );

            if (!returnedRepo) {
              throw new InputError(
                `Unable to create the repository with Organization ${organization}, Project ${project} and Repo ${repo}.
          Please make sure that both the Org and Project are typed corrected and exist.`,
              );
            }

            if (!returnedRepo.remoteUrl) {
              throw new InputError(
                'No remote URL returned from create repository for Azure',
              );
            }

            if (!returnedRepo.id) {
              throw new InputError(
                'No Id returned from create repository for Azure',
              );
            }

            if (!returnedRepo.webUrl) {
              throw new InputError(
                'No web URL returned from create repository for Azure',
              );
            }

            return {
              remoteUrl: returnedRepo.remoteUrl,
              repositoryId: returnedRepo.id,
              repoContentsUrl: returnedRepo.webUrl,
            };
          },
        },
      );

      const gitAuthorInfo = {
        name: gitAuthorName
          ? gitAuthorName
          : config.getOptionalString('scaffolder.defaultAuthor.name'),
        email: gitAuthorEmail
          ? gitAuthorEmail
          : config.getOptionalString('scaffolder.defaultAuthor.email'),
      };

      const auth = {
        username: 'notempty',
        password: ctx.input.token ?? credentials!.token,
      };

      const signingKey =
        integrationConfig?.config.commitSigningKey ??
        config.getOptionalString('scaffolder.defaultCommitSigningKey');
      if (signCommit && !signingKey) {
        throw new Error(
          'Signing commits is enabled but no signing key is provided in the configuration',
        );
      }

      const commitHash = await ctx.checkpoint({
        key: `init.repo.and.push.${remoteUrl}`,
        fn: async () => {
          const commitResult = await initRepoAndPush({
            dir: getRepoSourceDirectory(
              ctx.workspacePath,
              ctx.input.sourcePath,
            ),
            remoteUrl,
            defaultBranch,
            auth: auth,
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

      ctx.output('commitHash', commitHash);
      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
      ctx.output('repositoryId', repositoryId);
    },
  });
}
