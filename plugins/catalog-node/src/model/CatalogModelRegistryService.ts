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

import { CatalogModelExtension } from '@backstage/catalog-model/alpha';
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
  /**
   * Registers a catalog model extension.
   */
  registerExtension(extension: CatalogModelExtension): void;
}

export class DefaultCatalogModelRegistryService
  implements CatalogModelRegistryService
{
  private extensions: CatalogModelExtension[] = [];

  registerExtension(extension: CatalogModelExtension): void {
    this.extensions.push(extension);
  }

  getRouter(): Router {
    const router = PromiseRouter();
    router.get(
      '.backstage/catalog-model/v1/extensions',
      express.json(),
      (_req, res) => {
        res.json({ extensions: this.extensions });
      },
    );
    return router;
  }
}
