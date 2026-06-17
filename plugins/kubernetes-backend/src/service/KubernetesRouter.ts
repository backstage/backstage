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

import { DispatchStrategy } from '../auth';

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
  KubernetesClustersSupplier,
  KubernetesFetcher,
  KubernetesObjectsProvider,
  KubernetesRouterFactory,
  KubernetesServiceLocator,
} from '@backstage/plugin-kubernetes-node';
import { addResourceRoutesToRouter } from '../routes/resourcesRoutes';
import { ObjectsByEntityRequest } from '../types/types';
import { KubernetesProxy } from './KubernetesProxy';
import { requirePermission } from '../auth/requirePermission';
import { CatalogService } from '@backstage/plugin-catalog-node';

export interface KubernetesEnvironment {
  logger: LoggerService;
  config: Config;
  catalog: CatalogService;
  discovery: DiscoveryService;
  permissions: PermissionEvaluator;
  auth: AuthService;
  httpAuth: HttpAuthService;
  authStrategyMap: { [key: string]: AuthenticationStrategy };
  fetcher: KubernetesFetcher;
  clusterSupplier: KubernetesClustersSupplier;
  serviceLocator: KubernetesServiceLocator;
  objectsProvider: KubernetesObjectsProvider;
  customRouter?: KubernetesRouterFactory;
}

export class KubernetesRouter {
  static create(env: KubernetesEnvironment) {
    return new KubernetesRouter(env);
  }

  protected readonly env: KubernetesEnvironment;

  constructor(env: KubernetesEnvironment) {
    this.env = env;
  }

  public async getRouter() {
    const {
      logger,
      config,
      permissions,
      authStrategyMap,
      clusterSupplier,
      objectsProvider,
      catalog,
      discovery,
      httpAuth,
      customRouter,
    } = this.env;

    logger.info('Initializing Kubernetes backend');

    if (!config.has('kubernetes')) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error('Kubernetes configuration is missing');
      }
      logger.warn(
        'Failed to initialize kubernetes backend: kubernetes config is missing',
      );
      return Router();
    }

    const proxy = this.buildProxy(
      logger,
      clusterSupplier,
      discovery,
      httpAuth,
      authStrategyMap,
    );

    return (
      customRouter?.({
        getDefault: () =>
          this.buildDefaultRouter(
            objectsProvider,
            clusterSupplier,
            catalog,
            proxy,
            permissions,
            httpAuth,
            authStrategyMap,
          ),
        objectsProvider,
        clusterSupplier,
        authStrategyMap,
      }) ??
      this.buildDefaultRouter(
        objectsProvider,
        clusterSupplier,
        catalog,
        proxy,
        permissions,
        httpAuth,
        authStrategyMap,
      )
    );
  }

  private buildProxy(
    logger: LoggerService,
    clusterSupplier: KubernetesClustersSupplier,
    discovery: DiscoveryService,
    httpAuth: HttpAuthService,
    authStrategyMap: { [key: string]: AuthenticationStrategy },
  ): KubernetesProxy {
    const authStrategy = new DispatchStrategy({
      authStrategyMap,
    });
    return new KubernetesProxy({
      logger,
      clusterSupplier,
      authStrategy,
      discovery,
      httpAuth,
    });
  }

  private buildDefaultRouter(
    objectsProvider: KubernetesObjectsProvider,
    clusterSupplier: KubernetesClustersSupplier,
    catalog: CatalogService,
    proxy: KubernetesProxy,
    permissionApi: PermissionEvaluator,
    httpAuth: HttpAuthService,
    authStrategyMap: { [key: string]: AuthenticationStrategy },
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
          const strategy = authStrategyMap[authProvider];
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
      catalog,
      objectsProvider,
      httpAuth,
      permissionApi,
    );

    return router;
  }

  private async fetchClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
    options: { credentials: BackstageCredentials },
  ) {
    const clusterDetails = await clusterSupplier.getClusters(options);

    this.env.logger.debug(
      `action=loadClusterDetails numOfClustersLoaded=${clusterDetails.length}`,
    );

    return clusterDetails;
  }
}
