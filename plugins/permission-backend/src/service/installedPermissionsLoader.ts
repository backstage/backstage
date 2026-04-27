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

import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import { RootSystemMetadataService } from '@backstage/backend-plugin-api/alpha';
import {
  InstalledPermissionsResponse,
  MetadataResponse,
  PERMISSIONS_METADATA_PATH,
  Permission,
} from '@backstage/plugin-permission-common';

/**
 * Per-fetch timeout for plugin metadata calls. One slow plugin should not
 * block the aggregated result.
 */
const METADATA_FETCH_TIMEOUT_MS = 5_000;

/**
 * Default TTL for the aggregated catalog. Permissions are registered during
 * plugin init and don't normally change at runtime, but we still expire the
 * cache so a temporarily failing plugin (timeout, transient error) self-heals
 * without requiring a backend restart.
 */
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1_000;

async function fetchPluginPermissions(options: {
  pluginId: string;
  serviceCredentials: BackstageCredentials;
  discovery: DiscoveryService;
  auth: AuthService;
  logger: LoggerService;
}): Promise<Permission[]> {
  const { pluginId, serviceCredentials, discovery, auth, logger } = options;

  let baseUrl: string;
  try {
    baseUrl = await discovery.getBaseUrl(pluginId);
  } catch (error) {
    logger.debug(
      `Skipping permission metadata for plugin '${pluginId}': discovery lookup failed`,
      { error: String(error) },
    );
    return [];
  }

  const { token } = await auth.getPluginRequestToken({
    onBehalfOf: serviceCredentials,
    targetPluginId: pluginId,
  });

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    METADATA_FETCH_TIMEOUT_MS,
  );

  let metadataResponse: globalThis.Response;
  try {
    metadataResponse = await fetch(`${baseUrl}${PERMISSIONS_METADATA_PATH}`, {
      headers: { authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
  } catch (error) {
    logger.warn(`Failed to load permission metadata for plugin '${pluginId}'`, {
      error: String(error),
    });
    return [];
  } finally {
    clearTimeout(timeout);
  }

  if (metadataResponse.status === 404) {
    return [];
  }
  if (!metadataResponse.ok) {
    logger.warn(
      `Failed to load permission metadata for plugin '${pluginId}': ${metadataResponse.status} ${metadataResponse.statusText}`,
    );
    return [];
  }

  const body = (await metadataResponse.json()) as MetadataResponse;
  return body.permissions ?? [];
}

/**
 * @internal
 */
export type InstalledPermissionsLoader =
  () => Promise<InstalledPermissionsResponse>;

/**
 * Builds a cached, single-flight loader that aggregates permission metadata
 * from every installed plugin (except the calling plugin itself).
 *
 * Behavior:
 * - Concurrent calls share a single in-flight fan-out.
 * - Successful results are cached for `cacheTtlMs` (default 5 minutes); after
 *   expiry the next call refans-out. This bounds how long a transiently failed
 *   plugin can be missing from the response.
 * - Per-plugin failures are logged and treated as "no permissions" so one bad
 *   plugin can't poison the whole response.
 * - Rejected fan-outs (e.g. credential errors) clear the in-flight promise so
 *   the next call retries.
 *
 * @internal
 */
export function createInstalledPermissionsLoader(options: {
  ownPluginId: string;
  systemMetadata: RootSystemMetadataService;
  discovery: DiscoveryService;
  auth: AuthService;
  logger: LoggerService;
  cacheTtlMs?: number;
  now?: () => number;
}): InstalledPermissionsLoader {
  const {
    ownPluginId,
    systemMetadata,
    discovery,
    auth,
    logger,
    cacheTtlMs = DEFAULT_CACHE_TTL_MS,
    now = () => Date.now(),
  } = options;

  let cached:
    | { value: InstalledPermissionsResponse; expiresAt: number }
    | undefined;
  let inflight: Promise<InstalledPermissionsResponse> | undefined;

  const fanOut = async (): Promise<InstalledPermissionsResponse> => {
    const serviceCredentials = await auth.getOwnServiceCredentials();
    const installed = await systemMetadata.getInstalledPlugins();
    const pluginIds = Array.from(new Set(installed.map(p => p.pluginId)))
      // Skip ourselves — the permission backend doesn't expose the metadata
      // endpoint, so calling it would just produce a wasted 404.
      .filter(pluginId => pluginId !== ownPluginId)
      // Sort for deterministic dedup tie-breaking across instances.
      .sort();

    const results = await Promise.allSettled(
      pluginIds.map(pluginId =>
        fetchPluginPermissions({
          pluginId,
          serviceCredentials,
          discovery,
          auth,
          logger,
        }).then(permissions => ({ pluginId, permissions })),
      ),
    );

    const seen = new Set<string>();
    const plugins: InstalledPermissionsResponse['plugins'] = [];
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === 'rejected') {
        logger.warn(
          `Failed to load permission metadata for plugin '${pluginIds[i]}'`,
          { error: String(result.reason) },
        );
        continue;
      }
      const dedupedPermissions: Permission[] = [];
      for (const permission of result.value.permissions) {
        if (seen.has(permission.name)) {
          logger.warn(
            `Duplicate permission name '${permission.name}' registered by plugin '${result.value.pluginId}'; ignoring duplicate`,
          );
          continue;
        }
        seen.add(permission.name);
        dedupedPermissions.push(permission);
      }
      plugins.push({
        pluginId: result.value.pluginId,
        permissions: dedupedPermissions,
      });
    }
    return { plugins };
  };

  return async function load() {
    if (cached && cached.expiresAt > now()) {
      return cached.value;
    }
    if (inflight) {
      return inflight;
    }
    inflight = (async () => {
      try {
        const value = await fanOut();
        cached = { value, expiresAt: now() + cacheTtlMs };
        return value;
      } finally {
        inflight = undefined;
      }
    })();
    return inflight;
  };
}
