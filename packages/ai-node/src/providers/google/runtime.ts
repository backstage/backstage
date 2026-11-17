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

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { MessageChannel, Worker, type MessagePort } from 'node:worker_threads';
import {
  createAssistantMessageEventStream,
  type AnyModel,
  type AssistantMessageEventStream,
} from '@earendil-works/pi-ai';
import { GOOGLE_WORKER_SOURCE } from './worker';

/** The two pinned Google adapter families served by this worker transport. */
export type GoogleAdapterId = 'google-generative-ai' | 'google-vertex';

/**
 * Resolves the pinned pi-ai adapter module inside the installed
 * `node_modules` tree, by walking up from this file. The worker loads it by
 * absolute URL: bare-specifier resolution is not available for stringified
 * worker sources, and the pinned installation is the only adapter this
 * transport may run.
 */
function resolvePinnedAdapterUrl(id: GoogleAdapterId): string {
  const relative = join(
    '@earendil-works',
    'pi-ai',
    'dist',
    'api',
    id === 'google-generative-ai'
      ? 'google-generative-ai.js'
      : 'google-vertex.js',
  );
  let dir = dirname(fileURLToPath(import.meta.url));
  for (;;) {
    const candidate = join(dir, 'node_modules', relative);
    if (existsSync(candidate)) return pathToFileURL(candidate).href;
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        'Cannot locate the pinned pi-ai Google adapter for the isolated worker transport',
      );
    }
    dir = parent;
  }
}

const ADAPTER_URLS: Readonly<Record<GoogleAdapterId, string>> = Object.freeze({
  'google-generative-ai': resolvePinnedAdapterUrl('google-generative-ai'),
  'google-vertex': resolvePinnedAdapterUrl('google-vertex'),
});

/** The pinned adapter's marker for "use Vertex ADC instead of a key". */
const VERTEX_ADC_SENTINEL = 'gcp-vertex-credentials';

/**
 * Mirrors the pinned adapter's own no-key semantics: a blank key, the
 * `gcp-vertex-credentials` marker, or a `<placeholder>` all mean "fall back
 * to ADC", which is not a certified credential transport. They are rejected
 * at authority resolution, before any SDK code can run.
 */
function isCertifiedVertexApiKey(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  const key = value.trim();
  return !!key && key !== VERTEX_ADC_SENTINEL && !/^<[^>]+>$/.test(key);
}

interface StreamOptions {
  readonly fetch: unknown;
  readonly signal: unknown;
  readonly onPayload: unknown;
  readonly onProviderStreamEvent: unknown;
  readonly onResponse: unknown;
  [key: string]: unknown;
}

/** One in-flight host-side fetch belonging to a job. */
type HostFetch = Readonly<{
  abort(): void;
  cancel(): void;
}>;

/**
 * Host-side bookkeeping for one stream job. `fail` is installed by the run
 * that created the job; worker exit and shutdown both act on the job through
 * this record so nothing can remain pending or complete after they return.
 */
type HostJob = {
  readonly port: MessagePort;
  finished: boolean;
  readonly inflight: Map<string, HostFetch>;
  fail?(message: string): void;
};

/**
 * The host side of the isolated Google worker transport.
 *
 * Failure discipline at the worker boundary: the boundary fails exactly like
 * the guard does — closed, journaled, bounded. Every failure path (worker
 * death, callback throw, non-transferable callback result, transport abort,
 * shutdown concurrent with any of them) settles the affected stream with an
 * error event, aborts its in-flight host fetches so the guard records a
 * cancelled or unknown outcome, and never lets a request reach the wire
 * after the failure. Shutdown coordinates worker startup, in-flight jobs and
 * their fetches: nothing starts or completes after it returns.
 */
class GoogleWorkerRuntime {
  #worker: Worker | undefined;
  #starting: Promise<Worker> | undefined;
  readonly #jobs = new Set<HostJob>();
  #generation = 0;
  #shuttingDown = false;

  stream(
    api: GoogleAdapterId,
    model: AnyModel,
    context: unknown,
    options: unknown,
    simple: boolean,
  ): AssistantMessageEventStream {
    const output = createAssistantMessageEventStream();
    void this.#run(api, model, context, options, simple, output).catch(
      error => {
        pushWorkerError(output, model, error);
      },
    );
    return output;
  }

  /** Emergency stop: terminate the worker without draining. */
  async terminate(): Promise<void> {
    await this.#shutdown('immediate');
  }

  /**
   * Graceful shutdown: aborts in-flight streams and waits briefly for them
   * to settle before terminating the worker. Aborted streams report unknown
   * remote outcomes; no success is ever claimed for them, and nothing starts
   * or completes after this returns.
   */
  async close(): Promise<void> {
    await this.#shutdown('graceful');
  }

  async #shutdown(mode: 'graceful' | 'immediate'): Promise<void> {
    // New streams fail immediately while shutdown is in progress.
    this.#shuttingDown = true;
    const generation = this.#generation;
    // A worker still being created is awaited so it cannot be published —
    // and used — after shutdown returns.
    if (this.#starting) {
      await this.#starting.catch(() => undefined);
    }
    const worker = this.#worker;
    if (worker && mode === 'graceful') {
      for (const job of this.#jobs) {
        try {
          job.port.postMessage({ type: 'abort' });
        } catch {
          /* already closed */
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    this.#worker = undefined;
    this.#starting = undefined;
    this.#generation = generation + 1;
    if (worker) await worker.terminate();
    // Whatever the abort window did not settle is failed now: no stream may
    // remain pending, and every in-flight host fetch is aborted so the guard
    // records its outcome instead of hanging.
    for (const job of [...this.#jobs]) {
      this.#failJob(job, 'Google worker shut down');
    }
    this.#shuttingDown = false;
  }

  #failJob(job: HostJob, message: string): void {
    if (job.finished) return;
    job.finished = true;
    this.#jobs.delete(job);
    for (const fetch of job.inflight.values()) {
      fetch.abort();
      fetch.cancel();
    }
    job.inflight.clear();
    try {
      job.port.close();
    } catch {
      /* already closed */
    }
    job.fail?.(message);
  }

  async #ensureWorker(): Promise<Worker> {
    if (this.#worker) return this.#worker;
    if (!this.#starting) {
      this.#starting = new Promise<Worker>((resolve, reject) => {
        const worker = new Worker(GOOGLE_WORKER_SOURCE, { eval: true });
        worker.unref();
        worker.once('error', error => {
          this.#discardWorker(worker);
          reject(error);
        });
        // A worker that exits for any reason fails its in-flight streams
        // and aborts their host fetches; the next stream starts fresh.
        worker.on('exit', () => {
          this.#discardWorker(worker);
          for (const job of [...this.#jobs]) {
            this.#failJob(job, 'Google worker exited unexpectedly');
          }
        });
        resolve(worker);
      });
    }
    const worker = await this.#starting;
    this.#worker = worker;
    return worker;
  }

  #discardWorker(worker: Worker): void {
    if (this.#worker === worker) this.#worker = undefined;
    if (this.#starting) {
      const pending = this.#starting;
      this.#starting = undefined;
      void pending.catch(() => undefined);
    }
  }

  async #run(
    api: GoogleAdapterId,
    model: AnyModel,
    context: unknown,
    options: unknown,
    simple: boolean,
    output: AssistantMessageEventStream,
  ): Promise<void> {
    if (this.#shuttingDown) {
      throw new Error('Google worker transport is shutting down');
    }
    const opts = (options ?? {}) as StreamOptions;
    const guardedFetch = opts.fetch;
    if (typeof guardedFetch !== 'function') {
      throw new Error('The Google worker transport requires the guarded fetch');
    }
    const rest: Record<string, unknown> = { ...opts };
    delete rest.fetch;
    const signal = opts.signal;
    const onPayload = opts.onPayload;
    const onProviderStreamEvent = opts.onProviderStreamEvent;
    delete rest.signal;
    delete rest.onPayload;
    delete rest.onProviderStreamEvent;
    if (typeof opts.onResponse === 'function') {
      throw new Error(
        'onResponse is not supported by the Google worker transport',
      );
    }
    delete rest.onResponse;
    if (api === 'google-vertex' && !isCertifiedVertexApiKey(rest.apiKey)) {
      // Every no-key spelling the SDK treats as absent would fall back to
      // ADC and exchange service-account credentials outside this
      // transport. Fail closed before any SDK code runs.
      throw new Error(
        'google-vertex requires an API key credential; ADC is not a certified transport',
      );
    }
    let payload: {
      model: unknown;
      context: unknown;
      options: unknown;
    };
    try {
      payload = {
        model: structuredClone(model),
        context: structuredClone(context),
        options: structuredClone(rest),
      };
    } catch {
      throw new Error(
        'Google worker payload is not transferable across the worker boundary',
      );
    }

    // The generation captures this run's worker lifetime: if shutdown (or a
    // replacement worker) intervened while startup was awaited, the job is
    // refused before it can send.
    const generation = this.#generation;
    const worker = await this.#ensureWorker();
    if (this.#shuttingDown || generation !== this.#generation) {
      throw new Error('Google worker transport shut down before dispatch');
    }

    const { port1, port2 } = new MessageChannel();
    const job: HostJob = { port: port1, finished: false, inflight: new Map() };
    this.#jobs.add(job);
    let finished = false;
    let onAbort: (() => void) | undefined;
    const settle = () => {
      if (finished) return;
      finished = true;
      job.finished = true;
      this.#jobs.delete(job);
      if (onAbort && signal instanceof AbortSignal) {
        signal.removeEventListener('abort', onAbort);
      }
      // Every settle path bounds the job's in-flight host fetches: a stream
      // that ends for any reason (including its port closing with a dead
      // worker) aborts them so the guard records an outcome.
      for (const fetch of job.inflight.values()) {
        fetch.abort();
        fetch.cancel();
      }
      job.inflight.clear();
      try {
        port1.close();
      } catch {
        /* already closed */
      }
    };
    const fail = (message: string) => {
      if (finished) return;
      pushWorkerError(output, model, new Error(message));
      settle();
    };
    job.fail = fail;

    if (signal instanceof AbortSignal) {
      onAbort = () => {
        try {
          port1.postMessage({ type: 'abort' });
        } catch {
          /* already closed */
        }
      };
      if (signal.aborted) {
        // An already-aborted caller never dispatches: no job is posted and
        // no fetch can reach the wire.
        fail('Google worker stream aborted before dispatch');
        return;
      }
      signal.addEventListener('abort', onAbort, { once: true });
    }

    const handleFetch = async (message: Record<string, unknown>) => {
      const id = message.id as string;
      const send = (
        m: Record<string, unknown>,
        transfer?: Parameters<MessagePort['postMessage']>[1],
      ) => {
        try {
          port1.postMessage(m, transfer);
        } catch {
          /* the job port is already closed */
        }
      };
      // A settled job (worker exit, shutdown, stream failure) never sends.
      if (job.finished) {
        send({
          type: 'fetch-error',
          id,
          message: 'Google worker stream is no longer active',
          name: 'Error',
        });
        return;
      }
      const abort = new AbortController();
      let cancelReader: () => void = () => undefined;
      const inflight: HostFetch = {
        abort: () => abort.abort(),
        cancel: () => cancelReader(),
      };
      job.inflight.set(id, inflight);
      abort.signal.addEventListener('abort', () => cancelReader());
      // The caller's own signal also aborts the host fetch, so the guard
      // refuses to send an already-aborted attempt and cancels a streaming
      // one, exactly as it would without the worker boundary.
      if (signal instanceof AbortSignal) {
        if (signal.aborted) abort.abort();
        else
          signal.addEventListener('abort', () => abort.abort(), {
            once: true,
          });
      }
      let request: Request;
      try {
        request = new Request(message.url as string, {
          method: message.method as string,
          headers: new Headers(
            message.headers as ConstructorParameters<typeof Headers>[0],
          ),
          body: (message.body as ArrayBuffer | null) ?? undefined,
          redirect: 'manual',
          signal: abort.signal,
        });
      } catch (error) {
        job.inflight.delete(id);
        send({
          type: 'fetch-error',
          id,
          message: String((error as Error).message),
          name: 'Error',
        });
        return;
      }
      let response: Response;
      try {
        response = await (guardedFetch as typeof fetch)(request);
      } catch (error) {
        job.inflight.delete(id);
        send({
          type: 'fetch-error',
          id,
          message: String((error as Error)?.message ?? error),
          name: (error as Error)?.name ?? 'Error',
        });
        return;
      }
      send({
        type: 'fetch-response',
        id,
        status: response.status,
        statusText: response.statusText,
        headers: [...response.headers],
        hasBody: response.body !== null,
      });
      if (!response.body) {
        job.inflight.delete(id);
        send({ type: 'fetch-end', id });
        return;
      }
      const reader = response.body.getReader();
      cancelReader = () => {
        void reader.cancel().catch(() => undefined);
      };
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          // Send exactly the chunk's view: the underlying buffer may be
          // larger and shared, so a subarray must not be transferred as its
          // whole backing buffer.
          const bytes = value.slice();
          send({ type: 'fetch-chunk', id, value: bytes.buffer }, [
            bytes.buffer,
          ]);
        }
        job.inflight.delete(id);
        send({ type: 'fetch-end', id });
      } catch (error) {
        job.inflight.delete(id);
        send({
          type: 'fetch-error',
          id,
          message: String((error as Error)?.message ?? error),
          name: (error as Error)?.name ?? 'Error',
        });
      }
    };

    worker.postMessage(
      {
        type: 'job',
        adapterUrl: ADAPTER_URLS[api],
        simple,
        port: port2,
        ...payload,
        callbacks: {
          onPayload: typeof onPayload === 'function',
          onProviderStreamEvent: typeof onProviderStreamEvent === 'function',
        },
      },
      [port2],
    );

    port1.on('message', (message: unknown) => {
      const msg = message as Record<string, unknown>;
      switch (msg.type) {
        case 'event':
          if (!finished)
            output.push(msg.event as Parameters<typeof output.push>[0]);
          break;
        case 'finished':
          settle();
          output.end();
          break;
        case 'jobError':
          fail(`Google worker stream failed: ${msg.message as string}`);
          break;
        case 'providerEvent': {
          const streamCallback = onProviderStreamEvent as
            | ((event: unknown, model: unknown) => unknown)
            | undefined;
          if (streamCallback) {
            try {
              void Promise.resolve(
                streamCallback(msg.event, structuredClone(payload.model)),
              ).catch(() => undefined);
            } catch {
              /* an observer failure never affects the stream */
            }
          }
          break;
        }
        case 'onPayload':
          void (async () => {
            try {
              const payloadCallback = onPayload as
                | ((params: unknown, model: unknown) => unknown)
                | undefined;
              let next: unknown;
              if (typeof payloadCallback === 'function') {
                next = await payloadCallback(
                  msg.params,
                  structuredClone(msg.model ?? payload.model),
                );
              }
              // A non-transferable result throws here and fails the job
              // before any send; the original payload is never a fallback.
              port1.postMessage({
                type: 'onPayload-result',
                id: msg.id,
                has: next !== undefined,
                params: next ?? null,
              });
            } catch (error) {
              try {
                port1.postMessage({
                  type: 'onPayload-error',
                  id: msg.id,
                  message: String((error as Error)?.message ?? error),
                });
              } catch {
                /* the job port is already closed */
              }
            }
          })();
          break;
        case 'fetch':
          void handleFetch(msg);
          break;
        case 'fetch-abort':
          // The worker side gave up on this fetch: cancel the host-side
          // transport so the guard settles the attempt instead of hanging.
          {
            const inflight = job.inflight.get(msg.id as string);
            inflight?.abort();
            inflight?.cancel();
            job.inflight.delete(msg.id as string);
          }
          break;
        default:
          break;
      }
    });
    port1.on('close', () => {
      if (!finished) {
        fail('Google worker stream closed unexpectedly');
      }
    });
  }

  /**
   * Liveness and enforcement-boundary probe: confirms the worker's global
   * fetch is the installed shim and reports how many attempts it has
   * intercepted.
   */
  async ping(): Promise<{ shimInstalled: boolean; shimCalls: number }> {
    const worker = await this.#ensureWorker();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Google worker ping timed out')),
        5000,
      );
      worker.once('message', (message: Record<string, unknown>) => {
        if (message.type !== 'pong') return;
        clearTimeout(timer);
        resolve({
          shimInstalled: message.shimInstalled === true,
          shimCalls: message.shimCalls as number,
        });
      });
      worker.postMessage({ type: 'ping' });
    });
  }

  /**
   * Rehearses the unattributed-fetch denial: performs one fetch in the
   * worker outside any stream binding. It must be denied; a resolution
   * would mean the enforcement boundary has failed.
   */
  async rehearseUnattributedFetch(
    url: string,
  ): Promise<{ denied: boolean; message: string }> {
    const worker = await this.#ensureWorker();
    return new Promise((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('Google worker rehearsal timed out')),
        5000,
      );
      worker.once('message', (message: Record<string, unknown>) => {
        if (message.type !== 'bareFetchResult') return;
        clearTimeout(timer);
        resolve({
          denied: message.denied === true,
          message: String(message.message ?? ''),
        });
      });
      worker.postMessage({ type: 'testBareFetch', url });
    });
  }
}

function pushWorkerError(
  output: AssistantMessageEventStream,
  model: AnyModel,
  error: Error,
): void {
  output.push({
    type: 'error',
    reason: 'error',
    error: {
      role: 'assistant',
      content: [],
      api: model.api as never,
      provider: model.provider,
      model: model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        totalTokens: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: 'error',
      errorMessage: error.message,
      timestamp: Date.now(),
    },
  });
  output.end();
}

const runtime = new GoogleWorkerRuntime();

/**
 * Runs one pinned Google adapter stream inside the isolated worker and
 * relays its events back as an {@link AssistantMessageEventStream}.
 *
 * @internal
 */
export function runGoogleStream(
  api: GoogleAdapterId,
  model: AnyModel,
  context: unknown,
  options: unknown,
  simple: boolean,
): AssistantMessageEventStream {
  return runtime.stream(api, model, context, options, simple);
}

/**
 * Gracefully stops the shared Google worker: in-flight streams are aborted
 * and settle with unknown remote outcomes. A later stream starts a fresh
 * worker.
 *
 * @internal
 */
export async function closeGoogleWorker(): Promise<void> {
  await runtime.close();
}

/**
 * Terminates the shared Google worker immediately, rehearsing worker loss:
 * in-flight streams fail without claiming their remote outcomes.
 *
 * @internal
 */
export async function terminateGoogleWorker(): Promise<void> {
  await runtime.terminate();
}

/** Liveness and enforcement-boundary probe for the shared worker. */
export function pingGoogleWorker(): Promise<{
  shimInstalled: boolean;
  shimCalls: number;
}> {
  return runtime.ping();
}

/** Rehearses the unattributed-fetch denial in the shared worker. */
export function rehearseUnattributedGoogleFetch(
  url: string,
): Promise<{ denied: boolean; message: string }> {
  return runtime.rehearseUnattributedFetch(url);
}
