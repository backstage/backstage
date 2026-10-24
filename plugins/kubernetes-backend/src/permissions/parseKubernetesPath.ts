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

import { KubernetesAction } from '@backstage/plugin-kubernetes-node';

/**
 * Parsed attributes from a Kubernetes API request path and method.
 */
export interface ParsedKubernetesRequest {
  /** The Kubernetes API verb (get, list, create, update, patch, delete, watch, deletecollection) */
  verb: string;
  /** The high-level action category */
  action: KubernetesAction;
  /** The plural resource type (e.g., pods, secrets, deployments) */
  resourceType: string | undefined;
  /** The namespace, if the request is namespace-scoped */
  namespace: string | undefined;
  /** The subresource, if any (e.g., exec, log, portforward, attach) */
  subresource: string | undefined;
  /** The API group (empty string for core API) */
  apiGroup: string;
}

/** Subresources that represent interactive exec/attach sessions */
const EXEC_SUBRESOURCES = new Set(['exec', 'attach']);

/** Subresources that represent read operations regardless of HTTP method */
const READ_SUBRESOURCES = new Set(['log', 'status']);

/**
 * Parses a Kubernetes API path and HTTP method into structured request attributes.
 *
 * Handles both core API paths (`/api/v1/...`) and API group paths (`/apis/group/version/...`).
 * Returns undefined for non-resource paths (healthz, openapi, version, etc.).
 *
 * @param path - The proxy-relative path (e.g., `/api/v1/namespaces/default/pods/mypod`)
 * @param method - The HTTP method (GET, POST, PUT, PATCH, DELETE)
 * @param queryString - Optional query string for watch detection
 * @returns Parsed request attributes, or undefined for non-resource paths
 */
export function parseKubernetesPath(
  path: string,
  method: string,
  queryString?: string,
): ParsedKubernetesRequest | undefined {
  const upperMethod = method.toUpperCase();

  // Strip leading slash and split
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const segments = cleanPath.split('/').filter(s => s.length > 0);

  if (segments.length === 0) {
    return undefined;
  }

  let apiGroup: string;
  let resourceSegments: string[];

  if (segments[0] === 'api') {
    // Core API: /api/v1/...
    apiGroup = '';
    // Skip 'api' and version
    resourceSegments = segments.slice(2);
  } else if (segments[0] === 'apis') {
    // API group: /apis/{group}/{version}/...
    if (segments.length < 3) {
      return undefined;
    }
    apiGroup = segments[1];
    // Skip 'apis', group, and version
    resourceSegments = segments.slice(3);
  } else {
    // Non-resource paths: healthz, openapi, version, etc.
    return undefined;
  }

  if (resourceSegments.length === 0) {
    // Root API path (e.g., /api/v1) — not a resource request
    return undefined;
  }

  const parsed = parseResourceSegments(resourceSegments);
  if (!parsed) {
    return undefined;
  }

  const { resourceType, namespace, subresource, hasResourceName } = parsed;

  const verb = resolveVerb(
    upperMethod,
    hasResourceName,
    subresource,
    queryString,
  );
  const action = resolveAction(verb, subresource);

  return {
    verb,
    action,
    resourceType,
    namespace,
    subresource,
    apiGroup,
  };
}

interface ParsedResourceSegments {
  resourceType: string | undefined;
  namespace: string | undefined;
  subresource: string | undefined;
  hasResourceName: boolean;
}

/**
 * Parses the resource portion of the path (after api/v1 or apis/group/version).
 *
 * Patterns:
 *   - `{resource}` → list
 *   - `{resource}/{name}` → single resource
 *   - `{resource}/{name}/{subresource}` → subresource
 *   - `namespaces/{ns}/{resource}` → namespaced list
 *   - `namespaces/{ns}/{resource}/{name}` → namespaced resource
 *   - `namespaces/{ns}/{resource}/{name}/{subresource}` → namespaced subresource
 */
function parseResourceSegments(
  segments: string[],
): ParsedResourceSegments | undefined {
  let namespace: string | undefined;
  let remaining: string[];

  if (segments[0] === 'namespaces' && segments.length >= 2) {
    namespace = segments[1];
    remaining = segments.slice(2);
  } else {
    remaining = segments;
  }

  if (remaining.length === 0) {
    // Just /namespaces or /namespaces/{ns} — treat as resource type 'namespaces'
    return {
      resourceType: 'namespaces',
      namespace: undefined,
      subresource: undefined,
      hasResourceName: namespace !== undefined,
    };
  }

  const resourceType = remaining[0];
  const hasResourceName = remaining.length >= 2;
  const subresource = remaining.length >= 3 ? remaining[2] : undefined;

  return {
    resourceType,
    namespace,
    subresource,
    hasResourceName,
  };
}

/**
 * Maps HTTP method + context to a Kubernetes API verb.
 */
function resolveVerb(
  method: string,
  hasResourceName: boolean,
  _subresource: string | undefined,
  queryString?: string,
): string {
  // Check for watch query parameter
  if (method === 'GET' && queryString) {
    const params = new URLSearchParams(queryString);
    if (params.get('watch') === 'true' || params.has('watch')) {
      return 'watch';
    }
  }

  switch (method) {
    case 'GET':
    case 'HEAD':
      return hasResourceName ? 'get' : 'list';
    case 'POST':
      return 'create';
    case 'PUT':
      return 'update';
    case 'PATCH':
      return 'patch';
    case 'DELETE':
      return hasResourceName ? 'delete' : 'deletecollection';
    default:
      return 'unknown';
  }
}

/**
 * Maps a K8s verb + subresource to a high-level action category.
 */
function resolveAction(
  verb: string,
  subresource: string | undefined,
): KubernetesAction {
  // Exec/attach subresources are always 'exec' regardless of verb
  if (subresource && EXEC_SUBRESOURCES.has(subresource)) {
    return 'exec';
  }

  // Portforward is also an exec-class operation
  if (subresource === 'portforward') {
    return 'exec';
  }

  // Read subresources (log, status) are always 'read'
  if (subresource && READ_SUBRESOURCES.has(subresource)) {
    return 'read';
  }

  switch (verb) {
    case 'get':
    case 'list':
    case 'watch':
      return 'read';
    case 'create':
    case 'update':
    case 'patch':
      return 'write';
    case 'delete':
    case 'deletecollection':
      return 'delete';
    default:
      // Fail-closed: unknown verbs are treated as write
      return 'write';
  }
}
