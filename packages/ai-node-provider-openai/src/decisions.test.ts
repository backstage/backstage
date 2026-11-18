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

/*
 * Copyright 2026 The Backstage Authors.
 *
 * Transitional test-only relative imports into @backstage/ai-node source:
 * P2b moves the guard/journal test machinery into
 * @backstage/ai-node/testUtils, at which point these switch to it.
 */
/* eslint-disable @backstage/no-relative-monorepo-imports -- see above */

import { once } from 'node:events';
import { createServer, type Server } from 'node:http';
import { mockCredentials } from '@backstage/backend-test-utils';
import type { AnyModel } from '@earendil-works/pi-ai';
import { OPENAI_CLASSIFIER_MODELS } from '@earendil-works/pi-ai/providers/openai.models';
import {
  createProviderRegistry,
  type Fence,
  type ModelOperation,
  type TrustedOperation,
} from '@backstage/ai-node/testUtils';
import { createModelOperationGuard } from '../../ai-node/src/guard/createModelOperationGuard';
import { createGuardedModelOperations } from '../../ai-node/src/guard/modelOperations';
import type {
  AttemptDecision,
  AttemptOutcome,
} from '../../ai-node/src/journal/types';
import { openaiDecisions } from './decisions';

const providers = createProviderRegistry([openaiDecisions]);

const classifierContext = {
  state: { text: 'hello' },
  questions: {
    q1: {
      type: 'bool' as const,
      instructions: 'Is this a greeting?',
      criteria: { true: 'it greets', false: 'it does not' },
    },
  },
};

type Body = Record<string, unknown>;

async function startServer(
  handle: (
    pathname: string,
    body: Body,
    headers: Record<string, string>,
  ) => Body,
): Promise<{
  server: Server;
  origin: string;
  requests: Array<{
    pathname: string;
    body: Body;
    headers: Record<string, string>;
  }>;
}> {
  const requests: Array<{
    pathname: string;
    body: Body;
    headers: Record<string, string>;
  }> = [];
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => {
      const headers = Object.fromEntries(
        Object.entries(req.headers).map(([k, v]) => [k, String(v)]),
      );
      const body = JSON.parse(Buffer.concat(chunks).toString('utf-8')) as Body;
      requests.push({ pathname: req.url ?? '', body, headers });
      const response = handle(req.url ?? '', body, headers);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify(response));
    });
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return { server, origin: `http://127.0.0.1:${address.port}`, requests };
}

function harness(model: AnyModel, operation: ModelOperation) {
  const events: string[] = [];
  const journal = {
    recordDecisionAndIntent: jest.fn(
      async (_fence: Fence, event: AttemptDecision) => {
        events.push(`${event.decision}:${event.attempt}`);
        return String(event.attempt);
      },
    ),
    recordOutcome: jest.fn(
      async (_fence: Fence, _id: string, outcome: AttemptOutcome) => {
        events.push(`outcome:${outcome.status}`);
      },
    ),
    recordRecovery: jest.fn(async () => {}),
    read: jest.fn(async () => ({ items: [] })),
  };
  const transport = jest.fn(async (request: Request) => {
    events.push('send');
    return globalThis.fetch(request);
  });
  const op: TrustedOperation = {
    actor: 'user:default/alice',
    credentials: mockCredentials.user('user:default/alice'),
    provenance: {
      origin: 'verified',
      conversationId: '1',
      taskId: '2',
      callId: '3',
    },
    fence: {
      namespace: { pluginId: 'test', sessionId: 's' },
      owner: 'owner',
      token: '1',
    },
    definitionVersion: 'v1',
    configVersion: 'v1',
    provider: model.provider,
    modelId: model.id,
    resolvedModel: model.id,
    operation,
    api: model.api,
    destination: providers.get(model.api)!.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
  const guard = createModelOperationGuard({
    providers,
    journal: journal as never,
    recheck: async () => {
      events.push('check');
      return true;
    },
    transport: transport as unknown as typeof fetch,
  });
  const facade = createGuardedModelOperations({
    providers,
    guard,
    journal: journal as never,
    resolve: () => ({
      model,
      operation: op,
      authority: { kind: 'apiKey', apiKey: 'test-key' },
    }),
  });
  // Denials latch the operation, so every probe gets a fresh binding.
  const probe = async (body: unknown, url: URL | string = op.destination) => {
    const fresh = guard.bind({
      ...op,
      controller: new AbortController(),
    });
    await expect(
      fresh.fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
    ).rejects.toThrow();
  };
  return { events, transport, guard: guard.bind(op), op, facade, probe };
}

describe('OpenAI Decisions module', () => {
  it('classifies through the OpenAI Decisions API', async () => {
    const { server, origin, requests } = await startServer(() => ({
      answers: [{ name: 'q1', type: 'predicate', probability: 0.91 }],
      stop_reason: 'stop',
      usage: { total_tokens: 10 },
    }));
    try {
      const model = {
        ...OPENAI_CLASSIFIER_MODELS['gpt-6-luna'],
        baseUrl: `${origin}/v1`,
      } as never as AnyModel;
      const f = harness(model, 'classify');
      const result = (await f.facade.classify(
        model as never,
        classifierContext as never,
      )) as unknown as {
        answers: { q1: { type: string; probability: number } };
      };
      expect(result.answers.q1).toEqual({
        type: 'bool',
        probability: 0.91,
      });
      expect(f.events).toEqual([
        'check',
        'allow:1',
        'send',
        'outcome:completed',
      ]);
      expect(requests[0].pathname).toBe('/v1/decisions');
      expect(requests[0].body.model).toBe('gpt-6-luna');
      expect(requests[0].body.questions).toEqual([
        expect.objectContaining({ type: 'predicate', name: 'q1' }),
      ]);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });

  it('denies decisions requests with substituted models or routes', async () => {
    const model = {
      ...(OPENAI_CLASSIFIER_MODELS['gpt-6-luna'] as never as AnyModel),
      baseUrl: 'https://provider.example/v1',
    } as AnyModel;
    const f = harness(model, 'classify');
    await f.probe({ model: 'other', state: {}, questions: {} });
    const wrong = new URL(f.op.destination);
    wrong.pathname = '/v1/other';
    await f.probe({ model: model.id }, wrong);
    const query = new URL(f.op.destination);
    query.searchParams.set('unexpected', 'true');
    await f.probe({ model: model.id }, query);
    expect(f.events).toEqual(['deny:1', 'deny:1', 'deny:1']);
    expect(f.transport).not.toHaveBeenCalled();
  });
});
