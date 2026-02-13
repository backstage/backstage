/*
 * Copyright 2024 The Backstage Authors
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

import type { CatalogModelRegistry } from '@backstage/catalog-model-extensions';

/**
 * Registers Kubernetes-specific catalog model annotations.
 * When installed, Components gain kubernetes annotations for resource discovery.
 */
export default function registerKubernetesModel(
  registry: CatalogModelRegistry,
) {
  const component = registry.getKind('Component');

  component.metadata.annotations.extend(z => ({
    'backstage.io/kubernetes-id': z.string().meta({
      description:
        'Identifier used to find Kubernetes resources. Matches app.kubernetes.io/name label by default.',
    }),
    'backstage.io/kubernetes-kind': z.string().optional().meta({
      description:
        'Kubernetes kind of the resource. If not set, all kinds are searched.',
    }),
    'backstage.io/kubernetes-name': z.string().optional().meta({
      description:
        'Kubernetes name of the resource. If not set, all names are searched.',
    }),
    'backstage.io/kubernetes-namespace': z.string().optional().meta({
      description:
        'Kubernetes namespace override. If not set, all namespaces are searched.',
    }),
    'backstage.io/kubernetes-label-selector': z.string().optional().meta({
      description: 'Custom label selector query for finding pods.',
    }),
    'backstage.io/kubernetes-cluster': z.string().optional().meta({
      description:
        'Target cluster name. If not set, all configured clusters are searched.',
    }),
  }));

  component.metadata.labels.extend(z => ({
    'backstage.io/kubernetes-managed': z.string().meta({
      description: 'Whether this component has Kubernetes resources',
    }),
  }));
}
