/*
 * Copyright 2026 The Backstage Authors
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
import { ScmIntegrationRegistry } from '@backstage/integration';
import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import { getClient, parseRepoUrl } from '../util';
import { examples } from './gitlabGroupAccessAction.examples';

const accessLevelMapping: Record<string, number> = {
  no_access: 0,
  minimal_access: 5,
  guest: 10,
  planner: 15,
  reporter: 20,
  developer: 30,
  maintainer: 40,
  owner: 50,
};

function resolveAccessLevel(level: string | number): number {
  if (typeof level === 'number') return level;
  const resolved = accessLevelMapping[level.toLocaleLowerCase('en-US')];
  if (resolved === undefined) {
    throw new InputError(
      `Invalid access level: "${level}". Valid values are: ${Object.keys(
        accessLevelMapping,
      ).join(', ')} or a numeric GitLab access level`,
    );
  }
  return resolved;
}

/**
 * Creates a `gitlab:group:access` Scaffolder action.
 *
 * @public
 */
export const createGitlabGroupAccessAction = (options: {
  integrations: ScmIntegrationRegistry;
}) => {
  const { integrations } = options;

  return createTemplateAction({
    id: 'gitlab:group:access',
    description: 'Adds or removes users and groups from a GitLab group',
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
        path: z =>
          z.union([z.number(), z.string()], {
            description:
              'The ID or path of the group to add/remove members from',
          }),
        userIds: z =>
          z
            .array(z.number(), {
              description: 'The IDs of the users to add/remove',
            })
            .optional(),
        groupIds: z =>
          z
            .array(z.number(), {
              description:
                'The IDs of the groups to share with or unshare from the target group',
            })
            .optional(),
        action: z =>
          z
            .enum(['add', 'remove'], {
              description:
                'The action to perform: add or remove the members. Defaults to "add".',
            })
            .default('add')
            .optional(),
        accessLevel: z =>
          z
            .union([z.number(), z.string()], {
              description:
                'The access level for the members. Can be a number (0=No access, 5=Minimal access, 10=Guest, 15=Planner, 20=Reporter, 30=Developer, 40=Maintainer, 50=Owner) or a string (e.g., "guest", "developer"). Defaults to 30 (Developer).',
            })
            .default(30)
            .optional(),
      },
      output: {
        userIds: z =>
          z
            .array(z.number(), {
              description: 'The IDs of the users that were added or removed',
            })
            .optional(),
        groupIds: z =>
          z
            .array(z.number(), {
              description:
                'The IDs of the groups that were shared with or unshared from',
            })
            .optional(),
        path: z =>
          z
            .union([z.number(), z.string()], {
              description:
                'The ID or path of the group the members were added to or removed from',
            })
            .optional(),
        accessLevel: z =>
          z
            .number({
              description:
                'The access level granted to the members (only for add action)',
            })
            .optional(),
      },
    },
    async handler(ctx) {
      const {
        token,
        repoUrl,
        path,
        userIds = [],
        groupIds = [],
        accessLevel: rawAccessLevel = 30,
        action = 'add',
      } = ctx.input;

      if (userIds.length === 0 && groupIds.length === 0) {
        throw new InputError(
          'At least one of userIds or groupIds must be provided and non-empty',
        );
      }

      const accessLevel = resolveAccessLevel(rawAccessLevel);

      if (ctx.isDryRun) {
        if (userIds.length > 0) {
          ctx.output('userIds', userIds);
        }
        if (groupIds.length > 0) {
          ctx.output('groupIds', groupIds);
        }
        ctx.output('path', path);
        if (action === 'add') {
          ctx.output('accessLevel', accessLevel);
        }
        return;
      }

      const { host } = parseRepoUrl(repoUrl, integrations);

      const api = getClient({ host, integrations, token });

      // Process users
      for (const userId of userIds) {
        ctx.logger.info(
          `${action === 'add' ? 'Adding' : 'Removing'} user ${userId} ${
            action === 'add' ? 'to' : 'from'
          } group ${path}`,
        );
        await ctx.checkpoint({
          key: `gitlab.group.member.user.${action}.${path}.${userId}`,
          fn: async () => {
            if (action === 'add') {
              try {
                await api.GroupMembers.add(path, userId, accessLevel);
              } catch (error: any) {
                // If member already exists, try to edit instead
                if (error.cause?.response?.status === 409) {
                  await api.GroupMembers.edit(path, userId, accessLevel);
                  return;
                }
                throw error;
              }
            } else {
              await api.GroupMembers.remove(path, userId);
            }
          },
        });
      }

      // Process groups
      for (const sharedGroupId of groupIds) {
        ctx.logger.info(
          `${action === 'add' ? 'Adding' : 'Removing'} group ${sharedGroupId} ${
            action === 'add' ? 'to' : 'from'
          } group ${path}`,
        );
        await ctx.checkpoint({
          key: `gitlab.group.member.group.${action}.${path}.${sharedGroupId}`,
          fn: async () => {
            if (action === 'add') {
              try {
                await api.Groups.share(path, sharedGroupId, accessLevel, {});
              } catch (error: any) {
                // If group is already shared, unshare and re-share
                if (error.cause?.response?.status === 409) {
                  await api.Groups.unshare(path, sharedGroupId, {});
                  await api.Groups.share(path, sharedGroupId, accessLevel, {});
                  return;
                }
                throw error;
              }
            } else {
              await api.Groups.unshare(path, sharedGroupId, {});
            }
          },
        });
      }

      ctx.output('path', path);

      if (userIds.length > 0) {
        ctx.output('userIds', userIds);
      }
      if (groupIds.length > 0) {
        ctx.output('groupIds', groupIds);
      }

      if (action === 'add') {
        ctx.output('accessLevel', accessLevel);
      }
    },
  });
};
