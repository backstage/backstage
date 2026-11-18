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

import { once } from 'node:events';
import { createProviderRegistry } from '@backstage/ai-node/testUtils';
import type { TrustedOperation } from '@backstage/ai-node/testUtils';
import {
  createGuardedModelOperations,
  createModelOperationGuard,
} from '@backstage/ai-node/testUtils';
import { createServer } from 'node:http';
import { Worker } from 'node:worker_threads';
import { mkdtemp, rm, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { mockCredentials } from '@backstage/backend-test-utils';
import { googleProvider } from '@earendil-works/pi-ai/providers/google';
import { googleVertexProvider } from '@earendil-works/pi-ai/providers/google-vertex';
import { normalizeContext } from '@earendil-works/pi-ai/utils/transcript';
import type { Model } from '@earendil-works/pi-ai';
import { googleGenerativeAi, googleVertex } from './module';
import {
  closeGoogleWorker,
  runGoogleStream,
  terminateGoogleWorker,
} from './runtime';

/**
 * The worker-boundary failure matrix. The invariant across every cell: the
 * boundary fails exactly like the guard does — closed, journaled, bounded.
 * Outcomes are always denied / cancelled / unknown, never pending; no
 * request is sent after a failure or after shutdown; no success is ever
 * claimed for an uncertain remote outcome.
 *
 * Interaction points (rows) × failure modes (columns), with the test that
 * covers each meaningful cell:
 *
 * | Point \ Mode             | worker death          | callback throw / non-serializable | transport / caller abort     | shutdown concurrent        |
 * |--------------------------|-----------------------|-----------------------------------|------------------------------|---------------------------|
 * | fetch RPC, pre-header    | 'settles in-flight guard on worker death' | —                | 'settles a pre-header caller abort without sending' | 'does not dispatch a stream once immediate shutdown completes' |
 * | fetch RPC, post-header   | 'settles a streaming job on worker death' | —                | 'propagates a post-header caller abort to the host stream' | 'does not dispatch…' (drain window aborts) |
 * | onPayload RPC            | (worker death fails the pending job like any other) | 'does not send if the payload callback rejects' / 'rejects a non-transferable payload callback without hanging' | — | — |
 * | onProviderStreamEvent    | —                     | 'tolerates a throwing stream-event callback' | — | — |
 * | worker startup           | —                     | —                                 | —                            | 'does not dispatch a stream once immediate shutdown completes' |
 * | graceful close           | —                     | —                                 | 'aborts in-flight streams on clean shutdown' (googleWorker.test) | — |
 * | emergency terminate      | 'records an unknown outcome when the worker is lost mid-stream' (googleWorker.test) | — | — | — |
 *
 * Configuration-boundary cells: 'denies the SDK ADC sentinel…',
 * 'blocks ADC credential traffic…', 'matches the SDK URL for an unversioned
 * custom Gemini base', 'preserves subarray response chunk bytes exactly',
 * and 'strips transport overrides returned from the payload callback'.
 */
jest.setTimeout(15000);

const providers = createProviderRegistry([googleGenerativeAi, googleVertex]);

const context = () =>
  normalizeContext({
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: 'hi' }],
        timestamp: Date.now(),
      },
    ],
  });

const sseBody = (text = 'hello') =>
  `data: ${JSON.stringify({
    candidates: [
      {
        content: { parts: [{ text }], role: 'model' },
        finishReason: 'STOP',
      },
    ],
    usageMetadata: {
      promptTokenCount: 1,
      candidatesTokenCount: 1,
      totalTokenCount: 2,
    },
  })}\n\n`;

function setup(
  baseUrl: string,
  transport: typeof fetch,
  recheck: () => Promise<boolean> = async () => true,
) {
  const model = {
    ...googleProvider().getModels()[0],
    baseUrl,
  } as Model<'google-generative-ai'> & { baseUrl: string };
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
    operation: 'completeSimple',
    api: model.api as TrustedOperation['api'],
    destination: googleGenerativeAi.destination(model, undefined),
    credentialScope: { kind: 'user', id: 'user:default/alice' },
    credentialGeneration: '1',
    controller: new AbortController(),
  };
  const events: string[] = [];
  const journal = {
    recordDecisionAndIntent: async (
      _fence: unknown,
      event: { decision: string; attempt: number },
    ) => {
      events.push(`${event.decision}:${event.attempt}`);
      return '1';
    },
    recordOutcome: async (
      _fence: unknown,
      _id: string,
      outcome: { status: string },
    ) => {
      events.push(`outcome:${outcome.status}`);
    },
    recordRecovery: async () => {},
    read: async () => ({ items: [] }),
  };
  const guard = createModelOperationGuard({
    providers,
    journal: journal as never,
    transport,
    recheck,
  });
  const facade = createGuardedModelOperations({
    providers,
    guard,
    journal: journal as never,
    resolve: () => ({
      model,
      operation: op,
      authority: { kind: 'apiKey', apiKey: 'key' },
    }),
  });
  return { model, op, events, guard, facade };
}

afterEach(async () => {
  await closeGoogleWorker();
});

it('settles in-flight guard work on worker death before headers', async () => {
  let entered!: () => void;
  let release!: (error: Error) => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  let aborted = false;
  const transport = (async (request: Request) =>
    new Promise<Response>((_resolve, reject) => {
      release = reject;
      entered();
      request.signal.addEventListener(
        'abort',
        () => {
          aborted = true;
          reject(new Error('transport aborted'));
        },
        { once: true },
      );
    })) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  await started;
  await terminateGoogleWorker();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  release(new Error('probe cleanup'));
  await result;
  expect(outcome).toBe('settled');
  expect(aborted).toBe(true);
  expect(f.events).toContain('allow:1');
  // The attempt settles as an infrastructure cancel: bounded and journaled,
  // claiming no remote outcome.
  expect(['outcome:cancelled', 'outcome:unknown']).toContain(f.events.at(-1));
});

it('settles a streaming job on worker death after headers', async () => {
  let started!: () => void;
  const available = new Promise<void>(resolve => {
    started = resolve;
  });
  const transport = jest.fn(async () => {
    started();
    return new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(sseBody()));
          // The body never completes.
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    );
  });
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  await available;
  await new Promise(resolve => setTimeout(resolve, 100));
  await terminateGoogleWorker();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await result;
  expect(outcome).toBe('settled');
  expect(f.events).toContain('allow:1');
  expect(f.events).not.toContain('outcome:completed');
});

it('settles a pre-header caller abort without sending', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const caller = new AbortController();
  caller.abort();
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    signal: caller.signal,
  });
  expect(['error', 'aborted']).toContain(result.stopReason);
  expect(transport).not.toHaveBeenCalled();
});

it('propagates a post-header caller abort to the host stream', async () => {
  let started!: () => void;
  let cancelled = false;
  const available = new Promise<void>(resolve => {
    started = resolve;
  });
  const transport = (async () =>
    new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(sseBody()));
          started();
        },
        cancel() {
          cancelled = true;
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    )) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const caller = new AbortController();
  const result = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    signal: caller.signal,
  });
  await available;
  await new Promise(resolve => setTimeout(resolve, 150));
  caller.abort();
  const outcome = await Promise.race([
    result.then(() => 'settled'),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await result;
  expect(outcome).toBe('settled');
  expect(cancelled).toBe(true);
  expect(f.events).toContain('outcome:cancelled');
});

it('refuses new work while overlapping shutdowns are in flight', async () => {
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const first = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(first.stopReason).toBe('stop');
  // A graceful close begins; while it is still draining, an emergency
  // terminate runs. Shutdown state is shared: the terminate cannot clear
  // the graceful close's refusal, so a new stream started in the overlap
  // window never dispatches.
  const graceful = closeGoogleWorker();
  await terminateGoogleWorker();
  let closeDone = false;
  void graceful.then(() => {
    closeDone = true;
  });
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  const closeDoneAtResult = closeDone;
  await graceful;
  expect(closeDoneAtResult).toBe(false);
  expect(sends).toBe(1);
  expect(result.errorMessage).toContain('shutting down');
});

it('settles the facade on close while an authority recheck is held', async () => {
  let entered!: () => void;
  let release!: (allowed: boolean) => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  const holding = new Promise<boolean>(resolve => {
    release = resolve;
  });
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody());
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
    async () => {
      entered();
      return holding;
    },
  );
  const pending = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  const race = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  expect(await race(started)).not.toBe('timeout');
  await closeGoogleWorker();
  const beforeRelease = await race(pending, 400);
  release(true);
  const afterRelease = await race(pending);
  // The facade must not queue behind the stalled host-side check: it
  // settles at close time with zero sends.
  expect(beforeRelease).not.toBe('timeout');
  expect(sends).toBe(0);
  expect(afterRelease).not.toBe('timeout');
});

/*
 * Close-caller combination matrix (shutdown coordination, cycle 3).
 *
 * The invariant under test: after ANY close call returns, no stream started
 * before or during any overlapping close can still send or complete; new
 * work is refused from the first close's start until the replacement
 * runtime is published after the LAST close call finishes.
 *
 * Rows — overlapping close callers:
 *   1. single graceful
 *   2. single terminate
 *   3. graceful + terminate
 *   4. terminate + graceful
 *   5. terminate + terminate
 *   6. graceful + graceful, the second started inside the first's drain
 *      window (close during another close's drain — the cycle-3 bug)
 *   7. N-way: graceful + three terminates
 *   8. close during worker startup (the respawn race)
 *
 * Columns — new-work phases:
 *   BEFORE      a stream in flight when the first close starts never sends
 *               or completes after any close returns (lifecycle suites and
 *               the cell-8 race probe below).
 *   DURING      a stream started while any close is running is refused
 *               before dispatch: no send, bounded settle.
 *   AFTER-FIRST once the first of several overlapping closes returns but
 *               the last is still draining, work is still refused — the
 *               replacement must not be published early.
 *   AFTER-ALL   once every close call has returned, new work is served by
 *               a fresh worker.
 */
const closeCallerCombos: Array<{ name: string; start: () => Promise<void>[] }> =
  [
    { name: 'single graceful', start: () => [closeGoogleWorker()] },
    { name: 'single terminate', start: () => [terminateGoogleWorker()] },
    {
      name: 'graceful + terminate',
      start: () => [closeGoogleWorker(), terminateGoogleWorker()],
    },
    {
      name: 'terminate + graceful',
      start: () => [terminateGoogleWorker(), closeGoogleWorker()],
    },
    {
      name: 'terminate + terminate',
      start: () => [terminateGoogleWorker(), terminateGoogleWorker()],
    },
    {
      name: 'N-way: graceful + three terminates',
      start: () => [
        closeGoogleWorker(),
        terminateGoogleWorker(),
        terminateGoogleWorker(),
        terminateGoogleWorker(),
      ],
    },
  ];

describe.each(closeCallerCombos)('close matrix: %s', ({ start }) => {
  it('refuses new work while the closes run and serves it after they finish', async () => {
    let sends = 0;
    const transport = (async () => {
      sends += 1;
      return new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      });
    }) as typeof fetch;
    const f = setup(
      'https://generativelanguage.googleapis.com/v1beta',
      transport,
    );
    expect(
      (await f.facade.completeSimple(f.model, context(), { maxRetries: 0 }))
        .stopReason,
    ).toBe('stop');
    const closes = start();
    // DURING: posted synchronously while the close callers are in flight.
    const during = await f.facade.completeSimple(f.model, context(), {
      maxRetries: 0,
    });
    expect(during.errorMessage).toContain('shutting down');
    await Promise.all(closes);
    // AFTER-ALL: the replacement is published; new work succeeds.
    const after = await f.facade.completeSimple(f.model, context(), {
      maxRetries: 0,
    });
    expect(after.stopReason).toBe('stop');
    expect(sends).toBe(2);
  });
});

it('keeps refusing work until every overlapping graceful close has finished (cycle-3 reproduction)', async () => {
  let sends = 0;
  let started!: () => void;
  const entered = new Promise<void>(resolve => {
    started = resolve;
  });
  const transport = (async () => {
    sends += 1;
    if (sends === 1) {
      return new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      });
    }
    started();
    return new Response(new ReadableStream({ start() {} }), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  await f.facade.completeSimple(f.model, context(), { maxRetries: 0 });
  const first = closeGoogleWorker();
  // The second close starts inside the first close's drain window.
  await new Promise(resolve => setTimeout(resolve, 70));
  const second = closeGoogleWorker();
  await first;
  let secondDone = false;
  void second.then(() => {
    secondDone = true;
  });
  // AFTER-FIRST: the first close has returned, the second is still
  // draining. A new stream must be refused — the runtime replacement is
  // not published while any close call is still in flight.
  const pending = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  const firstEvent = await Promise.race([
    entered.then(() => 'sent'),
    pending.then(() => 'refused'),
  ]);
  const secondDoneAtRefusal = secondDone;
  expect(firstEvent).toBe('refused');
  expect(secondDoneAtRefusal).toBe(false);
  await second;
  const result = await pending;
  expect(result.errorMessage).toContain('shutting down');
  expect(sends).toBe(1);
  // AFTER-ALL: the replacement is published; new work succeeds on a
  // fresh fixture so the dangling response above stays unconsumed.
  let afterSends = 0;
  const afterTransport = (async () => {
    afterSends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f2 = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    afterTransport,
  );
  const after = await f2.facade.completeSimple(f2.model, context(), {
    maxRetries: 0,
  });
  expect(after.stopReason).toBe('stop');
  expect(afterSends).toBe(1);
});

it('keeps refusing work between a finished terminate and a still-draining graceful close', async () => {
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  expect(
    (await f.facade.completeSimple(f.model, context(), { maxRetries: 0 }))
      .stopReason,
  ).toBe('stop');
  const graceful = closeGoogleWorker();
  const term = terminateGoogleWorker();
  await term;
  // AFTER-FIRST: the immediate close has returned, the graceful one is
  // still draining — work is still refused.
  const during = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(during.errorMessage).toContain('shutting down');
  await graceful;
  const after = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(after.stopReason).toBe('stop');
  expect(sends).toBe(2);
});

it('never sends after close when a close overtakes worker startup', async () => {
  let sends = 0;
  let sendAfterClose = false;
  let closeReturned = false;
  const transport = (async () => {
    sends += 1;
    if (closeReturned) sendAfterClose = true;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  // Kill the worker so the probed stream must respawn it, then race the
  // respawn against a close.
  await terminateGoogleWorker();
  const pending = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  const close = closeGoogleWorker().then(() => {
    closeReturned = true;
  });
  const race = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  const result = await race(pending);
  await close;
  // The stream settles bounded either way, and no send happens after the
  // close returns: it is either refused before dispatch or it completed
  // entirely before the close began.
  expect(result).not.toBe('timeout');
  expect(sendAfterClose).toBe(false);
  expect(sends).toBeLessThanOrEqual(1);
  // AFTER-ALL: the replacement is published; new work succeeds.
  const after = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(after.stopReason).toBe('stop');
});

/*
 * Shutdown exception-safety matrix (cycle 4).
 *
 * Shutdown steps × {succeeds, throws} × invariants: every job settles
 * (with its in-flight host fetches aborted), the close counter stays
 * correct, no job stays pending on a dead runtime, nothing sends after
 * any close returns, and the replacement publishes only after cleanup.
 *
 *   S1 await pending worker startup — cannot throw (failure swallowed).
 *   S2 graceful abort-post loop — per-job try/catch, cannot throw.
 *   S3 drain window (100 ms sleep) — cannot throw.
 *   S4 runtime detach + generation bump — synchronous, cannot throw.
 *   S5 worker.terminate() — CAN throw. The injected-rejection tests below
 *      cover lone close, terminate overlapping a successful close, and a
 *      double failure: in each, every job is failed (with fetch aborts)
 *      before the rejection propagates, the counter still decrements, and
 *      the replacement is published only after that cleanup.
 *   S6 fail-jobs loop — synchronous and per-job try/catch guarded; runs in
 *      a finally around S5 so a termination failure cannot skip it, and one
 *      job's throwing settlement cannot prevent the remaining jobs from
 *      failing (the first settlement error is re-thrown after the loop).
 *   S7 counter decrement + terminal flag — finally blocks on every path.
 *   S8 runtime publication — coordinatedClose finally, ordered after S6.
 *
 * Success-path cells for every step are covered by the close-caller
 * combination matrix above and the lifecycle suites.
 */
it('a failed lone close settles its old job while allowing a replacement', async () => {
  const oldPost = Worker.prototype.postMessage;
  const oldTerminate = Worker.prototype.terminate;
  let firstWorker: Worker | undefined;
  let entered!: () => void;
  let release!: () => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const bounded = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  Worker.prototype.postMessage = function patchedPost(
    this: Worker,
    ...args: unknown[]
  ) {
    // Capturing the live worker requires aliasing `this` once.
    // eslint-disable-next-line consistent-this
    const target = this;
    if (!firstWorker) firstWorker = target;
    return (oldPost as (...a: unknown[]) => void).apply(target, args);
  } as unknown as typeof Worker.prototype.postMessage;
  try {
    const f = setup(
      'https://generativelanguage.googleapis.com/v1beta',
      transport,
    );
    const guarded = f.guard.bind(f.op);
    // A job held inside its payload callback: pre-send, so it has not
    // touched the transport yet.
    const pending = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      {
        apiKey: 'key',
        fetch: guarded.fetch,
        maxRetries: 0,
        onPayload: async () => {
          entered();
          await held;
        },
      },
      true,
    ).result();
    expect(await bounded(started)).not.toBe('timeout');
    const oldWorker = firstWorker;
    if (!oldWorker) throw new Error('worker missing');
    Worker.prototype.terminate = function (this: Worker) {
      if (this === oldWorker) {
        return Promise.reject(new Error('injected close failure'));
      }
      return oldTerminate.call(this);
    } as unknown as typeof Worker.prototype.terminate;
    let error = '';
    try {
      await closeGoogleWorker();
    } catch (e) {
      error = (e as Error).message;
    }
    // The close rejects, but the old job still settles bounded at close
    // time — the termination failure cannot skip job cleanup.
    const afterClose = await bounded(pending, 400);
    // The replacement is published after the cleanup; fresh work succeeds.
    const fresh = await bounded(
      f.facade.completeSimple(f.model, context(), { maxRetries: 0 }),
    );
    const sendsBeforeRelease = sends;
    release();
    const eventual = await bounded(pending);
    await oldTerminate.call(oldWorker);
    expect(error).toContain('injected close failure');
    expect(afterClose).not.toBe('timeout');
    expect(fresh).not.toBe('timeout');
    expect((fresh as { stopReason: string }).stopReason).toBe('stop');
    // The late callback release changes nothing: the old job already
    // settled and never sent.
    expect(eventual).not.toBe('timeout');
    expect(sendsBeforeRelease).toBe(1);
    expect(sends).toBe(1);
  } finally {
    Worker.prototype.postMessage = oldPost;
    Worker.prototype.terminate = oldTerminate;
  }
});

it('a rejected terminate does not wedge an overlapping close counter', async () => {
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const direct = () =>
    f.facade.completeSimple(f.model, context(), { maxRetries: 0 });
  expect((await direct()).stopReason).toBe('stop');
  const original = Worker.prototype.terminate;
  let failOnce = true;
  Worker.prototype.terminate = function (this: Worker) {
    if (failOnce) {
      failOnce = false;
      return Promise.reject(new Error('injected terminate failure'));
    }
    return original.call(this);
  } as unknown as typeof Worker.prototype.terminate;
  try {
    const close = closeGoogleWorker();
    const term = terminateGoogleWorker();
    let error = '';
    try {
      await term;
    } catch (e) {
      error = (e as Error).message;
    }
    const bounded = <T>(promise: Promise<T>, ms = 2500) =>
      Promise.race([
        promise,
        new Promise<'timeout'>(resolve =>
          setTimeout(() => resolve('timeout'), ms),
        ),
      ]);
    const during = await bounded(direct());
    await close;
    const after = await bounded(direct());
    expect(error).toContain('injected terminate failure');
    expect((during as { errorMessage: string }).errorMessage).toContain(
      'shutting down',
    );
    expect((after as { stopReason: string }).stopReason).toBe('stop');
    expect(sends).toBe(2);
  } finally {
    Worker.prototype.terminate = original;
  }
});

it('overlapping failed closes still settle jobs and keep the counter correct', async () => {
  const oldPost = Worker.prototype.postMessage;
  const oldTerminate = Worker.prototype.terminate;
  let firstWorker: Worker | undefined;
  let entered!: () => void;
  let release!: () => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const bounded = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  Worker.prototype.postMessage = function patchedPost(
    this: Worker,
    ...args: unknown[]
  ) {
    // Capturing the live worker requires aliasing `this` once.
    // eslint-disable-next-line consistent-this
    const target = this;
    if (!firstWorker) firstWorker = target;
    return (oldPost as (...a: unknown[]) => void).apply(target, args);
  } as unknown as typeof Worker.prototype.postMessage;
  try {
    const f = setup(
      'https://generativelanguage.googleapis.com/v1beta',
      transport,
    );
    const guarded = f.guard.bind(f.op);
    const pending = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      {
        apiKey: 'key',
        fetch: guarded.fetch,
        maxRetries: 0,
        onPayload: async () => {
          entered();
          await held;
        },
      },
      true,
    ).result();
    expect(await bounded(started)).not.toBe('timeout');
    const oldWorker = firstWorker;
    if (!oldWorker) throw new Error('worker missing');
    // Both overlapping closes fail their termination.
    let failures = 2;
    Worker.prototype.terminate = function (this: Worker) {
      if (failures > 0) {
        failures -= 1;
        return Promise.reject(new Error('injected close failure'));
      }
      return oldTerminate.call(this);
    } as unknown as typeof Worker.prototype.terminate;
    const first = closeGoogleWorker();
    const second = closeGoogleWorker();
    const errors: string[] = [];
    await first.catch(e => errors.push((e as Error).message));
    await second.catch(e => errors.push((e as Error).message));
    expect(errors).toHaveLength(2);
    expect(errors[0]).toContain('injected close failure');
    // Both rejections still settled the old job and decremented the
    // counter: the replacement is published and fresh work succeeds.
    const afterClose = await bounded(pending, 400);
    const fresh = await bounded(
      f.facade.completeSimple(f.model, context(), { maxRetries: 0 }),
    );
    release();
    const eventual = await bounded(pending);
    await oldTerminate.call(oldWorker);
    expect(afterClose).not.toBe('timeout');
    expect((fresh as { stopReason: string }).stopReason).toBe('stop');
    expect(eventual).not.toBe('timeout');
    expect(sends).toBe(1);
  } finally {
    Worker.prototype.postMessage = oldPost;
    Worker.prototype.terminate = oldTerminate;
  }
});

it('a throwing stream settlement does not prevent cleanup of other jobs', async () => {
  const oldPost = Worker.prototype.postMessage;
  const oldTerminate = Worker.prototype.terminate;
  let firstWorker: Worker | undefined;
  let entered!: () => void;
  let release!: () => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const bounded = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  Worker.prototype.postMessage = function patchedPost(
    this: Worker,
    ...args: unknown[]
  ) {
    // Capturing the live worker requires aliasing `this` once.
    // eslint-disable-next-line consistent-this
    const target = this;
    if (!firstWorker) firstWorker = target;
    return (oldPost as (...a: unknown[]) => void).apply(target, args);
  } as unknown as typeof Worker.prototype.postMessage;
  try {
    const f = setup(
      'https://generativelanguage.googleapis.com/v1beta',
      transport,
    );
    const guarded = f.guard.bind(f.op);
    // Two jobs share one held payload callback: both are pre-send when the
    // close begins.
    let calls = 0;
    const callback = async () => {
      calls += 1;
      if (calls === 2) entered();
      await held;
    };
    const options = {
      apiKey: 'key',
      fetch: guarded.fetch,
      onPayload: callback,
    };
    const a = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      options,
      true,
    );
    const b = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      options,
      true,
    );
    const aResult = a.result();
    const bResult = b.result();
    expect(await bounded(started)).not.toBe('timeout');
    const worker = firstWorker;
    if (!worker) throw new Error('worker missing');
    // The first job's settlement notification throws, and the termination
    // is rejected: both failures at once.
    const oldPush = a.push.bind(a);
    a.push = (() => {
      throw new Error('injected settlement failure');
    }) as typeof a.push;
    Worker.prototype.terminate = function (this: Worker) {
      if (this === worker) {
        return Promise.reject(new Error('injected termination failure'));
      }
      return oldTerminate.call(this);
    } as unknown as typeof Worker.prototype.terminate;
    let error = '';
    try {
      await terminateGoogleWorker();
    } catch (e) {
      error = (e as Error).message;
    }
    a.push = oldPush;
    Worker.prototype.terminate = oldTerminate;
    // BOTH jobs settle bounded at close time despite the throwing
    // settlement: the loop continued past the first job.
    const before = await bounded(bResult, 300);
    release();
    const after = await bounded(bResult);
    await oldTerminate.call(worker);
    await bounded(aResult);
    expect(error).toContain('injected settlement failure');
    expect(before).not.toBe('timeout');
    expect(after).toBe(before);
    // The callback releases change nothing: neither job ever sent.
    expect(sends).toBe(0);
  } finally {
    Worker.prototype.postMessage = oldPost;
    Worker.prototype.terminate = oldTerminate;
    release();
  }
});

it('an undefined settlement error still takes priority over a termination failure', async () => {
  const oldPost = Worker.prototype.postMessage;
  const oldTerminate = Worker.prototype.terminate;
  let firstWorker: Worker | undefined;
  let entered!: () => void;
  let release!: () => void;
  const started = new Promise<void>(resolve => {
    entered = resolve;
  });
  const held = new Promise<void>(resolve => {
    release = resolve;
  });
  let sends = 0;
  const transport = (async () => {
    sends += 1;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const bounded = <T>(promise: Promise<T>, ms = 2500) =>
    Promise.race([
      promise,
      new Promise<'timeout'>(resolve =>
        setTimeout(() => resolve('timeout'), ms),
      ),
    ]);
  Worker.prototype.postMessage = function patchedPost(
    this: Worker,
    ...args: unknown[]
  ) {
    // Capturing the live worker requires aliasing `this` once.
    // eslint-disable-next-line consistent-this
    const target = this;
    if (!firstWorker) firstWorker = target;
    return (oldPost as (...a: unknown[]) => void).apply(target, args);
  } as unknown as typeof Worker.prototype.postMessage;
  try {
    const f = setup(
      'https://generativelanguage.googleapis.com/v1beta',
      transport,
    );
    const guarded = f.guard.bind(f.op);
    let calls = 0;
    const callback = async () => {
      calls += 1;
      if (calls === 2) entered();
      await held;
    };
    const options = {
      apiKey: 'key',
      fetch: guarded.fetch,
      onPayload: callback,
    };
    const a = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      options,
      true,
    );
    const b = runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      options,
      true,
    );
    const aResult = a.result();
    const bResult = b.result();
    expect(await bounded(started)).not.toBe('timeout');
    const worker = firstWorker;
    if (!worker) throw new Error('worker missing');
    // The first job's settlement throws undefined — a value the nullish
    // capture cannot distinguish from "no error yet".
    const oldPush = a.push.bind(a);
    a.push = (() => {
      // The thrown value itself is the reproduction's subject.
      // eslint-disable-next-line no-throw-literal
      throw undefined;
    }) as typeof a.push;
    Worker.prototype.terminate = function (this: Worker) {
      if (this === worker) {
        return Promise.reject(new Error('injected termination failure'));
      }
      return oldTerminate.call(this);
    } as unknown as typeof Worker.prototype.terminate;
    let caught = false;
    let error: unknown = 'not thrown';
    try {
      await terminateGoogleWorker();
    } catch (e) {
      caught = true;
      error = e;
    }
    a.push = oldPush;
    Worker.prototype.terminate = oldTerminate;
    // The settlement value — undefined — keeps precedence: the close
    // rejects with it, not with the termination error.
    expect(caught).toBe(true);
    expect(error).toBeUndefined();
    // Both jobs still settle bounded at close time.
    const first = await bounded(aResult, 300);
    const before = await bounded(bResult, 300);
    release();
    const after = await bounded(bResult);
    await oldTerminate.call(worker);
    expect(first).not.toBe('timeout');
    expect(before).not.toBe('timeout');
    expect(after).toBe(before);
    expect(sends).toBe(0);
  } finally {
    Worker.prototype.postMessage = oldPost;
    Worker.prototype.terminate = oldTerminate;
    release();
  }
});

it('does not dispatch a stream once immediate shutdown completes', async () => {
  const transport = jest.fn(
    async () =>
      new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      }),
  );
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const guarded = f.guard.bind(f.op);
  const pending = runGoogleStream(
    'google-generative-ai',
    f.model,
    context(),
    { apiKey: 'key', fetch: guarded.fetch, maxRetries: 0 },
    true,
  ).result();
  await closeGoogleWorker();
  const result = await pending;
  expect(result.stopReason).toBe('error');
  expect(transport).not.toHaveBeenCalled();
  expect(f.events).not.toContain('allow:1');
});

it('does not send if the payload callback rejects', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: () => {
      throw new Error('callback forbids send');
    },
  });
  expect(result.stopReason).toBe('error');
  expect(result.errorMessage).toContain('callback forbids send');
  expect(transport).not.toHaveBeenCalled();
});

it('rejects a non-transferable payload callback without hanging', async () => {
  const transport = jest.fn(async () => new Response('unexpected'));
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const pending = f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: (value: unknown) => ({
      ...(value as object),
      callbackInjectedFunction: () => {},
    }),
  });
  const outcome = await Promise.race([
    pending.then(result => result.stopReason),
    new Promise<string>(resolve => setTimeout(() => resolve('timeout'), 800)),
  ]);
  await pending;
  expect(outcome).not.toBe('timeout');
  expect(outcome).toBe('error');
  expect(transport).not.toHaveBeenCalled();
});

it('strips transport overrides returned from the payload callback', async () => {
  let request!: Request;
  let visible: Record<string, unknown> | undefined;
  const transport = (async (req: Request) => {
    request = req;
    return new Response(sseBody(), {
      headers: { 'content-type': 'text/event-stream' },
    });
  }) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onPayload: (value: unknown) => {
      const params = value as Record<string, unknown>;
      visible = params;
      return {
        ...params,
        config: {
          ...(params.config as object),
          httpOptions: { headers: { 'x-unsafe': 'unsafe' } },
          abortSignal: { aborted: false },
        },
      };
    },
  });
  expect(result.stopReason).toBe('stop');
  expect(
    (visible?.config as Record<string, unknown>).httpOptions,
  ).toBeUndefined();
  expect(
    (visible?.config as Record<string, unknown>).abortSignal,
  ).toBeUndefined();
  expect(request.headers.has('x-unsafe')).toBe(false);
});

it('tolerates a throwing stream-event callback', async () => {
  const transport = jest.fn(
    async () =>
      new Response(sseBody(), {
        headers: { 'content-type': 'text/event-stream' },
      }),
  );
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
    onProviderStreamEvent: () => {
      throw new Error('observer failed');
    },
  });
  expect(result.stopReason).toBe('stop');
  expect(transport).toHaveBeenCalledTimes(1);
});

it('preserves subarray response chunk bytes exactly', async () => {
  const sse = sseBody();
  const bytes = new TextEncoder().encode(sse);
  const backing = new Uint8Array(bytes.length + 16);
  backing.fill(88);
  backing.set(bytes, 8);
  const transport = (async () =>
    new Response(
      new ReadableStream({
        start(controller) {
          controller.enqueue(backing.subarray(8, 8 + bytes.length));
          controller.close();
        },
      }),
      { headers: { 'content-type': 'text/event-stream' } },
    )) as typeof fetch;
  const f = setup(
    'https://generativelanguage.googleapis.com/v1beta',
    transport,
  );
  const result = await f.facade.completeSimple(f.model, context(), {
    maxRetries: 0,
  });
  expect(result.stopReason).toBe('stop');
  expect(result.content).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ type: 'text', text: 'hello' }),
    ]),
  );
});

it('matches the SDK URL for an unversioned custom Gemini base', async () => {
  const server = createServer((_req, res) => res.end('{}'));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    let observed = '';
    const transport = (async (req: Request) => fetch(req)) as typeof fetch;
    const f = setup(`http://127.0.0.1:${address.port}`, transport);
    const guarded = f.guard.bind(f.op);
    await runGoogleStream(
      'google-generative-ai',
      f.model,
      context(),
      {
        apiKey: 'key',
        maxRetries: 0,
        fetch: (req: Request) => {
          observed = req.url;
          return guarded.fetch(req);
        },
      },
      true,
    ).result();
    expect(observed).toBe(f.op.destination);
    expect(f.events).toContain('allow:1');
  } finally {
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});

it('denies the SDK ADC sentinel before accessing credentials', async () => {
  const model = {
    ...googleVertexProvider().getModels()[0],
    baseUrl: 'https://provider.example/v1',
  } as never;
  const guardedFetch = jest.fn(async () => new Response('unexpected'));
  const result = await runGoogleStream(
    'google-vertex',
    model,
    context(),
    {
      apiKey: 'gcp-vertex-credentials',
      fetch: guardedFetch as unknown as typeof fetch,
      maxRetries: 0,
      env: {
        GOOGLE_CLOUD_PROJECT: 'test-project',
        GOOGLE_CLOUD_LOCATION: 'us-central1',
        GOOGLE_APPLICATION_CREDENTIALS: '/no-such-credentials.json',
      },
    },
    true,
  ).result();
  expect(result.stopReason).toBe('error');
  expect(result.errorMessage).toContain('ADC is not a certified transport');
  expect(guardedFetch).not.toHaveBeenCalled();
});

it('blocks ADC credential traffic outside the guarded transport', async () => {
  const hits: string[] = [];
  const server = createServer((req, res) => {
    hits.push(req.url ?? '');
    req.resume();
    if (req.url === '/subject') {
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end('probe-subject');
    } else {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(
        JSON.stringify({
          access_token: 'fake',
          token_type: 'Bearer',
          expires_in: 3600,
        }),
      );
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const dir = await mkdtemp(join(tmpdir(), 'google-adc-'));
  const path = join(dir, 'adc-probe.json');
  try {
    const address = server.address();
    if (!address || typeof address === 'string') throw new Error('no port');
    const origin = `http://127.0.0.1:${address.port}`;
    await writeFile(
      path,
      JSON.stringify({
        type: 'external_account',
        audience:
          '//iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/pool/providers/provider',
        subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
        token_url: `${origin}/token`,
        credential_source: {
          url: `${origin}/subject`,
          format: { type: 'text' },
        },
      }),
    );
    const model = {
      ...googleVertexProvider().getModels()[0],
      baseUrl: `${origin}/v1`,
    } as Model<'google-vertex'> & { baseUrl: string };
    const guardedFetch = jest.fn(async () => new Response('unexpected'));
    const env = {
      GOOGLE_CLOUD_PROJECT: 'test-project',
      GOOGLE_CLOUD_LOCATION: 'us-central1',
      GOOGLE_APPLICATION_CREDENTIALS: path,
    };
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
      operation: 'completeSimple',
      api: 'google-vertex',
      destination: googleVertex.destination(model, env),
      credentialScope: { kind: 'user', id: 'user:default/alice' },
      credentialGeneration: '1',
      controller: new AbortController(),
    };
    const events: string[] = [];
    const journal = {
      recordDecisionAndIntent: async (
        _fence: unknown,
        event: { decision: string; operation: string },
      ) => {
        events.push(`${event.decision}:${event.operation}`);
        return '1';
      },
      recordOutcome: async (
        _fence: unknown,
        _id: string,
        outcome: { status: string },
      ) => {
        events.push(`outcome:${outcome.status}`);
      },
      recordRecovery: async () => {},
      read: async () => ({ items: [] }),
    };
    const guard = createModelOperationGuard({
      providers,
      journal: journal as never,
      transport: guardedFetch as unknown as typeof fetch,
      recheck: async () => true,
    });
    const facade = createGuardedModelOperations({
      providers,
      guard,
      journal: journal as never,
      resolve: () => ({
        model,
        operation: op,
        authority: {
          kind: 'apiKey',
          apiKey: 'gcp-vertex-credentials',
          env,
        },
      }),
    });
    const result = await facade.completeSimple(model, context(), {
      maxRetries: 0,
    });
    expect(result.stopReason).toBe('error');
    expect(result.errorMessage).toContain('ADC is not a certified transport');
    // No credential exchange traffic of any kind left the process.
    expect(hits).toEqual([]);
    expect(guardedFetch).not.toHaveBeenCalled();
  } finally {
    await unlink(path).catch(() => undefined);
    await rm(dir, { recursive: true, force: true });
    server.closeAllConnections();
    await new Promise<void>(resolve => server.close(() => resolve()));
  }
});
