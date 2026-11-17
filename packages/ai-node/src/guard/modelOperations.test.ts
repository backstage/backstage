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

import { mockCredentials } from '@backstage/backend-test-utils';
import { openaiProvider } from '@earendil-works/pi-ai/providers/openai';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { Fence } from '../contracts';
import { createModelOperationGuard } from './createModelOperationGuard';
import { createGuardedModelOperations } from './modelOperations';
import type { ModelOperation, TrustedOperation } from './types';

describe('guarded model operations', () => {
  it('gates chat helpers, hides unsupported operations and rejects expired credentials and overrides', async () => {
    const model = {
      ...openaiProvider().getModels()[0],
      baseUrl: 'https://provider.example/v1',
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
        result: AttemptOutcome,
      ) => {
        outcomes.push(result);
      },
      recordRecovery: async () => {},
      read: async () => ({ items: [] }),
    };
    const transport = jest.fn(
      async (_request: Request) =>
        new Response(
          `data: ${JSON.stringify({
            type: 'response.completed',
            response: {
              id: 'r',
              status: 'completed',
              output: [],
              usage: { input_tokens: 1, output_tokens: 1, total_tokens: 2 },
            },
          })}\n\ndata: [DONE]\n\n`,
          { headers: { 'content-type': 'text/event-stream' } },
        ),
    );
    const guard = createModelOperationGuard({
      journal,
      recheck: async () => true,
      transport: transport as unknown as typeof fetch,
    });
    let expired = false;
    let verified = true;
    const operations = createGuardedModelOperations({
      guard,
      journal,
      resolve: (_model, method: ModelOperation) => {
        const operation: TrustedOperation = {
          actor: 'user:default/alice',
          credentials: mockCredentials.user('user:default/alice'),
          provenance: {
            origin: verified ? 'verified' : 'unverified',
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
          operation: method,
          api: 'openai-responses',
          destination: 'https://provider.example/v1/responses',
          credentialScope: { kind: 'user', id: 'user:default/alice' },
          credentialGeneration: '1',
          controller: new AbortController(),
        };
        return {
          operation,
          model,
          authority: expired
            ? { kind: 'oauth', apiKey: 'key', expiresAt: 1 }
            : { kind: 'apiKey', apiKey: 'key' },
        };
      },
    });
    const context = { messages: [] };
    expect((await operations.stream(model, context).result()).stopReason).toBe(
      'stop',
    );
    expect((await operations.complete(model, context)).stopReason).toBe('stop');
    expect(
      (await operations.streamSimple(model, context).result()).stopReason,
    ).toBe('stop');
    expect((await operations.completeSimple(model, context)).stopReason).toBe(
      'stop',
    );
    expect(transport).toHaveBeenCalledTimes(4);
    expect(outcomes.map(o => o.status)).toEqual([
      'completed',
      'completed',
      'completed',
      'completed',
    ]);
    expect(decisions.slice(0, 4).map(d => d.operation)).toEqual([
      'models.stream',
      'models.complete',
      'models.streamSimple',
      'models.completeSimple',
    ]);
    const handle = {} as never;
    expect(
      (await operations.streamDeferred(model, handle).result()).stopReason,
    ).toBe('error');
    await expect(operations.fetchDeferred(model, handle)).rejects.toThrow();
    await expect(operations.cancelDeferred(model, handle)).rejects.toThrow();
    await expect(
      operations.classify(model as never, {} as never),
    ).rejects.toThrow();
    await expect(
      operations.generateImages(model as never, {} as never),
    ).rejects.toThrow();
    expect(
      (
        await operations.completeSimple(model, context, {
          onPayload: (payload, callbackModel) => {
            callbackModel.headers = { authorization: 'Bearer replaced' };
            return payload;
          },
        })
      ).stopReason,
    ).toBe('stop');
    expect(transport.mock.calls[4][0].headers.get('authorization')).toBe(
      'Bearer key',
    );
    expect(model.headers?.authorization).toBeUndefined();
    expired = true;
    const expiredResult = await operations.completeSimple(model, context);
    expect(expiredResult.errorMessage).toContain('credential expired');
    expect(decisions.at(-1)).toMatchObject({
      operation: 'auth.token',
      decision: 'deny',
    });
    expired = false;
    verified = false;
    expect((await operations.completeSimple(model, context)).stopReason).toBe(
      'error',
    );
    verified = true;
    expect(
      (
        await operations.completeSimple(model, context, {
          fetch: globalThis.fetch,
        })
      ).stopReason,
    ).toBe('error');
    expect(transport).toHaveBeenCalledTimes(5);
  });
});
