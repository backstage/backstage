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

import { registerMswTestHooks } from '@backstage/backend-test-utils';
import { errors, exportJWK, generateKeyPair, jwtVerify, SignJWT } from 'jose';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { JwksClient } from './JwksClient';

const server = setupServer();
const firstEndpoint = new URL('http://localhost:7007/jwks.json');
const secondEndpoint = new URL('http://localhost:7008/jwks.json');

async function createSigningKey(kid: string) {
  const keyPair = await generateKeyPair('ES256');
  return {
    privateKey: keyPair.privateKey,
    publicKey: {
      ...(await exportJWK(keyPair.publicKey)),
      alg: 'ES256',
      kid,
      use: 'sig',
    },
  };
}

async function createToken(
  key: Awaited<ReturnType<typeof createSigningKey>>,
  kid = key.publicKey.kid,
) {
  return new SignJWT({ sub: 'user:default/test' })
    .setProtectedHeader({ alg: 'ES256', kid })
    .sign(key.privateKey);
}

describe('JwksClient', () => {
  registerMswTestHooks(server);

  let firstKey: Awaited<ReturnType<typeof createSigningKey>>;
  let secondKey: Awaited<ReturnType<typeof createSigningKey>>;
  let thirdKey: Awaited<ReturnType<typeof createSigningKey>>;

  beforeAll(async () => {
    [firstKey, secondKey, thirdKey] = await Promise.all([
      createSigningKey('first'),
      createSigningKey('second'),
      createSigningKey('third'),
    ]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('reloads newly published keys during cooldown and follows endpoint changes', async () => {
    let endpoint = firstEndpoint;
    let keys = [firstKey.publicKey];
    let firstEndpointRequests = 0;
    let secondEndpointRequests = 0;
    const getEndpoint = jest.fn(async () => endpoint);
    const client = new JwksClient(getEndpoint);

    server.use(
      http.get(firstEndpoint.href, () => {
        firstEndpointRequests += 1;
        return HttpResponse.json({ keys });
      }),
      http.get(secondEndpoint.href, () => {
        secondEndpointRequests += 1;
        return HttpResponse.json({ keys });
      }),
    );

    await client.refreshKeyStore();
    await expect(
      jwtVerify(await createToken(firstKey), client.getKey),
    ).resolves.toBeDefined();
    expect(firstEndpointRequests).toBe(1);

    keys = [firstKey.publicKey, secondKey.publicKey];
    await expect(
      jwtVerify(await createToken(secondKey), client.getKey),
    ).resolves.toBeDefined();
    expect(firstEndpointRequests).toBe(2);

    endpoint = secondEndpoint;
    keys = [thirdKey.publicKey];
    await expect(
      jwtVerify(await createToken(thirdKey), client.getKey),
    ).resolves.toBeDefined();
    expect(firstEndpointRequests).toBe(2);
    expect(secondEndpointRequests).toBe(1);
    expect(getEndpoint).toHaveBeenCalledTimes(3);
  });

  it('coalesces concurrent forced reloads', async () => {
    let keys = [firstKey.publicKey];
    let requestCount = 0;
    let releaseReload: () => void;
    let markReloadStarted: () => void;
    const reloadStarted = new Promise<void>(resolve => {
      markReloadStarted = resolve;
    });
    const reloadReleased = new Promise<void>(resolve => {
      releaseReload = resolve;
    });
    const client = new JwksClient(async () => firstEndpoint);

    server.use(
      http.get(firstEndpoint.href, async () => {
        requestCount += 1;
        if (requestCount === 2) {
          markReloadStarted();
          await reloadReleased;
        }
        return HttpResponse.json({ keys });
      }),
    );

    await client.refreshKeyStore();
    await jwtVerify(await createToken(firstKey), client.getKey);

    keys = [firstKey.publicKey, secondKey.publicKey];
    const token = await createToken(secondKey);
    const verifications = Promise.all([
      jwtVerify(token, client.getKey),
      jwtVerify(token, client.getKey),
    ]);
    await reloadStarted;
    expect(requestCount).toBe(2);

    releaseReload!();
    await expect(verifications).resolves.toHaveLength(2);
    expect(requestCount).toBe(2);
  });

  it('bounds failed forced reloads in a sliding window', async () => {
    let now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    let failRequests = false;
    let requestCount = 0;
    const client = new JwksClient(async () => firstEndpoint);

    server.use(
      http.get(firstEndpoint.href, () => {
        requestCount += 1;
        if (failRequests) {
          return new HttpResponse(null, { status: 500 });
        }
        return HttpResponse.json({ keys: [firstKey.publicKey] });
      }),
    );

    await client.refreshKeyStore();
    await jwtVerify(await createToken(firstKey), client.getKey);
    failRequests = true;

    for (let index = 0; index < 10; index += 1) {
      await expect(
        jwtVerify(
          await createToken(firstKey, `unknown-${index}`),
          client.getKey,
        ),
      ).rejects.toThrow(
        'Expected 200 OK from the JSON Web Key Set HTTP response',
      );
    }
    await expect(
      jwtVerify(await createToken(firstKey, 'unknown-limited'), client.getKey),
    ).rejects.toBeInstanceOf(errors.JWKSNoMatchingKey);
    expect(requestCount).toBe(11);

    failRequests = false;
    now += 60_001;
    await expect(
      jwtVerify(await createToken(firstKey, 'unknown-normal'), client.getKey),
    ).rejects.toBeInstanceOf(errors.JWKSNoMatchingKey);
    await expect(
      jwtVerify(await createToken(firstKey, 'unknown-reset'), client.getKey),
    ).rejects.toBeInstanceOf(errors.JWKSNoMatchingKey);
    expect(requestCount).toBe(13);

    await expect(
      jwtVerify(await createToken(firstKey), client.getKey),
    ).resolves.toBeDefined();
    expect(requestCount).toBe(13);
  });

  it('preserves normal resolver and initialization errors', async () => {
    let requestCount = 0;
    const client = new JwksClient(async () => firstEndpoint);
    server.use(
      http.get(firstEndpoint.href, () => {
        requestCount += 1;
        return HttpResponse.json({ keys: [firstKey.publicKey] });
      }),
    );

    expect(() => client.getKey).toThrow(
      'refreshKeyStore must be called before jwksClient.getKey',
    );

    await client.refreshKeyStore();
    await expect(
      jwtVerify(await createToken(firstKey, 'unknown'), client.getKey),
    ).rejects.toBeInstanceOf(errors.JWKSNoMatchingKey);
    expect(requestCount).toBe(1);
  });
});
