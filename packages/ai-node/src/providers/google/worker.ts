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

import type { MessagePort } from 'node:worker_threads';

/**
 * The Google worker entry point.
 *
 * @remarks
 *
 * Runs inside a dedicated worker thread, stringified and evaluated there, so
 * it must be entirely self-contained: no imports of host modules and no
 * references to module-scope bindings, only `node:` builtins loaded through
 * dynamic import and platform globals. Everything it needs arrives through
 * messages on the parent port and per-job ports.
 *
 * The pinned Google SDK has no request-scoped transport hook: it calls the
 * ambient global fetch on every actual HTTP attempt. This entry therefore
 * replaces the worker's `globalThis.fetch` with a shim for the worker's
 * lifetime, installed before any SDK code is loaded. Each asynchronous job
 * runs inside its own `AsyncLocalStorage` context carrying a per-stream
 * authority binding (the job's own message port), so concurrent streams can
 * never cross their authorizations: a fetch that is not executing inside a
 * job's context has no binding and fails closed.
 *
 * Failure discipline mirrors the host guard: a caller payload callback that
 * throws or returns a non-transferable value fails the whole job before any
 * send — the original payload is never a fallback — and cancellation stays
 * connected for the full lifetime of a response body, not just until
 * headers arrive.
 *
 * @internal
 */
export async function googleWorkerEntry(): Promise<void> {
  const { parentPort } = await import('node:worker_threads');
  const { AsyncLocalStorage } = await import('node:async_hooks');
  if (!parentPort) throw new Error('Google worker requires a parent port');

  type PinnedAdapter = {
    stream: (model: unknown, context: unknown, options: unknown) => object;
    streamSimple: (
      model: unknown,
      context: unknown,
      options: unknown,
    ) => object;
  };
  type FetchEntry = {
    /** `pending` until response headers arrive, then `streaming`. */
    phase: 'pending' | 'streaming';
    resolve?: (response: Response) => void;
    reject?: (error: Error) => void;
    controller?: ReadableStreamDefaultController;
  };
  type PayloadEntry = {
    resolve(params: unknown): void;
    reject(error: Error): void;
  };
  type JobBinding = {
    port: MessagePort;
    controller: AbortController;
    nextId: number;
    fetches: Map<string, FetchEntry>;
    payloads: Map<string, PayloadEntry>;
  };

  const store = new AsyncLocalStorage<JobBinding>();
  const adapters = new Map<string, Promise<PinnedAdapter>>();
  const loadAdapter = (url: string): Promise<PinnedAdapter> => {
    let loaded = adapters.get(url);
    if (!loaded) {
      loaded = import(url) as Promise<PinnedAdapter>;
      adapters.set(url, loaded);
    }
    return loaded;
  };

  const abortError = (): Error => {
    const error = new Error('Google worker fetch aborted');
    error.name = 'AbortError';
    return error;
  };

  // The lifetime global-fetch shim: the only network path the SDK can take
  // inside this worker. Unattributed calls (outside any job's async context)
  // are denied rather than delegated.
  let shimCalls = 0;
  const shim: typeof globalThis.fetch = async (input, init) => {
    shimCalls += 1;
    const binding = store.getStore();
    if (!binding) {
      throw new Error(
        'Unattributed Google worker fetch denied: no active stream authority binding',
      );
    }
    const request = new Request(input, init);
    const body = request.body ? await request.arrayBuffer() : null;
    const id = `f${binding.nextId++}`;
    const entry: FetchEntry = { phase: 'pending' };
    binding.fetches.set(id, entry);
    const settled = new Promise<Response>((resolve, reject) => {
      entry.resolve = resolve;
      entry.reject = reject;
    });
    binding.port.postMessage({
      type: 'fetch',
      id,
      url: request.url,
      method: request.method,
      headers: [...request.headers],
      body,
    });
    let signal: AbortSignal | undefined;
    if (
      init &&
      typeof init === 'object' &&
      init.signal instanceof AbortSignal
    ) {
      signal = init.signal;
    } else if (input instanceof Request) {
      signal = input.signal;
    }
    if (signal) {
      const onAbort = () => {
        // Cancellation remains live for the response stream's whole
        // lifetime: a post-header abort still cancels the host transport
        // and errors the streamed body instead of leaving it pending.
        const current = binding.fetches.get(id);
        if (!current) return;
        binding.fetches.delete(id);
        binding.port.postMessage({ type: 'fetch-abort', id });
        if (current.phase === 'pending') {
          current.reject?.(abortError());
        } else {
          current.controller?.error(abortError());
        }
      };
      if (signal.aborted) onAbort();
      else signal.addEventListener('abort', onAbort, { once: true });
    }
    return settled;
  };
  globalThis.fetch = shim;

  function handleJobMessage(binding: JobBinding, message: unknown): void {
    const msg = message as Record<string, unknown>;
    switch (msg.type) {
      case 'abort':
        binding.controller.abort();
        break;
      case 'onPayload-result': {
        const entry = binding.payloads.get(msg.id as string);
        if (entry) {
          binding.payloads.delete(msg.id as string);
          entry.resolve(msg.has === true ? msg.params : undefined);
        }
        break;
      }
      case 'onPayload-error': {
        // The caller callback failed (threw or returned a non-transferable
        // value): the job fails closed before any send.
        const entry = binding.payloads.get(msg.id as string);
        if (entry) {
          binding.payloads.delete(msg.id as string);
          entry.reject(new Error(msg.message as string));
        }
        break;
      }
      case 'fetch-response': {
        const id = msg.id as string;
        const entry = binding.fetches.get(id);
        if (!entry) break;
        let body: ReadableStream<Uint8Array> | null = null;
        if (msg.hasBody === true) {
          entry.phase = 'streaming';
          body = new ReadableStream<Uint8Array>({
            start(controller) {
              entry.controller = controller;
            },
            cancel() {
              binding.port.postMessage({ type: 'fetch-abort', id });
            },
          });
        } else {
          binding.fetches.delete(id);
        }
        entry.resolve?.(
          new Response(body, {
            status: msg.status as number,
            statusText: msg.statusText as string,
            headers: msg.headers as ConstructorParameters<typeof Headers>[0],
          }),
        );
        break;
      }
      case 'fetch-chunk': {
        const entry = binding.fetches.get(msg.id as string);
        entry?.controller?.enqueue(new Uint8Array(msg.value as ArrayBuffer));
        break;
      }
      case 'fetch-end': {
        const entry = binding.fetches.get(msg.id as string);
        if (entry) {
          binding.fetches.delete(msg.id as string);
          entry.controller?.close();
        }
        break;
      }
      case 'fetch-error': {
        const id = msg.id as string;
        const entry = binding.fetches.get(id);
        if (entry) {
          binding.fetches.delete(id);
          const error = new Error(msg.message as string);
          error.name = (msg.name as string) ?? 'Error';
          if (entry.phase === 'pending') {
            entry.reject?.(error);
          } else {
            entry.controller?.error(error);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  async function runJob(message: Record<string, unknown>): Promise<void> {
    const adapter = await loadAdapter(message.adapterUrl as string);
    const binding: JobBinding = {
      port: message.port as MessagePort,
      controller: new AbortController(),
      nextId: 1,
      fetches: new Map(),
      payloads: new Map(),
    };
    binding.port.on('message', m => handleJobMessage(binding, m));
    const options: Record<string, unknown> = {
      ...(message.options as Record<string, unknown>),
      signal: binding.controller.signal,
    };
    const callbacks = message.callbacks as
      | { onPayload: boolean; onProviderStreamEvent: boolean }
      | undefined;
    if (callbacks?.onPayload) {
      options.onPayload = (params: unknown, model: unknown) =>
        new Promise<unknown>((resolve, reject) => {
          const id = `p${binding.nextId++}`;
          // Transport-owned config (the abort signal and any per-request
          // http options) never crosses the RPC and is restored afterwards:
          // the caller callback may shape generation fields, not transport
          // internals.
          const source = params as { config?: Record<string, unknown> };
          const protectedConfig = source?.config
            ? {
                abortSignal: source.config.abortSignal,
                httpOptions: source.config.httpOptions,
              }
            : undefined;
          const portable = { ...(params as object) } as {
            config?: Record<string, unknown>;
          };
          if (portable.config) {
            portable.config = { ...portable.config };
            delete portable.config.abortSignal;
            delete portable.config.httpOptions;
          }
          binding.port.postMessage({
            type: 'onPayload',
            id,
            params: portable,
            model,
          });
          binding.payloads.set(id, {
            resolve: (next: unknown) => {
              if (next === undefined) {
                resolve(params);
                return;
              }
              const merged = { ...(next as object) } as {
                config?: Record<string, unknown>;
              };
              if (protectedConfig || merged.config) {
                merged.config = {
                  ...(merged.config ?? {}),
                  ...(protectedConfig ?? {}),
                };
              }
              resolve(merged);
            },
            reject: (error: Error) => reject(error),
          });
        });
    }
    if (callbacks?.onProviderStreamEvent) {
      options.onProviderStreamEvent = (event: unknown, model: unknown) => {
        binding.port.postMessage({
          type: 'providerEvent',
          event,
          model,
        });
      };
    }
    // The per-stream authority binding: everything the pinned adapter and
    // SDK do from here — including every ambient fetch attempt — executes
    // inside this async context and can only reach this job's port.
    store.run(binding, async () => {
      try {
        const native = (
          message.simple === true ? adapter.streamSimple : adapter.stream
        )(message.model, message.context, options);
        for await (const event of native as AsyncIterable<unknown>) {
          binding.port.postMessage({ type: 'event', event });
        }
        binding.port.postMessage({ type: 'finished' });
        binding.port.close();
      } catch (error) {
        binding.port.postMessage({
          type: 'jobError',
          message: String((error as Error)?.message ?? error),
          name: (error as Error)?.name ?? 'Error',
        });
        binding.port.close();
      }
    });
  }

  parentPort.on('message', (message: unknown) => {
    const msg = message as Record<string, unknown>;
    switch (msg.type) {
      case 'job':
        void runJob(msg).catch(error => {
          parentPort!.postMessage({
            type: 'fatal',
            message: String((error as Error)?.message ?? error),
          });
        });
        break;
      case 'ping':
        parentPort!.postMessage({
          type: 'pong',
          shimInstalled: globalThis.fetch === shim,
          shimCalls,
        });
        break;
      case 'testBareFetch':
        void (async () => {
          try {
            await globalThis.fetch(msg.url as string);
            parentPort!.postMessage({ type: 'bareFetchResult', denied: false });
          } catch (error) {
            parentPort!.postMessage({
              type: 'bareFetchResult',
              denied: true,
              message: String((error as Error)?.message ?? error),
            });
          }
        })();
        break;
      default:
        break;
    }
  });
}

/** @internal */
export const GOOGLE_WORKER_SOURCE = `(${googleWorkerEntry})()`;
