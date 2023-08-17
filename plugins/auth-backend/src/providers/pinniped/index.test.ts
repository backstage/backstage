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
import { pinniped } from '.';
import { AuthProviderRouteHandlers } from '../types';
import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { Server } from 'http';
import { AddressInfo } from 'net';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';
import Router from 'express-promise-router';
// import fetch from 'node-fetch';
import { SignJWT, exportJWK, generateKeyPair, importJWK } from 'jose';
import { v4 as uuid } from 'uuid';

describe('pinniped.create', () => {
  const fakePinnipedSupervisor = setupServer();
  setupRequestMockHandlers(fakePinnipedSupervisor);
  const nonce = 'AAAAAAAAAAAAAAAAAAAAAA=='; // 16 bytes of zeros in base64
  const state = Buffer.from(
    `nonce=${encodeURIComponent(nonce)}&env=development`,
  ).toString('hex');

  let app: express.Express;
  let provider: AuthProviderRouteHandlers;
  let backstageServer: Server;
  let appUrl: string;

  beforeEach(async () => {
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
    fakePinnipedSupervisor.use(
      rest.all(`${appUrl}/*`, req => req.passthrough()),
      rest.all(
        'https://pinniped.test/.well-known/openid-configuration',
        (_, res, ctx) =>
          res(
            ctx.json({
              issuer: 'https://pinniped.test',
              authorization_endpoint: 'https://pinniped.test/oauth2/authorize',
              token_endpoint: 'https://pinniped.test/oauth2/token',
              jwks_uri: 'https://pinniped.test/jwks.json',
              response_types_supported: ['code', 'access_token'],
              response_modes_supported: ['query', 'form_post'],
              subject_types_supported: ['public'],
              token_endpoint_auth_methods_supported: ['client_secret_basic'],
              id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256', 'ES256'],
              token_endpoint_auth_signing_alg_values_supported: [
                'RS256',
                'RS512',
                'HS256',
              ],
              request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
              scopes_supported: [
                'openid',
                'offline_access',
                'pinniped:request-audience',
                'username',
                'groups',
              ],
              claims_supported: ['username', 'groups', 'additionalClaims', 'sub'],
              code_challenge_methods_supported: ['S256'],
              'discovery.supervisor.pinniped.dev/v1alpha1': {
                pinniped_identity_providers_endpoint:
                  'https://pinniped.test/v1alpha1/pinniped_identity_providers',
              },
            }),
          ),
      ),
    );

    provider = pinniped.create()({
      providerId: 'pinniped',
      globalConfig: {
        baseUrl: `${appUrl}/api/auth`,
        appUrl,
        isOriginAllowed: _ => true,
      },
      config: new ConfigReader({
        development: {
          federationDomain: 'https://pinniped.test',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
        },
      }),
      logger: getVoidLogger(),
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
      .use('/api/auth/pinniped/start', provider.start.bind(provider))
      .use(
        '/api/auth/pinniped/handler/frame',
        provider.frameHandler.bind(provider),
      );
    app.use(router);
  });

  afterEach(() => {
    backstageServer.close();
  });

  it('/handler/frame exchanges authorization codes from /start for access tokens', async () => {
    const agent = request.agent('');
    // make a /start request
    //add query parameter for the audience
    const startResponse = await agent.get(
      `${appUrl}/api/auth/pinniped/start?env=development`,
    );
    // follow the redirect to pinniped authorization endpoint
    fakePinnipedSupervisor.use(
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
          // callbackUrl.searchParams.set(
          //   'scope',
          //   'test-scope',
          // );
          return res(
            ctx.status(302),
            ctx.set('Location', callbackUrl.toString()),
          );
        },
      ),
    );
    const authorizationResponse = await agent.get(
      startResponse.header.location,
    );

    // follow the redirect back to /handler/frame
    const sub = 'test';
    const iss = 'https://pinniped.test';
    const iat = Date.now();
    const aud = 'clientId';
    const exp = Date.now() + 10000;

    const key = await generateKeyPair('ES256');
    const publicKey = await exportJWK(key.publicKey);
    const privateKey = await exportJWK(key.privateKey);
    publicKey.kid = privateKey.kid = uuid();
    publicKey.alg = privateKey.alg = 'ES256';


    const jwt = await new SignJWT({ iss, sub, aud, iat, exp})
    .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
    .setIssuer(iss)
    .setAudience(aud)
    .setSubject(sub)
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(await importJWK(privateKey));




    fakePinnipedSupervisor.use(
      rest.post('https://pinniped.test/oauth2/token', async (req, res, ctx) =>
        res(
          // TODO verify client ID + secret, etc -- real token endpoint
          new URLSearchParams(await req.text()).get('code') ===
            'authorization_code'
            ? ctx.json({ access_token: 'accessToken', id_token: jwt })
            : ctx.status(401),
        ),
      ),
      rest.get('https://pinniped.test/jwks.json', async (_req, res, ctx) => 
        res(
          ctx.status(200),
          ctx.json({ "keys": [{...publicKey}]
          })
        ))
    );

    const handlerResponse = await agent.get(
      authorizationResponse.header.location,
    );
      //our assertion doesnt include a scope but the return type does...might need to change our assertion?
    expect(handlerResponse.text).toContain(
      encodeURIComponent(
        JSON.stringify({
          type: 'authorization_response',
          response: {
            providerInfo: {
              accessToken: 'accessToken',
              scope: "none"
            },
            profile: {},
          },
        }),
      ),
    );
  }, 70000);

  describe('#frameHandler', () => {
    it.skip('performs an rfc 8693 token exchange after getting access token', async () => {
      fakePinnipedSupervisor.use(
        rest.post('https://pinniped.test/oauth2/token', async (req, res, ctx) =>
          res(
            ctx.json(
              new URLSearchParams(await req.text()).get('grant_type') ===
                'urn:ietf:params:oauth:grant-type:token-exchange'
                ? { access_token: 'accessToken' }
                : { id_token: 'clusterToken' },
            ),
          ),
        ),
      );

      const responsePromise = request(app)
        .get(
          '/api/auth/pinniped/handler/frame?' +
            'code=pin_ac_xU69qZGejOCu8Loz5iOD6Bm25SgQewmT0VVE1hOAQzA.WzxrI9bCder5UJHtCOX_yEnsM2OVh8pVSFI7NPs5yUM&' +
            'scope=openid+pinniped%3Arequest-audience+username&' +
            `state=${state}`,
        )
        .set(
          'Cookie',
          `pinniped-nonce=${nonce}; ` +
            'connect.sid=s:p3_hKHiFr_i58jyTPIZxtWN9pejiOujD.SN2irLt6oIL18v0GzGCPO1sibEmzybiVlT9ca3ZjT68',
        );
      const reqUrl = new URL(responsePromise.url);
      reqUrl.search = '';
      fakePinnipedSupervisor.use(
        rest.all(reqUrl.toString(), req => req.passthrough()),
      );

      expect((await responsePromise).text).toContain(
        encodeURIComponent(
          JSON.stringify({
            type: 'authorization_response',
            response: {
              providerInfo: {
                idToken: 'clusterToken',
              },
              profile: {},
            },
          }),
        ),
      );
    });
  });
});
