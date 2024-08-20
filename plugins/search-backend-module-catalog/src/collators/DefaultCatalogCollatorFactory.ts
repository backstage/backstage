/*
 * Copyright 2022 The Backstage Authors
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
  TokenManager,
  createLegacyAuthAdapters,
} from '@backstage/backend-common';
import {
  CatalogApi,
  CatalogClient,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';
import { CatalogCollatorEntityTransformer } from './CatalogCollatorEntityTransformer';
import { readCollatorConfigOptions } from './config';
import { defaultCatalogCollatorEntityTransformer } from './defaultCatalogCollatorEntityTransformer';
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';

/**
 * @public
 * @deprecated This type is deprecated along with the {@link DefaultCatalogCollatorFactory}.
 */
export type DefaultCatalogCollatorFactoryOptions = {
  auth?: AuthService;
  discovery: DiscoveryService;
  tokenManager?: TokenManager;
  /**
   * @deprecated Use the config key `search.collators.catalog.locationTemplate` instead.
   */
  locationTemplate?: string;
  /**
   * @deprecated Use the config key `search.collators.catalog.filter` instead.
   */
  filter?: GetEntitiesRequest['filter'];
  /**
   * @deprecated Use the config key `search.collators.catalog.batchSize` instead.
   */
  batchSize?: number;
  catalogClient?: CatalogApi;
  /**
   * Allows you to customize how entities are shaped into documents.
   */
  entityTransformer?: CatalogCollatorEntityTransformer;
};

/**
 * Collates entities from the Catalog into documents for the search backend.
 *
 * @public
 * @deprecated Migrate to the {@link https://backstage.io/docs/backend-system/building-backends/migrating | new backend system} and install this collator via module instead (see {@link https://github.com/backstage/backstage/blob/nbs10/search-deprecate-create-router/plugins/search-backend-module-catalog/README.md#installation | here} for more installation details).
 */
export class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
  public readonly type = 'software-catalog';
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: GetEntitiesRequest['filter'];
  private batchSize: number;
  private readonly catalogClient: CatalogApi;
  private entityTransformer: CatalogCollatorEntityTransformer;
  private auth: AuthService;

  static fromConfig(
    configRoot: Config,
    options: DefaultCatalogCollatorFactoryOptions,
  ) {
    const configOptions = readCollatorConfigOptions(configRoot);
    const { auth: adaptedAuth } = createLegacyAuthAdapters({
      auth: options.auth,
      discovery: options.discovery,
      tokenManager: options.tokenManager,
    });
    return new DefaultCatalogCollatorFactory({
      locationTemplate:
        options.locationTemplate ?? configOptions.locationTemplate,
      filter: options.filter ?? configOptions.filter,
      batchSize: options.batchSize ?? configOptions.batchSize,
      entityTransformer: options.entityTransformer,
      auth: adaptedAuth,
      discovery: options.discovery,
      catalogClient: options.catalogClient,
    });
  }

  private constructor(options: {
    locationTemplate: string;
    filter: GetEntitiesRequest['filter'];
    batchSize: number;
    entityTransformer?: CatalogCollatorEntityTransformer;
    auth: AuthService;
    discovery: DiscoveryService;
    catalogClient?: CatalogApi;
  }) {
    const {
      auth,
      batchSize,
      discovery,
      locationTemplate,
      filter,
      catalogClient,
      entityTransformer,
    } = options;

    this.locationTemplate = locationTemplate;
    this.filter = filter;
    this.batchSize = batchSize;
    this.catalogClient =
      catalogClient || new CatalogClient({ discoveryApi: discovery });
    this.entityTransformer =
      entityTransformer ?? defaultCatalogCollatorEntityTransformer;
    this.auth = auth;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<CatalogEntityDocument> {
    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    // Offset/limit pagination is used on the Catalog Client in order to
    // limit (and allow some control over) memory used by the search backend
    // at index-time.
    while (moreEntitiesToGet) {
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });
      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: this.filter,
            limit: this.batchSize,
            offset: entitiesRetrieved,
          },
          { token },
        )
      ).items;

      // Control looping through entity batches.
      moreEntitiesToGet = entities.length === this.batchSize;
      entitiesRetrieved += entities.length;

      for (const entity of entities) {
        yield {
          ...this.entityTransformer(entity),
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
          }),
        };
      }
    }
  }

  private applyArgsToFormat(
    format: string,
    args: Record<string, string>,
  ): string {
    let formatted = format;

    for (const [key, value] of Object.entries(args)) {
      formatted = formatted.replace(`:${key}`, value);
    }

    return formatted.toLowerCase();
  }
}
