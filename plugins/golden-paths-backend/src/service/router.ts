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
import express from 'express';
import Router from 'express-promise-router';
import { IdentityApi } from '@backstage/plugin-auth-node';
import {
  DatabaseService,
  DiscoveryService,
  PermissionsService,
  AuthService,
  HttpAuthService,
  LoggerService,
  PermissionsRegistryService,
} from '@backstage/backend-plugin-api';
import { CatalogClient } from '@backstage/catalog-client';
import {
  parseEntityRef,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { StorageTaskBroker } from '../golden-paths/tasks/StorageTaskBroker';
import { Config } from '@backstage/config';
import { DatabaseTaskStore } from '../golden-paths/tasks/DatabaseTaskStore';
import { InputError, NotFoundError } from '@backstage/errors';
import { validate } from 'jsonschema';
import { JsonObject } from '@backstage/types';
import {
  getEntityBaseUrl,
  parseNumberParam,
  parseStringsParam,
} from './helpers';
import {
  goldenPathsTaskPermissions,
  taskCreatePermission,
  taskReadPermission,
  taskCancelPermission,
  TaskSpec,
  TaskStatus,
  templateExecutePermission,
  taskCompletePermission,
  templateReadPermission,
} from '@backstage/plugin-golden-paths-common';
import { createConditionAuthorizer } from '@backstage/plugin-permission-node';
import { goldenPathsTaskRules } from './permissions/rules';
import { InternalTaskSecrets, TaskBroker } from '../golden-paths/tasks/types';
import {
  checkPermission,
  checkResourcePermission,
} from '../util/checkPermissions';
import { ScaffolderClient } from '../client/ScaffolderClient';
import {
  GoldenPathsPermissionRuleInput,
  TaskPermissionRuleInput,
} from './permissions/permissions';
import {
  goldenPathPermissionResourceRef,
  taskPermissionResourceRef,
} from './permissions/permissionResources';
import { authorizeGoldenPath } from '../util/authorizeGoldenPath';

export interface RouterOptions {
  database: DatabaseService;
  logger: LoggerService;
  config: Config;
  auth: AuthService;
  discovery: DiscoveryService;
  httpAuth: HttpAuthService;
  permissions: PermissionsService;
  permissionsRegistry: PermissionsRegistryService;
  permissionRules?: Array<GoldenPathsPermissionRuleInput>;
  identity?: IdentityApi;
  taskBroker?: TaskBroker;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  router.use(express.json({ limit: '10MB' }));
  const {
    database,
    logger: parentLogger,
    permissions,
    permissionsRegistry,
    auth,
    httpAuth,
    discovery,
  } = options;

  const logger = parentLogger.child({ plugin: 'goldenpaths' });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  let taskBroker: TaskBroker;
  if (!options.taskBroker) {
    const databaseTaskStore = await DatabaseTaskStore.create({
      database,
      logger,
    });
    const scaffolderClient = new ScaffolderClient({ discoveryApi: discovery });
    taskBroker = new StorageTaskBroker(databaseTaskStore, scaffolderClient);
  } else {
    taskBroker = options.taskBroker;
  }

  const taskRules: TaskPermissionRuleInput[] =
    Object.values(goldenPathsTaskRules);

  permissionsRegistry.addResourceType({
    resourceRef: taskPermissionResourceRef,
    permissions: goldenPathsTaskPermissions,
    rules: taskRules,
    getResources: async (resourceRefs: string[]) => {
      const tasks = await taskBroker.getTasks();

      if (!tasks) {
        return [];
      }

      const filtered = tasks.tasks.filter(resource =>
        resourceRefs.includes(resource.id),
      );

      return filtered;
    },
  });

  const isGoldenPathAuthorized = createConditionAuthorizer(
    permissionsRegistry.getPermissionRuleset(goldenPathPermissionResourceRef),
  );

  const isTaskAuthorized = createConditionAuthorizer(
    permissionsRegistry.getPermissionRuleset(taskPermissionResourceRef),
  );

  router.get(
    '/goldenpaths/:namespace/:kind/:name/parameter-schema',
    async (req, res) => {
      const credentials = await httpAuth.credentials(req);

      const { token } = await auth.getPluginRequestToken({
        onBehalfOf: credentials,
        targetPluginId: 'catalog',
      });

      const goldenPath = await authorizeGoldenPath(
        req.params,
        token,
        credentials,
        permissions,
        catalogClient,
        isGoldenPathAuthorized,
      );

      const parameters = [goldenPath.spec.parameters ?? []].flat();

      res.json({
        title: goldenPath.metadata.title ?? goldenPath.metadata.name,
        description: goldenPath.metadata.description,
        'ui:options': goldenPath.metadata['ui:options'],
        steps: parameters.map(schema => ({
          title: schema.title ?? 'Please enter the following information',
          description: schema.description,
          schema,
        })),
      });
    },
  );

  router.post('/tasks', async (req, res) => {
    const goldenPathRef: string = req.body.goldenPathRef;
    const { kind, namespace, name } = parseEntityRef(goldenPathRef, {
      defaultKind: 'goldenpath',
    });

    const credentials = await httpAuth.credentials(req);

    await checkPermission({
      credentials,
      permissions: [taskCreatePermission],
      permissionService: permissions,
    });

    const { token } = await auth.getPluginRequestToken({
      onBehalfOf: credentials,
      targetPluginId: 'catalog',
    });

    const userEntityRef = auth.isPrincipal(credentials, 'user')
      ? credentials.principal.userEntityRef
      : undefined;

    if (!userEntityRef) {
      throw new Error(
        "Reference to user's entity is required to start execution of Golden Path",
      );
    }

    const userEntity = userEntityRef
      ? await catalogClient.getEntityByRef(userEntityRef, { token })
      : undefined;

    logger.info(
      `GoldenPaths task for ${goldenPathRef} ${
        userEntityRef ? `created by ${userEntityRef}` : ''
      }`,
    );
    const values = req.body.values;

    const goldenPath = await authorizeGoldenPath(
      { kind, namespace, name },
      token,
      credentials,
      permissions,
      catalogClient,
      isGoldenPathAuthorized,
    );

    for (const parameters of [goldenPath.spec.parameters ?? []].flat()) {
      const result = validate(values, parameters);

      if (!result.valid) {
        res.status(400).json({ errors: result.errors });
        return;
      }
    }

    const baseUrl = getEntityBaseUrl(goldenPath);
    const taskSpec: TaskSpec = {
      apiVersion: goldenPath.apiVersion,
      steps: goldenPath.spec.steps.map((step, index) => ({
        ...step,
        id: step.id ?? `step-${index + 1}`,
        name: step.name ?? step.template,
      })),
      parameters: values,
      user: {
        entity: userEntity as UserEntity,
        ref: userEntityRef,
      },
      goldenPathInfo: {
        entityRef: stringifyEntityRef({ kind, name, namespace }),
        baseUrl,
        entity: {
          metadata: goldenPath.metadata,
        },
      },
    };

    const secrets: InternalTaskSecrets = {
      ...req.body.secrets,
      backstageToken: token,
      __initiatorCredentials: JSON.stringify({
        ...credentials,
        // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
        token: (credentials as any).token,
      }),
    };

    const result = await taskBroker.insertTask({
      spec: taskSpec,
      createdBy: userEntityRef,
      secrets,
    });

    res.status(201).json({ id: result.taskId });
  });

  router.get('/tasks', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    await checkResourcePermission({
      credentials,
      permissions: [taskReadPermission],
      permissionService: permissions,
      isTaskAuthorized,
    });

    if (!taskBroker.getTasks) {
      throw new Error(
        'TaskBroker does not support listing tasks, please implement the list method on the TaskBroker.',
      );
    }

    const createdBy = parseStringsParam(req.query.createdBy, 'createdBy');
    const status = parseStringsParam(req.query.status, 'status');

    const order = parseStringsParam(req.query.order, 'order')?.map(item => {
      const match = item.match(/^(asc|desc):(.+)$/);
      if (!match) {
        throw new InputError(
          `Invalid order parameter "${item}", expected "<asc or desc>:<field name>"`,
        );
      }

      return {
        order: match[1] as 'asc' | 'desc',
        field: match[2],
      };
    });

    const limit = parseNumberParam(req.query.limit, 'limit');
    const offset = parseNumberParam(req.query.offset, 'offset');

    const tasks = await taskBroker.getTasks({
      filters: {
        createdBy,
        status: status ? (status as TaskStatus[]) : undefined,
      },
      order,
      pagination: {
        limit: limit ? limit[0] : undefined,
        offset: offset ? offset[0] : undefined,
      },
    });

    res.status(200).json(tasks);
  });

  router.get('/tasks/:taskId', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [taskReadPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    if (!task) {
      throw new NotFoundError(`Task with id ${taskId} does not exist`);
    }
    // Do not disclose secrets
    const { secrets, ...taskWithoutSecrets } = task;
    res.status(200).json(taskWithoutSecrets);
  });

  router.post('/tasks/:taskId/complete', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [taskCompletePermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    await taskBroker.completeTask(taskId);
    res.status(200).json({ status: 'completed' });
  });

  router.post('/tasks/:taskId/cancel', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [taskCancelPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    await taskBroker.cancelTask({ taskId, headers: req.headers });
    res.status(200).json({ status: 'cancelled' });
  });

  router.get('/tasks/:taskId/statuses', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [taskReadPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    const statuses = await taskBroker.getTaskStatuses(taskId);

    res.status(200).json({ statuses: statuses });
  });

  router.post('/tasks/:taskId/templates/:templateId', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId, templateId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [templateExecutePermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    await taskBroker.upsertTaskStep(taskId, templateId, req.body, req.headers);

    res.status(200).end();
  });

  router.get('/tasks/:taskId/templates/:templateId', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId, templateId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [templateReadPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    const stepId = await taskBroker.getTaskStepId({ taskId, templateId });
    res.status(200).json({ id: stepId });
  });

  router.get('/tasks/:taskId/outputs', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [templateReadPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    // Process the input values, replacing output references with actual values
    const outputs = await taskBroker.getAllTaskOutputs({ taskId });

    res.status(200).json(outputs || {});
  });

  router.post(
    '/tasks/:taskId/templates/:templateId/status',
    async (req, res) => {
      const credentials = await httpAuth.credentials(req);

      const { taskId, templateId } = req.params;
      const task = await taskBroker.getTask(taskId);

      await checkResourcePermission({
        credentials,
        permissions: [templateExecutePermission],
        permissionService: permissions,
        task,
        isTaskAuthorized,
      });

      const { status: taskStatus } = req.body;

      const status = await taskBroker.upsertTaskStepStatus({
        taskId,
        templateId,
        status: taskStatus,
      });

      res.status(200).json({ status: status });
    },
  );

  router.get(
    '/tasks/:taskId/templates/:templateId/status',
    async (req, res) => {
      const credentials = await httpAuth.credentials(req);

      const { taskId, templateId } = req.params;
      const task = await taskBroker.getTask(taskId);

      await checkResourcePermission({
        credentials,
        permissions: [templateReadPermission],
        permissionService: permissions,
        task,
        isTaskAuthorized,
      });

      const status = await taskBroker.getTaskStepStatus({
        taskId,
        templateId,
      });
      res.status(200).json({ status: status });
    },
  );

  router.get('/tasks/:taskId/steps/:stepId/eventstream', async (req, res) => {
    const credentials = await httpAuth.credentials(req);

    const { taskId, stepId } = req.params;
    const task = await taskBroker.getTask(taskId);

    await checkResourcePermission({
      credentials,
      permissions: [templateReadPermission],
      permissionService: permissions,
      task,
      isTaskAuthorized,
    });

    const taskStep = await taskBroker.getTaskStep(stepId);

    const after = Number(req.query?.after) || undefined;

    logger.debug(`Event stream observing stepId '${stepId}' opened`);

    res.writeHead(200, {
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
    });

    // After client opens connection send all events as string
    const subscription = taskBroker
      .getTaskStepEvents({ stepId, after, headers: req.headers })
      .subscribe({
        error: error => {
          logger.error(
            `Received error from event stream when observing stepId '${stepId}', ${error}`,
          );
          res.end();
        },
        next: ({ events }) => {
          let shouldUnsubscribe = false;
          for (const event of events) {
            res.write(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            );
            if (event.type === 'completion' && !event.isTaskRecoverable) {
              const eventMessage = (event.body.message as String)?.split(' ');
              const status = eventMessage[eventMessage.length - 1];

              shouldUnsubscribe = true;

              taskBroker.upsertTaskStepStatus({
                taskId,
                templateId: taskStep.templateId,
                status,
              });

              if (event.body.output) {
                taskBroker.storeTaskStepOutputs(
                  taskId,
                  taskStep.templateId,
                  event.body.output as JsonObject,
                );
              }
            }
          }

          // res.flush() is only available with the compression middleware
          // @ts-ignore flush method exists on response, but it's not declared in response type
          res.flush?.();
          if (shouldUnsubscribe) {
            subscription.unsubscribe();
            res.end();
          }
        },
      });
  });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  return app;
}
