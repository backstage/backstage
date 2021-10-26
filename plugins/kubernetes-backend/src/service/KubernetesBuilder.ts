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
import express from 'express';
import Router from 'express-promise-router';
import { Logger } from 'winston';
import { getCombinedClusterDetails } from '../cluster-locator';
import { MultiTenantServiceLocator } from '../service-locator/MultiTenantServiceLocator';
import {
  ClusterDetails,
  KubernetesObjectTypes,
  ServiceLocatorMethod,
  CustomResource,
  KubernetesObjectsProvider,
  ObjectsByEntityRequest,
  KubernetesClustersSupplier,
  KubernetesFetcher,
  KubernetesServiceLocator,
  KubernetesObjectsProviderOptions,
} from '../types/types';
import { KubernetesClientProvider } from './KubernetesClientProvider';
import {
  DEFAULT_OBJECTS,
  KubernetesFanOutHandler,
} from './KubernetesFanOutHandler';
import { KubernetesClientBasedFetcher } from './KubernetesFetcher';

export interface KubernetesEnvironment {
  logger: Logger;
  config: Config;
}

export class KubernetesBuilder {
  private clusterSupplier?: KubernetesClustersSupplier;
  private objectsProvider?: KubernetesObjectsProvider;
  private fetcher?: KubernetesFetcher;
  private serviceLocator?: KubernetesServiceLocator;

  static createBuilder(env: KubernetesEnvironment) {
    return new KubernetesBuilder(env);
  }

  constructor(protected readonly env: KubernetesEnvironment) {}

  public async build() {
    const logger = this.env.logger;

    logger.info('Initializing Kubernetes backend');

    const customResources = this.buildCustomResources();

    const fetcher = this.fetcher ?? this.buildFetcher();

    const clusterSupplier = this.clusterSupplier ?? this.buildClusterSupplier();

    const clusterDetails = await this.fetchClusterDetails(clusterSupplier);

    const serviceLocator =
      this.serviceLocator ??
      this.buildServiceLocator(this.getServiceLocatorMethod(), clusterDetails);

    const objectsProvider =
      this.objectsProvider ??
      this.buildObjectsProvider({
        logger,
        fetcher,
        serviceLocator,
        customResources,
        objectTypesToFetch: this.getObjectTypesToFetch(),
      });

    const router = this.buildRouter(objectsProvider, clusterDetails);

    return {
      clusterDetails,
      clusterSupplier,
      customResources,
      fetcher,
      objectsProvider,
      router,
      serviceLocator,
    };
  }

  public setClusterSupplier(clusterSupplier?: KubernetesClustersSupplier) {
    this.clusterSupplier = clusterSupplier;
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

  protected buildClusterSupplier(): KubernetesClustersSupplier {
    const config = this.env.config;
    return {
      getClusters() {
        return getCombinedClusterDetails(config);
      },
    };
  }

  protected buildObjectsProvider(
    options: KubernetesObjectsProviderOptions,
  ): KubernetesObjectsProvider {
    return new KubernetesFanOutHandler(options);
  }

  protected buildFetcher(): KubernetesFetcher {
    return new KubernetesClientBasedFetcher({
      kubernetesClientProvider: new KubernetesClientProvider(),
      logger: this.env.logger,
    });
  }

  protected buildServiceLocator(
    method: ServiceLocatorMethod,
    clusterDetails: ClusterDetails[],
  ): KubernetesServiceLocator {
    switch (method) {
      case 'multiTenant':
        return this.buildMultiTenantServiceLocator(clusterDetails);
      case 'http':
        return this.buildHttpServiceLocator(clusterDetails);
      default:
        throw new Error(
          `Unsupported kubernetes.clusterLocatorMethod "${method}"`,
        );
    }
  }

  protected buildMultiTenantServiceLocator(
    clusterDetails: ClusterDetails[],
  ): KubernetesServiceLocator {
    return new MultiTenantServiceLocator(clusterDetails);
  }

  protected buildHttpServiceLocator(
    _clusterDetails: ClusterDetails[],
  ): KubernetesServiceLocator {
    throw new Error('not implemented');
  }

  protected buildRouter(
    objectsProvider: KubernetesObjectsProvider,
    clusterDetails: ClusterDetails[],
  ): express.Router {
    const logger = this.env.logger;
    const router = Router();
    router.use(express.json());

    router.post('/services/:serviceId', async (req, res) => {
      const serviceId = req.params.serviceId;
      const requestBody: ObjectsByEntityRequest = req.body;
      try {
        const response = await objectsProvider.getKubernetesObjectsByEntity(
          requestBody,
        );
        res.json(response);
      } catch (e) {
        logger.error(
          `action=retrieveObjectsByServiceId service=${serviceId}, error=${e}`,
        );
        res.status(500).json({ error: e.message });
      }
    });

    router.get('/clusters', async (_, res) => {
      res.json({
        items: clusterDetails.map(cd => ({
          name: cd.name,
          dashboardUrl: cd.dashboardUrl,
          authProvider: cd.authProvider,
        })),
      });
    });
    return router;
  }

  protected async fetchClusterDetails(
    clusterSupplier: KubernetesClustersSupplier,
  ) {
    const clusterDetails = await clusterSupplier.getClusters();

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

  protected getObjectTypesToFetch() {
    const objectTypesToFetchStrings = this.env.config.getOptionalStringArray(
      'kubernetes.objectTypes',
    ) as KubernetesObjectTypes[];

    let objectTypesToFetch;

    if (objectTypesToFetchStrings) {
      objectTypesToFetch = DEFAULT_OBJECTS.filter(obj =>
        objectTypesToFetchStrings.includes(obj.objectType),
      );
    }
    return objectTypesToFetch;
  }
}
