/*
 * Copyright 2023 The Backstage Authors
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

import {
  ApiHolder,
  createApiRef,
  featureFlagsApiRef,
} from '@backstage/frontend-plugin-api';
import { FilterPredicate } from '@backstage/filter-predicates';
import type {
  EvaluatePermissionRequest,
  EvaluatePermissionResponse,
} from '@backstage/plugin-permission-common';
import { ForwardedError, isError } from '@backstage/errors';

export type ExtensionPredicateContext = {
  featureFlags: string[];
  permissions: string[];
};

export const EMPTY_PREDICATE_CONTEXT: ExtensionPredicateContext = {
  featureFlags: [],
  permissions: [],
};

// Minimal local permission API interface to avoid a dependency on @backstage/plugin-permission-react
type MinimalPermissionApi = {
  authorize(
    request: EvaluatePermissionRequest,
  ): Promise<EvaluatePermissionResponse>;
};

// The permission check runs while the app starts, which is also when the
// backend is most likely to be unavailable for a moment: it may still be
// starting up, as in local development where the frontend is often ready
// first, or a request may be dropped. Failing then breaks the whole app, so
// wait and retry instead, for up to about 15 seconds in total.
const AUTHORIZE_RETRY_DELAYS_MS = [500, 1000, 2000, 4000, 8000];

// Only failures that may clear up on their own are retried: transport
// failures, which fetch reports as a TypeError, and 5xx responses. Client
// errors such as a 401 or 403 response, and errors parsing or validating a
// response, fail right away.
function isRetryableAuthorizeError(error: unknown): boolean {
  if (
    isError(error) &&
    error.name === 'ResponseError' &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'status' in error.response &&
    typeof error.response.status === 'number'
  ) {
    return error.response.status >= 500;
  }
  return isError(error) && error.name === 'TypeError';
}

async function authorizeWithRetry(
  permissionApi: MinimalPermissionApi,
  request: EvaluatePermissionRequest,
): Promise<EvaluatePermissionResponse> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await permissionApi.authorize(request);
    } catch (error) {
      const delay = AUTHORIZE_RETRY_DELAYS_MS[attempt];
      if (delay === undefined || !isRetryableAuthorizeError(error)) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

function parsePermissionName(permissionName: string) {
  const parts = permissionName.split('#');
  const [name, action, ...rest] = parts;

  if (rest.length > 0 || !name || (parts.length === 2 && !action)) {
    throw new Error(
      `Invalid permission name: ${permissionName}. Permission names must be in the format "permissionName" or "permissionName#action" (both parts must be non-empty).`,
    );
  }

  if (action === undefined) {
    return { name };
  }

  return {
    name,
    attributes: {
      action,
    },
  };
}

export const localPermissionApiRef = createApiRef<MinimalPermissionApi>().with({
  id: 'plugin.permission.api',
});

export function createPredicateContextLoader(options: {
  apis: ApiHolder;
  predicateReferences: ExtensionPredicateContext;
}) {
  function getActiveFeatureFlags() {
    const featureFlagsApi = options.apis.get(featureFlagsApiRef);
    if (!featureFlagsApi) {
      return [];
    }

    return options.predicateReferences.featureFlags.filter(name =>
      featureFlagsApi.isActive(name),
    );
  }

  function getImmediate(): ExtensionPredicateContext | undefined {
    if (options.predicateReferences.permissions.length > 0) {
      const permissionApi = options.apis.get(localPermissionApiRef);
      if (permissionApi) {
        return undefined;
      }
    }

    return {
      featureFlags: getActiveFeatureFlags(),
      permissions: [],
    };
  }

  async function load() {
    const immediatePredicateContext = getImmediate();
    if (immediatePredicateContext) {
      return immediatePredicateContext;
    }

    let allowedPermissions: string[] = [];
    const permissionApi = options.apis.get(localPermissionApiRef);
    if (permissionApi) {
      try {
        const permissionNames = options.predicateReferences.permissions;
        const hydratedPermissions = permissionNames.map(name => {
          const { name: permissionName, attributes } =
            parsePermissionName(name);
          const permission = {
            name: permissionName,
            type: 'basic',
            attributes: attributes || {},
          } as const;
          return permission;
        });
        const responses = await Promise.all(
          hydratedPermissions.map(permission =>
            authorizeWithRetry(permissionApi, {
              permission,
            }),
          ),
        );
        allowedPermissions = permissionNames.filter(
          (_, i) => responses[i].result === 'ALLOW',
        );
      } catch (error) {
        throw new ForwardedError(
          'Failed to authorize extension permissions',
          error,
        );
      }
    }

    return {
      featureFlags: getActiveFeatureFlags(),
      permissions: allowedPermissions,
    };
  }

  return {
    getImmediate,
    load,
  };
}

export function collectPredicateReferences(
  nodes: Iterable<{ spec: { if?: FilterPredicate } }>,
): ExtensionPredicateContext {
  const featureFlags = new Set<string>();
  const permissions = new Set<string>();

  for (const node of nodes) {
    if (node.spec.if === undefined) {
      continue;
    }

    for (const name of extractFeatureFlagNames(node.spec.if)) {
      featureFlags.add(name);
    }
    for (const name of extractPermissionNames(node.spec.if)) {
      permissions.add(name);
    }
  }

  return {
    featureFlags: Array.from(featureFlags),
    permissions: Array.from(permissions),
  };
}

/**
 * Recursively walks a FilterPredicate and returns all string values referenced
 * by `featureFlags: { $contains: '...' }` expressions. This lets us call
 * `isActive()` only for the flags that are actually used in predicates rather
 * than fetching the full registered-flag list.
 */
function extractFeatureFlagNames(predicate: FilterPredicate): string[] {
  return extractPredicateKeyNames(predicate, 'featureFlags');
}

/**
 * Recursively walks a FilterPredicate and returns all string values referenced
 * by `permissions: { $contains: '...' }` expressions. This lets us issue a
 * single batched authorize call for only the permissions actually referenced.
 */
function extractPermissionNames(predicate: FilterPredicate): string[] {
  return extractPredicateKeyNames(predicate, 'permissions');
}

function extractPredicateKeyNames(
  predicate: FilterPredicate,
  key: string,
): string[] {
  if (typeof predicate !== 'object' || predicate === null) {
    return [];
  }
  const obj = predicate as Record<string, unknown>;
  if (Array.isArray(obj.$all)) {
    return (obj.$all as FilterPredicate[]).flatMap(p =>
      extractPredicateKeyNames(p, key),
    );
  }
  if (Array.isArray(obj.$any)) {
    return (obj.$any as FilterPredicate[]).flatMap(p =>
      extractPredicateKeyNames(p, key),
    );
  }
  if (obj.$not !== undefined) {
    return extractPredicateKeyNames(obj.$not as FilterPredicate, key);
  }
  const value = obj[key];
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const contains = (value as Record<string, unknown>).$contains;
    if (typeof contains === 'string') {
      return [contains];
    }
  }
  return [];
}
