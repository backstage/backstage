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
import {
  GroupSchema,
  CreateGroupOptions,
  NamespaceSchema,
} from '@gitbeaker/rest';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabGroupEnsureExists.examples';

/**
 * Creates an `gitlab:group:ensureExists` Scaffolder action.
 *
 * @public
 */
export const createGitlabGroupEnsureExistsAction = (options: {
  integrations: ScmIntegrationRegistry;
  requireScmUserCredentials?: boolean;
}) => {
  const { integrations, requireScmUserCredentials } = options;

  return createTemplateAction({
    id: 'gitlab:group:ensureExists',
    description: 'Ensures a Gitlab group exists',
    supportsDryRun: true,
    examples,
    schema: {
      input: {
        repoUrl: z =>
          z.string({
            description: `Accepts the format 'gitlab.com?repo=project_name&owner=group_name' where 'project_name' is the repository name and 'group_name' is a group or username`,
          }),
        token: z =>
          z
            .string({
              description: 'The token to use for authorization to GitLab',
            })
            .optional(),
        description: z =>
          z
            .string({
              description: 'The group’s description',
            })
            .optional(),
        path: z =>
          z
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
      },
      output: {
        groupId: z =>
          z
            .number({
              description: 'The id of the innermost sub-group',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      if (ctx.isDryRun) {
        ctx.output('groupId', 42);
        return;
      }
      const { token, repoUrl, path, description } = ctx.input;

      const { host } = parseRepoUrl(repoUrl, integrations);

      const api = getClient({
        host,
        integrations,
        token,
        requireScmUserCredentials,
      });

      let currentPath: string | null = null;
      let parentId: number | null = null;
      const pathParts = [...pathIterator(path)];
      const lastIndex = pathParts.length - 1;
      for (let i = 0; i < pathParts.length; i++) {
        const { name, slug } = pathParts[i];
        const fullPath: string = currentPath ? `${currentPath}/${slug}` : slug;
        let subGroup: GroupSchema | undefined;
        let groupNotFound = false;
        try {
          subGroup = (await api.Groups.show(
            fullPath,
          )) as unknown as GroupSchema;
        } catch (error: any) {
          // 404 means the group doesn't exist - we'll create it below
          // Any other error should be thrown
          if (error.cause?.response?.status !== 404) {
            throw error;
          }
          groupNotFound = true;
        }
        if (!subGroup) {
          // A top-level path segment can also be a user namespace, which the
          // Groups API does not return. GitLab does not support subgroups
          // under user namespaces.
          const userNamespace =
            i === 0 && groupNotFound
              ? await showUserNamespace(api, slug)
              : undefined;
          if (userNamespace && lastIndex === 0) {
            ctx.logger.info(`reusing existing user namespace ${slug}`);
            parentId = userNamespace.id;
          } else if (userNamespace) {
            throw new Error(
              `Cannot create a subgroup under '${slug}' because it is a user namespace and GitLab does not support subgroups under user namespaces`,
            );
          } else {
            ctx.logger.info(`creating missing group ${fullPath}`);

            parentId = await ctx.checkpoint({
              key: `ensure.${name}.${slug}.${parentId}`,
              // eslint-disable-next-line no-loop-func
              fn: async () => {
                const groupOptions: CreateGroupOptions = {
                  ...(parentId ? { parentId } : {}),
                  ...(description && i === lastIndex ? { description } : {}),
                };
                return (await api.Groups.create(name, slug, groupOptions))?.id;
              },
            });
          }
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

/**
 * Returns the namespace for the given path when it is a user namespace, and
 * undefined otherwise. Group namespaces are not special-cased: groups keep
 * being created through the Groups API exactly as before.
 */
async function showUserNamespace(
  api: ReturnType<typeof getClient>,
  path: string,
): Promise<NamespaceSchema | undefined> {
  let namespace: NamespaceSchema | undefined;
  try {
    namespace = (await api.Namespaces.show(
      path,
    )) as unknown as NamespaceSchema;
  } catch (error: any) {
    // 404 means there is no namespace with this path at all
    if (error.cause?.response?.status === 404) {
      return undefined;
    }
    throw error;
  }
  return namespace?.kind === 'user' ? namespace : undefined;
}

type PathPart = { name: string; slug: string };
type PathItem = string | PathPart;

function* pathIterator(items: PathItem[]): Generator<PathPart> {
  for (const item of items) {
    if (typeof item === 'string') {
      const parts = item.split('/');
      for (const part of parts) {
        yield { name: part, slug: part };
      }
    } else {
      yield item;
    }
  }
}
