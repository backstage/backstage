/*
 * Copyright 2026 The Backstage Authors
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
import { JsonObject } from '@backstage/types';
import { AccessToken, TokenCredential } from '@azure/identity';
import { MicrosoftEntraIdStrategy } from './MicrosoftEntraIdStrategy';

const clientSecretCredentialMock = jest.fn();

jest.mock('@azure/identity', () => {
  const actual = jest.requireActual('@azure/identity');
  return {
    ...actual,
    ClientSecretCredential: jest.fn().mockImplementation((...args) => {
      clientSecretCredentialMock(...args);
      return {
        getToken: jest.fn().mockResolvedValue({
          token: 'CLIENT_SECRET_TOKEN',
          expiresOnTimestamp: Date.now() + 20 * 60 * 1000,
        }),
      };
    }),
  };
});

import { mockServices } from '@backstage/backend-test-utils';
import { ClusterDetails } from '@backstage/plugin-kubernetes-node';
import { ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE } from '@backstage/plugin-kubernetes-common';

const logger = mockServices.logger.mock();

// `kubernetes.auth.environment` defaults to `development` when unset.
const env = 'development';
const mockConfig = {
  kubernetes: {
    auth: {
      providers: {
        microsoft: {
          [env]: {
            tenantId: 'microsoft-entra-id-enterprise-application-tenant-id',
            clientId: 'microsoft-entra-id-enterprise-application-client-id',
            clientSecret:
              'microsoft-entra-id-enterprise-application-client-secret',
            scope: 'microsoft-enterprise-app-id/mapped.permission',
            allowedScopes: [
              {
                scope: 'microsoft-enterprise-app-id/mapped.permission',
                clusterUrls: ['localhost'],
              },
              { scope: 'custom-app-id/.default', clusterUrls: ['localhost'] },
              { scope: 'api://my-app-id/.default', clusterUrls: ['localhost'] },
              {
                scope: 'https://graph.microsoft.com/.default',
                clusterUrls: ['localhost'],
              },
            ],
          },
        },
      },
    },
  },
};

const allowedDefaultScope = [
  {
    scope: 'microsoft-enterprise-app-id/mapped.permission',
    clusterUrls: ['localhost'],
  },
];

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

  it('should get Microsoft Entra ID token', async () => {
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

  it('should issue new token 15 minutes before expiry', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // expires in 16 min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance 2 min

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });
  });

  it('should re-use existing token if there is a failure', async () => {
    jest.useFakeTimers();

    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      new StaticTokenCredential(16 * 60 * 1000), // expires in 16 min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance 2 min

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance 2 min

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
      new StaticTokenCredential(16 * 60 * 1000), // expires in 16 min
    );

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({ type: 'bearer token', token: 'MY_TOKEN_1' });

    jest.setSystemTime(Date.now() + 2 * 60 * 1000); // advance 2 min

    const credential2 = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential2).toEqual({ type: 'bearer token', token: 'MY_TOKEN_2' });

    jest.setSystemTime(Date.now() + 17 * 60 * 1000); // advance 17 min

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

  it('should accept api:// and https:// scopes and reject malformed scopes', async () => {
    const tokenCredential = new ScopeCapturingTokenCredential(20 * 60 * 1000);
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      tokenCredential,
    );

    const clusterWithApiScope: ClusterDetails = {
      name: 'api-scope-cluster',
      url: 'https://localhost:6443',
      authMetadata: {
        [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]:
          'api://my-app-id/.default',
      },
    };
    const apiCredential = await strategy.getCredential(clusterWithApiScope);
    expect(apiCredential).toEqual({
      type: 'bearer token',
      token: 'TOKEN_FOR_api://my-app-id/.default',
    });
    expect(tokenCredential.lastScope).toBe('api://my-app-id/.default');

    const clusterWithHttpsScope: ClusterDetails = {
      name: 'https-scope-cluster',
      url: 'https://localhost:6443',
      authMetadata: {
        [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]:
          'https://graph.microsoft.com/.default',
      },
    };
    const httpsCredential = await strategy.getCredential(clusterWithHttpsScope);
    expect(httpsCredential).toEqual({
      type: 'bearer token',
      token: 'TOKEN_FOR_https://graph.microsoft.com/.default',
    });
    expect(tokenCredential.lastScope).toBe(
      'https://graph.microsoft.com/.default',
    );

    const clusterWithInvalidScope: ClusterDetails = {
      name: 'invalid-scope-cluster',
      url: 'https://localhost:6443',
      authMetadata: {
        [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]: 'invalid scope!value',
      },
    };
    await expect(
      strategy.getCredential(clusterWithInvalidScope),
    ).rejects.toThrow('Invalid Microsoft Entra ID scope');
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

  it('should read client credentials from the kubernetes-specific config location', async () => {
    clientSecretCredentialMock.mockClear();

    const kubernetesSpecificConfig = new ConfigReader({
      kubernetes: {
        auth: {
          providers: {
            microsoft: {
              [env]: {
                tenantId: 'kubernetes-tenant-id',
                clientId: 'kubernetes-client-id',
                clientSecret: 'kubernetes-client-secret',
                scope: 'microsoft-enterprise-app-id/mapped.permission',
                allowedScopes: allowedDefaultScope,
              },
            },
          },
        },
      },
    });

    const strategy = new MicrosoftEntraIdStrategy(logger, {
      config: kubernetesSpecificConfig,
    });

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'CLIENT_SECRET_TOKEN',
    });
    expect(clientSecretCredentialMock).toHaveBeenCalledWith(
      'kubernetes-tenant-id',
      'kubernetes-client-id',
      'kubernetes-client-secret',
    );
  });

  it('should resolve the environment from kubernetes.auth.environment', async () => {
    clientSecretCredentialMock.mockClear();

    const environmentConfig = new ConfigReader({
      kubernetes: {
        auth: {
          environment: 'production',
          providers: {
            microsoft: {
              production: {
                tenantId: 'production-tenant-id',
                clientId: 'production-client-id',
                clientSecret: 'production-client-secret',
                scope: 'microsoft-enterprise-app-id/mapped.permission',
                allowedScopes: allowedDefaultScope,
              },
            },
          },
        },
      },
    });

    const strategy = new MicrosoftEntraIdStrategy(logger, {
      config: environmentConfig,
    });

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'CLIENT_SECRET_TOKEN',
    });
    expect(clientSecretCredentialMock).toHaveBeenCalledWith(
      'production-tenant-id',
      'production-client-id',
      'production-client-secret',
    );
  });

  it('should throw when the kubernetes-specific credentials are missing', async () => {
    clientSecretCredentialMock.mockClear();

    const missingCredentialsConfig = new ConfigReader({
      kubernetes: {
        auth: {
          providers: {
            microsoft: {
              [env]: {
                scope: 'microsoft-enterprise-app-id/mapped.permission',
                allowedScopes: allowedDefaultScope,
              },
            },
          },
        },
      },
    });

    const strategy = new MicrosoftEntraIdStrategy(logger, {
      config: missingCredentialsConfig,
    });

    await expect(
      strategy.getCredential(clusterWithoutAnnotation),
    ).rejects.toThrow(`kubernetes.auth.providers.microsoft.${env}.tenantId`);
    expect(clientSecretCredentialMock).not.toHaveBeenCalled();
  });

  it('should retry after credential initialization fails', async () => {
    clientSecretCredentialMock.mockClear();

    const microsoftConfig: JsonObject = {
      scope: 'microsoft-enterprise-app-id/mapped.permission',
      allowedScopes: allowedDefaultScope,
    };
    const strategy = new MicrosoftEntraIdStrategy(logger, {
      config: new ConfigReader({
        kubernetes: {
          auth: { providers: { microsoft: { [env]: microsoftConfig } } },
        },
      }),
    });

    await expect(
      strategy.getCredential(clusterWithoutAnnotation),
    ).rejects.toThrow(`kubernetes.auth.providers.microsoft.${env}.tenantId`);

    Object.assign(microsoftConfig, {
      tenantId: 'tenant-id',
      clientId: 'client-id',
      clientSecret: 'client-secret',
    });

    const credential = await strategy.getCredential(clusterWithoutAnnotation);
    expect(credential).toEqual({
      type: 'bearer token',
      token: 'CLIENT_SECRET_TOKEN',
    });
    expect(clientSecretCredentialMock).toHaveBeenCalledTimes(1);
  });

  it('should share one token request between concurrent requests', async () => {
    const tokenCredential = new StaticTokenCredential(20 * 60 * 1000);
    const getToken = jest.spyOn(tokenCredential, 'getToken');
    const strategy = new MicrosoftEntraIdStrategy(
      logger,
      { config: config },
      tokenCredential,
    );

    const credentials = await Promise.all([
      strategy.getCredential(clusterWithoutAnnotation),
      strategy.getCredential(clusterWithoutAnnotation),
    ]);

    const expected = { type: 'bearer token', token: 'MY_TOKEN_1' };
    expect(credentials).toEqual([expected, expected]);
    expect(getToken).toHaveBeenCalledTimes(1);
  });

  describe('allowed scopes', () => {
    const aksScope = '6dae42f8-4368-4678-94ff-3960e28e3630/.default';
    const k8sAppScope = 'api://my-k8s-app-id/.default';

    class CountingTokenCredential extends ScopeCapturingTokenCredential {
      public calls = 0;

      getToken(scope: string | string[]): Promise<AccessToken | null> {
        this.calls++;
        return super.getToken(scope);
      }
    }

    function createStrategy(
      microsoftConfig: JsonObject,
      tokenCredential: TokenCredential,
    ) {
      return new MicrosoftEntraIdStrategy(
        logger,
        {
          config: new ConfigReader({
            kubernetes: {
              auth: { providers: { microsoft: { [env]: microsoftConfig } } },
            },
          }),
        },
        tokenCredential,
      );
    }

    function cluster(url: string, scope?: string): ClusterDetails {
      return {
        name: 'cluster',
        url,
        authMetadata: scope
          ? { [ANNOTATION_KUBERNETES_MICROSOFT_ENTRA_ID_SCOPE]: scope }
          : {},
      };
    }

    const bindings = {
      scope: aksScope,
      allowedScopes: [
        { scope: aksScope, clusterUrls: ['*.azmk8s.io'] },
        { scope: k8sAppScope, clusterUrls: ['k8s.example.com'] },
        { scope: k8sAppScope, clusterUrls: ['k8s-dr.example.com'] },
      ],
    };

    it('should issue tokens for allowed scopes and cluster hostnames', async () => {
      const tokenCredential = new CountingTokenCredential(20 * 60 * 1000);
      const strategy = createStrategy(bindings, tokenCredential);

      await expect(
        strategy.getCredential(
          cluster('https://myaks-abc123.hcp.eastus.azmk8s.io:443'),
        ),
      ).resolves.toEqual({
        type: 'bearer token',
        token: `TOKEN_FOR_${aksScope}`,
      });
      expect(tokenCredential.lastScope).toBe(aksScope);

      await expect(
        strategy.getCredential(cluster('https://MYAKS.HCP.EASTUS.AZMK8S.IO')),
      ).resolves.toEqual({
        type: 'bearer token',
        token: `TOKEN_FOR_${aksScope}`,
      });

      await expect(
        strategy.getCredential(cluster('https://k8s.example.com', k8sAppScope)),
      ).resolves.toEqual({
        type: 'bearer token',
        token: `TOKEN_FOR_${k8sAppScope}`,
      });

      // Entries naming the same scope combine their hostname patterns
      await expect(
        strategy.getCredential(
          cluster('https://k8s-dr.example.com:6443', k8sAppScope),
        ),
      ).resolves.toEqual({
        type: 'bearer token',
        token: `TOKEN_FOR_${k8sAppScope}`,
      });
    });

    it('should not request a token when the cluster hostname is not allowed for the scope', async () => {
      const tokenCredential = new CountingTokenCredential(20 * 60 * 1000);
      const strategy = createStrategy(bindings, tokenCredential);

      for (const url of [
        'https://evil.example.net',
        'https://k8s.example.com',
        'https://evilazmk8s.io',
        'not a url',
      ]) {
        await expect(strategy.getCredential(cluster(url))).rejects.toThrow(
          /Refusing to issue a Microsoft Entra ID token/,
        );
      }
      await expect(
        strategy.getCredential(cluster('https://evil.example.net')),
      ).rejects.toThrow(
        `scope '${aksScope}' is not allowed for cluster host 'evil.example.net'`,
      );
      expect(tokenCredential.calls).toBe(0);

      // A token cached for an allowed host is not handed to a disallowed host
      await expect(
        strategy.getCredential(cluster('https://myaks.hcp.eastus.azmk8s.io')),
      ).resolves.toEqual({
        type: 'bearer token',
        token: `TOKEN_FOR_${aksScope}`,
      });
      await expect(
        strategy.getCredential(cluster('https://evil.example.net')),
      ).rejects.toThrow(/not allowed for cluster host/);
      expect(tokenCredential.calls).toBe(1);
    });

    it('should not request a token when the scope is not allowed', async () => {
      const tokenCredential = new CountingTokenCredential(20 * 60 * 1000);

      const strategy = createStrategy(bindings, tokenCredential);
      await expect(
        strategy.getCredential(
          cluster(
            'https://myaks.hcp.eastus.azmk8s.io',
            'api://attacker-app/.default',
          ),
        ),
      ).rejects.toThrow(
        "scope 'api://attacker-app/.default' is not allowed for cluster host",
      );

      const unlistedDefaultScope = createStrategy(
        { ...bindings, scope: 'api://unlisted-app/.default' },
        tokenCredential,
      );
      await expect(
        unlistedDefaultScope.getCredential(
          cluster('https://myaks.hcp.eastus.azmk8s.io'),
        ),
      ).rejects.toThrow(
        "scope 'api://unlisted-app/.default' is not allowed for cluster host",
      );

      expect(tokenCredential.calls).toBe(0);
    });

    it('should not request a token when no allowed scopes are configured', async () => {
      const tokenCredential = new CountingTokenCredential(20 * 60 * 1000);
      const strategy = createStrategy({ scope: aksScope }, tokenCredential);

      await expect(
        strategy.getCredential(cluster('https://myaks.hcp.eastus.azmk8s.io')),
      ).rejects.toThrow(
        `kubernetes.auth.providers.microsoft.${env}.allowedScopes`,
      );
      expect(tokenCredential.calls).toBe(0);
    });
  });
});
