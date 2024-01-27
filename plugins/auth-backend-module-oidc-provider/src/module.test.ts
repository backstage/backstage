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
import { decodeOAuthState } from '@backstage/plugin-auth-node';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import {
  mockServices,
  setupRequestMockHandlers,
  startTestBackend,
} from '@backstage/backend-test-utils';
import { Server } from 'http';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { authModuleOidcProvider } from './module';

describe('authModuleOidcProvider', () => {
  let backstageServer: Server;
  let appUrl: string;
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
                expires_in: 3600,
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
              picture: 'http://testPictureUrl/photo.jpg',
            }),
          ),
      ),
    );

    const backend = await startTestBackend({
      features: [
        authModuleOidcProvider,
        import('@backstage/plugin-auth-backend'),
        mockServices.rootConfig.factory({
          data: {
            app: { baseUrl: 'http://localhost' },
            auth: {
              session: { secret: 'test' },
              providers: {
                oidc: {
                  development: {
                    metadataUrl:
                      'https://oidc.test/.well-known/openid-configuration',
                    clientId: 'clientId',
                    clientSecret: 'clientSecret',
                  },
                },
              },
            },
          },
        }),
      ],
    });

    backstageServer = backend.server;
    const port = backend.server.port();
    appUrl = `http://localhost:${port}`;
    mswServer.use(rest.all(`http://*:${port}/*`, req => req.passthrough()));
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
      domain: 'localhost',
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
    const startResponse = await agent.get(
      `${appUrl}/api/auth/oidc/start?env=development`,
    );
    const authorizationResponse = await agent.get(
      startResponse.header.location,
    );
    const handlerResponse = await agent.get(
      authorizationResponse.header.location,
    );

    expect(handlerResponse.text).toContain(
      encodeURIComponent(`"accessToken":"accessToken"`),
    );
  });
});
