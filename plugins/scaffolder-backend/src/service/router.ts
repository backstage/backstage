/*
 * Copyright 2020 The Backstage Authors
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

import { PluginDatabaseManager, UrlReader } from '@backstage/backend-common';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { CatalogApi } from '@backstage/catalog-client';
import {
  CompoundEntityRef,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { Config, readDurationFromConfig } from '@backstage/config';
import { InputError, NotFoundError, stringifyError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { HumanDuration, JsonObject, JsonValue } from '@backstage/types';
import {
  TaskSpec,
  TemplateEntityV1beta3,
  templateEntityV1beta3Validator,
  TemplateParametersV1beta3,
  TemplateEntityStepV1beta3,
} from '@backstage/plugin-scaffolder-common';
import {
  RESOURCE_TYPE_SCAFFOLDER_ACTION,
  RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  scaffolderActionPermissions,
  scaffolderTemplatePermissions,
  templateParameterReadPermission,
  templateStepReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import express from 'express';
import Router from 'express-promise-router';
import { validate } from 'jsonschema';
import { Logger } from 'winston';
import { z } from 'zod';
import {
  TaskBroker,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import {
  createBuiltinActions,
  DatabaseTaskStore,
  TaskWorker,
  TemplateActionRegistry,
} from '../scaffolder';
import { createDryRunner } from '../scaffolder/dryrun';
import { StorageTaskBroker } from '../scaffolder/tasks/StorageTaskBroker';
import { findTemplate, getEntityBaseUrl, getWorkingDirectory } from './helpers';
import {
  IdentityApi,
  IdentityApiGetIdentityRequest,
} from '@backstage/plugin-auth-node';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  PermissionEvaluator,
  PermissionRuleParams,
} from '@backstage/plugin-permission-common';
import {
  createConditionAuthorizer,
  createPermissionIntegrationRouter,
  PermissionRule,
} from '@backstage/plugin-permission-node';
import { scaffolderActionRules, scaffolderTemplateRules } from './rules';
import { Duration } from 'luxon';
import { LifecycleService } from '@backstage/backend-plugin-api';

/**
 *
 * @public
 */
export type TemplatePermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
  TParams
>;
function isTemplatePermissionRuleInput(
  permissionRule: TemplatePermissionRuleInput | ActionPermissionRuleInput,
): permissionRule is TemplatePermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_TEMPLATE;
}

/**
 *
 * @public
 */
export type ActionPermissionRuleInput<
  TParams extends PermissionRuleParams = PermissionRuleParams,
> = PermissionRule<
  TemplateEntityStepV1beta3 | TemplateParametersV1beta3,
  {},
  typeof RESOURCE_TYPE_SCAFFOLDER_ACTION,
  TParams
>;
function isActionPermissionRuleInput(
  permissionRule: TemplatePermissionRuleInput | ActionPermissionRuleInput,
): permissionRule is ActionPermissionRuleInput {
  return permissionRule.resourceType === RESOURCE_TYPE_SCAFFOLDER_ACTION;
}

/**
 * RouterOptions
 *
 * @public
 */
export interface RouterOptions {
  logger: Logger;
  config: Config;
  reader: UrlReader;
  lifecycle?: LifecycleService;
  database: PluginDatabaseManager;
  catalogClient: CatalogApi;
  scheduler?: PluginTaskScheduler;
  actions?: TemplateAction<any, any>[];
  /**
   * @deprecated taskWorkers is deprecated in favor of concurrentTasksLimit option with a single TaskWorker
   * @defaultValue 1
   */
  taskWorkers?: number;
  /**
   * Sets the number of concurrent tasks that can be run at any given time on the TaskWorker
   * @defaultValue 10
   */
  concurrentTasksLimit?: number;
  taskBroker?: TaskBroker;
  additionalTemplateFilters?: Record<string, TemplateFilter>;
  additionalTemplateGlobals?: Record<string, TemplateGlobal>;
  permissions?: PermissionEvaluator;
  permissionRules?: Array<
    TemplatePermissionRuleInput | ActionPermissionRuleInput
  >;
  identity?: IdentityApi;
}

function isSupportedTemplate(entity: TemplateEntityV1beta3) {
  return entity.apiVersion === 'scaffolder.backstage.io/v1beta3';
}

/*
 * @deprecated This function remains as the DefaultIdentityClient behaves slightly differently to the pre-existing
 * scaffolder behaviour. Specifically if the token fails to parse, the DefaultIdentityClient will raise an error.
 * The scaffolder did not raise an error in this case. As such we chose to allow it to behave as it did previously
 * until someone explicitly passes an IdentityApi. When we have reasonable confidence that most backstage deployments
 * are using the IdentityApi, we can remove this function.
 */
function buildDefaultIdentityClient(options: RouterOptions): IdentityApi {
  return {
    getIdentity: async ({ request }: IdentityApiGetIdentityRequest) => {
      const header = request.headers.authorization;
      const { logger } = options;

      if (!header) {
        return undefined;
      }

      try {
        const token = header.match(/^Bearer\s(\S+\.\S+\.\S+)$/i)?.[1];
        if (!token) {
          throw new TypeError('Expected Bearer with JWT');
        }

        const [_header, rawPayload, _signature] = token.split('.');
        const payload: JsonValue = JSON.parse(
          Buffer.from(rawPayload, 'base64').toString(),
        );

        if (
          typeof payload !== 'object' ||
          payload === null ||
          Array.isArray(payload)
        ) {
          throw new TypeError('Malformed JWT payload');
        }

        const sub = payload.sub;
        if (typeof sub !== 'string') {
          throw new TypeError('Expected string sub claim');
        }

        if (sub === 'backstage-server') {
          return undefined;
        }

        // Check that it's a valid ref, otherwise this will throw.
        parseEntityRef(sub);

        return {
          identity: {
            userEntityRef: sub,
            ownershipEntityRefs: [],
            type: 'user',
          },
          token,
        };
      } catch (e) {
        logger.error(`Invalid authorization header: ${stringifyError(e)}`);
        return undefined;
      }
    },
  };
}

const readDuration = (
  config: Config,
  key: string,
  defaultValue: HumanDuration,
) => {
  if (config.has(key)) {
    return readDurationFromConfig(config, { key });
  }
  return defaultValue;
};

/**
 * A method to create a router for the scaffolder backend plugin.
 * @public
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  // Be generous in upload size to support a wide range of templates in dry-run mode.
  router.use(express.json({ limit: '10MB' }));

  const {
    logger: parentLogger,
    config,
    reader,
    database,
    catalogClient,
    actions,
    taskWorkers,
    scheduler,
    additionalTemplateFilters,
    additionalTemplateGlobals,
    permissions,
    permissionRules,
  } = options;
  const concurrentTasksLimit =
    options.concurrentTasksLimit ??
    options.config.getOptionalNumber('scaffolder.concurrentTasksLimit');

  const logger = parentLogger.child({ plugin: 'scaffolder' });

  const identity: IdentityApi =
    options.identity || buildDefaultIdentityClient(options);
  const workingDirectory = await getWorkingDirectory(config, logger);
  const integrations = ScmIntegrations.fromConfig(config);

  let taskBroker: TaskBroker;
  if (!options.taskBroker) {
    const databaseTaskStore = await DatabaseTaskStore.create({ database });
    taskBroker = new StorageTaskBroker(databaseTaskStore, logger, config);

    if (scheduler && databaseTaskStore.listStaleTasks) {
      await scheduler.scheduleTask({
        id: 'close_stale_tasks',
        frequency: readDuration(
          config,
          'scaffolder.taskTimeoutJanitorFrequency',
          {
            minutes: 5,
          },
        ),
        timeout: { minutes: 15 },
        fn: async () => {
          const { tasks } = await databaseTaskStore.listStaleTasks({
            timeoutS: Duration.fromObject(
              readDuration(config, 'scaffolder.taskTimeout', {
                hours: 24,
              }),
            ).as('seconds'),
          });

          for (const task of tasks) {
            await databaseTaskStore.shutdownTask(task);
            logger.info(`Successfully closed stale task ${task.taskId}`);
          }
        },
      });
    }
  } else {
    taskBroker = options.taskBroker;
  }

  const actionRegistry = new TemplateActionRegistry();

  const workers: TaskWorker[] = [];
  if (concurrentTasksLimit !== 0) {
    for (let i = 0; i < (taskWorkers || 1); i++) {
      const worker = await TaskWorker.create({
        taskBroker,
        actionRegistry,
        integrations,
        logger,
        workingDirectory,
        additionalTemplateFilters,
        additionalTemplateGlobals,
        concurrentTasksLimit,
        permissions,
      });
      workers.push(worker);
    }
  }

  const actionsToRegister = Array.isArray(actions)
    ? actions
    : createBuiltinActions({
        integrations,
        catalogClient,
        reader,
        config,
        additionalTemplateFilters,
        additionalTemplateGlobals,
      });

  actionsToRegister.forEach(action => actionRegistry.register(action));

  const launchWorkers = () => workers.forEach(worker => worker.start());

  const shutdownWorkers = () => {
    workers.forEach(worker => worker.stop());
  };

  if (options.lifecycle) {
    options.lifecycle.addStartupHook(launchWorkers);
    options.lifecycle.addShutdownHook(shutdownWorkers);
  } else {
    launchWorkers();
  }

  const dryRunner = createDryRunner({
    actionRegistry,
    integrations,
    logger,
    workingDirectory,
    additionalTemplateFilters,
    additionalTemplateGlobals,
    permissions,
  });

  const templateRules: TemplatePermissionRuleInput[] = Object.values(
    scaffolderTemplateRules,
  );
  const actionRules: ActionPermissionRuleInput[] = Object.values(
    scaffolderActionRules,
  );

  if (permissionRules) {
    templateRules.push(
      ...permissionRules.filter(isTemplatePermissionRuleInput),
    );
    actionRules.push(...permissionRules.filter(isActionPermissionRuleInput));
  }

  const isAuthorized = createConditionAuthorizer(Object.values(templateRules));

  const permissionIntegrationRouter = createPermissionIntegrationRouter({
    resources: [
      {
        resourceType: RESOURCE_TYPE_SCAFFOLDER_TEMPLATE,
        permissions: scaffolderTemplatePermissions,
        rules: templateRules,
      },
      {
        resourceType: RESOURCE_TYPE_SCAFFOLDER_ACTION,
        permissions: scaffolderActionPermissions,
        rules: actionRules,
      },
    ],
  });

  router.use(permissionIntegrationRouter);

  router
    .get(
      '/v2/templates/:namespace/:kind/:name/parameter-schema',
      async (req, res) => {
        const userIdentity = await identity.getIdentity({
          request: req,
        });
        const token = userIdentity?.token;

        const template = await authorizeTemplate(req.params, token);

        const parameters = [template.spec.parameters ?? []].flat();

        const presentation = template.spec.presentation;

        res.json({
          title: template.metadata.title ?? template.metadata.name,
          ...(presentation ? { presentation } : {}),
          description: template.metadata.description,
          'ui:options': template.metadata['ui:options'],
          steps: parameters.map(schema => ({
            title: schema.title ?? 'Please enter the following information',
            description: schema.description,
            schema,
          })),
        });
      },
    )
    .get('/v2/actions', async (_req, res) => {
      const actionsList = actionRegistry.list().map(action => {
        return {
          id: action.id,
          description: action.description,
          examples: action.examples,
          schema: action.schema,
        };
      });
      res.json(actionsList);
    })
    .post('/v2/tasks', async (req, res) => {
      const templateRef: string = req.body.templateRef;
      const { kind, namespace, name } = parseEntityRef(templateRef, {
        defaultKind: 'template',
      });

      const callerIdentity = await identity.getIdentity({
        request: req,
      });
      const token = callerIdentity?.token;
      const userEntityRef = callerIdentity?.identity.userEntityRef;

      const userEntity = userEntityRef
        ? await catalogClient.getEntityByRef(userEntityRef, { token })
        : undefined;

      let auditLog = `Scaffolding task for ${templateRef}`;
      if (userEntityRef) {
        auditLog += ` created by ${userEntityRef}`;
      }
      logger.info(auditLog);

      const values = req.body.values;

      const template = await authorizeTemplate(
        { kind, namespace, name },
        token,
      );

      for (const parameters of [template.spec.parameters ?? []].flat()) {
        const result = validate(values, parameters);

        if (!result.valid) {
          res.status(400).json({ errors: result.errors });
          return;
        }
      }

      const baseUrl = getEntityBaseUrl(template);

      const taskSpec: TaskSpec = {
        apiVersion: template.apiVersion,
        steps: template.spec.steps.map((step, index) => ({
          ...step,
          id: step.id ?? `step-${index + 1}`,
          name: step.name ?? step.action,
        })),
        EXPERIMENTAL_recovery: template.spec.EXPERIMENTAL_recovery,
        output: template.spec.output ?? {},
        parameters: values,
        user: {
          entity: userEntity as UserEntity,
          ref: userEntityRef,
        },
        templateInfo: {
          entityRef: stringifyEntityRef({ kind, name, namespace }),
          baseUrl,
          entity: {
            metadata: template.metadata,
          },
        },
      };

      const result = await taskBroker.dispatch({
        spec: taskSpec,
        createdBy: userEntityRef,
        secrets: {
          ...req.body.secrets,
          backstageToken: token,
        },
      });

      res.status(201).json({ id: result.taskId });
    })
    .get('/v2/tasks', async (req, res) => {
      const [userEntityRef] = [req.query.createdBy].flat();

      if (
        typeof userEntityRef !== 'string' &&
        typeof userEntityRef !== 'undefined'
      ) {
        throw new InputError('createdBy query parameter must be a string');
      }

      if (!taskBroker.list) {
        throw new Error(
          'TaskBroker does not support listing tasks, please implement the list method on the TaskBroker.',
        );
      }

      const tasks = await taskBroker.list({
        createdBy: userEntityRef,
      });

      res.status(200).json(tasks);
    })
    .get('/v2/tasks/:taskId', async (req, res) => {
      const { taskId } = req.params;
      const task = await taskBroker.get(taskId);
      if (!task) {
        throw new NotFoundError(`Task with id ${taskId} does not exist`);
      }
      // Do not disclose secrets
      delete task.secrets;
      res.status(200).json(task);
    })
    .post('/v2/tasks/:taskId/cancel', async (req, res) => {
      const { taskId } = req.params;
      await taskBroker.cancel?.(taskId);
      res.status(200).json({ status: 'cancelled' });
    })
    .get('/v2/tasks/:taskId/eventstream', async (req, res) => {
      const { taskId } = req.params;
      const after =
        req.query.after !== undefined ? Number(req.query.after) : undefined;

      logger.debug(`Event stream observing taskId '${taskId}' opened`);

      // Mandatory headers and http status to keep connection open
      res.writeHead(200, {
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/event-stream',
      });

      // After client opens connection send all events as string
      const subscription = taskBroker.event$({ taskId, after }).subscribe({
        error: error => {
          logger.error(
            `Received error from event stream when observing taskId '${taskId}', ${error}`,
          );
          res.end();
        },
        next: ({ events }) => {
          let shouldUnsubscribe = false;
          for (const event of events) {
            res.write(
              `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
            );
            if (event.type === 'completion') {
              shouldUnsubscribe = true;
            }
          }
          // res.flush() is only available with the compression middleware
          res.flush?.();
          if (shouldUnsubscribe) {
            subscription.unsubscribe();
            res.end();
          }
        },
      });

      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        subscription.unsubscribe();
        logger.debug(`Event stream observing taskId '${taskId}' closed`);
      });
    })
    .get('/v2/tasks/:taskId/events', async (req, res) => {
      const { taskId } = req.params;
      const after = Number(req.query.after) || undefined;

      // cancel the request after 30 seconds. this aligns with the recommendations of RFC 6202.
      const timeout = setTimeout(() => {
        res.json([]);
      }, 30_000);

      // Get all known events after an id (always includes the completion event) and return the first callback
      const subscription = taskBroker.event$({ taskId, after }).subscribe({
        error: error => {
          logger.error(
            `Received error from event stream when observing taskId '${taskId}', ${error}`,
          );
        },
        next: ({ events }) => {
          clearTimeout(timeout);
          subscription.unsubscribe();
          res.json(events);
        },
      });

      // When client closes connection we update the clients list
      // avoiding the disconnected one
      req.on('close', () => {
        subscription.unsubscribe();
        clearTimeout(timeout);
      });
    })
    .post('/v2/dry-run', async (req, res) => {
      const bodySchema = z.object({
        template: z.unknown(),
        values: z.record(z.unknown()),
        secrets: z.record(z.string()).optional(),
        directoryContents: z.array(
          z.object({ path: z.string(), base64Content: z.string() }),
        ),
      });
      const body = await bodySchema.parseAsync(req.body).catch(e => {
        throw new InputError(`Malformed request: ${e}`);
      });

      const template = body.template as TemplateEntityV1beta3;
      if (!(await templateEntityV1beta3Validator.check(template))) {
        throw new InputError('Input template is not a template');
      }

      const token = (
        await identity.getIdentity({
          request: req,
        })
      )?.token;

      for (const parameters of [template.spec.parameters ?? []].flat()) {
        const result = validate(body.values, parameters);
        if (!result.valid) {
          res.status(400).json({ errors: result.errors });
          return;
        }
      }

      const steps = template.spec.steps.map((step, index) => ({
        ...step,
        id: step.id ?? `step-${index + 1}`,
        name: step.name ?? step.action,
      }));

      const result = await dryRunner({
        spec: {
          apiVersion: template.apiVersion,
          steps,
          output: template.spec.output ?? {},
          parameters: body.values as JsonObject,
        },
        directoryContents: (body.directoryContents ?? []).map(file => ({
          path: file.path,
          content: Buffer.from(file.base64Content, 'base64'),
        })),
        secrets: {
          ...body.secrets,
          ...(token && { backstageToken: token }),
        },
      });

      res.status(200).json({
        ...result,
        steps,
        directoryContents: result.directoryContents.map(file => ({
          path: file.path,
          executable: file.executable,
          base64Content: file.content.toString('base64'),
        })),
      });
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  async function authorizeTemplate(
    entityRef: CompoundEntityRef,
    token: string | undefined,
  ) {
    const template = await findTemplate({
      catalogApi: catalogClient,
      entityRef,
      token,
    });

    if (!isSupportedTemplate(template)) {
      throw new InputError(
        `Unsupported apiVersion field in schema entity, ${
          (template as Entity).apiVersion
        }`,
      );
    }

    if (!permissions) {
      return template;
    }

    const [parameterDecision, stepDecision] =
      await permissions.authorizeConditional(
        [
          { permission: templateParameterReadPermission },
          { permission: templateStepReadPermission },
        ],
        { token },
      );

    // Authorize parameters
    if (Array.isArray(template.spec.parameters)) {
      template.spec.parameters = template.spec.parameters.filter(step =>
        isAuthorized(parameterDecision, step),
      );
    } else if (
      template.spec.parameters &&
      !isAuthorized(parameterDecision, template.spec.parameters)
    ) {
      template.spec.parameters = undefined;
    }

    // Authorize steps
    template.spec.steps = template.spec.steps.filter(step =>
      isAuthorized(stepDecision, step),
    );

    return template;
  }

  return app;
}
