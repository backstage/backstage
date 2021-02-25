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
import { ScmIntegrations } from '@backstage/integration';
import { TemplateAction } from '../../types';
import { Gitlab } from '@gitbeaker/node';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { parseRepoUrl } from './util';

export function createPublishGitlabAction(options: {
  integrations: ScmIntegrations;
  repoVisibility: 'private' | 'internal' | 'public';
}): TemplateAction<{
  repoUrl: string;
}> {
  const { integrations, repoVisibility } = options;

  return {
    id: 'publish:gitlab',
    parameterSchema: {
      type: 'object',
      required: ['repoUrl'],
      properties: {
        repoUrl: {
          title: 'Repository Location',
          type: 'string',
        },
      },
    },
    async handler(ctx) {
      const { repoUrl } = ctx.parameters;

      const { owner, repo, host } = parseRepoUrl(repoUrl);

      const integrationConfig = integrations.gitlab.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your Integrations config`,
        );
      }

      if (!integrationConfig.config.token) {
        throw new InputError(
          `No token provided for GitLab Integration ${host}`,
        );
      }

      const client = new Gitlab({
        host: integrationConfig.config.baseUrl,
        token: integrationConfig.config.token,
      });

      let { id: targetNamespace } = (await client.Namespaces.show(owner)) as {
        id: number;
      };

      if (!targetNamespace) {
        const { id } = (await client.Users.current()) as {
          id: number;
        };
        targetNamespace = id;
      }

      const { http_url_to_repo } = await client.Projects.create({
        namespace_id: targetNamespace,
        name: repo,
        visibility: repoVisibility,
      });

      const remoteUrl = (http_url_to_repo as string).replace(/\.git$/, '');
      const repoContentsUrl = `${remoteUrl}/-/blob/master`;

      await initRepoAndPush({
        dir: ctx.workspacePath,
        remoteUrl: http_url_to_repo as string,
        auth: {
          username: 'oauth2',
          password: integrationConfig.config.token,
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  };
}
