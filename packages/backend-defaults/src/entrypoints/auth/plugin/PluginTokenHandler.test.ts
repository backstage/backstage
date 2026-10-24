/*
 * Copyright 2024 The Backstage Authors
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

import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { DefaultPluginTokenHandler } from './PluginTokenHandler';
import { decodeJwt } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

describe('PluginTokenHandler', () => {
  const server = setupServer();
  registerMswTestHooks(server);

  const mockPublicKey = {
    kty: 'EC',
    x: 'GHlwg744e8JekzukPTdtix6R868D6fcWy0ooOx-NEZI',
    y: 'Lyujcm0M6X9_yQi3l1eH09z0brU8K9cwrLml_fRFKro',
    crv: 'P-256',
    kid: 'mock',
    alg: 'ES256',
  };
  const mockPrivateKey = {
    ...mockPublicKey,
    d: 'KEn_mDqXYbZdRHb-JnCrW53LDOv5x4NL1FnlKcqBsFI',
  };

  beforeEach(() => {
    jest.useRealTimers();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createHandler() {
    return DefaultPluginTokenHandler.create({
      discovery: mockServices.discovery.mock({
        getBaseUrl: async pluginId => `http://localhost:7007/api/${pluginId}`,
      }),
      keyDuration: { hours: 1 },
      logger: mockServices.logger.mock(),
      ownPluginId: 'test',
      keySource: {
        getPrivateSigningKey: async () => mockPrivateKey,
        listKeys: jest.fn(),
      },
    });
  }

  it('shares the JWKS client across cold verifications and later cache refreshes', async () => {
    const handler = createHandler();
    let requests = 0;
    server.use(
      http.get(
        'http://localhost:7007/api/source/.backstage/auth/v1/jwks.json',
        () => {
          requests += 1;
          return HttpResponse.json({ keys: [mockPublicKey] });
        },
      ),
    );
    const { token } = await handler.issueToken({
      pluginId: 'source',
      targetPluginId: 'test',
    });
    const verifyBurst = () =>
      Promise.all(Array.from({ length: 20 }, () => handler.verifyToken(token)));

    for (const result of await verifyBurst()) {
      expect(result).toEqual({ subject: 'plugin:source' });
    }
    // One endpoint support check and one shared key fetch, not one per token.
    expect(requests).toBe(2);

    await verifyBurst();
    expect(requests).toBe(2);

    // Expire JOSE's key cache without delaying HTTP requests or expiring tokens.
    jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 11 * 60_000);
    await verifyBurst();
    expect(requests).toBe(3);

    const { token: wrongAudience } = await handler.issueToken({
      pluginId: 'source',
      targetPluginId: 'another-target',
    });
    const [header, payload, signature] = token.split('.');
    const invalidSignature = `${
      signature[0] === 'A' ? 'B' : 'A'
    }${signature.slice(1)}`;
    for (const invalidToken of [
      wrongAudience,
      `${header}.${payload}.${invalidSignature}`,
    ]) {
      await expect(handler.verifyToken(invalidToken)).rejects.toThrow(
        'Failed plugin token verification',
      );
    }
    expect(requests).toBe(3);
  });

  it.each([
    { stage: 'missing endpoint', failureRequest: 1, status: 404 },
    { stage: 'endpoint check', failureRequest: 1, status: 503 },
    { stage: 'key fetch', failureRequest: 2, status: 503 },
  ])('retries after a failed $stage', async ({ failureRequest, status }) => {
    const handler = createHandler();
    let requests = 0;
    let failing = true;
    server.use(
      http.get(
        'http://localhost:7007/api/source/.backstage/auth/v1/jwks.json',
        () => {
          requests += 1;
          if (failing && requests >= failureRequest) {
            return new HttpResponse(null, { status });
          }
          return HttpResponse.json({ keys: [mockPublicKey] });
        },
      ),
    );
    const { token } = await handler.issueToken({
      pluginId: 'source',
      targetPluginId: 'test',
    });
    const failures = await Promise.allSettled(
      Array.from({ length: 20 }, () => handler.verifyToken(token)),
    );
    for (const result of failures) {
      expect(result).toMatchObject({
        status: 'rejected',
        reason: { name: 'AuthenticationError' },
      });
    }
    expect(requests).toBe(failureRequest);

    failing = false;
    const results = await Promise.all(
      Array.from({ length: 20 }, () => handler.verifyToken(token)),
    );
    for (const result of results) {
      expect(result).toEqual({ subject: 'plugin:source' });
    }
    expect(requests).toBe(3);
  });

  it('keeps clients separate for different source plugins and handlers', async () => {
    const handler = createHandler();
    const requests = new Map<string, number>();
    server.use(
      http.get(
        'http://localhost:7007/api/:pluginId/.backstage/auth/v1/jwks.json',
        ({ params }) => {
          const pluginId = String(params.pluginId);
          requests.set(pluginId, (requests.get(pluginId) ?? 0) + 1);
          return HttpResponse.json({ keys: [mockPublicKey] });
        },
      ),
    );
    const tokens = await Promise.all(
      ['first', 'second'].map(pluginId =>
        handler.issueToken({ pluginId, targetPluginId: 'test' }),
      ),
    );
    for (let i = 0; i < 2; i += 1) {
      await expect(
        Promise.all(tokens.map(({ token }) => handler.verifyToken(token))),
      ).resolves.toEqual([
        { subject: 'plugin:first' },
        { subject: 'plugin:second' },
      ]);
    }
    expect(requests).toEqual(
      new Map([
        ['first', 2],
        ['second', 2],
      ]),
    );

    await expect(createHandler().verifyToken(tokens[0].token)).resolves.toEqual(
      {
        subject: 'plugin:first',
      },
    );
    expect(requests).toEqual(
      new Map([
        ['first', 4],
        ['second', 2],
      ]),
    );
  });

  it('runs issueToken', async () => {
    jest.useFakeTimers({
      now: new Date(0),
    });

    const getKeyMock = jest.fn(async () => mockPrivateKey);
    const handler = DefaultPluginTokenHandler.create({
      discovery: mockServices.discovery(),
      keyDuration: { seconds: 10 },
      logger: mockServices.logger.mock(),
      ownPluginId: 'test',
      keySource: {
        getPrivateSigningKey: getKeyMock,
        listKeys: jest.fn(),
      },
    });

    const { token } = await handler.issueToken({
      pluginId: 'test',
      targetPluginId: 'other',
    });
    const payload = decodeJwt(token);
    expect(payload).toMatchObject({
      iat: 0,
      exp: 10,
      sub: 'test',
      aud: 'other',
    });

    expect(getKeyMock).toHaveBeenCalledTimes(1);
  });
});
