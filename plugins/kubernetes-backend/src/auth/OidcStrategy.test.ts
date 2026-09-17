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

import { ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER } from '@backstage/plugin-kubernetes-common';
import { OidcStrategy } from './OidcStrategy';

describe('OidcStrategy', () => {
  let strategy: OidcStrategy;
  beforeEach(() => {
    strategy = new OidcStrategy();
  });

  describe('getCredential', () => {
    it('returns auth token', async () => {
      const credential = await strategy.getCredential(
        {
          name: 'test',
          url: '',
          authMetadata: {
            [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'okta',
          },
        },
        {
          oidc: { okta: 'fakeToken' },
        },
      );

      expect(credential).toStrictEqual({
        type: 'bearer token',
        token: 'fakeToken',
      });
    });

    it('fails when token provider is not configured', async () => {
      await expect(
        strategy.getCredential(
          {
            name: 'test',
            url: '',
            authMetadata: {},
          },
          {},
        ),
      ).rejects.toThrow(
        'oidc authProvider requires a configured oidcTokenProvider',
      );
    });

    it('fails when token is not included in request body', async () => {
      await expect(
        strategy.getCredential(
          {
            name: 'test',
            url: '',
            authMetadata: {
              [ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER]: 'okta',
            },
          },
          {},
        ),
      ).rejects.toThrow('Auth token not found under oidc.okta in request body');
    });
  });

  describe('validateCluster', () => {
    it('fails when token provider is not specified', () => {
      expect(strategy.validateCluster({})).toContainEqual(
        new Error(`Must specify a token provider for 'oidc' strategy`),
      );
    });
  });
});
