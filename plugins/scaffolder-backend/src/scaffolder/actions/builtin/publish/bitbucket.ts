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
  BitbucketIntegrationConfig,
  ScmIntegrations,
} from '@backstage/integration';
import { TemplateAction } from '../../types';
import { initRepoAndPush } from '../../../stages/publish/helpers';
import { parseRepoUrl } from './util';
import fetch from 'cross-fetch';

const createBitbucketCloudRepository = async (opts: {
  owner: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
}) => {
  const { owner, repo, description, repoVisibility, authorization } = opts;

  let response: Response;

  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      scm: 'git',
      description: description,
      is_private: repoVisibility === 'private',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };
  try {
    response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${owner}/${repo}`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }
  if (response.status === 200) {
    const r = await response.json();
    let remoteUrl = '';
    for (const link of r.links.clone) {
      if (link.name === 'https') {
        remoteUrl = link.href;
      }
    }

    // TODO use the urlReader to get the default branch
    const repoContentsUrl = `${r.links.html.href}/src/master`;
    return { remoteUrl, repoContentsUrl };
  }
  throw new Error(`Not a valid response code ${await response.text()}`);
};

const createBitbucketServerRepository = async (opts: {
  host: string;
  owner: string;
  repo: string;
  description: string;
  repoVisibility: 'private' | 'public';
  authorization: string;
}) => {
  const {
    host,
    owner,
    repo,
    description,
    authorization,
    repoVisibility,
  } = opts;

  let response: Response;
  const options: RequestInit = {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: description,
      is_private: repoVisibility === 'private',
    }),
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
  };

  try {
    response = await fetch(
      `https://${host}/rest/api/1.0/projects/${owner}/repos`,
      options,
    );
  } catch (e) {
    throw new Error(`Unable to create repository, ${e}`);
  }
  if (response.status === 201) {
    const r = await response.json();
    let remoteUrl = '';
    for (const link of r.links.clone) {
      if (link.name === 'http') {
        remoteUrl = link.href;
      }
    }
    const repoContentsUrl = `${r.links.self[0].href}`;
    return { remoteUrl, repoContentsUrl };
  }
  throw new Error(`Not a valid response code ${await response.text()}`);
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

export function createPublishBitbucketAction(options: {
  integrations: ScmIntegrations;
}): TemplateAction<{
  repoUrl: string;
  description: string;
  repoVisibility: 'private' | 'public';
}> {
  const { integrations } = options;

  return {
    id: 'publish:bitbucket',
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
            title: 'Repository Visiblity',
            type: 'string',
            enum: ['private', 'public'],
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
      const {
        repoUrl,
        description,
        repoVisibility = 'private',
      } = ctx.parameters;

      const { owner, repo, host } = parseRepoUrl(repoUrl);

      const integrationConfig = integrations.bitbucket.byHost(host);

      if (!integrationConfig) {
        throw new InputError(
          `No matching integration configuration for host ${host}, please check your Integrations config`,
        );
      }

      const authorization = getAuthorizationHeader(integrationConfig.config);

      const createMethod =
        host === 'bitbucket.org'
          ? createBitbucketCloudRepository
          : createBitbucketServerRepository;

      const { remoteUrl, repoContentsUrl } = await createMethod({
        authorization,
        host,
        owner,
        repo,
        repoVisibility,
        description,
      });

      await initRepoAndPush({
        dir: ctx.workspacePath,
        remoteUrl,
        auth: {
          username: integrationConfig.config.username
            ? integrationConfig.config.username
            : 'x-token-auth',
          password: integrationConfig.config.appPassword
            ? integrationConfig.config.appPassword
            : integrationConfig.config.token ?? '',
        },
        logger: ctx.logger,
      });

      ctx.output('remoteUrl', remoteUrl);
      ctx.output('repoContentsUrl', repoContentsUrl);
    },
  };
}
