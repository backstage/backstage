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

/**
 * @jest-environment node
 */

import { AiGatewayClient } from './AiGatewayClient';

function sse(chunks: string[]) {
  const encoder = new TextEncoder();
  return new Response(
    new ReadableStream({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    }),
    { headers: { 'Content-Type': 'text/event-stream' } },
  );
}

function setup(fetch: jest.Mock) {
  return new AiGatewayClient({
    discoveryApi: {
      getBaseUrl: async (id: string) => `http://localhost/api/${id}`,
    },
    fetchApi: { fetch },
  });
}

const usage = { inputTokens: 1, outputTokens: 2 };

describe('AiGatewayClient', () => {
  it('generates text and objects through the generated client', async () => {
    const fetch = jest.fn(async (url: string) =>
      Response.json(
        url.endsWith('/text')
          ? { text: 'hi', finishReason: 'stop', usage }
          : { object: { a: 1 }, finishReason: 'stop', usage },
      ),
    );
    const client = setup(fetch);

    await expect(client.generateText({ prompt: 'x' })).resolves.toEqual({
      text: 'hi',
      finishReason: 'stop',
      usage,
    });
    const object = await client.generateObject<{ a: number }>({
      prompt: 'x',
      schema: { type: 'object' },
    });
    expect(object.object.a).toBe(1);

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/ai-gateway/v1/generate/text',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ prompt: 'x' }),
      }),
    );
  });

  it('throws response errors', async () => {
    const fetch = jest.fn(async () =>
      Response.json(
        {
          error: { name: 'InputError', message: 'too large' },
          request: { method: 'POST', url: '/' },
          response: { statusCode: 400 },
        },
        { status: 400 },
      ),
    );
    const client = setup(fetch);

    await expect(client.generateText({ prompt: 'x' })).rejects.toMatchObject({
      name: 'ResponseError',
      statusCode: 400,
    });
    await expect(
      client.streamText({ prompt: 'x' }).response,
    ).rejects.toMatchObject({
      body: { error: { message: 'too large' } },
    });
  });

  it('streams text split across chunks', async () => {
    const fetch = jest.fn(async () =>
      sse([
        'event: text\ndata: {"delta":"Hel"}\n\nevent: te',
        'xt\ndata: {"delta":"lo"}\n\n',
        `event: done\ndata: ${JSON.stringify({
          finishReason: 'stop',
          usage,
        })}\n\n`,
      ]),
    );
    const client = setup(fetch);
    const controller = new AbortController();

    const stream = client.streamText(
      { prompt: 'x' },
      { signal: controller.signal },
    );
    const deltas: string[] = [];
    for await (const delta of stream.textStream) {
      deltas.push(delta);
    }

    expect(deltas).toEqual(['Hel', 'lo']);
    await expect(stream.response).resolves.toEqual({
      finishReason: 'stop',
      usage,
    });
    expect(fetch).toHaveBeenCalledWith(
      'http://localhost/api/ai-gateway/v1/generate/stream',
      expect.objectContaining({ signal: controller.signal }),
    );
  });

  it('fails the stream on error events and truncated streams', async () => {
    const failing = setup(
      jest.fn(async () =>
        sse([
          'event: text\ndata: {"delta":"a"}\n\n',
          'event: error\ndata: {"message":"boom"}\n\n',
        ]),
      ),
    ).streamText({ prompt: 'x' });
    const seen: string[] = [];
    await expect(
      (async () => {
        for await (const delta of failing.textStream) {
          seen.push(delta);
        }
      })(),
    ).rejects.toThrow('boom');
    expect(seen).toEqual(['a']);
    await expect(failing.response).rejects.toThrow('boom');

    const truncated = setup(
      jest.fn(async () => sse(['event: text\ndata: {"delta":"a"}\n\n'])),
    ).streamText({ prompt: 'x' });
    await expect(truncated.response).rejects.toThrow('without finishing');
  });
});
