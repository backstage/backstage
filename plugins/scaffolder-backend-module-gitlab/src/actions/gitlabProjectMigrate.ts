/*
 * Copyright 2024 The Backstage Authors
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

import {
  createTemplateAction,
  parseRepoUrl,
} from '@backstage/plugin-scaffolder-node';
import { ScmIntegrationRegistry } from '@backstage/integration';
import { InputError } from '@backstage/errors';
import { createGitlabApi } from './helpers';
import { examples } from './gitlabRepoPush.examples';
import { MigrationEntityOptions } from '@gitbeaker/rest';

/**
 * Create a new action that imports a gitlab project into another gitlab project (potentially from another gitlab instance).
 *
 * @public
 */
export const createGitlabProjectMigrateAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:group:migrate',
    examples,
    schema: {
      input: {
        destinationAccessToken: z =>
          z.string({
            description: `The token to use for authorization to the target GitLab'`,
          }),
        destinationUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        sourceAccessToken: z =>
          z.string({
            description: `The token to use for authorization to the source GitLab'`,
          }),
        sourceFullPath: z =>
          z.string({
            description:
              'Full path to the project in the source Gitlab instance',
          }),
        sourceUrl: z =>
          z.string({
            description: `Accepts the format 'https://gitlab.com/'`,
          }),
      },
      output: {
        importedRepoUrl: z =>
          z.string({
            description: 'URL to the newly imported repo',
          }),
        migrationId: z =>
          z.number({
            description: 'Id of the migration that imports the project',
          }),
      },
    },

    async handler(ctx) {
      const {
        destinationAccessToken,
        destinationUrl,
        sourceAccessToken,
        sourceFullPath,
        sourceUrl,
      } = ctx.input;

      const {
        host: destinationHost,
        repo: destinationSlug,
        owner: destinationNamespace,
      } = parseRepoUrl(destinationUrl, integrations);

      if (!destinationNamespace) {
        throw new InputError(
          `Failed to determine target repository to migrate to. Make sure destinationUrl matches the format 'gitlab.myorg.com?repo=project_name&owner=group_name'`,
        );
      }

      const api = createGitlabApi({
        integrations,
        token: destinationAccessToken,
        repoUrl: destinationUrl,
      });

      const migrationEntity: MigrationEntityOptions[] = [
        {
          sourceType: 'project_entity',
          sourceFullPath: sourceFullPath,
          destinationSlug: destinationSlug,
          destinationNamespace: destinationNamespace,
        },
      ];

      const sourceConfig = {
        url: sourceUrl,
        access_token: sourceAccessToken,
      };

      try {
        const migrationId = await ctx.checkpoint({
          key: `create.migration.${sourceUrl}`,
          fn: async () => {
            const migrationStatus = await api.Migrations.create(
              sourceConfig,
              migrationEntity,
            );
            return migrationStatus.id;
          },
        });

        ctx.output(
          'importedRepoUrl',
          `${destinationHost}/${destinationNamespace}/${destinationSlug}`,
        );
        ctx.output('migrationId', migrationId);
      } catch (e: any) {
        throw new InputError(
          `Failed to transfer repo ${sourceFullPath}. Make sure that ${sourceFullPath} exists in ${sourceUrl}, and token has enough rights.\nError: ${e}`,
        );
      }
    },
  });
};
