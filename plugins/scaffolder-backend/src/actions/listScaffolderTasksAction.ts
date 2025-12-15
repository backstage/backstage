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
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';
import { ScmIntegrations } from '@backstage/integration';
import { ScaffolderClient } from '@backstage/plugin-scaffolder-common';

export const createListScaffolderTasksAction = ({
  actionsRegistry,
  auth,
  discovery,
  scmIntegrations,
}: {
  actionsRegistry: ActionsRegistryService;
  auth: AuthService;
  discovery: DiscoveryService;
  scmIntegrations: ScmIntegrations;
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
Each task has a unique id, specification, and status (one of open, processing, completed, failed, cancelled, stale).
Each task also has timestamps relating to when the task was created and updated.
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
            .describe('The maximum number of tasks to return for pagination')
            .optional(),
          offset: z
            .number()
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
                      'Task status: open, processing, completed, failed, cancelled, or stale',
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
              .optional()
              .describe(
                'Total number of tasks matching the filter (for pagination)',
              ),
          })
          .describe(
            'Object containing a tasks array and optional totalTasks count',
          ),
    },
    action: async ({ input, credentials }) => {
      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'scaffolder',
      });

      const userRef = auth.isPrincipal(credentials, 'user')
        ? credentials.principal.userEntityRef
        : 'user:default/anonymous';

      // Better way to handle this for scenarios where 'filterByOwnership: owned'?
      // Because scaffolderClient.listTasks requires the identityApi when filtering by ownership,
      // we need to create a scaffolder client with the userRef
      const client = new ScaffolderClient({
        discoveryApi: discovery,
        fetchApi: { fetch },
        scmIntegrationsApi: scmIntegrations,
        identityApi: {
          getBackstageIdentity: async () => ({
            type: 'user' as const,
            userEntityRef: userRef,
            ownershipEntityRefs: [],
          }),
        },
      });

      const { tasks, totalTasks } = await client.listTasks(
        {
          filterByOwnership: input.owned ? 'owned' : 'all',
          limit: input.limit,
          offset: input.offset,
        },
        { token },
      );

      return {
        output: {
          tasks: tasks.map(task => ({
            id: task.id,
            spec: task.spec,
            status: task.status,
            createdAt: task.createdAt,
            lastHeartbeatAt: task.lastHeartbeatAt,
          })),
          totalTasks,
        },
      };
    },
  });
};
