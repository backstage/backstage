/*
 * Copyright 2026 The Backstage Authors
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

import { createPermissionRule } from '@backstage/plugin-permission-node';
import { kubernetesProxyPermissionResourceRef } from '@backstage/plugin-kubernetes-node';
import { z } from 'zod/v3';

/**
 * Permission rule that checks if the request targets a specific cluster.
 *
 * @example
 * ```
 * conditions: kubernetesConditions.isCluster({ clusters: ['production'] })
 * ```
 */
export const isCluster = createPermissionRule({
  name: 'IS_CLUSTER',
  description:
    'Allow requests targeting one of the specified Kubernetes clusters (resolved target cluster name)',
  resourceRef: kubernetesProxyPermissionResourceRef,
  paramsSchema: z.object({
    clusters: z
      .array(z.string())
      .describe('List of cluster names to match at least one of'),
  }),
  apply(resource, { clusters }) {
    return clusters.some(
      c =>
        c.toLocaleLowerCase('en-US') ===
        resource.cluster.toLocaleLowerCase('en-US'),
    );
  },
  toQuery({ clusters }) {
    return { key: 'cluster', values: clusters };
  },
});

/**
 * Permission rule that checks if the request targets a specific namespace.
 *
 * @example
 * ```
 * conditions: kubernetesConditions.isNamespace({ namespaces: ['default', 'kube-system'] })
 * ```
 */
export const isNamespace = createPermissionRule({
  name: 'IS_NAMESPACE',
  description:
    'Allow requests targeting one of the specified Kubernetes namespaces',
  resourceRef: kubernetesProxyPermissionResourceRef,
  paramsSchema: z.object({
    namespaces: z
      .array(z.string())
      .describe('List of namespace names to match at least one of'),
  }),
  apply(resource, { namespaces }) {
    if (!resource.namespace) {
      return false;
    }
    return namespaces.some(
      ns =>
        ns.toLocaleLowerCase('en-US') ===
        resource.namespace!.toLocaleLowerCase('en-US'),
    );
  },
  toQuery({ namespaces }) {
    return { key: 'namespace', values: namespaces };
  },
});

/**
 * Permission rule that checks the Kubernetes resource type being accessed.
 *
 * @example
 * ```
 * conditions: kubernetesConditions.isResourceType({ resourceTypes: ['secrets', 'configmaps'] })
 * ```
 */
export const isResourceType = createPermissionRule({
  name: 'IS_RESOURCE_TYPE',
  description:
    'Allow requests accessing one of the specified Kubernetes resource types',
  resourceRef: kubernetesProxyPermissionResourceRef,
  paramsSchema: z.object({
    resourceTypes: z
      .array(z.string())
      .describe(
        'List of plural resource types to match at least one of (e.g., pods, secrets, deployments)',
      ),
  }),
  apply(resource, { resourceTypes }) {
    if (!resource.resourceType) {
      return false;
    }
    return resourceTypes.some(
      rt =>
        rt.toLocaleLowerCase('en-US') ===
        resource.resourceType!.toLocaleLowerCase('en-US'),
    );
  },
  toQuery({ resourceTypes }) {
    return { key: 'resourceType', values: resourceTypes };
  },
});

/**
 * Permission rule that checks the high-level action category (read, write, delete, exec).
 *
 * @example
 * ```
 * conditions: kubernetesConditions.isAction({ actions: ['read', 'write'] })
 * ```
 */
export const isAction = createPermissionRule({
  name: 'IS_ACTION',
  description:
    'Allow requests with one of the specified action categories (read, write, delete, exec)',
  resourceRef: kubernetesProxyPermissionResourceRef,
  paramsSchema: z.object({
    actions: z
      .array(z.enum(['read', 'write', 'delete', 'exec']))
      .describe('List of action categories to match at least one of'),
  }),
  apply(resource, { actions }) {
    return actions.includes(resource.action);
  },
  toQuery({ actions }) {
    return { key: 'action', values: actions };
  },
});

/**
 * Permission rule that checks the Kubernetes API verb.
 *
 * @example
 * ```
 * conditions: kubernetesConditions.isVerb({ verbs: ['get', 'list', 'watch'] })
 * ```
 */
export const isVerb = createPermissionRule({
  name: 'IS_VERB',
  description:
    'Allow requests with one of the specified Kubernetes API verbs (get, list, create, update, patch, delete, watch, deletecollection)',
  resourceRef: kubernetesProxyPermissionResourceRef,
  paramsSchema: z.object({
    verbs: z
      .array(z.string())
      .describe('List of Kubernetes API verbs to match at least one of'),
  }),
  apply(resource, { verbs }) {
    return verbs.some(
      v =>
        v.toLocaleLowerCase('en-US') ===
        resource.verb.toLocaleLowerCase('en-US'),
    );
  },
  toQuery({ verbs }) {
    return { key: 'verb', values: verbs };
  },
});

/**
 * All permission rules for the Kubernetes proxy.
 */
export const kubernetesProxyPermissionRules = [
  isCluster,
  isNamespace,
  isResourceType,
  isAction,
  isVerb,
];
