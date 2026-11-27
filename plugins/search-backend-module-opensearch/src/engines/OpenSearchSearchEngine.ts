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

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { Config } from '@backstage/config';
import {
  DefaultAwsCredentialsManager,
  type AwsCredentialProvider,
} from '@backstage/integration-aws-node';
import { MissingIndexError } from '@backstage/plugin-search-backend-node';
import type { SearchEngine } from '@backstage/plugin-search-backend-node';
import type {
  IndexableDocument,
  IndexableResult,
  IndexableResultSet,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { isEmpty, isNumber, isNaN as nan } from 'lodash';
import { randomUUID } from 'node:crypto';
import type { OpenSearchAuthProvider } from '../auth';
import {
  awsOpenSearchProvider,
  defaultOpenSearchProvider,
} from '../builtinProviders';
import type {
  OpenSearchProvider,
  OpenSearchProviderContext,
} from '../providers';
import type { OpenSearchClientOptions } from './OpenSearchClientOptions';
import { OpenSearchClientWrapper } from './OpenSearchClientWrapper';
import { OpenSearchSearchEngineIndexer } from './OpenSearchSearchEngineIndexer';
import type { OpenSearchIndexTemplate } from './types';

export type { OpenSearchClientOptions };

/**
 * A query translated into the OpenSearch query DSL.
 *
 * @public
 */
export type OpenSearchConcreteQuery = {
  documentTypes?: string[];
  openSearchQuery: object;
  pageSize: number;
};

/**
 * Options for the OpenSearch query translator.
 *
 * @public
 */
export type OpenSearchQueryTranslatorOptions = {
  highlightOptions?: OpenSearchHighlightConfig;
  queryOptions?: OpenSearchQueryConfig;
};

/**
 * Translates a Backstage search query into an OpenSearch query.
 *
 * @public
 */
export type OpenSearchQueryTranslator = (
  query: SearchQuery,
  options?: OpenSearchQueryTranslatorOptions,
) => OpenSearchConcreteQuery;

/**
 * Options for instantiating an OpenSearch search engine.
 *
 * @public
 */
export type OpenSearchOptions = {
  logger: LoggerService;
  config: Config;
  aliasPostfix?: string;
  indexPrefix?: string;
  translator?: OpenSearchQueryTranslator;
  authProvider?: OpenSearchAuthProvider;
  /** All registered providers, keyed by id. */
  providers?: Record<string, OpenSearchProvider>;
};

/**
 * User-configurable highlighting options.
 *
 * @public
 */
export type OpenSearchHighlightOptions = {
  fragmentDelimiter?: string;
  fragmentSize?: number;
  numFragments?: number;
};

/**
 * Fuzziness and prefix settings for queries.
 *
 * @public
 */
export type OpenSearchQueryConfig = {
  fuzziness?: string | number;
  prefixLength?: number;
};

/**
 * Internal resolved highlight configuration including the delimiter tags.
 *
 * @public
 */
export type OpenSearchHighlightConfig = {
  fragmentDelimiter: string;
  fragmentSize: number;
  numFragments: number;
  preTag: string;
  postTag: string;
};

/**
 * Constructor options for {@link OpenSearchSearchEngine}.
 *
 * @public
 */
export type OpenSearchSearchEngineOptions = {
  clientOptions: OpenSearchClientOptions;
  aliasPostfix?: string;
  indexPrefix?: string;
  logger: LoggerService;
  batchSize?: number;
  batchKeyField?: string;
  highlightOptions?: OpenSearchHighlightOptions;
  queryOptions?: OpenSearchQueryConfig;
  skipRefresh?: boolean;
};

type OpenSearchResult = {
  _index: string;
  _source: IndexableDocument;
  highlight?: Record<string, string[]>;
};

const DEFAULT_INDEXER_BATCH_SIZE = 1000;
const DEFAULT_PROVIDER_ID = 'default';

function isBlank(str: string) {
  return (isEmpty(str) && !isNumber(str)) || nan(str);
}

/**
 * Search engine backed by OpenSearch.
 *
 * @public
 */
export class OpenSearchSearchEngine implements SearchEngine {
  private readonly clientWrapper: OpenSearchClientWrapper;
  private readonly highlightOptions: OpenSearchHighlightConfig;
  private readonly queryOptions?: OpenSearchQueryConfig;

  private readonly aliasPostfix: string;
  private readonly indexPrefix: string;
  private readonly logger: LoggerService;
  private readonly batchSize: number;
  private readonly batchKeyField?: string;
  private readonly skipRefresh: boolean;

  constructor(options: OpenSearchSearchEngineOptions) {
    const {
      clientOptions,
      aliasPostfix = 'search',
      indexPrefix = '',
      logger,
      batchSize = DEFAULT_INDEXER_BATCH_SIZE,
      batchKeyField,
      highlightOptions,
      queryOptions,
      skipRefresh = false,
    } = options;

    this.aliasPostfix = aliasPostfix;
    this.indexPrefix = indexPrefix;
    this.logger = logger;
    this.batchSize = batchSize;
    this.batchKeyField = batchKeyField;
    this.skipRefresh = skipRefresh;
    this.clientWrapper =
      OpenSearchClientWrapper.fromClientOptions(clientOptions);
    const uuidTag = randomUUID();
    this.highlightOptions = {
      preTag: `<${uuidTag}>`,
      postTag: `</${uuidTag}>`,
      fragmentSize: 1000,
      numFragments: 1,
      fragmentDelimiter: ' ... ',
      ...highlightOptions,
    };
    this.queryOptions = queryOptions;
  }

  /**
   * Creates an engine from the `search.opensearch` configuration section.
   */
  static async fromConfig(options: OpenSearchOptions) {
    const {
      logger,
      config,
      aliasPostfix = 'search',
      translator,
      authProvider,
      providers = {},
    } = options;

    const osConfig = config.getConfig('search.opensearch');
    const requestedProviderId =
      osConfig.getOptionalString('provider') ?? DEFAULT_PROVIDER_ID;
    const providerId =
      requestedProviderId === 'opensearch'
        ? DEFAULT_PROVIDER_ID
        : requestedProviderId;

    const selectedProvider =
      providers[providerId] ?? getBuiltInProvider(providerId);
    if (!selectedProvider) {
      const available = [
        ...new Set([
          ...Object.keys(providers),
          defaultOpenSearchProvider.id,
          awsOpenSearchProvider.id,
        ]),
      ].join(', ');
      throw new Error(
        `Unsupported OpenSearch provider '${requestedProviderId}'. Available providers: ${available}`,
      );
    }

    const credentialProvider = await getCredentialProvider(config);
    const context: OpenSearchProviderContext = {
      config: osConfig,
      logger,
      credentialProvider,
      authProvider,
    };
    const clientOptions = await selectedProvider.createClientOptions(context);

    logger.info(
      `Initializing OpenSearch search engine with provider '${requestedProviderId}'.`,
    );

    const engine = new OpenSearchSearchEngine({
      clientOptions,
      aliasPostfix,
      indexPrefix:
        options.indexPrefix ?? osConfig.getOptionalString('indexPrefix') ?? '',
      logger,
      batchSize:
        osConfig.getOptionalNumber('batchSize') ?? DEFAULT_INDEXER_BATCH_SIZE,
      batchKeyField: osConfig.getOptionalString('batchKeyField'),
      highlightOptions:
        osConfig.getOptional<OpenSearchHighlightOptions>('highlightOptions'),
      queryOptions: osConfig.getOptional<OpenSearchQueryConfig>('queryOptions'),
      skipRefresh: osConfig.getOptionalString('service') === 'aoss',
    });

    for (const indexTemplate of readIndexTemplateConfig(osConfig)) {
      await engine.setIndexTemplate(indexTemplate);
    }

    if (translator) {
      engine.setTranslator(translator);
    }

    return engine;
  }

  /** @public */
  setTranslator(translator: OpenSearchQueryTranslator) {
    this.translator = translator;
  }

  /** @public */
  async setIndexTemplate(template: OpenSearchIndexTemplate) {
    try {
      await this.clientWrapper.putIndexTemplate(template);
      this.logger.info('Custom OpenSearch index template set');
    } catch (error) {
      this.logger.error(`Unable to set custom index template: ${error}`);
    }
  }

  /** @public */
  async getIndexer(type: string) {
    const alias = this.constructSearchAlias(type);
    const indexerLogger = this.logger.child({ documentType: type });

    const indexer = new OpenSearchSearchEngineIndexer({
      type,
      indexPrefix: this.indexPrefix,
      indexSeparator: this.indexSeparator,
      alias,
      clientWrapper: this.clientWrapper,
      logger: indexerLogger,
      batchSize: this.batchSize,
      batchKeyField: this.batchKeyField,
      skipRefresh: this.skipRefresh,
    });

    // Attempt cleanup upon failure.
    indexer.on('error', async e => {
      indexerLogger.error(`Failed to index documents for type ${type}`, e);
      let cleanupError: Error | undefined;

      // A failure may occur before the indexer finished initializing, so retry
      // removal of the dangling index a few times.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          await this.clientWrapper.deleteIndex({ index: indexer.indexName });
          cleanupError = undefined;
          break;
        } catch (err) {
          cleanupError = err as Error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      if (cleanupError) {
        indexerLogger.error(
          `Unable to clean up OpenSearch index ${indexer.indexName}: ${cleanupError}`,
        );
      } else {
        indexerLogger.info(
          `Removed partial, failed index ${indexer.indexName}`,
        );
      }
    });

    return indexer;
  }

  /** @public */
  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { openSearchQuery, documentTypes, pageSize } = this.translator(
      query,
      {
        highlightOptions: this.highlightOptions,
        queryOptions: this.queryOptions,
      },
    );
    if (documentTypes && documentTypes.length === 0) {
      return {
        results: [],
        nextPageCursor: undefined,
        previousPageCursor: undefined,
        numberOfResults: undefined,
      };
    }

    const queryIndices = documentTypes
      ? documentTypes.map(type => this.constructSearchAlias(type))
      : this.constructSearchAlias('*');

    try {
      const result = await this.clientWrapper.search({
        index: queryIndices,
        body: openSearchQuery,
      });
      const { page } = decodePageCursor(query.pageCursor);
      const total = result.body.hits.total.value;
      const hasNextPage = total > (page + 1) * pageSize;
      const hasPreviousPage = page > 0;

      return {
        results: result.body.hits.hits.map(
          (document: OpenSearchResult, index: number) => {
            const resultItem: IndexableResult = {
              type: this.getTypeFromIndex(document._index),
              document: document._source,
              rank: pageSize * page + index + 1,
            };

            if (document.highlight) {
              resultItem.highlight = {
                preTag: this.highlightOptions.preTag as string,
                postTag: this.highlightOptions.postTag as string,
                fields: Object.fromEntries(
                  Object.entries(document.highlight).map(
                    ([field, fragments]) => [
                      field,
                      fragments.join(this.highlightOptions.fragmentDelimiter),
                    ],
                  ),
                ),
              };
            }

            return resultItem;
          },
        ),
        nextPageCursor: hasNextPage
          ? encodePageCursor({ page: page + 1 })
          : undefined,
        previousPageCursor: hasPreviousPage
          ? encodePageCursor({ page: page - 1 })
          : undefined,
        numberOfResults: total,
      };
    } catch (error) {
      const errorBody = (error as any)?.meta?.body?.error;
      if (
        errorBody?.type === 'index_not_found_exception' ||
        errorBody?.caused_by?.type === 'index_not_found_exception'
      ) {
        throw new MissingIndexError(
          `Missing index for ${queryIndices}. This means there are no documents to search through.`,
          error,
        );
      }
      this.logger.error(
        `Failed to query documents for indices ${queryIndices}`,
        error,
      );
      throw new Error(
        `Failed to query documents for indices ${queryIndices}: ${
          (error as Error)?.message
        }`,
        { cause: error },
      );
    }
  }

  protected translator(
    query: SearchQuery,
    options?: OpenSearchQueryTranslatorOptions,
  ): OpenSearchConcreteQuery {
    const { term, filters = {}, types, pageCursor } = query;

    const filter = Object.entries(filters)
      .filter(([, value]) => Boolean(value))
      .map(([key, value]) => {
        if (
          typeof value === 'string' ||
          typeof value === 'number' ||
          typeof value === 'boolean'
        ) {
          const field = typeof value === 'string' ? `${key}.keyword` : key;
          return { match: { [field]: String(value) } };
        }
        if (Array.isArray(value)) {
          return {
            bool: {
              should: value.map(item => ({
                match: { [key]: String(item) },
              })),
            },
          };
        }
        this.logger.error('Failed to query, unrecognized filter type', {
          key,
          value,
        });
        throw new Error(
          'Failed to add filters to query. Unrecognized filter type',
        );
      });

    const queries: object[] = [];
    const phraseTerms = term.match(/"[^"]*"/g);

    if (isBlank(term)) {
      queries.push({ match_all: {} });
    } else if (phraseTerms && phraseTerms.length > 0) {
      let restTerm = term;
      for (const phraseTerm of phraseTerms) {
        restTerm = restTerm.replace(phraseTerm, '');
        queries.push({
          multi_match: {
            fields: ['*'],
            query: phraseTerm.replace(/"/g, ''),
            type: 'phrase',
          },
        });
      }
      if (restTerm.trim().length > 0) {
        queries.push(
          multiMatch(
            restTerm.trim(),
            options?.queryOptions?.fuzziness,
            options?.queryOptions?.prefixLength,
          ),
        );
      }
    } else {
      queries.push(
        multiMatch(
          term,
          options?.queryOptions?.fuzziness,
          options?.queryOptions?.prefixLength,
        ),
      );
    }

    const pageSize = query.pageLimit || 25;
    const { page } = decodePageCursor(pageCursor);

    const highlight = options?.highlightOptions
      ? {
          highlight: {
            fields: {
              '*': {
                number_of_fragments: options.highlightOptions.numFragments,
                fragment_size: options.highlightOptions.fragmentSize,
                pre_tags: [options.highlightOptions.preTag],
                post_tags: [options.highlightOptions.postTag],
              },
            },
          },
        }
      : {};

    return {
      openSearchQuery: {
        query: { bool: { filter, should: queries } },
        from: page * pageSize,
        size: pageSize,
        ...highlight,
      },
      documentTypes: types,
      pageSize,
    };
  }

  private readonly indexSeparator = '-index__';

  private getTypeFromIndex(index: string) {
    return index
      .substring(this.indexPrefix.length)
      .split(this.indexSeparator)[0];
  }

  private constructSearchAlias(type: string) {
    const postfix = this.aliasPostfix ? `__${this.aliasPostfix}` : '';
    return `${this.indexPrefix}${type}${postfix}`;
  }
}

function multiMatch(
  query: string,
  fuzziness?: string | number,
  prefixLength?: number,
) {
  return {
    multi_match: {
      fields: ['*'],
      query,
      fuzziness: fuzziness ?? 'auto',
      prefix_length: prefixLength ?? 0,
    },
  };
}

function readIndexTemplateConfig(config: Config): OpenSearchIndexTemplate[] {
  return (
    config.getOptionalConfigArray('indexTemplates')?.map(templateConfig => {
      const bodyConfig = templateConfig.getConfig('body');
      return {
        name: templateConfig.getString('name'),
        body: {
          index_patterns: bodyConfig.getStringArray('index_patterns'),
          composed_of: bodyConfig.getOptionalStringArray('composed_of'),
          template: bodyConfig.getOptionalConfig('template')?.get(),
        },
      };
    }) ?? []
  );
}

async function getCredentialProvider(
  config: Config,
): Promise<AwsCredentialProvider | undefined> {
  const manager = DefaultAwsCredentialsManager.fromConfig(config);
  if (!manager) {
    return undefined;
  }
  const accountId = config.getOptionalString('search.opensearch.accountId');
  return manager.getCredentialProvider(accountId ? { accountId } : undefined);
}

function getBuiltInProvider(id: string): OpenSearchProvider | undefined {
  if (id === defaultOpenSearchProvider.id) {
    return defaultOpenSearchProvider;
  }
  if (id === awsOpenSearchProvider.id) {
    return awsOpenSearchProvider;
  }
  return undefined;
}

/**
 * Decodes a Base64-encoded page cursor.
 *
 * @public
 */
export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }
  return {
    page: Number(Buffer.from(pageCursor, 'base64').toString('utf-8')),
  };
}

/**
 * Encodes a page cursor.
 *
 * @public
 */
export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}
