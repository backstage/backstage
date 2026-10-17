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

import { MiddlewareFactory } from '@backstage/backend-defaults/rootHttpRouter';
import { wrapServer } from '@backstage/backend-openapi-utils/testUtils';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import express from 'express';
import request from 'supertest';
import { createRouter } from './router';

const limits = {
  maxInputCharacters: 100,
  maxSchemaCharacters: 100,
  maxOutputTokens: 50,
};
const usage = { inputTokens: 3, outputTokens: 4 };

async function setup(options?: {
  decision?: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
}) {
  const aiModels = {
    generateText: jest.fn(),
    streamText: jest.fn(),
    generateObject: jest.fn(),
    embed: jest.fn(),
    resolveModel: jest.fn(),
  };
  const permissions = mockServices.permissions.mock({
    authorize: async queries =>
      queries.map(() => ({
        result: options?.decision ?? AuthorizeResult.ALLOW,
      })),
  });
  const logger = mockServices.logger.mock();
  const router = await createRouter({
    aiModels,
    httpAuth: mockServices.httpAuth(),
    permissions,
    logger,
    limits,
  });
  const app = express().use(router);
  app.use(
    MiddlewareFactory.create({
      config: mockServices.rootConfig(),
      logger,
    }).error(),
  );
  return { aiModels, permissions, logger, app };
}

const userAuth = mockCredentials.user.header();

describe('createRouter', () => {
  it('generates text and logs usage without prompt contents', async () => {
    const { aiModels, logger, app } = await setup();
    aiModels.generateText.mockResolvedValue({
      provider: 'p',
      model: 'm',
      text: 'hello',
      finishReason: 'stop',
      usage,
    });

    const response = await request(await wrapServer(app))
      .post('/v1/generate/text')
      .set('Authorization', userAuth)
      .send({ prompt: 'secret prompt', provider: 'p' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      text: 'hello',
      finishReason: 'stop',
      usage,
    });
    expect(aiModels.generateText).toHaveBeenCalledWith(
      expect.objectContaining({
        provider: 'p',
        prompt: 'secret prompt',
        maxOutputTokens: 50,
      }),
    );
    expect(JSON.stringify(logger.info.mock.calls)).not.toContain(
      'secret prompt',
    );
    expect(logger.info).toHaveBeenCalledWith(
      'AI gateway text generation',
      expect.objectContaining({ provider: 'p', model: 'm', inputTokens: 3 }),
    );
  });

  it('generates objects from a JSON schema', async () => {
    const { aiModels, app } = await setup();
    aiModels.generateObject.mockResolvedValue({
      provider: 'p',
      model: 'm',
      object: { a: 1 },
      finishReason: 'stop',
      usage,
    });

    const schema = { type: 'object', properties: { a: { type: 'number' } } };
    const response = await request(await wrapServer(app))
      .post('/v1/generate/object')
      .set('Authorization', userAuth)
      .send({ messages: [{ role: 'user', content: 'hi' }], schema });

    expect(response.status).toBe(200);
    expect(response.body.object).toEqual({ a: 1 });
    expect(aiModels.generateObject).toHaveBeenCalledWith(
      expect.objectContaining({ schema }),
    );
  });

  it('rejects unauthenticated, service, and unauthorized callers', async () => {
    const { aiModels, app } = await setup();
    const server = await wrapServer(app);
    const body = { prompt: 'hi' };

    await request(server)
      .post('/v1/generate/text')
      .set('Authorization', mockCredentials.none.header())
      .send(body)
      .expect(401);
    await request(server)
      .post('/v1/generate/text')
      .set('Authorization', mockCredentials.service.header())
      .send(body)
      .expect(403);

    const denied = await setup({ decision: AuthorizeResult.DENY });
    await request(await wrapServer(denied.app))
      .post('/v1/generate/text')
      .set('Authorization', userAuth)
      .send(body)
      .expect(403);

    expect(aiModels.generateText).not.toHaveBeenCalled();
    expect(denied.aiModels.generateText).not.toHaveBeenCalled();
  });

  it('rejects invalid and oversized requests', async () => {
    const { aiModels, app } = await setup();
    const server = await wrapServer(app);
    const post = (path: string, body: object) =>
      request(server).post(path).set('Authorization', userAuth).send(body);

    const tooLarge = await post('/v1/generate/text', {
      system: 'x'.repeat(60),
      prompt: 'y'.repeat(60),
    });
    expect(tooLarge.status).toBe(400);
    expect(tooLarge.body.error.message).toContain('too large');

    const bigSchema = await post('/v1/generate/object', {
      prompt: 'hi',
      schema: { description: 'z'.repeat(200) },
    });
    expect(bigSchema.status).toBe(400);

    await post('/v1/generate/text', {}).expect(400);
    await post('/v1/generate/text', {
      prompt: 'a',
      messages: [{ role: 'user', content: 'a' }],
    }).expect(400);
    expect(aiModels.generateText).not.toHaveBeenCalled();
  });

  it('forwards service errors but hides raw upstream errors', async () => {
    const { aiModels, app } = await setup();
    const server = await wrapServer(app);
    const post = () =>
      request(server)
        .post('/v1/generate/text')
        .set('Authorization', userAuth)
        .send({ prompt: 'hi' });

    const { ServiceUnavailableError } = await import('@backstage/errors');
    aiModels.generateText.mockRejectedValueOnce(
      new ServiceUnavailableError('AI models are not configured'),
    );
    const notConfigured = await post();
    expect(notConfigured.status).toBe(503);
    expect(notConfigured.body.error.message).toBe(
      'AI models are not configured',
    );

    aiModels.generateText.mockRejectedValueOnce(
      new Error('401 invalid key sk-secret for prompt hi'),
    );
    const upstream = await post();
    expect(upstream.status).toBe(503);
    expect(JSON.stringify(upstream.body)).not.toContain('sk-secret');
  });

  it('streams text as server-sent events', async () => {
    const { aiModels, app } = await setup();
    async function* chunks() {
      yield 'Hel';
      yield 'lo';
    }
    aiModels.streamText.mockReturnValue({
      provider: 'p',
      model: 'm',
      textStream: chunks(),
      response: Promise.resolve({ finishReason: 'stop', usage }),
    });

    const response = await request(app)
      .post('/v1/generate/stream')
      .set('Authorization', userAuth)
      .send({ prompt: 'hi' });

    expect(response.status).toBe(200);
    expect(response.header['content-type']).toContain('text/event-stream');
    expect(response.text).toBe(
      'event: text\ndata: {"delta":"Hel"}\n\n' +
        'event: text\ndata: {"delta":"lo"}\n\n' +
        `event: done\ndata: ${JSON.stringify({
          finishReason: 'stop',
          usage,
        })}\n\n`,
    );

    aiModels.streamText.mockReturnValue({
      provider: 'p',
      model: 'm',
      textStream: (async function* failing() {
        yield 'a';
        throw new Error('upstream leaked sk-secret');
      })(),
      response: new Promise(() => {}),
    });
    const failed = await request(app)
      .post('/v1/generate/stream')
      .set('Authorization', userAuth)
      .send({ prompt: 'hi' });
    expect(failed.text).toContain('event: error');
    expect(failed.text).not.toContain('sk-secret');
  });

  it('aborts the upstream stream when the client disconnects', async () => {
    const { aiModels, app } = await setup();
    let signal: AbortSignal | undefined;
    aiModels.streamText.mockImplementation(({ abortSignal }) => {
      signal = abortSignal;
      return {
        provider: 'p',
        model: 'm',
        textStream: (async function* hanging() {
          yield 'a';
          await new Promise(resolve =>
            abortSignal.addEventListener('abort', resolve),
          );
        })(),
        response: new Promise(() => {}),
      };
    });

    const server = app.listen(0);
    try {
      const { port } = server.address() as { port: number };
      const controller = new AbortController();
      const res = await fetch(`http://localhost:${port}/v1/generate/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: userAuth,
        },
        body: JSON.stringify({ prompt: 'hi' }),
        signal: controller.signal,
      });
      await res.body!.getReader().read();
      controller.abort();
      await new Promise<void>(resolve => {
        const poll = () => (signal?.aborted ? resolve() : setTimeout(poll, 10));
        poll();
      });
      expect(signal?.aborted).toBe(true);
    } finally {
      server.close();
    }
  });
});
