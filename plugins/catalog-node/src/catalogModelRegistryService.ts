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
  coreServices,
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';
import {
  type CatalogModelExtension,
  type CatalogModelExtensionBuilder,
  createCatalogModelExtensionBuilder,
} from '@backstage/catalog-model/alpha';
import express, { type Router } from 'express';
import PromiseRouter from 'express-promise-router';

/**
 * A registry for catalog model extensions.
 *
 * @alpha
 * @remarks
 *
 * The data registered with this service will be available for the catalog
 * backend service to consume.
 */
export interface CatalogModelRegistryService {
  registerModelExtension(
    modelName: string,
    factory: (model: CatalogModelExtensionBuilder) => void,
  ): void;
}

/**
 * The default implementation of {@link CatalogModelRegistryService}.
 *
 * @internal
 */
export class DefaultCatalogModelRegistryService
  implements CatalogModelRegistryService
{
  readonly #pluginId: string;
  readonly #extensions: CatalogModelExtension[];

  constructor(options: { pluginId: string }) {
    this.#pluginId = options.pluginId;
    this.#extensions = [];
  }

  registerModelExtension(
    modelName: string,
    factory: (model: CatalogModelExtensionBuilder) => void,
  ): void {
    const builder = createCatalogModelExtensionBuilder({
      pluginId: this.#pluginId,
      modelName,
    });
    factory(builder);
    this.#extensions.push(builder.build());
  }

  getRouter(): Router {
    const router = PromiseRouter();
    router.get(
      '/.backstage/catalog-model/v1/extensions',
      express.json(),
      (_req, res) => {
        res.json({ extensions: this.#extensions });
      },
    );
    return router;
  }
}

/**
 * The service ref for {@link CatalogModelRegistryService}.
 *
 * @alpha
 */
export const catalogModelRegistryServiceRef =
  createServiceRef<CatalogModelRegistryService>({
    id: 'catalog-modelRegistry',
    defaultFactory: async service =>
      createServiceFactory({
        service,
        deps: {
          httpRouter: coreServices.httpRouter,
          pluginMetadata: coreServices.pluginMetadata,
        },
        async factory({ httpRouter, pluginMetadata }) {
          const registry = new DefaultCatalogModelRegistryService({
            pluginId: pluginMetadata.getId(),
          });

          httpRouter.use(registry.getRouter());

          return registry;
        },
      }),
  });
