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

import '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
} from '@backstage/plugin-kubernetes-common';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { ClusterDetails } from '../types/types';
import { AuthenticationStrategy } from '../auth';

describe('ConfigClusterLocator', () => {
  let authStrategy: jest.Mocked<AuthenticationStrategy>;

  beforeEach(() => {
    authStrategy = {
      getCredential: jest.fn(),
      validateCluster: jest.fn().mockReturnValue([]),
      presentAuthMetadata: jest.fn(),
    };
  });

  it('empty clusters returns empty cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual([]);
  });

  it('one clusters returns one cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
      },
    ]);
  });

  it('two clusters returns two cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          serviceAccountToken: 'token',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
          skipTLSVerify: false,
          skipMetricsLookup: true,
          dashboardUrl: 'https://k8s.foo.com',
        },
        {
          name: 'cluster2',
          url: 'http://localhost:8081',
          authProvider: 'google',
          skipTLSVerify: true,
          skipMetricsLookup: false,
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        dashboardUrl: 'https://k8s.foo.com',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          serviceAccountToken: 'token',
        },
        skipTLSVerify: false,
        skipMetricsLookup: true,
        caData: undefined,
        caFile: undefined,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:8081',
        authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
        skipTLSVerify: true,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
    ]);
  });

  it('copies "assumeRole" config value into metadata', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'aws',
          assumeRole: 'SomeRole',
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);
    const result = await sut.getClusters();

    expect(result).toMatchObject([
      {
        authMetadata: expect.objectContaining({
          [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'SomeRole',
        }),
      },
    ]);
  });

  it('copies "externalId" config value into metadata', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'aws',
          externalId: 'SomeExternalId',
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);
    const result = await sut.getClusters();

    expect(result).toMatchObject([
      {
        authMetadata: expect.objectContaining({
          [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'SomeExternalId',
        }),
      },
    ]);
  });

  it('reads custom authMetadata', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster',
          url: 'http://url',
          authProvider: 'authProvider',
          authMetadata: { 'custom-key': 'custom-value' },
        },
      ],
    });

    const result = await ConfigClusterLocator.fromConfig(
      config,
      authStrategy,
    ).getClusters();

    expect(result).toMatchObject([
      {
        authMetadata: expect.objectContaining({ 'custom-key': 'custom-value' }),
      },
    ]);
  });

  it('reads authProvider from metadata block', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster',
          url: 'http://url',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
          },
        },
      ],
    });

    const result = await ConfigClusterLocator.fromConfig(
      config,
      authStrategy,
    ).getClusters();

    expect(result).toMatchObject([
      {
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
      },
    ]);
  });

  it('prefers authMetadata block to top-level keys', async () => {
    const sut = ConfigClusterLocator.fromConfig(
      new ConfigReader({
        clusters: [
          {
            name: 'cluster',
            url: 'http://url',
            authProvider: 'aws',
            authMetadata: {
              [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
            },
          },
        ],
      }),
      authStrategy,
    );

    const result = await sut.getClusters();

    expect(result).toMatchObject([
      {
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
      },
    ]);
  });

  it('forbids cluster without auth provider', () => {
    const config: Config = new ConfigReader({
      clusters: [{ name: 'cluster', url: 'http://url' }],
    });

    expect(() => ConfigClusterLocator.fromConfig(config, authStrategy)).toThrow(
      `cluster 'cluster' has no auth provider configured; this must be specified` +
        ` via the 'authProvider' or ` +
        `'authMetadata.${ANNOTATION_KUBERNETES_AUTH_PROVIDER}' parameter`,
    );
  });

  it('one cluster with dashboardParameters', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
          dashboardApp: 'gke',
          dashboardParameters: {
            projectId: 'some-project',
            region: 'some-region',
            clusterName: 'cluster1',
          },
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
        dashboardApp: 'gke',
        dashboardParameters: {
          projectId: 'some-project',
          region: 'some-region',
          clusterName: 'cluster1',
        },
      },
    ]);
  });

  it('one cluster with dashboardUrl', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
          dashboardApp: 'standard',
          dashboardUrl: 'http://someurl',
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
        dashboardApp: 'standard',
        dashboardUrl: 'http://someurl',
      },
    ]);
  });

  it('has cluster level defined customResources returns clusterDetails with those CRDs', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'serviceAccount',
          customResources: [
            {
              group: 'argoproj.io',
              apiVersion: 'v1alpha1',
              plural: 'rollouts',
            },
          ],
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config, authStrategy);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'serviceAccount',
        },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
        customResources: [
          {
            group: 'argoproj.io',
            apiVersion: 'v1alpha1',
            plural: 'rollouts',
          },
        ],
      },
    ]);
  });

  it('wraps validation errors from auth strategy', () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          url: 'http://localhost:8080',
          authProvider: 'authProvider',
        },
      ],
    });
    authStrategy.validateCluster.mockReturnValue([new Error('mock error')]);

    expect(() => ConfigClusterLocator.fromConfig(config, authStrategy)).toThrow(
      `Invalid cluster 'cluster1': mock error`,
    );
  });

  it('fails on duplicate cluster names', () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster',
          url: 'url',
          authProvider: 'authProvider',
        },
        {
          name: 'cluster',
          url: 'url',
          authProvider: 'authProvider',
        },
      ],
    });

    expect(() => ConfigClusterLocator.fromConfig(config, authStrategy)).toThrow(
      `Duplicate cluster name 'cluster'`,
    );
  });
});
