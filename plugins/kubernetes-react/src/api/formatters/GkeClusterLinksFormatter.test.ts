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

import { GkeClusterLinksFormatter } from './GkeClusterLinksFormatter';

describe('clusterLinks - GKE formatter', () => {
  describe('without googleAuthApi provided', () => {
    const formatter = new GkeClusterLinksFormatter(undefined);

    it('should provide a dashboardParameters in the options', async () => {
      await expect(
        formatter.formatClusterLink({
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        }),
      ).rejects.toThrow('GKE dashboard requires a dashboardParameters option');
    });
    it('should provide a projectId in the dashboardParameters options', async () => {
      await expect(
        formatter.formatClusterLink({
          dashboardParameters: {
            region: 'us-east1-c',
            clusterName: 'cluster-1',
          },
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        }),
      ).rejects.toThrow(
        'GKE dashboard requires a "projectId" of type string in the dashboardParameters option',
      );
    });
    it('should provide a region in the dashboardParameters options', async () => {
      await expect(
        formatter.formatClusterLink({
          dashboardParameters: {
            projectId: 'foobar-333614',
            clusterName: 'cluster-1',
          },
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        }),
      ).rejects.toThrow(
        'GKE dashboard requires a "region" of type string in the dashboardParameters option',
      );
    });
    it('should provide a clusterName in the dashboardParameters options', async () => {
      await expect(() =>
        formatter.formatClusterLink({
          dashboardParameters: {
            projectId: 'foobar-333614',
            region: 'us-east1-c',
          },
          object: {
            metadata: {
              name: 'foobar',
              namespace: 'bar',
            },
          },
          kind: 'Deployment',
        }),
      ).rejects.toThrow(
        'GKE dashboard requires a "clusterName" of type string in the dashboardParameters option',
      );
    });
    it('should return an url on the cluster when there is a namespace only', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            namespace: 'bar',
          },
        },
        kind: 'foo',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/clusters/details/us-east1-c/cluster-1/details?project=foobar-333614',
      );
    });
    it('should return an url on the cluster when the kind is not recognized', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'UnknownKind',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/clusters/details/us-east1-c/cluster-1/details?project=foobar-333614',
      );
    });
    it('should return an url on the deployment', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/deployment/us-east1-c/cluster-1/bar/foobar/overview?project=foobar-333614',
      );
    });

    it('should return an url on the service', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Service',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/service/us-east1-c/cluster-1/bar/foobar/overview?project=foobar-333614',
      );
    });
    it('should return an url on the pod', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Pod',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/pod/us-east1-c/cluster-1/bar/foobar/details?project=foobar-333614',
      );
    });
    it('should return an url on the ingress', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Ingress',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/ingress/us-east1-c/cluster-1/bar/foobar/details?project=foobar-333614',
      );
    });
    it('should return an url on the deployment for a hpa', async () => {
      const url = await formatter.formatClusterLink({
        dashboardParameters: {
          projectId: 'foobar-333614',
          region: 'us-east1-c',
          clusterName: 'cluster-1',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'HorizontalPodAutoscaler',
      });
      expect(url.href).toBe(
        'https://console.cloud.google.com/kubernetes/deployment/us-east1-c/cluster-1/bar/foobar/overview?project=foobar-333614',
      );
    });
  });
  describe('with googleAuthApi provided', () => {
    const object = {
      dashboardParameters: {
        projectId: 'foobar-333614',
        region: 'us-east1-c',
        clusterName: 'cluster-1',
      },
      object: {
        metadata: {
          namespace: 'bar',
        },
      },
      kind: 'foo',
    };
    it('should not fail, when undefined is returned as profile', async () => {
      const formatter = new GkeClusterLinksFormatter({
        getProfile: async _ => undefined,
      });
      const url = await formatter.formatClusterLink(object);
      expect(url.searchParams.has('authuser')).toBeFalsy();
    });
    it('should not fail, when profile returns no email', async () => {
      const formatter = new GkeClusterLinksFormatter({
        getProfile: async _ => ({ email: undefined }),
      });
      const url = await formatter.formatClusterLink(object);
      expect(url.searchParams.has('authuser')).toBeFalsy();
    });
    it('should add authuser with email when provided', async () => {
      const email = 'email@example.com';
      const formatter = new GkeClusterLinksFormatter({
        getProfile: async _ => ({ email }),
      });
      const url = await formatter.formatClusterLink(object);
      expect(url.searchParams.get('authuser')).toBe(email);
    });
  });
});
