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

import { microsoft } from './provider';
import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AuthProviderRouteHandlers, AuthResolverContext } from '../types';
import express from 'express';
import crypto from 'crypto';
import { FakeMicrosoftAPI } from './__testUtils__/fake';

describe('MicrosoftAuthProvider', () => {
  const nonce = 'AAAAAAAAAAAAAAAAAAAAAA=='; // 16 bytes of zeros in base64
  const state = Buffer.from(
    `nonce=${encodeURIComponent(nonce)}&env=development`,
  ).toString('hex');

  const server = setupServer();
  const microsoftApi = new FakeMicrosoftAPI();
  let provider: AuthProviderRouteHandlers;
  let response: jest.Mocked<express.Response>;

  setupRequestMockHandlers(server);

  beforeEach(() => {
    provider = microsoft.create({
      signIn: {
        resolver: microsoft.resolvers.emailMatchingUserEntityAnnotation(),
      },
    })({
      providerId: 'microsoft',
      globalConfig: {
        baseUrl: 'http://backstage.test/api/auth',
        appUrl: 'http://backstage.test',
        isOriginAllowed: _ => true,
      },
      config: new ConfigReader({
        development: {
          tenantId: 'tenantId',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
        },
      }),
      logger: getVoidLogger(),
      resolverContext: {
        issueToken: jest.fn(),
        findCatalogUser: jest.fn(),
        signInWithCatalogUser: _ =>
          Promise.resolve({
            token: 'header.e30K.backstage',
          }),
      } as AuthResolverContext,
    }) as AuthProviderRouteHandlers;

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
    response = {
      cookie: jest.fn(),
      end: jest.fn(),
      json: jest.fn(),
      setHeader: jest.fn(),
      status: jest.fn(),
    } as unknown as jest.Mocked<express.Response>;
    response.status.mockReturnValue(response);
  });

  describe('#start', () => {
    const randomBytes = jest.spyOn(
      crypto,
      'randomBytes',
    ) as unknown as jest.MockedFunction<(size: number) => Buffer>;

    afterEach(() => {
      randomBytes.mockRestore();
    });

    it('redirects to authorize URL', async () => {
      randomBytes.mockReturnValue(Buffer.from(nonce, 'base64'));

      await provider.start(
        {
          query: {
            env: 'development',
            scope: 'email openid profile User.Read',
          },
        } as unknown as express.Request,
        response,
      );

      expect(response.setHeader).toHaveBeenCalledWith(
        'Location',
        'https://login.microsoftonline.com/tenantId/oauth2/v2.0/authorize' +
          '?response_type=code' +
          `&redirect_uri=${encodeURIComponent(
            'http://backstage.test/api/auth/microsoft/handler/frame',
          )}` +
          `&scope=${encodeURIComponent('email openid profile User.Read')}` +
          `&state=${state}` +
          '&client_id=clientId',
      );
    });
  });

  describe('#handle', () => {
    it('returns provider info and profile with photo data', async () => {
      await provider.frameHandler(
        {
          query: {
            env: 'development',
            code: microsoftApi.generateAuthCode(
              'email openid profile User.Read',
            ),
            state,
          },
          cookies: {
            'microsoft-nonce': nonce,
          },
        } as unknown as express.Request,
        response,
      );

      expect(response.end).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent(
            JSON.stringify({
              type: 'authorization_response',
              response: {
                providerInfo: {
                  accessToken: microsoftApi.generateAccessToken(
                    'email openid profile User.Read',
                  ),
                  scope: 'email openid profile User.Read',
                  expiresInSeconds: 123,
                  idToken: 'header.e30K.microsoft',
                },
                profile: {
                  email: 'conrad@example.com',
                  picture: 'data:image/jpeg;base64,aG93ZHk=',
                  displayName: 'Conrad',
                },
                backstageIdentity: {
                  token: 'header.e30K.backstage',
                  identity: { type: 'user', ownershipEntityRefs: [] },
                },
              },
            }),
          ),
        ),
      );
    });

    it('returns access token for non-microsoft graph scope', async () => {
      await provider.frameHandler(
        {
          query: {
            env: 'development',
            code: microsoftApi.generateAuthCode('aks-audience/user.read'),
            state,
          },
          cookies: {
            'microsoft-nonce': nonce,
          },
        } as unknown as express.Request,
        response,
      );

      expect(response.end).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent(
            JSON.stringify({
              type: 'authorization_response',
              response: {
                providerInfo: {
                  accessToken: microsoftApi.generateAccessToken(
                    'aks-audience/user.read',
                  ),
                  scope: 'aks-audience/user.read',
                  expiresInSeconds: 123,
                },
                profile: {},
              },
            }),
          ),
        ),
      );
    });

    it('sets refresh token', async () => {
      await provider.frameHandler(
        {
          query: {
            env: 'development',
            code: microsoftApi.generateAuthCode(
              'email offline_access openid profile User.Read',
            ),
            state,
          },
          cookies: {
            'microsoft-nonce': nonce,
          },
        } as unknown as express.Request,
        response,
      );

      expect(response.cookie).toHaveBeenCalledWith(
        'microsoft-refresh-token',
        microsoftApi.generateRefreshToken(
          'email offline_access openid profile User.Read',
        ),
        {
          domain: 'backstage.test',
          httpOnly: true,
          maxAge: 86400000000,
          path: '/api/auth/microsoft',
          sameSite: 'lax',
          secure: false,
        },
      );
    });

    it('omits photo data when fetching it fails', async () => {
      server.use(
        rest.get('https://graph.microsoft.com/v1.0/me/photos/*', (_, res) =>
          res.networkError('remote hung up'),
        ),
      );

      await provider.frameHandler(
        {
          query: {
            env: 'development',
            code: microsoftApi.generateAuthCode(
              'email openid profile User.Read',
            ),
            state,
          },
          cookies: {
            'microsoft-nonce': nonce,
          },
        } as unknown as express.Request,
        response,
      );

      expect(response.end).toHaveBeenCalledWith(
        expect.stringContaining(
          encodeURIComponent(
            JSON.stringify({
              type: 'authorization_response',
              response: {
                providerInfo: {
                  accessToken: microsoftApi.generateAccessToken(
                    'email openid profile User.Read',
                  ),
                  scope: 'email openid profile User.Read',
                  expiresInSeconds: 123,
                  idToken: 'header.e30K.microsoft',
                },
                profile: {
                  email: 'conrad@example.com',
                  displayName: 'Conrad',
                },
                backstageIdentity: {
                  token: 'header.e30K.backstage',
                  identity: { type: 'user', ownershipEntityRefs: [] },
                },
              },
            }),
          ),
        ),
      );
    });
  });

  describe('#refresh', () => {
    it('returns provider info and profile with photo data', async () => {
      await provider.refresh!(
        {
          query: {
            env: 'development',
            scope: 'email openid profile User.Read',
          },
          header: jest.fn(_ => 'XMLHttpRequest'),
          cookies: {
            'microsoft-refresh-token': microsoftApi.generateRefreshToken(
              'email openid profile User.Read',
            ),
          },
          get: jest.fn(),
        } as unknown as express.Request,
        response,
      );

      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          providerInfo: {
            accessToken: microsoftApi.generateAccessToken(
              'email openid profile User.Read',
            ),
            scope: 'email openid profile User.Read',
            expiresInSeconds: 123,
            idToken: 'header.e30K.microsoft',
          },
          profile: {
            email: 'conrad@example.com',
            picture: 'data:image/jpeg;base64,aG93ZHk=',
            displayName: 'Conrad',
          },
        }),
      );
    });

    it('returns access token for non-microsoft graph scope', async () => {
      await provider.refresh!(
        {
          query: {
            env: 'development',
            scope: 'aks-audience/user.read',
          },
          header: jest.fn(_ => 'XMLHttpRequest'),
          cookies: {
            'microsoft-refresh-token': microsoftApi.generateRefreshToken(
              'aks-audience/user.read',
            ),
          },
          get: jest.fn(),
        } as unknown as express.Request,
        response,
      );

      expect(response.json).toHaveBeenCalledWith({
        providerInfo: {
          accessToken: microsoftApi.generateAccessToken(
            'aks-audience/user.read',
          ),
          expiresInSeconds: 123,
          scope: 'aks-audience/user.read',
        },
        profile: {},
      });
    });

    it('returns backstage identity', async () => {
      await provider.refresh!(
        {
          query: {
            env: 'development',
            scope: 'email openid profile User.Read',
          },
          header: jest.fn(_ => 'XMLHttpRequest'),
          cookies: {
            'microsoft-refresh-token': microsoftApi.generateRefreshToken(
              'email openid profile User.Read',
            ),
          },
          get: jest.fn(),
        } as unknown as express.Request,
        response,
      );

      expect(response.json).toHaveBeenCalledWith(
        expect.objectContaining({
          backstageIdentity: expect.objectContaining({
            token: 'header.e30K.backstage',
          }),
        }),
      );
    });
  });
});
