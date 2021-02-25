/*
 * Copyright 2021 Spotify AB
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

import { InputError } from '@backstage/backend-common';
import {
  GithubCredentialsProvider,
  ScmIntegrations,
} from '@backstage/integration';
import { Octokit } from '@octokit/rest';
import { TemplateAction } from '../../types';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { parseRepoUrl } from './util';

export function createPublishGithubAction(options: {
  integrations: ScmIntegrations;
}): TemplateAction<{
  repoUrl: string;
  description?: string;
  access?: string;
  repoVisibility: 'private' | 'internal' | 'public';
}> {
  const { integrations } = options;

  const credentialsProviders = new Map(
    integrations.github.list().map(integration => {
      const provider = GithubCredentialsProvider.create(integration.config);
      return [integration.config.host, provider];
    }),
  );

  return {
    id: 'publish:github',
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
          access: {
            title: 'Repository Access',
            type: 'string',
          },
          repoVisibility: {
            title: 'Repository Visiblity',
            type: 'string',
            enum: ['private', 'public', 'internal'],
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
        },
      },
    },
    async handler(ctx) {
      const { repoUrl, description, access, repoVisibility } = ctx.parameters;

      const { owner, repo, host } = parseRepoUrl(repoUrl);

      const credentialsProvider = credentialsProviders.get(host);
      const integrationConfig = integrations.github.byHost(host);

      if (!credentialsProvider || !integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your Integrations config`,
        );
      }

      const { token } = await credentialsProvider.getCredentials({
        url: `${host}/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`,
      });

      if (!token) {
        throw new InputError(
          `No token available for host: ${host}, with owner ${owner}, and repo ${repo}`,
        );
      }

      const client = new Octokit({
        auth: token,
        baseUrl: integrationConfig.config.apiBaseUrl,
      });

      const user = await client.users.getByUsername({
        username: owner,
      });

      const repoCreationPromise =
        user.data.type === 'Organization'
          ? client.repos.createInOrg({
              name: repo,
              org: owner,
              private: repoVisibility !== 'public',
              visibility: repoVisibility,
              description: description,
            })
          : client.repos.createForAuthenticatedUser({
              name: repo,
              private: repoVisibility === 'private',
              description: description,
            });

      const { data } = await repoCreationPromise;
      if (access?.startsWith(`${owner}/`)) {
        const [, team] = access.split('/');
        await client.teams.addOrUpdateRepoPermissionsInOrg({
          org: owner,
          team_slug: team,
          owner,
          repo,
          permission: 'admin',
        });
        // no need to add access if it's the person who own's the personal account
      } else if (access && access !== owner) {
        await client.repos.addCollaborator({
          owner,
          repo,
          username: access,
          permission: 'admin',
        });
      }

      const remoteUrl = data.clone_url;
      const repoContentsUrl = `${data?.html_url}/blob/master`;

      await initRepoAndPush({
        dir: ctx.workspacePath,
        remoteUrl,
        auth: {
          username: 'x-access-token',
          password: token,
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  };
}
