/*
 * Copyright 2023 The Backstage Authors
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
  CATALOG_FILTER_EXISTS,
  CatalogApi,
  CatalogClient,
  EntityFilterQuery,
} from '@backstage/catalog-client';
import {
  Entity,
  parseEntityRef,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import { Permission } from '@backstage/plugin-permission-common';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { TechDocsDocument } from '@backstage/plugin-techdocs-node';
import pLimit from 'p-limit';
import { Readable } from 'stream';
import { TechDocsCollatorEntityTransformer } from './TechDocsCollatorEntityTransformer';
import {
  MkSearchIndexDoc,
  TechDocsCollatorDocumentTransformer,
} from './TechDocsCollatorDocumentTransformer';
import { defaultTechDocsCollatorEntityTransformer } from './defaultTechDocsCollatorEntityTransformer';
import { defaultTechDocsCollatorDocumentTransformer } from './defaultTechDocsCollatorDocumentTransformer';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
} from '@backstage/backend-plugin-api';

/**
 * Options to configure the TechDocs collator factory
 *
 * @internal
 */
export type TechDocsCollatorFactoryOptions = {
  discovery: DiscoveryService;
  logger: LoggerService;
  auth: AuthService;
  locationTemplate?: string;
  catalogClient?: CatalogApi;
  parallelismLimit?: number;
  legacyPathCasing?: boolean;
  entityTransformer?: TechDocsCollatorEntityTransformer;
  documentTransformer?: TechDocsCollatorDocumentTransformer;
  entityFilterFunction?: (entity: Entity[]) => Entity[];
  customCatalogApiFilters?: EntityFilterQuery;
};

type EntityInfo = {
  name: string;
  namespace: string;
  kind: string;
};

/**
 * A search collator factory responsible for gathering and transforming
 * TechDocs documents.
 *
 * @internal
 */
export class DefaultTechDocsCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'techdocs';
  public readonly visibilityPermission: Permission =
    catalogEntityReadPermission;

  private discovery: DiscoveryService;
  private locationTemplate: string;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly catalogClient: CatalogApi;
  private readonly parallelismLimit: number;
  private readonly legacyPathCasing: boolean;
  private entityTransformer: TechDocsCollatorEntityTransformer;
  private documentTransformer: TechDocsCollatorDocumentTransformer;
  private entityFilterFunction: Function | undefined;
  private customCatalogApiFilters: EntityFilterQuery | undefined;

  private constructor(options: TechDocsCollatorFactoryOptions) {
    this.discovery = options.discovery;
    this.locationTemplate =
      options.locationTemplate || '/docs/:namespace/:kind/:name/:path';
    this.logger = options.logger.child({ documentType: this.type });
    this.catalogClient =
      options.catalogClient ||
      new CatalogClient({ discoveryApi: options.discovery });
    this.parallelismLimit = options.parallelismLimit ?? 10;
    this.legacyPathCasing = options.legacyPathCasing ?? false;
    this.entityTransformer = options.entityTransformer ?? (() => ({}));
    this.documentTransformer = options.documentTransformer ?? (() => ({}));
    this.entityFilterFunction = options.entityFilterFunction;
    this.customCatalogApiFilters = options.customCatalogApiFilters;
    this.auth = options.auth;
  }

  static fromConfig(config: Config, options: TechDocsCollatorFactoryOptions) {
    const legacyPathCasing =
      config.getOptionalBoolean(
        'techdocs.legacyUseCaseSensitiveTripletPaths',
      ) || false;
    const locationTemplate = config.getOptionalString(
      'search.collators.techdocs.locationTemplate',
    );
    const parallelismLimit = config.getOptionalNumber(
      'search.collators.techdocs.parallelismLimit',
    );
    return new DefaultTechDocsCollatorFactory({
      ...options,
      locationTemplate,
      parallelismLimit,
      legacyPathCasing,
    });
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<TechDocsDocument, void, undefined> {
    const limit = pLimit(this.parallelismLimit);
    const techDocsBaseUrl = await this.discovery.getBaseUrl('techdocs');

    let entitiesRetrieved = 0;
    let moreEntitiesToGet = true;

    // Offset/limit pagination is used on the Catalog Client in order to
    // limit (and allow some control over) memory used by the search backend
    // at index-time. The batchSize is calculated as a factor of the given
    // parallelism limit to simplify configuration.
    const batchSize = this.parallelismLimit * 50;
    while (moreEntitiesToGet) {
      const { token: catalogToken } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });

      const entities = (
        await this.catalogClient.getEntities(
          {
            filter: {
              'metadata.annotations.backstage.io/techdocs-ref':
                CATALOG_FILTER_EXISTS,
              ...this.customCatalogApiFilters,
            },
            limit: batchSize,
            offset: entitiesRetrieved,
          },
          { token: catalogToken },
        )
      ).items;

      // Control looping through entity batches.
      moreEntitiesToGet = entities.length === batchSize;
      entitiesRetrieved += entities.length;

      const filteredEntities = this.entityFilterFunction
        ? this.entityFilterFunction(entities)
        : this.defaultFilteringFunction(entities);

      const docPromises = filteredEntities.map((entity: Entity) =>
        limit(async (): Promise<TechDocsDocument[]> => {
          const entityInfo =
            DefaultTechDocsCollatorFactory.handleEntityInfoCasing(
              this.legacyPathCasing,
              {
                kind: entity.kind,
                namespace: entity.metadata.namespace || 'default',
                name: entity.metadata.name,
              },
            );

          try {
            const { token: techdocsToken } =
              await this.auth.getPluginRequestToken({
                onBehalfOf: await this.auth.getOwnServiceCredentials(),
                targetPluginId: 'techdocs',
              });

            const searchIndex = await fetch(
              DefaultTechDocsCollatorFactory.constructDocsIndexUrl(
                techDocsBaseUrl,
                entityInfo,
              ),
              {
                headers: {
                  Authorization: `Bearer ${techdocsToken}`,
                },
              },
            ).then(res => res.json());

            return searchIndex.docs.map((doc: MkSearchIndexDoc) => ({
              ...defaultTechDocsCollatorEntityTransformer(entity),
              ...defaultTechDocsCollatorDocumentTransformer(doc),
              ...this.entityTransformer(entity),
              ...this.documentTransformer(doc),
              location: this.applyArgsToFormat(
                this.locationTemplate || '/docs/:namespace/:kind/:name/:path',
                {
                  ...entityInfo,
                  path: doc.location,
                },
              ),
              ...entityInfo,
              entityTitle: entity.metadata.title,
              componentType: entity.spec?.type?.toString() || 'other',
              lifecycle: (entity.spec?.lifecycle as string) || '',
              owner: getSimpleEntityOwnerString(entity),
              authorization: {
                resourceRef: stringifyEntityRef(entity),
              },
            }));
          } catch (e) {
            this.logger.debug(
              `Failed to retrieve tech docs search index for entity ${entityInfo.namespace}/${entityInfo.kind}/${entityInfo.name}`,
              e,
            );
            return [];
          }
        }),
      );
      yield* (await Promise.all(docPromises)).flat();
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
    return formatted;
  }

  private defaultFilteringFunction(entities: Entity[]): Entity[] {
    return entities.filter(
      entity => entity.metadata?.annotations?.['backstage.io/techdocs-ref'],
    );
  }

  private static constructDocsIndexUrl(
    techDocsBaseUrl: string,
    entityInfo: { kind: string; namespace: string; name: string },
  ) {
    return `${techDocsBaseUrl}/static/docs/${entityInfo.namespace}/${entityInfo.kind}/${entityInfo.name}/search/search_index.json`;
  }

  private static handleEntityInfoCasing(
    legacyPaths: boolean,
    entityInfo: EntityInfo,
  ): EntityInfo {
    return legacyPaths
      ? entityInfo
      : Object.entries(entityInfo).reduce((acc, [key, value]) => {
          return { ...acc, [key]: value.toLocaleLowerCase('en-US') };
        }, {} as EntityInfo);
  }
}

function getSimpleEntityOwnerString(entity: Entity): string {
  if (entity.relations) {
    const owner = entity.relations.find(r => r.type === RELATION_OWNED_BY);
    if (owner) {
      const { name } = parseEntityRef(owner.targetRef);
      return name;
    }
  }
  return '';
}
