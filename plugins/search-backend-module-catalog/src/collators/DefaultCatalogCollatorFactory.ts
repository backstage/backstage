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

import { AuthService } from '@backstage/backend-plugin-api';
import { QueryEntitiesInitialRequest } from '@backstage/catalog-client';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { CatalogEntityDocument } from '@backstage/plugin-catalog-common';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';
import { CatalogCollatorEntityTransformer } from './CatalogCollatorEntityTransformer';
import { readCollatorConfigOptions } from './config';
import { defaultCatalogCollatorEntityTransformer } from './defaultCatalogCollatorEntityTransformer';

export type DefaultCatalogCollatorFactoryOptions = {
  auth: AuthService;
  catalog: CatalogService;
  /*
   * Allows you to customize how entities are shaped into documents.
   */
  entityTransformer?: CatalogCollatorEntityTransformer;
};

/**
 * Collates entities from the Catalog into documents for the search backend.
 */
export class DefaultCatalogCollatorFactory implements DocumentCollatorFactory {
  public readonly type = 'software-catalog';
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private locationTemplate: string;
  private filter?: QueryEntitiesInitialRequest['filter'];
  private batchSize: number;
  private readonly catalog: CatalogService;
  private entityTransformer: CatalogCollatorEntityTransformer;
  private auth: AuthService;

  static fromConfig(
    configRoot: Config,
    options: DefaultCatalogCollatorFactoryOptions,
  ) {
    const configOptions = readCollatorConfigOptions(configRoot);
    return new DefaultCatalogCollatorFactory({
      locationTemplate: configOptions.locationTemplate,
      filter: configOptions.filter,
      batchSize: configOptions.batchSize,
      entityTransformer: options.entityTransformer,
      auth: options.auth,
      catalog: options.catalog,
    });
  }

  private constructor(options: {
    locationTemplate: string;
    filter: QueryEntitiesInitialRequest['filter'];
    batchSize: number;
    entityTransformer?: CatalogCollatorEntityTransformer;
    auth: AuthService;
    catalog: CatalogService;
  }) {
    const {
      auth,
      batchSize,
      locationTemplate,
      filter,
      catalog,
      entityTransformer,
    } = options;

    this.locationTemplate = locationTemplate;
    this.filter = filter;
    this.batchSize = batchSize;
    this.catalog = catalog;
    this.entityTransformer =
      entityTransformer ?? defaultCatalogCollatorEntityTransformer;
    this.auth = auth;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<CatalogEntityDocument> {
    let entitiesRetrieved = 0;
    let cursor: string | undefined = undefined;

    do {
      const response = await this.catalog.queryEntities(
        {
          filter: this.filter,
          limit: this.batchSize,
          ...(cursor ? { cursor } : {}),
        },
        { credentials: await this.auth.getOwnServiceCredentials() },
      );
      cursor = response.pageInfo.nextCursor;
      entitiesRetrieved += response.items.length;

      for (const entity of response.items) {
        yield {
          ...this.entityTransformer(entity),
          authorization: {
            resourceRef: stringifyEntityRef(entity),
          },
          location: this.applyArgsToFormat(this.locationTemplate, {
            namespace: encodeURIComponent(
              entity.metadata.namespace || 'default',
            ),
            kind: encodeURIComponent(entity.kind),
            name: encodeURIComponent(entity.metadata.name),
          }),
        };
      }
    } while (cursor);
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
