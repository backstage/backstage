/*
 * Copyright 2020 The Backstage Authors
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

import { MicrosoftAuthProvider } from './provider';
import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AuthResolverContext } from '../types';
import express from 'express';

describe('MicrosoftAuthProvider#handle', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    server.use(
      rest.post(
        'https://login.microsoftonline.com/common/oauth2/v2.0/token',
        (_, res, ctx) =>
          res(
            ctx.json({
              token_type: 'Bearer',
              scope: 'email openid profile User.Read',
              expires_in: 123,
              ext_expires_in: 123,
              access_token: 'accessToken',
              refresh_token: 'refreshToken',
              id_token: 'idToken',
            }),
          ),
      ),
      rest.get('https://graph.microsoft.com/v1.0/me/', (_, res, ctx) =>
        res(
          ctx.json({
            id: 'conrad',
            displayName: 'Conrad',
            surname: 'Ribas',
            givenName: 'Francisco',
            mail: 'conrad@example.com',
          }),
        ),
      ),
      rest.get(
        'https://graph.microsoft.com/v1.0/me/photos/*',
        async (_, res, ctx) => {
          const imageBuffer = new Uint8Array([104, 111, 119, 100, 121]).buffer;
          return res(
            ctx.set('Content-Length', imageBuffer.byteLength.toString()),
            ctx.set('Content-Type', 'image/jpeg'),
            ctx.body(imageBuffer),
          );
        },
      ),
    );
  });

  it('returns providerInfo and profile', async () => {
    const provider = new MicrosoftAuthProvider({
      logger: getVoidLogger(),
      resolverContext: {} as AuthResolverContext,
      authHandler: async ({ fullProfile }) => ({
        profile: {
          email: fullProfile.emails![0]!.value,
          displayName: fullProfile.displayName,
          picture: 'http://microsoft.com/lols',
        },
      }),
      clientId: 'mock',
      clientSecret: 'mock',
      callbackUrl: 'http://backstage.test/api/auth/microsoft/handler/frame',
    });

    const { response } = await provider.handler({
      method: 'GET',
      url: 'http://backstage.test/api/auth/microsoft/handler/frame',
      query: {
        code: 'authorizationcode',
      },
      headers: { host: 'backstage.test' },
      connection: {},
    } as unknown as express.Request);

    expect(response).toEqual({
      providerInfo: {
        accessToken: 'accessToken',
        expiresInSeconds: 123,
        idToken: 'idToken',
        scope: 'email openid profile User.Read',
      },
      profile: {
        email: 'conrad@example.com',
        displayName: 'Conrad',
        picture: 'http://microsoft.com/lols',
      },
    });
  });

  it('returns base64 encoded photo data', async () => {
    const provider = new MicrosoftAuthProvider({
      logger: getVoidLogger(),
      resolverContext: {} as AuthResolverContext,
      authHandler: async ({ fullProfile }) => ({
        profile: {
          email: fullProfile.emails![0]!.value,
          displayName: fullProfile.displayName,
          picture: 'http://microsoft.com/lols',
        },
      }),
      clientId: 'mock',
      clientSecret: 'mock',
      callbackUrl: 'mock',
      // define resolver to return user `info` for photo validation
      signInResolver: async (info, _) => {
        return {
          id: 'user.name',
          token: 'token',
          info: info,
        };
      },
    });

    const { response } = await provider.handler({
      method: 'GET',
      url: 'http://backstage.test/api/auth/microsoft/handler/frame',
      query: {
        code: 'authorizationcode',
      },
      headers: { host: 'backstage.test' },
      connection: {},
    } as unknown as express.Request);

    const overloadedIdentity = response.backstageIdentity as any;
    const photo = overloadedIdentity.info.result.fullProfile.photos[0];
    expect(photo.value).toEqual('data:image/jpeg;base64,aG93ZHk=');
  });
});
