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

interface StreamOptions {
  readonly fetch: unknown;
  readonly signal: unknown;
  readonly onPayload: unknown;
  readonly onProviderStreamEvent: unknown;
  readonly onResponse: unknown;
  [key: string]: unknown;
}

type HostJob = {
  readonly port: MessagePort;
  finished: boolean;
};

/**
 * The host side of the isolated Google worker transport.
 *
 * Owns one dedicated worker thread whose global fetch is shimmed for its
 * lifetime. Each stream ships as one job with its own transferred
 * {@link MessagePort}; the job's guarded fetch closure — carrying that
 * stream's authority, journal and recheck — stays on the host and serves the
 * worker's fetch attempts over that port. Authority is therefore bound per
 * async stream, never worker-global: two concurrent streams cannot reach
 * each other's credentials or journals, and a worker that dies only fails
 * its own in-flight streams.
 */
class GoogleWorkerRuntime {
  #worker: Worker | undefined;
  #jobs = new Set<HostJob>();
  #starting: Promise<Worker> | undefined;

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
    const worker = this.#worker;
    this.#worker = undefined;
    this.#starting = undefined;
    if (worker) await worker.terminate();
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

  /**
   * Graceful shutdown: aborts in-flight streams and waits briefly for them
   * to settle before terminating the worker. Aborted streams report unknown
   * remote outcomes; no success is ever claimed for them.
   */
  async close(): Promise<void> {
    const worker = this.#worker;
    if (worker) {
      for (const job of this.#jobs) {
        try {
          job.port.postMessage({ type: 'abort' });
        } catch {
          /* already closed */
        }
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    await this.terminate();
  }

  async #ensureWorker(): Promise<Worker> {
    if (this.#worker) return this.#worker;
    if (!this.#starting) {
      this.#starting = new Promise<Worker>((resolve, reject) => {
        const worker = new Worker(GOOGLE_WORKER_SOURCE, { eval: true });
        worker.unref();
        worker.once('error', error => {
          this.#worker = undefined;
          this.#starting = undefined;
          reject(error);
        });
        // A worker that exits for any reason fails its in-flight streams;
        // the next stream lazily starts a fresh worker.
        worker.on('exit', () => {
          this.#worker = undefined;
          this.#starting = undefined;
          for (const job of [...this.#jobs]) {
            if (!job.finished) {
              job.finished = true;
              job.port.emit(
                'close',
                new Error('Google worker exited unexpectedly'),
              );
            }
          }
        });
        resolve(worker);
      });
    }
    const worker = await this.#starting;
    this.#worker = worker;
    return worker;
  }

  async #run(
    api: GoogleAdapterId,
    model: AnyModel,
    context: unknown,
    options: unknown,
    simple: boolean,
    output: AssistantMessageEventStream,
  ): Promise<void> {
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
    if (api === 'google-vertex' && typeof rest.apiKey !== 'string') {
      // ADC would exchange service-account credentials for tokens through
      // paths this transport cannot certify; it fails closed here instead.
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

    const worker = await this.#ensureWorker();
    const { port1, port2 } = new MessageChannel();
    const job: HostJob = { port: port1, finished: false };
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

    if (signal instanceof AbortSignal) {
      onAbort = () => port1.postMessage({ type: 'abort' });
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }

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

    const inflight = new Map<string, AbortController>();
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
      const abort = new AbortController();
      inflight.set(id, abort);
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
        inflight.delete(id);
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
        inflight.delete(id);
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
        send({ type: 'fetch-end', id });
        return;
      }
      const reader = response.body.getReader();
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          send({ type: 'fetch-chunk', id, value: value.buffer }, [
            value.buffer,
          ]);
        }
        send({ type: 'fetch-end', id });
      } catch (error) {
        send({
          type: 'fetch-error',
          id,
          message: String((error as Error)?.message ?? error),
          name: (error as Error)?.name ?? 'Error',
        });
      }
    };

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
            void Promise.resolve(
              streamCallback(msg.event, structuredClone(payload.model)),
            ).catch(() => undefined);
          }
          break;
        }
        case 'onPayload':
          void (async () => {
            let next: unknown;
            let has = false;
            try {
              const payloadCallback = onPayload as
                | ((params: unknown, model: unknown) => unknown)
                | undefined;
              if (typeof payloadCallback === 'function') {
                next = await payloadCallback(
                  msg.params,
                  structuredClone(msg.model ?? payload.model),
                );
                has = next !== undefined;
              }
            } finally {
              if (!finished) {
                port1.postMessage({
                  type: 'onPayload-result',
                  id: msg.id,
                  has,
                  params: has ? next : null,
                });
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
          inflight.get(msg.id as string)?.abort();
          inflight.delete(msg.id as string);
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

/**
 * Liveness and enforcement-boundary probe for the shared worker.
 *
 * @internal
 */
export function pingGoogleWorker(): Promise<{
  shimInstalled: boolean;
  shimCalls: number;
}> {
  return runtime.ping();
}

/**
 * Rehearses the unattributed-fetch denial in the shared worker.
 *
 * @internal
 */
export function rehearseUnattributedGoogleFetch(
  url: string,
): Promise<{ denied: boolean; message: string }> {
  return runtime.rehearseUnattributedFetch(url);
}
