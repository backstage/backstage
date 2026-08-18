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

/**
 * Action categories for Kubernetes proxy operations.
 * @public
 */
export type KubernetesAction = 'read' | 'write' | 'delete' | 'exec';

/**
 * Represents a parsed Kubernetes proxy request for permission evaluation.
 * This is the resource object evaluated by permission rules.
 *
 * @public
 */
export interface KubernetesProxyRequest {
  /** The target cluster name */
  cluster: string;
  /** The Kubernetes API verb (get, list, create, update, patch, delete, watch, deletecollection) */
  verb: string;
  /** The high-level action category (read, write, delete, exec) */
  action: KubernetesAction;
  /** The plural resource type (e.g., pods, secrets, deployments) */
  resourceType: string | undefined;
  /** The namespace, if the request is namespace-scoped */
  namespace: string | undefined;
  /** The subresource, if any (e.g., exec, log, portforward) */
  subresource: string | undefined;
  /** The API group (empty string for core API) */
  apiGroup: string;
}
