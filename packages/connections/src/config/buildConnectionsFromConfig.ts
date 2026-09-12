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
import { Config } from '@backstage/config';
import { InputError, toError } from '@backstage/errors';
import { JsonObject } from '@backstage/types';
import { z } from 'zod/v4';
import type { ConnectionTypeKey } from '../definitions/types';
import { combineConnectionSources } from './combineConnectionSources';
import { getLegacyIntegrations } from './getLegacyIntegrations';
import {
  getConnectionType,
  identityFields,
  isConnectionTypeKey,
} from './lookup';
import type { ConfiguredConnection } from './types';

function describeError(error: unknown): string {
  const e = toError(error);
  if (e.name === 'ZodError') {
    return z.prettifyError(e as unknown as z.ZodError);
  }
  if (e.cause !== undefined) {
    const cause = toError(e.cause);
    if (cause.name === 'ZodError') {
      return z.prettifyError(cause as unknown as z.ZodError);
    }
  }
  return e.message;
}

// The identity field name is only known at runtime, so the typed connection
// object cannot be indexed directly; this helper contains the erased read.
function connectionIdentityOf(
  identityField: string | undefined,
  connection: object,
): string | undefined {
  if (!identityField) {
    return undefined;
  }
  const value = (connection as Record<string, unknown>)[identityField];
  return typeof value === 'string' ? value : undefined;
}

function validateConnection(connection: JsonObject): ConfiguredConnection {
  if (typeof connection.type !== 'string') {
    throw new InputError(`Unrecognised connection type ${connection.type}`);
  }

  if (!isConnectionTypeKey(connection.type)) {
    throw new InputError(`Unrecognised connection type ${connection.type}`);
  }

  const connectionType = getConnectionType(connection.type);

  const rawAuth = connection.auth;
  if (!Array.isArray(rawAuth) || rawAuth.length === 0) {
    throw new InputError(
      `Connection of type "${connection.type}" must configure at least one auth method`,
    );
  }

  const auth = (rawAuth as JsonObject[]).map(entry => {
    if (typeof entry.method !== 'string') {
      throw new InputError(
        `Auth entry for connection type "${connection.type}" is missing a "method" field`,
      );
    }
    const authMethod = connectionType.authMethods.find(
      am => am.method === entry.method,
    );
    if (!authMethod) {
      throw new InputError(
        `Unknown auth method "${entry.method}" for connection type "${connection.type}"`,
      );
    }
    const { method, title, match, ...rest } = entry;
    return {
      ...authMethod.configSchema.parse(rest),
      method,
      title: title as string | undefined,
      match: match as { plugins: string[] } | undefined,
    } as ConfiguredConnection['auth'][number];
  });

  const { type, auth: _, title, match, ...configFields } = connection;
  const parsed = connectionType.configSchema.parse(configFields);

  // Let the connection type check rules that span the whole connection,
  // such as uniqueness across auth entries. Entries keep their plugin
  // `match` so that rules can take scoping into account.
  const validate = connectionType.validate as
    | ((connection: { config: unknown; auth: unknown[] }) => void)
    | undefined;
  validate?.({ config: parsed, auth });

  return {
    ...parsed,
    type: connection.type,
    title: title as string | undefined,
    match: match as { plugins: string[] } | undefined,
    auth,
  } as ConfiguredConnection;
}

function validateConfig(raw: JsonObject[]): ConfiguredConnection[] {
  return raw.map(v => {
    try {
      return validateConnection(v);
    } catch (e) {
      const type = typeof v.type === 'string' ? v.type : 'unknown';
      throw new InputError(
        `Invalid connection of type "${type}" in connections config:\n${describeError(
          e,
        )}`,
      );
    }
  });
}

function validateLegacy(raw: JsonObject[]): ConfiguredConnection[] {
  return raw.map(v => {
    try {
      return validateConnection(v);
    } catch (e) {
      const type = typeof v.type === 'string' ? v.type : 'unknown';
      throw new InputError(
        `Invalid connection of type "${type}" converted from legacy integrations config:\n${describeError(
          e,
        )}`,
      );
    }
  });
}

// Legacy integrations never had a uniqueness requirement — multiple entries
// could resolve to the same host, with lookups always returning the first
// match and effectively ignoring the rest. Conversion follows suit: the
// first entry that resolves to a given connection identity wins, and later
// duplicates are dropped with a warning rather than rejected at startup.
function dedupeLegacy(
  legacy: ConfiguredConnection[],
  logger?: { warn(message: string): void },
): ConfiguredConnection[] {
  const seen = new Set<string>();
  const result: ConfiguredConnection[] = [];

  for (const connection of legacy) {
    const connectionType = getConnectionType(
      connection.type as ConnectionTypeKey,
    );

    let key = connection.type as string;
    if (connectionType.cardinality !== 'singleton') {
      const identity = connectionIdentityOf(
        identityFields[connectionType.lookupStrategy],
        connection,
      );
      if (identity === undefined) {
        result.push(connection);
        continue;
      }
      key = `${connection.type} ${identity}`;
    }

    if (seen.has(key)) {
      logger?.warn(
        `Multiple legacy integrations resolve to the "${key}" connection; ignoring all but the first entry, matching the legacy lookup behavior`,
      );
      continue;
    }
    seen.add(key);
    result.push(connection);
  }

  return result;
}

function assignDefaultTitles(connections: ConfiguredConnection[]): void {
  const typeCounts = new Map<string, number>();
  for (const c of connections) {
    const type = c.type as ConnectionTypeKey;
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
  }
  for (const c of connections) {
    if (!c.title) {
      const type = c.type as ConnectionTypeKey;
      const connectionType = getConnectionType(type);
      const displayName = connectionType.title;
      const identity = connectionIdentityOf(
        identityFields[connectionType.lookupStrategy],
        c,
      );
      (c as { title?: string }).title =
        typeCounts.get(type)! > 1 && identity
          ? `${displayName} (${identity})`
          : displayName;
    }
  }
}

function assignDefaultAuthTitles(connections: ConfiguredConnection[]): void {
  for (const c of connections) {
    const type = c.type as ConnectionTypeKey;
    const connectionType = getConnectionType(type);
    for (const auth of c.auth) {
      const authMethod = connectionType.authMethods.find(
        am => am.method === auth.method,
      );
      // The config schema only allows methods declared by the connection
      // type, so failing to find one means that invariant has been broken.
      if (!authMethod) {
        throw new Error(
          `Unknown auth method "${auth.method}" for connection type "${type}"`,
        );
      }
      auth.title ??= authMethod.title;
    }
  }
}

/**
 * Builds the effective list of connections from configuration.
 *
 * @remarks
 *
 * Converts legacy `integrations` config (and the top-level `aws` config) into
 * connections and merges them with connections declared explicitly under
 * `connections`. Explicit connections take precedence: if a connection type
 * has any explicit entries, all legacy entries of that type are ignored.
 * Duplicate legacy entries that resolve to the same connection are dropped,
 * keeping the first entry, to match the legacy lookup behavior.
 *
 * The returned connections are fully validated against each connection type's
 * schemas and have default connection and auth method titles assigned.
 *
 * An `InputError` is thrown if any part of the configuration is invalid, for
 * example when a connection fails schema validation or when multiple
 * connections of the same type resolve to the same identity.
 *
 * @public
 */
export function buildConnectionsFromConfig(options: {
  config: Config;
  logger?: { debug(message: string): void; warn(message: string): void };
}): ConfiguredConnection[] {
  const { config, logger } = options;

  // Conversion itself can throw, e.g. for config values of an unexpected
  // type, so it gets the same error context as the validation below.
  let rawLegacy: JsonObject[];
  try {
    rawLegacy = getLegacyIntegrations(config);
  } catch (e) {
    throw new InputError(
      `Failed to convert legacy integrations config:\n${describeError(e)}`,
    );
  }
  const legacy = dedupeLegacy(validateLegacy(rawLegacy), logger);

  const rawConnections = config.getOptional('connections');
  if (rawConnections !== undefined && !Array.isArray(rawConnections)) {
    throw new InputError(
      'Expected "connections" config to be an array of connection objects',
    );
  }

  const fromConfig = validateConfig(
    (rawConnections as JsonObject[] | undefined) ?? [],
  );

  logger?.debug(
    `Connections configuration resolved ${legacy.length} connection${
      legacy.length === 1 ? '' : 's'
    } from legacy integrations and ${fromConfig.length} explicit connection${
      fromConfig.length === 1 ? '' : 's'
    }`,
  );

  if (legacy.length === 0 && fromConfig.length === 0) {
    return [];
  }

  const connections = combineConnectionSources(legacy, fromConfig, logger);

  // Singleton connection types (e.g. aws) allow at most one connection in
  // the config. Multiton types (e.g. github) allow many, keyed by their
  // identity field so each must be unique.
  const singletonsSeen = new Set<string>();
  const identitiesSeen = new Set<string>();
  for (const c of connections) {
    const connectionType = getConnectionType(c.type as ConnectionTypeKey);

    if (connectionType.cardinality === 'singleton') {
      if (singletonsSeen.has(c.type)) {
        throw new InputError(
          `Duplicate connection of type "${c.type}"; this is a singleton connection type that only allows one entry`,
        );
      }
      singletonsSeen.add(c.type);
    } else {
      const identityField = identityFields[connectionType.lookupStrategy];
      const identity = connectionIdentityOf(identityField, c);
      if (identity !== undefined) {
        const key = `${c.type} ${identity}`;
        if (identitiesSeen.has(key)) {
          throw new InputError(
            `Duplicate connection of type "${c.type}" for ${identityField} "${identity}"`,
          );
        }
        identitiesSeen.add(key);
      }
    }
  }

  assignDefaultTitles(connections);
  assignDefaultAuthTitles(connections);

  return connections;
}
