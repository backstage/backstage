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

import { LoggerService } from '@backstage/backend-plugin-api';
import { createDeferred, DeferredPromise } from '@backstage/types';
import { Knex } from 'knex';
import { Duration } from 'luxon';
import { DB_TASKS_TABLE, DbTasksRow } from '../database/tables';
import { TaskSettingsV2, taskSettingsV2Schema } from './types';

type TaskPollResult =
  | { result: 'abort' }
  | { result: 'ready'; settings: TaskSettingsV2 };

interface PendingWaiter {
  taskId: string;
  deferred: DeferredPromise<TaskPollResult>;
  pollIntervalMs: number;
  signal: AbortSignal;
  abortHandler: () => void;
}

const MIN_POLL_INTERVAL_MS = 100;

/**
 * Batches readiness checks for all waiting tasks of a plugin.
 */
export class TaskStatePoller {
  readonly #knex: Knex;
  readonly #logger: LoggerService;
  readonly #waiters = new Map<string, Set<PendingWaiter>>();
  #pollTimer: ReturnType<typeof setTimeout> | undefined;
  #pollTimerDueAt: number | undefined;
  #nextPollAllowedAt: number | undefined;
  #pollCycleRunning = false;

  constructor(options: { knex: Knex; logger: LoggerService }) {
    this.#knex = options.knex;
    this.#logger = options.logger;
  }

  waitForTask(
    taskId: string,
    options: { signal: AbortSignal; pollInterval: Duration },
  ): Promise<TaskPollResult> {
    if (options.signal.aborted) {
      return Promise.resolve({ result: 'abort' });
    }

    const requestedPollIntervalMs = options.pollInterval.as('milliseconds');
    if (
      !Number.isFinite(requestedPollIntervalMs) ||
      requestedPollIntervalMs <= 0
    ) {
      throw new TypeError('pollInterval must be a finite positive duration');
    }
    const pollIntervalMs = Math.max(
      requestedPollIntervalMs,
      MIN_POLL_INTERVAL_MS,
    );

    const deferred = createDeferred<TaskPollResult>();
    const waiter: PendingWaiter = {
      taskId,
      deferred,
      pollIntervalMs,
      signal: options.signal,
      abortHandler: () => {
        this.#removeWaiter(waiter);
        deferred.resolve({ result: 'abort' });
      },
    };

    let waiters = this.#waiters.get(taskId);
    if (!waiters) {
      waiters = new Set();
      this.#waiters.set(taskId, waiters);
    }
    waiters.add(waiter);
    options.signal.addEventListener('abort', waiter.abortHandler, {
      once: true,
    });

    this.#ensurePolling();
    this.#rescheduleFor(waiter);
    return deferred;
  }

  #ensurePolling(): void {
    if (this.#pollCycleRunning || this.#pollTimer) {
      return;
    }

    const delayMs = (this.#nextPollAllowedAt ?? 0) - Date.now();
    if (delayMs > 0) {
      this.#schedulePoll(delayMs);
      return;
    }

    this.#pollCycleRunning = true;
    Promise.resolve().then(() => this.#runPollCycle());
  }

  async #runPollCycle(): Promise<void> {
    const cyclePollIntervalMs = this.#nextPollIntervalMs();
    if (!Number.isFinite(cyclePollIntervalMs)) {
      this.#pollCycleRunning = false;
      this.#nextPollAllowedAt = undefined;
      return;
    }

    try {
      await this.#poll();
    } catch (error) {
      this.#logger.warn('Task state poll failed', error);
    }
    this.#pollCycleRunning = false;

    const currentPollIntervalMs = this.#nextPollIntervalMs();
    const nextPollCooldownMs = Math.min(
      cyclePollIntervalMs,
      currentPollIntervalMs,
    );
    this.#nextPollAllowedAt = Date.now() + nextPollCooldownMs;
    if (this.#waiters.size > 0) {
      this.#schedulePoll(currentPollIntervalMs);
    }
  }

  #schedulePoll(delayMs: number): void {
    this.#pollTimerDueAt = Date.now() + delayMs;
    this.#pollTimer = setTimeout(() => {
      this.#pollTimer = undefined;
      this.#pollTimerDueAt = undefined;
      if (this.#waiters.size === 0) {
        return;
      }
      this.#pollCycleRunning = true;
      this.#runPollCycle();
    }, delayMs);
  }

  #rescheduleFor(waiter: PendingWaiter): void {
    if (!this.#pollTimer || this.#pollTimerDueAt === undefined) {
      return;
    }

    const desiredPollAt = Date.now() + waiter.pollIntervalMs;
    if (desiredPollAt >= this.#pollTimerDueAt) {
      return;
    }

    clearTimeout(this.#pollTimer);
    this.#schedulePoll(waiter.pollIntervalMs);
  }

  #nextPollIntervalMs(): number {
    let intervalMs = Infinity;
    for (const waiters of this.#waiters.values()) {
      for (const waiter of waiters) {
        intervalMs = Math.min(intervalMs, waiter.pollIntervalMs);
      }
    }
    return intervalMs;
  }

  async #poll(): Promise<void> {
    const taskIds = [...this.#waiters.keys()];
    if (taskIds.length === 0) {
      return;
    }

    const rows = await this.#knex<DbTasksRow>(DB_TASKS_TABLE)
      .whereIn('id', taskIds)
      .select({
        id: 'id',
        settingsJson: 'settings_json',
        ready: this.#knex.raw(
          `CASE
            WHEN next_run_start_at <= ? AND current_run_ticket IS NULL THEN TRUE
            ELSE FALSE
          END`,
          [this.#knex.fn.now()],
        ),
      });

    const foundIds = new Set<string>();

    for (const row of rows) {
      foundIds.add(row.id);

      if (!row.ready) {
        continue;
      }

      try {
        const settings = taskSettingsV2Schema.parse(
          JSON.parse(row.settingsJson),
        );
        this.#resolveAll(row.id, { result: 'ready', settings });
      } catch (error) {
        this.#logger.info(
          `Task "${row.id}" is no longer able to parse task settings; aborting and assuming that a newer version of the task has been issued and is being handled by other workers, ${error}`,
        );
        this.#resolveAll(row.id, { result: 'abort' });
      }
    }

    for (const taskId of taskIds) {
      if (!foundIds.has(taskId)) {
        this.#logger.info(
          `No longer able to find task "${taskId}"; aborting and assuming that it has been unregistered or expired`,
        );
        this.#resolveAll(taskId, { result: 'abort' });
      }
    }
  }

  #resolveAll(taskId: string, result: TaskPollResult): void {
    const waiters = this.#waiters.get(taskId);
    if (!waiters) {
      return;
    }
    this.#waiters.delete(taskId);

    for (const waiter of waiters) {
      this.#cleanupWaiter(waiter);
      waiter.deferred.resolve(result);
    }
  }

  #removeWaiter(waiter: PendingWaiter): void {
    const waiters = this.#waiters.get(waiter.taskId);
    if (!waiters) {
      return;
    }
    waiters.delete(waiter);
    this.#cleanupWaiter(waiter);
    if (waiters.size === 0) {
      this.#waiters.delete(waiter.taskId);
    }
    if (this.#waiters.size === 0 && this.#pollTimer) {
      clearTimeout(this.#pollTimer);
      this.#pollTimer = undefined;
      this.#pollTimerDueAt = undefined;
      this.#nextPollAllowedAt = undefined;
    }
  }

  #cleanupWaiter(waiter: PendingWaiter): void {
    waiter.signal.removeEventListener('abort', waiter.abortHandler);
  }
}
