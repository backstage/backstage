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
import { ClusterLinksFormatterOptions } from '../../../types/types';

const basePath =
  'https://portal.azure.com/#blade/Microsoft_Azure_ContainerService/AksK8ResourceMenuBlade/overview-Deployment/aksClusterId';

const requiredParams = ['subscriptionId', 'resourceGroup', 'clusterName'];

export function aksFormatter(options: ClusterLinksFormatterOptions): URL {
  if (!options.dashboardParameters) {
    throw new Error('AKS dashboard requires a dashboardParameters option');
  }
  const args = options.dashboardParameters;
  for (const param of requiredParams) {
    if (typeof args[param] !== 'string') {
      throw new Error(
        `AKS dashboard requires a "${param}" of type string in the dashboardParameters option`,
      );
    }
  }

  const path = `/subscriptions/${args.subscriptionId}/resourceGroups/${args.resourceGroup}/providers/Microsoft.ContainerService/managedClusters/${args.clusterName}`;

  const { name, namespace, uid } = options.object.metadata;
  const { selector } = options.object.spec;
  const params = {
    kind: options.kind,
    metadata: { name, namespace, uid },
    spec: {
      selector,
    },
  };

  return new URL(
    `${basePath}/${encodeURIComponent(path)}/resource/${encodeURIComponent(
      JSON.stringify(params),
    )}`,
  );
}
