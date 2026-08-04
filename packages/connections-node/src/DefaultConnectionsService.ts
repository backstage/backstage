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
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import type {
  Connection,
  ConnectionAuthMethodKey,
  ConnectionsService,
  ConnectionTypeKey,
  LookupStrategy,
  LookupStrategyDefinition,
  LookupStrategyParams,
  LookupConnectionType,
} from '@backstage/connections';
import { lookupStrategies } from '@backstage/connections';
import { getConnectionType, isConnectionTypeKey } from './lookup';
import type { RootConnection } from './types';
import { JsonObject } from '@backstage/types';
import {
  InputError,
  NotAllowedError,
  NotFoundError,
  toError,
} from '@backstage/errors';
import { z } from 'zod/v4';
import { getLegacyIntegrations } from './getLegacyIntegrations';
import { combineConnectionSources } from './combineConnectionSources';

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

function getLookupStrategy<K extends LookupStrategy>(
  name: K,
): LookupStrategyDefinition<K> {
  return lookupStrategies[name];
}

// The identity field name is only known at runtime, so the typed connection
// object cannot be indexed directly; this helper contains the erased read.
function connectionIdentityOf(
  strategy: { identityField?: string },
  connection: object,
): string | undefined {
  if (!strategy.identityField) {
    return undefined;
  }
  const value = (connection as Record<string, unknown>)[strategy.identityField];
  return typeof value === 'string' ? value : undefined;
}

class PluginConnectionsService implements ConnectionsService {
  private readonly logger: LoggerService;
  private readonly connections: Connection[];

  constructor(logger: LoggerService, connections: Connection[]) {
    this.logger = logger;
    this.connections = connections;
  }

  async find<
    TType extends ConnectionTypeKey,
    TAuthMethod extends ConnectionAuthMethodKey<TType>,
  >(options: {
    type: TType;
    params: LookupStrategyParams[LookupConnectionType<TType>['lookupStrategy']];
    authMethods: readonly [TAuthMethod, ...TAuthMethod[]];
  }): Promise<Connection<TType, TAuthMethod>> {
    const result = await this.findOptional(options);
    if (!result) {
      throw new NotFoundError(
        `Connection not found for type "${options.type}"`,
      );
    }
    return result;
  }

  async findOptional<
    TType extends ConnectionTypeKey,
    TAuthMethod extends ConnectionAuthMethodKey<TType>,
  >({
    type,
    params,
    authMethods,
  }: {
    type: TType;
    params: LookupStrategyParams[LookupConnectionType<TType>['lookupStrategy']];
    authMethods: readonly [TAuthMethod, ...TAuthMethod[]];
  }): Promise<Connection<TType, TAuthMethod> | undefined> {
    const connectionType = getConnectionType(type);
    const strategy = getLookupStrategy(connectionType.lookupStrategy);
    const identity = strategy.identityFromParams(params);

    this.logger.debug(
      `Finding connection of type "${type}"${
        identity ? ` matching ${strategy.identityField} "${identity}"` : ''
      }`,
    );

    let connection: Connection<TType> | undefined;
    if (identity !== undefined) {
      connection = this.connections.find(
        c => c.type === type && connectionIdentityOf(strategy, c) === identity,
      ) as Connection<TType> | undefined;
    } else {
      connection = this.connections.find(c => c.type === type) as
        | Connection<TType>
        | undefined;
    }

    if (!connection) {
      return undefined;
    }

    if (connection.auth.length === 0) {
      throw new NotAllowedError(
        `Connection of type "${type}"${
          identity ? ` for ${strategy.identityField} "${identity}"` : ''
        } has no auth method available to this plugin`,
      );
    }

    const matchAuth = connectionType.matchAuth as
      | ((authMethods: any[], params: any) => any | undefined)
      | undefined;

    const selected = matchAuth
      ? matchAuth(connection.auth, params)
      : connection.auth[0];

    if (!selected) {
      return undefined;
    }

    if (!(authMethods as readonly string[]).includes(selected.method)) {
      throw new NotAllowedError(
        `Connection not found for type "${type}" with auth method "${selected.method}"`,
      );
    }

    this.logger.debug(
      `Selected connection of type "${type}"${
        identity ? ` for ${strategy.identityField} "${identity}"` : ''
      } using auth method "${selected.method}"`,
    );

    return {
      ...connection,
      auth: selected,
    } as Connection<TType, TAuthMethod>;
  }
}

/** @public */
export class DefaultConnectionsService {
  private readonly logger: LoggerService;
  private readonly connections: RootConnection[];
  private readonly config: RootConfigService;

  private constructor(logger: LoggerService, config: RootConfigService) {
    this.logger = logger;
    this.config = config;
    this.connections = [];
    this.#registerConnectionsFromConfig();
  }

  static create(options: {
    logger: LoggerService;
    config: RootConfigService;
  }): DefaultConnectionsService {
    return new DefaultConnectionsService(options.logger, options.config);
  }

  #registerConnectionsFromConfig(): void {
    const legacy = this.#validateLegacy(getLegacyIntegrations(this.config));

    const rawConnections = this.config.getOptional('connections');
    if (rawConnections !== undefined && !Array.isArray(rawConnections)) {
      throw new InputError(
        'Expected "connections" config to be an array of connection objects',
      );
    }

    const fromConfig = this.#validateConfig(
      (rawConnections as JsonObject[] | undefined) ?? [],
    );

    this.logger.debug(
      `Connections configuration resolved ${legacy.length} connection${
        legacy.length === 1 ? '' : 's'
      } from legacy integrations and ${fromConfig.length} explicit connection${
        fromConfig.length === 1 ? '' : 's'
      }`,
    );

    if (legacy.length === 0 && fromConfig.length === 0) {
      return;
    }

    this.connections.push(
      ...combineConnectionSources(legacy, fromConfig, this.logger),
    );

    const seen = new Set<string>();
    for (const c of this.connections) {
      const connectionType = getConnectionType(c.type as ConnectionTypeKey);
      const strategy = getLookupStrategy(connectionType.lookupStrategy);
      const identity = connectionIdentityOf(strategy, c);
      const key = `${c.type} ${identity ?? ''}`;
      if (seen.has(key)) {
        throw new InputError(
          identity !== undefined
            ? `Duplicate connection of type "${c.type}" for ${strategy.identityField} "${identity}"`
            : `Duplicate connection of type "${c.type}"`,
        );
      }
      seen.add(key);
    }

    this.#assignDefaultTitles();
    this.#assignDefaultAuthTitles();

    this.logger.info(
      `Loaded ${this.connections.length} connection${
        this.connections.length === 1 ? '' : 's'
      } from configuration`,
    );
  }

  #validateConfig(raw: JsonObject[]): RootConnection[] {
    return raw.map(v => {
      try {
        return this.#validateConnection(v);
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

  #validateLegacy(raw: JsonObject[]): RootConnection[] {
    const result: RootConnection[] = [];
    for (const v of raw) {
      try {
        result.push(this.#validateConnection(v));
      } catch (e) {
        const type = typeof v.type === 'string' ? v.type : 'unknown';
        this.logger.error(
          `Failed to validate connection of type "${type}":\n${describeError(
            e,
          )}`,
        );
      }
    }
    return result;
  }

  #validateConnection(connection: JsonObject): RootConnection {
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
      } as RootConnection['auth'][number];
    });

    const { type, auth: _, title, match, ...configFields } = connection;
    const parsed = connectionType.configSchema.parse(configFields);

    return {
      ...parsed,
      type: connection.type,
      title: title as string | undefined,
      match: match as { plugins: string[] } | undefined,
      auth,
    } as RootConnection;
  }

  #assignDefaultTitles(): void {
    const typeCounts = new Map<string, number>();
    for (const c of this.connections) {
      const type = c.type as ConnectionTypeKey;
      typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    }
    for (const c of this.connections) {
      if (!c.title) {
        const type = c.type as ConnectionTypeKey;
        const connectionType = getConnectionType(type);
        const displayName = connectionType.title;
        const identity = connectionIdentityOf(
          getLookupStrategy(connectionType.lookupStrategy),
          c,
        );
        (c as { title?: string }).title =
          typeCounts.get(type)! > 1 && identity
            ? `${displayName} (${identity})`
            : displayName;
      }
    }
  }

  #assignDefaultAuthTitles(): void {
    for (const c of this.connections) {
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

  #getConnectionsForPlugin(pluginId: string): Connection[] {
    // Filter connections and hide auth methods based on these conditions:
    // 1. Include Connections with no plugin matcher condition
    // 2. Include Connections with a plugin matcher condition for this plugin
    // 3. Include auth methods with no plugin matcher condition
    // 4. Remove auth methods with a plugin matcher condition for other plugins
    return this.connections.flatMap(({ match, auth, ...rest }) => {
      if (match && !match.plugins.includes(pluginId)) {
        return [];
      }

      const pluginMatched: Connection['auth'] = [];
      const unmatched: Connection['auth'] = [];
      for (const { match: authMatch, ...authRest } of auth) {
        if (authMatch) {
          if (!authMatch.plugins.includes(pluginId)) continue;
          pluginMatched.push(authRest as Connection['auth'][number]);
        } else {
          unmatched.push(authRest as Connection['auth'][number]);
        }
      }

      return [
        { ...rest, auth: [...pluginMatched, ...unmatched] } as Connection,
      ];
    });
  }

  forPlugin(
    pluginId: string,
    options?: {
      logger: LoggerService;
    },
  ): ConnectionsService {
    const logger = options?.logger ?? this.logger;
    return new PluginConnectionsService(
      logger,
      this.#getConnectionsForPlugin(pluginId),
    );
  }
}
