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

import { OpenshiftClusterLinksFormatter } from './OpenshiftClusterLinksFormatter';

describe('clusterLinks - OpenShift formatter', () => {
  const formatter = new OpenshiftClusterLinksFormatter();
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
    ).rejects.toThrow('OpenShift dashboard requires a dashboardUrl option');
  });
  it('should return an url on the workloads when there is a namespace only', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com'),
      object: {
        metadata: {
          namespace: 'bar',
        },
      },
      kind: 'foo',
    });
    expect(url.href).toBe('https://k8s.foo.com/k8s/cluster/projects/bar');
  });
  it('should return an url on the workloads when the kind is not recognizeed', async () => {
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
    expect(url.href).toBe('https://k8s.foo.com/k8s/cluster/projects/bar');
  });
  it('should return an url on the deployment', async () => {
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
    expect(url.href).toBe('https://k8s.foo.com/k8s/ns/bar/deployments/foobar');
  });
  it('should return an url on the deployment and keep the path prefix 1', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/some/prefix/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Deployment',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/some/prefix/k8s/ns/bar/deployments/foobar',
    );
  });
  it('should return an url on the deployment and keep the path prefix 2', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/some/prefix'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Deployment',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/some/prefix/k8s/ns/bar/deployments/foobar',
    );
  });
  it('should return an url on the service', async () => {
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
    expect(url.href).toBe('https://k8s.foo.com/k8s/ns/bar/services/foobar');
  });
  it('should return an url on the ingress', async () => {
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
    expect(url.href).toBe('https://k8s.foo.com/k8s/ns/bar/ingresses/foobar');
  });
  it('should return an url on the deployment for a hpa', async () => {
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
      'https://k8s.foo.com/k8s/ns/bar/horizontalpodautoscalers/foobar',
    );
  });
  it('should return an url on the PV', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
        },
      },
      kind: 'PersistentVolume',
    });
    expect(url.href).toBe(
      'https://k8s.foo.com/k8s/cluster/persistentvolumes/foobar',
    );
  });
});
