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

import { AccessToken, TokenCredential } from '@azure/identity';
import { AzureIdentityKubernetesAuthTranslator } from './AzureIdentityKubernetesAuthTranslator';

class StaticTokenCredential implements TokenCredential {
  private count: number = 0;

  constructor(private expiryInMs: number) {}

  getToken(): Promise<AccessToken | null> {
    this.count++;

    return Promise.resolve({
      token: `MY_TOKEN_${this.count}`,
      expiresOnTimestamp: Date.now() + this.expiryInMs,
    });
  }
}

describe('AzureIdentityKubernetesAuthTranslator tests', () => {
  const cd = {
    authProvider: 'Azure',
    name: 'My Cluster',
    url: 'mycluster.privatelink.westeurope.azmk8s.io',
  };

  it('should decorate cluster with Azure token', async () => {
    const authTranslator = new AzureIdentityKubernetesAuthTranslator(
      new StaticTokenCredential(5 * 60 * 1000),
    );

    const response = await authTranslator.decorateClusterDetailsWithAuth(cd);
    expect(response.serviceAccountToken).toEqual('MY_TOKEN_1');
  });

  it('should re-use token before expiry', async () => {
    const authTranslator = new AzureIdentityKubernetesAuthTranslator(
      new StaticTokenCredential(5 * 60 * 1000),
    );

    const response = await authTranslator.decorateClusterDetailsWithAuth(cd);
    expect(response.serviceAccountToken).toEqual('MY_TOKEN_1');

    const response2 = await authTranslator.decorateClusterDetailsWithAuth(cd);
    expect(response2.serviceAccountToken).toEqual('MY_TOKEN_1');
  });

  it('should issue new token 2 minutes befory expiry', async () => {
    const authTranslator = new AzureIdentityKubernetesAuthTranslator(
      new StaticTokenCredential(3 * 60 * 1000), // token expires in 3m
    );

    const response = await authTranslator.decorateClusterDetailsWithAuth(cd);
    expect(response.serviceAccountToken).toEqual('MY_TOKEN_1');

    jest.useFakeTimers().setSystemTime(Date.now() + 1 * 60 * 1000); // advance time by 1min

    const response2 = await authTranslator.decorateClusterDetailsWithAuth(cd);
    expect(response2.serviceAccountToken).toEqual('MY_TOKEN_2');
  });
});
