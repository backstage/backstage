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

import { StandardClusterLinksFormatter } from './StandardClusterLinksFormatter';

function formatUrl(url: URL) {
  // Note that we can't rely on 'url.href' since it will put the search before the hash
  // and this won't be properly recognized by SPAs such as Angular in the standard dashboard.
  // Note also that pathname, hash and search will be properly url encoded.
  return `${url.origin}${url.pathname}${url.hash}${url.search}`;
}

describe('clusterLinks - standard formatter', () => {
  const formatter = new StandardClusterLinksFormatter();
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
    ).rejects.toThrow('standard dashboard requires a dashboardUrl option');
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/workloads?namespace=bar',
    );
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/workloads?namespace=bar',
    );
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/deployment/bar/foobar?namespace=bar',
    );
  });
  it('should return an url on the pod', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar',
        },
      },
      kind: 'Pod',
    });
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/pod/bar/foobar?namespace=bar',
    );
  });
  it('should return an url on the deployment with a prefix 1', async () => {
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/some/prefix/#/deployment/bar/foobar?namespace=bar',
    );
  });
  it('should return an url on the deployment with a prefix 2', async () => {
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/some/prefix/#/deployment/bar/foobar?namespace=bar',
    );
  });
  it('should return an url on the deployment properly url encoded', async () => {
    const url = await formatter.formatClusterLink({
      dashboardUrl: new URL('https://k8s.foo.com/'),
      object: {
        metadata: {
          name: 'foobar',
          namespace: 'bar bar',
        },
      },
      kind: 'Deployment',
    });
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/deployment/bar%20bar/foobar?namespace=bar%20bar',
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/service/bar/foobar?namespace=bar',
    );
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/ingress/bar/foobar?namespace=bar',
    );
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
    expect(formatUrl(url)).toBe(
      'https://k8s.foo.com/#/deployment/bar/foobar?namespace=bar',
    );
  });
});
