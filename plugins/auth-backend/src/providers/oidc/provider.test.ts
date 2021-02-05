/*
 * Copyright 2020 Spotify AB
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

import express from 'express';
import { Session } from 'express-session';
import nock from 'nock';
import { ClientMetadata, IssuerMetadata } from 'openid-client';
import { createOidcProvider, OidcAuthProvider } from './provider';
import { JWT, JWK } from 'jose';
import { AuthProviderFactoryOptions } from '../types';
import { Config } from '@backstage/config';
import { OAuthAdapter } from '../../lib/oauth';

const issuerMetadata = {
  issuer: 'https://oidc.test',
  authorization_endpoint: 'https://oidc.test/as/authorization.oauth2',
  token_endpoint: 'https://oidc.test/as/token.oauth2',
  revocation_endpoint: 'https://oidc.test/as/revoke_token.oauth2',
  userinfo_endpoint: 'https://oidc.test/idp/userinfo.openid',
  introspection_endpoint: 'https://oidc.test/as/introspect.oauth2',
  jwks_uri: 'https://oidc.test/pf/JWKS',
  scopes_supported: ['openid'],
  claims_supported: ['email'],
  response_types_supported: ['code'],
  id_token_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  token_endpoint_auth_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
  request_object_signing_alg_values_supported: ['RS256', 'RS512', 'HS256'],
};

const clientMetadata = {
  callbackUrl: 'https://oidc.test/callback',
  clientId: 'testclientid',
  clientSecret: 'testclientsecret',
  metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
  tokenSignedResponseAlg: 'none',
};

describe('OidcAuthProvider', () => {
  it('hit the metadata url', async () => {
    const scope = nock('https://oidc.test')
      .get('/.well-known/openid-configuration')
      .reply(200, issuerMetadata);
    const provider = new OidcAuthProvider(clientMetadata);
    const { strategy } = ((await (provider as any).implementation) as any) as {
      strategy: {
        _client: ClientMetadata;
        _issuer: IssuerMetadata;
      };
    };
    // Assert that the expected request to the metadaurl was made.
    expect(scope.isDone()).toBeTruthy();
    const { _client, _issuer } = strategy;
    expect(_client.client_id).toBe(clientMetadata.clientId);
    expect(_issuer.token_endpoint).toBe(issuerMetadata.token_endpoint);
  });

  it('OidcAuthProvider#handler successfully invokes the oidc endpoints', async () => {
    const jwt = {
      sub: 'alice',
      iss: 'https://oidc.test',
      iat: Date.now(),
      aud: clientMetadata.clientId,
      exp: Date.now() + 10000,
    };
    const scope = nock('https://oidc.test')
      .get('/.well-known/openid-configuration')
      .reply(200, issuerMetadata)
      .post('/as/token.oauth2')
      .reply(200, {
        id_token: JWT.sign(jwt, JWK.None),
        access_token: 'test',
        authorization_signed_response_alg: 'HS256',
      })
      .get('/idp/userinfo.openid')
      .reply(200, {
        sub: 'alice',
        email: 'alice@oidc.test',
      });
    const provider = new OidcAuthProvider(clientMetadata);
    const req = {
      method: 'GET',
      url: 'https://oidc.test/?code=test2',
      session: ({ 'oidc:oidc.test': 'test' } as any) as Session,
    } as express.Request;
    await provider.handler(req);
    expect(scope.isDone()).toBeTruthy();
  });

  it('createOidcProvider', async () => {
    const scope = nock('https://oidc.test')
      .get('/.well-known/openid-configuration')
      .reply(200, issuerMetadata);
    const options = {
      globalConfig: {
        appUrl: 'https://oidc.test',
        baseUrl: 'https://oidc.test',
      },
      config: ({
        keys: jest.fn(() => ['test']),
        getConfig: jest.fn(() => ({
          getString: (key: string) => {
            const conf = {
              ...clientMetadata,
              metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
            } as any;
            return conf[key] as string;
          },
        })),
      } as any) as Config,
    } as AuthProviderFactoryOptions;
    const provider = createOidcProvider(options) as OAuthAdapter;
    expect(provider.start).toBeDefined();
    await new Promise(resolve => process.nextTick(resolve)); // advance a tick to give nock a chance to intercept the request
    expect(scope.isDone()).toBeTruthy();
  });
});
