/*
 * Copyright 2021 The Backstage Authors
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
  awsGetCredentials,
  createAWSConnection,
} from '@acuris/aws-es-connection';
import { Config } from '@backstage/config';
import {
  IndexableDocument,
  IndexableResultSet,
  SearchEngine,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { Client } from '@elastic/elasticsearch';
import esb from 'elastic-builder';
import { isEmpty, isNaN as nan, isNumber } from 'lodash';
import { Logger } from 'winston';
import type { ElasticSearchClientOptions } from './ElasticSearchClientOptions';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';

export type { ElasticSearchClientOptions };

export type ConcreteElasticSearchQuery = {
  documentTypes?: string[];
  elasticSearchQuery: Object;
  pageSize: number;
};

type ElasticSearchQueryTranslator = (
  query: SearchQuery,
) => ConcreteElasticSearchQuery;

type ElasticSearchOptions = {
  logger: Logger;
  config: Config;
  aliasPostfix?: string;
  indexPrefix?: string;
};

type ElasticSearchResult = {
  _index: string;
  _type: string;
  _score: number;
  _source: IndexableDocument;
};

function isBlank(str: string) {
  return (isEmpty(str) && !isNumber(str)) || nan(str);
}

/**
 * @public
 */
export class ElasticSearchSearchEngine implements SearchEngine {
  private readonly elasticSearchClient: Client;

  constructor(
    private readonly elasticSearchClientOptions: ElasticSearchClientOptions,
    private readonly aliasPostfix: string,
    private readonly indexPrefix: string,
    private readonly logger: Logger,
  ) {
    this.elasticSearchClient = this.newClient(options => new Client(options));
  }

  static async fromConfig({
    logger,
    config,
    aliasPostfix = `search`,
    indexPrefix = ``,
  }: ElasticSearchOptions) {
    const options = await createElasticSearchClientOptions(
      config.getConfig('search.elasticsearch'),
    );
    if (options.provider === 'elastic') {
      logger.info('Initializing Elastic.co ElasticSearch search engine.');
    } else if (options.provider === 'aws') {
      logger.info('Initializing AWS ElasticSearch search engine.');
    } else {
      logger.info('Initializing ElasticSearch search engine.');
    }

    return new ElasticSearchSearchEngine(
      options,
      aliasPostfix,
      indexPrefix,
      logger,
    );
  }

  /**
   * Create a custom search client from the derived elastic search
   * configuration. This need not be the same client that the engine uses
   * internally.
   */
  newClient<T>(create: (options: ElasticSearchClientOptions) => T): T {
    return create(this.elasticSearchClientOptions);
  }

  protected translator(query: SearchQuery): ConcreteElasticSearchQuery {
    const { term, filters = {}, types, pageCursor } = query;

    const filter = Object.entries(filters)
      .filter(([_, value]) => Boolean(value))
      .map(([key, value]: [key: string, value: any]) => {
        if (['string', 'number', 'boolean'].includes(typeof value)) {
          return esb.matchQuery(key, value.toString());
        }
        if (Array.isArray(value)) {
          return esb
            .boolQuery()
            .should(value.map(it => esb.matchQuery(key, it.toString())));
        }
        this.logger.error(
          'Failed to query, unrecognized filter type',
          key,
          value,
        );
        throw new Error(
          'Failed to add filters to query. Unrecognized filter type',
        );
      });
    const esbQuery = isBlank(term)
      ? esb.matchAllQuery()
      : esb
          .multiMatchQuery(['*'], term)
          .fuzziness('auto')
          .minimumShouldMatch(1);
    const pageSize = 25;
    const { page } = decodePageCursor(pageCursor);

    return {
      elasticSearchQuery: esb
        .requestBodySearch()
        .query(esb.boolQuery().filter(filter).must([esbQuery]))
        .from(page * pageSize)
        .size(pageSize)
        .toJSON(),
      documentTypes: types,
      pageSize,
    };
  }

  setTranslator(translator: ElasticSearchQueryTranslator) {
    this.translator = translator;
  }

  async getIndexer(type: string) {
    const alias = this.constructSearchAlias(type);
    const indexer = new ElasticSearchSearchEngineIndexer({
      type,
      indexPrefix: this.indexPrefix,
      indexSeparator: this.indexSeparator,
      alias,
      elasticSearchClient: this.elasticSearchClient,
      logger: this.logger,
    });

    // Attempt cleanup upon failure.
    indexer.on('error', async e => {
      this.logger.error(`Failed to index documents for type ${type}`, e);
      try {
        const response = await this.elasticSearchClient.indices.exists({
          index: indexer.indexName,
        });
        const indexCreated = response.body;
        if (indexCreated) {
          this.logger.info(`Removing created index ${indexer.indexName}`);
          await this.elasticSearchClient.indices.delete({
            index: indexer.indexName,
          });
        }
      } catch (error) {
        this.logger.error(`Unable to clean up elastic index: ${error}`);
      }
    });

    return indexer;
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { elasticSearchQuery, documentTypes, pageSize } =
      this.translator(query);
    const queryIndices = documentTypes
      ? documentTypes.map(it => this.constructSearchAlias(it))
      : this.constructSearchAlias('*');
    try {
      const result = await this.elasticSearchClient.search({
        index: queryIndices,
        body: elasticSearchQuery,
      });
      const { page } = decodePageCursor(query.pageCursor);
      const hasNextPage = result.body.hits.total.value > page * pageSize;
      const hasPreviousPage = page > 0;
      const nextPageCursor = hasNextPage
        ? encodePageCursor({ page: page + 1 })
        : undefined;
      const previousPageCursor = hasPreviousPage
        ? encodePageCursor({ page: page - 1 })
        : undefined;

      return {
        results: result.body.hits.hits.map((d: ElasticSearchResult) => ({
          type: this.getTypeFromIndex(d._index),
          document: d._source,
        })),
        nextPageCursor,
        previousPageCursor,
      };
    } catch (e) {
      this.logger.error(
        `Failed to query documents for indices ${queryIndices}`,
        e,
      );
      return Promise.reject({ results: [] });
    }
  }

  private readonly indexSeparator = '-index__';

  private getTypeFromIndex(index: string) {
    return index
      .substring(this.indexPrefix.length)
      .split(this.indexSeparator)[0];
  }

  private constructSearchAlias(type: string) {
    const postFix = this.aliasPostfix ? `__${this.aliasPostfix}` : '';
    return `${this.indexPrefix}${type}${postFix}`;
  }
}

export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }

  return {
    page: Number(Buffer.from(pageCursor, 'base64').toString('utf-8')),
  };
}

export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}

async function createElasticSearchClientOptions(
  config?: Config,
): Promise<ElasticSearchClientOptions> {
  if (!config) {
    throw new Error('No elastic search config found');
  }
  const clientOptionsConfig = config.getOptionalConfig('clientOptions');
  const sslConfig = clientOptionsConfig?.getOptionalConfig('ssl');

  if (config.getOptionalString('provider') === 'elastic') {
    const authConfig = config.getConfig('auth');
    return {
      provider: 'elastic',
      cloud: {
        id: config.getString('cloudId'),
      },
      auth: {
        username: authConfig.getString('username'),
        password: authConfig.getString('password'),
      },
      ...(sslConfig
        ? {
            ssl: {
              rejectUnauthorized:
                sslConfig?.getOptionalBoolean('rejectUnauthorized'),
            },
          }
        : {}),
    };
  }
  if (config.getOptionalString('provider') === 'aws') {
    const awsCredentials = await awsGetCredentials();
    const AWSConnection = createAWSConnection(awsCredentials);
    return {
      provider: 'aws',
      node: config.getString('node'),
      ...AWSConnection,
      ...(sslConfig
        ? {
            ssl: {
              rejectUnauthorized:
                sslConfig?.getOptionalBoolean('rejectUnauthorized'),
            },
          }
        : {}),
    };
  }
  const authConfig = config.getOptionalConfig('auth');
  const auth =
    authConfig &&
    (authConfig.has('apiKey')
      ? {
          apiKey: authConfig.getString('apiKey'),
        }
      : {
          username: authConfig.getString('username'),
          password: authConfig.getString('password'),
        });
  return {
    node: config.getString('node'),
    auth,
    ...(sslConfig
      ? {
          ssl: {
            rejectUnauthorized:
              sslConfig?.getOptionalBoolean('rejectUnauthorized'),
          },
        }
      : {}),
  };
}
