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
  DataFormatOptions,
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
              port: serverConf.getOptionalNumber('port') ?? 11222,
            } as InfinispanServerConfig),
        );
      } else if (typeof serversConfig === 'object' && serversConfig !== null) {
        const serverConf = infinispanConfig.getConfig('servers');
        parsedOptions.servers = {
          host: serverConf.getOptionalString('host') ?? '127.0.0.1',
          port: serverConf.getOptionalString('port') ?? 11222,
        } as InfinispanServerConfig;
      } else {
        throw new Error(
          `Infinispan 'servers' configuration at ${storeConfigPath} is invalid, must be an object or an array.`,
        );
      }
    } else {
      logger?.warn(
        `Infinispan configuration at ${storeConfigPath} is missing the 'servers' definition, will use client defaults.`,
      );
    }

    // The parsed options block to send to the Infinispan client
    // This will be used to configure the Infinispan client behavior.
    const behaviorOptions: Partial<InfinispanClientBehaviorOptions> = {};

    behaviorOptions.clusters = infinispanConfig
      .getOptionalConfigArray('clusters')
      ?.map(clusterConf => {
        const name = clusterConf.getOptionalString('name');
        return {
          ...(name && { name }),
          servers: clusterConf.getConfigArray('servers').map(serverConf => ({
            host: serverConf.getString('host'),
            port: serverConf.getOptionalNumber('port') ?? 11222,
          })),
        } as InfinispanClusterConfig;
      });

    // Parse Default Options Start...
    const clientVersion =
      infinispanConfig.getOptionalString('version') ?? '2.9';
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

    behaviorOptions.cacheName =
      infinispanConfig.getOptionalString('cacheName') ?? 'cache';

    const mediaType = infinispanConfig.getOptionalString('mediaType');
    if (mediaType === 'text/plain' || mediaType === 'application/json') {
      behaviorOptions.mediaType = mediaType;
    } else if (mediaType !== null && mediaType !== undefined) {
      logger?.warn(
        `Invalid Infinispan mediaType "${mediaType}" in config at ${storeConfigPath}.mediaType. Must be "text/plain" | "application/json". It will be ignored, and the client may use a default or fail.`,
      );
    }

    behaviorOptions.maxRetries =
      infinispanConfig.getOptionalNumber('maxRetries');

    behaviorOptions.topologyUpdates =
      infinispanConfig.getOptionalBoolean('topologyUpdates') ?? true;

    // Default Options End...

    // Parse Authentication and SSL Options
    const authConfig = infinispanConfig.getOptionalConfig('authentication');
    const auth: Partial<InfinispanAuthOptions> = {};

    auth.enabled = authConfig?.getOptionalBoolean('enabled');
    auth.saslMechanism = authConfig?.getOptionalString('saslMechanism');
    auth.userName = authConfig?.getOptionalString('userName');
    auth.password = authConfig?.getOptionalString('password');
    auth.token = authConfig?.getOptionalString('token');
    auth.authzid = authConfig?.getOptionalString('authzid');

    behaviorOptions.authentication = auth as InfinispanAuthOptions;

    const sslConfig = infinispanConfig.getOptionalConfig('ssl');
    const ssl: Partial<InfinispanSslOptions> = {};

    ssl.enabled = sslConfig?.getOptionalBoolean('enabled');
    ssl.secureProtocol = sslConfig?.getOptionalString('secureProtocol');
    ssl.trustCerts = sslConfig?.getOptionalStringArray('trustCerts');
    ssl.sniHostName = sslConfig?.getOptionalString('sniHostname');

    const clientAuth = infinispanConfig.getOptionalConfig('clientAuth');
    const clientAuthOpts: Partial<InfinispanClientAuthOptions> = {};

    clientAuthOpts.key = clientAuth?.getOptionalString('key');
    clientAuthOpts.passphrase = clientAuth?.getOptionalString('passphrase');
    clientAuthOpts.cert = clientAuth?.getOptionalString('cert');

    ssl.clientAuth = clientAuthOpts as InfinispanClientAuthOptions;

    const cryptoStore = infinispanConfig.getOptionalConfig('cryptoStore');
    const cryptoStoreOpts: Partial<InfinispanClientAuthOptions> = {};

    cryptoStoreOpts.key = cryptoStore?.getOptionalString('path');
    cryptoStoreOpts.passphrase = cryptoStore?.getOptionalString('passphrase');

    ssl.cryptoStore = cryptoStoreOpts as InfinispanClientAuthOptions;

    behaviorOptions.ssl = ssl as InfinispanSslOptions;

    const dataFormat = infinispanConfig.getOptionalConfig('dataFormat');
    const dataFormatOpts: Partial<DataFormatOptions> = {};

    const keyType = dataFormat?.getOptionalString('keyType') ?? 'text/plain';
    const valueType =
      dataFormat?.getOptionalString('valueType') ?? 'text/plain';

    if (keyType === 'text/plain' || keyType === 'application/json') {
      dataFormatOpts.keyType = keyType;
    } else if (keyType !== null && keyType !== undefined) {
      logger?.warn(
        `Invalid Infinispan dataFormat.keyType "${keyType}" in config at ${storeConfigPath}.dataFormat.keyType. Must be "text/plain" | "application/json". Not mapped, client will use default 'text/plain'.`,
      );
    }

    if (valueType === 'text/plain' || valueType === 'application/json') {
      dataFormatOpts.valueType = valueType;
    } else if (valueType !== null && valueType !== undefined) {
      logger?.warn(
        `Invalid Infinispan dataFormat.valueType "${valueType}" in config at ${storeConfigPath}.dataFormat.valueType. Must be "text/plain" | "application/json". Not mapped, client will use default 'text/plain'.`,
      );
    }
    behaviorOptions.dataFormat = dataFormatOpts as DataFormatOptions;
    parsedOptions.options = behaviorOptions as InfinispanClientBehaviorOptions;

    logger?.debug(
      `Parsed Infinispan options from config at ${storeConfigPath}: ${JSON.stringify(
        parsedOptions,
      )}`,
    );
    return parsedOptions as InfinispanCacheStoreOptions;
  }
}
