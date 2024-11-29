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

describe('getCredential', () => {
  let strategy: DispatchStrategy;
  let mockStrategy: jest.Mocked<AuthenticationStrategy>;
  const authObject: KubernetesRequestAuth = {};

  beforeEach(() => {
    mockStrategy = {
      getCredential: jest.fn(),
      validateCluster: jest.fn(),
      presentAuthMetadata: jest.fn(),
    };
    strategy = new DispatchStrategy({
      authStrategyMap: { google: mockStrategy },
    });
  });

  it('gets credential if specified auth provider is in the strategy map', async () => {
    const clusterDetails: ClusterDetails = {
      url: 'notanything.com',
      name: 'randomName',
      authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
    };
    mockStrategy.getCredential.mockResolvedValue({
      type: 'bearer token',
      token: 'added by mock strategy',
    });

    const returnedValue = await strategy.getCredential(
      clusterDetails,
      authObject,
    );

    expect(mockStrategy.getCredential).toHaveBeenCalledWith(
      clusterDetails,
      authObject,
    );
    expect(returnedValue).toStrictEqual({
      type: 'bearer token',
      token: 'added by mock strategy',
    });
  });

  it('throws an error when asked for a strategy for an unsupported auth type', () => {
    expect(() =>
      strategy.getCredential(
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
