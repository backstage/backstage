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
import { aksFormatter } from './aks';

describe('clusterLinks - AKS formatter', () => {
  it('should provide a dashboardParameters in the options', () => {
    expect(() =>
      aksFormatter({
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).toThrow('AKS dashboard requires a dashboardParameters option');
  });
  it('should provide a subscriptionId in the dashboardParameters options', () => {
    expect(() =>
      aksFormatter({
        dashboardParameters: {
          resourceGroup: 'rg-1',
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
    ).toThrow(
      'AKS dashboard requires a "subscriptionId" of type string in the dashboardParameters option',
    );
  });
  it('should provide a resourceGroup in the dashboardParameters options', () => {
    expect(() =>
      aksFormatter({
        dashboardParameters: {
          subscriptionId: '1234-GUID-5678',
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
    ).toThrow(
      'AKS dashboard requires a "resourceGroup" of type string in the dashboardParameters option',
    );
  });
  it('should provide a clusterName in the dashboardParameters options', () => {
    expect(() =>
      aksFormatter({
        dashboardParameters: {
          subscriptionId: '1234-GUID-5678',
          resourceGroup: 'us-east1-c',
        },
        object: {
          metadata: {
            name: 'foobar',
            namespace: 'bar',
          },
        },
        kind: 'Deployment',
      }),
    ).toThrow(
      'AKS dashboard requires a "clusterName" of type string in the dashboardParameters option',
    );
  });
  it('should return an url on the cluster with object details', () => {
    const url = aksFormatter({
      dashboardParameters: {
        subscriptionId: '1234-GUID-5678',
        resourceGroup: 'rg-1',
        clusterName: 'cluster-1',
      },
      object: {
        metadata: {
          name: 'my-deployment',
          namespace: 'my-namespace',
          uid: '111-GUID-222',
        },
        spec: {
          selector: {
            matchLabels: {
              app: 'foo',
            },
          },
        },
      },
      kind: 'Deployment',
    });
    expect(url.href).toBe(
      'https://portal.azure.com/#blade/Microsoft_Azure_ContainerService/AksK8ResourceMenuBlade/overview-Deployment/aksClusterId/%2Fsubscriptions%2F1234-GUID-5678%2FresourceGroups%2Frg-1%2Fproviders%2FMicrosoft.ContainerService%2FmanagedClusters%2Fcluster-1/resource/%7B%22kind%22%3A%22Deployment%22%2C%22metadata%22%3A%7B%22name%22%3A%22my-deployment%22%2C%22namespace%22%3A%22my-namespace%22%2C%22uid%22%3A%22111-GUID-222%22%7D%2C%22spec%22%3A%7B%22selector%22%3A%7B%22matchLabels%22%3A%7B%22app%22%3A%22foo%22%7D%7D%7D%7D',
    );
  });
});
