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

import { createServer } from 'node:http';
import { once } from 'node:events';
import { mockCredentials } from '@backstage/backend-test-utils';
import { anthropicProvider } from '@earendil-works/pi-ai/providers/anthropic';
import { streamSimple } from '@earendil-works/pi-ai/api/anthropic-messages';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import type { Fence } from '../contracts';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import { createModelOperationGuard as createModelOperationGuardBase } from './createModelOperationGuard';
import type { TrustedOperation } from './types';
import { builtinProviderRegistry } from '../providers/testFixtures';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });

describe('Anthropic protocol fallbacks', () => {
  it('gates full-thread and strict-tool rebuilds as distinct attempts', async () => {
    const bodies: Array<Record<string, any>> = [];
    const server = createServer(async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.from(chunk));
      bodies.push(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      let message = 'test rejection';
      if (bodies.length === 1)
        message = 'thread: Extra inputs are not permitted';
      else if (bodies.length === 2)
        message = 'The compiled grammar is too large';
      res.writeHead(400, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          type: 'error',
          error: { type: 'invalid_request_error', message },
        }),
      );
    });
    server.listen(0, '127.0.0.1');
    await once(server, 'listening');
    try {
      const address = server.address();
      if (!address || typeof address === 'string')
        throw new Error('No test port');
      const baseUrl = `http://127.0.0.1:${address.port}`;
      const model = {
        ...anthropicProvider().getModels()[0],
        baseUrl,
        compat: { supportsMessageThreads: true, supportsStrictTools: true },
      };
      const operation: TrustedOperation = {
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
        provider: 'anthropic',
        modelId: model.id,
        resolvedModel: model.id,
        operation: 'streamSimple',
        api: 'anthropic-messages',
        destination: `${baseUrl}/v1/messages`,
        credentialScope: { kind: 'user', id: 'user:default/alice' },
        credentialGeneration: '1',
        controller: new AbortController(),
      };
      const decisions: AttemptDecision[] = [];
      const outcomes: AttemptOutcome[] = [];
      // Explicitly non-production, non-durable journal test double.
      const journal = {
        recordDecisionAndIntent: async (
          _fence: Fence,
          event: AttemptDecision,
        ) => {
          decisions.push(event);
          return String(decisions.length);
        },
        recordOutcome: async (
          _fence: Fence,
          _id: string,
          outcome: AttemptOutcome,
        ) => {
          outcomes.push(outcome);
        },
        recordRecovery: async () => {},
        read: async () => ({ items: [] }),
      };
      const recheck = jest.fn(async () => true);
      const guard = createModelOperationGuard({
        transport: globalThis.fetch,
        journal,
        recheck,
      }).bind(operation);
      const context = normalizeContext({
        messages: [],
        tools: [
          {
            name: 'search',
            description: 'search',
            parameters: { type: 'object', properties: {}, required: [] },
            constrainedSampling: { type: 'json_schema', strict: 'prefer' },
          },
        ],
      });
      const result = await streamSimple(model, context, {
        apiKey: 'test-key',
        fetch: guard.fetch,
        signal: operation.controller.signal,
        maxRetries: 0,
        sessionId: `fallback-${address.port}`,
      }).result();
      expect(result.stopReason).toBe('error');
      expect(bodies).toHaveLength(3);
      expect(bodies[0].thread).toBeDefined();
      expect(bodies[1].thread).toBeUndefined();
      expect(bodies[1].tools[0].strict).toBe(true);
      expect(bodies[2].tools[0].strict).toBeUndefined();
      expect(bodies.map(body => body.model)).toEqual([
        model.id,
        model.id,
        model.id,
      ]);
      expect(recheck).toHaveBeenCalledTimes(3);
      expect(decisions.map(d => [d.attempt, d.decision])).toEqual([
        [1, 'allow'],
        [2, 'allow'],
        [3, 'allow'],
      ]);
      expect(outcomes.map(o => [o.status, o.httpStatus])).toEqual([
        ['failed', 400],
        ['failed', 400],
        ['failed', 400],
      ]);
    } finally {
      server.close();
      await once(server, 'close');
    }
  });
});
