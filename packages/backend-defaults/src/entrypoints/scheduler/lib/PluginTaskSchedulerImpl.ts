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
import { Counter, Histogram, metrics, trace } from '@opentelemetry/api';
import { Knex } from 'knex';
import { Duration } from 'luxon';
import { LocalTaskWorker } from './LocalTaskWorker';
import { TaskWorker } from './TaskWorker';
import { TaskSettingsV2 } from './types';
import { delegateAbortController, TRACER_ID, validateId } from './util';

const tracer = trace.getTracer(TRACER_ID);

/**
 * Implements the actual task management.
 */
export class PluginTaskSchedulerImpl implements SchedulerService {
  private readonly localTasksById = new Map<string, LocalTaskWorker>();
  private readonly allScheduledTasks: SchedulerServiceTaskDescriptor[] = [];
  private readonly shutdownInitiated: Promise<boolean>;

  private readonly counter: Counter;
  private readonly duration: Histogram;

  constructor(
    private readonly databaseFactory: () => Promise<Knex>,
    private readonly logger: LoggerService,
    rootLifecycle?: RootLifecycleService,
  ) {
    const meter = metrics.getMeter('default');
    this.counter = meter.createCounter('backend_tasks.task.runs.count', {
      description: 'Total number of times a task has been run',
    });
    this.duration = meter.createHistogram('backend_tasks.task.runs.duration', {
      description: 'Histogram of task run durations',
      unit: 'seconds',
    });
    this.shutdownInitiated = new Promise(shutdownInitiated => {
      rootLifecycle?.addShutdownHook(() => shutdownInitiated(true));
    });
  }

  async triggerTask(id: string): Promise<void> {
    const localTask = this.localTasksById.get(id);
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
    } else {
      const worker = new LocalTaskWorker(
        task.id,
        this.instrumentedFunction(task, scope),
        this.logger.child({ task: task.id }),
      );
      worker.start(settings, { signal: abortController.signal });
      this.localTasksById.set(task.id, worker);
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
