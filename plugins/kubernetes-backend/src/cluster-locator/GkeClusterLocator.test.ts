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

import { ANNOTATION_KUBERNETES_AUTH_PROVIDER } from '@backstage/plugin-kubernetes-common';
import '@backstage/backend-common';
import { ConfigReader, Config } from '@backstage/config';
import { GkeClusterLocator } from './GkeClusterLocator';
import * as container from '@google-cloud/container';

const mockedListClusters = jest.fn();
jest.mock('@google-cloud/container', () => {
  return {
    v1: {
      ClusterManagerClient: jest.fn().mockImplementation(() => {
        mockedListClusters();
      }),
    },
  };
});

describe('GkeClusterLocator', () => {
  beforeEach(() => {
    mockedListClusters.mockRestore();
  });
  describe('config-parsing', () => {
    it('should accept missing region', async () => {
      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      expect(mockedListClusters).toHaveBeenCalledTimes(0);
    });
    it('should not accept missing projectId', async () => {
      const config: Config = new ConfigReader({
        type: 'gke',
      });

      expect(() =>
        GkeClusterLocator.fromConfigWithClient(config, {
          listClusters: mockedListClusters,
        } as any),
      ).toThrow("Missing required config value at 'projectId'");

      expect(mockedListClusters).toHaveBeenCalledTimes(0);
    });
  });
  describe('listClusters', () => {
    it('empty clusters returns empty cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('1 cluster returns 1 cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
        skipMetricsLookup: true,
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: true,
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('use region wildcard when no region provided', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/-',
      });
    });
    it('2 cluster returns 2 cluster details', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
            {
              name: 'some-other-cluster',
              endpoint: '6.7.8.9',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
        {
          name: 'some-other-cluster',
          url: 'https://6.7.8.9',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('dont filter out clusters when no label matcher provided', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
              resourceLabels: {
                foo: 'bar',
              },
            },
            {
              name: 'some-other-cluster',
              endpoint: '6.7.8.9',
              resourceLabels: {
                something: 'other',
              },
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
        {
          name: 'some-other-cluster',
          url: 'https://6.7.8.9',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('filter out clusters without matching resource labels', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
              resourceLabels: {
                foo: 'bar',
              },
            },
            {
              name: 'some-other-cluster',
              endpoint: '6.7.8.9',
              resourceLabels: {
                something: 'other',
              },
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
        matchingResourceLabels: [
          {
            key: 'foo',
            value: 'bar',
          },
        ],
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('Handle errors gracefully', async () => {
      mockedListClusters.mockImplementation(() => {
        throw new Error('some error');
      });

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      await expect(sut.getClusters()).rejects.toThrow(
        'There was an error retrieving clusters from GKE for projectId=some-project region=some-region; caused by Error: some error',
      );

      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('expose GKE dashboard', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        region: 'some-region',
        skipMetricsLookup: true,
        exposeDashboard: true,
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: true,
          dashboardApp: 'gke',
          dashboardParameters: {
            clusterName: 'some-cluster',
            projectId: 'some-project',
            region: 'some-region',
          },
        },
      ]);
      expect(mockedListClusters).toHaveBeenCalledTimes(1);
      expect(mockedListClusters).toHaveBeenCalledWith({
        parent: 'projects/some-project/locations/some-region',
      });
    });
    it('return google login when no authProvider is specified', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
    });
    it('return googleServiceAccount login when authProvider is specified', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        authProvider: 'googleServiceAccount',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: {
            [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'googleServiceAccount',
          },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
    });
    it('return google login when authProvider property has invalid value', async () => {
      mockedListClusters.mockReturnValueOnce([
        {
          clusters: [
            {
              name: 'some-cluster',
              endpoint: '1.2.3.4',
            },
          ],
        },
      ]);

      const config: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
        authProvider: 'differentValue',
      });

      const sut = GkeClusterLocator.fromConfigWithClient(config, {
        listClusters: mockedListClusters,
      } as any);

      const result = await sut.getClusters();

      expect(result).toStrictEqual([
        {
          name: 'some-cluster',
          url: 'https://1.2.3.4',
          authMetadata: { [ANNOTATION_KUBERNETES_AUTH_PROVIDER]: 'google' },
          skipTLSVerify: false,
          skipMetricsLookup: false,
        },
      ]);
    });
    it('constructs ClusterManagerClient with identifying metadata', async () => {
      const configs: Config = new ConfigReader({
        type: 'gke',
        projectId: 'some-project',
      });

      GkeClusterLocator.fromConfig(configs);

      expect(container.v1.ClusterManagerClient).toHaveBeenCalledWith({
        libName: 'backstage/kubernetes-backend.GkeClusterLocator',
        libVersion: expect.any(String),
      });
    });
  });
});
