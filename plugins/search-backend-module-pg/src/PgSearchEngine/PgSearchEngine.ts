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

import { SearchEngine } from '@backstage/plugin-search-backend-node';
import {
  SearchQuery,
  IndexableResultSet,
  IndexableResult,
} from '@backstage/plugin-search-common';
import { PgSearchEngineIndexer } from './PgSearchEngineIndexer';
import {
  DatabaseDocumentStore,
  DatabaseStore,
  PgSearchQuery,
} from '../database';
import { v4 as uuid } from 'uuid';
import { Config } from '@backstage/config';
import { DatabaseService, LoggerService } from '@backstage/backend-plugin-api';

/**
 * Search query that the Postgres search engine understands.
 * @public
 */
export type ConcretePgSearchQuery = {
  pgQuery: PgSearchQuery;
  pageSize: number;
};

/**
 * Options available for the Postgres specific query translator.
 * @public
 */
export type PgSearchQueryTranslatorOptions = {
  highlightOptions: PgSearchHighlightOptions;
  normalization?: number;
};

/**
 * Postgres specific query translator.
 * @public
 */
export type PgSearchQueryTranslator = (
  query: SearchQuery,
  options: PgSearchQueryTranslatorOptions,
) => ConcretePgSearchQuery;

/**
 * Options to instantiate PgSearchEngine
 * @public
 */
export type PgSearchOptions = {
  database: DatabaseService;
  logger?: LoggerService;
};

/**
 * Options for highlighting search terms
 * @public
 */
export type PgSearchHighlightOptions = {
  useHighlight?: boolean;
  maxWords?: number;
  minWords?: number;
  shortWord?: number;
  highlightAll?: boolean;
  maxFragments?: number;
  fragmentDelimiter?: string;
  preTag: string;
  postTag: string;
};

/** @public */
export class PgSearchEngine implements SearchEngine {
  private readonly logger?: LoggerService;
  private readonly highlightOptions: PgSearchHighlightOptions;
  private readonly indexerBatchSize: number;
  private readonly normalization: number;

  /**
   * @deprecated This will be marked as private in a future release, please us fromConfig instead
   */
  constructor(
    private readonly databaseStore: DatabaseStore,
    config: Config,
    logger?: LoggerService,
  ) {
    const uuidTag = uuid();
    const highlightConfig = config.getOptionalConfig(
      'search.pg.highlightOptions',
    );

    const highlightOptions: PgSearchHighlightOptions = {
      preTag: `<${uuidTag}>`,
      postTag: `</${uuidTag}>`,
      useHighlight: highlightConfig?.getOptionalBoolean('useHighlight') ?? true,
      maxWords: highlightConfig?.getOptionalNumber('maxWords') ?? 35,
      minWords: highlightConfig?.getOptionalNumber('minWords') ?? 15,
      shortWord: highlightConfig?.getOptionalNumber('shortWord') ?? 3,
      highlightAll:
        highlightConfig?.getOptionalBoolean('highlightAll') ?? false,
      maxFragments: highlightConfig?.getOptionalNumber('maxFragments') ?? 0,
      fragmentDelimiter:
        highlightConfig?.getOptionalString('fragmentDelimiter') ?? ' ... ',
    };
    this.highlightOptions = highlightOptions;
    this.indexerBatchSize =
      config.getOptionalNumber('search.pg.indexerBatchSize') ?? 1000;

    this.normalization = this.getNormalizationValue(config);
    this.logger = logger;
  }

  private getNormalizationValue(config: Config) {
    const normalizationConfig =
      config.getOptional('search.pg.normalization') ?? 0;
    if (typeof normalizationConfig === 'number') {
      return normalizationConfig;
    } else if (typeof normalizationConfig === 'string') {
      return this.evaluateBitwiseOrExpression(normalizationConfig);
    }
    this.logger?.error(
      `Unknown normalization configuration: ${normalizationConfig}`,
    );

    return 0;
  }

  private evaluateBitwiseOrExpression(expression: string) {
    const tokens = expression.split('|').map(token => token.trim());

    const numbers = tokens.map(token => {
      const num = parseInt(token, 10);
      if (isNaN(num)) {
        this.logger?.error(
          `Unknown expression for normalization: ${expression}`,
        );
        return 0;
      }
      return num;
    });
    return numbers.reduce((acc, num) => acc | num, 0);
  }

  /**
   * @deprecated This will be removed in a future release, please use fromConfig instead
   */
  static async from(options: {
    database: DatabaseService;
    config: Config;
    logger?: LoggerService;
  }): Promise<PgSearchEngine> {
    return new PgSearchEngine(
      await DatabaseDocumentStore.create(options.database),
      options.config,
      options.logger,
    );
  }

  static async fromConfig(config: Config, options: PgSearchOptions) {
    return new PgSearchEngine(
      await DatabaseDocumentStore.create(options.database),
      config,
      options.logger,
    );
  }

  static async supported(database: DatabaseService): Promise<boolean> {
    return await DatabaseDocumentStore.supported(await database.getClient());
  }

  translator(
    query: SearchQuery,
    options: PgSearchQueryTranslatorOptions,
  ): ConcretePgSearchQuery {
    const pageSize = query.pageLimit || 25;
    const { page } = decodePageCursor(query.pageCursor);
    const offset = page * pageSize;
    // We request more result to know whether there is another page
    const limit = pageSize + 1;
    const normalization = options.normalization || 0;

    return {
      pgQuery: {
        pgTerm: query.term
          .split(/\s/)
          .map(p => p.replace(/[\0()|&:*!]/g, '').trim())
          .filter(p => p !== '')
          .map(p => `(${JSON.stringify(p)} | ${JSON.stringify(p)}:*)`)
          .join('&'),
        fields: query.filters as Record<string, string | string[]>,
        types: query.types,
        offset,
        limit,
        normalization,
        options: options.highlightOptions,
      },
      pageSize,
    };
  }

  setTranslator(translator: PgSearchQueryTranslator) {
    this.translator = translator;
  }

  async getIndexer(type: string) {
    return new PgSearchEngineIndexer({
      batchSize: this.indexerBatchSize,
      type,
      databaseStore: this.databaseStore,
      logger: this.logger?.child({ documentType: type }),
    });
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { pgQuery, pageSize } = this.translator(query, {
      highlightOptions: this.highlightOptions,
      normalization: this.normalization,
    });

    const rows = await this.databaseStore.transaction(async tx =>
      this.databaseStore.query(tx, pgQuery),
    );

    // We requested one result more than the page size to know whether there is
    // another page.
    const { page } = decodePageCursor(query.pageCursor);
    const hasNextPage = rows.length > pageSize;
    const hasPreviousPage = page > 0;
    const pageRows = rows.slice(0, pageSize);
    const nextPageCursor = hasNextPage
      ? encodePageCursor({ page: page + 1 })
      : undefined;
    const previousPageCursor = hasPreviousPage
      ? encodePageCursor({ page: page - 1 })
      : undefined;

    const results = pageRows.map(
      ({ type, document, highlight }, index): IndexableResult => ({
        type,
        document,
        rank: page * pageSize + index + 1,
        highlight: {
          preTag: pgQuery.options.preTag,
          postTag: pgQuery.options.postTag,
          fields: highlight
            ? {
                text: highlight.text,
                title: highlight.title,
                location: highlight.location,
                path: '',
              }
            : {},
        },
      }),
    );

    return { results, nextPageCursor, previousPageCursor };
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
