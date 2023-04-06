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
import { ConfigClusterLocator } from './ConfigClusterLocator';

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

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: undefined,
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
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

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        dashboardUrl: 'https://k8s.foo.com',
        serviceAccountToken: 'token',
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
        skipTLSVerify: false,
        skipMetricsLookup: true,
        caData: undefined,
        caFile: undefined,
      },
      {
        name: 'cluster2',
        serviceAccountToken: undefined,
        url: 'http://localhost:8081',
        authProvider: 'google',
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

    expect(result).toStrictEqual([
      {
        assumeRole: undefined,
        name: 'cluster1',
        serviceAccountToken: 'token',
        externalId: undefined,
        url: 'http://localhost:8080',
        authProvider: 'aws',
        skipTLSVerify: false,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
      {
        assumeRole: 'SomeRole',
        name: 'cluster2',
        externalId: undefined,
        serviceAccountToken: undefined,
        url: 'http://localhost:8081',
        authProvider: 'aws',
        skipTLSVerify: true,
        skipMetricsLookup: false,
        caData: undefined,
        caFile: undefined,
      },
      {
        assumeRole: 'SomeRole',
        name: 'cluster2',
        externalId: 'SomeExternalId',
        url: 'http://localhost:8081',
        serviceAccountToken: undefined,
        authProvider: 'aws',
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

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: undefined,
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
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

    expect(result).toStrictEqual([
      {
        name: 'cluster1',
        serviceAccountToken: undefined,
        url: 'http://localhost:8080',
        authProvider: 'serviceAccount',
        skipMetricsLookup: false,
        skipTLSVerify: false,
        caData: undefined,
        caFile: undefined,
        dashboardApp: 'standard',
        dashboardUrl: 'http://someurl',
      },
    ]);
  });
});
