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

import type { Fence } from '../../contracts';
import type {
  AttemptDecision,
  AttemptOutcome,
  AttemptJournal,
} from '../../journal/types';
import { createAuthOperationGuard, type AuthModuleLookup } from './guard';
import type { AuthOperationKind, TrustedAuthOperation } from './types';

/**
 * Customization hooks the certification suite uses to prove a module's
 * envelope validation is what stops a substituted request.
 *
 * @internal
 */
type AuthCertificationRequestOptions = Readonly<{
  /** Point the request at a different token endpoint. */
  substituteEndpoint?: boolean;
  /** Append a query string to an otherwise valid token request. */
  substituteQuery?: boolean;
}>;

/**
 * Runs the guard certification tests for one auth module and operation kind.
 *
 * @remarks
 *
 * The suite proves the provider-agnostic invariants every auth module inherits:
 * ordered ordinals, a recheck before every send, a latch on revocation, denial
 * before send for substituted endpoints, queries, unregistered providers and
 * uncertified operations, redirect refusal, an explicit `unknown` outcome for a
 * pre-header disconnect, and a latched failure when the durable intent cannot
 * be written. Modules must additionally prove their own envelope validator
 * rejects substituted payloads — supply a `request` hook that can produce them,
 * and expect this suite's substitution case to fail if the validator is
 * weakened.
 *
 * @internal
 */
// The exported helper is intentionally imported by auth module test suites.
// eslint-disable-next-line jest/no-export
export function registerAuthCertification(options: {
  name: string;
  operation: AuthOperationKind;
  modules: AuthModuleLookup;
  createOperation(): TrustedAuthOperation;
  request(
    operation: TrustedAuthOperation,
    options?: AuthCertificationRequestOptions,
  ): Request;
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
    } as unknown as AttemptJournal;
    const recheck = jest.fn(async () => {
      events.push('check');
      return true;
    });
    const transport = jest.fn(async (_request: Request) => {
      events.push('send');
      return new Response(
        JSON.stringify({
          access_token: 'a',
          refresh_token: 'r',
          expires_in: 60,
        }),
        { headers: { 'content-type': 'application/json' } },
      );
    });
    const guard = createAuthOperationGuard({
      modules: options.modules,
      journal,
      recheck,
      transport: transport as unknown as typeof fetch,
    }).bind(op);
    return { op, events, journal, recheck, transport, guard };
  }

  describe(`${options.name} (${options.operation}) auth certification`, () => {
    it('rechecks every attempt, orders intents and latches revocation', async () => {
      const f = fixture();
      await (await f.guard.fetch(options.request(f.op))).text();
      f.recheck.mockImplementationOnce(async () => {
        f.events.push('check');
        return false;
      });
      await expect(f.guard.fetch(options.request(f.op))).rejects.toThrow(
        /revoked/,
      );
      await expect(f.guard.fetch(options.request(f.op))).rejects.toThrow(
        /blocked/,
      );
      expect(f.events).toEqual(['check', 'allow:1', 'send', 'check', 'deny:2']);
      expect(f.transport).toHaveBeenCalledTimes(1);
      expect(f.op.controller.signal.aborted).toBe(true);
    });
    it('denies substituted endpoints and queries before sending', async () => {
      for (const requestOptions of [
        { substituteEndpoint: true },
        { substituteQuery: true },
      ]) {
        const f = fixture();
        await expect(
          f.guard.fetch(options.request(f.op, requestOptions)),
        ).rejects.toThrow();
        expect(f.events).toEqual(['deny:1']);
        expect(f.transport).not.toHaveBeenCalled();
      }
    });
    it('denies untrusted endpoints, unregistered providers and uncertified operations', async () => {
      const changes: Array<Partial<TrustedAuthOperation>> = [
        { authTokenDestinations: [] },
        { provider: 'not-registered' },
        {
          operation:
            options.operation === 'auth.token'
              ? ('auth.token-exchange' as const)
              : ('auth.token' as const),
        },
      ];
      for (const change of changes) {
        const f = fixture();
        const op = { ...f.op, ...change };
        const guard = createAuthOperationGuard({
          modules: options.modules,
          journal: f.journal,
          recheck: f.recheck,
          transport: f.transport as unknown as typeof fetch,
        }).bind(op);
        await expect(guard.fetch(options.request(op))).rejects.toThrow();
        expect(f.events).toEqual(['deny:1']);
        expect(f.transport).not.toHaveBeenCalled();
      }
    });
    it('records a rejected token request and latches the operation', async () => {
      const f = fixture();
      f.transport.mockImplementationOnce(async () => {
        f.events.push('send');
        return new Response('rejected', { status: 401 });
      });
      await expect(f.guard.fetch(options.request(f.op))).rejects.toMatchObject({
        name: 'AuthTokenRejection',
        httpStatus: 401,
      });
      expect(f.events).toEqual(['check', 'allow:1', 'send', 'failed:1']);
      await expect(f.guard.fetch(options.request(f.op))).rejects.toThrow(
        /blocked/,
      );
      expect(f.transport).toHaveBeenCalledTimes(1);
    });
    it('denies redirects and records a pre-header disconnect as unknown', async () => {
      const redirect = fixture();
      redirect.transport.mockImplementationOnce(async () => {
        redirect.events.push('send');
        return new Response(null, {
          status: 302,
          headers: { location: 'https://elsewhere.example/oauth/token' },
        });
      });
      await expect(
        redirect.guard.fetch(options.request(redirect.op)),
      ).rejects.toThrow(/redirects/);
      expect(redirect.transport.mock.calls[0][0].redirect).toBe('manual');
      expect(redirect.events).toEqual(['check', 'allow:1', 'send', 'failed:1']);

      const disconnect = fixture();
      disconnect.transport.mockRejectedValueOnce(new Error('disconnect'));
      await expect(
        disconnect.guard.fetch(options.request(disconnect.op)),
      ).rejects.toThrow('disconnect');
      expect(disconnect.events).toEqual(['check', 'allow:1', 'unknown:1']);
    });
    it('latches a failed durable intent without sending', async () => {
      const f = fixture();
      (f.journal.recordDecisionAndIntent as jest.Mock).mockRejectedValueOnce(
        new Error('journal down'),
      );
      await expect(f.guard.fetch(options.request(f.op))).rejects.toThrow(
        'journal down',
      );
      await expect(f.guard.fetch(options.request(f.op))).rejects.toThrow(
        /blocked/,
      );
      expect(f.transport).not.toHaveBeenCalled();
    });
    it('never sends without a journaled allow intent', async () => {
      const f = fixture();
      await (await f.guard.fetch(options.request(f.op))).text();
      // The allow intent precedes the send in the recorded order.
      expect(f.events.indexOf('allow:1')).toBeLessThan(
        f.events.indexOf('send'),
      );
      const denies = (
        f.journal.recordDecisionAndIntent as jest.Mock
      ).mock.calls.filter(([, event]) => event.decision === 'deny');
      expect(denies).toHaveLength(0);
    });
  });
}
