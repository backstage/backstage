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

import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { GroupSchema } from '@gitbeaker/rest';
import { z } from 'zod';
import commonGitlabConfig from '../commonGitlabConfig';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabGroupEnsureExists.examples';

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
    supportsDryRun: true,
    examples,
    schema: {
      input: commonGitlabConfig.merge(
        z.object({
          path: z
            .array(
              z.string().or(
                z.object({
                  name: z.string(),
                  slug: z.string(),
                }),
              ),
              {
                description:
                  'A path of group names or objects (name and slug) that is ensured to exist',
              },
            )
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
      if (ctx.isDryRun) {
        ctx.output('groupId', 42);
        return;
      }

      const { token, repoUrl, path } = ctx.input;

      const { host } = parseRepoUrl(repoUrl, integrations);

      const api = getClient({ host, integrations, token });

      let currentPath: string | null = null;
      let parentId: number | null = null;
      for (const pathElement of path) {
        const slug =
          typeof pathElement === 'string' ? pathElement : pathElement.slug;
        const name =
          typeof pathElement === 'string' ? pathElement : pathElement.name;
        const fullPath: string = currentPath ? `${currentPath}/${slug}` : slug;
        const result = (await api.Groups.search(
          fullPath,
        )) as unknown as Array<GroupSchema>; // recast since the return type for search is wrong in the gitbeaker typings
        const subGroup = result.find(
          searchPathElem => searchPathElem.full_path === fullPath,
        );
        if (!subGroup) {
          ctx.logger.info(`creating missing group ${fullPath}`);

          parentId = await ctx.checkpoint({
            key: `ensure.${name}.${slug}.${parentId}`,
            // eslint-disable-next-line no-loop-func
            fn: async () => {
              return (
                await api.Groups.create(
                  name,
                  slug,
                  parentId
                    ? {
                        parentId: parentId,
                      }
                    : {},
                )
              )?.id;
            },
          });
        } else {
          parentId = subGroup.id;
        }
        currentPath = fullPath;
      }
      if (parentId !== null) {
        ctx.output('groupId', parentId);
      }
    },
  });
};
