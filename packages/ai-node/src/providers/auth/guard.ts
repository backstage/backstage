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

import { emitSafe } from '../../observability/types';
import type { AiEventEmitter } from '../../observability/types';
import type {
  AttemptDecision,
  AttemptId,
  AttemptJournal,
  AttemptOutcome,
} from '../../journal/types';
import type {
  AiAuthModule,
  AuthOperationGuard,
  AuthOperationKind,
  GuardedAuthOperation,
  TrustedAuthOperation,
} from './types';
import { hasTrustedAuthOperationContext } from './types';

/** Thrown when a provider token endpoint refuses a request. Never carries a body. */
export class AuthTokenRejection extends Error {
  constructor(readonly httpStatus: number, readonly provider: string) {
    super(
      `Provider '${provider}' rejected the token request with status ${httpStatus}; re-authentication required`,
    );
    this.name = 'AuthTokenRejection';
  }
}

type PendingAttempt = {
  id: AttemptId;
  startedAt: number;
  sentAt?: number;
  httpStatus?: number;
  settled: boolean;
};

/** Lookup of certified auth modules keyed by provider ID. */
export type AuthModuleLookup = Readonly<{
  get(providerId: string): AiAuthModule | undefined;
}>;

/**
 * Records a local auth denial: no send intent, no outcome, no token material.
 *
 * @internal
 */
export async function recordAuthDenial(
  journal: AttemptJournal,
  operation: TrustedAuthOperation,
  reason: string,
  attempt = 1,
  events?: AiEventEmitter,
): Promise<void> {
  await journal.recordDecisionAndIntent(
    operation.fence,
    authDecision(operation, attempt, 'deny', undefined, reason),
  );
  // Same discipline as the guard's own deny(): one failure per logical
  // denial, emitted only once the journal row is durable.
  emitSafe(events, {
    kind: 'denial',
    at: Date.now(),
    pluginId: operation.fence.namespace.pluginId,
    sessionId: operation.fence.namespace.sessionId,
    provider: operation.provider,
    operation: operation.operation,
    reason,
    attempt,
  });
}

function authDecision(
  operation: TrustedAuthOperation,
  attempt: number,
  decision: 'allow' | 'deny',
  destination: string | undefined,
  reason?: string,
): AttemptDecision {
  return {
    actor: operation.actor,
    conversationId: operation.provenance?.conversationId,
    taskId: operation.provenance?.taskId,
    callId: operation.provenance?.callId,
    definitionVersion: operation.definitionVersion,
    configVersion: operation.configVersion,
    provider: operation.provider,
    operation: operation.operation,
    ...(destination ? { destination } : {}),
    ...(reason ? { reason } : {}),
    attempt,
    decision,
  };
}

/** Exact endpoint comparison: origin and path only, no query or fragment. */
function canonicalEndpoint(value: string): string | undefined {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return undefined;
  }
  if (value.includes('?') || value.includes('#') || url.search || url.hash) {
    return undefined;
  }
  if (url.username || url.password) {
    return undefined;
  }
  return `${url.protocol}//${url.host}${url.pathname}`;
}

/**
 * Creates the guarded auth transport.
 *
 * @remarks
 *
 * Each attempt follows the same order as model dispatch: allocate the ordinal,
 * validate the trusted context, destination and module envelope, recheck
 * authority, durably record the allow intent, and only then send. Any failure
 * before the intent denies and latches the operation; a failure after it
 * settles the attempt with the observable outcome, and a journal failure makes
 * the outcome uncertain rather than invented.
 *
 * Token request and response bodies are never journaled: the decision carries
 * the endpoint, operation, attempt and decision only.
 *
 * @internal
 */
export function createAuthOperationGuard(options: {
  /** Captured real transport, never the guarded fetch itself. */
  transport: typeof fetch;
  /** Must recheck permission, credential possession and fence currency. */
  recheck(operation: TrustedAuthOperation): Promise<boolean>;
  journal: AttemptJournal;
  modules: AuthModuleLookup;
  /** Observability sink; no-op when absent. */
  events?: AiEventEmitter;
}): AuthOperationGuard {
  const { transport, journal, modules, events } = options;
  return {
    bind(operation): GuardedAuthOperation {
      let ordinal = 0;
      let blocked = false;
      let finished = false;
      let uncertain = false;
      let serial: Promise<unknown> = Promise.resolve();
      const attempts: PendingAttempt[] = [];
      const outcomeWrites = new Set<Promise<void>>();
      const block = () => {
        blocked = true;
        operation.controller.abort();
      };
      const record = async (
        attempt: PendingAttempt,
        outcome: AttemptOutcome,
      ) => {
        if (attempt.settled) return;
        attempt.settled = true;
        const durationMs = Math.max(
          0,
          Date.now() - (attempt.sentAt ?? attempt.startedAt),
        );
        // Terminal events follow the durable outcome, exactly as in the model
        // guard: a failed journal write is uncertain, not completed.
        const observe = (status: AttemptOutcome['status']) =>
          emitSafe(events, {
            kind: 'dispatch',
            at: Date.now(),
            pluginId: operation.fence.namespace.pluginId,
            sessionId: operation.fence.namespace.sessionId,
            provider: operation.provider,
            operation: operation.operation,
            outcome: status,
            ...(outcome.httpStatus === undefined
              ? {}
              : { httpStatus: outcome.httpStatus }),
            durationMs,
          });
        const write = (async () => {
          try {
            await journal.recordOutcome(operation.fence, attempt.id, outcome);
          } catch (error) {
            uncertain = true;
            block();
            observe('unknown');
            throw new Error(
              'Auth attempt outcome is uncertain: journal failed',
              {
                cause: error,
              },
            );
          }
          observe(outcome.status);
        })();
        outcomeWrites.add(write);
        try {
          await write;
        } finally {
          outcomeWrites.delete(write);
        }
      };
      const deny = async (
        attempt: number,
        destination: string | undefined,
        reason: string,
      ) => {
        try {
          await journal.recordDecisionAndIntent(
            operation.fence,
            authDecision(operation, attempt, 'deny', destination, reason),
          );
        } catch (journalError) {
          throw new Error('Auth denial journal failed', {
            cause: journalError,
          });
        }
        emitSafe(events, {
          kind: 'denial',
          at: Date.now(),
          pluginId: operation.fence.namespace.pluginId,
          sessionId: operation.fence.namespace.sessionId,
          provider: operation.provider,
          operation: operation.operation,
          reason,
          attempt,
        });
      };
      return {
        fetch(input, init) {
          const run = async (): Promise<Response> => {
            const attempt = ++ordinal;
            if (blocked || finished)
              throw new Error('Auth operation is blocked');
            let request: Request;
            let destination: string | undefined;
            let kind: AuthOperationKind = operation.operation;
            try {
              await Promise.all(outcomeWrites);
              if (!hasTrustedAuthOperationContext(operation))
                throw new Error('Unverified auth operation');
              request = new Request(input, init);
              request = new Request(request, {
                redirect: 'manual',
                signal: AbortSignal.any([
                  request.signal,
                  operation.controller.signal,
                ]),
              });
              const actual = canonicalEndpoint(request.url);
              const expected = canonicalEndpoint(operation.destination);
              const module = modules.get(operation.provider);
              if (actual === undefined || actual !== expected)
                throw new Error('Unexpected token endpoint');
              if (!operation.authTokenDestinations.includes(actual))
                throw new Error(
                  'Token endpoint is not trusted by configuration',
                );
              if (!module || new URL(actual).pathname !== module.tokenPath)
                throw new Error('Unverified auth operation or transport');
              kind = operation.operation;
              destination = actual;
              await module.validateTokenRequest({
                operation: kind,
                endpoint: actual,
                request: request.clone(),
              });
              if (
                !(await options.recheck(operation)) ||
                request.signal.aborted ||
                blocked ||
                finished
              ) {
                throw new Error('Auth authority revoked');
              }
            } catch (error) {
              block();
              await deny(
                attempt,
                destination,
                error instanceof Error &&
                  /revoked|aborted|blocked/.test(error.message)
                  ? 'auth authority revoked'
                  : 'unverified auth operation',
              );
              throw error;
            }
            let id: AttemptId;
            try {
              id = await journal.recordDecisionAndIntent(
                operation.fence,
                authDecision(operation, attempt, 'allow', destination),
              );
            } catch (error) {
              block();
              throw error;
            }
            const pending: PendingAttempt = {
              id,
              startedAt: Date.now(),
              settled: false,
            };
            attempts.push(pending);
            if (request.signal.aborted || blocked || finished) {
              await record(pending, { status: 'cancelled' }).catch(() => {});
              block();
              throw new Error('Auth authority revoked before send');
            }
            let response: Response;
            try {
              response = await transport(request);
            } catch (error) {
              await record(pending, {
                status: request.signal.aborted ? 'cancelled' : 'unknown',
              });
              throw error;
            }
            pending.httpStatus = response.status;
            pending.sentAt = Date.now();
            emitSafe(events, {
              kind: 'dispatch',
              at: Date.now(),
              pluginId: operation.fence.namespace.pluginId,
              sessionId: operation.fence.namespace.sessionId,
              provider: operation.provider,
              operation: operation.operation,
              outcome: 'sent',
              httpStatus: response.status,
              durationMs: Date.now() - pending.startedAt,
            });
            if (response.status >= 300 && response.status < 400) {
              block();
              await record(pending, {
                status: 'failed',
                httpStatus: response.status,
              });
              throw new Error('Auth token redirects are not allowed');
            }
            if (response.status >= 400) {
              block();
              await record(pending, {
                status: 'failed',
                httpStatus: response.status,
              });
              throw new AuthTokenRejection(response.status, operation.provider);
            }
            return response;
          };
          const result = serial.then(run);
          serial = result.then(
            () => undefined,
            () => undefined,
          );
          return result;
        },
        async finish(outcome) {
          if (finished) throw new Error('Auth operation already finished');
          finished = true;
          await serial;
          await Promise.all(outcomeWrites);
          if (uncertain) {
            block();
            throw new Error('Auth attempt outcome is uncertain');
          }
          for (const attempt of attempts) {
            if (attempt.settled) continue;
            await record(attempt, {
              status: outcome,
              ...(attempt.httpStatus === undefined
                ? {}
                : { httpStatus: attempt.httpStatus }),
            });
          }
        },
      };
    },
  };
}
