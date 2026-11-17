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

import type {
  AttemptDecision,
  AttemptId,
  AttemptJournal,
  AttemptOutcome,
} from '../journal/types';
import type {
  GuardedOperation,
  ModelOperationGuard,
  TrustedOperation,
} from './types';
import { hasTrustedOperationContext } from './types';
import { validateRequest } from './validateRequest';
import { MODEL_HTTP_MATRIX } from './matrix';

type PendingAttempt = {
  id: AttemptId;
  httpStatus?: number;
  streamEnded: boolean;
  streamCancelled: boolean;
  settled: boolean;
};

export function createModelOperationGuard(options: {
  /** Captured real transport, never the guarded fetch itself. */
  transport: typeof fetch;
  /** Must recheck permission, credential generation and fence. */
  recheck(operation: TrustedOperation): Promise<boolean>;
  journal: AttemptJournal;
}): ModelOperationGuard {
  const transport = options.transport;
  const journal = options.journal;
  return {
    bind(operation): GuardedOperation {
      let ordinal = 0;
      let blocked = false;
      let finished = false;
      let uncertain = false;
      let serial = Promise.resolve();
      const attempts: PendingAttempt[] = [];
      const outcomeWrites = new Set<Promise<void>>();
      const block = () => {
        blocked = true;
        operation.controller.abort();
      };
      const decision = (
        attempt: number,
        value: 'allow' | 'deny',
        kind: 'model' | 'auth.token' | 'auth.token-exchange' = 'model',
        destination?: string,
        reason?: string,
      ): AttemptDecision => ({
        actor: operation.actor,
        conversationId: operation.provenance?.conversationId,
        taskId: operation.provenance?.taskId,
        callId: operation.provenance?.callId,
        definitionVersion: operation.definitionVersion,
        configVersion: operation.configVersion,
        provider: operation.provider,
        model: operation.modelId,
        operation: kind === 'model' ? `models.${operation.operation}` : kind,
        ...(destination ? { destination } : {}),
        ...(reason ? { reason } : {}),
        attempt,
        decision: value,
      });
      const record = async (
        attempt: PendingAttempt,
        outcome: AttemptOutcome,
      ) => {
        if (attempt.settled) return;
        attempt.settled = true;
        const write = (async () => {
          try {
            if (!journal) throw new Error('Attempt journal is not bound');
            // Lead ruling: one outcome at settlement, not one per HTTP/stream event.
            // Pi durable storage owns the logical result, joined through call/task IDs.
            await journal.recordOutcome(operation.fence, attempt.id, outcome);
          } catch (error) {
            uncertain = true;
            block();
            throw new Error(
              'Model dispatch outcome is uncertain: journal failed',
              { cause: error },
            );
          }
        })();
        outcomeWrites.add(write);
        try {
          await write;
        } finally {
          outcomeWrites.delete(write);
        }
      };
      const wrapResponse = (
        response: Response,
        attempt: PendingAttempt,
        signal: AbortSignal,
      ): Response => {
        if (!response.body) return response;
        const reader = response.body.getReader();
        let ended = false;
        const body = new ReadableStream<Uint8Array>(
          {
            async pull(controller) {
              try {
                const part = await reader.read();
                if (part.done) {
                  if (!ended) {
                    ended = true;
                    attempt.streamEnded = true;
                    if (response.status >= 400)
                      await record(attempt, {
                        status: 'failed',
                        httpStatus: response.status,
                      });
                  }
                  controller.close();
                } else {
                  controller.enqueue(part.value);
                }
              } catch (error) {
                if (!ended) {
                  ended = true;
                  try {
                    await record(attempt, {
                      status: signal.aborted ? 'cancelled' : 'stream-failed',
                      httpStatus: response.status,
                    });
                  } catch (journalError) {
                    controller.error(journalError);
                    return;
                  }
                }
                controller.error(error);
              }
            },
            async cancel(reason) {
              if (!ended) {
                ended = true;
                // SDKs may cancel after a successful completion sentinel.
                // The logical result at finish() decides whether this was failure.
                await reader.cancel(reason);
                attempt.streamEnded = true;
                attempt.streamCancelled = true;
              }
            },
          },
          { highWaterMark: 0 },
        );
        const wrapped = new Response(body, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
        Object.defineProperties(wrapped, {
          url: { value: response.url },
          redirected: { value: response.redirected },
          type: { value: response.type },
        });
        return wrapped;
      };
      return {
        fetch(input, init) {
          const run = async (): Promise<Response> => {
            const n = ++ordinal;
            if (blocked || finished)
              throw new Error('Model operation is blocked');
            let request: Request;
            let kind: 'model' | 'auth.token' | 'auth.token-exchange' = 'model';
            let destination: string | undefined;
            const expired = () =>
              operation.providerCredentialExpiresAt !== undefined &&
              (!Number.isFinite(operation.providerCredentialExpiresAt) ||
                operation.providerCredentialExpiresAt <= Date.now());
            try {
              await Promise.all(outcomeWrites);
              if (
                attempts.some(
                  attempt => !attempt.streamEnded && !attempt.settled,
                )
              ) {
                throw new Error('Concurrent model attempts are not supported');
              }
              if (!journal || !hasTrustedOperationContext(operation))
                throw new Error('Unverified model operation');
              request = new Request(input, init);
              request = new Request(request, {
                redirect: 'manual',
                signal: AbortSignal.any([
                  request.signal,
                  operation.controller.signal,
                ]),
              });
              const validatedUrl = new URL(request.url);
              if (
                operation.api === 'anthropic-messages' &&
                validatedUrl.pathname === '/v1/oauth/token'
              ) {
                kind = 'auth.token-exchange';
              }
              kind = await validateRequest(operation, request);
              destination = `${validatedUrl.origin}${validatedUrl.pathname}`;
              if (
                kind === 'auth.token-exchange' &&
                MODEL_HTTP_MATRIX.authentication.anthropicFederation ===
                  'denied'
              ) {
                throw new Error('Federation token exchange is not certified');
              }
              if (expired()) {
                kind = 'auth.token';
                throw new Error(
                  'credential expired; re-authentication required',
                );
              }
              if (
                !(await options.recheck(operation)) ||
                request.signal.aborted ||
                blocked ||
                finished
              ) {
                throw new Error('Model authority revoked');
              }
              if (expired()) {
                kind = 'auth.token';
                throw new Error(
                  'credential expired; re-authentication required',
                );
              }
            } catch (error) {
              block();
              if (journal) {
                try {
                  await journal.recordDecisionAndIntent(
                    operation.fence,
                    decision(
                      n,
                      'deny',
                      kind,
                      destination,
                      kind === 'auth.token' && expired()
                        ? 'credential expired; re-authentication required'
                        : undefined,
                    ),
                  );
                } catch (journalError) {
                  throw new Error('Model denial journal failed', {
                    cause: journalError,
                  });
                }
              }
              throw error;
            }
            let id: AttemptId;
            try {
              id = await journal.recordDecisionAndIntent(
                operation.fence,
                decision(n, 'allow', kind, destination),
              );
            } catch (error) {
              block();
              throw error;
            }
            const attempt: PendingAttempt = {
              id,
              streamEnded: false,
              streamCancelled: false,
              settled: false,
            };
            attempts.push(attempt);
            const cancelled = request.signal.aborted || expired();
            if (blocked || finished || cancelled) {
              try {
                await record(attempt, {
                  status: cancelled ? 'cancelled' : 'failed',
                });
              } finally {
                block();
              }
              throw new Error('Model authority revoked before send');
            }
            let response: Response;
            try {
              response = await transport(request);
            } catch (error) {
              await record(attempt, {
                status: request.signal.aborted ? 'cancelled' : 'unknown',
              });
              throw error;
            }
            attempt.httpStatus = response.status;
            if (response.status >= 300 && response.status < 400) {
              block();
              await record(attempt, {
                status: 'failed',
                httpStatus: response.status,
              });
              throw new Error('Model redirects are not allowed');
            }
            if (!response.body) {
              attempt.streamEnded = true;
              if (response.status >= 400)
                await record(attempt, {
                  status: 'failed',
                  httpStatus: response.status,
                });
            }
            return wrapResponse(response, attempt, request.signal);
          };
          const result = serial.then(run);
          serial = result.then(
            () => undefined,
            () => undefined,
          );
          return result;
        },
        async finish(outcome) {
          if (finished) throw new Error('Model operation already finished');
          finished = true;
          await serial;
          await Promise.all(outcomeWrites);
          if (uncertain || !journal) {
            block();
            throw new Error(
              'Model dispatch outcome is uncertain or journal missing',
            );
          }
          for (const attempt of attempts) {
            if (attempt.settled) continue;
            let status: AttemptOutcome['status'] = outcome;
            if (!attempt.streamEnded) status = 'unknown';
            else if (
              outcome === 'failed' &&
              (attempt.streamCancelled ||
                (attempt.httpStatus !== undefined && attempt.httpStatus < 400))
            )
              status = 'stream-failed';
            await record(attempt, {
              status,
              ...(attempt.httpStatus === undefined
                ? {}
                : { httpStatus: attempt.httpStatus }),
            });
            if (status === 'unknown') {
              block();
              throw new Error(
                'Model dispatch outcome is uncertain: stream unfinished',
              );
            }
          }
        },
      };
    },
  };
}
