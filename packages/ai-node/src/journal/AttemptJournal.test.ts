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

import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import knex, { type Knex } from 'knex';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { NotAllowedError, NotFoundError } from '@backstage/errors';
import type { AttemptJournal, AuditEventView } from './types';
import { createAttemptJournal as createAttemptJournalBase } from './knex';
import { pruneAiJournal } from './retention';
import type { AttemptDecision } from './types';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';

const createAttemptJournal = (
  options: Parameters<typeof createAttemptJournalBase>[0],
) =>
  createAttemptJournalBase({ providers: builtinProviderRegistry, ...options });

const storageMigration = require('../../migrations/1000_storage');
const journalMigration = require('../../migrations/4000_journal');

const namespace = { pluginId: 'plugin', sessionId: 'session' };
const fence = { namespace, owner: 'owner', token: '1' };
const key = { plugin_id: namespace.pluginId, session_id: namespace.sessionId };
const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const decision: AttemptDecision = {
  actor: 'user:default/alice',
  conversationId: 'conv-1',
  taskId: 'task-1',
  callId: 'call-1',
  definitionVersion: 'registry-v1',
  configVersion: 'config-v1',
  provider: 'openai',
  model: 'gpt-4o',
  operation: 'models.stream',
  attempt: 1,
  decision: 'allow',
};

function credentials(
  ref: string,
): BackstageCredentials & { principal: { type: string } } {
  const [type] = ref.split(':');
  return {
    $$type: '@backstage/BackstageCredentials',
    principal:
      type === 'user'
        ? { type: 'user', userEntityRef: ref }
        : { type: 'service', subject: ref },
  } as BackstageCredentials & { principal: { type: string } };
}

function leaseTime(db: Knex, dialect: 'sqlite' | 'pg', seconds: number) {
  return dialect === 'sqlite'
    ? db.raw("(julianday('now') - 2440587.5) * 86400000 + ?", [seconds * 1000])
    : db.raw("statement_timestamp() + (? * interval '1 second')", [seconds]);
}

type Fixture = {
  db: Knex;
  journal: AttemptJournal;
  filename?: string;
  cleanup(): Promise<void>;
};

async function fixture(
  dialect: 'sqlite' | 'pg',
  options: { allowAuditRead?: boolean } = {},
): Promise<Fixture> {
  const allowAuditRead = options.allowAuditRead ?? true;
  let db: Knex;
  let cleanup: () => Promise<void>;
  let filename: string | undefined;
  if (dialect === 'sqlite') {
    const dir = await mkdtemp(join(tmpdir(), 'ai-journal-'));
    filename = join(dir, 'journal.sqlite');
    db = knex({
      client: 'better-sqlite3',
      connection: { filename },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
    await db.raw('PRAGMA busy_timeout = 5000');
    cleanup = async () => {
      await db.destroy();
      await rm(dir, { recursive: true, force: true });
    };
  } else {
    const admin = knex({ client: 'pg', connection: pgUrl });
    const schema = `ai_test_${randomUUID().replace(/-/g, '')}`;
    await admin.schema.createSchema(schema);
    db = knex({ client: 'pg', connection: pgUrl, searchPath: [schema] });
    cleanup = async () => {
      await db.destroy();
      await admin.schema.dropSchema(schema, true);
      await admin.destroy();
    };
  }
  try {
    await storageMigration.up(db);
    await journalMigration.up(db);
    await db('ai_namespace_leases').insert({
      ...key,
      owner_id: fence.owner,
      token: fence.token,
      expires_at: leaseTime(db, dialect, 60),
    });
    const journal = createAttemptJournal({
      db,
      authorizer: { authorizeAuditRead: async () => allowAuditRead },
    });
    return { db, journal, filename, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}

function freshDecision(
  overrides: Partial<AttemptDecision> = {},
): AttemptDecision {
  return { ...decision, callId: `call-${randomUUID()}`, ...overrides };
}

if (!pgUrl) {
  it.skip('PostgreSQL journal tests require AI_TEST_POSTGRES_URL', () => {});
}

for (const dialect of ['sqlite', 'pg'] as const) {
  if (dialect === 'pg' && !pgUrl) continue;
  describe(`AttemptJournal (${dialect})`, () => {
    it('records a decision whose outcome is unknown until recorded', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        expect(id).toMatch(/^(0|[1-9][0-9]*)$/);
        const page = await f.journal.read(credentials('user:default/alice'), {
          pluginId: namespace.pluginId,
          sessionId: namespace.sessionId,
        });
        expect(page.items).toHaveLength(1);
        expect(page.nextCursor).toBeUndefined();
        const [event] = page.items as Extract<
          AuditEventView,
          { kind: 'decision' }
        >[];
        expect(event.kind).toBe('decision');
        expect(event.actor).toBe('user:default/alice');
        expect(event.operation).toBe('models.stream');
        expect(event.decision).toBe('allow');
        expect(event.outcomeStatus).toBe('unknown');
        expect(event.fenceOwner).toBe('owner');
        expect(event.fenceToken).toBe('1');
        expect(event.recordedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);

        await f.journal.recordOutcome(fence, id, {
          status: 'completed',
          httpStatus: 200,
        });
        const settled = await f.journal.read(
          credentials('user:default/alice'),
          {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
          },
        );
        expect(settled.items).toHaveLength(2);
        const decisionAgain = settled.items.find(
          item => item.kind === 'decision',
        ) as Extract<AuditEventView, { kind: 'decision' }>;
        expect(decisionAgain.outcomeStatus).toBe('completed');
        const outcome = settled.items.find(
          item => item.kind === 'outcome',
        ) as Extract<AuditEventView, { kind: 'outcome' }>;
        expect(outcome.attemptId).toBe(id);
        expect(outcome.status).toBe('completed');
        expect(outcome.httpStatus).toBe(200);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects appends from a stale owner and preserves the raw rows', async () => {
      const f = await fixture(dialect);
      try {
        await f
          .db('ai_namespace_leases')
          .where(key)
          .update({ owner_id: 'new', token: 2 });
        await expect(
          f.journal.recordDecisionAndIntent(fence, freshDecision()),
        ).rejects.toThrow('fence');
        await expect(
          f.journal.recordRecovery(fence, {
            actor: 'user:default/alice',
            kind: 'needs-reauth',
          }),
        ).rejects.toThrow('fence');
        expect(await f.db('ai_journal_events').select('id')).toEqual([]);
        expect(
          await f.db('ai_journal_session_owners').select('owner_ref'),
        ).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects appends after lease expiry', async () => {
      const f = await fixture(dialect);
      try {
        await f
          .db('ai_namespace_leases')
          .where(key)
          .update({ expires_at: leaseTime(f.db, dialect, -1) });
        await expect(
          f.journal.recordDecisionAndIntent(fence, freshDecision()),
        ).rejects.toThrow('fence');
        expect(await f.db('ai_journal_events').select('id')).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('serializes takeover against a stale writer mid-append', async () => {
      const f = await fixture(dialect);
      try {
        if (dialect === 'pg') {
          const takeover = await f.db.transaction();
          await takeover('ai_namespace_leases')
            .where(key)
            .update({ owner_id: 'new', token: 2 });
          const attempt = f.journal.recordDecisionAndIntent(
            fence,
            freshDecision(),
          );
          await new Promise(resolve => setTimeout(resolve, 100));
          await takeover.commit();
          // Both dialect branches exercise the same assertion.
          // eslint-disable-next-line jest/no-conditional-expect
          await expect(attempt).rejects.toThrow('fence');
        } else {
          const script = `const Database = require('better-sqlite3'); const db = new Database(process.argv[1]); db.exec('BEGIN IMMEDIATE'); db.prepare('UPDATE ai_namespace_leases SET owner_id = ?, token = ? WHERE plugin_id = ? AND session_id = ?').run('new', 2, 'plugin', 'session'); console.log('locked'); setTimeout(() => { db.exec('COMMIT'); db.close(); }, 300);`;
          const child = spawn(process.execPath, ['-e', script, f.filename!], {
            stdio: ['ignore', 'pipe', 'inherit'],
          });
          const exited = once(child, 'exit');
          try {
            await once(child.stdout, 'data');
            // Both dialect branches exercise the same assertion.
            // eslint-disable-next-line jest/no-conditional-expect
            await expect(
              f.journal.recordDecisionAndIntent(fence, freshDecision()),
            ).rejects.toThrow('fence');
            await exited;
          } finally {
            child.kill();
          }
        }
        expect(await f.db('ai_journal_events').select('id')).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('preserves an unresolved intent as unknown across reopen', async () => {
      const f = await fixture(dialect);
      let reopened: Knex | undefined;
      try {
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        // Simulate a crash between the durable intent and the send: no
        // outcome is ever recorded, and the process goes away.
        const filename = f.filename;
        const schema = (f.db.client.config as { searchPath?: string[] })
          .searchPath?.[0];
        await f.db.destroy();
        reopened = knex(
          dialect === 'sqlite'
            ? {
                client: 'better-sqlite3',
                connection: { filename: filename! },
                useNullAsDefault: true,
              }
            : { client: 'pg', connection: pgUrl, searchPath: [schema!] },
        );
        const journal = createAttemptJournal({
          db: reopened,
          authorizer: { authorizeAuditRead: async () => true },
        });
        const page = await journal.read(credentials('user:default/alice'), {
          pluginId: namespace.pluginId,
          sessionId: namespace.sessionId,
        });
        const [event] = page.items as Extract<
          AuditEventView,
          { kind: 'decision' }
        >[];
        expect(event.id).toBe(id);
        expect(event.outcomeStatus).toBe('unknown');
        expect(
          await reopened('ai_journal_events').where({ kind: 'outcome' }),
        ).toEqual([]);
      } finally {
        await reopened?.destroy();
        await f.cleanup();
      }
    });

    it('rejects unredacted events at the boundary', async () => {
      const f = await fixture(dialect);
      try {
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            // Deliberately smuggle an unknown field; excess-property checking
            // is bypassed through this cast so the runtime boundary rejects.
            ...({ prompt: 'write me a poem about secrets' } as Record<
              string,
              unknown
            >),
          }),
        ).rejects.toThrow('unknown field');
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            reason: 'denied because the caller sent Bearer abc123',
          }),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            reason: 'sk-proj-0123456789abcdefghijklmnopqrstuv',
          }),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            model: '-----BEGIN RSA PRIVATE KEY-----',
          }),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({
              reason: 'a'.repeat(600),
            }),
          ),
        ).rejects.toThrow('Invalid reason');
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await expect(
          f.journal.recordOutcome(fence, id, {
            status: 'failed',
            detail: 'x'.repeat(60),
          }),
        ).rejects.toThrow('secret-shaped');
        expect(
          await f.db('ai_journal_events').where({ kind: 'outcome' }),
        ).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('stores no secret material in raw rows', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await f.journal.recordOutcome(fence, id, {
          status: 'stream-failed',
          detail: 'stream aborted mid-body',
        });
        await f.journal.recordRecovery(fence, {
          actor: 'user:default/alice',
          kind: 'unknown-dispatch',
          conversationId: 'conv-1',
          detail: 'worker closed before stream end',
        });
        const rows = await f.db('ai_journal_events').select();
        const dump = JSON.stringify(rows);
        for (const marker of [
          'sk-proj-',
          'Bearer',
          'PRIVATE KEY',
          'api-key',
          'password',
          'ghp_',
        ]) {
          expect(dump).not.toContain(marker);
        }
        expect(rows).toHaveLength(3);
      } finally {
        await f.cleanup();
      }
    });

    it('stores and validates canonical destinations', async () => {
      const f = await fixture(dialect);
      try {
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({
            destination: 'https://api.openai.com/v1/chat/completions',
          }),
        );
        const page = await f.journal.read(credentials('user:default/alice'), {
          pluginId: namespace.pluginId,
          sessionId: namespace.sessionId,
        });
        const [event] = page.items as Extract<
          AuditEventView,
          { kind: 'decision' }
        >[];
        expect(event.destination).toBe(
          'https://api.openai.com/v1/chat/completions',
        );
        void id;

        for (const bad of [
          'https://api.openai.com/v1?api_key=abc',
          'https://api.openai.com/v1#fragment',
          'https://api.openai.com/v1/responses?',
          'https://api.openai.com/v1/responses#',
          'https://user:pass@api.openai.com/v1',
          'file:///etc/passwd',
          'not a url',
        ]) {
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({ destination: bad }),
            ),
          ).rejects.toThrow('destination');
        }
        expect(await f.db('ai_journal_events').select('id')).toHaveLength(1);
      } finally {
        await f.cleanup();
      }
    });

    it('accepts only certified static model and auth paths', async () => {
      const f = await fixture(dialect);
      try {
        const destinations = [
          'https://api.openai.com/v1/responses',
          'https://my-resource.openai.azure.com/openai/v1/responses',
          'https://api.openai.com/v1/chat/completions',
          'https://api.anthropic.com/v1/messages',
          'https://chatgpt.com/backend-api/codex/responses',
          'https://MiXeD.Example.com:443/v1/responses',
          'http://localhost:1234/v1/responses',
          'http://127.0.0.1:1234/v1/responses',
          'http://[::1]:1234/v1/responses',
        ];
        for (const destination of destinations) {
          await f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({ destination }),
          );
        }
        for (const operation of ['auth.token', 'auth.token-exchange']) {
          for (const path of ['/oauth/token', '/v1/oauth/token']) {
            await f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({
                operation,
                destination: `https://auth.example.com${path}`,
              }),
            );
          }
        }
        const rows = await f.db('ai_journal_events').select('destination');
        expect(rows.map(row => row.destination)).toEqual([
          ...destinations,
          'https://auth.example.com/oauth/token',
          'https://auth.example.com/v1/oauth/token',
          'https://auth.example.com/oauth/token',
          'https://auth.example.com/v1/oauth/token',
        ]);
        for (const [operation, destination] of [
          ['models.stream', 'https://auth.example.com/oauth/token'],
          ['auth.token', 'https://api.example.com/v1/responses'],
        ]) {
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({ operation, destination }),
            ),
          ).rejects.toThrow('no approved route template');
        }
      } finally {
        await f.cleanup();
      }
    });

    it('records benign security words but never secret values', async () => {
      const f = await fixture(dialect);
      try {
        // The audit trail must be able to name auth classifications.
        await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({
            operation: 'auth.token',
            destination: 'https://auth.example.com/oauth/token',
            reason: 'credential expired; re-authentication required',
          }),
        );
        await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({
            operation: 'models.complete',
            reason: 'access token refresh needed before retry',
          }),
        );
        expect(await f.db('ai_journal_events')).toHaveLength(2);

        // But actual credential values fail closed in every free-text field.
        for (const bad of [
          'token=abcdef123456789',
          'Bearer abc123',
          'api_key: 0123456789abcdef',
          'sk-proj-0123456789abcdefghijklmnopqrstuv',
          '-----BEGIN RSA PRIVATE KEY-----',
        ]) {
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({ reason: bad }),
            ),
          ).rejects.toThrow('secret-shaped');
          await expect(
            f.journal.recordRecovery(fence, {
              actor: 'user:default/alice',
              kind: 'other',
              detail: bad,
            }),
          ).rejects.toThrow('secret-shaped');
        }
        // Unknown operations are unclassified code paths and fail closed.
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({ operation: 'models.unknown' }),
          ),
        ).rejects.toThrow('Invalid operation');
        expect(await f.db('ai_journal_events')).toHaveLength(2);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects embedded known credential values in every field class', async () => {
      const f = await fixture(dialect);
      try {
        const token = 'ghp_a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1';
        const jwt =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
        const awsKey = 'AKIAIOSFODNN7EXAMPLE';
        // Free text: embedded, not start-anchored.
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            reason: `provider rejected ${token}`,
          }),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(fence, {
            ...freshDecision(),
            model: `gpt-${jwt}`,
          }),
        ).rejects.toThrow('secret-shaped');
        // Actor is a structured principal reference, never free text.
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({ actor: `service:${awsKey}` }),
          ),
        ).rejects.toThrow('secret-shaped');
        // Destination path segments are checked after decoding.
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({ destination: `https://api.example.com/${token}` }),
          ),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({
              destination: `https://api.example.com/users%2F${jwt}`,
            }),
          ),
        ).rejects.toThrow('secret-shaped');
        // Recovery and outcome details too.
        await expect(
          f.journal.recordRecovery(fence, {
            actor: 'user:default/alice',
            kind: 'other',
            detail: `rotation failed for ${token}`,
          }),
        ).rejects.toThrow('secret-shaped');
        const id = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await expect(
          f.journal.recordOutcome(fence, id, {
            status: 'failed',
            detail: `upstream said ${awsKey}`,
          }),
        ).rejects.toThrow('secret-shaped');
        expect(await f.db('ai_journal_events').select('id')).toHaveLength(1);
        // Benign security words and paths still pass.
        await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({
            operation: 'auth.token',
            destination: 'https://auth.example.com/oauth/token',
            reason: 'credential expired; re-authentication required',
          }),
        );
        expect(await f.db('ai_journal_events').select('id')).toHaveLength(2);
      } finally {
        await f.cleanup();
      }
    });

    it('accepts real plugin and external service principals end to end', async () => {
      const f = await fixture(dialect);
      try {
        // Authenticated subjects are opaque strings: each native principal
        // form — including JWKS issuer subjects whose `sub` contains
        // colons and slashes — appends under its exact normalized form and
        // reads its own journal back, because the reader principal is
        // derived by the same normalization.
        const actors = [
          'plugin:catalog',
          'external:billing-api',
          'external:issuer:billing-api',
          'external:repo:org/repo:ref:refs/heads/main',
          'user:default/alice',
        ];
        for (const [index, actor] of actors.entries()) {
          const sessionId = `session-${index}`;
          const actorFence = {
            namespace: { pluginId: namespace.pluginId, sessionId },
            owner: fence.owner,
            token: fence.token,
          };
          await f.db('ai_namespace_leases').insert({
            plugin_id: namespace.pluginId,
            session_id: sessionId,
            owner_id: fence.owner,
            token: fence.token,
            expires_at: leaseTime(f.db, dialect, 60),
          });
          await f.journal.recordDecisionAndIntent(
            actorFence,
            freshDecision({ actor }),
          );
          const ownPage = await f.journal.read(credentials(actor), {
            pluginId: namespace.pluginId,
            sessionId,
          });
          const ownDecision = ownPage.items.find(
            item => item.kind === 'decision',
          ) as Extract<AuditEventView, { kind: 'decision' }>;
          expect(ownDecision.actor).toBe(actor);

          // Cross-principal reads of the same session deny.
          const other = actors[(index + 1) % actors.length];
          await expect(
            f.journal.read(credentials(other), {
              pluginId: namespace.pluginId,
              sessionId,
            }),
          ).rejects.toThrow(NotAllowedError);
        }
      } finally {
        await f.cleanup();
      }
    });

    it('uses the same principal validation for appends and resolver-backed reads', async () => {
      const f = await fixture(dialect);
      try {
        const query = { ...namespace };
        for (const [subject, valid] of [
          ['', false],
          ['x'.repeat(513), false],
          ['user:default/alice\n', false],
          [' user:default/alice', false],
          ['user:default/alice ', false],
          ['https://issuer.example.net/alice', true],
          ['x.'.repeat(256), true],
        ] as const) {
          for (const type of ['user', 'service'] as const) {
            const reader = {
              $$type: '@backstage/BackstageCredentials',
              principal:
                type === 'user'
                  ? { type, userEntityRef: subject }
                  : { type, subject },
            } as BackstageCredentials;
            const journal = createAttemptJournal({
              db: f.db,
              authorizer: { authorizeAuditRead: async () => true },
              ownershipResolver: async () => subject,
            });
            const appended = await journal
              .recordDecisionAndIntent(fence, freshDecision({ actor: subject }))
              .then(
                () => true,
                error => {
                  if (!String(error.message).includes('Invalid actor'))
                    throw error;
                  return false;
                },
              );
            const allowed = await journal.read(reader, query).then(
              () => true,
              error => {
                if (!(error instanceof NotAllowedError)) throw error;
                return false;
              },
            );
            expect({ appended, allowed }).toEqual({
              appended: valid,
              allowed: valid,
            });
          }
        }
      } finally {
        await f.cleanup();
      }
    });

    it('hashes dynamic route values in raw rows, reads and mirrors', async () => {
      const f = await fixture(dialect);
      const mirrored: AuditEventView[] = [];
      const journal = createAttemptJournal({
        db: f.db,
        authorizer: { authorizeAuditRead: async () => true },
        mirror: {
          mirror: async event => {
            mirrored.push(event);
          },
        },
      });
      try {
        const values = [
          'GPT4o-PROD-20261117',
          'ngCCU70RuJyRwtoMhMN4WFAqkVN2tKyYwWTeUh/MXvXnvBCFPtCSMVK5sWzmGqUl',
          '36e30f114e4a7f293a5b4dafe72b7765/bc5e5ce0ea555121d1e4a31e40ccc853',
          'MFRGGZDFMZTWQ2LKNNWG23TPOIXXIYLM/MFRGGZDFMZTWQ2LKNNWG23TPOIXXIYLM',
          'bcdefghijklmnopqrstuvwxyzabcdefg/hijklmnopqrstuvwxyzabcdefghijklm',
        ];
        const expected: string[] = [];
        for (const value of values) {
          for (const encoded of [
            value,
            value.replaceAll('/', '%2F'),
            value.replaceAll('/', '%252F'),
          ]) {
            const digest = createHash('sha256')
              .update(value)
              .digest('hex')
              .slice(0, 16);
            expected.push(
              `https://my-resource.openai.azure.com/openai/deployments/{deployment=${digest}}/responses`,
            );
            await journal.recordDecisionAndIntent(
              fence,
              freshDecision({
                destination: `https://my-resource.openai.azure.com/openai/deployments/${encoded}/responses`,
              }),
            );
          }
        }
        const rows = await f
          .db('ai_journal_events')
          .orderBy('id')
          .select('destination');
        const page = await journal.read(
          credentials('user:default/alice'),
          namespace,
        );
        expect(rows.map(row => row.destination)).toEqual(expected);
        expect(
          page.items.map(item => item.kind === 'decision' && item.destination),
        ).toEqual(expected);
        expect(
          mirrored.map(item => item.kind === 'decision' && item.destination),
        ).toEqual(expected);
        const dump = JSON.stringify({ rows, page, mirrored });
        for (const value of values) expect(dump).not.toContain(value);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects unapproved routes and known credentials before hashing', async () => {
      const f = await fixture(dialect);
      try {
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({
              destination:
                'https://my-resource.openai.azure.com/openai/deployments/GPT4o-PROD-20261117/chat/completions',
            }),
          ),
        ).rejects.toThrow('no approved route template');
        for (const destination of [
          'https://example.com/v1/projects/my-project',
          'http://example.com/v1/responses',
        ]) {
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({ destination }),
            ),
          ).rejects.toThrow('destination');
        }
        const tokens = [
          'ghp_a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1',
          'xoxb-12345678901234567890',
          'AKIAIOSFODNN7EXAMPLE',
          'AIza012345678901234567890123456789',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          '-----BEGIN RSA PRIVATE KEY-----',
          'Bearer abcdef123456789',
        ];
        for (const token of tokens) {
          const encoded = encodeURIComponent(token);
          // Splitting known patterns at a slash must not hide them.
          const at = token.startsWith('Bearer')
            ? token.length - 8
            : Math.floor(token.length / 2);
          for (const value of [
            encoded,
            ...['/', '%2F', '%252F'].map(
              separator =>
                `${encodeURIComponent(
                  token.slice(0, at),
                )}${separator}${encodeURIComponent(token.slice(at))}`,
            ),
          ]) {
            await expect(
              f.journal.recordDecisionAndIntent(
                fence,
                freshDecision({
                  destination: `https://example.com/openai/deployments/${value}/responses`,
                }),
              ),
            ).rejects.toThrow('secret-shaped');
          }
        }
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({
              destination:
                'https://ghp_a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1.example.com/v1/responses',
            }),
          ),
        ).rejects.toThrow('secret-shaped');
        await expect(
          f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({
              operation: 'auth.token',
              destination: 'https://example.com/not-a-token-route',
            }),
          ),
        ).rejects.toThrow('no approved route template');
        expect(await f.db('ai_journal_events').select('id')).toEqual([]);
      } finally {
        await f.cleanup();
      }
    });

    it('rejects label-prefixed credential values in every field class', async () => {
      const f = await fixture(dialect);
      try {
        const pat = 'ghp_a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1a1';
        for (const prefixed of [`x${pat}`, `_${pat}`]) {
          await expect(
            f.journal.recordDecisionAndIntent(fence, {
              ...freshDecision(),
              reason: `provider rejected ${prefixed}`,
            }),
          ).rejects.toThrow('secret-shaped');
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({ actor: `service:${prefixed}` }),
            ),
          ).rejects.toThrow('secret-shaped');
          await expect(
            f.journal.recordDecisionAndIntent(
              fence,
              freshDecision({
                destination: `https://api.example.com/${prefixed}`,
              }),
            ),
          ).rejects.toThrow('secret-shaped');
          await expect(
            f.journal.recordRecovery(fence, {
              actor: 'user:default/alice',
              kind: 'other',
              detail: `rotation failed for ${prefixed}`,
            }),
          ).rejects.toThrow('secret-shaped');
        }
        expect(await f.db('ai_journal_events').select('id')).toEqual([]);

        // Benign structured identifiers that merely contain short
        // key-like fragments still pass.
        await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({
            taskId: 'task-01HZX4T8Z9WK2Q3V8Z9WK2Q3V8',
            reason: 'task-management-module-planning completed',
          }),
        );
        expect(await f.db('ai_journal_events').select('id')).toHaveLength(1);
      } finally {
        await f.cleanup();
      }
    });

    it('mirrors 64-bit IDs exactly above 2^53 (SQLite)', async () => {
      const f = await fixture('sqlite');
      const mirrored: AuditEventView[] = [];
      const journal = createAttemptJournal({
        db: f.db,
        authorizer: { authorizeAuditRead: async () => true },
        mirror: {
          mirror: async event => {
            mirrored.push(event);
          },
        },
      });
      try {
        await journal.recordDecisionAndIntent(fence, freshDecision());
        await f
          .db('sqlite_sequence')
          .where({ name: 'ai_journal_events' })
          .update({ seq: 9007199254740992 });
        const high = await journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        expect(high).toBe('9007199254740993');
        await journal.recordOutcome(fence, high, { status: 'completed' });
        const highDecision = mirrored.find(
          event => event.kind === 'decision' && event.id === high,
        );
        const highOutcome = mirrored.find(event => event.kind === 'outcome');
        expect(highDecision).toBeDefined();
        expect(highOutcome?.attemptId).toBe(high);
        expect(mirrored.every(event => /^\d+$/.test(event.id))).toBe(true);
      } finally {
        await f.cleanup();
      }
    });

    it('enforces outcome integrity rules', async () => {
      const f = await fixture(dialect);
      try {
        await expect(
          f.journal.recordOutcome(fence, '999', { status: 'completed' }),
        ).rejects.toThrow('no decision found');
        const denied = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision({ decision: 'deny', reason: 'permission denied' }),
        );
        await expect(
          f.journal.recordOutcome(fence, denied, { status: 'completed' }),
        ).rejects.toThrow('denied and never sent');
        const allowed = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await f.journal.recordOutcome(fence, allowed, {
          status: 'cancelled',
        });
        await expect(
          f.journal.recordOutcome(fence, allowed, { status: 'failed' }),
        ).rejects.toThrow('already has one');
        const page = await f.journal.read(credentials('user:default/alice'), {
          pluginId: namespace.pluginId,
          sessionId: namespace.sessionId,
        });
        const denial = page.items.find(
          item => item.kind === 'decision' && item.decision === 'deny',
        ) as Extract<AuditEventView, { kind: 'decision' }>;
        expect(denial.outcomeStatus).toBeUndefined();
      } finally {
        await f.cleanup();
      }
    });

    it('enforces ownership and ai.audit.read on reads', async () => {
      const f = await fixture(dialect);
      try {
        await f.journal.recordDecisionAndIntent(fence, freshDecision());
        const query = {
          pluginId: namespace.pluginId,
          sessionId: namespace.sessionId,
        };

        // Owner without the permission: denied.
        const strict = createAttemptJournal({
          db: f.db,
          authorizer: { authorizeAuditRead: async () => false },
        });
        await expect(
          strict.read(credentials('user:default/alice'), query),
        ).rejects.toThrow(NotAllowedError);

        // Non-owner with the permission: denied.
        await expect(
          f.journal.read(credentials('user:default/bob'), query),
        ).rejects.toThrow(NotAllowedError);

        // Unauthenticated: denied.
        await expect(
          f.journal.read(
            {
              $$type: '@backstage/BackstageCredentials',
              principal: { type: 'none' },
            } as BackstageCredentials,
            query,
          ),
        ).rejects.toThrow(NotAllowedError);

        // Both ownership and permission: allowed.
        const page = await f.journal.read(
          credentials('user:default/alice'),
          query,
        );
        expect(page.items).toHaveLength(1);

        // A different session is not this session's audit trail.
        await expect(
          f.journal.read(credentials('user:default/alice'), {
            ...query,
            sessionId: 'other',
          }),
        ).rejects.toThrow(NotFoundError);
      } finally {
        await f.cleanup();
      }
    });

    it('paginates events in numeric ID order across decimal widths', async () => {
      const f = await fixture(dialect);
      try {
        for (let i = 0; i < 15; i++) {
          await f.journal.recordDecisionAndIntent(
            fence,
            freshDecision({ attempt: i + 1 }),
          );
        }
        const seen: string[] = [];
        let cursor: string | undefined;
        for (;;) {
          const page = await f.journal.read(credentials('user:default/alice'), {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
            limit: 3,
            cursor,
          });
          expect(page.items.length).toBeLessThanOrEqual(3);
          seen.push(...page.items.map(item => item.id));
          cursor = page.nextCursor;
          if (!cursor) break;
        }
        // Numeric, not lexicographic: 1..15, never 1,10,11,...,2,...
        expect(seen.map(id => Number(id))).toEqual(
          [...Array(15).keys()].map(i => i + 1),
        );
        expect(new Set(seen).size).toBe(15);
        await expect(
          f.journal.read(credentials('user:default/alice'), {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
            cursor: 'not-a-cursor',
          }),
        ).rejects.toThrow('cursor');
        await expect(
          f.journal.read(credentials('user:default/alice'), {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
            limit: 0,
          }),
        ).rejects.toThrow('limit');
      } finally {
        await f.cleanup();
      }
    });

    if (dialect === 'pg') {
      // Only meaningful on PostgreSQL, whose separate-statement clock makes
      // the expiry-after-lock-wait window observable.
      // eslint-disable-next-line jest/no-conditional-expect
      it('rejects an append whose lease expired while it waited for the row lock', async () => {
        // Same owner and token throughout: only the database clock expires.
        // The append locks the lease row first and reads the clock in a
        // separate statement after acquiring the lock, so expiry during the
        // wait must still reject. A transaction-start clock would pass the
        // check here and fail this test.
        const f = await fixture('pg');
        try {
          await f
            .db('ai_namespace_leases')
            .where(key)
            .update({
              expires_at: f.db.raw(
                "statement_timestamp() + interval '1 second'",
              ),
            });
          const holder = await f.db.transaction();
          await holder('ai_namespace_leases').where(key).forUpdate().first();
          const attempt = f.journal.recordDecisionAndIntent(
            fence,
            freshDecision(),
          );
          await new Promise(resolve => setTimeout(resolve, 1500));
          await holder.commit();
          // eslint-disable-next-line jest/no-conditional-expect
          await expect(attempt).rejects.toThrow('fence');
          // eslint-disable-next-line jest/no-conditional-expect
          expect(await f.db('ai_journal_events').select('id')).toEqual([]);
        } finally {
          await f.cleanup();
        }
      });
    }

    it('keeps 64-bit IDs exact above 2^53 (SQLite)', async () => {
      const f = await fixture('sqlite');
      try {
        const low = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await f
          .db('sqlite_sequence')
          .where({ name: 'ai_journal_events' })
          .update({ seq: 9007199254740992 });
        const high = await f.journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        expect(high).toBe('9007199254740993');
        // The outcome lookup must find the exact high decision row.
        await f.journal.recordOutcome(fence, high, { status: 'completed' });
        // Keyset pagination returns exact IDs in order.
        const seen: string[] = [];
        let cursor: string | undefined;
        for (;;) {
          const page = await f.journal.read(credentials('user:default/alice'), {
            pluginId: namespace.pluginId,
            sessionId: namespace.sessionId,
            limit: 1,
            cursor,
          });
          seen.push(...page.items.map(item => item.id));
          cursor = page.nextCursor;
          if (!cursor) break;
        }
        expect(seen).toHaveLength(3);
        expect(seen[0]).toBe(low);
        expect(seen[1]).toBe(high);
        const outcome = await f
          .db('ai_journal_events')
          .where({ kind: 'outcome' })
          .first(f.db.raw('CAST(attempt_id AS TEXT) AS attempt_id'));
        expect(outcome.attempt_id).toBe(high);
        // Retention targets the exact high-ID attempt: age it in SQL text
        // form and prune.
        await f
          .db('ai_journal_events')
          .whereRaw('id = 9007199254740993')
          .update({ created_at: '2000-01-01T00:00:00.000Z' });
        const result = await pruneAiJournal(f.db, {
          retentionMs: 60_000,
        });
        expect(result.prunedEvents).toBe(2); // high decision + its outcome
        const remaining = await f
          .db('ai_journal_events')
          .select(f.db.raw('CAST(id AS TEXT) AS id'));
        expect(remaining.map(row => row.id)).toEqual([low]);
      } finally {
        await f.cleanup();
      }
    });

    it('reads timestamps as UTC regardless of host timezone', async () => {
      const f = await fixture(dialect);
      try {
        await f.journal.recordDecisionAndIntent(fence, freshDecision());
        const raw = await f.db('ai_journal_events').first('created_at');
        const expected = new Date(
          typeof raw.created_at === 'string' &&
          !/[zZ]|[+-]\d{2}:?\d{2}$/.test(raw.created_at)
            ? `${raw.created_at.replace(' ', 'T')}Z`
            : (raw.created_at as string | number | Date),
        ).toISOString();
        const previous = process.env.TZ;
        try {
          for (const zone of ['America/Los_Angeles', 'Asia/Tokyo', 'UTC']) {
            process.env.TZ = zone;
            const page = await f.journal.read(
              credentials('user:default/alice'),
              {
                pluginId: namespace.pluginId,
                sessionId: namespace.sessionId,
              },
            );
            expect(page.items[0].recordedAt).toBe(expected);
          }
        } finally {
          if (previous === undefined) delete process.env.TZ;
          else process.env.TZ = previous;
        }
      } finally {
        await f.cleanup();
      }
    });

    it('mirrors committed events best-effort without failing appends', async () => {
      const f = await fixture(dialect);
      const mirrored: AuditEventView[] = [];
      const journal = createAttemptJournal({
        db: f.db,
        authorizer: { authorizeAuditRead: async () => true },
        mirror: {
          mirror: async event => {
            if (event.kind === 'recovery') {
              throw new Error('auditor unavailable');
            }
            mirrored.push(event);
          },
        },
      });
      try {
        const id = await journal.recordDecisionAndIntent(
          fence,
          freshDecision(),
        );
        await journal.recordOutcome(fence, id, { status: 'completed' });
        await journal.recordRecovery(fence, {
          actor: 'user:default/alice',
          kind: 'other',
        });
        expect(mirrored.map(event => event.kind)).toEqual([
          'decision',
          'outcome',
        ]);
        // The recovery event is a committed journal fact despite the mirror
        // failure.
        expect(
          await f.db('ai_journal_events').where({ kind: 'recovery' }),
        ).toHaveLength(1);
      } finally {
        await f.cleanup();
      }
    });
  });
}
