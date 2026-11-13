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

import { ResponseError } from '@backstage/errors';
import { JsonValue } from '@backstage/types';
import {
  AiGatewayApi,
  AiGatewayObjectRequest,
  AiGatewayObjectResponse,
  AiGatewayStream,
  AiGatewayTextRequest,
  AiGatewayTextResponse,
  AiGatewayUsage,
} from './api';
import { DefaultApiClient } from './schema/openapi/generated';

type StreamDone = { finishReason: string; usage: AiGatewayUsage };

/** Parses one server-sent event block into its event name and data. */
function parseEvent(block: string): { event: string; data: unknown } {
  let event = 'message';
  const data: string[] = [];
  for (const line of block.split('\n')) {
    if (line.startsWith('event:')) {
      event = line.slice('event:'.length).trim();
    } else if (line.startsWith('data:')) {
      data.push(line.slice('data:'.length).replace(/^ /, ''));
    }
  }
  return { event, data: data.length ? JSON.parse(data.join('\n')) : undefined };
}

/**
 * The default implementation of the {@link AiGatewayApi}.
 *
 * @public
 */
export class AiGatewayClient implements AiGatewayApi {
  private readonly discoveryApi: {
    getBaseUrl(pluginId: string): Promise<string>;
  };
  private readonly fetchApi: { fetch: typeof fetch };
  private readonly client: DefaultApiClient;

  constructor(options: {
    discoveryApi: { getBaseUrl(pluginId: string): Promise<string> };
    fetchApi: { fetch: typeof fetch };
  }) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.client = new DefaultApiClient(options);
  }

  async generateText(
    request: AiGatewayTextRequest,
  ): Promise<AiGatewayTextResponse> {
    const res = await this.client.generateText({ body: request });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    return await res.json();
  }

  async generateObject<T = JsonValue>(
    request: AiGatewayObjectRequest,
  ): Promise<AiGatewayObjectResponse<T>> {
    const res = await this.client.generateObject({ body: request });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    return (await res.json()) as AiGatewayObjectResponse<T>;
  }

  streamText(
    request: AiGatewayTextRequest,
    options?: { signal?: AbortSignal },
  ): AiGatewayStream {
    const queue: string[] = [];
    let finished = false;
    let failure: unknown;
    let wake: (() => void) | undefined;
    const notify = () => {
      wake?.();
      wake = undefined;
    };

    let resolveResponse: (value: StreamDone) => void;
    let rejectResponse: (reason: unknown) => void;
    const response = new Promise<StreamDone>((resolve, reject) => {
      resolveResponse = resolve;
      rejectResponse = reject;
    });
    // The consumer may only iterate the text stream
    response.catch(() => {});

    const pump = async () => {
      let done: StreamDone | undefined;
      const res = await this.postStream(request, options?.signal);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const chunk = await reader.read();
        buffer += decoder.decode(chunk.value, { stream: !chunk.done });
        buffer = buffer.replace(/\r\n/g, '\n');
        let end = buffer.indexOf('\n\n');
        while (end !== -1) {
          const { event, data } = parseEvent(buffer.slice(0, end));
          buffer = buffer.slice(end + 2);
          end = buffer.indexOf('\n\n');
          if (event === 'text') {
            queue.push((data as { delta: string }).delta);
            notify();
          } else if (event === 'done') {
            done = data as StreamDone;
          } else if (event === 'error') {
            throw new Error((data as { message: string }).message);
          }
        }
        if (chunk.done) {
          break;
        }
      }
      if (!done) {
        throw new Error('The AI gateway stream ended without finishing');
      }
      resolveResponse(done);
    };

    pump()
      .catch(error => {
        failure = error;
        rejectResponse(error);
      })
      .finally(() => {
        finished = true;
        notify();
      });

    const waitForMore = () =>
      new Promise<void>(resolve => {
        wake = resolve;
      });

    async function* textStream(): AsyncGenerator<string> {
      for (;;) {
        if (queue.length > 0) {
          yield queue.shift()!;
        } else if (finished) {
          if (failure) {
            throw failure;
          }
          return;
        } else {
          await waitForMore();
        }
      }
    }

    return { textStream: textStream(), response };
  }

  private async postStream(
    request: AiGatewayTextRequest,
    signal?: AbortSignal,
  ): Promise<Response> {
    const baseUrl = await this.discoveryApi.getBaseUrl('ai-gateway');
    const res = await this.fetchApi.fetch(`${baseUrl}/v1/generate/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(request),
      signal,
    });
    if (!res.ok) {
      throw await ResponseError.fromResponse(res);
    }
    return res;
  }
}
