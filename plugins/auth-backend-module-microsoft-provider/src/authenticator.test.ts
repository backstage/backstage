/*
 * Copyright 2023 The Backstage Authors
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

import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  encodeOAuthState,
  OAuthAuthenticatorAuthenticateInput,
  OAuthAuthenticatorRefreshInput,
  OAuthAuthenticatorStartInput,
  OAuthState,
  PassportOAuthAuthenticatorHelper,
} from '@backstage/plugin-auth-node';
import express from 'express';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { FakeMicrosoftAPI } from './__testUtils__/fake';
import { microsoftAuthenticator } from './authenticator';

describe('microsoftAuthenticator', () => {
  const oauthState: OAuthState = {
    nonce: 'AAAAAAAAAAAAAAAAAAAAAA==',
    env: 'development',
  };
  const scope = 'email openid profile User.Read';
  const state = encodeOAuthState(oauthState);

  const photo = 'data:image/jpeg;base64,aG93ZHk=';

  const microsoftApi = new FakeMicrosoftAPI();

  const server = setupServer();
  setupRequestMockHandlers(server);

  let implementation: {
    domainHint: string | undefined;
    helper: PassportOAuthAuthenticatorHelper;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    server.use(
      rest.post(
        'https://login.microsoftonline.com/tenantId/oauth2/v2.0/token',
        async (req, res, ctx) => {
          return res(
            ctx.json({
              ...microsoftApi.token(new URLSearchParams(await req.text())),
              token_type: 'Bearer',
              expires_in: 123,
              ext_expires_in: 123,
            }),
          );
        },
      ),
      rest.get('https://graph.microsoft.com/v1.0/me/', (req, res, ctx) => {
        if (
          !microsoftApi.tokenHasScope(
            req.headers.get('authorization')!.replace(/^Bearer /, ''),
            'User.Read',
          )
        ) {
          return res(ctx.status(403));
        }
        return res(
          ctx.json({
            id: 'conrad',
            displayName: 'Conrad',
            surname: 'Ribas',
            givenName: 'Francisco',
            mail: 'conrad@example.com',
          }),
        );
      }),
      rest.get(
        'https://graph.microsoft.com/v1.0/me/photos/*',
        async (req, res, ctx) => {
          if (
            !microsoftApi.tokenHasScope(
              req.headers.get('authorization')!.replace(/^Bearer /, ''),
              'User.Read',
            )
          ) {
            return res(ctx.status(403));
          }
          const imageBuffer = new Uint8Array([104, 111, 119, 100, 121]).buffer;
          return res(
            ctx.set('Content-Length', imageBuffer.byteLength.toString()),
            ctx.set('Content-Type', 'image/jpeg'),
            ctx.body(imageBuffer),
          );
        },
      ),
    );

    implementation = microsoftAuthenticator.initialize({
      callbackUrl: 'https://backstage.test/callback',
      config: new ConfigReader({
        tenantId: 'tenantId',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
        additionalScopes: ['User.Read.All'],
      }),
    });
  });

  describe('#start', () => {
    it('redirects to authorize URL', async () => {
      const startRequest: OAuthAuthenticatorStartInput = {
        scope,
        state,
        req: {
          method: 'GET',
          url: 'test',
        } as unknown as express.Request,
      };
      const startResponse = await microsoftAuthenticator.start(
        startRequest,
        implementation,
      );

      expect(startResponse.url).toBe(
        'https://login.microsoftonline.com/tenantId/oauth2/v2.0/authorize' +
          '?response_type=code' +
          `&redirect_uri=${encodeURIComponent(
            'https://backstage.test/callback',
          )}` +
          `&scope=${encodeURIComponent(scope)}` +
          `&state=${state}` +
          '&client_id=clientId',
      );
    });
  });

  describe('#authenticate', () => {
    const createAuthenticateRequest = (
      scopeForRequest: string,
    ): OAuthAuthenticatorAuthenticateInput => {
      const authCode = microsoftApi.generateAuthCode(scopeForRequest);
      return {
        req: {
          method: 'GET',
          url: 'test',
          query: {
            code: authCode,
            state,
          },
          session: {},
          cookies: {
            'microsoft-nonce': oauthState.nonce,
          },
        } as unknown as express.Request,
      };
    };

    it('returns provider info and profile with photo data', async () => {
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(scope),
        implementation,
      );

      const profile = authenticateResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toStrictEqual([{ value: photo }]);
    });

    it('returns access token for non-microsoft graph scope', async () => {
      const foreignScope = 'aks-audience/user.read';
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(foreignScope),
        implementation,
      );

      expect(authenticateResponse.fullProfile).toBeUndefined();
      expect(authenticateResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(foreignScope),
      );
    });

    it('sets refresh token', async () => {
      const refreshScope = 'email offline_access openid profile User.Read';
      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(refreshScope),
        implementation,
      );

      const session = authenticateResponse.session;
      expect(session.refreshToken).toBe(
        microsoftApi.generateRefreshToken(refreshScope),
      );
    });

    it('omits photo data when fetching it fails', async () => {
      server.use(
        rest.get('https://graph.microsoft.com/v1.0/me/photos/*', (_, res) =>
          res.networkError('remote hung up'),
        ),
      );

      const authenticateResponse = await microsoftAuthenticator.authenticate(
        createAuthenticateRequest(scope),
        implementation,
      );

      const profile = authenticateResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toBeUndefined();
    });
  });

  describe('#refresh', () => {
    const createRefreshRequest = (
      scopeForRequest: string,
    ): OAuthAuthenticatorRefreshInput => {
      return {
        scope: scopeForRequest,
        refreshToken: microsoftApi.generateRefreshToken(scopeForRequest),
        req: {} as unknown as express.Request,
      };
    };

    it('returns provider info and profile with photo data', async () => {
      const refreshResponse = await microsoftAuthenticator.refresh(
        createRefreshRequest(scope),
        implementation,
      );

      const profile = refreshResponse.fullProfile;
      expect(profile.displayName).toBe('Conrad');
      expect(profile.emails).toStrictEqual([
        {
          type: 'work',
          value: 'conrad@example.com',
        },
      ]);
      expect(profile.photos).toStrictEqual([{ value: photo }]);
    });

    it('returns access token for  non-microsoft graph scope', async () => {
      const foreignScope = 'aks-audience/user.read';
      const refreshResponse = await microsoftAuthenticator.refresh(
        createRefreshRequest(foreignScope),
        implementation,
      );

      expect(refreshResponse.fullProfile).toBeUndefined();
      expect(refreshResponse.session.accessToken).toBe(
        microsoftApi.generateAccessToken(foreignScope),
      );
    });
  });
});
