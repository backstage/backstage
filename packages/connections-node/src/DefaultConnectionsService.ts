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
  ConnectionLookupStrategy,
  ConnectionsService,
  ConnectionTypeDefinition,
  ConnectionType,
  LookupConnectionType,
} from '@backstage/connections';
import type { ConfiguredConnection } from '@backstage/connections/config';
import { buildConnectionsFromConfig } from '@backstage/connections/config';
import { getConnectionType } from './lookup';
import { lookupStrategies } from './lookupStrategies';
import { NotAllowedError, NotFoundError } from '@backstage/errors';

type ConnectionQuery<TType extends ConnectionType> =
  LookupConnectionType<TType> extends ConnectionTypeDefinition<
    infer TDefinition
  >
    ? TDefinition['query']
    : never;

function getLookupStrategy<K extends ConnectionLookupStrategy>(
  name: K,
): (typeof lookupStrategies)[K] {
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
  private readonly connections: ConfiguredConnection[];

  constructor(logger: LoggerService, connections: ConfiguredConnection[]) {
    this.logger = logger;
    this.connections = connections;
  }

  async find<
    TType extends ConnectionType,
    TAuthMethod extends LookupConnectionType<TType>['authMethods'][number]['method'],
  >(options: {
    type: TType;
    query: ConnectionQuery<TType>;
    authMethods?: readonly [TAuthMethod, ...TAuthMethod[]];
  }): Promise<
    Connection<TType, TAuthMethod> | Omit<Connection<TType>, 'auth'>
  > {
    const result = await this.findOptional(options);
    if (!result) {
      throw new NotFoundError(
        `Connection not found for type "${options.type}"`,
      );
    }
    return result;
  }

  private async findOptional<
    TType extends ConnectionType,
    TAuthMethod extends LookupConnectionType<TType>['authMethods'][number]['method'],
  >({
    type,
    query,
    authMethods,
  }: {
    type: TType;
    query: ConnectionQuery<TType>;
    authMethods?: readonly [TAuthMethod, ...TAuthMethod[]];
  }): Promise<
    Connection<TType, TAuthMethod> | Omit<Connection<TType>, 'auth'> | undefined
  > {
    const connectionType = getConnectionType(type);
    const strategy = getLookupStrategy(connectionType.lookupStrategy);
    const identity = strategy.identityFromQuery(query);

    this.logger.debug(
      `Finding connection of type "${type}"${
        identity ? ` matching ${strategy.identityField} "${identity}"` : ''
      }`,
    );

    let connection: ConfiguredConnection | undefined;
    if (identity !== undefined) {
      connection = this.connections.find(
        c => c.type === type && connectionIdentityOf(strategy, c) === identity,
      );
    } else {
      connection = this.connections.find(c => c.type === type);
    }

    if (!connection) {
      return undefined;
    }

    if (!authMethods) {
      const { auth: _, ...info } = connection;
      return info as Omit<Connection<TType>, 'auth'>;
    }

    if (connection.auth.length === 0) {
      throw new NotAllowedError(
        `Connection of type "${type}"${
          identity ? ` for ${strategy.identityField} "${identity}"` : ''
        } has no auth method available to this plugin`,
      );
    }

    const matchAuth = (connectionType as any).matchAuth as
      | ((authMethods: any[], query: any) => any | undefined)
      | undefined;

    const selected = matchAuth
      ? matchAuth(connection.auth, query)
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
  private readonly connections: ConfiguredConnection[];
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
    this.connections.push(
      ...buildConnectionsFromConfig({
        config: this.config,
        logger: this.logger,
      }),
    );

    if (this.connections.length === 0) {
      return;
    }

    this.logger.info(
      `Loaded ${this.connections.length} connection${
        this.connections.length === 1 ? '' : 's'
      } from configuration`,
    );
  }

  #getConnectionsForPlugin(pluginId: string): ConfiguredConnection[] {
    // Filter connections and auth methods by plugin scope. Auth entries
    // explicitly matched to this plugin are ordered before unscoped entries
    // so that plugin-specific credentials take precedence.
    return this.connections.flatMap(connection => {
      if (connection.match && !connection.match.plugins.includes(pluginId)) {
        return [];
      }

      const pluginMatched = connection.auth.filter(a =>
        a.match?.plugins.includes(pluginId),
      );
      const unmatched = connection.auth.filter(a => !a.match);

      return [{ ...connection, auth: [...pluginMatched, ...unmatched] }];
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
