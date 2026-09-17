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
import { NotFoundError } from '@backstage/errors';
import { kubernetesResourcesReadPermission } from '@backstage/plugin-kubernetes-common';
import { KubernetesObjectsProvider } from '@backstage/plugin-kubernetes-node';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { stringifyEntityRef } from '@backstage/catalog-model';

export const createGetKubernetesResourcesForEntityAction = ({
  objectsProvider,
  catalog,
  actionsRegistry,
}: {
  objectsProvider: KubernetesObjectsProvider;
  catalog: CatalogService;
  actionsRegistry: ActionsRegistryService;
}) => {
  actionsRegistry.register({
    name: 'get-kubernetes-resources-for-entity',
    title: 'Get Kubernetes Resources for Entity',
    description: `
Fetches all Kubernetes resources associated with a Backstage catalog entity across all registered clusters.

The response groups results by cluster. Each cluster entry includes:
- \`cluster.name\`: the cluster identifier
- \`resources\`: list of Kubernetes resource groups, each with a \`type\` (e.g. "pods", "deployments",
  "services", "configmaps", "replicasets", "statefulsets", "daemonsets", "jobs", "cronjobs",
  "horizontalpodautoscalers", "ingresses") and a \`resources\` array containing the raw Kubernetes objects.
- \`podMetrics\`: CPU and memory usage per pod and container, if metrics-server is installed.
- \`errors\`: any fetch errors encountered for that cluster.

## When to use

Use this action to inspect the live Kubernetes state of a service or component — for example to check
deployment rollout status, pod health, replica counts, or resource quotas.
    `,
    attributes: {
      destructive: false,
      readOnly: true,
      idempotent: true,
    },
    visibilityPermission: kubernetesResourcesReadPermission,
    schema: {
      input: z =>
        z.object({
          name: z.string().describe('The name of the catalog entity.'),
          kind: z
            .string()
            .optional()
            .describe(
              'The kind of the catalog entity. Defaults to "Component" if omitted.',
            ),
          namespace: z
            .string()
            .optional()
            .describe(
              'The namespace of the catalog entity. Defaults to "default" if omitted.',
            ),
        }),
      output: z =>
        z.object({
          items: z
            .array(z.unknown())
            .describe(
              'List of ClusterObjects, one per cluster. Each entry has cluster info, resources grouped by type, pod metrics, and any errors.',
            ),
        }),
    },
    examples: [
      {
        title: 'Get Kubernetes resources for a component',
        input: { name: 'my-service' },
        output: {
          items: [
            {
              cluster: { name: 'production' },
              resources: [
                {
                  type: 'deployments',
                  resources: [
                    {
                      metadata: { name: 'my-service', namespace: 'default' },
                      spec: { replicas: 3 },
                      status: { readyReplicas: 3 },
                    },
                  ],
                },
                {
                  type: 'pods',
                  resources: [
                    {
                      metadata: {
                        name: 'my-service-abc12',
                        namespace: 'default',
                      },
                      status: { phase: 'Running' },
                    },
                  ],
                },
              ],
              podMetrics: [],
              errors: [],
            },
          ],
        },
      },
      {
        title: 'Get Kubernetes resources for a specific kind and namespace',
        input: { name: 'my-worker', kind: 'Service', namespace: 'production' },
      },
    ],
    action: async ({ input, credentials, logger }) => {
      const entityRef = stringifyEntityRef({
        kind: input.kind ?? 'Component',
        namespace: input.namespace ?? 'default',
        name: input.name,
      });

      logger.info(`Fetching Kubernetes resources for entity "${entityRef}"`);

      const entity = await catalog.getEntityByRef(
        {
          kind: input.kind ?? 'Component',
          namespace: input.namespace ?? 'default',
          name: input.name,
        },
        { credentials },
      );
      if (!entity) {
        throw new NotFoundError(
          `Entity "${entityRef}" not found in the catalog`,
        );
      }

      const response = await objectsProvider.getKubernetesObjectsByEntity(
        {
          entity,
          // auth carries provider-specific tokens (e.g. OIDC) sent by browser
          // clients. Server-side actions don't have these; passing an empty
          // object tells the AuthenticationStrategy to use the server-side
          // configured credentials (service account, etc.).
          auth: {},
        },
        { credentials },
      );

      return {
        output: {
          items: response.items,
        },
      };
    },
  });
};
