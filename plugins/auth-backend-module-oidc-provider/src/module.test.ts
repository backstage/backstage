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

import request from 'supertest';
import {
  AuthProviderRouteHandlers,
  AuthResolverContext,
  createOAuthRouteHandlers,
  decodeOAuthState,
} from '@backstage/plugin-auth-node';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { Server } from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import { oidcAuthenticator } from './authenticator';
import { ConfigReader } from '@backstage/config';
import Router from 'express-promise-router';

describe('authModuleOidcProvider', () => {
  let app: express.Express;
  let backstageServer: Server;
  let appUrl: string;
  let providerRouteHandler: AuthProviderRouteHandlers;
  let idToken: string;
  let publicKey: JWK;

  const mswServer = setupServer();
  setupRequestMockHandlers(mswServer);

  const issuerMetadata = {
    issuer: 'https://oidc.test',
    authorization_endpoint: 'https://oidc.test/oauth2/authorize',
    token_endpoint: 'https://oidc.test/oauth2/token',
    revocation_endpoint: 'https://oidc.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://oidc.test/idp/userinfo.openid',
    introspection_endpoint: 'https://oidc.test/as/introspect.oauth2',
    jwks_uri: 'https://oidc.test/jwks.json',
    scopes_supported: ['openid'],
    claims_supported: ['email'],
    response_types_supported: ['code'],
    id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
    token_endpoint_auth_signing_alg_values_supported: [
      'RS256',
      'RS512',
      'HS256',
    ],
    request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  };

  beforeAll(async () => {
    const keyPair = await generateKeyPair('RS256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'RS256';

    idToken = await new SignJWT({
      sub: 'test',
      iss: 'https://oidc.test',
      iat: Date.now(),
      aud: 'clientId',
      exp: Date.now() + 10000,
    })
      .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
      .sign(keyPair.privateKey);
  });

  beforeEach(async () => {
    jest.clearAllMocks();

    mswServer.use(
      rest.get(
        'https://oidc.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(issuerMetadata),
          ),
      ),
      rest.get('https://oidc.test/oauth2/authorize', async (req, res, ctx) => {
        const callbackUrl = new URL(req.url.searchParams.get('redirect_uri')!);
        callbackUrl.searchParams.set('code', 'authorization_code');
        callbackUrl.searchParams.set(
          'state',
          req.url.searchParams.get('state')!,
        );
        callbackUrl.searchParams.set('scope', 'test-scope');
        return res(
          ctx.status(302),
          ctx.set('Location', callbackUrl.toString()),
        );
      }),
      rest.get('https://oidc.test/jwks.json', async (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ keys: [{ ...publicKey }] })),
      ),
      rest.post('https://oidc.test/oauth2/token', async (req, res, ctx) => {
        return res(
          req.headers.get('Authorization')
            ? ctx.json({
                access_token: 'accessToken',
                id_token: idToken,
                refresh_token: 'refreshToken',
                scope: 'testScope',
                token_type: '',
              })
            : ctx.status(401),
        );
      }),
      rest.get(
        'https://oidc.test/idp/userinfo.openid',
        async (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.json({
              sub: 'test',
              name: 'Alice Adams',
              given_name: 'Alice',
              family_name: 'Adams',
              email: 'alice@test.com',
            }),
          ),
      ),
    );

    const secret = 'secret';
    app = express()
      .use(cookieParser(secret))
      .use(
        session({
          secret,
          saveUninitialized: false,
          resave: false,
          cookie: { secure: false },
        }),
      )
      .use(passport.initialize())
      .use(passport.session());
    await new Promise(resolve => {
      backstageServer = app.listen(0, '0.0.0.0', () => {
        appUrl = `http://127.0.0.1:${
          (backstageServer.address() as AddressInfo).port
        }`;
        resolve(null);
      });
    });

    mswServer.use(rest.all(`${appUrl}/*`, req => req.passthrough()));

    providerRouteHandler = createOAuthRouteHandlers({
      authenticator: oidcAuthenticator,
      appUrl,
      baseUrl: `${appUrl}/api/auth`,
      isOriginAllowed: _ => true,
      providerId: 'oidc',
      config: new ConfigReader({
        metadataUrl: 'https://oidc.test',
        clientId: 'clientId',
        clientSecret: 'clientSecret',
      }),
      resolverContext: {
        issueToken: async _ => ({ token: '' }),
        findCatalogUser: async _ => ({
          entity: {
            apiVersion: '',
            kind: '',
            metadata: { name: '' },
          },
        }),
        signInWithCatalogUser: async _ => ({ token: '' }),
      },
    });

    const router = Router();
    router
      .use(
        '/api/auth/oidc/start',
        providerRouteHandler.start.bind(providerRouteHandler),
      )
      .use(
        '/api/auth/oidc/handler/frame',
        providerRouteHandler.frameHandler.bind(providerRouteHandler),
      );
    app.use(router);
  });

  afterEach(() => {
    backstageServer.close();
  });

  it('should start', async () => {
    const agent = request.agent(backstageServer);

    const startResponse = await agent.get(
      `/api/auth/oidc/start?env=development`,
    );
    expect(startResponse.status).toEqual(302);

    const nonceCookie = agent.jar.getCookie('oidc-nonce', {
      domain: '127.0.0.1',
      path: '/api/auth/oidc/handler',
      script: false,
      secure: false,
    });
    expect(nonceCookie).toBeDefined();

    const startUrl = new URL(startResponse.get('location'));
    expect(startUrl.origin).toBe('https://oidc.test');
    expect(startUrl.pathname).toBe('/oauth2/authorize');
    expect(Object.fromEntries(startUrl.searchParams)).toEqual({
      response_type: 'code',
      scope: 'openid profile email',
      client_id: 'clientId',
      redirect_uri: `${appUrl}/api/auth/oidc/handler/frame`,
      state: expect.any(String),
      prompt: 'none',
      code_challenge: expect.any(String),
      code_challenge_method: `S256`,
    });

    expect(decodeOAuthState(startUrl.searchParams.get('state')!)).toEqual({
      env: 'development',
      nonce: decodeURIComponent(nonceCookie.value),
    });
  });

  it('#authenticate exchanges authorization code for a access_token', async () => {
    const agent = request.agent('');

    // make /start request with audience parameter
    const startResponse = await agent.get(
      `${appUrl}/api/auth/oidc/start?env=development`,
    );
    // follow redirect to authorization endpoint
    const authorizationResponse = await agent.get(
      startResponse.header.location,
    );
    // follow redirect to token_endpoint
    const handlerResponse = await agent.get(
      authorizationResponse.header.location,
    );

    expect(handlerResponse.text).toContain(
      encodeURIComponent(
        JSON.stringify({
          type: 'authorization_response',
          response: {
            profile: {
              displayName: 'Alice Adams',
            },
            providerInfo: {
              accessToken: 'accessToken',
              scope: 'testScope',
              expiresInSeconds: 3600,
            },
          },
        }),
      ),
    );
  });
});
