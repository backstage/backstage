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
import type { AttemptDecision } from '../../journal/types';
import { createModelOperationGuard as createModelOperationGuardBase } from '../../guard/createModelOperationGuard';
import {
  createGuardedModelOperations as createGuardedModelOperationsBase,
  GuardedResolutionError,
  type GuardedModelBinding,
} from '../../guard/modelOperations';
import type { TrustedOperation } from '../../guard/types';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';
import { testTransport } from '@backstage/ai-node-test-utils/alpha';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });
const createGuardedModelOperations = (
  options: Parameters<typeof createGuardedModelOperationsBase>[0],
) =>
  createGuardedModelOperationsBase({
    providers: builtinProviderRegistry,
    ...options,
  });

/**
 * The await inside resolution is the seam a guarded credential refresh uses.
 * These cells pin the three guarantees that make the await safe: the fresh
 * binding is what reaches the wire, a failed refresh denies without sending,
 * and the guard still rechecks after the await before its durable intent.
 */
describe('awaited resolution before dispatch', () => {
  // Canonical catalog entry: the wire destination must be this model's route,
  // otherwise the guard denies before the transport is reached.
  const model = {
    ...openaiProvider().getModels()[0],
    baseUrl: 'https://provider.example/v1',
  };

  function fixture() {
    const events: string[] = [];
    const journal = {
      recordDecisionAndIntent: jest.fn(
        async (_fence: unknown, event: AttemptDecision) => {
          events.push(`${event.decision}:${event.attempt}`);
          return String(event.attempt);
        },
      ),
      recordOutcome: jest.fn(async () => {
        events.push('outcome');
      }),
      recordRecovery: jest.fn(async () => {}),
      read: jest.fn(async () => ({ items: [] })),
    };
    const seen: string[] = [];
    const transport = jest.fn(async (request: Request) => {
      seen.push(request.headers.get('authorization') ?? '');
      return new Response('ok');
    });
    const recheck = jest.fn(async () => {
      events.push('check');
      return true;
    });
    const guard = createModelOperationGuard({
      journal: journal as never,
      recheck,
      transport: testTransport(transport),
    });
    const operation = (): TrustedOperation => ({
      actor: 'user:default/alice',
      credentials: mockCredentials.user('user:default/alice'),
      provenance: {
        origin: 'verified',
        conversationId: 'plugin/session',
        taskId: 'plugin/session',
        callId: 'plugin/session#1',
      },
      fence: {
        namespace: { pluginId: 'plugin', sessionId: 'session' },
        owner: 'owner',
        token: '1',
      },
      definitionVersion: 'v1',
      configVersion: 'v1',
      provider: model.provider,
      modelId: model.id,
      resolvedModel: model.id,
      operation: 'completeSimple',
      api: 'openai-responses',
      destination: 'https://provider.example/v1/responses',
      credentialScope: { kind: 'user', id: 'user:default/alice' },
      credentialGeneration: 'gen-1',
      controller: new AbortController(),
    });
    return { events, journal, seen, transport, recheck, guard, operation };
  }

  it('dispatches under the credential resolved across the await', async () => {
    const f = fixture();
    const operations = createGuardedModelOperations({
      guard: f.guard,
      journal: f.journal as never,
      resolve: async () => {
        f.events.push('resolve-start');
        await new Promise(resolve => setTimeout(resolve, 20));
        f.events.push('resolve-end');
        const binding: GuardedModelBinding = {
          operation: { ...f.operation(), credentialGeneration: 'gen-2' },
          model,
          authority: { kind: 'apiKey', apiKey: 'access-after-refresh' },
        };
        return binding;
      },
    });

    await operations.completeSimple(model, {
      messages: [{ role: 'user', content: 'hello' }],
    } as never);

    // The rotated credential is what went on the wire: resolution was awaited
    // and its binding used, not a pre-await snapshot.
    expect(f.seen).toHaveLength(1);
    expect(f.seen[0]).toContain('access-after-refresh');
    expect(f.seen[0]).not.toContain('access-before-refresh');
    // Ordering is unchanged by the await: recheck and the durable intent still
    // precede the send.
    expect(f.events.slice(0, 4)).toEqual([
      'resolve-start',
      'resolve-end',
      'check',
      'allow:1',
    ]);
    expect(f.journal.recordDecisionAndIntent).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        decision: 'allow',
        operation: 'models.completeSimple',
      }),
    );
  });

  it('rechecks authority after the await and denies without sending', async () => {
    const f = fixture();
    f.recheck.mockImplementationOnce(async () => {
      f.events.push('check');
      return false;
    });
    const operations = createGuardedModelOperations({
      guard: f.guard,
      journal: f.journal as never,
      resolve: async () => {
        // A refresh can take time; the admission may have drained meanwhile.
        await new Promise(resolve => setTimeout(resolve, 20));
        return {
          operation: f.operation(),
          model,
          authority: { kind: 'apiKey', apiKey: 'access-after-refresh' },
        } satisfies GuardedModelBinding;
      },
    });

    await operations.completeSimple(model, {
      messages: [{ role: 'user', content: 'hello' }],
    } as never);

    expect(f.transport).not.toHaveBeenCalled();
    expect(f.events).toContain('deny:1');
    expect(f.events).not.toContain('allow:1');
  });

  it('denies actionably and never dispatches when the refresh fails', async () => {
    const f = fixture();
    const operations = createGuardedModelOperations({
      guard: f.guard,
      journal: f.journal as never,
      resolve: async () => {
        const binding: GuardedModelBinding = {
          operation: f.operation(),
          model,
          authority: { kind: 'apiKey', apiKey: 'access-before-refresh' },
        };
        throw new GuardedResolutionError(
          binding,
          'credential expired; re-authentication required',
        );
      },
    });

    const result = await operations.completeSimple(model, {
      messages: [{ role: 'user', content: 'hello' }],
    } as never);

    expect(result.stopReason).toBe('error');
    expect(result.errorMessage).toContain(
      'credential expired; re-authentication required',
    );
    expect(f.transport).not.toHaveBeenCalled();
    expect(f.journal.recordDecisionAndIntent.mock.calls[0][1]).toMatchObject({
      operation: 'models.completeSimple',
      decision: 'deny',
      reason: 'credential expired; re-authentication required',
    });
  });
});
