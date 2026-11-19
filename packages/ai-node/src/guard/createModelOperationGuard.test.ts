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
import { createModelOperationGuard as createModelOperationGuardBase } from './createModelOperationGuard';
import type { TrustedOperation } from './types';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { Fence } from '../contracts';
import { builtinProviderRegistry } from '@backstage/ai-node-test-utils/alpha';

const createModelOperationGuard = (
  options: Parameters<typeof createModelOperationGuardBase>[0],
) =>
  createModelOperationGuardBase({
    providers: builtinProviderRegistry,
    ...options,
  });

function fixture() {
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
    provider: 'openai',
    modelId: 'gpt',
    resolvedModel: 'gpt',
    operation: 'stream',
    api: 'openai-responses',
    destination: 'https://provider.example/v1/responses',
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
  const events: string[] = [];
  // Explicitly non-production test double, not a durable journal.
  const journal = {
    recordDecisionAndIntent: jest.fn(
      async (_fence: Fence, event: AttemptDecision) => {
        events.push(`${event.decision}:${event.attempt}`);
        return String(event.attempt);
      },
    ),
    recordOutcome: jest.fn(
      async (_fence: Fence, id: string, outcome: AttemptOutcome) => {
        events.push(`${outcome.status}:${id}`);
      },
    ),
    recordRecovery: jest.fn(async () => {}),
    read: jest.fn(async () => ({ items: [] })),
  };
  const recheck = jest.fn(async () => {
    events.push('check');
    return true;
  });
  const transport = jest.fn(async (_req: Request) => {
    events.push('send');
    return new Response('ok');
  });
  const guard = createModelOperationGuard({
    journal,
    recheck,
    transport: transport as unknown as typeof globalThis.fetch,
  }).bind(operation);
  const fetch = (body = '{"model":"gpt"}') =>
    guard.fetch(operation.destination!, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
  return { operation, events, journal, recheck, transport, guard, fetch };
}

describe('model operation guard', () => {
  it('settles promptly when the operation aborts during a stalled permission recheck', async () => {
    const f = fixture();
    let release!: (allowed: boolean) => void;
    const held = new Promise<boolean>(resolve => {
      release = resolve;
    });
    f.recheck.mockImplementationOnce(() => held);
    const pending = f.fetch();
    await new Promise(resolve => setImmediate(resolve));
    expect(f.recheck).toHaveBeenCalledTimes(1);
    // Abort while the recheck is still in flight: the fetch must settle now,
    // not when the host-side check eventually finishes.
    f.operation.controller.abort();
    await expect(pending).rejects.toThrow('Model authority revoked');
    expect(f.transport).not.toHaveBeenCalled();
    expect(f.events).toContain('deny:1');
    // The eventual check result grants nothing after the abort.
    release(true);
    await f.guard.finish('cancelled');
    expect(f.transport).not.toHaveBeenCalled();
  });

  it('gates every retry, latches revocation, and never sends later retries', async () => {
    const f = fixture();
    f.transport.mockImplementationOnce(async () => {
      f.events.push('send');
      return new Response('retry', { status: 429 });
    });
    const first = await f.fetch();
    expect(first.status).toBe(429);
    expect(await first.text()).toBe('retry');
    f.recheck.mockImplementationOnce(async () => {
      f.events.push('check');
      return false;
    });
    await expect(f.fetch()).rejects.toThrow('revoked');
    await expect(f.fetch()).rejects.toThrow('blocked');
    expect(f.operation.controller.signal.aborted).toBe(true);
    expect(f.transport).toHaveBeenCalledTimes(1);
    expect(f.events).toEqual([
      'check',
      'allow:1',
      'send',
      'failed:1',
      'check',
      'deny:2',
    ]);
  });

  it('blocks invalid payloads, unverified provenance, and journal failures before send', async () => {
    const payload = fixture();
    await expect(payload.fetch('{"model":"other"}')).rejects.toThrow();
    expect(payload.transport).not.toHaveBeenCalled();
    expect(payload.events).toEqual(['deny:1']);
    const unverified = fixture();
    const guard = createModelOperationGuard({
      journal: unverified.journal,
      recheck: unverified.recheck,
      transport: unverified.transport as unknown as typeof globalThis.fetch,
    }).bind({
      ...unverified.operation,
      provenance: { ...unverified.operation.provenance, origin: 'unverified' },
    });
    await expect(
      guard.fetch(unverified.operation.destination!),
    ).rejects.toThrow();
    expect(unverified.transport).not.toHaveBeenCalled();
    const failed = fixture();
    failed.journal.recordDecisionAndIntent.mockRejectedValueOnce(
      new Error('journal down'),
    );
    await expect(failed.fetch()).rejects.toThrow('journal down');
    await expect(failed.fetch()).rejects.toThrow('blocked');
    expect(failed.transport).not.toHaveBeenCalled();
  });

  it('settles committed intents when cancellation or expiry occurs before send', async () => {
    const cancelled = fixture();
    cancelled.journal.recordDecisionAndIntent.mockImplementationOnce(
      async () => {
        cancelled.operation.controller.abort();
        return '1';
      },
    );
    await expect(cancelled.fetch()).rejects.toThrow('revoked before send');
    expect(cancelled.transport).not.toHaveBeenCalled();
    expect(cancelled.journal.recordOutcome).toHaveBeenCalledWith(
      cancelled.operation.fence,
      '1',
      { status: 'cancelled' },
    );
    await expect(cancelled.fetch()).rejects.toThrow('blocked');

    const expired = fixture();
    const now = jest.spyOn(Date, 'now').mockReturnValue(100);
    try {
      const op = { ...expired.operation, providerCredentialExpiresAt: 101 };
      expired.journal.recordDecisionAndIntent.mockImplementationOnce(
        async () => {
          now.mockReturnValue(102);
          return '1';
        },
      );
      const guard = createModelOperationGuard({
        journal: expired.journal,
        recheck: expired.recheck,
        transport: expired.transport as unknown as typeof globalThis.fetch,
      }).bind(op);
      await expect(
        guard.fetch(op.destination!, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{"model":"gpt"}',
        }),
      ).rejects.toThrow('revoked before send');
      expect(expired.journal.recordOutcome).toHaveBeenCalledWith(
        op.fence,
        '1',
        { status: 'cancelled' },
      );
      expect(expired.transport).not.toHaveBeenCalled();
    } finally {
      now.mockRestore();
    }
  });

  it('latches when the pre-send outcome cannot be written', async () => {
    const f = fixture();
    f.journal.recordDecisionAndIntent.mockImplementationOnce(async () => {
      f.operation.controller.abort();
      return '1';
    });
    f.journal.recordOutcome.mockRejectedValueOnce(
      new Error('journal unavailable'),
    );
    await expect(f.fetch()).rejects.toThrow('uncertain');
    await expect(f.fetch()).rejects.toThrow('blocked');
    expect(f.transport).not.toHaveBeenCalled();
  });

  it('settles a committed intent as failed if the operation finishes before send', async () => {
    const f = fixture();
    let entered!: () => void;
    let release!: () => void;
    const inJournal = new Promise<void>(resolve => {
      entered = resolve;
    });
    const gate = new Promise<void>(resolve => {
      release = resolve;
    });
    f.journal.recordDecisionAndIntent.mockImplementationOnce(async () => {
      entered();
      await gate;
      return '1';
    });
    const pending = f.fetch();
    await inJournal;
    const finished = f.guard.finish('completed');
    release();
    await expect(pending).rejects.toThrow('revoked before send');
    await finished;
    expect(f.journal.recordOutcome).toHaveBeenCalledWith(
      f.operation.fence,
      '1',
      { status: 'failed' },
    );
    expect(f.transport).not.toHaveBeenCalled();
  });

  it('disables redirects and reports post-send journal failure as uncertain', async () => {
    const redirect = fixture();
    redirect.transport.mockResolvedValueOnce(
      new Response(null, {
        status: 302,
        headers: { location: 'https://elsewhere.example' },
      }),
    );
    await expect(redirect.fetch()).rejects.toThrow('redirects');
    const sentRequest = redirect.transport.mock.calls[0][0];
    expect(sentRequest.redirect).toBe('manual');
    expect(redirect.operation.controller.signal.aborted).toBe(true);
    const failed = fixture();
    failed.journal.recordOutcome.mockRejectedValueOnce(
      new Error('lost journal'),
    );
    const response = await failed.fetch();
    await response.text();
    await expect(failed.guard.finish('completed')).rejects.toThrow('uncertain');
    await expect(failed.fetch()).rejects.toThrow('blocked');
    expect(failed.transport).toHaveBeenCalledTimes(1);
  });

  it('records pre-header transport uncertainty and refuses completion before the stream ends', async () => {
    const f = fixture();
    f.transport.mockRejectedValueOnce(new Error('socket disconnected'));
    await expect(f.fetch()).rejects.toThrow('socket disconnected');
    expect(f.events).toEqual(['check', 'allow:1', 'unknown:1']);
    const response = await f.fetch();
    expect(response.status).toBe(200);
    expect(f.journal.recordOutcome).toHaveBeenCalledTimes(1);
    await expect(f.guard.finish('completed')).rejects.toThrow('uncertain');
    expect(f.journal.recordOutcome).toHaveBeenLastCalledWith(
      f.operation.fence,
      '2',
      { status: 'unknown', httpStatus: 200 },
    );
    await expect(f.fetch()).rejects.toThrow('blocked');
  });

  it('settles aborts and logical failures after headers without reporting success', async () => {
    const aborted = fixture();
    aborted.transport.mockImplementationOnce(
      async () =>
        new Response(
          new ReadableStream({
            pull(controller) {
              controller.error(new Error('aborted'));
            },
          }),
        ),
    );
    const response = await aborted.fetch();
    aborted.operation.controller.abort();
    await expect(response.text()).rejects.toThrow('aborted');
    expect(aborted.journal.recordOutcome).toHaveBeenCalledWith(
      aborted.operation.fence,
      '1',
      { status: 'cancelled', httpStatus: 200 },
    );
    const logical = fixture();
    await (await logical.fetch()).text();
    await logical.guard.finish('failed');
    expect(logical.journal.recordOutcome).toHaveBeenCalledWith(
      logical.operation.fence,
      '1',
      { status: 'stream-failed', httpStatus: 200 },
    );
  });

  it('records stream failure after successful headers', async () => {
    const f = fixture();
    f.transport.mockImplementationOnce(async () => {
      f.events.push('send');
      return new Response(
        new ReadableStream({
          pull(controller) {
            controller.error(new Error('broken stream'));
          },
        }),
      );
    });
    const response = await f.fetch();
    expect(response.status).toBe(200);
    await expect(response.text()).rejects.toThrow('broken stream');
    expect(f.events).toEqual(['check', 'allow:1', 'send', 'stream-failed:1']);
    await f.guard.finish('failed');
    expect(f.journal.recordOutcome).toHaveBeenCalledTimes(1);
  });
});
