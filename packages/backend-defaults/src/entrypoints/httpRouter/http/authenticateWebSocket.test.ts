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

import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import {
  mockCredentials,
  mockServices,
  ServiceFactoryTester,
} from '@backstage/backend-test-utils';
import { randomBytes } from 'node:crypto';
import { SignJWT } from 'jose';
import { AuthenticationError, NotAllowedError } from '@backstage/errors';
import { tokenTypes } from '@backstage/plugin-auth-node';
import { authServiceFactory } from '../../auth/authServiceFactory';
import { authenticateWebSocket } from './authenticateWebSocket';

function request(headers: IncomingMessage['headers']): IncomingMessage {
  const req = new IncomingMessage(new Socket());
  req.headers = headers;
  return req;
}

describe('authenticateWebSocket', () => {
  it('tries opaque protocol values in order and accepts authenticated principals', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig();
    const req = request({
      'sec-websocket-protocol': `application, ${mockCredentials.service.token()}, ${mockCredentials.user.token()}`,
    });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.service(),
      authProtocol: mockCredentials.service.token(),
    });
    expect(authenticate.mock.calls.map(([token]) => token)).toEqual([
      'application',
      mockCredentials.service.token(),
    ]);
    authenticate.mockClear();
    req.headers.authorization = mockCredentials.user.header();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.service(),
      authProtocol: mockCredentials.service.token(),
    });
    expect(authenticate.mock.calls.map(([token]) => token)).toEqual([
      'application',
      mockCredentials.service.token(),
    ]);
    authenticate.mockClear();
    req.headers['sec-websocket-protocol'] = 'application';
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: req,
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({
      credentials: mockCredentials.user(),
      authProtocol: undefined,
    });
    expect(authenticate.mock.calls.map(([token]) => token)).toEqual([
      'application',
      mockCredentials.user.token(),
    ]);
    for (const headers of [
      {},
      { 'sec-websocket-protocol': 'invalid, other' },
    ]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request(headers),
          authPolicy: 'authenticated',
        }),
      ).rejects.toMatchObject({ name: 'AuthenticationError' });
    }
  });

  it('bounds authentication work without truncating candidate lists', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig();
    const junk = ['one', 'two', 'three', 'four'];
    for (const headers of [
      {
        'sec-websocket-protocol': [...junk, mockCredentials.user.token()].join(
          ',',
        ),
      },
      {
        'sec-websocket-protocol': junk.join(','),
        authorization: mockCredentials.user.header(),
      },
    ]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request(headers),
          authPolicy: 'authenticated',
        }),
      ).resolves.toMatchObject({ credentials: mockCredentials.user() });
      expect(authenticate).toHaveBeenCalledTimes(5);
      authenticate.mockClear();
    }
    for (const headers of [
      {
        'sec-websocket-protocol': [
          mockCredentials.user.token(),
          ...junk,
          'five',
        ].join(','),
      },
      {
        'sec-websocket-protocol': [...junk, 'five'].join(','),
        authorization: mockCredentials.user.header(),
      },
    ]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request(headers),
          authPolicy: 'authenticated',
        }),
      ).rejects.toThrow('at most 5 candidates');
      expect(authenticate).not.toHaveBeenCalled();
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request(headers),
          authPolicy: 'unauthenticated',
        }),
      ).resolves.toEqual({ credentials: mockCredentials.none() });
      expect(authenticate).not.toHaveBeenCalled();
    }
  });

  it('tries later credentials after invalid tokens with the default auth service', async () => {
    const key = randomBytes(32);
    const data = {
      backend: {
        baseUrl: 'http://localhost',
        auth: {
          externalAccess: [
            {
              type: 'legacy',
              options: {
                secret: key.toString('base64'),
                subject: 'legacy-test',
              },
            },
          ],
        },
      },
    };
    const config = mockServices.rootConfig({ data });
    const auth = await ServiceFactoryTester.from(authServiceFactory, {
      dependencies: [
        mockServices.rootConfig.factory({ data }),
        mockServices.discovery.factory(),
      ],
    }).getSubject();
    const valid = await new SignJWT({ sub: 'backstage-server' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(key);
    const credentials = await auth.authenticate(valid);
    const expired = await new SignJWT({ sub: 'backstage-server' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(0)
      .sign(key);
    const notYetValid = await new SignJWT({ sub: 'backstage-server' })
      .setProtectedHeader({ alg: 'HS256' })
      .setNotBefore('1h')
      .sign(key);
    const pluginHeader = Buffer.from(
      JSON.stringify({ alg: 'ES256', typ: tokenTypes.plugin.typParam }),
    ).toString('base64url');
    const malformedPluginTokens = ['not json', '[]'].map(
      payload =>
        `${pluginHeader}.${Buffer.from(payload).toString(
          'base64url',
        )}.signature`,
    );
    for (const token of [expired, notYetValid, ...malformedPluginTokens]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          authPolicy: 'authenticated',
          request: request({ 'sec-websocket-protocol': `${token}, ${valid}` }),
        }),
      ).resolves.toEqual({ credentials, authProtocol: valid });
      await expect(
        authenticateWebSocket({
          auth,
          config,
          authPolicy: 'authenticated',
          request: request({
            'sec-websocket-protocol': token,
            authorization: `Bearer ${valid}`,
          }),
        }),
      ).resolves.toEqual({ credentials, authProtocol: undefined });
      await expect(
        authenticateWebSocket({
          auth,
          config,
          authPolicy: 'authenticated',
          request: request({ 'sec-websocket-protocol': token }),
        }),
      ).rejects.toMatchObject({ name: 'AuthenticationError' });
    }
  });

  it('skips any candidate error and retains authentication failures for rejection', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig();
    const denied = new NotAllowedError('Caller is not allowed');
    const invalid = new AuthenticationError('Credentials have expired');
    for (const error of [
      new Error('Verification failed'),
      null,
      invalid,
      denied,
    ]) {
      authenticate.mockRejectedValueOnce(error);
      await expect(
        authenticateWebSocket({
          auth,
          config,
          authPolicy: 'authenticated',
          request: request({
            'sec-websocket-protocol': `invalid, ${mockCredentials.user.token()}`,
          }),
        }),
      ).resolves.toEqual({
        credentials: mockCredentials.user(),
        authProtocol: mockCredentials.user.token(),
      });
    }
    for (const errors of [
      [invalid, new Error('Failure')],
      [denied, invalid],
    ]) {
      for (const error of errors) {
        authenticate.mockRejectedValueOnce(error);
      }
      await expect(
        authenticateWebSocket({
          auth,
          config,
          authPolicy: 'authenticated',
          request: request({ 'sec-websocket-protocol': 'first, second' }),
        }),
      ).rejects.toBe(errors[0]);
    }
  });

  it('ignores cookies, rejects limited tokens, and accepts tokens from any origin', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig({
      data: {
        app: { baseUrl: 'https://app.example.com' },
        backend: { cors: { origin: 'https://app.example.com' } },
      },
    });
    for (const token of [
      mockCredentials.user.token(),
      mockCredentials.limitedUser.token(),
    ]) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request({
            cookie: `backstage-auth=${encodeURIComponent(token)}`,
            origin: 'https://app.example.com',
          }),
          authPolicy: 'authenticated',
        }),
      ).rejects.toThrow('Missing or invalid');
    }
    expect(authenticate).not.toHaveBeenCalled();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({
          'sec-websocket-protocol': mockCredentials.limitedUser.token(),
        }),
        authPolicy: 'authenticated',
      }),
    ).rejects.toThrow('Limited user token is not allowed');
    for (const origin of [undefined, 'https://other.example.com']) {
      await expect(
        authenticateWebSocket({
          auth,
          config,
          request: request({
            'sec-websocket-protocol': mockCredentials.user.token(),
            origin,
          }),
          authPolicy: 'authenticated',
        }),
      ).resolves.toEqual({
        credentials: mockCredentials.user(),
        authProtocol: mockCredentials.user.token(),
      });
    }
  });

  it('makes unauthenticated access explicit and preserves the default-policy escape hatch', async () => {
    const auth = mockServices.auth();
    const authenticate = jest.spyOn(auth, 'authenticate');
    const config = mockServices.rootConfig({
      data: {
        backend: { auth: { dangerouslyDisableDefaultAuthPolicy: true } },
      },
    });
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({ 'sec-websocket-protocol': 'invalid' }),
        authPolicy: 'unauthenticated',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.none() });
    expect(authenticate).not.toHaveBeenCalled();
    await expect(
      authenticateWebSocket({
        auth,
        config,
        request: request({}),
        authPolicy: 'authenticated',
      }),
    ).resolves.toEqual({ credentials: mockCredentials.none() });
  });
});
