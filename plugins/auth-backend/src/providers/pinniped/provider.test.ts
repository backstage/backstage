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
import { OAuthStartRequest } from '../../lib/oauth';
import { AuthResolverContext } from '../types';
import { PinnipedAuthProvider, PinnipedOptions } from './provider';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ClientMetadata, IssuerMetadata } from 'openid-client';

describe('PinnipedAuthProvider', () => {
  let startRequest: OAuthStartRequest;
  let fakeSession: Record<string, any>;
  let provider: PinnipedAuthProvider;

  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const issuerMetadata = {
    issuer: 'https://pinniped.test',
    authorization_endpoint: 'https://pinniped.test/oauth2/authorize',
    token_endpoint: 'https://pinniped.test/oauth2/token',
    revocation_endpoint: 'https://pinniped.test/oauth2/revoke_token',
    userinfo_endpoint: 'https://pinniped.test/idp/userinfo.openid',
    introspection_endpoint: 'https://pinniped.test/introspect.oauth2',
    jwks_uri: 'https://pinniped.test/pf/JWKS',
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

  const clientMetadata: PinnipedOptions = {
    federationDomain: 'https://federationDomain.test',
    clientId: 'clientId.test',
    clientSecret: 'secret.test',
    callbackUrl: 'https://federationDomain.test/callback',
    resolverContext: {} as AuthResolverContext,
    authHandler: async () => ({
      profile: {},
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    fakeSession = {};
    startRequest = {
      session: fakeSession,
      method: 'GET',
      url: 'test',
    } as unknown as OAuthStartRequest;

    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });

    worker.use(
      rest.all(
        'https://federationDomain.test/.well-known/openid-configuration',
        handler,
      ),
    );

    provider = new PinnipedAuthProvider(clientMetadata);
  });

  it('hits the metadata url', async () => {
    const handler = jest.fn((_req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.set('Content-Type', 'application/json'),
        ctx.json(issuerMetadata),
      );
    });

    worker.use(
      rest.get(
        'https://federationDomain.test/.well-known/openid-configuration',
        handler,
      ),
    );

    provider = new PinnipedAuthProvider(clientMetadata);

    const { strategy } = (await (provider as any).implementation) as any as {
      strategy: {
        _client: ClientMetadata;
        _issuer: IssuerMetadata;
      };
    };

    expect(handler).toHaveBeenCalledTimes(1);
    expect(strategy._client.client_id).toBe(clientMetadata.clientId);
    expect(strategy._issuer.token_endpoint).toBe(issuerMetadata.token_endpoint);
  });

  describe('/start', () => {
    it('redirects to authorization endpoint returned from federationDomain config value', async () => {
      const startResponse = await provider.start(startRequest);
      const url = new URL(startResponse.url);

      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('pinniped.test');
      expect(url.pathname).toBe('/oauth2/authorize');
    });

    it('passes client ID from config', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('client_id')).toBe('clientId.test');
    });

    it('passes callback URL', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('redirect_uri')).toBe(
        'https://federationDomain.test/callback',
      );
    });

    it('generates PKCE challenge', async () => {
      const startResponse = await provider.start(startRequest);
      const { searchParams } = new URL(startResponse.url);

      expect(searchParams.get('code_challenge_method')).toBe('S256');
      expect(searchParams.get('code_challenge')).not.toBeNull();
    });

    it('stores PKCE verifier in session', async () => {
      await provider.start(startRequest);
      expect(fakeSession['oidc:pinniped.test'].code_verifier).toBeDefined();
    });

    it('fails when request has no session', async () => {
      return expect(
        provider.start({
          method: 'GET',
          url: 'test',
        } as unknown as OAuthStartRequest),
      ).rejects.toThrow('authentication requires session support');
    });
  });
});
