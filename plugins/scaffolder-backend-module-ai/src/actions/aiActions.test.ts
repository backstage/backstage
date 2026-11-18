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

import { mkdtemp, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import knexFactory, { type Knex } from 'knex';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import type { BackstageCredentials } from '@backstage/backend-plugin-api';
import type {
  PermissionCondition,
  PermissionCriteria,
} from '@backstage/plugin-permission-common';
import { aiModelConditions } from '@backstage/ai-node/alpha';
import {
  startTestBackend,
  type TestBackend,
} from '@backstage/backend-test-utils';
import { createMockDirectory } from '@backstage/backend-test-utils';
import type { TemplateAction } from '@backstage/plugin-scaffolder-node';
import { scaffolderActionsExtensionPoint } from '@backstage/plugin-scaffolder-node';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { scaffolderModuleAi } from '../module';

const pgUrl = process.env.AI_TEST_POSTGRES_URL;

const ORG_KEY = 'sk-scaffolder-test-org-key';
const MODEL_PERMISSION = 'ai.model.use';

type ProbeRequest = {
  url?: string;
  headers: Record<string, unknown>;
  body?: string;
};

/**
 * A local provider speaking the OpenAI Responses streaming protocol, so a
 * real managed generation completes end to end against it.
 */
async function providerServer(replyText: string): Promise<{
  baseUrl: string;
  requests: ProbeRequest[];
  setReply(text: string): void;
  /** When true, responses are held until released: requests stay pending. */
  holdResponse: boolean;
  /** When true, the next response is a provider error instead of a stream. */
  failNextResponse: boolean;
  releaseResponse(): void;
  close(): Promise<void>;
}> {
  const requests: ProbeRequest[] = [];
  let reply = replyText;
  let holdResponse = false;
  let failNextResponse = false;
  let releaseResponse: () => void = () => {};
  const responseGate = new Promise<void>(resolve => {
    releaseResponse = resolve;
  });
  const server: Server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', async () => {
      requests.push({
        url: req.url,
        headers: { ...req.headers },
        body: Buffer.concat(chunks).toString('utf8'),
      });
      const events = [
        { type: 'response.created', response: { id: 'resp_test' } },
        {
          type: 'response.output_item.added',
          output_index: 0,
          item: { type: 'message', id: 'msg_0', phase: 'final_answer' },
        },
        {
          type: 'response.output_text.delta',
          output_index: 0,
          content_index: 0,
          delta: reply,
        },
        {
          type: 'response.output_item.done',
          output_index: 0,
          item: {
            type: 'message',
            id: 'msg_0',
            phase: 'final_answer',
            content: [{ type: 'output_text', text: reply }],
          },
        },
        {
          type: 'response.completed',
          response: {
            id: 'resp_test',
            status: 'completed',
            usage: { input_tokens: 12, output_tokens: 6, total_tokens: 18 },
          },
        },
      ];
      if (holdResponse) {
        await responseGate;
      }
      if (failNextResponse) {
        failNextResponse = false;
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(
          JSON.stringify({
            error: { message: 'provider rejected the request' },
          }),
        );
        return;
      }
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      for (const event of events) {
        res.write(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
      }
      res.end();
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const port = (server.address() as { port: number }).port;
  return {
    baseUrl: `http://127.0.0.1:${port}`,
    requests,
    setReply: text => {
      reply = text;
    },
    get holdResponse() {
      return holdResponse;
    },
    set holdResponse(value: boolean) {
      holdResponse = value;
    },
    get failNextResponse() {
      return failNextResponse;
    },
    set failNextResponse(value: boolean) {
      failNextResponse = value;
    },
    releaseResponse: () => releaseResponse(),
    close: async () => {
      server.closeAllConnections();
      server.close();
    },
  };
}

type Fixture = {
  db: Knex;
  start(options: {
    providerUrl: string;
    credentials?: boolean;
    modelId?: string;
    denyModelFor?: (credentials: BackstageCredentials) => boolean;
    /** A conditional grant for `ai.model.use`, as a real policy returns it. */
    modelConditions?: () => PermissionCriteria<PermissionCondition>;
    /** Deny every model authorization from this 1-based call onward. */
    denyFromCall?: number;
    /** Throw from every model authorization at this 1-based call onward. */
    throwFromCall?: number;
  }): Promise<{
    backend: TestBackend;
    action(id: string): TemplateAction<any>;
  }>;
  close(): Promise<void>;
};

async function fixture(): Promise<Fixture> {
  const directory = pgUrl
    ? undefined
    : await mkdtemp(join(tmpdir(), 'scaffolder-ai-'));
  const admin = pgUrl
    ? knexFactory({ client: 'pg', connection: pgUrl })
    : undefined;
  const schema = `t6_${randomUUID().replaceAll('-', '')}`;
  if (admin) {
    await admin.schema.createSchema(schema);
  }
  const db = pgUrl
    ? knexFactory({
        client: 'pg',
        connection: pgUrl,
        searchPath: [schema],
        pool: { min: 1, max: 1 },
      })
    : knexFactory({
        client: 'better-sqlite3',
        connection: { filename: join(directory!, 'db') },
        useNullAsDefault: true,
        pool: { min: 1, max: 1 },
      });

  return {
    db,
    async start(options) {
      const captured = new Map<string, TemplateAction<any>>();
      const denyModelFor = options.denyModelFor;
      const denyFromCall = options.denyFromCall ?? Number.POSITIVE_INFINITY;
      const throwFromCall = options.throwFromCall ?? Number.POSITIVE_INFINITY;
      let authorizeCalls = 0;
      const decide = async (queries: readonly unknown[], authOptions: any) => {
        authorizeCalls += 1;
        if (authorizeCalls >= throwFromCall) {
          throw new Error('permissions backend unavailable');
        }
        return queries.map((query: any) => {
          const denied =
            authorizeCalls >= denyFromCall ||
            (denyModelFor !== undefined &&
              denyModelFor(authOptions.credentials as BackstageCredentials));
          if (denied) {
            return { result: 'DENY' as const };
          }
          // A conditional grant, so a type-scoped policy is exercised exactly
          // as the service evaluates it.
          if (
            options.modelConditions !== undefined &&
            query.permission?.name === 'ai.model.use'
          ) {
            return {
              result: 'CONDITIONAL' as const,
              pluginId: 'ai',
              resourceType: 'ai-model',
              conditions: options.modelConditions(),
            };
          }
          return { result: 'ALLOW' as const };
        });
      };
      const permissions = mockServices.permissions.mock({
        // A conditional answer is only meaningful for the conditional entry
        // point; the definitive one is the same predicate without conditions.
        authorize: decide as never,
        authorizeConditional: decide as never,
      });
      const backend = await startTestBackend({
        extensionPoints: [
          [
            scaffolderActionsExtensionPoint,
            {
              addActions: (...actions: TemplateAction<any>[]) => {
                for (const action of actions) {
                  captured.set(action.id, action);
                }
              },
            },
          ],
        ],
        features: [
          mockServices.rootConfig.factory({
            data: {
              ai: {
                ...(options.credentials === false
                  ? {}
                  : {
                      credentials: {
                        encryptionKey: Buffer.alloc(32, 9).toString('base64'),
                        scopes: {
                          org: { openai: { type: 'api_key', key: ORG_KEY } },
                        },
                      },
                    }),
                models: [
                  {
                    provider: 'openai',
                    modelId: 'gpt-scaffolder',
                    api: 'openai-responses',
                    baseUrl: `${options.providerUrl}/v1`,
                    type: 'chat',
                    contextWindow: 400_000,
                    maxTokens: 128_000,
                  },
                ],
              },
              scaffolder: {
                ai: {
                  mode: 'service',
                  model: {
                    provider: 'openai',
                    modelId: options.modelId ?? 'gpt-scaffolder',
                  },
                },
              },
            },
          }),
          mockServices.database.factory({ knex: db }),
          permissions.factory,
          scaffolderModuleAi,
        ],
      });
      return {
        backend,
        action: (id: string) => {
          const action = captured.get(id);
          if (action === undefined) {
            throw new Error(`Action ${id} was not registered`);
          }
          return action;
        },
      };
    },
    close: async () => {
      await db.destroy();
      if (admin) {
        await admin.schema.dropSchema(schema, true);
        await admin.destroy();
      }
      if (directory) {
        await rm(directory, { recursive: true, force: true });
      }
    },
  };
}

/** A scaffolder action context for one submitting user and task. */
function context(options: {
  actionId: string;
  taskId: string;
  input: Record<string, unknown>;
  credentials: BackstageCredentials;
  workspacePath?: string;
}) {
  const ctx = createMockActionContext({
    input: options.input as never,
    task: { id: options.taskId },
    workspacePath: options.workspacePath ?? createMockDirectory().resolve('ws'),
  });
  return {
    ...ctx,
    getInitiatorCredentials: () => Promise.resolve(options.credentials),
  };
}

const alice = () => mockCredentials.user('user:default/alice');
const bob = () => mockCredentials.user('user:default/bob');

async function waitFor(probe: () => Promise<boolean> | boolean) {
  for (let i = 0; i < 600; i += 1) {
    if (await probe()) return;
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  throw new Error('probe timeout');
}

describe('scaffolder AI actions', () => {
  it('registers the AI actions at the scaffolder extension point', async () => {
    const f = await fixture();
    const provider = await providerServer('registered');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      expect(action('ai:generate').id).toBe('ai:generate');
      expect(action('ai:transform').id).toBe('ai:transform');
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  });

  it('generates content under the submitting user with the configured credential', async () => {
    const f = await fixture();
    const provider = await providerServer('# Orders API\n\nA service.');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-positive',
        input: { prompt: 'Write a README for orders-api' },
        credentials: alice(),
      });
      await action('ai:generate').handler(ctx);

      // The guarded dispatch reached the canonical provider origin with the
      // installation's organization credential.
      expect(provider.requests).toHaveLength(1);
      expect(provider.requests[0].url).toBe('/v1/responses');
      expect(String(provider.requests[0].headers.authorization)).toContain(
        ORG_KEY,
      );
      expect(ctx.output).toHaveBeenCalledWith(
        'content',
        '# Orders API\n\nA service.',
      );
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('writes generated content to the workspace when outputPath is given', async () => {
    const f = await fixture();
    const provider = await providerServer('# Docs\n\nGenerated.');
    try {
      const workspace = createMockDirectory();
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-file',
        input: {
          prompt: 'Write a docs page',
          outputPath: 'docs/api.md',
        },
        credentials: alice(),
        workspacePath: workspace.resolve('ws'),
      });
      await action('ai:generate').handler(ctx);
      expect(await readFile(workspace.resolve('ws/docs/api.md'), 'utf8')).toBe(
        '# Docs\n\nGenerated.',
      );
      expect(ctx.output).not.toHaveBeenCalled();
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('transforms natural-language answers into structured values', async () => {
    const f = await fixture();
    const provider = await providerServer(
      '{"serviceName": "orders-api", "cluster": "central"}',
    );
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const ctx = context({
        actionId: 'ai:transform',
        taskId: 'transform-positive',
        input: {
          prompt: 'Name the service after the orders domain, central cluster',
          schema: {
            type: 'object',
            properties: {
              serviceName: { type: 'string' },
              cluster: { type: 'string' },
            },
          },
        },
        credentials: alice(),
      });
      await action('ai:transform').handler(ctx);
      expect(ctx.output).toHaveBeenCalledWith('values', {
        serviceName: 'orders-api',
        cluster: 'central',
      });
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('denies a revoked user at the action boundary with the model permission', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        denyModelFor: credentials =>
          (credentials.principal as { userEntityRef?: string })
            .userEntityRef === 'user:default/bob',
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-denied',
        input: { prompt: 'Write something' },
        credentials: bob(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        `Access denied: the submitting user is not allowed to use the model 'openai/gpt-scaffolder' configured for the 'ai:generate' action. The '${MODEL_PERMISSION}' permission was denied; ask an administrator to grant access, or configure a model that is listed in this installation's 'ai.models' catalog`,
      );
      // The denial happened before any dispatch: nothing reached the
      // provider and nothing was journaled as a send.
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('surfaces the unlisted-model denial with its recorded reason', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        modelId: 'not-in-the-catalog',
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-unlisted',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        /did not complete \(reason: 'no_model'\): the configured model 'openai\/not-in-the-catalog' is not available; it is not in this installation's 'ai\.models' catalog\. Ask an administrator to list it/,
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('surfaces the missing-credentials denial with its journaled reason', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        credentials: false,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-no-credentials',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        /provider credentials are not configured for this installation/,
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('isolates sessions between users: another user cannot open a task session', async () => {
    const f = await fixture();
    const provider = await providerServer('first user content');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      // Alice runs the action for her task.
      const aliceContext = context({
        actionId: 'ai:generate',
        taskId: 'shared-task-id',
        input: { prompt: 'Write something for alice' },
        credentials: alice(),
      });
      await action('ai:generate').handler(aliceContext);
      expect(provider.requests).toHaveLength(1);

      // The same task identity under Bob's credentials is denied at the
      // session ownership boundary: no cross-session access.
      const bobContext = context({
        actionId: 'ai:generate',
        taskId: 'shared-task-id',
        input: { prompt: 'Write something for bob' },
        credentials: bob(),
      });
      await expect(action('ai:generate').handler(bobContext)).rejects.toThrow(
        /cannot be opened by 'user:user:default\/bob'/,
      );
      expect(provider.requests).toHaveLength(1);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('rejects outputPath that escapes the workspace', async () => {
    const f = await fixture();
    const provider = await providerServer('escaped content');
    const workspaceRoot = await mkdtemp(join(tmpdir(), 't6-escape-'));
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const escaping = context({
        actionId: 'ai:generate',
        taskId: 'gen-escape',
        input: { prompt: 'Write something', outputPath: '../../../escaped.md' },
        credentials: alice(),
        workspacePath: join(workspaceRoot, 'ws'),
      });
      await expect(action('ai:generate').handler(escaping)).rejects.toThrow(
        "Invalid outputPath '../../../escaped.md' for the ai:generate action: '..' segments are not allowed; write only inside the task workspace",
      );

      const absolute = context({
        actionId: 'ai:generate',
        taskId: 'gen-escape',
        input: {
          prompt: 'Write something',
          outputPath: join(workspaceRoot, 'absolute.md'),
        },
        credentials: alice(),
        workspacePath: join(workspaceRoot, 'ws'),
      });
      await expect(action('ai:generate').handler(absolute)).rejects.toThrow(
        'for the ai:generate action: it must be a relative path inside the task workspace',
      );

      // Model-controlled content never landed outside the workspace.
      await waitFor(async () => provider.requests.length > 0);
      expect(
        await readFile(join(workspaceRoot, 'escaped.md'), 'utf8').catch(
          () => undefined,
        ),
      ).toBeUndefined();
      expect(
        await readFile(join(workspaceRoot, 'absolute.md'), 'utf8').catch(
          () => undefined,
        ),
      ).toBeUndefined();
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
      await rm(workspaceRoot, { recursive: true, force: true });
    }
  }, 30000);

  it('does not advise requesting access for a model that is not in the catalog', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        modelId: 'not-in-the-catalog',
        denyModelFor: () => true,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-unlisted-denied',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      // The denial names both remedies without asserting that access alone
      // would fix an unlisted model.
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        new RegExp(
          `The '${MODEL_PERMISSION.replace(
            'gpt-scaffolder',
            'not-in-the-catalog',
          )}' permission was denied; ask an administrator to grant access, or configure a model that is listed in this installation's 'ai\\.models' catalog`,
        ),
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('does not dispatch for a task cancelled before the action started', async () => {
    const f = await fixture();
    const provider = await providerServer('ran despite abort');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const controller = new AbortController();
      controller.abort();
      const ctx = {
        ...context({
          actionId: 'ai:generate',
          taskId: 'gen-pre-aborted',
          input: { prompt: 'Write something' },
          credentials: alice(),
        }),
        signal: controller.signal,
      };
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        /was cancelled before it started/,
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('aborts an in-flight request on cancellation and recovers on retry', async () => {
    const f = await fixture();
    const provider = await providerServer('after cancel');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      provider.holdResponse = true;
      const controller = new AbortController();
      const ctx = {
        ...context({
          actionId: 'ai:generate',
          taskId: 'gen-cancel',
          input: { prompt: 'Write something' },
          credentials: alice(),
        }),
        signal: controller.signal,
      };
      const pending = action('ai:generate').handler(ctx);
      await waitFor(() => provider.requests.length > 0);
      controller.abort();
      await expect(pending).rejects.toThrow(
        /was cancelled before it completed/,
      );
      provider.releaseResponse();

      // The attempt was journaled as allowed and cancelled, with no
      // uncertain outcome.
      const events = await f
        .db('ai_journal_events')
        .where({ session_id: 'gen-cancel' });
      expect(
        events.some(row => row.kind === 'decision' && row.decision === 'allow'),
      ).toBe(true);
      expect(
        events.some(
          row => row.kind === 'outcome' && row.status === 'cancelled',
        ),
      ).toBe(true);
      expect(await f.db('ai_journal_uncertainty').select()).toEqual([]);

      // A subsequent clean run on the same task session works.
      provider.holdResponse = false;
      const retry = context({
        actionId: 'ai:generate',
        taskId: 'gen-cancel',
        input: { prompt: 'Write something again' },
        credentials: alice(),
      });
      await action('ai:generate').handler(retry);
      expect(retry.output).toHaveBeenCalledWith('content', 'after cancel');
      await backend.stop();
    } finally {
      provider.holdResponse = false;
      provider.releaseResponse();
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('parses fenced JSON replies into values', async () => {
    const f = await fixture();
    const provider = await providerServer(
      '```json\n{"serviceName": "fenced"}\n```',
    );
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const ctx = context({
        actionId: 'ai:transform',
        taskId: 'transform-fenced',
        input: {
          prompt: 'Name the service',
          schema: {
            type: 'object',
            properties: { serviceName: { type: 'string' } },
          },
        },
        credentials: alice(),
      });
      await action('ai:transform').handler(ctx);
      expect(ctx.output).toHaveBeenCalledWith('values', {
        serviceName: 'fenced',
      });
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('surfaces an actionable error for non-JSON replies', async () => {
    const f = await fixture();
    const provider = await providerServer(
      'I think the service should be called orders.',
    );
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
      });
      const ctx = context({
        actionId: 'ai:transform',
        taskId: 'transform-prose',
        input: {
          prompt: 'Name the service',
          schema: {
            type: 'object',
            properties: { serviceName: { type: 'string' } },
          },
        },
        credentials: alice(),
      });
      await expect(action('ai:transform').handler(ctx)).rejects.toThrow(
        /not a JSON object for scaffolder task session 'transform-prose'\. Ask the model for a JSON object matching the schema, or adjust the schema; the reply started with: I think the service should be called orders\./,
      );
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('surfaces a permission revoked after the action check, at acquisition', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      // The action's own check (first authorization call) allows; the
      // service's acquisition check denies.
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        denyFromCall: 2,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-revoked-acquisition',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        /Access denied: the 'scaffolder' plugin's caller is not allowed to use the model 'openai\/gpt-scaffolder' configured at its AI configuration path/,
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('names the model permission when a dispatch is denied mid-run', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      // The action check and the acquisition check allow; the guard's
      // per-dispatch recheck denies.
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        denyFromCall: 3,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-revoked-dispatch',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        new RegExp(
          `The submitting user is no longer allowed to use the model 'openai/gpt-scaffolder': the '${MODEL_PERMISSION}' permission was denied during the run; ask an administrator for access`,
        ),
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  // Reviewer finding 6: the diagnostic re-evaluated the policy without the
  // catalog type, so a type-scoped grant looked like a denial and an unrelated
  // model error was misattributed to the permission.
  it('never attributes an unrelated model error to a type-scoped permission', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        // The policy grants the chat model by its catalog type, exactly as the
        // dispatch-time evaluation sees it.
        modelConditions: () => aiModelConditions.isModelType({ type: 'chat' }),
      });
      provider.failNextResponse = true;
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-type-scoped',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      const failure = await action('ai:generate')
        .handler(ctx)
        .then(
          () => undefined,
          (error: Error) => error,
        );
      expect(failure?.message).toContain("reason: 'model_error'");
      expect(failure?.message).not.toContain('permission was denied');
      expect(provider.requests).toHaveLength(1);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);

  it('keeps the settlement diagnostic when the permissions backend fails on the re-check', async () => {
    const f = await fixture();
    const provider = await providerServer('unused');
    try {
      // The action check and the acquisition check allow; the guard's
      // per-dispatch recheck denies; the post-failure attribution re-check
      // throws — the surfaced message must be the settlement failure, not
      // the permissions backend's error.
      const { backend, action } = await f.start({
        providerUrl: provider.baseUrl,
        denyFromCall: 3,
        throwFromCall: 4,
      });
      const ctx = context({
        actionId: 'ai:generate',
        taskId: 'gen-attribution-failure',
        input: { prompt: 'Write something' },
        credentials: alice(),
      });
      await expect(action('ai:generate').handler(ctx)).rejects.toThrow(
        /did not complete \(reason: 'model_error': Request aborted\)\. The decision was recorded in the installation's AI audit journal; ask an administrator to review the denial/,
      );
      expect(provider.requests).toHaveLength(0);
      await backend.stop();
    } finally {
      await provider.close();
      await f.close();
    }
  }, 30000);
});
