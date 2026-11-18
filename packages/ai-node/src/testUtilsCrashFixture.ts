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

import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join, relative, resolve } from 'node:path';
import type { Knex } from 'knex';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { Fence, Namespace } from './contracts';
import { createAttemptJournal } from './journal/knex';
import { createModelOperationGuard } from './guard/createModelOperationGuard';
import type { ModelOperation, TrustedOperation } from './guard/types';
import type { AiProviderRegistry } from './providers/registry';
import { builtinProviderRegistry } from './providers/testFixtures';

const storageMigration = require('../migrations/1000_storage');
const journalMigration = require('../migrations/4000_journal');

/** Environment flag the child branch of a crash test runs under. @alpha */
export const CRASH_TEST_CHILD_ENV = 'AI_CRASH_TEST_CHILD';

/** Origin the child reaches; a bare server that never answers. @alpha */
export const CRASH_TEST_ORIGIN_ENV = 'AI_CRASH_TEST_ORIGIN';

/** Database file the child appends to. @alpha */
export const CRASH_TEST_DB_ENV = 'AI_CRASH_TEST_DB';

/** Namespace the child writes with. @alpha */
export const CRASH_TEST_NAMESPACE_ENV = 'AI_CRASH_TEST_NAMESPACE';

/** Fence the child writes with. @alpha */
export const CRASH_TEST_FENCE_ENV = 'AI_CRASH_TEST_FENCE';

const DEFAULT_NAMESPACE: Namespace = {
  pluginId: 'crash-test',
  sessionId: 'session',
};

/**
 * A prepared crash fixture: a migrated database and a leased namespace.
 *
 * @remarks
 * The journal over the fixture's database stays internal; tests raise the
 * crash cell through {@link CrashTestFixture.assertCrashUnknown}.
 *
 * @alpha
 */
export interface CrashTestFixture {
  readonly namespace: Namespace;
  readonly fence: Fence;
  readonly credentials: BackstageCredentials;
  /** Raise this from the certification harness's crash cell. */
  assertCrashUnknown(options?: CrashTestOptions): Promise<void>;
}

/** Options for {@link createCrashTestFixture}. @alpha */
export interface CrashTestFixtureOptions {
  /** Knex client, typically a file-backed better-sqlite3 database. */
  readonly db: Knex;
  /** Namespace the child writes to; defaults to `crash-test/session`. */
  readonly namespace?: Namespace;
  /** Provider registry used to parse the journal; defaults to the built-ins. */
  readonly providers?: AiProviderRegistry;
  /** Read authorizer for the assertion; defaults to granted. */
  readonly authorizeAuditRead?: (credentials: BackstageCredentials) => boolean;
}

/** Options for {@link CrashTestFixture.assertCrashUnknown}. @alpha */
export interface CrashTestOptions {
  /** Test file the child runs; defaults to the calling test file. */
  readonly testFile?: string;
  /** Extra environment for the child, e.g. which provider to exercise. */
  readonly env?: Readonly<Record<string, string | undefined>>;
  /** How long to wait for the child's request before failing, ms. */
  readonly timeoutMs?: number;
}

function repoRootFrom(start: string): string {
  let current = resolve(start);
  for (;;) {
    const manifest = join(current, 'package.json');
    if (existsSync(manifest)) {
      // eslint-disable-next-line @backstage/no-undeclared-imports
      const parsed = require(manifest) as { workspaces?: unknown };
      if (parsed.workspaces !== undefined) return current;
    }
    const parent = dirname(current);
    if (parent === current) return resolve(start);
    current = parent;
  }
}

function callingTestFile(explicit: string | undefined): string {
  if (explicit) return resolve(explicit);
  const state = (
    expect as unknown as { getState?: () => { testPath?: string } }
  ).getState?.();
  if (!state?.testPath) {
    throw new Error(
      'Crash fixture needs a test file: pass { testFile } when the calling path is unknown',
    );
  }
  return state.testPath;
}

/**
 * Prepares a database for the certified crash test.
 *
 * @remarks
 * Applies the storage and journal migrations, leases one namespace and returns
 * the real journal plus an `assertCrashUnknown` closure. The closure runs the
 * given test file in a child process, waits for its request to arrive at a
 * server that never answers, kills the process group, and then asserts the
 * durable record: one allowed decision, no outcome row, `unknown` status.
 *
 * This is a test utility, not part of the service: the journal's write
 * machinery stays internal, and only the fixture is exported so provider
 * packages can run the full certification from the public surface.
 *
 * @alpha
 */
export async function createCrashTestFixture(
  options: CrashTestFixtureOptions,
): Promise<CrashTestFixture> {
  const namespace = options.namespace ?? DEFAULT_NAMESPACE;
  const fence: Fence = { namespace, owner: 'owner', token: '1' };
  const credentials = mockCredentials.user('user:default/alice');
  const providers = options.providers ?? builtinProviderRegistry;

  await storageMigration.up(options.db);
  await journalMigration.up(options.db);
  await options
    .db('ai_namespace_leases')
    .insert({
      plugin_id: namespace.pluginId,
      session_id: namespace.sessionId,
      owner_id: fence.owner,
      token: fence.token,
      expires_at:
        options.db.client.config.client === 'better-sqlite3'
          ? options.db.raw("(julianday('now') - 2440587.5) * 86400000 + 60000")
          : options.db.raw("statement_timestamp() + interval '60 seconds'"),
    })
    .onConflict(['plugin_id', 'session_id'])
    .ignore();

  const journal = createAttemptJournal({
    db: options.db,
    providers,
    authorizer: {
      authorizeAuditRead: async reader =>
        options.authorizeAuditRead ? options.authorizeAuditRead(reader) : true,
    },
  });

  return {
    namespace,
    fence,
    credentials,
    async assertCrashUnknown(crash: CrashTestOptions = {}) {
      const testFile = callingTestFile(crash.testFile);
      const root = repoRootFrom(testFile);
      const server = createServer();
      server.listen(0, '127.0.0.1');
      await once(server, 'listening');
      const address = server.address();
      if (!address || typeof address === 'string') {
        throw new Error('No crash-fixture port');
      }
      const filename = (
        options.db.client.config.connection as { filename?: unknown }
      )?.filename;
      const child = spawn(
        'yarn',
        ['test', relative(root, testFile), '--runInBand'],
        {
          cwd: root,
          detached: true,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: {
            ...process.env,
            CI: '1',
            [CRASH_TEST_CHILD_ENV]: '1',
            [CRASH_TEST_ORIGIN_ENV]: `http://127.0.0.1:${address.port}`,
            ...(typeof filename === 'string'
              ? {
                  [CRASH_TEST_DB_ENV]: filename,
                  [CRASH_TEST_NAMESPACE_ENV]: JSON.stringify(namespace),
                  [CRASH_TEST_FENCE_ENV]: JSON.stringify(fence),
                }
              : {}),
            ...crash.env,
          },
        },
      );
      let output = '';
      child.stdout.on('data', chunk => {
        output += chunk;
      });
      child.stderr.on('data', chunk => {
        output += chunk;
      });
      const exited = once(child, 'exit');
      try {
        await Promise.race([
          once(server, 'request'),
          exited.then(() => {
            throw new Error(`crash worker exited before send: ${output}`);
          }),
          new Promise((_, reject) => {
            setTimeout(
              () =>
                reject(
                  new Error(
                    `crash worker timed out after ${
                      crash.timeoutMs ?? 20000
                    }ms: ${output}`,
                  ),
                ),
              crash.timeoutMs ?? 20000,
            ).unref();
          }),
        ]);
        process.kill(-child.pid!, 'SIGKILL');
        await exited;
        const page = await journal.read(credentials, namespace);
        expect(page.items).toHaveLength(1);
        expect(page.items[0]).toMatchObject({
          kind: 'decision',
          decision: 'allow',
          outcomeStatus: 'unknown',
        });
        expect(
          await options.db('ai_journal_events').where({ kind: 'outcome' }),
        ).toEqual([]);
      } finally {
        try {
          process.kill(-child.pid!, 'SIGKILL');
        } catch {
          /* already exited */
        }
        server.closeAllConnections();
        await new Promise<void>(done => server.close(() => done()));
      }
    },
  };
}

/**
 * One guarded dispatch a crash worker can perform.
 *
 * @alpha
 */
export interface CrashChildBinding {
  /** Guarded transport to hand to the provider adapter. */
  readonly fetch: typeof fetch;
  /** The trusted operation the transport is bound to. */
  readonly operation: TrustedOperation;
}

/**
 * Input for {@link CrashChildContext.bind}.
 *
 * @alpha
 */
export interface CrashChildBindInput {
  /** Provider ID the operation dispatches to. */
  readonly provider: string;
  /** Model ID the operation resolves to. */
  readonly modelId: string;
  /** Model ID actually sent; defaults to `modelId`. */
  readonly resolvedModel?: string;
  /** Guarded model operation, e.g. `streamSimple` or `complete`. */
  readonly operation: ModelOperation;
  /** Provider API identifier of the adapter making the call. */
  readonly api: string;
  /** Exact destination URL the operation is allowed to reach. */
  readonly destination: string;
}

/**
 * What a crash worker receives in its own process.
 *
 * @alpha
 */
export interface CrashChildContext {
  /** The origin the parent is watching; it never answers. */
  readonly origin: string;
  readonly namespace: Namespace;
  readonly fence: Fence;
  /**
   * Binds one trusted operation to this process's fence and returns the
   * guarded transport to hand to the provider adapter.
   */
  bind(input: CrashChildBindInput): CrashChildBinding;
}

/**
 * Runs the child half of a crash test.
 *
 * @remarks
 * Reads the environment the parent set, opens the same database file, binds a
 * real guarded operation and hands it to `dispatch`. The parent kills this
 * process once the request arrives, so `dispatch` never returns in a passing
 * run; it stays pending on the unanswering server.
 *
 * @alpha
 */
export async function runCrashChild(options: {
  providers: AiProviderRegistry;
  dispatch(context: CrashChildContext): Promise<void>;
}): Promise<void> {
  const origin = process.env[CRASH_TEST_ORIGIN_ENV];
  const filename = process.env[CRASH_TEST_DB_ENV];
  const namespaceEnv = process.env[CRASH_TEST_NAMESPACE_ENV];
  const fenceEnv = process.env[CRASH_TEST_FENCE_ENV];
  if (!origin || !filename || !namespaceEnv || !fenceEnv) {
    throw new Error('Crash child ran without the parent environment');
  }
  const knexFactory: typeof import('knex') = require('knex');
  const db = knexFactory({
    client: 'better-sqlite3',
    connection: { filename },
    useNullAsDefault: true,
    pool: { min: 1, max: 1 },
  });
  const namespace = JSON.parse(namespaceEnv) as Namespace;
  const fence = JSON.parse(fenceEnv) as Fence;
  try {
    const journal = createAttemptJournal({
      db,
      providers: options.providers,
      authorizer: { authorizeAuditRead: async () => true },
    });
    const guard = createModelOperationGuard({
      providers: options.providers,
      journal,
      recheck: async () => true,
      transport: globalThis.fetch,
    });
    await options.dispatch({
      origin,
      namespace,
      fence,
      bind(input) {
        const operation: TrustedOperation = {
          actor: 'user:default/alice',
          credentials: mockCredentials.user('user:default/alice'),
          provenance: {
            origin: 'verified',
            conversationId: '1',
            taskId: '2',
            callId: '3',
          },
          fence,
          definitionVersion: 'v1',
          configVersion: 'v1',
          provider: input.provider,
          modelId: input.modelId,
          resolvedModel: input.resolvedModel ?? input.modelId,
          operation: input.operation,
          api: input.api,
          destination: input.destination,
          credentialScope: { kind: 'user', id: 'user:default/alice' },
          credentialGeneration: '1',
          controller: new AbortController(),
        };
        return {
          operation,
          fetch: guard.bind(operation).fetch as typeof fetch,
        };
      },
    });
  } finally {
    // Unreachable in a passing run; the parent kills the process first.
    await db.destroy();
  }
}
