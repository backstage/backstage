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
const MODEL_PERMISSION = 'ai.model.openai.gpt-scaffolder.use';

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
  close(): Promise<void>;
}> {
  const requests: ProbeRequest[] = [];
  let reply = replyText;
  const server: Server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => {
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
      const permissions = mockServices.permissions.mock({
        authorize: async (queries, authOptions) =>
          queries.map(() => {
            const denied =
              denyModelFor !== undefined &&
              denyModelFor(authOptions.credentials as BackstageCredentials);
            return {
              result: denied ? ('DENY' as const) : ('ALLOW' as const),
            };
          }),
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
        `Access denied: the submitting user is not allowed to use the model 'openai/gpt-scaffolder' configured for the 'ai:generate' action. The '${MODEL_PERMISSION}' permission was denied`,
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
        /did not complete \(reason: 'no_model': the configured model 'openai\/not-in-the-catalog' is not available; it is not in this installation's 'ai\.models' catalog\. Ask an administrator to list it\)/,
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
});
