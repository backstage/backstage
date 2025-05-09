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
import { HeadlampClusterLinksFormatter } from './HeadlampClusterLinksFormatter';
import { ClusterLinksFormatterOptions } from '../../types';

describe('HeadlampClusterLinksFormatter', () => {
  let formatter: HeadlampClusterLinksFormatter;

  beforeEach(() => {
    formatter = new HeadlampClusterLinksFormatter();
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true,
    });
  });

  it('formats internal dashboard link correctly', async () => {
    const options: ClusterLinksFormatterOptions = {
      dashboardParameters: {
        internal: true,
        headlampRoute: '/headlamp',
        clusterName: 'test-cluster',
      },
      object: { metadata: { name: 'test-pod', namespace: 'default' } },
      kind: 'Pod',
    };

    const result = await formatter.formatClusterLink(options);
    expect(result.toString()).toBe(
      'http://localhost:3000/headlamp?to=%2Fc%2Ftest-cluster%2Fpods%2Fdefault%2Ftest-pod',
    );
  });

  it('formats external dashboard link correctly', async () => {
    const options: ClusterLinksFormatterOptions = {
      dashboardUrl: new URL('https://headlamp.com'),
      object: { metadata: { name: 'test-deployment', namespace: 'default' } },
      kind: 'Deployment',
    };

    const result = await formatter.formatClusterLink(options);
    expect(result.toString()).toBe(
      'https://headlamp.com/?to=%2Fc%2Fdefault%2Fdeployments%2Fdefault%2Ftest-deployment',
    );
  });

  it('throws error when dashboard URL is missing for external dashboard', async () => {
    const options: ClusterLinksFormatterOptions = {
      object: { metadata: { name: 'test-service', namespace: 'default' } },
      kind: 'Service',
    };

    await expect(formatter.formatClusterLink(options)).rejects.toThrow(
      'Dashboard URL is required or dashboardInternal must be true',
    );
  });

  it('throws error for unsupported kind', async () => {
    const options: ClusterLinksFormatterOptions = {
      dashboardParameters: { internal: true },
      object: { metadata: { name: 'test-unknown', namespace: 'default' } },
      kind: 'UnknownKind',
    };

    await expect(formatter.formatClusterLink(options)).rejects.toThrow(
      'Could not find path for kind: UnknownKind',
    );
  });
});
