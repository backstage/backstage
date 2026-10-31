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
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
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
      ).rejects.toThrow('Missing or invalid');
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
    ).rejects.toThrow('Missing or invalid');
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
