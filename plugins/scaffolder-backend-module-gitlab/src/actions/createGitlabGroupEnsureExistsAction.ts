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
import { ScmIntegrationRegistry } from '@backstage/integration';
import { Gitlab } from '@gitbeaker/node';
import { GroupSchema } from '@gitbeaker/core/dist/types/resources/Groups';
import commonGitlabConfig from '../commonGitlabConfig';
import { getToken } from '../util';
import { z } from 'zod';

/**
 * Creates an `gitlab:group:ensureExists` Scaffolder action.
 *
 * @public
 */
export const createGitlabGroupEnsureExistsAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:group:ensureExists',
    description: 'Ensures a Gitlab group exists',
    schema: {
      input: commonGitlabConfig.and(
        z.object({
          path: z
            .array(z.string(), {
              description: 'A path of group names that is ensured to exist',
            })
            .min(1),
        }),
      ),
      output: z.object({
        groupId: z
          .number({ description: 'The id of the innermost sub-group' })
          .optional(),
      }),
    },
    async handler(ctx) {
      const { path } = ctx.input;
      const { token, integrationConfig } = getToken(ctx.input, integrations);

      const api = new Gitlab({
        host: integrationConfig.config.baseUrl,
        token: token,
      });

      let currentPath: string = 'repos';
      let parent: GroupSchema | null = null;
      for (const pathElement of path) {
        const fullPath = `${currentPath}/${pathElement}`;
        const result = (await api.Groups.search(
          fullPath,
        )) as any as Array<GroupSchema>; // recast since the return type for search is wrong in the gitbeaker typings
        const subGroup = result.find(
          searchPathElem => searchPathElem.full_path === fullPath,
        );
        if (!subGroup) {
          ctx.logger.info(`creating missing group ${fullPath}`);
          parent = await api.Groups.create(
            pathElement,
            pathElement,
            parent
              ? {
                  parent_id: parent.id,
                }
              : {},
          );
        } else {
          parent = subGroup;
        }
        currentPath = fullPath;
      }
      if (parent !== null) {
        ctx.output('groupId', parent?.id);
      }
    },
  });
};
