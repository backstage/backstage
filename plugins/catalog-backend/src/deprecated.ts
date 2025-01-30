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
  TokenManager,
  createLegacyAuthAdapters,
} from '@backstage/backend-common';
import { AuthService, DiscoveryService } from '@backstage/backend-plugin-api';
import {
  CatalogApi,
  CatalogClient,
  EntityFilterQuery,
  GetEntitiesRequest,
} from '@backstage/catalog-client';
import {
  Entity,
  isGroupEntity,
  isUserEntity,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { Config } from '@backstage/config';
import {
  CatalogEntityDocument,
  type AnalyzeLocationEntityField as _AnalyzeLocationEntityField,
  type AnalyzeLocationExistingEntity as _AnalyzeLocationExistingEntity,
  type AnalyzeLocationGenerateEntity as _AnalyzeLocationGenerateEntity,
  type AnalyzeLocationRequest as _AnalyzeLocationRequest,
  type AnalyzeLocationResponse as _AnalyzeLocationResponse,
  type LocationSpec as _LocationSpec,
} from '@backstage/plugin-catalog-common';
import { catalogEntityReadPermission } from '@backstage/plugin-catalog-common/alpha';
import {
  locationSpecToMetadataName as _locationSpecToMetadataName,
  locationSpecToLocationEntity as _locationSpecToLocationEntity,
  processingResult as _processingResult,
  type EntitiesSearchFilter as _EntitiesSearchFilter,
  type EntityFilter as _EntityFilter,
  type DeferredEntity as _DeferredEntity,
  type EntityRelationSpec as _EntityRelationSpec,
  type CatalogProcessor as _CatalogProcessor,
  type CatalogProcessorParser as _CatalogProcessorParser,
  type CatalogProcessorCache as _CatalogProcessorCache,
  type CatalogProcessorEmit as _CatalogProcessorEmit,
  type CatalogProcessorLocationResult as _CatalogProcessorLocationResult,
  type CatalogProcessorEntityResult as _CatalogProcessorEntityResult,
  type CatalogProcessorRelationResult as _CatalogProcessorRelationResult,
  type CatalogProcessorErrorResult as _CatalogProcessorErrorResult,
  type CatalogProcessorRefreshKeysResult as _CatalogProcessorRefreshKeysResult,
  type CatalogProcessorResult as _CatalogProcessorResult,
  type EntityProvider as _EntityProvider,
  type EntityProviderConnection as _EntityProviderConnection,
  type EntityProviderMutation as _EntityProviderMutation,
  type AnalyzeOptions as _AnalyzeOptions,
  type PlaceholderResolver as _PlaceholderResolver,
  type PlaceholderResolverParams as _PlaceholderResolverParams,
  type PlaceholderResolverRead as _PlaceholderResolverRead,
  type PlaceholderResolverResolveUrl as _PlaceholderResolverResolveUrl,
  type LocationAnalyzer as _LocationAnalyzer,
  type ScmLocationAnalyzer as _ScmLocationAnalyzer,
} from '@backstage/plugin-catalog-node';
import { Permission } from '@backstage/plugin-permission-common';
import {
  defaultCatalogCollatorEntityTransformer as _defaultCatalogCollatorEntityTransformer,
  type CatalogCollatorEntityTransformer as _CatalogCollatorEntityTransformer,
} from '@backstage/plugin-search-backend-module-catalog';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { Readable } from 'stream';

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToMetadataName = _locationSpecToMetadataName;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const locationSpecToLocationEntity = _locationSpecToLocationEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export const processingResult = _processingResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntitiesSearchFilter = _EntitiesSearchFilter;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityFilter = _EntityFilter;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type DeferredEntity = _DeferredEntity;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityRelationSpec = _EntityRelationSpec;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessor = _CatalogProcessor;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorParser = _CatalogProcessorParser;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorCache = _CatalogProcessorCache;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEmit = _CatalogProcessorEmit;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorLocationResult = _CatalogProcessorLocationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorEntityResult = _CatalogProcessorEntityResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRelationResult = _CatalogProcessorRelationResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorErrorResult = _CatalogProcessorErrorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorRefreshKeysResult =
  _CatalogProcessorRefreshKeysResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type CatalogProcessorResult = _CatalogProcessorResult;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProvider = _EntityProvider;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderConnection = _EntityProviderConnection;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type EntityProviderMutation = _EntityProviderMutation;

/**
 * Holds the entity location information.
 *
 * @remarks
 *
 *  `presence` flag: when using repo importer plugin, location is being created before the component yaml file is merged to the main branch.
 *  This flag is then set to indicate that the file can be not present.
 *  default value: 'required'.
 *
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type LocationSpec = _LocationSpec;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type AnalyzeOptions = _AnalyzeOptions;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type LocationAnalyzer = _LocationAnalyzer;
/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type ScmLocationAnalyzer = _ScmLocationAnalyzer;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolver = _PlaceholderResolver;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverParams = _PlaceholderResolverParams;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverRead = _PlaceholderResolverRead;

/**
 * @public
 * @deprecated import from `@backstage/plugin-catalog-node` instead
 */
export type PlaceholderResolverResolveUrl = _PlaceholderResolverResolveUrl;

/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationRequest = _AnalyzeLocationRequest;
/**
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationResponse = _AnalyzeLocationResponse;

/**
 * If the folder pointed to already contained catalog info yaml files, they are
 * read and emitted like this so that the frontend can inform the user that it
 * located them and can make sure to register them as well if they weren't
 * already
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationExistingEntity = _AnalyzeLocationExistingEntity;
/**
 * This is some form of representation of what the analyzer could deduce.
 * We should probably have a chat about how this can best be conveyed to
 * the frontend. It'll probably contain a (possibly incomplete) entity, plus
 * enough info for the frontend to know what form data to show to the user
 * for overriding/completing the info.
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationGenerateEntity = _AnalyzeLocationGenerateEntity;

/**
 *
 * This is where I get really vague. Something like this perhaps? Or it could be
 * something like a json-schema that contains enough info for the frontend to
 * be able to present a form and explanations
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type AnalyzeLocationEntityField = _AnalyzeLocationEntityField;

namespace search {
  const configKey = 'search.collators.catalog';

  const defaults = {
    schedule: {
      frequency: { minutes: 10 },
      timeout: { minutes: 15 },
      initialDelay: { seconds: 3 },
    },
    collatorOptions: {
      locationTemplate: '/catalog/:namespace/:kind/:name',
      filter: undefined,
      batchSize: 500,
    },
  };

  export const readCollatorConfigOptions = (
    configRoot: Config,
  ): {
    locationTemplate: string;
    filter: EntityFilterQuery | undefined;
    batchSize: number;
  } => {
    const config = configRoot.getOptionalConfig(configKey);
    if (!config) {
      return defaults.collatorOptions;
    }

    return {
      locationTemplate:
        config.getOptionalString('locationTemplate') ??
        defaults.collatorOptions.locationTemplate,
      filter:
        config.getOptional<EntityFilterQuery>('filter') ??
        defaults.collatorOptions.filter,
      batchSize:
        config.getOptionalNumber('batchSize') ??
        defaults.collatorOptions.batchSize,
    };
  };

  export const getDocumentText = (entity: Entity): string => {
    const documentTexts: string[] = [];
    if (entity.metadata.description) {
      documentTexts.push(entity.metadata.description);
    }

    if (isUserEntity(entity) || isGroupEntity(entity)) {
      if (entity.spec?.profile?.displayName) {
        documentTexts.push(entity.spec.profile.displayName);
      }
    }

    if (isUserEntity(entity)) {
      if (entity.spec?.profile?.email) {
        documentTexts.push(entity.spec.profile.email);
      }
    }

    return documentTexts.join(' : ');
  };
}

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-catalog` instead
 */
export const defaultCatalogCollatorEntityTransformer =
  _defaultCatalogCollatorEntityTransformer;

/**
 * @public
 * @deprecated This is no longer supported since the new backend system migration
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
    const configOptions = search.readCollatorConfigOptions(configRoot);
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
    let cursor: string | undefined = undefined;

    do {
      const { token } = await this.auth.getPluginRequestToken({
        onBehalfOf: await this.auth.getOwnServiceCredentials(),
        targetPluginId: 'catalog',
      });
      const response = await this.catalogClient.queryEntities(
        {
          filter: this.filter,
          limit: this.batchSize,
          ...(cursor ? { cursor } : {}),
        },
        { token },
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
            namespace: entity.metadata.namespace || 'default',
            kind: entity.kind,
            name: entity.metadata.name,
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

/**
 * @public
 * @deprecated This is no longer supported since the new backend system migration
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
  // TODO(freben): Change to required CatalogService instead when fully migrated to the new backend system.
  catalogClient?: CatalogApi;
  /**
   * Allows you to customize how entities are shaped into documents.
   */
  entityTransformer?: CatalogCollatorEntityTransformer;
};

/**
 * @public
 * @deprecated import from `@backstage/plugin-search-backend-module-catalog` instead
 */
export type CatalogCollatorEntityTransformer =
  _CatalogCollatorEntityTransformer;
