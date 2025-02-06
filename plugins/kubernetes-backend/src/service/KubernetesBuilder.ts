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
import { CatalogApi } from '@backstage/catalog-client';
import { Config } from '@backstage/config';
import {
  ANNOTATION_KUBERNETES_AUTH_PROVIDER,
  ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER,
  kubernetesClustersReadPermission,
  kubernetesPermissions,
  kubernetesResourcesReadPermission,
} from '@backstage/plugin-kubernetes-common';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { createPermissionIntegrationRouter } from '@backstage/plugin-permission-node';
import express from 'express';
import Router from 'express-promise-router';
import { Duration } from 'luxon';

import {
  AksStrategy,
  AnonymousStrategy,
  AwsIamStrategy,
  AzureIdentityStrategy,
  DispatchStrategy,
  GoogleServiceAccountStrategy,
  GoogleStrategy,
  OidcStrategy,
  ServiceAccountStrategy,
} from '../auth';
import { getCombinedClusterSupplier } from '../cluster-locator';

import { createLegacyAuthAdapters } from '@backstage/backend-common';
import {
  AuthService,
  BackstageCredentials,
  DiscoveryService,
  HttpAuthService,
  LoggerService,
} from '@backstage/backend-plugin-api';
import {
  AuthenticationStrategy,
  AuthMetadata,
  CustomResource,
  KubernetesClustersSupplier,
  KubernetesFetcher,
  KubernetesObjectsProvider,
  KubernetesObjectTypes,
  KubernetesServiceLocator,
} from '@backstage/plugin-kubernetes-node';
import { addResourceRoutesToRouter } from '../routes/resourcesRoutes';
import { CatalogRelationServiceLocator } from '../service-locator/CatalogRelationServiceLocator';
import { MultiTenantServiceLocator } from '../service-locator/MultiTenantServiceLocator';
import { SingleTenantServiceLocator } from '../service-locator/SingleTenantServiceLocator';
import {
  KubernetesObjectsProviderOptions,
  ObjectsByEntityRequest,
  ServiceLocatorMethod,
} from '../types/types';
import {
  ALL_OBJECTS,
  DEFAULT_OBJECTS,
  KubernetesFanOutHandler,
} from './KubernetesFanOutHandler';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';
import { KubernetesProxy } from './KubernetesProxy';
import { requirePermission } from '../auth/requirePermission';

/**
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 */
export interface KubernetesEnvironment {
  logger: LoggerService;
  config: Config;
  catalogApi: CatalogApi;
  discovery: DiscoveryService;
  permissions: PermissionEvaluator;
  auth?: AuthService;
  httpAuth?: HttpAuthService;
}

/**
 * The return type of the `KubernetesBuilder.build` method
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 */
export type KubernetesBuilderReturn = Promise<{
  router: express.Router;
  clusterSupplier: KubernetesClustersSupplier;
  customResources: CustomResource[];
  fetcher: KubernetesFetcher;
  proxy: KubernetesProxy;
  objectsProvider: KubernetesObjectsProvider;
  serviceLocator: KubernetesServiceLocator;
  authStrategyMap: { [key: string]: AuthenticationStrategy };
}>;

/**
 * @deprecated Please migrate to the new backend system as this will be removed in the future.
 * @public
 * */
export class KubernetesBuilder {
  private clusterSupplier?: KubernetesClustersSupplier;
  private defaultClusterRefreshInterval: Duration = Duration.fromObject({
    minutes: 60,
  });
  private objectsProvider?: KubernetesObjectsProvider;
  private fetcher?: KubernetesFetcher;
  private serviceLocator?: KubernetesServiceLocator;
  private proxy?: KubernetesProxy;
  private authStrategyMap?: { [key: string]: AuthenticationStrategy };

  static createBuilder(env: KubernetesEnvironment) {
    return new KubernetesBuilder(env);
  }

  constructor(protected readonly env: KubernetesEnvironment) {}

  public async build(): KubernetesBuilderReturn {
    const logger = this.env.logger;
    const config = this.env.config;
    const permissions = this.env.permissions;

    logger.info('Initializing Kubernetes backend');

    if (!config.has('kubernetes')) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error('Kubernetes configuration is missing');
      }
      logger.warn(
        'Failed to initialize kubernetes backend: kubernetes config is missing',
      );
      return {
        router: Router(),
      } as unknown as KubernetesBuilderReturn;
    }

    const { auth, httpAuth } = createLegacyAuthAdapters({
      auth: this.env.auth,
      httpAuth: this.env.httpAuth,
      discovery: this.env.discovery,
    });

    const customResources = this.buildCustomResources();

    const fetcher = this.getFetcher();

    const clusterSupplier = this.getClusterSupplier();

    const authStrategyMap = this.getAuthStrategyMap();

    const proxy = this.getProxy(
      logger,
      clusterSupplier,
      this.env.discovery,
      httpAuth,
    );

    const serviceLocator = this.getServiceLocator();

    const objectsProvider = this.getObjectsProvider({
      logger,
      fetcher,
      config,
      serviceLocator,
      customResources,
      objectTypesToFetch: this.getObjectTypesToFetch(),
    });

    const router = this.buildRouter(
      objectsProvider,
      clusterSupplier,
      this.env.catalogApi,
      proxy,
      permissions,
      auth,
      httpAuth,
    );

    return {
      clusterSupplier,
      customResources,
      fetcher,
      proxy,
      objectsProvider,
      router,
      serviceLocator,
      authStrategyMap,
    };
  }

  public setClusterSupplier(clusterSupplier?: KubernetesClustersSupplier) {
    this.clusterSupplier = clusterSupplier;
    return this;
  }

  public setDefaultClusterRefreshInterval(refreshInterval: Duration) {
    this.defaultClusterRefreshInterval = refreshInterval;
    return this;
  }

  public setObjectsProvider(objectsProvider?: KubernetesObjectsProvider) {
    this.objectsProvider = objectsProvider;
    return this;
  }

  public setFetcher(fetcher?: KubernetesFetcher) {
    this.fetcher = fetcher;
    return this;
  }

  public setServiceLocator(serviceLocator?: KubernetesServiceLocator) {
    this.serviceLocator = serviceLocator;
    return this;
  }

  public setProxy(proxy?: KubernetesProxy) {
    this.proxy = proxy;
    return this;
  }

  public setAuthStrategyMap(authStrategyMap: {
    [key: string]: AuthenticationStrategy;
  }) {
    this.authStrategyMap = authStrategyMap;
  }

  public addAuthStrategy(key: string, strategy: AuthenticationStrategy) {
    if (key.includes('-')) {
      throw new Error('Strategy name can not include dashes');
    }
    this.getAuthStrategyMap()[key] = strategy;
    return this;
  }

  protected buildCustomResources() {
    const customResources: CustomResource[] = (
      this.env.config.getOptionalConfigArray('kubernetes.customResources') ?? []
    ).map(
      c =>
        ({
          group: c.getString('group'),
          apiVersion: c.getString('apiVersion'),
          plural: c.getString('plural'),
          objectType: 'customresources',
        } as CustomResource),
    );

    this.env.logger.info(
      `action=LoadingCustomResources numOfCustomResources=${customResources.length}`,
    );
    return customResources;
  }

  protected buildClusterSupplier(
    refreshInterval: Duration,
  ): KubernetesClustersSupplier {
    const config = this.env.config;
    const { auth } = createLegacyAuthAdapters(this.env);
    this.clusterSupplier = getCombinedClusterSupplier(
      config,
      this.env.catalogApi,
      new DispatchStrategy({ authStrategyMap: this.getAuthStrategyMap() }),
      this.env.logger,
      refreshInterval,
      auth,
    );

    return this.clusterSupplier;
  }

  protected buildObjectsProvider(
    options: KubernetesObjectsProviderOptions,
  ): KubernetesObjectsProvider {
    const authStrategyMap = this.getAuthStrategyMap();
    this.objectsProvider = new KubernetesFanOutHandler({
      ...options,
      authStrategy: new DispatchStrategy({
        authStrategyMap,
      }),
    });

    return this.objectsProvider;
  }

  protected buildFetcher(): KubernetesFetcher {
    this.fetcher = new KubernetesClientBasedFetcher({
      logger: this.env.logger,
    });

    return this.fetcher;
  }

  protected buildServiceLocator(
    method: ServiceLocatorMethod,
    clusterSupplier: KubernetesClustersSupplier,
  ): KubernetesServiceLocator {
    switch (method) {
      case 'multiTenant':
        this.serviceLocator =
          this.buildMultiTenantServiceLocator(clusterSupplier);
        break;
      case 'singleTenant':
        this.serviceLocator =
          this.buildSingleTenantServiceLocator(clusterSupplier);
        break;
      case 'catalogRelation':
        this.serviceLocator =
          this.buildCatalogRelationServiceLocator(clusterSupplier);
        break;
      case 'http':
        this.serviceLocator = this.buildHttpServiceLocator(clusterSupplier);
        break;
      default:
        throw new Error(
          `Unsupported kubernetes.serviceLocatorMethod "${method}"`,
        );
    }

    return this.serviceLocator;
  }

  protected buildMultiTenantServiceLocator(
    clusterSupplier: KubernetesClustersSupplier,
  ): KubernetesServiceLocator {
    return new MultiTenantServiceLocator(clusterSupplier);
  }

  protected buildSingleTenantServiceLocator(
    clusterSupplier: KubernetesClustersSupplier,
  ): KubernetesServiceLocator {
    return new SingleTenantServiceLocator(clusterSupplier);
  }

  protected buildCatalogRelationServiceLocator(
    clusterSupplier: KubernetesClustersSupplier,
  ): KubernetesServiceLocator {
    return new CatalogRelationServiceLocator(clusterSupplier);
  }

  protected buildHttpServiceLocator(
    _clusterSupplier: KubernetesClustersSupplier,
  ): KubernetesServiceLocator {
    throw new Error('not implemented');
  }

  protected buildProxy(
    logger: LoggerService,
    clusterSupplier: KubernetesClustersSupplier,
    discovery: DiscoveryService,
    httpAuth: HttpAuthService,
  ): KubernetesProxy {
    const authStrategyMap = this.getAuthStrategyMap();
    const authStrategy = new DispatchStrategy({
      authStrategyMap,
    });
    this.proxy = new KubernetesProxy({
      logger,
      clusterSupplier,
      authStrategy,
      discovery,
      httpAuth,
    });
    return this.proxy;
  }

  protected buildRouter(
    objectsProvider: KubernetesObjectsProvider,
    clusterSupplier: KubernetesClustersSupplier,
    catalogApi: CatalogApi,
    proxy: KubernetesProxy,
    permissionApi: PermissionEvaluator,
    authService: AuthService,
    httpAuth: HttpAuthService,
  ): express.Router {
    const logger = this.env.logger;
    const router = Router();
    router.use('/proxy', proxy.createRequestHandler({ permissionApi }));
    router.use(express.json());
    router.use(
      createPermissionIntegrationRouter({
        permissions: kubernetesPermissions,
      }),
    );
    // @deprecated
    router.post('/services/:serviceId', async (req, res) => {
      await requirePermission(
        permissionApi,
        kubernetesResourcesReadPermission,
        httpAuth,
        req,
      );
      const serviceId = req.params.serviceId;
      const requestBody: ObjectsByEntityRequest = req.body;
      try {
        const response = await objectsProvider.getKubernetesObjectsByEntity(
          {
            entity: requestBody.entity,
            auth: requestBody.auth || {},
          },
          { credentials: await httpAuth.credentials(req) },
        );
        res.json(response);
      } catch (e) {
        logger.error(
          `action=retrieveObjectsByServiceId service=${serviceId}, error=${e}`,
        );
        res.status(500).json({ error: e.message });
      }
    });

    router.get('/clusters', async (req, res) => {
      await requirePermission(
        permissionApi,
        kubernetesClustersReadPermission,
        httpAuth,
        req,
      );
      const credentials = await httpAuth.credentials(req);
      const clusterDetails = await this.fetchClusterDetails(clusterSupplier, {
        credentials,
      });
      res.json({
        items: clusterDetails.map(cd => {
          const oidcTokenProvider =
            cd.authMetadata[ANNOTATION_KUBERNETES_OIDC_TOKEN_PROVIDER];
          const authProvider =
            cd.authMetadata[ANNOTATION_KUBERNETES_AUTH_PROVIDER];
          const strategy = this.getAuthStrategyMap()[authProvider];
          let auth: AuthMetadata = {};
          if (strategy) {
            auth = strategy.presentAuthMetadata(cd.authMetadata);
          }

          return {
            name: cd.name,
            title: cd.title,
            dashboardUrl: cd.dashboardUrl,
            authProvider,
            ...(oidcTokenProvider && { oidcTokenProvider }),
            ...(auth && Object.keys(auth).length !== 0 && { auth }),
          };
        }),
      });
    });

    addResourceRoutesToRouter(
      router,
      catalogApi,
      objectsProvider,
      authService,
      httpAuth,
      permissionApi,
    );

    return router;
  }

  protected buildAuthStrategyMap() {
    this.authStrategyMap = {
      aks: new AksStrategy(),
      aws: new AwsIamStrategy({ config: this.env.config }),
      azure: new AzureIdentityStrategy(this.env.logger),
      google: new GoogleStrategy(),
      googleServiceAccount: new GoogleServiceAccountStrategy(),
      localKubectlProxy: new AnonymousStrategy(),
      oidc: new OidcStrategy(),
      serviceAccount: new ServiceAccountStrategy(),
    };
    return this.authStrategyMap;
  }

  protected async fetchClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
    options: { credentials: BackstageCredentials },
  ) {
    const clusterDetails = await clusterSupplier.getClusters(options);

    this.env.logger.info(
      `action=loadClusterDetails numOfClustersLoaded=${clusterDetails.length}`,
    );

    return clusterDetails;
  }

  protected getServiceLocatorMethod() {
    return this.env.config.getString(
      'kubernetes.serviceLocatorMethod.type',
    ) as ServiceLocatorMethod;
  }

  protected getFetcher(): KubernetesFetcher {
    return this.fetcher ?? this.buildFetcher();
  }

  protected getClusterSupplier() {
    return (
      this.clusterSupplier ??
      this.buildClusterSupplier(this.defaultClusterRefreshInterval)
    );
  }

  protected getServiceLocator(): KubernetesServiceLocator {
    return (
      this.serviceLocator ??
      this.buildServiceLocator(
        this.getServiceLocatorMethod(),
        this.getClusterSupplier(),
      )
    );
  }

  protected getObjectsProvider(options: KubernetesObjectsProviderOptions) {
    return this.objectsProvider ?? this.buildObjectsProvider(options);
  }

  protected getObjectTypesToFetch() {
    const objectTypesToFetchStrings = this.env.config.getOptionalStringArray(
      'kubernetes.objectTypes',
    ) as KubernetesObjectTypes[];

    const apiVersionOverrides = this.env.config.getOptionalConfig(
      'kubernetes.apiVersionOverrides',
    );

    let objectTypesToFetch;

    if (objectTypesToFetchStrings) {
      objectTypesToFetch = ALL_OBJECTS.filter(obj =>
        objectTypesToFetchStrings.includes(obj.objectType),
      );
    }

    if (apiVersionOverrides) {
      objectTypesToFetch = objectTypesToFetch ?? DEFAULT_OBJECTS;

      for (const obj of objectTypesToFetch) {
        if (apiVersionOverrides.has(obj.objectType)) {
          obj.apiVersion = apiVersionOverrides.getString(obj.objectType);
        }
      }
    }

    return objectTypesToFetch;
  }

  protected getProxy(
    logger: LoggerService,
    clusterSupplier: KubernetesClustersSupplier,
    discovery: DiscoveryService,
    httpAuth: HttpAuthService,
  ) {
    return (
      this.proxy ??
      this.buildProxy(logger, clusterSupplier, discovery, httpAuth)
    );
  }

  protected getAuthStrategyMap() {
    return this.authStrategyMap ?? this.buildAuthStrategyMap();
  }
}
