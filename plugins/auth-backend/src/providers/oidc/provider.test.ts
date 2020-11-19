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

import nock from 'nock';
import { ClientMetadata, IssuerMetadata } from 'openid-client';
import { OidcAuthProvider } from './provider';

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
  id_token_signing_alg_values_supported: ['RS256', 'RS512'],
  token_endpoint_auth_signing_alg_values_supported: ['RS256', 'RS512'],
  request_object_signing_alg_values_supported: ['RS256', 'RS512'],
};

const clientMetadata = {
  callbackUrl: 'https://oidc.test/callback',
  clientId: 'testclientid',
  clientSecret: 'testclientsecret',
  metadataUrl: 'https://oidc.test/.well-known/openid-configuration',
};

describe('OidcAuthProvider', () => {
  it('hit the metadataurl', async () => {
    const scope = nock('https://oidc.test')
      .get('/.well-known/openid-configuration')
      .reply(200, issuerMetadata);
    const provider = new OidcAuthProvider(clientMetadata);
    const strategy = ((await provider._strategy) as any) as {
      _client: ClientMetadata;
      _issuer: IssuerMetadata;
    };
    // Assert that the expected request to the metadaurl was made.
    expect(scope.isDone()).toBeTruthy();
    const { _client, _issuer } = strategy;
    expect(_client.client_id).toBe(clientMetadata.clientId);
    expect(_issuer.token_endpoint).toBe(issuerMetadata.token_endpoint);
  });
});
