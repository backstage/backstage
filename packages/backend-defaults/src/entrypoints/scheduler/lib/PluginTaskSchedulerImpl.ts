/*
 * Copyright 2021 The Backstage Authors
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
  LoggerService,
  RootLifecycleService,
  SchedulerService,
  SchedulerServiceTaskDescriptor,
  SchedulerServiceTaskFunction,
  SchedulerServiceTaskInvocationDefinition,
  SchedulerServiceTaskRunner,
  SchedulerServiceTaskScheduleDefinition,
} from '@backstage/backend-plugin-api';
import { Counter, Histogram, Gauge, metrics, trace } from '@opentelemetry/api';
import { Knex } from 'knex';
import { Duration } from 'luxon';
import express from 'express';
import Router from 'express-promise-router';
import { LocalTaskWorker } from './LocalTaskWorker';
import { TaskWorker } from './TaskWorker';
import { TaskSettingsV2, TaskApiTasksResponse } from './types';
import { delegateAbortController, TRACER_ID, validateId } from './util';

const tracer = trace.getTracer(TRACER_ID);

/**
 * Implements the actual task management.
 */
export class PluginTaskSchedulerImpl implements SchedulerService {
  private readonly localWorkersById = new Map<string, LocalTaskWorker>();
  private readonly globalWorkersById = new Map<string, TaskWorker>();
  private readonly allScheduledTasks: SchedulerServiceTaskDescriptor[] = [];
  private readonly shutdownInitiated: Promise<boolean>;

  private readonly counter: Counter;
  private readonly duration: Histogram;
  private readonly lastStarted: Gauge;
  private readonly lastCompleted: Gauge;

  private readonly pluginId: string;
  private readonly databaseFactory: () => Promise<Knex>;
  private readonly logger: LoggerService;

  constructor(
    pluginId: string,
    databaseFactory: () => Promise<Knex>,
    logger: LoggerService,
    rootLifecycle: RootLifecycleService,
  ) {
    this.pluginId = pluginId;
    this.databaseFactory = databaseFactory;
    this.logger = logger;
    const meter = metrics.getMeter('default');
    this.counter = meter.createCounter('backend_tasks.task.runs.count', {
      description: 'Total number of times a task has been run',
    });
    this.duration = meter.createHistogram('backend_tasks.task.runs.duration', {
      description: 'Histogram of task run durations',
      unit: 'seconds',
    });
    this.lastStarted = meter.createGauge('backend_tasks.task.runs.started', {
      description: 'Epoch timestamp seconds when the task was last started',
      unit: 'seconds',
    });
    this.lastCompleted = meter.createGauge(
      'backend_tasks.task.runs.completed',
      {
        description: 'Epoch timestamp seconds when the task was last completed',
        unit: 'seconds',
      },
    );
    this.shutdownInitiated = new Promise(shutdownInitiated => {
      rootLifecycle.addShutdownHook(() => shutdownInitiated(true));
    });
  }

  async triggerTask(id: string): Promise<void> {
    const localTask = this.localWorkersById.get(id);
    if (localTask) {
      localTask.trigger();
      return;
    }

    const knex = await this.databaseFactory();
    await TaskWorker.trigger(knex, id);
  }

  async scheduleTask(
    task: SchedulerServiceTaskScheduleDefinition &
      SchedulerServiceTaskInvocationDefinition,
  ): Promise<void> {
    validateId(task.id);
    const scope = task.scope ?? 'global';

    const settings: TaskSettingsV2 = {
      version: 2,
      cadence: parseDuration(task.frequency),
      initialDelayDuration:
        task.initialDelay && parseDuration(task.initialDelay),
      timeoutAfterDuration: parseDuration(task.timeout),
    };

    // Delegated abort controller that will abort either when the provided
    // controller aborts, or when a root lifecycle shutdown happens
    const abortController = delegateAbortController(task.signal);
    this.shutdownInitiated.then(() => abortController.abort());

    if (scope === 'global') {
      const knex = await this.databaseFactory();
      const worker = new TaskWorker(
        task.id,
        this.instrumentedFunction(task, scope),
        knex,
        this.logger.child({ task: task.id }),
      );
      await worker.start(settings, { signal: abortController.signal });
      this.globalWorkersById.set(task.id, worker);
    } else {
      const worker = new LocalTaskWorker(
        task.id,
        this.instrumentedFunction(task, scope),
        this.logger.child({ task: task.id }),
      );
      worker.start(settings, { signal: abortController.signal });
      this.localWorkersById.set(task.id, worker);
    }

    this.allScheduledTasks.push({
      id: task.id,
      scope: scope,
      settings: settings,
    });
  }

  createScheduledTaskRunner(
    schedule: SchedulerServiceTaskScheduleDefinition,
  ): SchedulerServiceTaskRunner {
    return {
      run: async task => {
        await this.scheduleTask({ ...task, ...schedule });
      },
    };
  }

  async getScheduledTasks(): Promise<SchedulerServiceTaskDescriptor[]> {
    return this.allScheduledTasks;
  }

  getRouter(): express.Router {
    const router = Router();

    router.get('/.backstage/scheduler/v1/tasks', async (_, res) => {
      const globalState = await TaskWorker.taskStates(
        await this.databaseFactory(),
      );

      const tasks = new Array<TaskApiTasksResponse>();
      for (const task of this.allScheduledTasks) {
        tasks.push({
          taskId: task.id,
          pluginId: this.pluginId,
          scope: task.scope,
          settings: task.settings,
          taskState:
            this.localWorkersById.get(task.id)?.taskState() ??
            globalState.get(task.id) ??
            null,
          workerState:
            this.localWorkersById.get(task.id)?.workerState() ??
            this.globalWorkersById.get(task.id)?.workerState() ??
            null,
        });
      }

      res.json({ tasks });
    });

    router.post(
      '/.backstage/scheduler/v1/tasks/:id/trigger',
      async (req, res) => {
        const { id } = req.params;
        await this.triggerTask(id);
        res.status(200).end();
      },
    );

    return router;
  }

  private instrumentedFunction(
    task: SchedulerServiceTaskInvocationDefinition,
    scope: string,
  ): SchedulerServiceTaskFunction {
    return async abort => {
      const labels: Record<string, string> = {
        taskId: task.id,
        scope,
      };
      this.counter.add(1, { ...labels, result: 'started' });
      this.lastStarted.record(Date.now() / 1000, { taskId: task.id });

      const startTime = process.hrtime();

      try {
        await tracer.startActiveSpan(`task ${task.id}`, async span => {
          try {
            span.setAttributes(labels);
            await task.fn(abort);
          } catch (error) {
            if (error instanceof Error) {
              span.recordException(error);
            }
            throw error;
          } finally {
            span.end();
          }
        });
        labels.result = 'completed';
      } catch (ex) {
        labels.result = 'failed';
        throw ex;
      } finally {
        const delta = process.hrtime(startTime);
        const endTime = delta[0] + delta[1] / 1e9;
        this.counter.add(1, labels);
        this.duration.record(endTime, labels);
        this.lastCompleted.record(Date.now() / 1000, labels);
      }
    };
  }
}

export function parseDuration(
  frequency: SchedulerServiceTaskScheduleDefinition['frequency'],
): string {
  if (typeof frequency === 'object' && 'cron' in frequency) {
    return frequency.cron;
  }
  if (typeof frequency === 'object' && 'trigger' in frequency) {
    return frequency.trigger;
  }

  const parsed = Duration.isDuration(frequency)
    ? frequency
    : Duration.fromObject(frequency);

  if (!parsed.isValid) {
    throw new Error(
      `Invalid duration, ${parsed.invalidReason}: ${parsed.invalidExplanation}`,
    );
  }

  return parsed.toISO()!;
}
