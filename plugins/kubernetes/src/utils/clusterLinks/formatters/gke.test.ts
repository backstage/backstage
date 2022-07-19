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
import { gkeFormatter } from './gke';

describe('clusterLinks - GKE formatter', () => {
  it('should provide a dashboardParameters in the options', () => {
    expect(() =>
      gkeFormatter({
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).toThrowError('GKE dashboard requires a dashboardParameters option');
  });
  it('should provide a projectId in the dashboardParameters options', () => {
    expect(() =>
      gkeFormatter({
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
    ).toThrowError(
      'GKE dashboard requires a "projectId" of type string in the dashboardParameters option',
    );
  });
  it('should provide a region in the dashboardParameters options', () => {
    expect(() =>
      gkeFormatter({
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
    ).toThrowError(
      'GKE dashboard requires a "region" of type string in the dashboardParameters option',
    );
  });
  it('should provide a clusterName in the dashboardParameters options', () => {
    expect(() =>
      gkeFormatter({
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
    ).toThrowError(
      'GKE dashboard requires a "clusterName" of type string in the dashboardParameters option',
    );
  });
  it('should return an url on the cluster when there is a namespace only', () => {
    const url = gkeFormatter({
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
  it('should return an url on the cluster when the kind is not recognizeed', () => {
    const url = gkeFormatter({
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
  it('should return an url on the deployment', () => {
    const url = gkeFormatter({
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

  it('should return an url on the service', () => {
    const url = gkeFormatter({
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
  it('should return an url on the pod', () => {
    const url = gkeFormatter({
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
  it('should return an url on the ingress', () => {
    const url = gkeFormatter({
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
  it('should return an url on the deployment for a hpa', () => {
    const url = gkeFormatter({
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
