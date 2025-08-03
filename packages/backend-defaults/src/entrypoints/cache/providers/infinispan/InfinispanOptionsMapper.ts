/*
 * Copyright 2025 The Backstage Authors
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
import {
  InfinispanAuthOptions,
  InfinispanCacheStoreOptions,
  InfinispanClientAuthOptions,
  InfinispanClientBehaviorOptions,
  InfinispanClusterConfig,
  InfinispanServerConfig,
  InfinispanSslOptions,
} from '../../types';

export class InfinispanOptionsMapper {
  /**
   * Parses Infinispan options from the provided configuration path.
   *
   * @param storeConfigPath - The configuration path for the Infinispan store.
   * @param config - The root configuration service to retrieve the Infinispan configuration.
   * @param logger - An optional logger service for logging errors and warnings.
   * @returns Parsed Infinispan cache store options.
   */
  public static parseInfinispanOptions(
    storeConfigPath: string,
    config: RootConfigService,
    logger?: LoggerService,
  ): InfinispanCacheStoreOptions {
    const infinispanConfig = config.getConfig(storeConfigPath);
    const parsedOptions: Partial<InfinispanCacheStoreOptions> = {
      type: 'infinispan',
    };

    // Parse Servers & Clusters Configurations
    if (infinispanConfig.has('servers')) {
      const serversConfig = infinispanConfig.get('servers');
      if (Array.isArray(serversConfig)) {
        parsedOptions.servers = infinispanConfig.getConfigArray('servers').map(
          serverConf =>
            ({
              host: serverConf.getString('host'),
              port: serverConf.getNumber('port'),
            } as InfinispanServerConfig),
        );
      } else if (typeof serversConfig === 'object' && serversConfig !== null) {
        const serverConf = infinispanConfig.getConfig('servers');
        parsedOptions.servers = {
          host: serverConf.getString('host'),
          port: serverConf.getNumber('port'),
        } as InfinispanServerConfig;
      } else {
        logger?.error(
          `Infinispan 'servers' configuration at ${storeConfigPath} must be an object or an array.`,
        );
        throw new Error(
          `Infinispan 'servers' configuration at ${storeConfigPath} is invalid.`,
        );
      }
    } else {
      logger?.error(
        `Infinispan configuration at ${storeConfigPath} is missing the 'servers' definition.`,
      );
      throw new Error(
        `Infinispan configuration at ${storeConfigPath} must define 'servers'.`,
      );
    }

    // The parsed options block to send to the Infinispan client
    // This will be used to configure the Infinispan client behavior.
    const behaviorOptions: Partial<InfinispanClientBehaviorOptions> = {};

    if (infinispanConfig.has('clusters')) {
      const clustersConfig = infinispanConfig.getConfigArray('clusters');
      const clusterOptions: InfinispanClusterConfig[] = [];
      clustersConfig?.forEach(clusterConf => {
        const name = clusterConf.getOptionalString('name');
        const cluster: InfinispanClusterConfig = {
          ...(name && { name }),
          servers: clusterConf.getConfigArray('servers').map(serverConf => ({
            host: serverConf.getString('host'),
            port: serverConf.getNumber('port'),
          })),
        };
        clusterOptions.push(cluster);
        behaviorOptions.clusters = clusterOptions;
      });
    }

    // Parse Default Options Start...
    if (infinispanConfig.has('version')) {
      const clientVersion = infinispanConfig.getString('version');
      if (
        clientVersion === '2.9' ||
        clientVersion === '2.5' ||
        clientVersion === '2.2'
      ) {
        behaviorOptions.version = clientVersion;
      } else if (clientVersion !== null && clientVersion !== undefined) {
        logger?.warn(
          `Invalid Infinispan client version "${clientVersion}" in config at ${storeConfigPath}.version. Must be "2.9", "2.5", or "2.2". It will be ignored, and the client may use a default or fail.`,
        );
      }
    }

    if (infinispanConfig.has('cacheName')) {
      behaviorOptions.cacheName = infinispanConfig.getString('cacheName');
    }

    const mediaType = infinispanConfig.getOptionalString('mediaType');
    if (mediaType === 'text/plain' || mediaType === 'application/json') {
      behaviorOptions.mediaType = mediaType;
    } else if (mediaType !== null && mediaType !== undefined) {
      logger?.warn(
        `Invalid Infinispan mediaType "${mediaType}" in config at ${storeConfigPath}.mediaType. Must be "text/plain" | "application/json". It will be ignored, and the client may use a default or fail.`,
      );
    }

    if (infinispanConfig.has('maxRetries')) {
      behaviorOptions.maxRetries = infinispanConfig.getNumber('maxRetries');
    }

    if (infinispanConfig.has('topologyUpdates')) {
      behaviorOptions.topologyUpdates =
        infinispanConfig.getBoolean('topologyUpdates');
    }

    // Default Options End...

    // Parse Authentication and SSL Options
    if (infinispanConfig.has('authentication')) {
      const authConfig = infinispanConfig.getConfig('authentication');
      const auth: Partial<InfinispanAuthOptions> = {};

      if (authConfig.has('enabled')) {
        auth.enabled = authConfig.getBoolean('enabled');
      }
      if (authConfig.has('saslMechanism')) {
        auth.saslMechanism = authConfig.getString('saslMechanism');
      }
      if (authConfig.has('userName')) {
        auth.userName = authConfig.getString('userName');
      }
      if (authConfig.has('password')) {
        auth.password = authConfig.getString('password');
      }
      if (authConfig.has('token')) {
        auth.token = authConfig.getString('token');
      }
      if (authConfig.has('authzid')) {
        auth.authzid = authConfig.getString('authzid');
      }

      behaviorOptions.authentication = auth as InfinispanAuthOptions;
    }

    if (infinispanConfig.has('ssl')) {
      const sslConfig = infinispanConfig.getConfig('ssl');
      const ssl: Partial<InfinispanSslOptions> = {};

      if (sslConfig.has('enabled')) {
        ssl.enabled = sslConfig.getBoolean('enabled');
      }
      if (sslConfig.has('secureProtocol')) {
        ssl.secureProtocol = sslConfig.getString('secureProtocol');
      }
      if (sslConfig.has('trustCerts')) {
        ssl.trustCerts = sslConfig.getStringArray('trustCerts');
      }
      if (sslConfig.has('sniHostname')) {
        ssl.sniHostName = sslConfig.getString('sniHostname');
      }

      if (sslConfig.has('clientAuth')) {
        const clientAuth = infinispanConfig.getConfig('clientAuth');
        const clientAuthOpts: Partial<InfinispanClientAuthOptions> = {};

        if (clientAuth.has('key')) {
          clientAuthOpts.key = clientAuth.getString('key');
        }
        if (clientAuth.has('passphrase')) {
          clientAuthOpts.passphrase = clientAuth.getString('passphrase');
        }
        if (clientAuth.has('cert')) {
          clientAuthOpts.cert = clientAuth.getString('cert');
        }
        ssl.clientAuth = clientAuthOpts as InfinispanClientAuthOptions;
      }

      if (sslConfig.has('cryptoStore')) {
        const cryptoStore = infinispanConfig.getConfig('cryptoStore');
        const cryptoStoreOpts: Partial<InfinispanClientAuthOptions> = {};

        if (cryptoStore.has('path')) {
          cryptoStoreOpts.key = cryptoStore.getString('path');
        }
        if (cryptoStore.has('passphrase')) {
          cryptoStoreOpts.passphrase = cryptoStore.getString('passphrase');
        }
        ssl.cryptoStore = cryptoStoreOpts as InfinispanClientAuthOptions;
      }

      behaviorOptions.ssl = ssl as InfinispanSslOptions;
    }

    parsedOptions.options = behaviorOptions as InfinispanClientBehaviorOptions;

    return parsedOptions as InfinispanCacheStoreOptions;
  }
}
