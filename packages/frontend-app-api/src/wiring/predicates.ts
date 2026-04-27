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
  discoveryApiRef,
  featureFlagsApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { FilterPredicate } from '@backstage/filter-predicates';
import {
  INSTALLED_PERMISSIONS_PATH,
  type EvaluatePermissionRequest,
  type EvaluatePermissionResponse,
  type InstalledPermissionsResponse,
  type Permission,
} from '@backstage/plugin-permission-common';
import { ForwardedError } from '@backstage/errors';

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

export const localPermissionApiRef = createApiRef<MinimalPermissionApi>({
  id: 'plugin.permission.api',
});

// Memoize the registry per ApiHolder so multiple loader instances within the
// same app session share a single fetch. Keyed by ApiHolder so that test apps
// or specialized apps that build a fresh holder don't see stale data. A cached
// empty map after a failed lookup also deduplicates fallback warnings.
const registryCache = new WeakMap<
  ApiHolder,
  Promise<Map<string, Permission>>
>();

const warnedResourcePermissionNames = new Set<string>();

function logResourcePermissionInPredicateWarningOnce(name: string) {
  if (warnedResourcePermissionNames.has(name)) {
    return;
  }
  warnedResourcePermissionNames.add(name);
  // eslint-disable-next-line no-console
  console.warn(
    `Permission '${name}' is a resource permission and cannot be evaluated at ` +
      `\`if\` predicate time without a resourceRef. Treating as ALLOW; gate on ` +
      `the resource itself rather than via an \`if\` predicate.`,
  );
}

/**
 * Fetches the catalog of installed permissions from the permission backend so
 * that `if` predicates can authorize using the full {@link Permission} shape
 * (including `attributes` and, for resource permissions, `resourceType`)
 * rather than a fabricated basic-permission request that strips both.
 *
 * Returns an empty map when the endpoint is unavailable so callers fall back
 * to the legacy basic-permission shape; a warning is surfaced so adopters
 * running an older permission-backend can diagnose why attribute-based
 * policies aren't matching their `if` predicates.
 */
async function loadInstalledPermissionRegistry(
  apis: ApiHolder,
): Promise<Map<string, Permission>> {
  const cached = registryCache.get(apis);
  if (cached) {
    return cached;
  }

  const discoveryApi = apis.get(discoveryApiRef);
  const fetchApi = apis.get(fetchApiRef);
  if (!discoveryApi || !fetchApi) {
    return new Map();
  }

  const promise = (async () => {
    let response: globalThis.Response;
    try {
      const baseUrl = await discoveryApi.getBaseUrl('permission');
      response = await fetchApi.fetch(
        `${baseUrl}${INSTALLED_PERMISSIONS_PATH}`,
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(
        `Failed to load installed permissions from permission backend, falling back to basic-permission requests: ${
          (error as Error).message
        }`,
      );
      return new Map<string, Permission>();
    }

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(
        `Permission backend responded with ${response.status} when loading installed permissions, falling back to basic-permission requests`,
      );
      return new Map<string, Permission>();
    }

    // Parse errors are intentionally not caught here — they indicate a real
    // version mismatch or schema bug that adopters should see.
    const body = (await response.json()) as InstalledPermissionsResponse;
    const registry = new Map<string, Permission>();
    for (const { permissions } of body.plugins) {
      for (const permission of permissions) {
        registry.set(permission.name, permission);
      }
    }
    return registry;
  })();

  registryCache.set(apis, promise);
  // Drop the cache on a thrown rejection so subsequent loads can retry. Failed
  // HTTP responses resolve to an empty Map and remain cached intentionally.
  promise.catch(() => registryCache.delete(apis));
  return promise;
}

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
        const registry = await loadInstalledPermissionRegistry(options.apis);
        const responses = await Promise.all(
          permissionNames.map(name => {
            const permission = registry.get(name);
            // Resource permissions cannot be authorized at predicate time:
            // the backend rejects user-initiated requests for them without a
            // `resourceRef` (to prevent enumeration), and the predicate has
            // no resource context to provide. Skip authorize and treat as
            // ALLOW so the extension renders; the real gate fires later when
            // a specific resource is loaded. Adopters who want to gate on
            // resource access should do so at the resource itself, not in
            // an `if` predicate.
            if (permission?.type === 'resource') {
              logResourcePermissionInPredicateWarningOnce(name);
              return { result: 'ALLOW' as const };
            }
            return permissionApi.authorize({
              permission: permission ?? {
                name,
                type: 'basic',
                attributes: {},
              },
            });
          }),
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
