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
import { KubernetesClientProvider } from './KubernetesClientProvider';
import { ClusterDetails } from '../types/types';
import * as https from 'https';
import mockFs from 'mock-fs';

describe('KubernetesClientProvider', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  afterEach(() => {
    mockFs.restore();
  });

  it('can get core client by cluster details', () => {
    const sut = new KubernetesClientProvider();
    const getKubeConfig = jest.spyOn(sut, 'getKubeConfig');

    const clusterDetails: ClusterDetails = {
      name: 'cluster-name',
      url: 'http://localhost:9999',
      serviceAccountToken: 'TOKEN',
      authProvider: 'serviceAccount',
    };
    const result = sut.getCoreClientByClusterDetails(clusterDetails);

    expect(result.basePath).toBe('http://localhost:9999');
    // These fields aren't on the type but are there
    const auth = (result as any).authentications.default;
    expect(auth.users[0].token).toBe('TOKEN');
    expect(auth.clusters[0].name).toBe('cluster-name');
    expect(auth.clusters[0].skipTLSVerify).toBe(false);

    expect(getKubeConfig).toHaveBeenCalledTimes(1);
  });

  it('can get custom objects client by cluster details', () => {
    const sut = new KubernetesClientProvider();
    const getKubeConfig = jest.spyOn(sut, 'getKubeConfig');

    const clusterDetails: ClusterDetails = {
      name: 'cluster-name',
      url: 'http://localhost:9999',
      serviceAccountToken: 'TOKEN',
      authProvider: 'serviceAccount',
      skipTLSVerify: false,
    };
    const result = sut.getCustomObjectsClient(clusterDetails);

    expect(result.basePath).toBe('http://localhost:9999');
    // These fields aren't on the type but are there
    const auth = (result as any).authentications.default;
    expect(auth.users[0].token).toBe('TOKEN');
    expect(auth.clusters[0].name).toBe('cluster-name');

    expect(getKubeConfig).toHaveBeenCalledTimes(1);
  });

  it('respects caFile', async () => {
    mockFs({
      '/path/to/ca.crt': 'my-ca',
    });
    const clusterDetails: ClusterDetails = {
      name: 'cluster-name',
      url: 'https://localhost:9999',
      authProvider: 'serviceAccount',
      serviceAccountToken: 'TOKEN',
      caFile: '/path/to/ca.crt',
    };
    const kubeConfig = new KubernetesClientProvider().getKubeConfig(
      clusterDetails,
    );

    const options: https.RequestOptions = {};
    await kubeConfig.applytoHTTPSOptions(options);

    expect(options.ca?.toString()).toEqual('my-ca');
  });
});
