/*
 * Copyright 2025 The Backstage Authors
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
import { ActionsRegistryService } from '@backstage/backend-plugin-api/alpha';
import { kubernetesClustersReadPermission } from '@backstage/plugin-kubernetes-common';
import { KubernetesClustersSupplier } from '@backstage/plugin-kubernetes-node';

export const createGetKubernetesClustersAction = ({
  clusterSupplier,
  actionsRegistry,
}: {
  clusterSupplier: KubernetesClustersSupplier;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-kubernetes-clusters',
    title: 'Get Kubernetes Clusters',
    description: `
Lists all Kubernetes clusters registered with this Backstage instance.

Each cluster entry includes its internal \`name\` (unique identifier used in other actions and config),
an optional human-readable \`title\`, an optional \`dashboardUrl\` to its Kubernetes dashboard,
and an optional \`dashboardApp\` indicating the dashboard type (e.g. "standard", "gke", "eks", "aks",
"rancher", "openshift").

## When to use

Use this action to discover which clusters are available before looking up resources on a specific
cluster. The \`name\` returned here is the identifier to use when describing which cluster a resource
belongs to.
    `,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    visibilityPermission: kubernetesClustersReadPermission,
    schema: {
      input: z => z.object({}),
      output: z =>
        z.object({
          clusters: z
            .array(
              z.object({
                name: z
                  .string()
                  .describe(
                    'Unique internal name of the cluster, used as an identifier in other actions.',
                  ),
                title: z
                  .string()
                  .optional()
                  .describe(
                    'Human-readable display name for the cluster, if configured.',
                  ),
                dashboardUrl: z
                  .string()
                  .optional()
                  .describe(
                    'URL to the Kubernetes dashboard for this cluster.',
                  ),
                dashboardApp: z
                  .string()
                  .optional()
                  .describe(
                    'Dashboard type, e.g. "standard", "gke", "eks", "aks", "rancher", "openshift".',
                  ),
              }),
            )
            .describe('List of all registered Kubernetes clusters.'),
        }),
    },
    examples: [
      {
        title: 'List all clusters',
        input: {},
        output: {
          clusters: [
            { name: 'production', title: 'Production Cluster' },
            {
              name: 'staging',
              title: 'Staging Cluster',
              dashboardApp: 'standard',
              dashboardUrl: 'https://dashboard.staging.example.com',
            },
          ],
        },
      },
    ],
    action: async ({ credentials, logger }) => {
      logger.info('Fetching Kubernetes clusters');

      const clusterDetails = await clusterSupplier.getClusters({ credentials });

      return {
        output: {
          clusters: clusterDetails.map(cd => ({
            name: cd.name,
            ...(cd.title && { title: cd.title }),
            ...(cd.dashboardUrl && { dashboardUrl: cd.dashboardUrl }),
            ...(cd.dashboardApp && { dashboardApp: cd.dashboardApp }),
          })),
        },
      };
    },
  });
};
