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

import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  KubernetesRequestAuth,
} from '@backstage/plugin-kubernetes-common';
import { DispatchStrategy } from './DispatchStrategy';
import { ClusterDetails } from '../types';
import { AuthenticationStrategy } from './types';

describe('decorateClusterDetailsWithAuth', () => {
  let strategy: DispatchStrategy;
  let mockStrategy: jest.Mocked<AuthenticationStrategy>;
  const authObject: KubernetesRequestAuth = {};

  beforeEach(() => {
    mockStrategy = {
      decorateClusterDetailsWithAuth: jest.fn(),
      validate: jest.fn(),
    };
    strategy = new DispatchStrategy({
      authStrategyMap: { google: mockStrategy },
    });
  });

  it('can decorate cluster details if the auth provider is in the strategy map', async () => {
    const expectedClusterDetails: ClusterDetails = {
      url: 'notanything.com',
      name: 'randomName',
      authMetadata: {
        [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google',
        serviceAccountToken: 'added by mock strategy',
      },
    };

    mockStrategy.decorateClusterDetailsWithAuth.mockResolvedValue(
      expectedClusterDetails,
    );

    const returnedValue = await strategy.decorateClusterDetailsWithAuth(
      {
        name: 'googleCluster',
        url: 'anything.com',
        authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
      },
      authObject,
    );

    expect(mockStrategy.decorateClusterDetailsWithAuth).toHaveBeenCalledWith(
      {
        name: 'googleCluster',
        url: 'anything.com',
        authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
      },
      authObject,
    );
    expect(returnedValue).toBe(expectedClusterDetails);
  });

  it('throws an error when asked for a strategy for an unsupported auth type', () => {
    expect(() =>
      strategy.decorateClusterDetailsWithAuth(
        {
          name: 'test-cluster',
          url: 'anything.com',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'linode' },
        },
        authObject,
      ),
    ).toThrow(
      'authProvider "linode" has no AuthenticationStrategy associated with it',
    );
  });
});
