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

import { DispatchingKubernetesAuthTranslator } from './DispatchingKubernetesAuthTranslator';
import { ClusterDetails } from '../types';
import { KubernetesRequestAuth } from '@backstage/plugin-kubernetes-common';
import { KubernetesAuthTranslator } from './types';

describe('decorateClusterDetailsWithAuth', () => {
  let authTranslator: DispatchingKubernetesAuthTranslator;
  let mockTranslator: jest.Mocked<KubernetesAuthTranslator>;
  const authObject: KubernetesRequestAuth = {};

  beforeEach(() => {
    mockTranslator = { decorateClusterDetailsWithAuth: jest.fn() };
    authTranslator = new DispatchingKubernetesAuthTranslator({
      authTranslatorMap: { google: mockTranslator },
    });
  });

  it('can decorate cluster details if the auth provider is in the translator map', () => {
    const expectedClusterDetails: ClusterDetails = {
      url: 'notanything.com',
      name: 'randomName',
      authProvider: 'google',
      serviceAccountToken: 'added by mock translator',
    };

    mockTranslator.decorateClusterDetailsWithAuth.mockReturnValue(
      expectedClusterDetails as unknown as Promise<ClusterDetails>,
    );

    const returnedValue = authTranslator.decorateClusterDetailsWithAuth(
      { name: 'googleCluster', url: 'anything.com', authProvider: 'google' },
      authObject,
    );

    expect(mockTranslator.decorateClusterDetailsWithAuth).toHaveBeenCalledWith(
      { name: 'googleCluster', url: 'anything.com', authProvider: 'google' },
      authObject,
    );
    expect(returnedValue).toBe(expectedClusterDetails);
  });

  it('throws an error when asked for an auth translator for an unsupported auth type', () => {
    expect(() =>
      authTranslator.decorateClusterDetailsWithAuth(
        {
          name: 'test-cluster',
          url: 'anything.com',
          authProvider: 'linode',
        },
        authObject,
      ),
    ).toThrow(
      'authProvider "linode" has no KubernetesAuthTranslator associated with it',
    );
  });
});
