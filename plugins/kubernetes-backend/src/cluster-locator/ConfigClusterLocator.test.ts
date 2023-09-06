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
  ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE,
  ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID,
} from '@backstage/plugin-kubernetes-common';
import { ConfigClusterLocator } from './ConfigClusterLocator';
import { ClusterDetails } from '../types/types';

describe('ConfigClusterLocator', () => {
  it('empty clusters returns empty cluster details', async () => {
    const config: Config = new ConfigReader({
      clusters: [],
    });

    const sut = ConfigClusterLocator.fromConfig(config);

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

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: { authProvider: 'serviceAccount' },
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

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        dashboardUrl: 'https://k8s.foo.com',
        url: 'http://localhost:8080',
        authMetadata: {
          authProvider: 'serviceAccount',
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
        authMetadata: { authProvider: 'google' },
        skipTLSVerify: true,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
    ]);
  });

  it('one aws cluster with assumeRole and one without', async () => {
    const config: Config = new ConfigReader({
      clusters: [
        {
          name: 'cluster1',
          serviceAccountToken: 'token',
          url: 'http://localhost:8080',
          authProvider: 'aws',
          skipTLSVerify: false,
        },
        {
          assumeRole: 'SomeRole',
          name: 'cluster2',
          url: 'http://localhost:8081',
          authProvider: 'aws',
          skipTLSVerify: true,
        },
        {
          assumeRole: 'SomeRole',
          name: 'cluster2',
          externalId: 'SomeExternalId',
          url: 'http://localhost:8081',
          authProvider: 'aws',
          skipTLSVerify: true,
        },
      ],
    });

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: {
          authProvider: 'aws',
          serviceAccountToken: 'token',
        },
        skipTLSVerify: false,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:8081',
        authMetadata: {
          authProvider: 'aws',
          [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'SomeRole',
        },
        skipTLSVerify: true,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
      {
        name: 'cluster2',
        url: 'http://localhost:8081',
        authMetadata: {
          authProvider: 'aws',
          [ANNOTATION_KUBERNETES_AWS_ASSUME_ROLE]: 'SomeRole',
          [ANNOTATION_KUBERNETES_AWS_EXTERNAL_ID]: 'SomeExternalId',
        },
        skipTLSVerify: true,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
    ]);
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

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: { authProvider: 'serviceAccount' },
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

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: { authProvider: 'serviceAccount' },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
        dashboardApp: 'standard',
        dashboardUrl: 'http://someurl',
      },
    ]);
  });

  it('supports aks authProvider', async () => {
    const sut = ConfigClusterLocator.fromConfig(
      new ConfigReader({
        clusters: [
          {
            name: 'aks-cluster',
            url: 'https://aks.test',
            authProvider: 'aks',
          },
        ],
      }),
    );

    const result = await sut.getClusters();

    expect(result).toStrictEqual([
      {
        name: 'aks-cluster',
        url: 'https://aks.test',
        authMetadata: { authProvider: 'aks' },
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
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

    const sut = ConfigClusterLocator.fromConfig(config);

    const result = await sut.getClusters();

    expect(result).toStrictEqual<ClusterDetails[]>([
      {
        name: 'cluster1',
        url: 'http://localhost:8080',
        authMetadata: { authProvider: 'serviceAccount' },
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

  // TODO move this to a test on OidcStrategy#validate
  it('errors when authProvider is oidc but oidcTokenProvider is missing', async () => {
    expect(() =>
      ConfigClusterLocator.fromConfig(
        new ConfigReader({
          clusters: [
            {
              name: 'oidc-cluster',
              url: 'https://aks.test',
              authProvider: 'oidc',
            },
          ],
        }),
      ),
    ).toThrow(
      `Invalid cluster 'oidc-cluster': Must specify a token provider for 'oidc' strategy`,
    );
  });
});
