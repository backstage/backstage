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

import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { InputError } from '@backstage/errors';
import { Config } from '@backstage/config';
import fetch from 'cross-fetch';

/**
 * Creates the `sonarqube:create:project` Scaffolder action.
 *
 * @remarks
 *
 * See {@link https://backstage.io/docs/features/software-templates/writing-custom-actions}.
 *
 * @param options - Configuration of the SonaQube API.
 * @public
 */
export function sonarQubeCreateProjectAction(options: { config: Config }) {
  const { config } = options;

  return createTemplateAction<{
    name: string;
    organization: string;
    projectKey: string;
    visibility?: boolean;
    serverUrl?: string;
    authToken?: string;
  }>({
    id: 'sonarqube:project:create',
    schema: {
      input: {
        required: ['name', 'projectKey'],
        type: 'object',
        properties: {
          name: {
            title: 'Name of the project.',
            type: 'string',
          },
          projectKey: {
            title: 'Key of the project',
            type: 'string',
          },
          organization: {
            title:
              'The key of the organization. Only required for sonarcloud.io',
            type: 'string',
          },
          visibility: {
            title: `Whether the created project should be visible to everyone, or only specific user/groups.
            If no visibility is specified, the default project visibility of the organization will be used.`,
            type: 'string',
          },
          serverUrl: {
            title: 'SonarQube server URL. Defaults to https://sonarcloud.io',
            type: 'string',
          },
          authToken: {
            title: 'Authentication token. Requires Create Projects permission',
            type: 'string',
          },
        },
      },
    },
    async handler(ctx) {
      const {
        name,
        organization,
        projectKey,
        visibility,
        serverUrl,
        authToken,
      } = ctx.input;

      const sonarServer = serverUrl ? serverUrl : `https://sonarcloud.io`;

      let token = authToken
        ? authToken
        : config.getOptionalString('scaffolder.sonarqube.token');

      const sonarCloud = sonarServer === 'https://sonarcloud.io';

      if (!token) {
        throw new InputError(`No Sonarqube token provided.`);
      }

      if (!sonarCloud) {
        token = Buffer.from(`${token}:`).toString('base64');
      }

      let url = `${sonarServer}/api/projects/create?name=${name}&project=${projectKey}`;

      if (organization) {
        url = url.concat(`&organization=${organization}`);
      }

      if (visibility) {
        url = url.concat(`&visibility=${visibility}`);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `${sonarCloud ? 'Bearer' : 'Basic'} ${token}`,
        },
      });

      if (!response.ok) {
        throw new InputError(
          `Sonarqube API responded with ${
            response.status
          }: ${await response.text()}`,
        );
      }

      const result = await response.json();

      ctx.logger.info(`Created Sonarqube project ${result.project.key}`);

      ctx.output('key', result.project.key);
    },
  });
}
