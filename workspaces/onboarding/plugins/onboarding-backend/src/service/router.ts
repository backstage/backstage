/*
 * Copyright 2026 Estehsan Tariq
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
import {
  HttpAuthService,
  LoggerService,
  PermissionsService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { CatalogApi } from '@backstage/catalog-client';
import { InputError, NotAllowedError, NotFoundError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { DatabaseOnboardingStore } from './OnboardingStore';
import {
  OnboardingProgress,
  OnboardingTask,
  OnboardingTemplate,
  Phase,
  ResourceType,
  TaskStatus,
  TaskType,
} from '../types';
import {
  onboardingProgressReadPermission,
  onboardingProgressUpdatePermission,
  onboardingTeamReadPermission,
  onboardingTemplateAssignPermission,
} from '../permissions';

/** @public */
export interface RouterOptions {
  logger: LoggerService;
  config: RootConfigService;
  store: DatabaseOnboardingStore;
  permissions: PermissionsService;
  httpAuth: HttpAuthService;
  catalogApi: CatalogApi;
}

const VALID_STATUSES: TaskStatus[] = [
  'pending',
  'in-progress',
  'done',
  'blocked',
];

function getActiveJoinerWindowDays(config: RootConfigService): number {
  return (
    config.getOptionalNumber('onboarding.defaults.activeJoinerWindowDays') ?? 90
  );
}

/** @public */
export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const { logger, config, store, permissions, httpAuth, catalogApi } = options;

  const router = Router();
  router.use(express.json());

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  router.get('/progress/:userId', async (req, res) => {
    const { userId } = req.params;
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingProgressReadPermission }],
        { credentials },
      )
    )[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    let progress = await store.getProgress(userId);

    if (!progress) {
      const template = await findTemplateForUser(catalogApi, userId, logger);
      if (template) {
        progress = initializeProgress(userId, template);
        await store.upsertProgress(progress);
      }
    }

    if (!progress) {
      throw new NotFoundError(
        `No onboarding progress found for user ${userId}`,
      );
    }

    res.status(200).json(progress);
  });

  router.post('/progress/:userId/tasks/:taskId', async (req, res) => {
    const { userId, taskId } = req.params;
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingProgressUpdatePermission }],
        { credentials },
      )
    )[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const { status, blockedReason } = req.body as {
      status?: TaskStatus;
      blockedReason?: string;
    };

    if (!status || !VALID_STATUSES.includes(status)) {
      throw new InputError(
        `Invalid status: ${status}. Must be one of: ${VALID_STATUSES.join(', ')}`,
      );
    }

    const progress = await store.getProgress(userId);
    if (!progress) {
      throw new NotFoundError(
        `No onboarding progress found for user ${userId}`,
      );
    }

    const taskIndex = progress.tasks.findIndex(t => t.taskId === taskId);
    if (taskIndex === -1) {
      throw new NotFoundError(`Task ${taskId} not found in progress`);
    }

    if (status === 'done') {
      const templates = await getAllTemplates(catalogApi, config, logger);
      const template = templates.find(
        t => t.metadata.name === progress.templateName,
      );

      if (template) {
        const allTasks = template.spec.phases.flatMap(p => p.tasks);
        const currentTask = allTasks.find(t => t.id === taskId);

        if (currentTask?.dependsOn && currentTask.dependsOn.length > 0) {
          const unmetDeps = currentTask.dependsOn.filter(depId => {
            const depProgress = progress.tasks.find(t => t.taskId === depId);
            return !depProgress || depProgress.status !== 'done';
          });

          if (unmetDeps.length > 0) {
            throw new InputError(
              `Cannot mark task ${taskId} as done. Unmet dependencies: ${unmetDeps.join(', ')}`,
            );
          }
        }
      }
    }

    progress.tasks[taskIndex] = {
      ...progress.tasks[taskIndex],
      status,
      completedAt: status === 'done' ? new Date().toISOString() : undefined,
      blockedReason: status === 'blocked' ? blockedReason : undefined,
    };

    await store.upsertProgress(progress);
    logger.info(`Updated task ${taskId} for user ${userId} to ${status}`);

    res.status(200).json(progress);
  });

  router.get('/team/:teamName/stats', async (req, res) => {
    const { teamName } = req.params;
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingTeamReadPermission }],
        { credentials },
      )
    )[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const windowDays = getActiveJoinerWindowDays(config);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - windowDays);

    const teamMembers = await catalogApi.getEntities({
      filter: {
        kind: 'User',
        'relations.memberOf': `group:default/${teamName}`,
      },
    });

    const userIds = teamMembers.items.map(
      e => `user:default/${e.metadata.name}`,
    );
    const allProgress = await store.getTeamProgress(userIds);

    const activeJoiners = allProgress
      .filter(p => {
        const started = new Date(p.startDate);
        const donePercent =
          p.tasks.length > 0
            ? p.tasks.filter(t => t.status === 'done').length / p.tasks.length
            : 0;
        return started >= cutoffDate && donePercent < 1;
      })
      .map(p => {
        const member = teamMembers.items.find(
          e => `user:default/${e.metadata.name}` === p.userId,
        );
        const doneTasks = p.tasks.filter(t => t.status === 'done').length;
        const blockedTasks = p.tasks.filter(
          t => t.status === 'blocked',
        ).length;
        const completionPercent =
          p.tasks.length > 0
            ? Math.round((doneTasks / p.tasks.length) * 100)
            : 0;

        return {
          userId: p.userId,
          displayName: getEntityDisplayName(member, p.userId),
          role: p.templateName,
          startDate: p.startDate,
          completionPercent,
          blockedTaskCount: blockedTasks,
        };
      });

    const avgCompletionPercent =
      activeJoiners.length > 0
        ? Math.round(
            activeJoiners.reduce((sum, j) => sum + j.completionPercent, 0) /
              activeJoiners.length,
          )
        : 0;

    const totalBlockedTasks = activeJoiners.reduce(
      (sum, j) => sum + j.blockedTaskCount,
      0,
    );

    res.status(200).json({
      teamName,
      activeJoiners,
      avgCompletionPercent,
      totalBlockedTasks,
    });
  });

  router.get('/templates', async (req, res) => {
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingProgressReadPermission }],
        { credentials },
      )
    )[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const templates = await getAllTemplates(catalogApi, config, logger);
    res.status(200).json(templates);
  });

  router.post('/templates/:templateName/assign/:userId', async (req, res) => {
    const { templateName, userId } = req.params;
    const credentials = await httpAuth.credentials(req, { allow: ['user'] });

    const decision = (
      await permissions.authorize(
        [{ permission: onboardingTemplateAssignPermission }],
        { credentials },
      )
    )[0];
    if (decision.result === AuthorizeResult.DENY) {
      throw new NotAllowedError('Unauthorized');
    }

    const templates = await getAllTemplates(catalogApi, config, logger);
    const template = templates.find(t => t.metadata.name === templateName);

    if (!template) {
      throw new NotFoundError(`Template ${templateName} not found`);
    }

    const progress = initializeProgress(userId, template);
    await store.upsertProgress(progress);

    logger.info(`Assigned template ${templateName} to user ${userId}`);
    res.status(200).json(progress);
  });

  return router;
}

function getEntityDisplayName(
  entity: { spec?: unknown } | undefined,
  fallback: string,
): string {
  const spec = entity?.spec as Record<string, unknown> | undefined;
  const profile = spec?.profile as Record<string, unknown> | undefined;
  return (profile?.displayName as string) ?? fallback;
}

function initializeProgress(
  userId: string,
  template: OnboardingTemplate,
): OnboardingProgress {
  const tasks = template.spec.phases.flatMap(phase =>
    phase.tasks.map(task => ({
      taskId: task.id,
      status: 'pending' as TaskStatus,
    })),
  );

  return {
    userId,
    templateName: template.metadata.name,
    startDate: new Date().toISOString(),
    tasks,
  };
}

async function findTemplateForUser(
  catalogApi: CatalogApi,
  userId: string,
  logger: LoggerService,
): Promise<OnboardingTemplate | undefined> {
  try {
    const userEntity = await catalogApi.getEntityByRef(userId);
    if (!userEntity) {
      return undefined;
    }

    const spec = userEntity.spec as Record<string, unknown> | undefined;
    const profile = spec?.profile as Record<string, unknown> | undefined;
    const role = profile?.role as string | undefined;

    if (!role) {
      return undefined;
    }

    const templateEntities = await catalogApi.getEntities({
      filter: {
        kind: 'OnboardingTemplate',
      },
    });

    for (const entity of templateEntities.items) {
      const templateSpec = entity.spec as Record<string, unknown> | undefined;
      if (templateSpec?.role === role) {
        return entityToTemplate(entity);
      }
    }

    return undefined;
  } catch (error) {
    logger.warn(`Failed to find template for user ${userId}`, { error: String(error) });
    return undefined;
  }
}

async function getAllTemplates(
  catalogApi: CatalogApi,
  config: RootConfigService,
  logger: LoggerService,
): Promise<OnboardingTemplate[]> {
  try {
    const entities = await catalogApi.getEntities({
      filter: {
        kind: 'OnboardingTemplate',
      },
    });

    if (entities.items.length > 0) {
      return entities.items.map(entity => entityToTemplate(entity));
    }
  } catch (error) {
    logger.warn('Failed to fetch onboarding templates from catalog', { error: String(error) });
  }

  // Fallback: read templates from config when catalog has none
  return getTemplatesFromConfig(config);
}

function getTemplatesFromConfig(
  config: RootConfigService,
): OnboardingTemplate[] {
  const defaults = config.getOptionalConfigArray(
    'onboarding.templates.defaults',
  );
  if (!defaults) {
    return [];
  }

  return defaults.map(tpl => {
    const name = tpl.getString('name');
    const title = tpl.getOptionalString('title') ?? name;
    const description = tpl.getOptionalString('description');
    const phases = tpl.getOptionalStringArray('phases') ?? [];
    const taskConfigs = tpl.getOptionalConfigArray('tasks') ?? [];

    const phaseMap = new Map<string, OnboardingTask[]>();
    for (const phase of phases) {
      phaseMap.set(phase, []);
    }

    for (const taskCfg of taskConfigs) {
      const phase = taskCfg.getString('phase');

      const resourceConfigs = taskCfg.getOptionalConfigArray('resources');
      const resources = resourceConfigs?.map(r => ({
        type: r.getString('type') as ResourceType,
        title: r.getString('title'),
        url: r.getString('url'),
        duration: r.getOptionalString('duration'),
      }));

      const task: OnboardingTask = {
        id: taskCfg.getString('id'),
        phase: phase as Phase,
        title: taskCfg.getString('title'),
        description: taskCfg.getOptionalString('description') ?? '',
        type: (taskCfg.getOptionalString('type') as TaskType) ?? 'manual',
        assignee: taskCfg.getOptionalString('assignee') ?? 'self',
        dependsOn: taskCfg.getOptionalStringArray('dependsOn'),
        duePhase: (taskCfg.getOptionalString('duePhase') ?? phase) as Phase,
        estimatedMinutes: taskCfg.getOptionalNumber('estimatedMinutes'),
        documentation: taskCfg.getOptionalString('documentation'),
        resources,
        recommendations: taskCfg.getOptionalStringArray('recommendations'),
      };
      const list = phaseMap.get(phase);
      if (list) {
        list.push(task);
      } else {
        phaseMap.set(phase, [task]);
      }
    }

    return {
      apiVersion: 'onboarding.backstage.io/v1' as const,
      kind: 'OnboardingTemplate' as const,
      metadata: { name, title, description },
      spec: {
        role: '',
        phases: [...phaseMap.entries()].map(([id, tasks]) => ({
          id: id as Phase,
          tasks,
        })),
      },
    };
  });
}

function entityToTemplate(entity: {
  metadata: { name: string; title?: string; description?: string };
  spec?: Record<string, unknown> | unknown;
}): OnboardingTemplate {
  const spec = entity.spec as Record<string, unknown>;
  return {
    apiVersion: 'onboarding.backstage.io/v1',
    kind: 'OnboardingTemplate',
    metadata: {
      name: entity.metadata.name,
      title: entity.metadata.title ?? entity.metadata.name,
      description: entity.metadata.description,
    },
    spec: {
      role: (spec?.role as string) ?? '',
      team: spec?.team as string | undefined,
      phases: (spec?.phases as OnboardingTemplate['spec']['phases']) ?? [],
    },
  };
}
