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

import { OAuthApi, OpenIdConnectApi } from '@backstage/core-plugin-api';
import { KubernetesRequestBody } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthProviders } from './KubernetesAuthProviders';

class MockAuthApi implements OAuthApi, OpenIdConnectApi {
  constructor(private readonly token: string) {}

  getAccessToken = jest.fn(async () => {
    return this.token;
  });

  getIdToken = jest.fn(async () => {
    return this.token;
  });
}

const requestBody: KubernetesRequestBody = {
  entity: {
    apiVersion: 'v1',
    kind: 'service',
    metadata: { name: 'test' },
  },
};

describe('KubernetesAuthProviders tests', () => {
  const kap = new KubernetesAuthProviders({
    googleAuthApi: new MockAuthApi('googleToken'),
    oidcProviders: {
      okta: new MockAuthApi('oktaToken'),
    },
  });

  it('adds token to request body for google authProvider', async () => {
    const details = await kap.decorateRequestBodyForAuth('google', requestBody);

    expect(details.auth?.google).toBe('googleToken');
  });

  it('adds token to request body for oidc authProvider', async () => {
    const details = await kap.decorateRequestBodyForAuth(
      'oidc.okta',
      requestBody,
    );

    expect(details.auth?.oidc?.okta).toBe('oktaToken');
  });

  it('returns error for unknown authProvider', async () => {
    await expect(
      kap.decorateRequestBodyForAuth('unknown', requestBody),
    ).rejects.toThrow(
      'authProvider "unknown" has no KubernetesAuthProvider defined for it',
    );
  });

  it('returns error for missconfigured oidc authProvider', async () => {
    await expect(
      kap.decorateRequestBodyForAuth('oidc.random', requestBody),
    ).rejects.toThrow(
      'KubernetesAuthProviders has no oidcProvider configured for oidc.random',
    );
  });
});
