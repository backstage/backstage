/*
 * Copyright 2024 The Backstage Authors
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
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config, ConfigReader } from '@backstage/config';
import {
  AuthProviderConfig,
  AuthResolverContext,
  CookieConfigurer,
} from '@backstage/plugin-auth-node';
import express from 'express';
import { JWK, SignJWT, exportJWK, generateKeyPair } from 'jose';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { oidc } from './provider';

describe('oidc.create', () => {
  const userinfo = {
    sub: 'test',
    iss: 'https://oidc.test',
    aud: 'clientId',
    nonce: 'foo',
  };
  const server = setupServer();
  registerMswTestHooks(server);

  let publicKey: JWK;
  let tokenset: object;
  let providerFactoryOptions: {
    providerId: string;
    globalConfig: AuthProviderConfig;
    config: Config;
    logger: LoggerService;
    resolverContext: AuthResolverContext;
    baseUrl: string;
    appUrl: string;
    isOriginAllowed: (origin: string) => boolean;
    cookieConfigurer?: CookieConfigurer;
  };

  beforeAll(async () => {
    const keyPair = await generateKeyPair('RS256');
    const privateKey = await exportJWK(keyPair.privateKey);
    publicKey = await exportJWK(keyPair.publicKey);
    publicKey.alg = privateKey.alg = 'RS256';

    tokenset = {
      id_token: await new SignJWT({
        iat: Date.now(),
        exp: Date.now() + 10000,
        ...userinfo,
      })
        .setProtectedHeader({ alg: privateKey.alg, kid: privateKey.kid })
        .sign(keyPair.privateKey),
      access_token: 'accessToken',
    };
  });

  beforeEach(() => {
    server.use(
      rest.get(
        'https://oidc.test/.well-known/openid-configuration',
        (_req, res, ctx) =>
          res(
            ctx.json({
              issuer: 'https://oidc.test',
              token_endpoint: 'https://oidc.test/oauth2/token',
              userinfo_endpoint: 'https://oidc.test/idp/userinfo.openid',
              jwks_uri: 'https://oidc.test/jwks.json',
            }),
          ),
      ),
      rest.post('https://oidc.test/oauth2/token', (_req, res, ctx) =>
        res(ctx.json(tokenset)),
      ),
      rest.get('https://oidc.test/jwks.json', async (_req, res, ctx) =>
        res(ctx.json({ keys: [{ ...publicKey }] })),
      ),
      rest.get(
        'https://oidc.test/idp/userinfo.openid',
        async (_req, res, ctx) => res(ctx.json(userinfo)),
      ),
    );
    providerFactoryOptions = {
      providerId: 'myoidc',
      baseUrl: 'http://backstage.test/api/auth',
      appUrl: 'http://backstage.test',
      isOriginAllowed: _ => true,
      globalConfig: {
        baseUrl: 'http://backstage.test/api/auth',
        appUrl: 'http://backstage.test',
        isOriginAllowed: _ => true,
      },
      config: new ConfigReader({
        development: {
          metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
          clientId: 'clientId',
          clientSecret: 'clientSecret',
        },
      }),
      logger: mockServices.logger.mock(),
      resolverContext: {
        issueToken: jest.fn(),
        findCatalogUser: jest.fn(),
        signInWithCatalogUser: jest.fn(),
        resolveOwnershipEntityRefs: jest.fn(),
      },
    };
  });

  it('invokes authHandler with tokenset and userinfo response', async () => {
    const authHandler = jest.fn();
    const provider = oidc.create({ authHandler })(providerFactoryOptions);
    const state = Buffer.from('nonce=foo&env=development').toString('hex');

    await provider.frameHandler(
      {
        method: 'GET',
        url: `http://backstage.test/api/auth/myoidc/handler/frame?code=blahblah&state=${state}`,
        query: { state },
        cookies: { 'myoidc-nonce': 'foo' },
        session: { 'oidc:oidc.test': { state, nonce: 'foo' } },
      } as unknown as express.Request,
      { setHeader: jest.fn(), end: jest.fn() } as unknown as express.Response,
    );

    expect(authHandler).toHaveBeenCalledWith(
      { tokenset, userinfo },
      providerFactoryOptions.resolverContext,
    );
  });

  it('invokes sign-in resolver with tokenset and userinfo response', async () => {
    const resolver = jest.fn();
    const provider = oidc.create({ signIn: { resolver } })(
      providerFactoryOptions,
    );
    const state = Buffer.from('nonce=foo&env=development').toString('hex');

    await provider.frameHandler(
      {
        method: 'GET',
        url: `http://backstage.test/api/auth/myoidc/handler/frame?code=blahblah&state=${state}`,
        query: { state },
        cookies: { 'myoidc-nonce': 'foo' },
        session: { 'oidc:oidc.test': { state, nonce: 'foo' } },
      } as unknown as express.Request,
      { setHeader: jest.fn(), end: jest.fn() } as unknown as express.Response,
    );

    expect(resolver).toHaveBeenCalledWith(
      expect.objectContaining({ result: { tokenset, userinfo } }),
      providerFactoryOptions.resolverContext,
    );
  });
});
