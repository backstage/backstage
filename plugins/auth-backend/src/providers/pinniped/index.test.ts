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
import { getVoidLogger } from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

describe('pinniped.create', () => {
  const server = setupServer();
  setupRequestMockHandlers(server);

  describe('#start', () => {
    const nonce = 'AAAAAAAAAAAAAAAAAAAAAA=='; // 16 bytes of zeros in base64
    const state = Buffer.from(
      `nonce=${encodeURIComponent(nonce)}&env=development`,
    ).toString('hex');

    const randomBytes = jest.spyOn(
      crypto,
      'randomBytes',
    ) as unknown as jest.MockedFunction<(size: number) => Buffer>;

    afterEach(() => {
      randomBytes.mockRestore();
    });

    it('redirects to authorization endpoint returned from federationDomain config value', async () => {
      randomBytes.mockReturnValue(Buffer.from(nonce, 'base64'));
      server.use(
        rest.all(
          'https://pinniped.test/.well-known/openid-configuration',
          (_, res, ctx) =>
            res(
              ctx.json({
                issuer: 'https://pinniped.test',
                authorization_endpoint:
                  'https://pinniped.test/oauth2/authorize',
                token_endpoint: 'https://pinniped.test/oauth2/token',
                jwks_uri: 'https://pinniped.test/jwks.json',
                response_types_supported: ['code'],
                response_modes_supported: ['query', 'form_post'],
                subject_types_supported: ['public'],
                id_token_signing_alg_values_supported: ['ES256'],
                token_endpoint_auth_methods_supported: ['client_secret_basic'],
                scopes_supported: [
                  'openid',
                  'offline_access',
                  'pinniped:request-audience',
                  'username',
                  'groups',
                ],
                claims_supported: ['username', 'groups', 'additionalClaims'],
                code_challenge_methods_supported: ['S256'],
                'discovery.supervisor.pinniped.dev/v1alpha1': {
                  pinniped_identity_providers_endpoint:
                    'https://pinniped.test/v1alpha1/pinniped_identity_providers',
                },
              }),
            ),
        ),
      );

      const provider = pinniped.create()({
        providerId: 'pinniped',
        globalConfig: {
          baseUrl: 'http://backstage.test/api/auth',
          appUrl: 'http://backstage.test',
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

      const secret = 'secret';
      const app = express()
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
        .use(passport.session())
        .use('/api/auth/pinniped/start', provider.start.bind(provider));
      const responsePromise = request(app).get(
        '/api/auth/pinniped/start?' +
          'env=development&scope=openid+pinniped:request-audience+username',
      );
      const reqUrl = new URL(responsePromise.url);
      reqUrl.search = '';
      server.use(rest.all(reqUrl.toString(), req => req.passthrough()));

      const response = await responsePromise;
      expect((response as any).headers.location).toMatch(
        'https://pinniped.test/oauth2/authorize' +
          '?client_id=clientId' +
          `&scope=${encodeURIComponent(
            'openid pinniped:request-audience username',
          )}` +
          '&response_type=code' +
          `&redirect_uri=${encodeURIComponent(
            'http://backstage.test/api/auth/pinniped/handler/frame',
          )}` +
          `&state=${state}`,
      );
    });
  });
});
