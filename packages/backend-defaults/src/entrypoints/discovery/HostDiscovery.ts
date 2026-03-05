/*
 * Copyright 2020 The Backstage Authors
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
import {
  DiscoveryService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { readHttpServerOptions } from '../rootHttpRouter/http/config';
import { SrvResolvers } from './SrvResolvers';
import { trimEnd } from 'lodash';
import { getEndpoints } from './parsing';

type Resolver = (pluginId: string) => Promise<string>;

/**
 * A list of target base URLs and their associated plugins.
 *
 * @public
 */
export interface HostDiscoveryEndpoint {
  /**
   * The target base URL to use for the given set of plugins. Note that this
   * needs to be a full URL _including_ the protocol and path parts that fully
   * address the root of a plugin's API endpoints.
   *
   * @remarks
   *
   * Can be either a single URL or an object where you can explicitly give a
   * dedicated URL for internal (as seen from the backend) and/or external (as
   * seen from the frontend) lookups.
   *
   * The default behavior is to use the backend base URL for external lookups,
   * and a URL formed from the `.listen` and `.https` configs for internal
   * lookups. Adding discovery endpoints as described here overrides one or both
   * of those behaviors for a given set of plugins.
   *
   * URLs can be in the form of a regular HTTP or HTTPS URL if you are using
   * A/AAAA/CNAME records or IP addresses. Specifically for internal URLs, if
   * you add `+src` to the protocol part then the hostname is treated as an SRV
   * record name and resolved. For example, if you pass in
   * `http+srv://<record>/path` then the record part is resolved into an
   * actual host and port (with random weighted choice as usual when there is
   * more than one match).
   *
   * Any strings with `{{pluginId}}` or `{{ pluginId }}` placeholders in them
   * will have them replaced with the plugin ID.
   *
   * Example URLs:
   *
   * - `https://internal.example.com/secure/api/{{ pluginId }}`
   * - `http+srv://backstage-plugin-{{pluginId}}.http.services.company.net/api/{{pluginId}}`
   *   (can only be used in the `internal` key)
   */
  target:
    | string
    | {
        internal?: string;
        external?: string;
      };

  /**
   * Array of plugins which use that target base URL.
   *
   * The special value `*` can be used to match all plugins.
   */
  plugins: string[];
}

/**
 * Options for the {@link HostDiscovery} class.
 *
 * @public
 */
export interface HostDiscoveryOptions {
  /**
   * The logger to use.
   */
  logger: LoggerService;

  /**
   * A default set of endpoints to use.
   *
   * @remarks
   *
   * These endpoints have lower priority than any that are defined in
   * app-config, but higher priority than the fallback ones.
   *
   * This parameter is usedful for example if you want to provide a shared
   * library of core services to your plugin developers, which is set up for the
   * default behaviors in your org. This alleviates the need for replicating any
   * given set of endpoint config in every backend that you deploy.
   */
  defaultEndpoints?: HostDiscoveryEndpoint[];
}

/**
 * A basic {@link @backstage/backend-plugin-api#DiscoveryService} implementation
 * that can handle plugins that are hosted in a single or multiple deployments.
 *
 * @public
 * @remarks
 *
 * Configuration is read from the `backend` config section, specifically the
 * `.baseUrl` for discovering the external URL, and the `.listen` and `.https`
 * config for the internal one. The fixed base path for these is `/api`, meaning
 * for example the default full internal path for the `catalog` plugin typically
 * will be `http://localhost:7007/api/catalog`.
 *
 * Those defaults can be overridden by providing a target and corresponding
 * plugins in `discovery.endpoints`, e.g.:
 *
 * ```yaml
 * discovery:
 *   endpoints:
 *     # Set a static internal and external base URL for a plugin
 *     - target: https://internal.example.com/internal-catalog
 *       plugins: [catalog]
 *     # Sets a dynamic internal and external base URL pattern for two plugins
 *     - target: https://internal.example.com/secure/api/{{pluginId}}
 *       plugins: [auth, permission]
 *     # Sets a dynamic base URL pattern for only the internal resolution for all
 *     # other plugins, while leaving the external resolution unaffected
 *     - target:
 *         internal: http+srv://backstage-plugin-{{pluginId}}.http.${SERVICE_DOMAIN}/api/{{pluginId}}
 *       plugins: [*]
 * ```
 */
export class HostDiscovery implements DiscoveryService {
  #srvResolver: SrvResolvers;
  #internalResolvers: Map<string, Resolver> = new Map();
  #externalResolvers: Map<string, Resolver> = new Map();
  #internalFallbackResolver: Resolver = async () => {
    throw new Error('Not initialized');
  };
  #externalFallbackResolver: Resolver = async () => {
    throw new Error('Not initialized');
  };

  static fromConfig(config: RootConfigService, options?: HostDiscoveryOptions) {
    const discovery = new HostDiscovery(new SrvResolvers());

    discovery.#updateResolvers(config, options?.defaultEndpoints);
    config.subscribe?.(() => {
      try {
        discovery.#updateResolvers(config, options?.defaultEndpoints);
      } catch (e) {
        options?.logger.error(`Failed to update discovery service: ${e}`);
      }
    });

    return discovery;
  }

  private constructor(srvResolver: SrvResolvers) {
    this.#srvResolver = srvResolver;
    this.#internalResolvers = new Map();
    this.#externalResolvers = new Map();
    this.#internalFallbackResolver = () => {
      throw new Error('Not initialized');
    };
    this.#externalFallbackResolver = () => {
      throw new Error('Not initialized');
    };
  }

  async getBaseUrl(pluginId: string): Promise<string> {
    const resolver =
      this.#internalResolvers.get(pluginId) ??
      this.#internalResolvers.get('*') ??
      this.#internalFallbackResolver;
    return await resolver(pluginId);
  }

  async getExternalBaseUrl(pluginId: string): Promise<string> {
    const resolver =
      this.#externalResolvers.get(pluginId) ??
      this.#externalResolvers.get('*') ??
      this.#externalFallbackResolver;
    return await resolver(pluginId);
  }

  #updateResolvers(config: Config, defaultEndpoints?: HostDiscoveryEndpoint[]) {
    this.#updateFallbackResolvers(config);
    this.#updatePluginResolvers(config, defaultEndpoints);
  }

  #updateFallbackResolvers(config: Config) {
    const backendBaseUrl = trimEnd(config.getString('backend.baseUrl'), '/');

    const {
      listen: { host: listenHost = '::', port: listenPort },
    } = readHttpServerOptions(config.getConfig('backend'));
    const protocol = config.has('backend.https') ? 'https' : 'http';

    // Translate bind-all to localhost, and support IPv6
    let host = listenHost;
    if (host === '::' || host === '') {
      // We use localhost instead of ::1, since IPv6-compatible systems should default
      // to using IPv6 when they see localhost, but if the system doesn't support IPv6
      // things will still work.
      host = 'localhost';
    } else if (host === '0.0.0.0') {
      host = '127.0.0.1';
    }
    if (host.includes(':')) {
      host = `[${host}]`;
    }

    this.#internalFallbackResolver = this.#makeResolver(
      `${protocol}://${host}:${listenPort}/api/{{pluginId}}`,
      false,
    );
    this.#externalFallbackResolver = this.#makeResolver(
      `${backendBaseUrl}/api/{{pluginId}}`,
      false,
    );
  }

  #updatePluginResolvers(
    config: Config,
    defaultEndpoints?: HostDiscoveryEndpoint[],
  ) {
    // Start out with the default endpoints, if any
    const endpoints = defaultEndpoints?.slice() ?? [];

    // Allow config to override the default endpoints
    endpoints.push(...getEndpoints(config));

    // Build up a new set of resolvers
    const internalResolvers: Map<string, Resolver> = new Map();
    const externalResolvers: Map<string, Resolver> = new Map();
    for (const { target, plugins } of endpoints) {
      let internalResolver: Resolver | undefined;
      let externalResolver: Resolver | undefined;

      if (typeof target === 'string') {
        internalResolver = externalResolver = this.#makeResolver(target, false);
      } else {
        if (target.internal) {
          internalResolver = this.#makeResolver(target.internal, true);
        }
        if (target.external) {
          externalResolver = this.#makeResolver(target.external, false);
        }
      }

      if (internalResolver) {
        for (const pluginId of plugins) {
          internalResolvers.set(pluginId, internalResolver);
        }
      }
      if (externalResolver) {
        for (const pluginId of plugins) {
          externalResolvers.set(pluginId, externalResolver);
        }
      }
    }

    // Only persist if no errors were thrown above
    this.#internalResolvers = internalResolvers;
    this.#externalResolvers = externalResolvers;
  }

  #makeResolver(urlPattern: string, allowSrv: boolean): Resolver {
    const withPluginId = (pluginId: string, url: string) => {
      return url.replace(
        /\{\{\s*pluginId\s*\}\}/g,
        encodeURIComponent(pluginId),
      );
    };

    if (!this.#srvResolver.isSrvUrl(urlPattern)) {
      return async pluginId => withPluginId(pluginId, urlPattern);
    }

    if (!allowSrv) {
      throw new Error(
        `SRV resolver URLs cannot be used in the target for external endpoints`,
      );
    }

    const lazyResolvers = new Map<string, () => Promise<string>>();
    return async pluginId => {
      let lazyResolver = lazyResolvers.get(pluginId);
      if (!lazyResolver) {
        lazyResolver = this.#srvResolver.getResolver(
          withPluginId(pluginId, urlPattern),
        );
        lazyResolvers.set(pluginId, lazyResolver);
      }
      return await lazyResolver();
    };
  }
}
