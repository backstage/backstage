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
  AuthenticationStrategy,
  CustomResource,
  KubernetesClustersSupplier,
  KubernetesClusterSupplierFactory,
  KubernetesFetcher,
  KubernetesFetcherFactory,
  KubernetesObjectsProviderFactory,
  KubernetesObjectTypes,
  KubernetesServiceLocator,
  KubernetesServiceLocatorFactory,
  ObjectToFetch,
} from '@backstage/plugin-kubernetes-node';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import {
  AuthService,
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { buildDefaultAuthStrategyMap } from '../auth/buildDefaultAuthStrategyMap';
import { Duration } from 'luxon';
import { getCombinedClusterSupplier } from '../cluster-locator';
import { DispatchStrategy } from '../auth/DispatchStrategy';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { buildDefaultServiceLocator } from '../service-locator/buildDefaultServiceLocator';
import {
  ALL_OBJECTS,
  DEFAULT_OBJECTS,
  KubernetesFanOutHandler,
} from './KubernetesFanOutHandler';

type Opts = {
  fetcher?: KubernetesFetcherFactory;
  clusterSupplier?: KubernetesClusterSupplierFactory;
  serviceLocator?: KubernetesServiceLocatorFactory;
  objectsProvider?: KubernetesObjectsProviderFactory;
  authStrategyMap?: Map<string, AuthenticationStrategy>;
  logger: LoggerService;
  config: RootConfigService;
  catalog: CatalogService;
  auth: AuthService;
};

export class KubernetesInitializer {
  private readonly opts: Opts;

  constructor(opts: Opts) {
    this.opts = opts;
  }

  static create(opts: Opts) {
    return new KubernetesInitializer(opts);
  }

  private async defaultFetcher() {
    return new KubernetesClientBasedFetcher({
      logger: this.opts.logger,
    });
  }

  private async defaultAuthStrategy() {
    return buildDefaultAuthStrategyMap({
      logger: this.opts.logger,
      config: this.opts.config,
    });
  }

  private async defaultClusterSupplier(opts: {
    authStrategyMap: Map<string, AuthenticationStrategy>;
  }) {
    const refreshInterval = Duration.fromObject({
      minutes: 60,
    });

    return getCombinedClusterSupplier(
      this.opts.config,
      this.opts.catalog,
      new DispatchStrategy({
        authStrategyMap: Object.fromEntries(opts.authStrategyMap.entries()),
      }),
      this.opts.logger,
      refreshInterval,
      this.opts.auth,
    );
  }

  private async defaultServiceLocator(opts: {
    clusterSupplier: KubernetesClustersSupplier;
  }) {
    return buildDefaultServiceLocator({
      config: this.opts.config,
      clusterSupplier: opts.clusterSupplier,
    });
  }

  private async defaultObjectsProvider(opts: {
    clusterSupplier: KubernetesClustersSupplier;
    authStrategyMap: Map<string, AuthenticationStrategy>;
    fetcher: KubernetesFetcher;
    serviceLocator: KubernetesServiceLocator;
    customResources: CustomResource[];
    objectTypesToFetch: ObjectToFetch[];
  }) {
    return new KubernetesFanOutHandler({
      logger: this.opts.logger,
      config: this.opts.config,
      fetcher: opts.fetcher,
      serviceLocator: opts.serviceLocator,
      customResources: opts.customResources,
      objectTypesToFetch: opts.objectTypesToFetch,
      authStrategy: new DispatchStrategy({
        authStrategyMap: Object.fromEntries(opts.authStrategyMap.entries()),
      }),
    });
  }

  private async defaultObjectsProviderOptions() {
    const customResources: CustomResource[] = (
      this.opts.config.getOptionalConfigArray('kubernetes.customResources') ??
      []
    ).map(
      c =>
        ({
          group: c.getString('group'),
          apiVersion: c.getString('apiVersion'),
          plural: c.getString('plural'),
          objectType: 'customresources',
        } as CustomResource),
    );
    const objectTypesToFetchStrings = this.opts.config.getOptionalStringArray(
      'kubernetes.objectTypes',
    ) as KubernetesObjectTypes[];

    const apiVersionOverrides = this.opts.config.getOptionalConfig(
      'kubernetes.apiVersionOverrides',
    );

    let objectTypesToFetch: ObjectToFetch[] | undefined = undefined;

    if (objectTypesToFetchStrings) {
      objectTypesToFetch = ALL_OBJECTS.filter(obj =>
        objectTypesToFetchStrings.includes(obj.objectType),
      );
    }

    if (apiVersionOverrides) {
      objectTypesToFetch ??= DEFAULT_OBJECTS;

      for (const obj of objectTypesToFetch) {
        if (apiVersionOverrides.has(obj.objectType)) {
          obj.apiVersion = apiVersionOverrides.getString(obj.objectType);
        }
      }
    }

    return {
      customResources,
      objectTypesToFetch: objectTypesToFetch ?? DEFAULT_OBJECTS,
    };
  }

  async init() {
    const fetcher =
      (await this.opts.fetcher?.({
        getDefault: () => this.defaultFetcher(),
      })) ?? (await this.defaultFetcher());

    const authStrategyMap =
      this.opts.authStrategyMap ?? (await this.defaultAuthStrategy());

    const clusterSupplier =
      (await this.opts.clusterSupplier?.({
        getDefault: () => this.defaultClusterSupplier({ authStrategyMap }),
      })) ?? (await this.defaultClusterSupplier({ authStrategyMap }));

    const serviceLocator =
      (await this.opts.serviceLocator?.({
        getDefault: () => this.defaultServiceLocator({ clusterSupplier }),
        clusterSupplier,
      })) ?? (await this.defaultServiceLocator({ clusterSupplier }));

    const { customResources, objectTypesToFetch } =
      await this.defaultObjectsProviderOptions();

    const objectsProvider =
      (await this.opts.objectsProvider?.({
        getDefault: () =>
          this.defaultObjectsProvider({
            clusterSupplier,
            authStrategyMap,
            fetcher,
            serviceLocator,
            customResources,
            objectTypesToFetch,
          }),
        fetcher,
        clusterSupplier,
        serviceLocator,
        customResources,
        objectTypesToFetch,
        authStrategy: new DispatchStrategy({
          authStrategyMap: Object.fromEntries(authStrategyMap.entries()),
        }),
      })) ??
      (await this.defaultObjectsProvider({
        clusterSupplier,
        authStrategyMap,
        fetcher,
        serviceLocator,
        customResources,
        objectTypesToFetch,
      }));

    return {
      fetcher,
      authStrategyMap,
      clusterSupplier,
      serviceLocator,
      objectsProvider,
    };
  }
}
