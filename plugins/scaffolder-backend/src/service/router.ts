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

import {
  AuditorService,
  AuditorServiceEvent,
  AuthService,
  BackstageCredentials,
  DatabaseService,
  HttpAuthService,
  LifecycleService,
  LoggerService,
  PermissionsRegistryService,
  PermissionsService,
  resolveSafeChildPath,
  SchedulerService,
} from '@backstage/backend-plugin-api';
import { validate, ValidatorResult } from 'jsonschema';
import {
  CompoundEntityRef,
  Entity,
  parseEntityRef,
  stringifyEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import { Config, readDurationFromConfig } from '@backstage/config';
import { InputError, NotFoundError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';

import { EventsService } from '@backstage/plugin-events-node';

import {
  ConditionTransformer,
  createConditionAuthorizer,
  createConditionTransformer,
} from '@backstage/plugin-permission-node';
import {
  TaskSpec,
  TemplateEntityV1beta3,
  templateEntityV1beta3Validator,
} from '@backstage/plugin-scaffolder-common';
import {
  scaffolderActionPermissions,
  scaffolderTaskPermissions,
  scaffolderTemplatePermissions,
  taskCancelPermission,
  taskCreatePermission,
  taskReadPermission,
  templateDryRunPermission,
  templateManagementPermission,
  templateParameterReadPermission,
  templateStepReadPermission,
} from '@backstage/plugin-scaffolder-common/alpha';
import {
  TaskBroker,
  TaskFilters,
  SerializedTask,
  SerializedTaskEvent,
  TaskStatus,
  TemplateAction,
  TemplateFilter,
  TemplateGlobal,
} from '@backstage/plugin-scaffolder-node';
import {
  AutocompleteHandler,
  CreatedTemplateFilter,
  CreatedTemplateGlobal,
  scaffolderActionPermissionResourceRef,
  scaffolderTaskPermissionResourceRef,
  scaffolderTemplatePermissionResourceRef,
  WorkspaceProvider,
} from '@backstage/plugin-scaffolder-node/alpha';
import { HumanDuration, JsonObject, JsonValue } from '@backstage/types';
import express from 'express';
import { Duration } from 'luxon';
import { pathToFileURL } from 'node:url';
import { randomUUID as uuid } from 'node:crypto';
import { z } from 'zod/v3';
import {
  DatabaseTaskStore,
  DefaultTemplateActionRegistry,
  TaskWorker,
} from '../scaffolder';
import { createDryRunner } from '../scaffolder/dryrun';
import { StorageTaskBroker } from '../scaffolder/tasks/StorageTaskBroker';
import { isTaskRecoveryEnabled } from '../scaffolder/tasks/taskRecoveryHelper';
import { InternalTaskSecrets } from '../scaffolder/tasks/types';
import { createOpenApiRouter } from '../schema/openapi';
import type { SerializedTask as SerializedTaskResponse } from '../schema/openapi/generated/models/SerializedTask.model';
import {
  checkPermission,
  checkTaskPermission,
  getAuthorizeConditions,
} from '../util/checkPermissions';
import {
  findTemplate,
  getEntityBaseUrl,
  getWorkingDirectory,
  parseStringsParam,
} from './helpers';

import {
  convertFiltersToRecord,
  convertGlobalsToRecord,
  extractFilterMetadata,
  extractGlobalFunctionMetadata,
  extractGlobalValueMetadata,
} from '../util/templating';
import { SystemSecretSource } from '../scaffolder/tasks/SystemSecretSource';
import { TaskRedacter } from '../scaffolder/tasks/TaskRedacter';
import { SystemSecretProvider } from '../scaffolder/tasks/TaskRunContext';
import { collectTaskSecretValues } from '../scaffolder/tasks/taskSecrets';
import { createDefaultFilters } from '../lib/templating/filters/createDefaultFilters';
import {
  ActionPermissionRuleInput,
  isActionPermissionRuleInput,
  isTaskPermissionRuleInput,
  isTemplatePermissionRuleInput,
  ScaffolderPermissionRuleInput,
  TaskPermissionRuleInput,
  TemplatePermissionRuleInput,
} from './permissions';
import { CatalogService } from '@backstage/plugin-catalog-node';

import {
  scaffolderActionRules,
  scaffolderTaskRules,
  scaffolderTemplateRules,
} from './rules';
import {
  ActionsService,
  MetricsService,
} from '@backstage/backend-plugin-api/alpha';

/**
 * RouterOptions
 */
export interface RouterOptions {
  logger: LoggerService;
  config: Config;
  lifecycle?: LifecycleService;
  database: DatabaseService;
  catalog: CatalogService;
  scheduler?: SchedulerService;
  actions?: TemplateAction<any, any, any>[];
  /**
   * Sets the number of concurrent tasks that can be run at any given time on the TaskWorker
   * @defaultValue 10
   */
  concurrentTasksLimit?: number;
  taskBroker?: TaskBroker;
  additionalTemplateFilters?:
    | Record<string, TemplateFilter>
    | CreatedTemplateFilter<any, any>[];
  additionalTemplateGlobals?:
    | Record<string, TemplateGlobal>
    | CreatedTemplateGlobal[];
  additionalWorkspaceProviders?: Record<string, WorkspaceProvider>;
  permissions?: PermissionsService;
  permissionsRegistry: PermissionsRegistryService;
  permissionRules?: Array<ScaffolderPermissionRuleInput>;
  auth: AuthService;
  httpAuth: HttpAuthService;
  events?: EventsService;
  auditor?: AuditorService;
  autocompleteHandlers?: Record<string, AutocompleteHandler>;
  actionsRegistry: ActionsService;
  metrics: MetricsService;
}

function isSupportedTemplate(entity: TemplateEntityV1beta3) {
  return entity.apiVersion === 'scaffolder.backstage.io/v1beta3';
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

const taskOrderFields = new Set(['created_at', 'status', 'created_by']);

function formatSecretsValidationErrors(result: ValidatorResult) {
  return result.errors.map(err => {
    const property = err.property.replace(/^instance/, 'secrets');
    const secretName = err.argument;
    const message =
      err.name === 'required'
        ? `secrets.${secretName} is required`
        : `${property} ${err.message}`;
    return {
      ...err,
      property,
      message,
      instance: {},
    };
  });
}

async function validateSecrets(options: {
  template: TemplateEntityV1beta3;
  secrets: Record<string, unknown>;
  res: express.Response;
  auditorEvent?: AuditorServiceEvent;
  redacter: TaskRedacter;
}): Promise<boolean> {
  const { template, secrets, res, auditorEvent, redacter } = options;
  if (!template.spec.secrets?.schema) {
    return true;
  }

  const result = validate(secrets, template.spec.secrets.schema);
  if (result.valid) {
    return true;
  }

  await auditorEvent?.fail({
    error: new InputError('Secrets validation failed'),
  });

  const errors = formatSecretsValidationErrors(result);
  res.status(400).json({
    errors: redacter.redactJson(
      errors as unknown as JsonValue,
    ) as unknown as typeof errors,
  });
  return false;
}

function serializeTask(task: SerializedTask): SerializedTaskResponse {
  return {
    id: task.id,
    spec: task.spec,
    status: task.status,
    createdAt: task.createdAt,
    lastHeartbeatAt: task.lastHeartbeatAt,
    createdBy: task.createdBy,
  };
}

export function createRequestRedaction(options: {
  request: express.Request<any, any, any, any>;
  systemSecrets: SystemSecretProvider;
  secrets?: Record<string, unknown>;
}) {
  const redacter = new TaskRedacter({
    maxValues: 128,
    maxTotalLength: 16 * 1024,
  });
  const subscription = options.systemSecrets.subscribe(secrets => {
    redacter.add(secrets);
  });
  redacter.add(subscription.secrets);
  if (options.secrets) {
    redacter.addJson(options.secrets as JsonValue);
  }
  const authorization = options.request.headers?.authorization;
  if (typeof authorization === 'string') {
    redacter.add([authorization]);
    if (authorization.slice(0, 6).toLowerCase() === 'bearer') {
      let index = 6;
      if (authorization[index] === ' ' || authorization[index] === '\t') {
        while (authorization[index] === ' ' || authorization[index] === '\t') {
          index += 1;
        }
        if (index < authorization.length) {
          redacter.add([authorization.slice(index)]);
        }
      }
    }
  }

  let requestBody = options.request.body as JsonValue;
  if (
    options.secrets &&
    requestBody &&
    typeof requestBody === 'object' &&
    !Array.isArray(requestBody)
  ) {
    requestBody = Object.fromEntries(
      Object.entries(requestBody).map(([key, value]) => [
        key,
        key === 'secrets' ? {} : value,
      ]),
    ) as JsonObject;
  }

  // Routes resolve credentials on the original request before passing this
  // facade to the auditor. The default HTTP auth service then reads its cached
  // credentials through the prototype without needing raw headers here.
  const request = Object.create(options.request) as express.Request;
  Object.defineProperties(request, {
    body: {
      configurable: true,
      enumerable: true,
      get: () => redacter.redactJson(requestBody),
    },
    headers: {
      configurable: true,
      enumerable: true,
      get: () =>
        redacter.redactJson(
          options.request.headers as JsonValue,
        ) as express.Request['headers'],
    },
    rawHeaders: {
      configurable: true,
      enumerable: true,
      get: () =>
        options.request.rawHeaders?.map(value => redacter.redactString(value)),
    },
    originalUrl: {
      configurable: true,
      enumerable: true,
      get: () =>
        typeof options.request.originalUrl === 'string'
          ? redacter.redactString(options.request.originalUrl)
          : options.request.originalUrl,
    },
    url: {
      configurable: true,
      enumerable: true,
      get: () =>
        typeof options.request.url === 'string'
          ? redacter.redactString(options.request.url)
          : options.request.url,
    },
    query: {
      configurable: true,
      enumerable: true,
      get: () => redacter.redactJson(options.request.query as JsonValue),
    },
    params: {
      configurable: true,
      enumerable: true,
      get: () => redacter.redactJson(options.request.params as JsonValue),
    },
  });
  const protectCall = async <T>(operation: () => Promise<T>): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      throw redacter.redactError(error);
    }
  };

  return {
    redacter,
    request,
    protectAuditorEvent(
      event: AuditorServiceEvent | undefined,
    ): AuditorServiceEvent | undefined {
      if (!event) {
        return undefined;
      }
      return {
        success: async eventOptions => {
          await protectCall(() =>
            event.success(
              eventOptions?.meta
                ? {
                    meta: redacter.redactJson(eventOptions.meta) as JsonObject,
                  }
                : undefined,
            ),
          );
        },
        fail: async eventOptions => {
          await protectCall(() =>
            event.fail({
              error: redacter.redactError(eventOptions.error),
              meta: eventOptions.meta
                ? (redacter.redactJson(eventOptions.meta) as JsonObject)
                : undefined,
            }),
          );
        },
      };
    },
    dispose() {
      subscription.unsubscribe();
    },
  };
}

function projectPublicEvents(
  events: SerializedTaskEvent[],
  redacter: TaskRedacter,
): SerializedTaskEvent[] {
  return events.map(event => ({
    ...event,
    body: redacter.redactJson(
      event.body,
    ) as unknown as SerializedTaskEvent['body'],
  }));
}
/**
 * A method to create a router for the scaffolder backend plugin.
 */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = await createOpenApiRouter({
    middleware: [
      // Be generous in upload size to support a wide range of templates in dry-run mode.
      express.json({ limit: '10MB' }),
    ],
  });

  const {
    logger: parentLogger,
    config,
    database,
    catalog,
    actions = [],
    scheduler,
    additionalTemplateFilters,
    additionalTemplateGlobals,
    additionalWorkspaceProviders,
    permissions,
    permissionsRegistry,
    permissionRules,
    autocompleteHandlers = {},
    events: eventsService,
    auth,
    httpAuth,
    auditor,
    actionsRegistry,
    metrics,
  } = options;

  const concurrentTasksLimit =
    options.concurrentTasksLimit ??
    options.config.getOptionalNumber('scaffolder.concurrentTasksLimit');

  const logger = parentLogger.child({ plugin: 'scaffolder' });

  const workingDirectory = await getWorkingDirectory(config, logger);
  const integrations = ScmIntegrations.fromConfig(config);
  const systemSecrets = await SystemSecretSource.create({ config, logger });

  let taskBroker: TaskBroker;
  if (!options.taskBroker) {
    const databaseTaskStore = await DatabaseTaskStore.create({
      database,
      events: eventsService,
      systemSecrets,
      recoverTasksEnabled: isTaskRecoveryEnabled(config),
    });
    taskBroker = new StorageTaskBroker(
      databaseTaskStore,
      logger,
      config,
      auth,
      additionalWorkspaceProviders,
      auditor,
      systemSecrets,
    );

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

  const actionRegistry = new DefaultTemplateActionRegistry(
    actionsRegistry,
    logger,
  );

  const templateExtensions = {
    additionalTemplateFilters: convertFiltersToRecord(
      additionalTemplateFilters,
    ),
    additionalTemplateGlobals: convertGlobalsToRecord(
      additionalTemplateGlobals,
    ),
  };

  const workers: TaskWorker[] = [];
  const gracefulShutdown = config.getOptionalBoolean(
    'scaffolder.EXPERIMENTAL_gracefulShutdown',
  );
  if (concurrentTasksLimit !== 0) {
    const worker = await TaskWorker.create({
      taskBroker,
      actionRegistry,
      integrations,
      logger,
      auditor,
      config,
      workingDirectory,
      concurrentTasksLimit,
      permissions,
      gracefulShutdown,
      metrics,
      systemSecrets,
      ...templateExtensions,
    });

    workers.push(worker);
  }

  for (const action of actions) {
    actionRegistry.register(action);
  }

  const launchWorkers = () => workers.forEach(worker => worker.start());

  const shutdownWorkers = async () => {
    await Promise.allSettled(workers.map(worker => worker.stop()));
    const closeSystemSecrets = Promise.all(
      workers.map(worker => worker.waitUntilIdle()),
    ).then(() => systemSecrets.close());
    if (gracefulShutdown || workers.length === 0) {
      await closeSystemSecrets;
    } else {
      void closeSystemSecrets.catch(() => {
        logger.error('Failed to close the Scaffolder system secret source');
      });
    }
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
    auditor,
    workingDirectory,
    permissions,
    config,
    metrics,
    systemSecrets,
    ...templateExtensions,
  });

  const templateRules: TemplatePermissionRuleInput[] = Object.values(
    scaffolderTemplateRules,
  );
  const actionRules: ActionPermissionRuleInput[] = Object.values(
    scaffolderActionRules,
  );
  const taskRules: TaskPermissionRuleInput[] =
    Object.values(scaffolderTaskRules);

  if (permissionRules) {
    templateRules.push(
      ...permissionRules.filter(isTemplatePermissionRuleInput),
    );
    actionRules.push(...permissionRules.filter(isActionPermissionRuleInput));
    taskRules.push(...permissionRules.filter(isTaskPermissionRuleInput));
  }

  const isTemplateAuthorized = createConditionAuthorizer(
    Object.values(templateRules),
  );
  const isTaskAuthorized = createConditionAuthorizer(Object.values(taskRules));

  const taskTransformConditions: ConditionTransformer<TaskFilters> =
    createConditionTransformer(Object.values(taskRules));

  permissionsRegistry.addResourceType({
    resourceRef: scaffolderTemplatePermissionResourceRef,
    permissions: scaffolderTemplatePermissions,
    rules: templateRules,
  });

  permissionsRegistry.addResourceType({
    resourceRef: scaffolderActionPermissionResourceRef,
    permissions: scaffolderActionPermissions,
    rules: actionRules,
  });

  permissionsRegistry.addResourceType({
    resourceRef: scaffolderTaskPermissionResourceRef,
    permissions: scaffolderTaskPermissions,
    rules: taskRules,
    getResources: async resourceRefs => {
      return Promise.all(
        resourceRefs.map(async taskId => {
          return await taskBroker.get(taskId);
        }),
      );
    },
  });

  permissionsRegistry.addPermissions([
    taskCreatePermission,
    templateDryRunPermission,
    templateManagementPermission,
  ]);

  router
    .get(
      '/v2/templates/:namespace/:kind/:name/parameter-schema',
      async (req, res) => {
        const requestedTemplateRef = `${req.params.kind}:${req.params.namespace}/${req.params.name}`;
        const requestRedaction = createRequestRedaction({
          request: req,
          systemSecrets,
        });
        let auditorEvent: AuditorServiceEvent | undefined;

        try {
          const credentials = await httpAuth.credentials(req);
          requestRedaction.redacter.add([(credentials as any).token]);
          auditorEvent = requestRedaction.protectAuditorEvent(
            await auditor?.createEvent({
              eventId: 'template-parameter-schema',
              request: requestRedaction.request,
              meta: { templateRef: requestedTemplateRef },
            }),
          );

          const template = await authorizeTemplate(req.params, credentials);

          const parameters = [template.spec.parameters ?? []].flat();

          const presentation = template.spec.presentation;

          const templateRef = `${template.kind}:${
            template.metadata.namespace || 'default'
          }/${template.metadata.name}`;

          await auditorEvent?.success({ meta: { templateRef: templateRef } });

          const response = {
            title: template.metadata.title ?? template.metadata.name,
            ...(presentation ? { presentation } : {}),
            description: template.metadata.description,
            'ui:options': template.metadata['ui:options'],
            steps: parameters.map(schema => ({
              title:
                (schema.title as string) ??
                'Please enter the following information',
              description: schema.description as string,
              schema,
            })),
            formDecorators:
              template.spec.formDecorators ??
              template.spec.EXPERIMENTAL_formDecorators,
          };
          res.json(
            requestRedaction.redacter.redactJson(
              response as unknown as JsonValue,
            ) as unknown as typeof response,
          );
        } catch (err) {
          const error = requestRedaction.redacter.redactError(err);
          await auditorEvent?.fail({ error });
          throw error;
        } finally {
          requestRedaction.dispose();
        }
      },
    )
    .get('/v2/actions', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'action-fetch',
            request: requestRedaction.request,
          }),
        );
        const list = await actionRegistry.list({ credentials });
        const actionsList = Array.from(list.values())
          .map(action => {
            return {
              id: action.id,
              description: action.description,
              examples: action.examples,
              schema: action.schema,
            };
          })
          .sort((a, b) => a.id.localeCompare(b.id));

        await auditorEvent?.success();

        res.json(
          requestRedaction.redacter.redactJson(
            actionsList as unknown as JsonValue,
          ) as unknown as typeof actionsList,
        );
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .post('/v2/tasks', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
        secrets: req.body.secrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const templateRef: string = req.body.templateRef;
        const { kind, namespace, name } = parseEntityRef(templateRef, {
          defaultKind: 'template',
        });
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            severityLevel: 'medium',
            request: requestRedaction.request,
            meta: requestRedaction.redacter.redactJson({
              actionType: 'create',
              templateRef: templateRef,
            }) as JsonObject,
          }),
        );
        await checkPermission({
          credentials,
          permissions: [taskCreatePermission],
          permissionService: permissions,
        });

        const userEntityRef = auth.isPrincipal(credentials, 'user')
          ? credentials.principal.userEntityRef
          : undefined;

        const userEntity = userEntityRef
          ? await catalog.getEntityByRef(userEntityRef, { credentials })
          : undefined;

        let auditLog = `Scaffolding task for ${templateRef}`;
        if (userEntityRef) {
          auditLog += ` created by ${userEntityRef}`;
        }
        logger.info(requestRedaction.redacter.redactString(auditLog));

        const values = req.body.values;

        const template = await authorizeTemplate(
          { kind, namespace, name },
          credentials,
        );

        for (const parameters of [template.spec.parameters ?? []].flat()) {
          const result = validate(values, parameters);

          if (!result.valid) {
            await auditorEvent?.fail({
              // TODO(Rugvip): Seems like there aren't proper types for AggregateError yet
              error: (AggregateError as any)(
                result.errors,
                'Could not create entity',
              ),
            });

            res.status(400).json({
              errors: requestRedaction.redacter.redactJson(
                result.errors as unknown as JsonValue,
              ) as unknown as typeof result.errors,
            });
            return;
          }
        }

        const secretsValid = await validateSecrets({
          template,
          secrets: req.body.secrets ?? {},
          res,
          auditorEvent,
          redacter: requestRedaction.redacter,
        });
        if (!secretsValid) {
          return;
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

        const secrets: InternalTaskSecrets = {
          ...req.body.secrets,
          backstageToken: (credentials as any).token,
          __initiatorCredentials: JSON.stringify({
            ...credentials,
            // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
            token: (credentials as any).token,
          }),
        };

        const result = await taskBroker.dispatch({
          spec: taskSpec,
          createdBy: userEntityRef,
          secrets,
        });

        await auditorEvent?.success({ meta: { taskId: result.taskId } });

        res.status(201).json({ id: result.taskId });
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .get('/v2/tasks', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            request: requestRedaction.request,
            meta: { actionType: 'list' },
          }),
        );

        if (!taskBroker.list) {
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

          if (!taskOrderFields.has(match[2])) {
            throw new InputError(`Invalid order field "${match[2]}"`);
          }

          return {
            order: match[1] as 'asc' | 'desc',
            field: match[2],
          };
        });

        const { limit, offset } = req.query;

        const taskPermissionFilters = await getAuthorizeConditions({
          credentials: credentials,
          permission: taskReadPermission,
          permissionService: permissions,
          transformConditions: taskTransformConditions,
        });

        const taskList = await taskBroker.list({
          filters: {
            createdBy,
            status: status ? (status as TaskStatus[]) : undefined,
          },
          order,
          pagination: {
            limit,
            offset,
          },
          permissionFilters: taskPermissionFilters,
        });

        await auditorEvent?.success();

        for (const task of taskList.tasks) {
          if (task.secrets) {
            requestRedaction.redacter.add(
              collectTaskSecretValues(task.secrets),
            );
          }
        }
        const response = {
          tasks: taskList.tasks.map(serializeTask),
          totalTasks: taskList.totalTasks,
        };
        res
          .status(200)
          .json(
            requestRedaction.redacter.redactJson(
              response as unknown as JsonValue,
            ) as unknown as typeof response,
          );
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .get('/v2/tasks/:taskId', async (req, res) => {
      const { taskId } = req.params;
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            request: requestRedaction.request,
            meta: { actionType: 'get', taskId: taskId },
          }),
        );

        const task = await taskBroker.get(taskId);
        if (task.secrets) {
          requestRedaction.redacter.add(collectTaskSecretValues(task.secrets));
        }

        await checkTaskPermission({
          credentials,
          permissions: [taskReadPermission],
          permissionService: permissions,
          task: task,
          isTaskAuthorized,
        });

        if (!task) {
          throw new NotFoundError(`Task with id ${taskId} does not exist`);
        }

        await auditorEvent?.success();

        const response = serializeTask(task);
        res
          .status(200)
          .json(
            requestRedaction.redacter.redactJson(
              response as unknown as JsonValue,
            ) as unknown as SerializedTaskResponse,
          );
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .post('/v2/tasks/:taskId/cancel', async (req, res) => {
      const { taskId } = req.params;
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            severityLevel: 'medium',
            request: requestRedaction.request,
            meta: { actionType: 'cancel', taskId: taskId },
          }),
        );
        const task = await taskBroker.get(taskId);
        if (task.secrets) {
          requestRedaction.redacter.add(collectTaskSecretValues(task.secrets));
        }
        // Requires both read and cancel permissions
        await checkTaskPermission({
          credentials,
          permissions: [taskCancelPermission, taskReadPermission],
          permissionService: permissions,
          task: task,
          isTaskAuthorized,
        });

        await taskBroker.cancel?.(taskId);

        await auditorEvent?.success();

        res.status(200).json({ status: 'cancelled' });
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .post('/v2/tasks/:taskId/retry', async (req, res) => {
      const { taskId } = req.params;
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
        secrets: req.body.secrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            severityLevel: 'medium',
            request: requestRedaction.request,
            meta: { actionType: 'retry', taskId: taskId },
          }),
        );
        const task = await taskBroker.get(taskId);

        // Requires both read and create permissions
        await checkPermission({
          credentials,
          permissions: [taskCreatePermission],
          permissionService: permissions,
        });

        await checkTaskPermission({
          credentials,
          permissions: [taskReadPermission],
          permissionService: permissions,
          task: task,
          isTaskAuthorized,
        });

        // Validate secrets against template schema if defined
        if (task.spec.templateInfo?.entityRef) {
          const templateEntityRef = parseEntityRef(
            task.spec.templateInfo.entityRef,
            { defaultKind: 'template' },
          );
          const template = await authorizeTemplate(
            templateEntityRef,
            credentials,
          );

          const secretsValid = await validateSecrets({
            template,
            secrets: req.body.secrets ?? {},
            res,
            auditorEvent,
            redacter: requestRedaction.redacter,
          });
          if (!secretsValid) {
            return;
          }
        }

        const { token } = await auth.getPluginRequestToken({
          onBehalfOf: credentials,
          targetPluginId: 'catalog',
        });
        requestRedaction.redacter.add([token]);

        const secrets: InternalTaskSecrets = {
          ...req.body.secrets,
          backstageToken: token,
          __initiatorCredentials: JSON.stringify({
            ...credentials,
            // credentials.token is nonenumerable and will not be serialized, so we need to add it explicitly
            token: (credentials as any).token,
          }),
        };

        await taskBroker.retry?.({ secrets, taskId });
        await auditorEvent?.success();
        res.status(201).json({ id: taskId });
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    });
  (router as express.Router).get(
    '/v2/tasks/:taskId/eventstream',
    async (req, res) => {
      const { taskId } = req.params;
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            request: requestRedaction.request,
            meta: { actionType: 'stream', taskId: taskId },
          }),
        );
        const task = await taskBroker.get(taskId);
        if (task.secrets) {
          requestRedaction.redacter.add(collectTaskSecretValues(task.secrets));
        }

        await checkTaskPermission({
          credentials,
          permissions: [taskReadPermission],
          permissionService: permissions,
          task: task,
          isTaskAuthorized,
        });

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
          error: async error => {
            const projectedError = requestRedaction.redacter.redactError(error);
            logger.error(
              requestRedaction.redacter.redactString(
                `Received error from event stream when observing taskId '${taskId}', ${projectedError.message}`,
              ),
            );
            await auditorEvent?.fail({ error: projectedError });
            res.end();
            requestRedaction.dispose();
          },
          next: ({ events }) => {
            let shouldUnsubscribe = false;
            const projectedEvents = projectPublicEvents(
              events,
              requestRedaction.redacter,
            );
            for (let index = 0; index < events.length; index += 1) {
              const event = events[index];
              const projectedEvent = projectedEvents[index];
              res.write(
                `event: ${event.type}\ndata: ${JSON.stringify(
                  projectedEvent,
                )}\n\n`,
              );
              if (event.type === 'completion' && !event.isTaskRecoverable) {
                shouldUnsubscribe = true;
              }
            }
            // res.flush() is only available with the compression middleware
            res.flush?.();
            if (shouldUnsubscribe) {
              subscription.unsubscribe();
              res.end();
              requestRedaction.dispose();
            }
          },
        });

        // When client closes connection we update the clients list
        // avoiding the disconnected one
        req.on('close', async () => {
          subscription.unsubscribe();
          logger.debug(`Event stream observing taskId '${taskId}' closed`);
          await auditorEvent?.success();
          requestRedaction.dispose();
        });
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        requestRedaction.dispose();
        throw error;
      }
    },
  );
  router
    .get('/v2/tasks/:taskId/events', async (req, res) => {
      const { taskId } = req.params;
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            request: requestRedaction.request,
            meta: { actionType: 'events', taskId: taskId },
          }),
        );
        const task = await taskBroker.get(taskId);
        if (task.secrets) {
          requestRedaction.redacter.add(collectTaskSecretValues(task.secrets));
        }

        await checkTaskPermission({
          credentials,
          permissions: [taskReadPermission],
          permissionService: permissions,
          task: task,
          isTaskAuthorized,
        });

        const after =
          req.query.after !== undefined ? Number(req.query.after) : undefined;

        // cancel the request after 30 seconds. this aligns with the recommendations of RFC 6202.
        const timeout = setTimeout(() => {
          res.json([]);
          requestRedaction.dispose();
        }, 30_000);

        // Get all known events after an id (always includes the completion event) and return the first callback
        const subscription = taskBroker.event$({ taskId, after }).subscribe({
          error: async error => {
            const projectedError = requestRedaction.redacter.redactError(error);
            logger.error(
              requestRedaction.redacter.redactString(
                `Received error from event stream when observing taskId '${taskId}', ${projectedError.message}`,
              ),
            );
            await auditorEvent?.fail({ error: projectedError });
            requestRedaction.dispose();
          },
          next: async ({ events }) => {
            clearTimeout(timeout);
            subscription.unsubscribe();
            await auditorEvent?.success();
            res.json(projectPublicEvents(events, requestRedaction.redacter));
            requestRedaction.dispose();
          },
        });

        // When client closes connection we update the clients list
        // avoiding the disconnected one
        req.on('close', () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
          requestRedaction.dispose();
        });
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        requestRedaction.dispose();
        throw error;
      }
    })
    .post('/v2/dry-run', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
        secrets: req.body.secrets,
      });
      let auditorEvent: AuditorServiceEvent | undefined;

      try {
        const credentials = await httpAuth.credentials(req);
        requestRedaction.redacter.add([(credentials as any).token]);
        auditorEvent = requestRedaction.protectAuditorEvent(
          await auditor?.createEvent({
            eventId: 'task',
            request: requestRedaction.request,
            meta: { actionType: 'dry-run' },
          }),
        );
        await checkPermission({
          credentials,
          permissions: [taskCreatePermission, templateDryRunPermission],
          permissionService: permissions,
        });

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

        const userEntityRef = auth.isPrincipal(credentials, 'user')
          ? credentials.principal.userEntityRef
          : undefined;

        const userEntity = userEntityRef
          ? await catalog.getEntityByRef(userEntityRef, { credentials })
          : undefined;

        const templateRef: string = `${template.kind}:${
          template.metadata.namespace || 'default'
        }/${template.metadata.name}`;

        for (const parameters of [template.spec.parameters ?? []].flat()) {
          const result = validate(body.values, parameters);
          if (!result.valid) {
            await auditorEvent?.fail({
              // TODO(Rugvip): Seems like there aren't proper types for AggregateError yet
              error: (AggregateError as any)(
                result.errors,
                'Could not execute dry run',
              ),
              meta: {
                templateRef: templateRef,
                parameters: template.spec.parameters,
              },
            });

            res.status(400).json({
              errors: requestRedaction.redacter.redactJson(
                result.errors as unknown as JsonValue,
              ) as unknown as typeof result.errors,
            });
            return;
          }
        }

        const secretsValid = await validateSecrets({
          template,
          secrets: body.secrets ?? {},
          res,
          auditorEvent,
          redacter: requestRedaction.redacter,
        });
        if (!secretsValid) {
          return;
        }

        const steps = template.spec.steps.map((step, index) => ({
          ...step,
          id: step.id ?? `step-${index + 1}`,
          name: step.name ?? step.action,
        }));

        const dryRunId = uuid();
        const contentsPath = resolveSafeChildPath(
          workingDirectory,
          `dry-run-content-${dryRunId}`,
        );
        const templateInfo = {
          entityRef: 'template:default/dry-run',
          entity: {
            metadata: template.metadata,
          },
          baseUrl: pathToFileURL(
            resolveSafeChildPath(contentsPath, 'template.yaml'),
          ).toString(),
        };

        const result = await dryRunner({
          spec: {
            apiVersion: template.apiVersion,
            steps,
            output: template.spec.output ?? {},
            parameters: body.values as JsonObject,
            user: {
              entity: userEntity as UserEntity,
              ref: userEntityRef,
            },
          },
          templateInfo: templateInfo,
          directoryContents: (body.directoryContents ?? []).map(file => ({
            path: file.path,
            content: Buffer.from(file.base64Content, 'base64'),
          })),
          secrets: {
            ...body.secrets,
            backstageToken: (credentials as any).token,
          },
          credentials,
        });

        await auditorEvent?.success({
          meta: {
            templateRef: templateRef,
            parameters: template.spec.parameters,
          },
        });

        const response = {
          ...result,
          steps,
          directoryContents: result.directoryContents.map(file => ({
            path: file.path,
            executable: file.executable,
            base64Content: file.content.toString('base64'),
          })),
        };
        res
          .status(200)
          .json(
            requestRedaction.redacter.redactJson(
              response as unknown as JsonValue,
            ) as unknown as typeof response,
          );
      } catch (err) {
        const error = requestRedaction.redacter.redactError(err);
        await auditorEvent?.fail({ error });
        throw error;
      } finally {
        requestRedaction.dispose();
      }
    })
    .post('/v2/autocomplete/:provider/:resource', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });

      try {
        const { token, context } = req.body;
        const { provider, resource } = req.params;
        requestRedaction.redacter.add([token]);

        if (!token) throw new InputError('Missing token query parameter');

        if (!autocompleteHandlers[provider]) {
          throw new InputError(`Unsupported provider: ${provider}`);
        }

        const { results } = await autocompleteHandlers[provider]({
          resource,
          token,
          context,
        });

        res.status(200).json(
          requestRedaction.redacter.redactJson({
            results,
          }) as JsonObject,
        );
      } catch (error) {
        throw requestRedaction.redacter.redactError(error);
      } finally {
        requestRedaction.dispose();
      }
    })
    .get('/v2/templating-extensions', async (req, res) => {
      const requestRedaction = createRequestRedaction({
        request: req,
        systemSecrets,
      });

      try {
        const response = {
          filters: {
            ...extractFilterMetadata(createDefaultFilters({ integrations })),
            ...extractFilterMetadata(additionalTemplateFilters),
          },
          globals: {
            functions: extractGlobalFunctionMetadata(additionalTemplateGlobals),
            values: extractGlobalValueMetadata(additionalTemplateGlobals),
          },
        };
        res
          .status(200)
          .json(
            requestRedaction.redacter.redactJson(
              response as unknown as JsonValue,
            ) as unknown as typeof response,
          );
      } catch (error) {
        throw requestRedaction.redacter.redactError(error);
      } finally {
        requestRedaction.dispose();
      }
    });

  const app = express();
  app.set('logger', logger);
  app.use('/', router);

  async function authorizeTemplate(
    entityRef: CompoundEntityRef,
    credentials: BackstageCredentials,
  ) {
    const template = await findTemplate({
      catalog,
      entityRef,
      credentials,
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
        { credentials },
      );

    // Authorize parameters
    if (Array.isArray(template.spec.parameters)) {
      template.spec.parameters = template.spec.parameters.filter(step =>
        isTemplateAuthorized(parameterDecision, step),
      );
    } else if (
      template.spec.parameters &&
      !isTemplateAuthorized(parameterDecision, template.spec.parameters)
    ) {
      template.spec.parameters = undefined;
    }

    // Authorize steps
    template.spec.steps = template.spec.steps.filter(step =>
      isTemplateAuthorized(stepDecision, step),
    );

    return template;
  }

  return app;
}
