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

import type { Knex } from 'knex';
import type { Context } from '@earendil-works/chord/context';
import {
  StorageRequestError,
  type ConversationId,
  type Cursor,
  type EntryId,
  type Id,
  type Seq,
  type Storage,
  type StorageWrite,
} from '@earendil-works/pi-durable';
import { MemoryStorage } from '@earendil-works/pi-durable/storage/memory';
import type { Fence, Namespace } from '../contracts';

export interface KnexStorageOptions {
  readonly db: Knex;
  readonly namespace: Namespace;
  readonly fence: Fence;
}

type Executor = Knex | Knex.Transaction;

type CommitRow = { seq: string | number; writes: string };
type CounterRow = { next_id: string | number; next_seq: string | number };

/**
 * The database is authoritative. Each read reconstructs an isolated reference
 * state from the committed log; each mutation validates against that state
 * while holding the namespace lease lock. Each access costs O(history) and
 * reconstructs the full state in memory; indexed reads may be needed if
 * measurements show this is too expensive.
 */
class KnexStorage implements Storage {
  private closed = false;
  private tail: Promise<void> = Promise.resolve();
  private readonly key: { plugin_id: string; session_id: string };
  private readonly sqlite: boolean;
  private readonly options: KnexStorageOptions;

  constructor(options: KnexStorageOptions) {
    this.options = options;
    this.key = {
      plugin_id: options.namespace.pluginId,
      session_id: options.namespace.sessionId,
    };
    this.sqlite = options.db.client.config.client === 'better-sqlite3';
  }

  private assertOpen() {
    if (this.closed) throw new Error('Storage is closed');
  }

  private enqueue<T>(action: () => Promise<T>): Promise<T> {
    this.assertOpen();
    const result = this.tail.then(action);
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async snapshot(db: Executor): Promise<MemoryStorage> {
    const rows: CommitRow[] = await db('ai_storage_commits')
      .where(this.key)
      .orderBy('seq', 'asc')
      .select('seq', 'writes');
    const state = new MemoryStorage();
    for (const row of rows) {
      state
        .prepareCommit(JSON.parse(row.writes), Number(row.seq) as Seq)
        .apply();
    }
    return state;
  }

  private async read<T>(
    context: Context,
    action: (state: MemoryStorage) => Promise<T>,
  ): Promise<T> {
    this.assertOpen();
    await this.tail;
    context.abortSignal?.throwIfAborted();
    return action(await this.snapshot(this.options.db));
  }

  private async lock(
    trx: Knex.Transaction,
    context?: Context,
  ): Promise<CounterRow> {
    context?.abortSignal?.throwIfAborted();
    if (this.sqlite) {
      // An UPDATE obtains SQLite's write lock before observing the lease.
      await trx('ai_namespace_leases')
        .where(this.key)
        .update({ owner_id: trx.raw('owner_id') });
    } else {
      await trx('ai_namespace_leases').where(this.key).forUpdate().first();
    }
    await this.checkFence(trx);
    context?.abortSignal?.throwIfAborted();
    await trx('ai_storage_counters')
      .insert({ ...this.key, next_id: 2, next_seq: 1 })
      .onConflict(['plugin_id', 'session_id'])
      .ignore();
    const counters: CounterRow = await trx('ai_storage_counters')
      .where(this.key)
      .first();
    return counters;
  }

  private async transaction<T>(
    context: Context | undefined,
    action: (trx: Knex.Transaction, counters: CounterRow) => Promise<T>,
  ): Promise<T> {
    for (let attempt = 0; ; attempt++) {
      const trx = await this.options.db.transaction();
      let locked = false;
      let committing = false;
      try {
        const counters = await this.lock(trx, context);
        locked = true;
        const result = await action(trx, counters);
        committing = true;
        await trx.commit();
        return result;
      } catch (error) {
        let rolledBack = false;
        if (!trx.isCompleted()) {
          try {
            await trx.rollback();
            rolledBack = true;
          } catch {
            /* The outcome is not known safe. */
          }
        }
        const code = (error as { code?: string })?.code;
        if (
          !committing &&
          !locked &&
          rolledBack &&
          attempt < 3 &&
          ['SQLITE_BUSY', 'SQLITE_LOCKED', '40001', '40P01'].includes(
            code ?? '',
          )
        ) {
          await new Promise(resolve => setTimeout(resolve, 50 * 2 ** attempt));
          continue;
        }
        throw error;
      }
    }
  }

  private async checkFence(trx: Knex.Transaction): Promise<void> {
    const clock = this.sqlite
      ? "CASE WHEN typeof(expires_at) IN ('integer', 'real') THEN expires_at > (julianday('now') - 2440587.5) * 86400000 ELSE julianday(expires_at) > julianday('now') END"
      : 'expires_at > statement_timestamp()';
    const lease = await trx('ai_namespace_leases')
      .where(this.key)
      .where({
        owner_id: this.options.fence.owner,
        token: this.options.fence.token,
      })
      .whereRaw(clock)
      .first('token');
    if (!lease) throw new Error('Storage fence is stale or expired');
  }

  async commit(
    batches: readonly (readonly StorageWrite[])[],
    receive: (index: number, seq: Seq) => void,
    context: Context,
  ) {
    return this.enqueue(async () => {
      let stored = 0;
      for (const [index, writes] of batches.entries()) {
        const result = await this.transaction(
          context,
          async (trx, counters) => {
            const state = await this.snapshot(trx);
            const seq = Number(counters.next_seq) as Seq;
            if (!Number.isSafeInteger(seq))
              throw new Error('Sequence space is exhausted');
            let prepared;
            try {
              prepared = state.prepareCommit(writes, seq);
            } catch (error) {
              context.abortSignal?.throwIfAborted();
              await this.checkFence(trx);
              return { refused: error } as const;
            }
            let nextId = Number(counters.next_id);
            for (const write of prepared.writes) {
              let id: number | undefined;
              if (
                write.type === 'document.create' ||
                write.type === 'document.copy'
              ) {
                id = write.record.id;
              } else if ('value' in write) {
                id = write.value.id;
              }
              if (id !== undefined) nextId = Math.max(nextId, id + 1);
            }
            await this.checkFence(trx);
            await trx('ai_storage_commits').insert({
              ...this.key,
              seq,
              writes: JSON.stringify(prepared.writes),
            });
            await trx('ai_storage_counters')
              .where(this.key)
              .update({ next_id: String(nextId), next_seq: String(seq + 1) });
            context.abortSignal?.throwIfAborted();
            await this.checkFence(trx);
            return { seq } as const;
          },
        );
        if ('refused' in result) return { stored, refused: result.refused };
        stored++;
        receive(index, result.seq);
      }
      return { stored };
    });
  }

  publishing(publish: () => void, _context: Context): void {
    this.assertOpen();
    publish();
  }

  async mintId<I extends Id<string>>(): Promise<I> {
    return this.enqueue(() =>
      this.transaction(undefined, async (trx, counters) => {
        const next = Number(counters.next_id);
        if (!Number.isSafeInteger(next))
          throw new Error('ID space is exhausted');
        await trx('ai_storage_counters')
          .where(this.key)
          .update({ next_id: String(next + 1) });
        await this.checkFence(trx);
        return next as I;
      }),
    );
  }

  conversation(...args: Parameters<Storage['conversation']>) {
    return this.read(args[1], s => s.conversation(...args));
  }
  task(...args: Parameters<Storage['task']>) {
    return this.read(args[1], s => s.task(...args));
  }
  submission(...args: Parameters<Storage['submission']>) {
    return this.read(args[1], s => s.submission(...args));
  }
  submissionByRequest(...args: Parameters<Storage['submissionByRequest']>) {
    return this.read(args[2], s => s.submissionByRequest(...args));
  }
  findLatestHeadMarker(...args: Parameters<Storage['findLatestHeadMarker']>) {
    return this.read(args[2], s => s.findLatestHeadMarker(...args));
  }
  findDocument(...args: Parameters<Storage['findDocument']>) {
    return this.read(args[2], s => s.findDocument(...args));
  }
  document(...args: Parameters<Storage['document']>) {
    return this.read(args[2], s => s.document(...args));
  }

  entry(id: EntryId, context: Context): ReturnType<Storage['entry']>;
  entry(
    conversationId: ConversationId,
    id: EntryId,
    context: Context,
  ): ReturnType<Storage['entry']>;
  entry(
    first: ConversationId | EntryId,
    second: EntryId | Context,
    context?: Context,
  ): ReturnType<Storage['entry']> {
    return context === undefined
      ? this.read(second as Context, s =>
          s.entry(first as EntryId, second as Context),
        )
      : this.read(context, s =>
          s.entry(first as ConversationId, second as EntryId, context),
        );
  }

  private async scan<Q extends object, P extends { next?: Cursor }>(
    name: string,
    query: Q,
    cursor: Cursor | undefined,
    context: Context,
    action: (state: MemoryStorage) => Promise<P>,
  ): Promise<P> {
    const { order: _order, ...filter } = query as Q & { order?: string };
    const binding = JSON.stringify([
      this.key.plugin_id,
      this.key.session_id,
      name,
      filter,
    ]);
    if (cursor !== undefined && cursor.binding !== binding)
      throw new StorageRequestError('Invalid storage cursor for scan');
    const page = await this.read(context, action);
    if (page.next !== undefined)
      return { ...page, next: { ...page.next, binding } };
    return page;
  }

  scanConversations(
    query: Parameters<Storage['scanConversations']>[0],
    limit: number,
    cursor: Cursor | undefined,
    context: Context,
  ) {
    return this.scan('conversations', query, cursor, context, s =>
      s.scanConversations(query, limit, cursor, context),
    );
  }
  scanEntries(
    query: Parameters<Storage['scanEntries']>[0],
    limit: number,
    cursor: Cursor | undefined,
    context: Context,
  ) {
    return this.scan('entries', query, cursor, context, s =>
      s.scanEntries(query, limit, cursor, context),
    );
  }
  scanTasks(
    query: Parameters<Storage['scanTasks']>[0],
    limit: number,
    cursor: Cursor | undefined,
    context: Context,
  ) {
    return this.scan('tasks', query, cursor, context, s =>
      s.scanTasks(query, limit, cursor, context),
    );
  }
  scanSubmissions(
    query: Parameters<Storage['scanSubmissions']>[0],
    limit: number,
    cursor: Cursor | undefined,
    context: Context,
  ) {
    return this.scan('submissions', query, cursor, context, s =>
      s.scanSubmissions(query, limit, cursor, context),
    );
  }
  scanDocuments(
    query: Parameters<Storage['scanDocuments']>[0],
    limit: number,
    cursor: Cursor | undefined,
    context: Context,
  ) {
    return this.scan('documents', query, cursor, context, s =>
      s.scanDocuments(query, limit, cursor, context),
    );
  }

  async close(_context: Context): Promise<void> {
    this.closed = true;
    await this.tail;
  }
}

export async function createKnexStorage(
  options: KnexStorageOptions,
): Promise<Storage> {
  const { namespace, fence, db } = options;
  if (
    namespace.pluginId !== fence.namespace.pluginId ||
    namespace.sessionId !== fence.namespace.sessionId
  ) {
    throw new Error('Fence namespace does not match storage namespace');
  }
  if (
    !['pg', 'postgres', 'postgresql', 'better-sqlite3'].includes(
      String(db.client.config.client),
    )
  ) {
    throw new Error('Storage requires PostgreSQL or better-sqlite3');
  }
  if (db.client.config.client === 'better-sqlite3') {
    const connection = db.client.config.connection;
    const filename =
      typeof connection === 'object' &&
      connection !== null &&
      'filename' in connection
        ? connection.filename
        : undefined;
    if (
      typeof filename !== 'string' ||
      !filename ||
      filename.includes(':memory:') ||
      /[?&]mode=memory(?:&|$)/.test(filename)
    ) {
      throw new Error('Storage requires a file-backed SQLite database');
    }
  }
  if (!/^(0|[1-9][0-9]*)$/.test(fence.token))
    throw new Error('Invalid fence token');
  // Fail early if migrations have not been installed, without acquiring ownership.
  await db('ai_namespace_leases').select('token').limit(1);
  await db('ai_storage_counters').select('next_id').limit(1);
  await db('ai_storage_commits').select('seq').limit(1);
  return new KnexStorage(options);
}
