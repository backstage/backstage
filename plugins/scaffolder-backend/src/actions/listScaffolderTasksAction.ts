/*
 * Copyright 2025 The Backstage Authors
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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { AuthService } from '@backstage/backend-plugin-api';
import { NotAllowedError } from '@backstage/errors';
import { ScaffolderService } from '@backstage/plugin-scaffolder-node';

export const createListScaffolderTasksAction = ({
  actionsRegistry,
  auth,
  scaffolderService,
}: {
  actionsRegistry: ActionsRegistryService;
  auth: AuthService;
  scaffolderService: ScaffolderService;
}) => {
  actionsRegistry.register({
    name: 'list-scaffolder-tasks',
    title: 'List Scaffolder Tasks',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `
This allows you to list scaffolder tasks that have been created.
Each task has a unique id, specification, and status (one of open, processing, completed, failed, cancelled, skipped).
Each task includes a timestamp for when it was created, and an optional last heartbeat timestamp indicating the most recent activity.
Set owned to true to return only tasks created by the current user; omit or set to false for all tasks the credentials can see.
Pagination is supported via limit and offset.
    `,
    schema: {
      input: z =>
        z.object({
          owned: z
            .boolean()
            .optional()
            .default(false)
            .describe(
              'If true, return only tasks created by the current user. Requires a user identity.',
            ),
          limit: z
            .number()
            .int()
            .min(1)
            .max(1000)
            .describe('The maximum number of tasks to return for pagination')
            .optional(),
          offset: z
            .number()
            .int()
            .min(0)
            .describe('The offset to start from for pagination')
            .optional(),
        }),
      output: z =>
        z
          .object({
            tasks: z
              .array(
                z.object({
                  id: z.string().describe('The task identifier'),
                  spec: z.unknown().describe('The task specification'),
                  status: z
                    .string()
                    .describe(
                      'Task status: open, processing, completed, failed, cancelled, or skipped',
                    ),
                  createdAt: z
                    .string()
                    .describe('Timestamp when the task was created'),
                  lastHeartbeatAt: z
                    .string()
                    .optional()
                    .describe('Timestamp of the last heartbeat'),
                }),
              )
              .describe('The list of scaffolder tasks'),
            totalTasks: z
              .number()
              .describe('Total number of tasks matching the filter'),
          })
          .describe('Object containing a tasks array and totalTasks count'),
    },
    action: async ({ input, credentials }) => {
      if (input.owned && !auth.isPrincipal(credentials, 'user')) {
        throw new NotAllowedError(
          'Filtering by owned tasks requires a user identity.',
        );
      }

      const createdBy =
        input.owned && auth.isPrincipal(credentials, 'user')
          ? credentials.principal.userEntityRef
          : undefined;

      const { items, totalItems } = await scaffolderService.listTasks(
        {
          createdBy,
          limit: input.limit,
          offset: input.offset,
        },
        { credentials },
      );

      return {
        output: {
          tasks: items.map(task => ({
            id: task.id,
            spec: task.spec,
            status: task.status,
            createdAt: task.createdAt,
            lastHeartbeatAt: task.lastHeartbeatAt,
          })),
          totalTasks: totalItems,
        },
      };
    },
  });
};
