/*
 * Copyright 2025 The Backstage Authors
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
import { ConfigReader } from '@backstage/config';
import { ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE } from '@backstage/plugin-kubernetes-common';
import { AccessToken, TokenCredential } from '@azure/identity';
import { MicrosoftEntraIdStrategy } from './MicrosoftEntraIdStrategy';
import { mockServices } from '@backstage/backend-test-utils';

const logger = mockServices.logger.mock();
const mockConfig = {
  data: {
    auth: {
      providers: {
        microsoft: {
          development: {
            tenantId: 'microsoft-entra-id-enterprise-application-tenant-id',
            clientId: 'microsoft-entra-id-enterprise-application-client-id',
            clientSecret:
              'microsoft-entra-id-enterprise-application-client-secret',
          },
        },
      },
    },
    kubernetes: {
      clusterLocatorMethods: [
        {
          type: 'config',
          clusters: [
            {
              title: 'Mocked Kubernetes cluster',
              name: 'cluster0',
              url: 'http://kubernetes-cluster.mock',
              authProvider: 'microsoft',
              microsoftEntraIdScope: 'microsoft-entra-id/scope.verb',
            },
          ],
        },
      ],
    },
  },
};

const mockClusterDetails = {
  name: 'test-cluster',
  url: '',
  authMetadata: {
    [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]:
      'microsoft-entra-id/scope.verb',
  },
};

class StaticTokenCredential implements TokenCredential {
  private count: number = 0;

  constructor(private expiryInMs: number) {}

  getToken(): Promise<AccessToken | null> {
    this.count++;

    if (this.count === 3) {
      return Promise.reject(new Error('Third time never works.'));
    }

    return Promise.resolve({
      token: `MY_TOKEN_${this.count}`,
      expiresOnTimestamp: Date.now() + this.expiryInMs,
    });
  }
}

describe('MicrosoftEntraIdStrategy tests', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const config = new ConfigReader(mockConfig);

  it('should get Microsoft Entra Id token', async () => {
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(5 * 60 * 1000),
    );

    const credential = await strategy.getCredential(mockClusterDetails);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });
  });

  it('should re-use token before expiry', async () => {
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(20 * 60 * 1000),
    );

    const credential = await strategy.getCredential(mockClusterDetails);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    const credential2 = await strategy.getCredential(mockClusterDetails);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });
  });

  it('should issue new token 15 minutes befory expiry', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // token expires in 16min
    );

    const credential = await strategy.getCredential(mockClusterDetails);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2mins

    const credential2 = await strategy.getCredential(mockClusterDetails);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });
  });

  it('should re-use existing token if there is afailure', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // new tokens expires in 16min
    );

    const credential = await strategy.getCredential(mockClusterDetails);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential2 = await strategy.getCredential(mockClusterDetails);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential3 = await strategy.getCredential(mockClusterDetails);
    expect(credential3).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    const credential4 = await strategy.getCredential(mockClusterDetails);
    expect(credential4).toEqual({ type: 'bearer token', token: 'MY_TOKEN_4' });
  });

  it('should throw if existing token expired and failed to fetch a new one', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // new tokens expires in 16min
    );

    const credential = await strategy.getCredential(mockClusterDetails);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential2 = await strategy.getCredential(mockClusterDetails);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 17 * 60 * 1000); // advance time by 17min

    await expect(strategy.getCredential(mockClusterDetails)).rejects.toThrow();
  });
});
