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
import { Knex } from 'knex';
import { randomUUID as uuid } from 'node:crypto';
import {
  SerializedTask,
  TaskStore,
  SerializedTaskStep,
  TaskSecrets,
  RawDbTaskRow,
  RawDbTaskStatusesRow,
  RawDbTaskStepsRow,
  RawDbTaskOutputsRow,
} from './types';
import {
  DatabaseService,
  LoggerService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { NotFoundError } from '@backstage/errors';
import { DateTime } from 'luxon';
import { JsonObject } from '@backstage/types';
import { flattenParams } from '../../service/helpers';
import { TaskSpec, TaskStatus } from '@backstage/plugin-golden-paths-common';

/**
 * DatabaseTaskStore
 *
 * @public
 */
export type DatabaseTaskStoreOptions = {
  database: DatabaseService | Knex;
  logger: LoggerService;
};

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-golden-paths-backend',
  'migrations',
);

/**
 * Type guard to help DatabaseTaskStore understand when database is DatabaseService vs. when database is a Knex instance.
 *
 * * @public
 */
function isPluginDatabaseManager(
  opt: DatabaseService | Knex,
): opt is DatabaseService {
  return (opt as DatabaseService).getClient !== undefined;
}

const parseSqlDateToIsoString = <T>(input: T): T | string => {
  if (typeof input === 'string') {
    const parsed = DateTime.fromSQL(input, { zone: 'UTC' });
    if (!parsed.isValid) {
      throw new Error(
        `Failed to parse database timestamp '${input}', ${parsed.invalidReason}: ${parsed.invalidExplanation}`,
      );
    }
    return parsed.toISO()!;
  }

  return input;
};

/**
 * DatabaseTaskStore
 *
 * @public
 */
export class DatabaseTaskStore implements TaskStore {
  private readonly db: Knex;
  private readonly logger: LoggerService;

  static async create(
    options: DatabaseTaskStoreOptions,
  ): Promise<DatabaseTaskStore> {
    const { database, logger } = options;
    const client = await this.getClient(database);

    await this.runMigrations(database, client);

    return new DatabaseTaskStore(client, logger);
  }

  private static async getClient(
    database: DatabaseService | Knex,
  ): Promise<Knex> {
    if (isPluginDatabaseManager(database)) {
      return database.getClient();
    }

    return database;
  }

  private static async runMigrations(
    database: DatabaseService | Knex,
    client: Knex,
  ): Promise<void> {
    if (!isPluginDatabaseManager(database)) {
      await client.migrate.latest({
        directory: migrationsDir,
      });

      return;
    }

    if (!database.migrations?.skip) {
      await client.migrate.latest({
        directory: migrationsDir,
      });
    }
  }

  private constructor(client: Knex, logger: LoggerService) {
    this.db = client;
    this.logger = logger;
  }

  async getTasks(options: {
    createdBy?: string;
    status?: TaskStatus;
    filters?: {
      createdBy?: string | string[];
      status?: TaskStatus | TaskStatus[];
    };
    pagination?: {
      limit?: number;
      offset?: number;
    };
    order?: { order: 'asc' | 'desc'; field: string }[];
  }): Promise<{ tasks: SerializedTask[]; totalTasks?: number }> {
    const { createdBy, status, pagination, order, filters } = options ?? {};
    const queryBuilder = this.db<RawDbTaskRow & { count: number }>('tasks');

    if (createdBy || filters?.createdBy) {
      const arr: string[] = flattenParams<string>(
        createdBy,
        filters?.createdBy,
      );
      queryBuilder.whereIn('created_by', [...new Set(arr)]);
    }

    if (status || filters?.status) {
      const arr: TaskStatus[] = flattenParams<TaskStatus>(
        status,
        filters?.status,
      );
      queryBuilder.whereIn('status', [...new Set(arr)]);
    }

    const countQuery = queryBuilder.clone();
    countQuery.count('tasks.id', { as: 'count' });

    if (order) {
      order.forEach(f => {
        queryBuilder.orderBy(f.field, f.order);
      });
    } else {
      queryBuilder.orderBy('created_at', 'desc');
    }

    if (pagination?.limit !== undefined) {
      queryBuilder.limit(pagination.limit);
    }

    if (pagination?.offset !== undefined) {
      queryBuilder.offset(pagination.offset);
    }

    const [results, [{ count }]] = await Promise.all([
      queryBuilder.select(),
      countQuery,
    ]);

    const tasks = results.map(result => ({
      id: result.id,
      spec: JSON.parse(result.spec),
      status: result.status,
      createdBy: result.created_by ?? undefined,
      createdAt: parseSqlDateToIsoString(result.created_at),
    }));

    return { tasks, totalTasks: count };
  }

  async insertTask(options: {
    spec: TaskSpec;
    createdBy: string;
    secrets?: TaskSecrets;
  }): Promise<{ taskId: string }> {
    const taskId = uuid();
    await this.db<RawDbTaskRow>('tasks').insert({
      id: taskId,
      spec: JSON.stringify(options.spec),
      secrets: options.secrets ? JSON.stringify(options.secrets) : undefined,
      created_by: options.createdBy,
      status: 'processing',
    });
    return { taskId };
  }

  async completeTask(taskId: string): Promise<void> {
    await this.db.transaction(async tx => {
      await tx<RawDbTaskRow>('tasks').where('id', taskId).update({
        status: 'completed',
      });
    });
  }

  async cancelTask(taskId: string): Promise<void> {
    await this.db.transaction(async tx => {
      await tx<RawDbTaskRow>('tasks').where('id', taskId).update({
        status: 'cancelled',
      });
    });
  }

  async getTaskStatuses(taskId: string): Promise<RawDbTaskStatusesRow[]> {
    return await this.db<RawDbTaskStatusesRow>('task_statuses')
      .where({ task_id: taskId })
      .select();
  }

  async insertToTaskSteps(options: {
    taskId: string;
    templateId: string;
    stepId: string;
  }): Promise<void> {
    await this.db.transaction(async tx => {
      await tx<RawDbTaskStepsRow>('task_steps').insert({
        task_id: options.taskId,
        template_id: options.templateId,
        step_id: options.stepId,
      });
    });
  }

  async updateToTaskSteps(options: {
    taskId: string;
    templateId: string;
    stepId: string;
  }): Promise<void> {
    const { taskId, templateId, stepId } = options;
    await this.db.transaction(async tx => {
      await tx<RawDbTaskStepsRow>('task_steps')
        .where({
          task_id: taskId,
          template_id: templateId,
        })
        .update({
          step_id: stepId,
        });
    });
  }

  async upsertTaskStep(options: {
    taskId: string;
    templateId: string;
    stepId: string;
    outputs?: JsonObject;
  }): Promise<void> {
    const { taskId, templateId, stepId, outputs } = options;
    let taskExecution;
    await this.db.transaction(async tx => {
      try {
        taskExecution = await tx<RawDbTaskStatusesRow>('task_steps')
          .where({ task_id: taskId, template_id: templateId })
          .select();
      } catch (error) {
        this.logger.error(String(error));
      }
      if (taskExecution.length === 0) {
        this.insertToTaskSteps({ taskId, templateId, stepId });
      } else {
        this.updateToTaskSteps({ taskId, templateId, stepId });
      }
      if (Object.keys(outputs || {}).length > 0) {
        this.upsertTaskStepOutputs({ taskId, templateId, outputs: outputs! });
      }
    });
  }

  async getTaskStep(stepId: string): Promise<SerializedTaskStep> {
    const [result] = await this.db<RawDbTaskStepsRow>('task_steps')
      .where({ step_id: stepId })
      .select();

    if (!result) {
      throw new NotFoundError(`No step with id '${stepId}' found`);
    }

    const serializedStep: SerializedTaskStep = {
      taskId: result.task_id,
      templateId: result.template_id,
      stepId: result.step_id,
    };

    return serializedStep;
  }

  async getTaskStepId(options: {
    taskId: string;
    templateId: string;
  }): Promise<{ stepId: string }> {
    const [result] = await this.db<RawDbTaskStepsRow>('task_steps')
      .where({ task_id: options.taskId, template_id: options.templateId })
      .select();

    if (!result) {
      throw new NotFoundError(
        `No step reference for task id '${options.taskId}' and template id '${options.templateId}' found`,
      );
    }

    return {
      stepId: result.step_id,
    };
  }

  async upsertTaskStepOutputs(options: {
    taskId: string;
    templateId: string;
    outputs: JsonObject;
  }): Promise<void> {
    const { taskId, templateId, outputs } = options;
    await this.db.transaction(async tx => {
      const existing = await tx<RawDbTaskOutputsRow>('task_outputs')
        .where({
          task_id: taskId,
          template_id: templateId,
        })
        .first();

      if (existing) {
        await tx<RawDbTaskOutputsRow>('task_outputs')
          .where({
            task_id: taskId,
            template_id: templateId,
          })
          .update({
            outputs: JSON.stringify(outputs),
          });
      } else {
        await tx<RawDbTaskOutputsRow>('task_outputs').insert({
          task_id: taskId,
          template_id: templateId,
          outputs: JSON.stringify(outputs),
        });
      }
    });
  }

  async getAllTaskOutputs(options: { taskId: string }): Promise<JsonObject> {
    const results = await this.db<RawDbTaskOutputsRow>('task_outputs')
      .where({ task_id: options.taskId })
      .select();

    const combinedOutputs: JsonObject = {};

    for (const result of results) {
      if (result.outputs) {
        try {
          const stepOutputs = JSON.parse(result.outputs) as JsonObject;

          // Merge all properties from each step's outputs into the combined outputs
          Object.assign(combinedOutputs, { [result.template_id]: stepOutputs });
        } catch (error) {
          this.logger.error(
            `Failed to parse outputs for task '${options.taskId}' and template '${result.template_id}', ${error}`,
          );
        }
      }
    }

    return combinedOutputs;
  }

  async getTaskStepStatus(options: {
    taskId: string;
    templateId: string;
  }): Promise<{ status: string }> {
    const [result] = await this.db<RawDbTaskStatusesRow>('task_statuses')
      .where({ task_id: options.taskId, template_id: options.templateId })
      .select();

    if (!result) {
      throw new NotFoundError(
        `No status for task id '${options.taskId}' and template id '${options.templateId}' found`,
      );
    }

    return {
      status: result.status,
    };
  }

  async upsertTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<{ status: string }> {
    const { taskId, templateId, status } = options;

    let templateStatus = '';
    try {
      const result = await this.getTaskStepStatus({ taskId, templateId });
      templateStatus = result.status;
    } catch (error) {
      this.logger.info('Task step status not found in db. Creating new entry');
    }

    if (templateStatus) {
      await this.db.transaction(async tx => {
        await tx<RawDbTaskStatusesRow>('task_statuses')
          .where('task_id', taskId)
          .andWhere('template_id', templateId)
          .update({
            status,
          });
      });
    } else {
      await this.db<RawDbTaskStatusesRow>('task_statuses').insert({
        task_id: taskId,
        template_id: templateId,
        status: status,
      });
    }

    return { status };
  }

  async updateTaskStepStatus(options: {
    taskId: string;
    templateId: string;
    status: string;
  }): Promise<{ status: string }> {
    const { taskId, templateId, status } = options;
    await this.db.transaction(async tx => {
      await tx<RawDbTaskStatusesRow>('task_statuses')
        .where('task_id', taskId)
        .andWhere('template_id', templateId)
        .update({
          status,
        });
    });

    return { status };
  }

  async getTask(taskId: string): Promise<SerializedTask> {
    const [result] = await this.db<RawDbTaskRow>('tasks')
      .where({ id: taskId })
      .select();

    if (!result) {
      throw new NotFoundError(`No task with id '${taskId}' found`);
    }

    try {
      const spec = JSON.parse(result.spec);
      const secrets = result.secrets ? JSON.parse(result.secrets) : undefined;
      return {
        id: result.id,
        spec,
        status: result.status,
        createdAt: parseSqlDateToIsoString(result.created_at),
        createdBy: result.created_by ?? undefined,
        secrets,
      };
    } catch (error) {
      throw new Error(`Failed to parse spec of task '${taskId}', ${error}`);
    }
  }
}
