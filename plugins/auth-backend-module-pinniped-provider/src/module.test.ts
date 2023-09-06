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
import request from 'supertest';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { Server } from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import { AddressInfo } from 'net';
import {
  AuthProviderRouteHandlers,
  createOAuthRouteHandlers,
} from '@backstage/plugin-auth-node';
import Router from 'express-promise-router';
import { pinnipedAuthenticator } from './authenticator';
import { ConfigReader } from '@backstage/config';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';

describe('authModulePinnipedProvider', () => {
  let app: express.Express;
  let backstageServer: Server;
  let appUrl: string;
  let providerRouteHandler: AuthProviderRouteHandlers;
  let idToken: string;
  let publicKey: JWK;

  const mswServer = setupServer();
  setupRequestMockHandlers(mswServer);

  const issuerMetadata = {
    issuer: 'https://pinniped.test',
    authorization_endpoint: 'https://pinniped.test/oauth2/authorize',
    token_endpoint: 'https://pinniped.test/oauth2/token',
    revocation_endpoint: 'https://pinniped.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://pinniped.test/idp/userinfo.openid',
    introspection_endpoint: 'https://pinniped.test/introspect.oauth2',
    jwks_uri: 'https://pinniped.test/jwks.json',
    scopes_supported: [
      'openid',
      'offline_access',
      'pinniped:request-audience',
      'username',
      'groups',
    ],
    claims_supported: ['email', 'username', 'groups', 'additionalClaims'],
    response_types_supported: ['code'],
    id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
    token_endpoint_auth_signing_alg_values_supported: [
      'RS256',
      'RS512',
      'HS256',
    ],
    request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  };

  const clusterScopedIdToken = 'dummy-token';

  beforeAll(async () => {
    const keyPair = await generateKeyPair('ES256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'ES256';

    idToken = await new SignJWT({
      sub: 'test',
      iss: 'https://pinniped.test',
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
        'https://federationDomain.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.status(200),
            ctx.set('Content-Type', 'application/json'),
            ctx.json(issuerMetadata),
          ),
      ),
      rest.get(
        'https://pinniped.test/oauth2/authorize',
        async (req, res, ctx) => {
          const callbackUrl = new URL(
            req.url.searchParams.get('redirect_uri')!,
          );
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
        },
      ),
      rest.get('https://pinniped.test/jwks.json', async (_req, res, ctx) =>
        res(ctx.status(200), ctx.json({ keys: [{ ...publicKey }] })),
      ),
      rest.post('https://pinniped.test/oauth2/token', async (req, res, ctx) => {
        const formBody = new URLSearchParams(await req.text());
        const isGrantTypeTokenExchange =
          formBody.get('grant_type') ===
          'urn:ietf:params:oauth:grant-type:token-exchange';
        const hasValidTokenExchangeParams =
          formBody.get('subject_token') === 'accessToken' &&
          formBody.get('audience') === 'test_cluster' &&
          formBody.get('subject_token_type') ===
            'urn:ietf:params:oauth:token-type:access_token' &&
          formBody.get('requested_token_type') ===
            'urn:ietf:params:oauth:token-type:jwt';

        return res(
          req.headers.get('Authorization') &&
            (!isGrantTypeTokenExchange || hasValidTokenExchangeParams)
            ? ctx.json({
                access_token: isGrantTypeTokenExchange
                  ? clusterScopedIdToken
                  : 'accessToken',
                refresh_token: 'refreshToken',
                ...(!isGrantTypeTokenExchange && { id_token: idToken }),
                scope: 'testScope',
              })
            : ctx.status(401),
        );
      }),
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
      authenticator: pinnipedAuthenticator,
      appUrl,
      baseUrl: `${appUrl}/api/auth`,
      isOriginAllowed: _ => true,
      providerId: 'pinniped',
      config: new ConfigReader({
        federationDomain: 'https://federationDomain.test',
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
        '/api/auth/pinniped/start',
        providerRouteHandler.start.bind(providerRouteHandler),
      )
      .use(
        '/api/auth/pinniped/handler/frame',
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
      `/api/auth/pinniped/start?env=development&audience=test_cluster`,
    );

    expect(startResponse.status).toBe(302);
  });

  it('/handler/frame exchanges authorization code from #start for Cluster Specific ID token', async () => {
    const agent = request.agent('');

    // make /start request with audience parameter
    const startResponse = await agent.get(
      `${appUrl}/api/auth/pinniped/start?env=development&audience=test_cluster`,
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
            profile: {},
            providerInfo: {
              idToken: clusterScopedIdToken,
              accessToken: 'accessToken',
              scope: 'testScope',
            },
          },
        }),
      ),
    );
  });
});
