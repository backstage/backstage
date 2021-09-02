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
  SearchEngine,
  SearchQuery,
  SearchResultSet,
} from '@backstage/search-common';
import { Client } from '@elastic/elasticsearch';
import esb from 'elastic-builder';
import { isEmpty, isNaN as nan, isNumber } from 'lodash';
import { Logger } from 'winston';

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

function duration(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}

function isBlank(str: string) {
  return (isEmpty(str) && !isNumber(str)) || nan(str);
}

export class ElasticSearchSearchEngine implements SearchEngine {
  constructor(
    private readonly elasticSearchClient: Client,
    private readonly aliasPostfix: string,
    private readonly indexPrefix: string,
    private readonly logger: Logger,
  ) {}

  static async fromConfig({
    logger,
    config,
    aliasPostfix = `search`,
    indexPrefix = ``,
  }: ElasticSearchOptions) {
    return new ElasticSearchSearchEngine(
      await ElasticSearchSearchEngine.constructElasticSearchClient(
        logger,
        config.getConfig('search.elasticsearch'),
      ),
      aliasPostfix,
      indexPrefix,
      logger,
    );
  }

  private static async constructElasticSearchClient(
    logger: Logger,
    config?: Config,
  ) {
    if (!config) {
      throw new Error('No elastic search config found');
    }

    if (config.getOptionalString('provider') === 'elastic') {
      logger.info('Initializing Elastic.co ElasticSearch search engine.');
      const authConfig = config.getConfig('auth');
      return new Client({
        cloud: {
          id: config.getString('cloudId'),
        },
        auth: {
          username: authConfig.getString('username'),
          password: authConfig.getString('password'),
        },
      });
    }
    if (config.getOptionalString('provider') === 'aws') {
      logger.info('Initializing AWS ElasticSearch search engine.');
      const awsCredentials = await awsGetCredentials();
      const AWSConnection = createAWSConnection(awsCredentials);
      return new Client({
        node: config.getString('node'),
        ...AWSConnection,
      });
    }
    logger.info('Initializing ElasticSearch search engine.');
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
    return new Client({
      node: config.getString('node'),
      auth,
    });
  }

  protected translator({
    term,
    filters = {},
    types,
    pageCursor,
  }: SearchQuery): ConcreteElasticSearchQuery {
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
    const query = isBlank(term)
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
        .query(esb.boolQuery().filter(filter).must([query]))
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

  async index(type: string, documents: IndexableDocument[]): Promise<void> {
    this.logger.info(
      `Started indexing ${documents.length} documents for index ${type}`,
    );
    const startTimestamp = process.hrtime();
    const alias = this.constructSearchAlias(type);
    const index = this.constructIndexName(type, `${Date.now()}`);
    try {
      const aliases = await this.elasticSearchClient.cat.aliases({
        format: 'json',
        name: alias,
      });
      const removableIndices = aliases.body.map(
        (r: Record<string, any>) => r.index,
      );

      await this.elasticSearchClient.indices.create({
        index,
      });
      const result = await this.elasticSearchClient.helpers.bulk({
        datasource: documents,
        onDocument() {
          return {
            index: { _index: index },
          };
        },
        refreshOnCompletion: index,
      });

      this.logger.info(
        `Indexing completed for index ${type} in ${duration(startTimestamp)}`,
        result,
      );
      await this.elasticSearchClient.indices.updateAliases({
        body: {
          actions: [
            { remove: { index: this.constructIndexName(type, '*'), alias } },
            { add: { index, alias } },
          ],
        },
      });

      this.logger.info('Removing stale search indices', removableIndices);
      if (removableIndices.length) {
        await this.elasticSearchClient.indices.delete({
          index: removableIndices,
        });
      }
    } catch (e) {
      this.logger.error(`Failed to index documents for type ${type}`, e);
      const response = await this.elasticSearchClient.indices.exists({
        index,
      });
      const indexCreated = response.body;
      if (indexCreated) {
        this.logger.info(`Removing created index ${index}`);
        await this.elasticSearchClient.indices.delete({
          index,
        });
      }
    }
  }

  async query(query: SearchQuery): Promise<SearchResultSet> {
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

  private constructIndexName(type: string, postFix: string) {
    return `${this.indexPrefix}${type}${this.indexSeparator}${postFix}`;
  }

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
