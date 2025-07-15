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
import { Request, Response } from 'express';
import {
  HttpAuthService,
  LoggerService,
  type PermissionsService,
  PermissionsRegistryService,
  AuditorService,
} from '@backstage/backend-plugin-api';
import { TaskService, TaskMetadata } from './types';
import {
  taskListPermission,
  taskReadPermission,
  taskTriggerPermission,
} from '@backstage/plugin-tasks-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { createOpenApiRouter } from './schema/openapi';
import { createConditionAuthorizer } from '@backstage/plugin-permission-node';
import { taskPermissionResourceRef } from './permission';
import { checkResourcePermission } from './permission/helpers';
import { NotAllowedError } from '@backstage/errors';

export interface TasksRouterOptions {
  httpAuth: HttpAuthService;
  taskService: TaskService;
  permissions: PermissionsService;
  permissionsRegistry: PermissionsRegistryService;
  logger: LoggerService;
  auditor?: AuditorService;
}

// Helper function to convert TaskMetadata to Task format (convert string dates to Date objects)
function convertTaskMetadataToTask(taskMetadata: TaskMetadata): any {
  return {
    ...taskMetadata,
    computed: {
      ...taskMetadata.computed,
      lastRunEndedAt: taskMetadata.computed.lastRunEndedAt
        ? new Date(taskMetadata.computed.lastRunEndedAt)
        : undefined,
      nextRunAt: taskMetadata.computed.nextRunAt
        ? new Date(taskMetadata.computed.nextRunAt)
        : undefined,
      timesOutAt: taskMetadata.computed.timesOutAt
        ? new Date(taskMetadata.computed.timesOutAt)
        : undefined,
      startedAt: taskMetadata.computed.startedAt
        ? new Date(taskMetadata.computed.startedAt)
        : undefined,
    },
  };
}

export async function createRouter(options: TasksRouterOptions) {
  const { taskService, permissions, permissionsRegistry, httpAuth, auditor } =
    options;

  const router = await createOpenApiRouter();
  const ruleset = permissionsRegistry.getPermissionRuleset(
    taskPermissionResourceRef,
  );
  // Create condition authorizer - if no rules are configured, deny access by default for security
  const isAuthorized = ruleset
    ? createConditionAuthorizer(ruleset)
    : () => false;

  // Add specific route handlers for conditional authorization
  router.get('/tasks', async (req, res) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['user', 'service'],
    });

    const auditorEvent = await auditor?.createEvent({
      eventId: 'task-fetch',
      request: req,
      meta: {
        queryType: 'all',
      },
      severityLevel: 'low',
    });

    try {
      const allTasks = await taskService.getTasks();
      let filteredItems = allTasks;

      // Two-level permission system:
      // 1. taskListPermission: prerequisite to access the tasks list endpoint
      // 2. taskReadPermission: resource-level permission for each individual task

      // First check basic permission to list tasks (prerequisite)
      const listPermissionDecision = await permissions.authorize(
        [{ permission: taskListPermission }],
        { credentials },
      );

      // Early exit if user doesn't have permission to list tasks at all
      if (listPermissionDecision[0].result === AuthorizeResult.DENY) {
        const notAllowedError = new NotAllowedError();
        await auditorEvent?.fail({ error: notAllowedError });
        throw notAllowedError;
      }

      // For each task, check if user can read it (resource-level permission)
      // Users with list permission but no read permissions will get an empty list
      const readPermissionDecisions = await permissions.authorizeConditional(
        allTasks.map(() => ({
          permission: taskReadPermission,
        })),
        { credentials },
      );

      // Filter tasks based on read permissions - returns empty list if no read access
      filteredItems = allTasks.filter(
        (task, index) =>
          readPermissionDecisions[index].result === AuthorizeResult.ALLOW ||
          (readPermissionDecisions[index].result ===
            AuthorizeResult.CONDITIONAL &&
            isAuthorized(readPermissionDecisions[index], task)),
      );

      // Convert TaskMetadata to Task format for response
      const convertedItems = filteredItems.map(convertTaskMetadataToTask);

      await auditorEvent?.success({
        meta: {
          tasksCount: convertedItems.length,
          totalTasksCount: allTasks.length,
        },
      });

      return res.json(convertedItems);
    } catch (error) {
      await auditorEvent?.fail({ error: error as Error });
      throw error;
    }
  });

  // Get task details
  router.get('/tasks/:id', async (req: Request, res: Response) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['user', 'service'],
    });

    const auditorEvent = await auditor?.createEvent({
      eventId: 'task-fetch',
      request: req,
      meta: {
        queryType: 'by-id',
        taskId: req.params.id,
      },
      severityLevel: 'low',
    });

    try {
      const task = await taskService.getTask(req.params.id);
      if (!task) {
        await auditorEvent?.fail({ error: new Error('Task not found') });
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check permission with conditional authorization
      const permissionCheck = await checkResourcePermission(
        permissions,
        taskReadPermission,
        req.params.id,
        task,
        isAuthorized,
        credentials,
      );

      if (!permissionCheck.allowed) {
        const accessError = new Error(
          `Access denied: ${permissionCheck.message}`,
        );
        await auditorEvent?.fail({ error: accessError });
        return res.status(permissionCheck.status ?? 403).json({
          error: permissionCheck.message,
        });
      }

      await auditorEvent?.success({
        meta: {
          taskTitle: task.meta.title,
          taskStatus: task.computed.status,
          pluginId: task.pluginId,
        },
      });

      return res.json(convertTaskMetadataToTask(task));
    } catch (error) {
      await auditorEvent?.fail({ error: error as Error });
      throw error;
    }
  });

  // Trigger task
  router.post('/tasks/:id', async (req: Request, res: Response) => {
    const credentials = await httpAuth.credentials(req, {
      allow: ['user', 'service'],
    });

    const auditorEvent = await auditor?.createEvent({
      eventId: 'task-trigger',
      request: req,
      meta: {
        actionType: 'trigger',
        taskId: req.params.id,
      },
      severityLevel: 'medium',
    });

    // XXX(GabDug): Vulnerable to timing attacks. Should either always return 403 or always 404?
    try {
      // First get the task to check permissions against it
      const task = await taskService.getTask(req.params.id);
      if (!task) {
        await auditorEvent?.fail({ error: new Error('Task not found') });
        return res.status(404).json({ message: 'Task not found' });
      }

      // Check permission with conditional authorization
      const permissionCheck = await checkResourcePermission(
        permissions,
        taskTriggerPermission,
        req.params.id,
        task,
        isAuthorized,
        credentials,
      );

      if (!permissionCheck.allowed) {
        const accessError = new Error(
          `Access denied: ${permissionCheck.message}`,
        );
        await auditorEvent?.fail({ error: accessError });
        return res.status(permissionCheck.status ?? 403).json({
          error: permissionCheck.message,
        });
      }

      // Permission check passed, trigger the task
      await taskService.triggerTask(req.params.id);

      await auditorEvent?.success({
        meta: {
          taskTitle: task.meta.title,
          taskStatus: task.computed.status,
          pluginId: task.pluginId,
          scope: task.task.scope,
        },
      });

      // XXX(GabDug): Review this. Must match OpenAPI spec.
      return res.status(200).send();
    } catch (error) {
      await auditorEvent?.fail({ error: error as Error });
      throw error;
    }
  });

  return router;
}
