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
import { AccessToken, TokenCredential } from '@azure/identity';
import { MicrosoftEntraIdStrategy } from './MicrosoftEntraIdStrategy';
import { mockServices } from '@backstage/backend-test-utils';
import { ClusterDetails } from '@backstage/plugin-kubernetes-node';
import { ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE } from '@backstage/plugin-kubernetes-common';

const logger = mockServices.logger.mock();
const mockConfig = {
  auth: {
    providers: {
      microsoft: {
        test: {
          tenantId: 'microsoft-entra-id-enterprise-application-tenant-id',
          clientId: 'microsoft-entra-id-enterprise-application-client-id',
          clientSecret:
            'microsoft-entra-id-enterprise-application-client-secret',
        },
      },
    },
  },
  kubernetes: {
    auth: {
      providers: {
        microsoft: {
          test: {
            scope: 'microsoft-enterprise-app-id/mapped.permission',
          },
        },
      },
    },
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

class ScopeCapturingTokenCredential implements TokenCredential {
  public lastScope: string | undefined;

  constructor(private expiryInMs: number) {}

  getToken(scope: string | string[]): Promise<AccessToken | null> {
    this.lastScope = Array.isArray(scope) ? scope[0] : scope;
    return Promise.resolve({
      token: `TOKEN_FOR_${this.lastScope}`,
      expiresOnTimestamp: Date.now() + this.expiryInMs,
    });
  }
}

const clusterWithoutAnnotation: ClusterDetails = {
  name: 'test-cluster',
  url: 'https://localhost:6443',
  authMetadata: {},
};

describe('MicrosoftEntraIdStrategy tests', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  const config = new ConfigReader(mockConfig);

  it('should get Azure token', async () => {
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(5 * 60 * 1000),
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });
  });

  it('should re-use token before expiry', async () => {
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(20 * 60 * 1000),
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });
  });

  it('should issue new token 15 minutes befory expiry', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // token expires in 16min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2mins

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });
  });

  it('should re-use existing token if there is afailure', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // new tokens expires in 16min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential3 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential3).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    const credential4 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential4).toEqual({ type: 'bearer token', token: 'MY_TOKEN_4' });
  });

  it('should throw if existing token expired and failed to fetch a new one', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // new tokens expires in 16min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance time by 2min

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 17 * 60 * 1000); // advance time by 17min

    await expect(
      strategy.getCredential(clusterWithoutAnnotation),
    ).rejects.toThrow();
  });

  it('should use annotation scope when present in authMetadata', async () => {
    const tokenCredential = new ScopeCapturingTokenCredential(20 * 60 * 1000);
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      tokenCredential,
    );

    const clusterWithAnnotation: ClusterDetails = {
      name: 'annotated-cluster',
      url: 'https://localhost:6443',
      authMetadata: {
        [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]:
          'custom-app-id/.default',
      },
    };

    const credential = await strategy.getCredential(clusterWithAnnotation);
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'TOKEN_FOR_custom-app-id/.default',
    });
    expect(tokenCredential.lastScope).toBe('custom-app-id/.default');
  });

  it('should fall back to config scope when annotation is empty string', async () => {
    const tokenCredential = new ScopeCapturingTokenCredential(20 * 60 * 1000);
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      tokenCredential,
    );

    const clusterWithEmptyAnnotation: ClusterDetails = {
      name: 'empty-annotation-cluster',
      url: 'https://localhost:6443',
      authMetadata: {
        [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]: '',
      },
    };

    const credential = await strategy.getCredential(clusterWithEmptyAnnotation);
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'TOKEN_FOR_microsoft-enterprise-app-id/mapped.permission',
    });
    expect(tokenCredential.lastScope).toBe(
      'microsoft-enterprise-app-id/mapped.permission',
    );
  });
});
