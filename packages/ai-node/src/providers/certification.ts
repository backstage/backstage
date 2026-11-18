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

import { createModelOperationGuard } from '../guard/createModelOperationGuard';
import type { ModelOperation, TrustedOperation } from '../guard/types';
import type { Fence } from '../contracts';
import type { AttemptDecision, AttemptOutcome } from '../journal/types';
import type { AiProviderRegistry } from './registry';

/**
 * Run the guard certification tests for one provider and one operation kind.
 * Supply fresh requests (including otherwise-valid requests with a substituted
 * model or a disallowed query) and a real child-process crash check backed by
 * a durable journal.
 * This suite tests guard/registration boundaries, not arbitrary code that
 * bypasses the guard. Provider-specific SDK integration tests are also needed.
 *
 * @alpha
 */
// The exported helper is intentionally imported by provider test suites.
// eslint-disable-next-line jest/no-export
export function registerProviderCertification(options: {
  name: string;
  operation: ModelOperation;
  providers: AiProviderRegistry;
  createOperation(): TrustedOperation;
  request(
    operation: TrustedOperation,
    substituteModel?: boolean,
    substituteQuery?: boolean,
  ): Request;
  assertCrashUnknown(): Promise<void>;
}): void {
  function fixture() {
    const op = options.createOperation();
    expect(op.operation).toBe(options.operation);
    const events: string[] = [];
    const journal = {
      recordDecisionAndIntent: jest.fn(
        async (_fence: Fence, event: AttemptDecision) => {
          events.push(`${event.decision}:${event.attempt}`);
          return String(event.attempt);
        },
      ),
      recordOutcome: jest.fn(
        async (_fence: Fence, id: string, result: AttemptOutcome) => {
          events.push(`${result.status}:${id}`);
        },
      ),
      recordRecovery: jest.fn(async () => {}),
      read: jest.fn(async () => ({ items: [] })),
    };
    const recheck = jest.fn(async () => {
      events.push('check');
      return true;
    });
    const transport = jest.fn(async (_request: Request) => {
      events.push('send');
      return new Response('ok');
    });
    const guard = createModelOperationGuard({
      providers: options.providers,
      journal,
      recheck,
      transport: transport as unknown as typeof fetch,
    }).bind(op);
    const request = (substitute = false) =>
      guard.fetch(options.request(op, substitute));
    return { op, events, journal, recheck, transport, guard, request };
  }

  describe(`${options.name} (${options.operation}) provider certification`, () => {
    it('rechecks retries, maintains ordinals and latches revocation', async () => {
      const f = fixture();
      f.transport.mockImplementationOnce(async () => {
        f.events.push('send');
        return new Response('retry', { status: 429 });
      });
      await (await f.request()).text();
      f.recheck.mockImplementationOnce(async () => {
        f.events.push('check');
        return false;
      });
      await expect(f.request()).rejects.toThrow('revoked');
      await expect(f.request()).rejects.toThrow('blocked');
      expect(f.events).toEqual([
        'check',
        'allow:1',
        'send',
        'failed:1',
        'check',
        'deny:2',
      ]);
      expect(f.transport).toHaveBeenCalledTimes(1);
      expect(f.op.controller.signal.aborted).toBe(true);
    });
    it('denies substituted model, query and destination before sending', async () => {
      const f = fixture();
      await expect(f.request(true)).rejects.toThrow();
      expect(f.events).toEqual(['deny:1']);
      expect(f.transport).not.toHaveBeenCalled();
      const other = fixture();
      const valid = options.request(other.op);
      const wrong = new URL(valid.url);
      wrong.hostname = 'elsewhere.example';
      await expect(
        other.guard.fetch(new Request(wrong, valid)),
      ).rejects.toThrow();
      expect(other.events).toEqual(['deny:1']);
      expect(other.transport).not.toHaveBeenCalled();
      const query = fixture();
      await expect(
        query.guard.fetch(options.request(query.op, false, true)),
      ).rejects.toThrow();
      expect(query.events).toEqual(['deny:1']);
      expect(query.transport).not.toHaveBeenCalled();
    });
    it('denies unregistered providers and uncertified operations', async () => {
      for (const change of [
        { api: 'not-registered' },
        {
          operation:
            options.operation === 'classify'
              ? ('generateImages' as const)
              : ('classify' as const),
        },
      ]) {
        const f = fixture();
        const op = { ...f.op, ...change };
        const guard = createModelOperationGuard({
          providers: options.providers,
          journal: f.journal,
          recheck: f.recheck,
          transport: f.transport as unknown as typeof fetch,
        }).bind(op);
        await expect(guard.fetch(options.request(op))).rejects.toThrow(
          'Unverified model operation',
        );
        expect(f.events).toEqual(['deny:1']);
        expect(f.transport).not.toHaveBeenCalled();
      }
    });
    it('records a pre-header disconnect as unknown', async () => {
      const f = fixture();
      f.transport.mockRejectedValueOnce(new Error('disconnect'));
      await expect(f.request()).rejects.toThrow('disconnect');
      expect(f.events).toEqual(['check', 'allow:1', 'unknown:1']);
      await f.guard.finish('failed');
      expect(f.journal.recordOutcome).toHaveBeenCalledTimes(1);
    });
    it('records a post-header stream break as stream-failed', async () => {
      const f = fixture();
      f.transport.mockImplementationOnce(async () => {
        f.events.push('send');
        return new Response(
          new ReadableStream({
            pull(c) {
              c.error(new Error('broken'));
            },
          }),
        );
      });
      const response = await f.request();
      await expect(response.text()).rejects.toThrow('broken');
      expect(f.events).toEqual(['check', 'allow:1', 'send', 'stream-failed:1']);
      await f.guard.finish('failed');
      expect(f.journal.recordOutcome).toHaveBeenCalledTimes(1);
    });
    it('denies redirects and latches the operation', async () => {
      const f = fixture();
      f.transport.mockResolvedValueOnce(
        new Response(null, {
          status: 302,
          headers: { location: 'https://elsewhere.example' },
        }),
      );
      await expect(f.request()).rejects.toThrow('redirects');
      expect(f.transport.mock.calls[0][0].redirect).toBe('manual');
      await expect(f.request()).rejects.toThrow('blocked');
      expect(f.transport).toHaveBeenCalledTimes(1);
    });
    it('latches a failed durable intent without sending', async () => {
      const f = fixture();
      f.journal.recordDecisionAndIntent.mockRejectedValueOnce(
        new Error('journal down'),
      );
      await expect(f.request()).rejects.toThrow('journal down');
      await expect(f.request()).rejects.toThrow('blocked');
      expect(f.transport).not.toHaveBeenCalled();
    });
    // The supplied crash fixture contains the durable-journal assertions.
    // eslint-disable-next-line jest/expect-expect
    it(
      'retains an unknown outcome after SIGKILL',
      options.assertCrashUnknown,
      30000,
    );
  });
}
