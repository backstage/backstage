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
import knex, { type Knex } from 'knex';
import { ConfigReader } from '@backstage/config';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import {
  aiServiceRef,
  createAiServiceFactory,
  aiToolConditions,
  type AiService,
} from '@backstage/ai-node/alpha';
import { createRegistry } from '@earendil-works/pi-durable';
import {
  createRawShellToolModule,
  type RawShellResult,
} from './rawShellToolModule';

/**
 * The shell tool driven through the stock service: registration, the guarded
 * per-attempt permission check, the fence, journaling and the feature gate are
 * the real ones; only the host's database is a test database.
 */
describe('raw shell tool server', () => {
  let directory: string;
  let db: Knex;

  beforeAll(async () => {
    directory = await mkdtemp(join(tmpdir(), 'ai-node-shell-'));
    db = knex({
      client: 'better-sqlite3',
      connection: { filename: join(directory, 'ai.sqlite') },
      useNullAsDefault: true,
      pool: { min: 1, max: 1 },
    });
  });

  afterAll(async () => {
    await db.destroy();
    await rm(directory, { recursive: true, force: true });
  });

  const credentials = mockCredentials.user('user:default/alice');

  async function buildService(
    authorize: (
      credentials: BackstageCredentials,
      name: string,
    ) => Promise<unknown>,
    options: { timeoutMs?: number } = {},
  ): Promise<AiService> {
    const factory = createAiServiceFactory({
      toolModules: [createRawShellToolModule({ timeoutMs: options.timeoutMs })],
    })(aiServiceRef);
    const create = (
      factory as unknown as { factory(deps: unknown): Promise<AiService> }
    ).factory;
    return create({
      database: { getClient: async () => db },
      config: new ConfigReader({}),
      auth: {
        isPrincipal: (value: BackstageCredentials, type: 'user' | 'service') =>
          (value.principal as { type: string }).type === type,
        getOwnServiceCredentials: async () => mockCredentials.service(),
      },
      permissions: {
        authorize: async (
          requests: Array<{ permission: { name: string } }>,
          requestOptions: { credentials: BackstageCredentials },
        ) =>
          Promise.all(
            requests.map(request =>
              authorize(requestOptions.credentials, request.permission.name),
            ),
          ),
        authorizeConditional: async (
          requests: Array<{ permission: { name: string } }>,
          requestOptions: { credentials: BackstageCredentials },
        ) =>
          Promise.all(
            requests.map(request =>
              authorize(requestOptions.credentials, request.permission.name),
            ),
          ),
      },
      logger: mockServices.logger.mock(),
      auditor: mockServices.auditor.mock(),
      lifecycle: mockServices.lifecycle.mock(),
      pluginMetadata: { getId: () => 'test-plugin' },
    });
  }

  function open(service: AiService, sessionId: string) {
    return service.openHarness({
      sessionId,
      config: {
        root: new ConfigReader({ assistant: { mode: 'interactive' } }),
        path: 'assistant',
      },
      credentials,
      registry: createRegistry(),
      registryVersion: 'v1',
      features: ['tools'],
    });
  }

  const allowTools = async () => ({ result: 'ALLOW' });

  it('runs a granted command and journals the attempt by identity only', async () => {
    const service = await buildService(allowTools);
    const handle = await open(service, 'shell-run');
    try {
      // A fake secret shape in the command line: it must never reach the
      // journal, because command content is not journaled at all.
      const result = (await handle.tools!.callTool({
        serverId: 'shell',
        toolName: 'run',
        arguments: {
          command: "printf 'hello %s' world",
          stdin: '',
        },
        credentials,
      })) as RawShellResult;
      expect(result).toMatchObject({
        stdout: 'hello world',
        exitCode: 0,
        timedOut: false,
      });

      const rows = await db('ai_journal_events').select(
        'kind',
        'decision',
        'operation',
        'provider',
        'model',
        'destination',
        'reason',
      );
      expect(rows).toMatchObject([
        {
          kind: 'decision',
          decision: 'allow',
          operation: 'models.toolCall',
          provider: 'shell',
          model: 'run',
        },
        { kind: 'outcome', decision: null, operation: null },
      ]);
      // No destination: a local tool never resolves a URL.
      expect(rows[0].destination).toBeNull();
      // Identity-level audit: the command text is nowhere in the trail.
      const everything = JSON.stringify(rows);
      expect(everything).not.toContain('printf');
      expect(everything).not.toContain('hello world');
    } finally {
      await handle.release();
    }
  }, 30000);

  it('denies without executing and journals the denial', async () => {
    const marker = join(directory, 'denied-marker');
    const service = await buildService(async (_credentials, name) =>
      name === 'ai.tool.use' ? { result: 'DENY' } : { result: 'ALLOW' },
    );
    const handle = await open(service, 'shell-deny');
    try {
      const result = await handle.tools!.callTool({
        serverId: 'shell',
        toolName: 'run',
        arguments: { command: `touch ${marker}` },
        credentials,
      });
      expect(JSON.stringify(result)).toContain('shell/run');
      await expect(rm(marker)).rejects.toThrow();

      const deny = await db('ai_journal_events')
        .where({ decision: 'deny' })
        .first('operation', 'provider', 'model');
      expect(deny).toMatchObject({
        operation: 'models.toolCall',
        provider: 'shell',
        model: 'run',
      });
    } finally {
      await handle.release();
    }
  }, 30000);

  it('scopes the shell to the requesting plugin', async () => {
    const service = await buildService(async (_credentials, name) =>
      name === 'ai.tool.use'
        ? {
            result: 'CONDITIONAL',
            pluginId: 'ai',
            resourceType: 'ai-tool',
            conditions: aiToolConditions.isPlugin({ pluginId: 'scaffolder' }),
          }
        : { result: 'ALLOW' },
    );
    const handle = await open(service, 'shell-scoped');
    try {
      const result = await handle.tools!.callTool({
        serverId: 'shell',
        toolName: 'run',
        arguments: { command: 'printf ok' },
        credentials,
      });
      // The dispatching plugin is 'test-plugin', not 'scaffolder': the grant
      // does not cover it, so nothing ran.
      expect(JSON.stringify(result)).toContain('shell/run');
      expect(
        await db('ai_journal_events')
          .where({ decision: 'deny' })
          .first('provider', 'model'),
      ).toMatchObject({ provider: 'shell', model: 'run' });
    } finally {
      await handle.release();
    }
  }, 30000);

  it('maps a failing command to a failed outcome and a timeout to cancelled', async () => {
    const service = await buildService(allowTools, { timeoutMs: 300 });
    const handle = await open(service, 'shell-fail');
    const startedAt = await db('ai_journal_events').max('id as id').first();
    const afterStart = (startedAt?.id as number | null) ?? 0;
    try {
      const failed = (await handle.tools!.callTool({
        serverId: 'shell',
        toolName: 'run',
        arguments: { command: 'printf oops >&2; exit 3' },
        credentials,
      })) as RawShellResult;
      expect(failed).toMatchObject({
        stderr: 'oops',
        exitCode: 3,
        timedOut: false,
      });

      const cancelled = (await handle.tools!.callTool({
        serverId: 'shell',
        toolName: 'run',
        arguments: { command: 'sleep 5' },
        credentials,
      })) as RawShellResult;
      expect(cancelled.timedOut).toBe(true);
      expect(cancelled.exitCode).toBeNull();

      const outcomes = await db('ai_journal_events')
        .where({ kind: 'outcome' })
        .andWhere('id', '>', afterStart)
        .orderBy('id')
        .pluck('status');
      expect(outcomes).toEqual(['failed', 'cancelled']);
    } finally {
      await handle.release();
    }
  }, 30000);

  it('rejects a malformed argument object without touching the host', async () => {
    const service = await buildService(allowTools);
    const handle = await open(service, 'shell-invalid');
    try {
      await expect(
        handle.tools!.callTool({
          serverId: 'shell',
          toolName: 'run',
          arguments: { command: '   ' },
          credentials,
        }),
      ).resolves.toMatchObject({
        error: expect.stringContaining('invalid arguments'),
      });
    } finally {
      await handle.release();
    }
  }, 30000);
});
