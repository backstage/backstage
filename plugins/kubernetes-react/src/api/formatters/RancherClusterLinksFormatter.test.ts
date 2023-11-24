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

import { RancherClusterLinksFormatter } from './RancherClusterLinksFormatter';

describe('clusterLinks - rancher formatter', () => {
  const formatter = new RancherClusterLinksFormatter();
  it('should provide a dashboardUrl in the options', async () => {
    await expect(() =>
      formatter.formatClusterLink({
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).rejects.toThrow('Rancher dashboard requires a dashboardUrl option');
  });
  it('should return a url on the workloads when there is a namespace only', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com'),
      object: {
        metadata: {
          namespace: 'bar',
        },
      },
      kind: 'foo',
    });
    expect(url.href).toBe('https://k8s.foo.com/explorer/workload');
  });
  it('should return a url on the workloads when the kind is not recognized', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'UnknownKind',
    });
    expect(url.href).toBe('https://k8s.foo.com/explorer/workload');
  });
  it('should return a url on the deployment', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Deployment',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/explorer/apps.deployment/bar/foobar',
    );
  });
  it('should return a url on the service', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Service',
    });
    expect(url.href).toBe('https://k8s.foo.com/explorer/service/bar/foobar');
  });
  it('should return a url on the ingress', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Ingress',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/explorer/networking.k8s.io.ingress/bar/foobar',
    );
  });
  it('should return a url on the deployment for a hpa', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'HorizontalPodAutoscaler',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/explorer/autoscaling.horizontalpodautoscaler/bar/foobar',
    );
  });
  it('should support subpaths in dashboardUrl', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/dashboard/c/c-28a4b/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Deployment',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/dashboard/c/c-28a4b/explorer/apps.deployment/bar/foobar',
    );
  });
});
