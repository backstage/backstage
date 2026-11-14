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
import {
  AuthService,
  DiscoveryService,
  PermissionsService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { InputError, NotAllowedError, ResponseError } from '@backstage/errors';
import {
  devToolsTaskSchedulerReadPermission,
  TaskApiTasksResponse,
} from '@backstage/plugin-devtools-common/alpha';
import { AuthorizeResult } from '@backstage/plugin-permission-common';

export const createGetScheduledTasksAction = ({
  auth,
  config,
  discovery,
  permissions,
  actionsRegistry,
}: {
  auth: AuthService;
  config: RootConfigService;
  discovery: DiscoveryService;
  permissions: PermissionsService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-scheduled-tasks',
    title: 'Get Scheduled Tasks',
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    description: `Returns the scheduled tasks registered by backend plugins, including each task's schedule settings, current state, and last run error.
If no plugin IDs are given, the plugins listed in the "devTools.scheduledTasks.plugins" configuration are queried.
A failure to reach one plugin is reported in the errors list and does not fail the whole request.
Requires the "devtools.scheduler.read" permission.`,
    schema: {
      input: z =>
        z.object({
          pluginIds: z
            .array(z.string())
            .optional()
            .describe(
              'The IDs of the plugins to list scheduled tasks for, e.g. ["catalog", "search"]. Defaults to the plugins configured in devTools.scheduledTasks.plugins.',
            ),
        }),
      output: z =>
        z.object({
          tasks: z
            .array(
              z
                .object({
                  taskId: z.string().describe('The ID of the task'),
                  pluginId: z
                    .string()
                    .describe('The ID of the plugin that owns the task'),
                  scope: z
                    .enum(['global', 'local'])
                    .describe(
                      'Whether the task runs on one instance (global) or on every instance (local)',
                    ),
                  settings: z
                    .object({})
                    .passthrough()
                    .describe('The schedule settings of the task'),
                  taskState: z
                    .object({})
                    .passthrough()
                    .nullable()
                    .describe(
                      'The run state of the task, such as its status, next start time, and last run error',
                    ),
                  workerState: z
                    .object({})
                    .passthrough()
                    .nullable()
                    .describe('The state of the worker running the task'),
                })
                .passthrough(),
            )
            .describe('The scheduled tasks'),
          errors: z
            .array(
              z.object({
                pluginId: z.string(),
                message: z.string(),
              }),
            )
            .describe('Plugins whose scheduled tasks could not be fetched'),
        }),
    },
    action: async ({ input, credentials }) => {
      const [decision] = await permissions.authorize(
        [{ permission: devToolsTaskSchedulerReadPermission }],
        { credentials },
      );
      if (decision.result !== AuthorizeResult.ALLOW) {
        throw new NotAllowedError('Unauthorized');
      }

      const pluginIds =
        input.pluginIds ??
        config.getOptionalStringArray('devTools.scheduledTasks.plugins') ??
        [];
      if (pluginIds.length === 0) {
        throw new InputError(
          'No plugin IDs were given and none are configured in devTools.scheduledTasks.plugins',
        );
      }

      const tasks: TaskApiTasksResponse[] = [];
      const errors: { pluginId: string; message: string }[] = [];

      await Promise.all(
        [...new Set(pluginIds)].map(async pluginId => {
          try {
            const { token } = await auth.getPluginRequestToken({
              onBehalfOf: credentials,
              targetPluginId: pluginId,
            });
            const baseUrl = await discovery.getBaseUrl(pluginId);
            const response = await fetch(
              `${baseUrl}/.backstage/scheduler/v1/tasks`,
              { headers: { Authorization: `Bearer ${token}` } },
            );
            if (!response.ok) {
              throw await ResponseError.fromResponse(response);
            }
            const body = (await response.json()) as {
              tasks: TaskApiTasksResponse[];
            };
            tasks.push(...body.tasks);
          } catch (error) {
            errors.push({
              pluginId,
              message: error instanceof Error ? error.message : String(error),
            });
          }
        }),
      );

      return { output: { tasks, errors } };
    },
  });
};
