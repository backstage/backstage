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

import { randomUUID } from 'node:crypto';
import {
  ConflictError,
  InputError,
  isError,
  NotAllowedError,
  NotFoundError,
} from '@backstage/errors';
import {
  TaskResumeOptions,
  TaskResumeResult,
  TaskResumeTrigger,
  TaskSuspension,
} from '@backstage/plugin-scaffolder-node';
import { EventParams } from '@backstage/plugin-events-node';
import { JsonObject, JsonValue } from '@backstage/types';
import { Knex } from 'knex';
import { Duration } from 'luxon';

type SuspensionRow = {
  id: string;
  task_id: string;
  key: string;
  step_id: string;
  reason: string | null;
  expires_at: number | string | null;
  consumed_at: string | null;
  result: string | null;
};

export class TaskSuspensionStore {
  constructor(private readonly db: Knex) {}

  async get(taskId: string, key: string): Promise<TaskSuspension | undefined> {
    const row: SuspensionRow | undefined = await this.db('task_suspensions')
      .where({ task_id: taskId, key })
      .first();
    if (!row) return undefined;
    const triggers = await this.db('task_suspension_triggers')
      .where({ suspension_id: row.id })
      .select('config');
    return {
      key: row.key,
      stepId: row.step_id,
      reason: row.reason ?? undefined,
      resumeOn: triggers.map(t => JSON.parse(t.config)),
      result: row.result ? JSON.parse(row.result) : undefined,
    };
  }

  async park(taskId: string, options: TaskSuspension): Promise<void> {
    await this.db.transaction(async tx => {
      const id = randomUUID();
      await tx('task_suspensions').insert({
        id,
        task_id: taskId,
        key: options.key,
        step_id: options.stepId,
        reason: options.reason,
        expires_at: options.timeout
          ? Date.now() + Duration.fromObject(options.timeout).toMillis()
          : null,
      });
      await tx('task_suspension_triggers').insert(
        options.resumeOn.map(trigger => ({
          suspension_id: id,
          trigger_id: trigger.id,
          type: trigger.type,
          topic: trigger.type === 'event' ? trigger.topic : null,
          config: JSON.stringify(trigger),
        })),
      );
      const count = await tx('tasks')
        .where({ id: taskId, status: 'processing' })
        .update({ status: 'waiting' });
      if (count !== 1)
        throw new ConflictError('Only a processing task can be suspended');
      const cancelled = await tx('task_events')
        .where({ task_id: taskId, event_type: 'cancelled' })
        .first();
      if (cancelled)
        throw new ConflictError('A cancelled task cannot be suspended');
      await tx('task_events').insert({
        task_id: taskId,
        event_type: 'log',
        body: JSON.stringify({
          message: options.reason ?? 'Task suspended',
          stepId: options.stepId,
          status: 'waiting',
          key: options.key,
        }),
      });
    });
  }

  async resume(options: TaskResumeOptions): Promise<void> {
    if (JSON.stringify(options.payload).length > 65536)
      throw new InputError(
        'Resume payload exceeds the maximum serialized length',
      );
    await this.db.transaction(async tx => {
      const row: SuspensionRow | undefined = await tx('task_suspensions')
        .where({ task_id: options.taskId, key: options.key })
        .first();
      if (!row) throw new NotFoundError('Suspension does not exist');
      const saved = await tx('task_suspension_triggers')
        .where({ suspension_id: row.id, trigger_id: options.triggerId })
        .first();
      const trigger: TaskResumeTrigger | undefined =
        saved && JSON.parse(saved.config);
      if (!trigger || trigger.type !== 'manual')
        throw new NotAllowedError('This is not a manual resume trigger');
      if (
        trigger.principals &&
        !trigger.principals.some(ref => options.principalRefs.includes(ref))
      ) {
        throw new NotAllowedError('Caller is not a declared resume principal');
      }
      await this.consume(tx, row, {
        timedOut: false,
        triggerId: trigger.id,
        payload: options.payload,
        resumedBy: options.resumedBy,
      });
    });
  }

  private async consume(
    tx: Knex.Transaction,
    row: SuspensionRow,
    result: TaskResumeResult,
  ) {
    let query = tx('task_suspensions')
      .where({ id: row.id })
      .whereNull('consumed_at');
    if (result.timedOut) {
      query = query.where('expires_at', '<=', Date.now());
    } else {
      query = query.where(q =>
        q.whereNull('expires_at').orWhere('expires_at', '>', Date.now()),
      );
    }
    const consumed = await query.update({
      consumed_at: tx.fn.now(),
      result: JSON.stringify(result),
    });
    if (consumed !== 1)
      throw new ConflictError('Suspension is consumed or has expired');
    const queued = await tx('tasks')
      .where({ id: row.task_id, status: 'waiting' })
      .update({ status: 'open', last_heartbeat_at: tx.fn.now() });
    if (queued !== 1) throw new ConflictError('Task is no longer waiting');
    await tx('task_events').insert({
      task_id: row.task_id,
      event_type: 'log',
      body: JSON.stringify({
        message: result.timedOut
          ? 'Suspension timed out'
          : `Resumed by trigger ${result.triggerId}`,
        stepId: row.step_id,
        status: 'open',
      }),
    });
  }

  async listEventTopics(): Promise<string[]> {
    const rows = await this.liveTriggers()
      .where('trigger.type', 'event')
      .distinct('trigger.topic');
    return rows.map(row => row.topic);
  }

  private liveTriggers() {
    return this.db('task_suspension_triggers as trigger')
      .join(
        'task_suspensions as suspension',
        'suspension.id',
        'trigger.suspension_id',
      )
      .join('tasks', 'tasks.id', 'suspension.task_id')
      .whereNull('suspension.consumed_at')
      .where('tasks.status', 'waiting');
  }

  async onEvent(event: EventParams): Promise<void> {
    if (
      !event.eventPayload ||
      typeof event.eventPayload !== 'object' ||
      Array.isArray(event.eventPayload)
    )
      return;
    if (JSON.stringify(event.eventPayload).length > 65536) return;
    const candidates = await this.liveTriggers()
      .where({ 'trigger.type': 'event', 'trigger.topic': event.topic })
      .select('suspension.*', 'trigger.config');
    for (const row of candidates) {
      const trigger = JSON.parse(row.config) as Extract<
        TaskResumeTrigger,
        { type: 'event' }
      >;
      if (!matchesEvent(event.eventPayload, trigger.match)) continue;
      try {
        await this.db.transaction(tx =>
          this.consume(tx, row, {
            timedOut: false,
            triggerId: trigger.id,
            payload: event.eventPayload as JsonObject,
            resumedBy: { type: 'service', subject: 'plugin:scaffolder' },
          }),
        );
      } catch (error) {
        if (!(isError(error) && error.name === 'ConflictError')) throw error;
      }
    }
  }

  async expire(): Promise<void> {
    const rows: SuspensionRow[] = await this.db(
      'task_suspensions as suspension',
    )
      .join('tasks', 'tasks.id', 'suspension.task_id')
      .whereNull('suspension.consumed_at')
      .where('tasks.status', 'waiting')
      .where('suspension.expires_at', '<=', Date.now())
      .select('suspension.*')
      .limit(100);
    for (const row of rows) {
      try {
        await this.db.transaction(tx =>
          this.consume(tx, row, { timedOut: true, payload: {} }),
        );
      } catch (error) {
        if (!(isError(error) && error.name === 'ConflictError')) throw error;
      }
    }
  }

  async clearPayloads(tx: Knex.Transaction, taskId: string) {
    const rows: SuspensionRow[] = await tx('task_suspensions')
      .where({ task_id: taskId })
      .whereNotNull('result');
    for (const row of rows) {
      const result = JSON.parse(row.result!);
      await tx('task_suspensions')
        .where({ id: row.id })
        .update({ result: JSON.stringify({ ...result, payload: {} }) });
    }
  }
}

function matchesEvent(value: unknown, match: JsonValue): boolean {
  if (match === null || typeof match !== 'object') {
    return value === match;
  }
  if (Array.isArray(match)) {
    return (
      Array.isArray(value) &&
      value.length === match.length &&
      match.every((item, index) => matchesEvent(value[index], item))
    );
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return Object.entries(match).every(
    ([key, expected]) =>
      Object.hasOwn(value, key) &&
      matchesEvent((value as JsonObject)[key], expected!),
  );
}
